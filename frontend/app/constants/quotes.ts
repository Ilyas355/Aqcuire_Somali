export interface DailyQuote {
  somali: string;
  english: string;
  meaning: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    somali: "Hubsiimo hal baa la siistaa.",
    english: "Certainty is rewarded with a camel.",
    meaning: "Verify things carefully before acting.",
  },
  {
    somali: "Wax la qariyo qurun baa ku jira.",
    english: "What is hidden usually contains rot.",
    meaning: "Truth eventually comes out.",
  },
  {
    somali: "Farkaliya fool ma dhaqdo.",
    english: "One finger cannot wash a face.",
    meaning: "Cooperation matters.",
  },
  {
    somali: "Aqoon la'aani waa iftiin la'aan.",
    english: "Without knowledge there is no light.",
    meaning: "Education is everything.",
  },
  {
    somali: "Taladaan la ruugin waa lagu rafaadaa.",
    english: "An unthought decision brings suffering.",
    meaning: "Think before acting.",
  },
  {
    somali: "Waa dhalaankii dhalmada hooyadood baray.",
    english: "These are the children who taught their mother how to give birth.",
    meaning: "Said of someone acting like they know everything.",
  },
  {
    somali: "Beeni raad ma leh.",
    english: "A lie leaves no trace.",
    meaning: "Short, memorable, poetic.",
  },
  {
    somali: "Waari mayside war ha kaa haro.",
    english: "You won't live forever — leave behind good words.",
    meaning: "Make your mark while you can.",
  },
  {
    somali: "Biyo socda ayaa biyo fadhiya kiciya.",
    english: "Running water moves still water.",
    meaning: "Active people inspire others.",
  },
  {
    somali: "Afjooga looma adeego.",
    english: "A silent mouth is not served.",
    meaning: "Speak up — practice speaking.",
  },
  {
    somali: "Talo xumo tog baas bay kaa riddaa.",
    english: "Bad advice throws you into a canyon.",
    meaning: "Choose your guidance wisely.",
  },
  {
    somali: "Wadiiqada yari waddada weyn bay kugu riddaa.",
    english: "A small path leads to a big road.",
    meaning: "Small steps lead to great progress.",
  },
];

export function getTodaysQuote(): DailyQuote {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return DAILY_QUOTES[dayIndex % DAILY_QUOTES.length];
}
