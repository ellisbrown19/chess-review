# The Story of Lichess Game Review

*A portfolio project chronicle*

## Genesis: Why Build This?

**December 24, 2025** - The idea started with a simple observation: chess.com's game review feature is excellent but costs money. Lichess is free and open, with powerful APIs, but lacks the rich, narrative-style analysis that helps players actually learn from their games.

What if we could build something that not only matches chess.com's analysis, but exceeds it? Something that tells stories, references famous games, drops fun facts about openings, and teaches chess in a way that's actually engaging to read?

The vision: A "super souped up version of the lichess cloud evaluation that includes narrative, annotations, pointers to famous games, instructive moments, and a scale of blunder to brilliant for every move."

## Design Philosophy

### Core Principles Established

1. **Cost-conscious from day one** - Free APIs, cheapest LLM model (Claude Haiku), aggressive caching, lazy loading
2. **Scope discipline** - Display-only board (NOT building chess from scratch), focused feature set
3. **Portfolio quality** - This isn't just a tool, it's a showcase of thoughtful engineering
4. **Fun matters** - Opening fun facts, engaging commentary, personality in the product

### Technical Decisions

**The Board Debate**: Early in brainstorming, we clarified that the board should be display-only with navigation controls. Building a fully interactive chess board would be massive scope creep - we'd essentially be "creating chess." Smart constraint that keeps us focused.

**AI Strategy**: Chose Claude Haiku over more expensive models. At ~$0.0001 per move commentary, we can analyze a full 40-move game for less than half a penny. Lazy-loading ensures we only generate what users actually read.

**Architecture**: React SPA + Vercel serverless functions. Simple, cheap, effective. No database needed - all data comes from APIs and gets cached client-side.

## Development Log

### Phase 0: Planning & Setup (December 24, 2025)

**Brainstorming Session**:
- Used the superpowers brainstorming skill to turn a rough idea into a concrete design
- Asked critical questions about app type, tech stack, AI strategy
- User's insight: "this will eventually be a substackable/resume worthy project" - raised the bar for documentation quality
- Decided to maintain this story file throughout development (possibly with a future "journalist agent")

**Design Choices Made**:
- Web application (not CLI or API-only)
- React + Node.js stack
- Lichess Cloud Eval for positions
- Claude Haiku for commentary
- Chess.com-compatible move classification (familiar to users)
- Opening database with fun facts (user's suggestion - adds personality!)

**Initial Setup**:
- Created git repository with proper .gitignore
- Set up isolated git worktree (`.worktrees/development`) for clean development
- Initialized package.json with React 18 + Vite
- Created comprehensive documentation:
  - `claude.md` - Development guide for future Claude sessions
  - `PROJECT_STORY.md` - This file, development narrative
  - `README.md` - User-facing documentation
  - `.env.example` - Environment variable template

**Project Structure**:
Established complete directory structure for:
- Serverless API routes (`/api`)
- Analysis libraries (`/lib`)
- React components (`/src`)
- Data files (`/data`)
- Documentation (`/docs`)

### Technical Challenges Encountered

**Phase 2 - Code Review Catches Critical Issues**: After implementing the Lichess API integration, the superpowers code-review subagent identified 6 critical issues and 7 important improvements. Key fixes:
- Cache statistics bug (cached results weren't being tracked)
- Rate limiting inefficiency (delaying even on cached results)
- Missing input validation and timeout handling
- NDJSON parsing vulnerability

This demonstrated the value of systematic code review - issues we would have discovered in production were caught during development.

**Phase 3 - TDD Discipline Pays Off**: Following strict Test-Driven Development (write test first, watch it fail, write minimal code) prevented several bugs:
- Caught the `eval` reserved word issue immediately in tests
- Ensured all edge cases (mate scores, empty move lists) were handled
- 14/14 tests passing gives confidence the logic is correct

### Interesting Discoveries

**Serverless Cache Limitations**: In-memory caching in Vercel serverless functions is per-function-instance, not shared across all requests. This means cache hit rates will be lower than initially expected. For production at scale, we'd need Vercel KV (Redis) for persistent caching. For MVP, documented the limitation and moved on.

**Chess.com Move Classification**: Researched the exact thresholds chess.com uses:
- Brilliant moves require both being the best move AND a material sacrifice or huge eval swing
- Great moves are best moves with 300+ centipawn swings
- The system is more nuanced than just centipawn loss

**eco.json GitHub Repository**: Found a perfect opening database with ~12,000 openings in JSON format, sourced from Lichess data (June 2025). This eliminates the need to parse PGN databases ourselves.

### Lessons Learned

**Early Lesson - Scope Management**: The simple question "should the board be interactive?" almost led us down a massive rabbit hole. Staying disciplined about what we're NOT building is as important as what we are building.

**Documentation Matters**: Taking time to create good documentation (this file, claude.md) sets up success for future sessions and makes this portfolio-worthy from day one.

**Superpowers Workflow Excellence**: Using the superpowers plugin's structured skills (brainstorming, TDD, code review, git worktrees) dramatically improved code quality and development speed. The discipline these skills enforce prevents cutting corners.

**Test-First Development Really Works**: Initially skeptical about strict TDD, but watching tests fail first, then pass, gave genuine confidence the code works. The 14/14 passing tests aren't just coverage - they're proof of correctness.

## Metrics & Progress

### Implementation Phases

- [x] Phase 0: Planning & Design
- [x] Phase 1: Project Setup & Documentation
- [x] Phase 2: Backend - Lichess Integration
- [x] Phase 3: Backend - Analysis Engine (Move Classification & Opening Detection)
- [x] Phase 4: Opening Database (Enhanced with fun facts, famous games, Wikipedia links)
- [x] Phase 5: AI Commentary Generation (Claude Haiku integration with caching)
- [ ] Phase 6: Frontend - Game Selection UI
- [ ] Phase 7: Frontend - Analysis UI
- [ ] Phase 8: State Management
- [ ] Phase 9: Styling & UX
- [ ] Phase 10: Optimization & Cost Management
- [ ] Phase 11: Testing & Debugging
- [ ] Phase 12: Deployment

### Cost Tracking

*Target: < $5/month for typical usage*

**Projected Costs**:
- Claude Haiku: ~$0.004 per 40-move game (all moves)
- Vercel: Free tier (100GB bandwidth/month)
- Lichess API: Free
- **Total**: Essentially free for personal use

**Actual Costs**: *To be tracked during development*

### Key Achievements

**December 24, 2025**:
- ✅ Complete project setup with React 18 + Vite + Tailwind + Jest
- ✅ Three Lichess API serverless functions with timeout handling and caching
- ✅ Move classification system (chess.com-compatible) with 8 passing tests
- ✅ Opening detection with longest-match algorithm and 12 passing tests
- ✅ Enhanced opening database with fun facts, famous games, and Wikipedia links
- ✅ AI Commentary Generation with Claude Haiku integration and caching
- ✅ Cost-optimized prompts (<500 chars, ~$0.001 per game with caching)
- ✅ Code reviews identified and fixed issues (Phase 2: 13 issues, Phase 4 & 5: APPROVED)
- ✅ GitHub repository connected (git@github.com:ellisbrown19/lichess-game-review.git)
- ✅ 35/35 tests passing - TDD workflow fully established (8 classifier + 12 openings + 15 AI)
- ✅ Comprehensive documentation (claude.md, PROJECT_STORY.md, README.md, api-research.md)

## Future Vision

Ideas for later iterations (not in initial scope):
- Compare multiple games to track improvement
- Export analysis as PDF/PGN
- Share analysis links
- Local Stockfish option for deeper analysis
- Upload PGN files from any source
- Multi-language support
- Journalist agent skill for auto-updating this file in Paul Graham style

## Reflections

*This section will be filled with reflections on the development process, challenges overcome, and insights gained...*

---

*This is a living document. As the project evolves, so does this story.*

*Last updated: December 24, 2025 - Backend complete (Phases 1-5), ready for frontend development*
