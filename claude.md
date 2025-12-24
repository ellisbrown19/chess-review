# Lichess Game Review - Claude Development Guide

## Project Overview

A comprehensive chess game analysis web application that provides rich, instructive commentary on chess games from Lichess. The goal is to rival and exceed chess.com's paid game review feature using free APIs and cost-effective AI.

**Status**: In active development
**Started**: December 24, 2025
**Target**: Portfolio/Substack-worthy project

## Vision

Provide rich, instructive chess game analysis with:
- Move-by-move classification (Brilliant → Blunder scale, chess.com compatible)
- AI-generated narrative commentary with teaching moments
- Opening database with famous games and fun facts
- Interactive board display with evaluation graphs
- Minimal operational costs (< $5/month)

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js serverless functions (Vercel)
- **Chess Engine**: Lichess Cloud Eval API (free)
- **AI Commentary**: Claude Haiku (Anthropic - cheapest model)
- **Deployment**: Vercel free tier
- **Chess Libraries**: chess.js, react-chessboard

### Key Design Decisions

1. **Board is display-only** - NOT interactive chess play, just navigation through game moves
2. **Lazy-load AI commentary** - Generate on-demand to minimize API costs
3. **Aggressive caching** - Cache evaluations and commentary to reduce API calls
4. **Free-tier everything** - No paid subscriptions or services
5. **Opening DB only** - Match openings to famous games, not full position matching
6. **Chess.com classification system** - Familiar move ratings for users

### Cost Optimization Strategy

- Claude Haiku: ~$0.0001 per move commentary
- Target: ~$0.004 per 40-move game (if generating all moves)
- Strategy: Only generate for moves user actually views
- Default: Auto-generate only for key moments (blunders, brilliants)
- User option: "Generate All" with cost estimate

## Project Structure

```
lichess-game-review/
├── claude.md                    # This file - development guide
├── PROJECT_STORY.md             # Development log (update regularly!)
├── README.md                    # User-facing README
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                  # Vercel deployment config
├── .env.example
├── docs/
│   └── api-research.md          # Public chess API research findings
├── data/
│   └── openings.json            # Opening database with fun facts
├── api/                         # Vercel serverless functions
│   ├── lichess/
│   │   ├── games.js            # GET /api/lichess/games?username=X
│   │   ├── game.js             # GET /api/lichess/game?id=X
│   │   └── evaluate.js         # POST /api/lichess/evaluate (batch FENs)
│   ├── analyze.js              # POST /api/analyze (full game analysis)
│   └── commentary.js           # POST /api/commentary (AI generation)
├── lib/
│   ├── analysis/
│   │   ├── classifier.js       # Move classification logic
│   │   └── openings.js         # Opening detection
│   └── ai/
│       ├── prompts.js          # Claude prompt templates
│       └── commentary.js       # Claude API integration
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Router setup
│   ├── pages/
│   │   ├── Home.jsx            # Game selection page
│   │   └── Analysis.jsx        # Analysis view page
│   ├── components/
│   │   ├── Board.jsx           # Chess board display
│   │   ├── Controls.jsx        # Move navigation controls
│   │   ├── AnalysisPanel.jsx   # Move info & commentary
│   │   ├── EvalGraph.jsx       # Evaluation chart
│   │   ├── MoveList.jsx        # Move list sidebar
│   │   ├── OpeningInfo.jsx     # Opening information
│   │   └── GameStats.jsx       # Game statistics summary
│   ├── context/
│   │   └── GameContext.jsx     # Game state management
│   ├── api/
│   │   └── lichess.js          # Frontend API client
│   └── styles/
│       └── index.css           # Global styles + Tailwind
└── public/
    └── index.html
```

## API Integration Details

### Lichess APIs (Free)

**Game Data**:
- `GET https://lichess.org/api/user/{username}/games` - Recent games
- `GET https://lichess.org/game/export/{gameId}?pgnInJson=true` - Single game with PGN
- No API key required for basic usage
- Rate limits: 15 requests/sec (generous for our use case)

**Cloud Eval**:
- `GET https://lichess.org/api/cloud-eval?fen={fen}&multiPv=3` - Position evaluation
- Returns: evaluation, best moves, principal variations
- Cached positions = instant response
- Rate limits: Be respectful, implement backoff

### Anthropic Claude API

**Model**: Claude Haiku (`claude-haiku-20240307`)
- Cheapest model (~80% cheaper than Sonnet)
- Still excellent for instructive chess commentary
- API key required (VITE_ANTHROPIC_API_KEY)

**Usage Pattern**:
- On-demand generation per move
- Cache by position hash
- Prompt engineering to minimize tokens
- Target: <100 tokens per move

## Common Development Tasks

### Start Development Server
```bash
cd /Users/ellisbrown/lichess-game-review/.worktrees/development
npm run dev
```

### Run Vercel Functions Locally
```bash
vercel dev
```

### Build for Production
```bash
npm run build
vercel --prod
```

### Update PROJECT_STORY.md
**IMPORTANT**: Update PROJECT_STORY.md regularly as you build features! This is a portfolio piece.
Document challenges, solutions, and interesting discoveries.

### Git Worktrees
- **Development worktree**: `.worktrees/development`
- **Branch**: `feature/development`
- When done: Use `superpowers:finishing-a-development-branch`

## Important Constraints

1. **No significant costs** - Keep monthly spend < $5
2. **Free-tier only** - No paid subscriptions
3. **Simple scope** - Display-only board (not interactive chess)
4. **Portfolio quality** - Well-documented, clean code
5. **Substack-ready** - Maintain good story in PROJECT_STORY.md

## Move Classification System (Chess.com Compatible)

Based on centipawn loss from best move:

- **Brilliant**: Best move + (material sacrifice OR critical tactical shot)
- **Great**: Best move in critical position
- **Best**: Top engine move (0cp loss)
- **Good**: 0-50cp loss
- **Inaccuracy**: 50-100cp loss
- **Mistake**: 100-200cp loss
- **Blunder**: 200+ cp loss

## Testing Strategy

- Manual testing with real Lichess games
- Test edge cases: very short/long games, various openings
- Test error handling: invalid IDs, API failures
- Cost tracking: Monitor API usage

## Deployment

- **Platform**: Vercel
- **Free tier limits**: 100GB bandwidth/month, unlimited serverless invocations
- **Custom domain**: Optional
- **Environment variables**: Set in Vercel dashboard

## Future Enhancement Ideas

(Don't implement now, but document for later)

- Compare multiple games
- Track improvement over time
- Export analysis as PDF/PGN
- Share analysis links
- Local Stockfish option
- Uploaded PGN support
- Multi-language support

## Superpowers Skills to Use

Throughout this project:
- `superpowers:using-git-worktrees` - Already used for isolation
- `superpowers:verification-before-completion` - Before marking phases complete
- `superpowers:requesting-code-review` - Before major milestones
- `superpowers:finishing-a-development-branch` - When ready to merge
- **Future**: Consider creating a "journalist" skill for Paul Graham-style PROJECT_STORY.md updates

## Development Phases

See `/Users/ellisbrown/.claude/plans/tingly-questing-phoenix.md` for detailed implementation plan.

Current phase tracked in todo list - use TodoWrite to stay organized!

## Notes for Future Claude Sessions

- Always check PROJECT_STORY.md and update it with your work
- Cost consciousness is critical - always consider API usage
- Board is display-only, not interactive
- Focus on instructive commentary, not just evaluation numbers
- Fun facts and personality make this special
- Keep it simple - avoid over-engineering

## Repository Location

- **Main repo**: `/Users/ellisbrown/lichess-game-review/`
- **Development worktree**: `/Users/ellisbrown/lichess-game-review/.worktrees/development/`

---

*Last updated: 2025-12-24*
