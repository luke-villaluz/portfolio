/**
 * Turns src/assets/photos/<Album Name>/*.jpg into a web-ready photo gallery.
 *
 * Runs automatically before `npm run dev` and `npm run build` (see the
 * "predev" / "prebuild" scripts in package.json), so the only thing you ever
 * do is drop a folder of photos in and commit it.
 *
 * For every image it finds it:
 *   1. resizes to a fixed PIXEL HEIGHT, leaving width to the photo's own
 *      aspect ratio — so a portrait crop and a wide panorama sit in the same
 *      row at the same height without either being cropped,
 *   2. re-encodes as WebP into src/assets/photos-optimized/ (gitignored),
 *   3. records its final width/height in a generated manifest, so the page can
 *      reserve the right space before the photo loads and the row never jumps.
 *
 * Both outputs are gitignored: they're derived files, rebuilt from the
 * originals on every machine and in CI. Only your originals are committed.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = path.join(ROOT, 'src/assets/photos')
const OUTPUT_DIR = path.join(ROOT, 'src/assets/photos-optimized')
const MANIFEST = path.join(ROOT, 'src/data/photoAlbums.generated.js')

/** Every photo is rendered at the same height; see --photo-height in Photos.css.
 *  Exported at 2.4x that so it stays sharp on a retina screen. */
const OUTPUT_HEIGHT = 720
const QUALITY = 80
const IMAGE_RE = /\.(jpe?g|png|webp|tiff?|avif)$/i

/**
 * "01-gifford pinchot forest" -> "Gifford Pinchot Forest".
 *
 * A leading number is an ordering hint and is stripped from the display name,
 * so you can force album order with 01-, 02- … without it showing on the page.
 * A folder that already has capitals is left alone, so deliberate casing
 * ("Palouse", "SLO", "McCall") survives.
 */
function albumNameFromFolder(folder) {
  const withoutOrder = folder.replace(/^\d+[\s._-]+/, '')
  const spaced = withoutOrder.replace(/[_-]+/g, ' ').trim()
  if (/[A-Z]/.test(spaced)) return spaced
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase())
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Skip work when the optimized file is already newer than its original. */
async function isUpToDate(sourcePath, outputPath) {
  try {
    const [source, output] = await Promise.all([fs.stat(sourcePath), fs.stat(outputPath)])
    return output.mtimeMs >= source.mtimeMs
  } catch {
    return false
  }
}

async function listAlbumFolders() {
  try {
    const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b))
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function processAlbum(folder) {
  const files = (await fs.readdir(path.join(SOURCE_DIR, folder)))
    .filter((f) => IMAGE_RE.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const outputAlbumDir = path.join(OUTPUT_DIR, folder)
  await fs.mkdir(outputAlbumDir, { recursive: true })

  const photos = []
  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, folder, file)
    const outputName = `${path.basename(file, path.extname(file))}.webp`
    const outputPath = path.join(outputAlbumDir, outputName)

    let meta
    if (await isUpToDate(sourcePath, outputPath)) {
      meta = await sharp(outputPath).metadata()
    } else {
      // withoutEnlargement: a photo already shorter than OUTPUT_HEIGHT is left
      // at its own size rather than being upscaled into a blurry mess.
      const info = await sharp(sourcePath)
        .rotate() // honour EXIF orientation before we drop the metadata
        .resize({ height: OUTPUT_HEIGHT, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath)
      meta = { width: info.width, height: info.height }
      process.stdout.write(`  + ${folder}/${outputName} (${info.width}x${info.height})\n`)
    }

    photos.push({
      importName: `p${createHash('sha1').update(`${folder}/${file}`).digest('hex').slice(0, 10)}`,
      importPath: `../assets/photos-optimized/${folder}/${outputName}`,
      width: meta.width,
      height: meta.height,
    })
  }
  return { folder, photos }
}

/** Remove optimized files whose original has been deleted or renamed. */
async function pruneOrphans(albums) {
  const keep = new Set(
    albums.flatMap((a) => a.photos.map((p) => path.join(OUTPUT_DIR, p.importPath.split('/').slice(3).join('/')))),
  )
  let existing
  try {
    existing = await fs.readdir(OUTPUT_DIR, { withFileTypes: true, recursive: true })
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
  for (const entry of existing) {
    if (!entry.isFile()) continue
    const full = path.join(entry.parentPath ?? entry.path, entry.name)
    if (!keep.has(full)) {
      await fs.rm(full)
      process.stdout.write(`  - ${path.relative(OUTPUT_DIR, full)} (original gone)\n`)
    }
  }

  // drop album folders left empty by the above, e.g. after a trip is renamed
  for (const entry of await fs.readdir(OUTPUT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const dir = path.join(OUTPUT_DIR, entry.name)
    if ((await fs.readdir(dir)).length === 0) await fs.rmdir(dir)
  }
}

function renderManifest(albums) {
  const imports = albums
    .flatMap((a) => a.photos.map((p) => `import ${p.importName} from '${p.importPath}'`))
    .join('\n')

  const entries = albums
    .map((album) => {
      const name = albumNameFromFolder(album.folder)
      const photos = album.photos
        .map((p) => `      { src: ${p.importName}, width: ${p.width}, height: ${p.height} },`)
        .join('\n')
      return [
        '  {',
        `    slug: ${JSON.stringify(slugify(name))},`,
        `    name: ${JSON.stringify(name)},`,
        '    photos: [',
        photos,
        '    ],',
        '  },',
      ].join('\n')
    })
    .join('\n')

  return `// GENERATED FILE — do not edit, and do not commit it.
// Rebuilt from src/assets/photos/ by scripts/build-photos.mjs on every
// \`npm run dev\` and \`npm run build\`. To change what's here, add or remove a
// folder of photos in src/assets/photos/ — not this file.
${imports ? `\n${imports}\n` : ''}
export const ALBUMS = [
${entries}
]
`
}

async function main() {
  const folders = await listAlbumFolders()
  if (folders.length === 0) {
    process.stdout.write('photos: no albums in src/assets/photos/ yet\n')
  }

  const albums = []
  for (const folder of folders) {
    albums.push(await processAlbum(folder))
  }

  await pruneOrphans(albums)
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true })
  await fs.writeFile(MANIFEST, renderManifest(albums))

  const total = albums.reduce((n, a) => n + a.photos.length, 0)
  process.stdout.write(
    `photos: ${albums.length} album${albums.length === 1 ? '' : 's'}, ${total} photo${total === 1 ? '' : 's'}\n`,
  )
}

main().catch((err) => {
  process.stderr.write(`\nphotos: build failed — ${err.message}\n`)
  process.exit(1)
})
