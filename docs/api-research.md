# Public Chess APIs and Resources Research

Research conducted: December 24, 2025

## Opening Databases

### ⭐ Primary Choice: eco.json (GitHub)
- **Repository**: [hayatbiralem/eco.json](https://github.com/hayatbiralem/eco.json)
- **Format**: JSON (perfect for our use case!)
- **Content**: ~12,000 chess openings with ECO codes
- **Data includes**: ECO codes, move sequences, English names
- **Source**: Lichess data (June 2025)
- **License**: Open source
- **Status**: Up-to-date, actively maintained

### Alternative Sources
- [Lichess Database](https://database.lichess.org/) - Position evaluations in JSON format
- [Lumbras Gigabase](https://lumbrasgigabase.com/en/) - Opening books with ECO/NIC codes (Scid/PGN format)

**Decision**: Use eco.json from GitHub - it's exactly what we need in the right format.

## Famous Games Databases

### Available Resources

1. **[Lichess Open Database](https://database.lichess.org/)**
   - 7.2+ billion games in PGN format
   - 905,268 official broadcast games
   - CC BY-SA 4.0 license
   - Updated continuously

2. **[PGN Mentor](https://www.pgnmentor.com/)**
   - 1+ million Grandmaster games
   - Free download
   - Hundreds of thousands of master games

3. **[Lumbras Gigabase](https://lumbrasgigabase.com/en/)**
   - Monthly updates (first Tuesday)
   - Historical to current games
   - SCID or PGN format

4. **[Chessabc Base](https://www.chessabc.com/en/chessabc-base)**
   - 5+ million games (through 2023)
   - MillionBase, KingBase, TWIC included
   - Free download

5. **[The Week in Chess (TWIC)](https://theweekinchess.com/twic)**
   - Weekly updates every Monday
   - Latest tournaments and games
   - Issue 1623 (Dec 15, 2025) available

**Decision**: For MVP, we'll manually curate 20-30 famous games per popular opening rather than importing millions of games. This keeps it simple and focused on quality over quantity.

## Move Classification Systems

### Chess.com Classification (Our Target)

Based on Centipawn Loss (CPL) from best move:

- **Brilliant**: Best move + (material sacrifice OR creates 1.5+ pawn swing OR surprising tactical shot)
- **Great**: Best move in critical position
- **Best**: Top engine move (0 CPL)
- **Good**: 0-50 CPL
- **Inaccuracy**: 50-100 CPL
- **Mistake**: 100-200 CPL
- **Blunder**: 200+ CPL

**Sources**:
- [Chess.com Help Center - Move Classifications](https://support.chess.com/en/articles/8572705-how-are-moves-classified-what-is-a-blunder-or-brilliant-etc)
- [Brilliant Move Criteria Explained](https://christophegaron.com/articles/mind/how-does-chess-com-define-a-brilliant-move-criteria-explained/)
- [ChessBase Centipawn Analysis](https://en.chessbase.com/post/centipawn-analysis-evaluating-strength-with-an-engine)

### No Pre-Built Library Found

No existing JavaScript/Node.js library for move classification was found. We'll implement this ourselves - it's straightforward logic based on evaluation differences.

## Chess Libraries (Already Using)

- **chess.js**: Move validation, PGN parsing, FEN generation
- **react-chessboard**: Display-only board component

## API Integration Summary

### What We'll Use

1. **Lichess API** (Free)
   - Game data retrieval
   - User game history
   - No API key needed for basic usage
   - Rate limit: 15 req/sec

2. **Lichess Cloud Eval API** (Free)
   - Position evaluations
   - Cached positions = instant
   - MultiPV for alternative moves
   - Rate limited (be respectful)

3. **eco.json from GitHub**
   - Download and include in `/data/openings.json`
   - Static file, no API calls needed

4. **Anthropic Claude Haiku**
   - AI commentary generation
   - Cheapest model available
   - API key required

### What We Won't Use (For MVP)

- Massive PGN game databases (too complex for MVP)
- Local Stockfish (Cloud Eval sufficient)
- Pre-built classification libraries (none exist, we'll build it)

## Implementation Notes

- Keep opening database simple: 20-30 popular openings with curated fun facts
- Famous games: 1-3 per opening, manually selected for instructiveness
- Move classification: Implement ourselves based on Chess.com thresholds
- Cost optimization: Aggressive caching, lazy loading

## Sources

Opening Databases:
- [eco.json GitHub Repository](https://github.com/hayatbiralem/eco.json)
- [Lichess Open Database](https://database.lichess.org/)
- [Lumbras Gigabase](https://lumbrasgigabase.com/en/)

Famous Games:
- [PGN Mentor](https://www.pgnmentor.com/)
- [Chessabc Base](https://www.chessabc.com/en/chessabc-base)
- [The Week in Chess](https://theweekinchess.com/twic)

Move Classification:
- [Chess.com Move Classifications](https://support.chess.com/en/articles/8572705-how-are-moves-classified-what-is-a-blunder-or-brilliant-etc)
- [ChessBase Centipawn Analysis](https://en.chessbase.com/post/centipawn-analysis-evaluating-strength-with-an-engine)
- [Brilliant Move Criteria](https://christophegaron.com/articles/mind/how-does-chess-com-define-a-brilliant-move-criteria-explained/)

---

*Research complete. Ready to implement Phase 2: Lichess Integration.*
