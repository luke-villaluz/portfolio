// Work page content. Edit everything here.
// `blurb` supports line breaks with \n (rendered as separate lines).

export const EXPERIENCE = [
  {
    company: 'Logitech',
    role: 'AI Analyst · Internship',
    period: 'Jun 2026 – Present',
    bullets: ["Currently working on a project I'm not able to legally disclose"],
  },
  {
    company: 'Xponance',
    role: 'Agentic AI Engineer · Internship',
    period: 'Jun 2025 – Aug 2025',
    bullets: [
      'Created a program to conduct a comprehensive legal entity name-change analysis across 250+ contracts, automating reviews and saving over 400 hours of manual work',
      'Delivered weekly demos for executives, documentation, and cross-department collaboration for integrating AI workflows into compliance and research operations',
      'Created the Excel Agent Framework (see Projects below)',
    ],
  },
  {
    company: 'Wave: Ripples to World Tides',
    role: 'Product Manager',
    period: 'Mar 2026 – Present',
    bullets: [
      'Re-organized the iOS app codebase to improve structure and maintainability',
      "Restructured the team's workflow to run more effectively in agile sprints",
      'Implemented a ticketing system to track tasks and streamline development',
      {
        text: 'View on the App Store',
        url: 'https://apps.apple.com/us/app/wave-ripples-to-world-tides/id6749574718',
      },
    ],
  },
  {
    company: 'Photographer',
    role: 'Freelance',
    period: 'Sep 2024 – Present',
    blurb: 'Photography/Videography and Editing for:',
    bullets: [
      'NCAA Division 1 California Polytechnic Wrestling Team',
      'Sol Arc SLO shows and media',
      'Grads',
      { text: 'View on Instagram', url: 'https://www.instagram.com/villaloose/' },
    ],
  },
  {
    company: 'NCAA',
    role: 'Student Athlete · Wrestling',
    period: 'Sep 2022 – Apr 2025',
    bullets: [
      'Managed 20+ hours a week of training and weight cuts on top of a full engineering courseload',
      'Member of the Pac-12 Championship team (2023)',
    ],
  },
]

export const PROJECTS = [
  {
    name: 'Excel Agent Framework (for Xponance)',
    bullets: [
      'Created a Retrieval-Augmented Generation (RAG) system supporting both local LLMs (Ollama) and external APIs (OpenAI, Azure) for flexible, secure deployments',
      'Integrated Tesseract OCR, recursive directory parsing, and adaptive JSON-to-Excel pipelines for automated structured report generation',
      'Designed for 95% reusability and 5% prompt customization, enabling rapid scaling across manager research, CRM, and HR use cases at Xponance where it is still being used',
    ],
  },
  {
    name: 'BackRoads',
    bullets: [
      'Developed a custom A*-based pathfinding algorithm leveraging OpenStreetMap data to generate scenic, user-biased routes',
      'Designed a weighted scoring model incorporating road class, urban density, elevation, and environmental features',
      'Built backend APIs in FastAPI exposing route computation endpoints for future React-based map visualization',
      { text: 'View on GitHub', url: 'https://github.com/luke-villaluz/BackRoads' },
    ],
  },
  {
    name: 'Wrapped on Demand',
    bullets: [
      'Drove sprints for a 5-person agile team to build a full-stack analytics app delivering personalized “Spotify Wrapped” insights on demand',
      'Implemented Spotify OAuth for secure user authentication and integrated REST endpoints for data retrieval and aggregation',
      'Built modular, responsive React components and Tailwind styling for dynamic charts and genre visualization',
      { text: 'View on GitHub', url: 'https://github.com/nathanlim1/WrappedOnDemand' },
    ],
  },
]
