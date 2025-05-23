
import Papa from 'papaparse';

export interface QuizItem {
  Movie: string;
  Question: string;
  Answer: string;
  Film: string;
  Song: string;
}

export interface GameQuestion {
  question: string;
  letterPosition: number;
  originalQuestion: QuizItem;
}

// List of meaningful 5-letter to 10-letter words
const WORD_LIST = [
  // Original 5-letter words
  "BRAIN", "PLUCK", "SMART", "FOCUS", "MAGIC",

  // Telugu movie names (under 10 letters)
  "RRR", "SYE", "ATHADU", "POKIRI", "JULAI",
  "KHUSHI", "LEADER", "INDRA", "GABBARSINGH", "OOPIRI",
  "RAGADA", "RACHCHA", "PUSHPA", "GANG", "MALLI",
  "EEGA", "YEVADU", "MIRCHI", "MANAM", "MCA",
  "FIDAA", "MAHARSHI", "NENULOCAL", "THOLIPREMA",
  "NINNUKORI", "KHAIDI", "DJ", "ISHQ", "SIRIVENNELA",
  "GAMYAM", "VEDAM", "BIMBISARA", "SITARAMAM", "SITA", "RED",
  "RANARANGAM", "YATRA", "JERSEY", "V", "LIE",
  "RULER", "SARKARU", "GAUTHAM", "KRISHNA", "DOOKUDU", "AAGADU",
  "LEGEND", "DHAMMU", "SARRAINODU", "JERSEY", "OKKADU", "DHRUVA",
  "KHALEJA", "PANJA", "SAAHO", "REBEL", "JALSA", "PRASTHANAM",
  "KARTHIKEYA", "JAILAVAKUSA",

  // Technical movie terms (6–8 letters)
  "CAMERAS", "LIGHTING", "EDITING", "VFXARTIST", "DIRECTOR",
  "ACTRESS", "ACTOR", "STAGING", "CUTAWAY", "SHOTLIST",
  "ZOOMING", "PANNING", "SOUNDING", "BACKDROP", "SETPIECE",
  "SCREENWR", "MONTAGE", "TRAILERS", "FOLEYING", "SYNCHRO",
  "GRADING", "RESHOOTS", "TEASERS", "DIALOGUE", "STUNTS",
  "MAKEUPFX", "SETDRESS", "SHOWRUN", "NARRATOR", "PREVIS",
  "ONLINING", "MIXDOWN", "BLOCKING", "CINEMATE", "RENDERFX",
  "GIMBALS", "LENSES", "SLOMOFX", "FRAMING", "CLAPPER",
  "VISUALFX", "SCRIPTER", "THUMBNAI", "ARTISTS", "POSTSYNC",
  "RETAKES", "ASSISTS", "EDITOR", "COSTUME", "DUBBING",

  // Mixed: 20 movie-related terms + 30 offbeat but intuitive English words (6–8 letters)

  // 🎬 Movie-related (mid-level familiarity)
  "STAGING", "SETPIECE", "SOUNDING", "SHOTLIST", "CAMERAS",
  "LIGHTING", "COSTUME", "MONTAGE", "DIALOGUE", "TRAILERS",
  "MAKEUPFX", "BLOCKING", "CLAPPER", "FOLEYING", "TEASERS",
  "RETAKES", "ONLINING", "MIXDOWN", "RESHOOTS", "CUTAWAY",

  // 🎭 Semi-familiar, offbeat but guessable English words
  "TWITCHY", "MUFFLED", "JITTERY", "BUSTLED", "SNAPPED",
  "FLUSTER", "SCUFFLE", "JOLTED", "CRINKLE", "TWISTED",
  "STUMBLE", "DITHERED", "FIDGETY", "WOBBLES", "JUMBLED",
  "WHISKED", "BUNGLED", "RIPPLES", "FROSTED", "SPLOTCH",
  "GLOOMED", "TINKLED", "GRUMBLY", "WIGGLED", "LOUNGED",
  "HICCUPS", "MUMBLED", "ZINGIER", "GIGGLED", "GRINCHY"
];



// Success messages to display when player wins
export const SUCCESS_MESSAGES = [
  "Outstanding! Maamulodivi Kaadhu ra nuvvu",
  "Outstanding! Icchipadesaav ga",
  "Outstanding! Jaathin Thengg....",
  "Outstanding! KCPD ra baabu",
  "Outstanding! Nuvvu Super ehe",
  "Outstanding! Ilaa unnav entraaaa",
  "Outstanding! Nuvvu ra asalaina baanisa",
  "Outstanding! Kurchini madathapettav gaa",
  "Outstanding! TFI baanisa bolthe",
  "Outstanding! Nuvvu Devudivi saami!",
  "Outstanding! Ippudu Career Meedha focus pettu",
  "Outstanding! Mana batch ae raa nuvvu"
];

// Load CSV data
export async function loadQuizData(): Promise<QuizItem[]> {
  try {
    const response = await fetch('/telugu_quiz.csv');
    const csvText = await response.text();
    
    const result = Papa.parse<QuizItem>(csvText, {
      header: true,
      skipEmptyLines: true
    });
    
    return result.data;
  } catch (error) {
    console.error('Error loading quiz data:', error);
    return [];
  }
}

// Generate a meaningful word from our predefined list
export function generateWord(): string {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
}

// Format time (mm:ss)
export function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Generate questions for each letter in the word
export function generateQuestions(word: string, quizData: QuizItem[]): GameQuestion[] {
  const questions: GameQuestion[] = [];
  
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    
    // Find questions with answers containing this letter
    const matchingQuestions = quizData.filter(item => 
      item.Answer.toUpperCase().includes(letter)
    );
    
    if (matchingQuestions.length > 0) {
      // Pick a random matching question
      const randomQuestionIndex = Math.floor(Math.random() * matchingQuestions.length);
      const selectedQuestion = matchingQuestions[randomQuestionIndex];
      
      // Find position(s) of the letter in the answer
      const answerUppercase = selectedQuestion.Answer.toUpperCase();
      const positions: number[] = [];
      
      for (let j = 0; j < answerUppercase.length; j++) {
        if (answerUppercase[j] === letter) {
          positions.push(j);
        }
      }
      
      // Select a random position
      const randomPositionIndex = Math.floor(Math.random() * positions.length);
      const selectedPosition = positions[randomPositionIndex];
      
      // Create the game question
      questions.push({
        question: `The ${getOrdinal(selectedPosition + 1)} letter of the answer to this question: ${selectedQuestion.Question}`,
        letterPosition: i,
        originalQuestion: selectedQuestion
      });
    } else {
      // Fallback if no matching questions
      questions.push({
        question: `Find the letter at position ${i + 1} of the hidden word.`,
        letterPosition: i,
        originalQuestion: { Movie: '', Question: '', Answer: '', Film: '', Song: '' }
      });
    }
  }
  
  return questions;
}

// Get a random success message
export function getRandomSuccessMessage(): string {
  const randomIndex = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
  return SUCCESS_MESSAGES[randomIndex];
}

// Helper to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = n % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return n + suffix;
}
