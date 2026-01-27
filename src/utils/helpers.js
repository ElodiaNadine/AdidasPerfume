/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generate unique code for vibe result
 */
export const generateVibeCode = () => {
  return `VIBE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

/**
 * Convert answers array to answer map object
 */
export const mapAnswers = (answers) => {
  return answers.reduce((acc, curr, idx) => {
    acc[`q${idx + 1}`] = curr;
    return acc;
  }, {});
};
