# Vocabulary Learning and Quiz Application

A modern, interactive web application for learning and testing vocabulary skills. Built with React 19, TypeScript, and Vite for a fast, responsive user experience.

## Features

### Learning Modes

- **Flashcard Mode**: Flip through vocabulary cards to memorize words with their meanings and examples. Non-scoring mode focused on passive learning.
- **Multiple Choice (MCQ) Mode**: Test your knowledge with multiple-choice questions. Earn points for each correct answer, with your final score saved to the leaderboard.

### Scoring System

- MCQ mode tracks correct answers starting from 0
- One point awarded for each correct answer
- Final score automatically saved to the database via the insert_score API
- High score and leaderboard displayed on the home screen

### User Experience

- Player name input for MCQ mode (skipped for flashcards)
- Customizable question count selection
- Real-time feedback on answers (Correct/Try again)
- Progress tracking showing current question number
- Golden high score display with tabular layout
- Golden color label for better visual hierarchy
- Responsive design optimized for all screen sizes, including mobile (90% width on screens < 500px)
- Modern typography with Poppins and Inter fonts

## API Requirements

The application communicates with a backend API. Ensure the following endpoints are available:

### Endpoints

- `GET /` - Health check / server ping
- `GET /vocabs/read/` - Fetch all vocabulary items
- `GET /scores/high_score/` - Retrieve current high score
- `GET /scores/all_scores/` - Fetch all scores (for leaderboard)
- `POST /scores/insert_score/` - Save a new score

### Configuration

The API base URL is configured via environment variables:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Update the `.env` and `.env.development` files with your backend server URL.

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn package manager
- Backend API server running and accessible

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Vocabulary-Learning-and-Quiz
```

2. **Install dependencies**:
```bash
cd webapp
npm install
```

3. **Configure API endpoint**:
Edit `.env` or `.env.development` and set the correct API base URL:
```env
VITE_API_BASE_URL=http://your-backend-server:8000
```

### Running the Application

#### Development Mode

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

#### Build for Production

Create an optimized production build:

```bash
npm run build
```

Output files will be generated in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Project Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── HomeScreen.tsx           # Landing page with mode selection
│   │   ├── FlashcardScreen.tsx      # Flashcard learning interface
│   │   ├── QuizScreen.tsx           # MCQ quiz interface
│   │   ├── CompletionScreen.tsx     # Results and score display
│   │   ├── PlayerNameModal.tsx      # Name input modal
│   │   ├── QuestionCountModal.tsx   # Question count selector
│   │   ├── ProgressHeader.tsx       # Question progress display
│   │   ├── QuestionCard.tsx         # MCQ question display
│   │   ├── FeedbackToast.tsx        # Answer feedback notification
│   │   ├── PingGate.tsx             # Server health check gate
│   │   ├── PingError.tsx            # Connection error display
│   │   ├── FullscreenLoader.tsx     # Loading spinner
│   │   └── GameShell.tsx            # Main app orchestrator
│   ├── services/
│   │   ├── pingServer.ts            # Health check API call
│   │   ├── fetchVocabs.ts           # Vocabulary data fetch
│   │   ├── fetchHighScore.ts        # High score retrieval
│   │   ├── fetchScores.ts           # All scores retrieval
│   │   ├── insertScore.ts           # Score submission
│   │   ├── types.ts                 # Shared types and API config
│   │   └── index.ts                 # Service exports
│   ├── config/
│   │   └── endpoints.json           # API endpoint paths
│   ├── index.scss                   # Global styles with design tokens
│   ├── main.tsx                     # Application entry point
│   └── App.tsx                      # Root component
├── .env                             # Environment variables
├── .env.development                 # Development environment variables
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.3.1
- **Styling**: SCSS with CSS custom properties (design tokens)
- **HTTP Client**: Axios
- **Type Safety**: TypeScript strict mode

## Development

### Code Quality

The project uses TypeScript for type safety and includes comprehensive component structures with proper interfaces.

### Styling

Global styles are defined in `index.scss` with:
- CSS custom properties for consistent theming
- Responsive design patterns
- Mobile-first approach
- Accessibility considerations

### Component Architecture

Components are organized by responsibility:
- Screen components handle navigation and state management
- Modal components manage user input
- Display components are presentation-focused
- Service modules handle API communication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Troubleshooting

### API Connection Issues

- Verify the backend server is running
- Check that `VITE_API_BASE_URL` matches your backend URL
- Look for CORS configuration issues if requests are blocked
- Console will show connection errors with the attempted base URL

### Blank Pages

- Ensure vocabulary data is available from the backend
- Check browser console for error messages
- Verify API endpoints are returning proper JSON responses

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Vocabulary Learning and Quiz application suite.
