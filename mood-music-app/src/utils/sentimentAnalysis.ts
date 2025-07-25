export const analyzeText = (text: string): string => {
  const lowerText = text.toLowerCase();
  const positiveWords = ['happy', 'joy', 'excited', 'great', 'awesome', 'fantastic', 'cheerful', 'thrilled', 'ecstatic', 'delighted'];
  const negativeWords = ['sad', 'depressed', 'angry', 'upset', 'frustrated', 'miserable', 'furious', 'irritated'];
  const calmWords = ['calm', 'peaceful', 'relaxed', 'chill', 'serene', 'tranquil', 'soothed'];
  const stressedWords = ['stressed', 'anxious', 'nervous', 'tense', 'overwhelmed', 'worried'];

  let score = 0;
  positiveWords.forEach((word) => { if (lowerText.includes(word)) score += 2; });
  negativeWords.forEach((word) => { if (lowerText.includes(word)) score -= 2; });
  calmWords.forEach((word) => { if (lowerText.includes(word)) score += 1; });
  stressedWords.forEach((word) => { if (lowerText.includes(word)) score -= 1; });

  if (lowerText.includes('angry') || lowerText.includes('furious') || lowerText.includes('irritated')) return 'angry';
  if (lowerText.includes('excited') || lowerText.includes('thrilled') || lowerText.includes('ecstatic')) return 'excited';
  if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('overwhelmed')) return 'stressed';
  if (lowerText.includes('relaxed') || lowerText.includes('serene') || lowerText.includes('tranquil')) return 'relaxed';
  if (lowerText.includes('calm') || lowerText.includes('peaceful')) return 'calm';
  if (score > 1) return 'happy';
  if (score < -1) return 'sad';
  return 'calm';
};