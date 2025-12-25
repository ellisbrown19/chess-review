# Lichess Game Review

A comprehensive chess game analysis web application that rivals chess.com's paid game review feature, powered by the free Lichess API and AI-generated commentary.

## Features

- **Move-by-move Classification**: Every move rated from Brilliant to Blunder using chess.com's system
- **AI Commentary**: Instructive, narrative annotations powered by Claude Haiku
- **Opening Insights**: Opening database with famous games and fun facts
- **Evaluation Graphs**: Visual representation of advantage throughout the game
- **Interactive Navigation**: Step through games with keyboard shortcuts
- **Cost-Effective**: < $5/month for typical usage, all built on free tiers

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js serverless functions (Vercel)
- **Chess Engine**: Lichess Cloud Eval API
- **AI**: Claude Haiku (Anthropic)
- **Deployment**: Vercel free tier

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Optional: Lichess API token for higher rate limits

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ellisbrown19/chess-review.git
cd chess-review
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

1. Enter a Lichess username to browse recent games, or paste a game URL/ID
2. Select a game to analyze
3. Navigate through moves using arrow keys or controls
4. Click "Generate Commentary" on interesting moves for AI insights
5. Explore opening information and famous game references

## Development

### Project Structure

```
lichess-game-review/
├── api/              # Vercel serverless functions
├── lib/              # Backend utilities (analysis, AI)
├── src/              # React frontend
│   ├── pages/        # Route pages
│   ├── components/   # React components
│   ├── context/      # State management
│   └── api/          # Frontend API client
├── data/             # Opening database
└── docs/             # Documentation
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Documentation

- `claude.md` - Development guide for Claude Code sessions
- `PROJECT_STORY.md` - Development journey and portfolio narrative
- `/docs/api-research.md` - Public chess API research

## Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Push your code to GitHub
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   In the Vercel project settings, add:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
   - `VITE_LICHESS_API_TOKEN` - Optional, for higher rate limits

3. **Deploy**:
   - Vercel auto-deploys from your main branch
   - Or use CLI: `vercel --prod`

4. **Verify Deployment**:
   - Test the live URL
   - Check serverless functions work
   - Verify AI commentary generation

The app will be live on Vercel's free tier with 100GB bandwidth/month.

### Manual Deployment (CLI)

If you prefer using the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add ANTHROPIC_API_KEY
```

## Cost Breakdown

- **Claude Haiku API**: ~$0.004 per 40-move game (if generating all moves)
- **Vercel**: Free tier (100GB bandwidth)
- **Lichess API**: Free
- **Total**: Essentially free for personal use, < $5/month for moderate traffic

## Contributing

This is a portfolio project, but suggestions and issues are welcome!

## License

MIT

## Acknowledgments

- [Lichess](https://lichess.org) for the excellent free API
- [Anthropic](https://anthropic.com) for Claude AI
- Chess.com for inspiration on move classification

---

**Status**: 🚧 In Active Development

Built with ♟️ by Ellis Brown
