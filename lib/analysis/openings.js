/**
 * Opening detection logic
 * Matches move sequences to opening database
 */

// Enhanced opening database with fun facts and famous games
// Will be expanded with full eco.json data later
const OPENINGS_DATABASE = [
  {
    eco: 'B20',
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
    wikiUrl: 'https://en.wikipedia.org/wiki/Sicilian_Defence',
    funFact: "The Sicilian Defense is the most popular response to 1.e4, favored by aggressive players seeking winning chances with Black. Bobby Fischer called it 'best by test.'",
    famousGames: [
      {
        white: 'Garry Kasparov',
        black: 'Veselin Topalov',
        year: 1999,
        result: '1-0',
        event: 'Wijk aan Zee',
        why: 'Known as "Kasparov\'s Immortal" - one of the greatest attacking games ever played'
      },
      {
        white: 'Bobby Fischer',
        black: 'Bent Larsen',
        year: 1958,
        result: '1-0',
        event: 'Portoroz Interzonal',
        why: 'Young Fischer\'s brilliant tactical masterpiece showcasing the Sicilian\'s attacking potential'
      }
    ]
  },
  {
    eco: 'C50',
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    wikiUrl: 'https://en.wikipedia.org/wiki/Italian_Game',
    funFact: "The Italian Game is one of the oldest recorded chess openings, dating back to the 16th century. It was analyzed by Italian masters Greco and Polerio, hence the name.",
    famousGames: [
      {
        white: 'Adolf Anderssen',
        black: 'Lionel Kieseritzky',
        year: 1851,
        result: '1-0',
        event: 'London',
        why: 'The "Immortal Game" - one of the most famous chess games ever, featuring a spectacular queen sacrifice'
      }
    ]
  },
  {
    eco: 'C53',
    name: 'Italian Game: Classical Variation',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    wikiUrl: 'https://en.wikipedia.org/wiki/Giuoco_Piano',
    funFact: "The Classical Variation, also known as the Giuoco Piano ('Quiet Game'), leads to rich strategic battles where both sides develop naturally before the real fight begins.",
    famousGames: [
      {
        white: 'Paul Morphy',
        black: 'Duke of Brunswick and Count Isouard',
        year: 1858,
        result: '1-0',
        event: 'Paris Opera',
        why: 'The famous "Opera Game" - Morphy\'s brilliant attacking display during an opera performance'
      }
    ]
  },
  {
    eco: 'D06',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    wikiUrl: 'https://en.wikipedia.org/wiki/Queen%27s_Gambit',
    funFact: "Despite its name, the Queen's Gambit isn't a true gambit - Black can hold onto the pawn safely. It surged in popularity after the 2020 Netflix series 'The Queen's Gambit.'",
    famousGames: [
      {
        white: 'Garry Kasparov',
        black: 'Anatoly Karpov',
        year: 1985,
        result: '1-0',
        event: 'World Championship',
        why: 'Game 16 of their legendary 1985 match, showcasing deep strategic understanding'
      }
    ]
  },
  {
    eco: 'C60',
    name: 'Ruy Lopez',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    wikiUrl: 'https://en.wikipedia.org/wiki/Ruy_Lopez',
    funFact: "Named after 16th-century Spanish bishop Ruy López de Segura, this opening has been the backbone of 1.e4 theory for over 400 years. It's known for its deep strategic complexity.",
    famousGames: [
      {
        white: 'Wilhelm Steinitz',
        black: 'Johannes Zukertort',
        year: 1886,
        result: '1-0',
        event: 'World Championship',
        why: 'First official World Championship match, Game 1 - Steinitz demonstrated modern positional play'
      },
      {
        white: 'Anatoly Karpov',
        black: 'Viktor Korchnoi',
        year: 1978,
        result: '1-0',
        event: 'World Championship',
        why: 'Baguio City match known for psychological warfare, featuring brilliant Ruy Lopez technique'
      }
    ]
  },
];

/**
 * Detect chess opening from move list
 * @param {string[]} moves - Array of moves in algebraic notation
 * @returns {Object|null} - { eco, name, ply } or null if not found
 */
export function detectOpening(moves) {
  if (!moves || moves.length === 0) {
    return null;
  }

  // Find longest matching opening sequence
  let bestMatch = null;
  let longestMatch = 0;

  for (const opening of OPENINGS_DATABASE) {
    // Check if moves match the opening sequence
    if (movesMatch(moves, opening.moves)) {
      const matchLength = opening.moves.length;
      if (matchLength > longestMatch) {
        longestMatch = matchLength;
        bestMatch = {
          eco: opening.eco,
          name: opening.name,
          ply: matchLength,
          funFact: opening.funFact || null,
          famousGames: opening.famousGames || [],
          wikiUrl: opening.wikiUrl || null,
        };
      }
    }
  }

  return bestMatch;
}

/**
 * Check if played moves match opening sequence
 */
function movesMatch(playedMoves, openingMoves) {
  if (playedMoves.length < openingMoves.length) {
    return false;
  }

  for (let i = 0; i < openingMoves.length; i++) {
    if (playedMoves[i] !== openingMoves[i]) {
      return false;
    }
  }

  return true;
}
