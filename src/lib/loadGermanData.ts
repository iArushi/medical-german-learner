import wordsData from "../data/words.json";
import levelsData from "../data/levels.json";

export type CEFRLevel = "A1" | "A2";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type PartOfSpeech = "noun" | "verb" | "adjective" | "phrase";
export type QuestionStyle =
  | "MatchMeaning"
  | "PickArticle"
  | "FillGap"
  | "PatientSituation"
  | "Mixed";

export type GermanWord = {
  id: string;
  partOfSpeech: PartOfSpeech;
  article: "der" | "die" | "das" | "";
  german: string;
  english: string;
  exampleGerman: string;
  exampleEnglish: string;
  theme: string;
  cefr: CEFRLevel;
  note?: string;
};

export type GermanLevel = {
  id: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  questionStyle: QuestionStyle;
  wordIds: string[];
};

const words = wordsData as GermanWord[];
const levels = (levelsData as GermanLevel[]).sort((a, b) => a.order - b.order);

export function getAllWords(): GermanWord[] {
  return words;
}

export function getAllLevels(): GermanLevel[] {
  return levels;
}

export function getLevelById(levelId: string): GermanLevel | undefined {
  return levels.find((level) => level.id === levelId);
}

export function getWordById(wordId: string): GermanWord | undefined {
  return words.find((word) => word.id === wordId);
}

export function getWordsByLevel(levelId: string): GermanWord[] {
  const level = getLevelById(levelId);
  if (!level) return [];
  return level.wordIds
    .map((id) => getWordById(id))
    .filter((word): word is GermanWord => word !== undefined);
}

export function getWordsByIds(ids: string[]): GermanWord[] {
  return ids
    .map((id) => getWordById(id))
    .filter((word): word is GermanWord => word !== undefined);
}
