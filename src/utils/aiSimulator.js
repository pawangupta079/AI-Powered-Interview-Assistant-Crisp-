// AI response simulation for demo purposes
// In production, this would integrate with actual AI APIs

// Simulate AI scoring based on answer quality
export const generateAIScore = (answers) => {
  if (!answers || answers.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let maxPossibleScore = 0;

  answers.forEach((answer, index) => {
    const { difficulty, answer: answerText, timeUsed, timeLimit } = answer;

    // Base score by difficulty
    let baseScore;
    switch (difficulty) {
      case 'easy':
        baseScore = 15;
        break;
      case 'medium':
        baseScore = 25;
        break;
      case 'hard':
        baseScore = 35;
        break;
      default:
        baseScore = 20;
    }

    maxPossibleScore += baseScore;

    // Calculate score based on answer length and time efficiency
    let score = 0;

    if (answerText && answerText.trim().length > 0) {
      // Answer length factor (basic heuristic)
      const answerLength = answerText.trim().length;
      let lengthScore = 0;

      if (answerLength > 200) lengthScore = 1.0;
      else if (answerLength > 100) lengthScore = 0.8;
      else if (answerLength > 50) lengthScore = 0.6;
      else if (answerLength > 20) lengthScore = 0.4;
      else lengthScore = 0.2;

      // Time efficiency factor
      const timeEfficiency = Math.max(0, (timeLimit - timeUsed) / timeLimit);
      const timeBonus = timeEfficiency * 0.2; // Up to 20% bonus for quick answers

      // Keyword matching (basic AI simulation)
      const keywordScore = calculateKeywordScore(answerText, difficulty);

      score = baseScore * (lengthScore + timeBonus + keywordScore) / 1.4;
    }

    totalScore += Math.min(score, baseScore);
  });

  // Convert to percentage and add some randomness for realism
  const percentage = (totalScore / maxPossibleScore) * 100;
  const randomVariation = (Math.random() - 0.5) * 10; // ±5% variation

  return Math.max(0, Math.min(100, Math.round(percentage + randomVariation)));
};

// Compute final score with per-question breakdown
export const generateAIScoreWithBreakdown = (answers) => {
  if (!answers || answers.length === 0) {
    return { finalScore: 0, breakdown: [] };
  }

  let totalScore = 0;
  let maxPossibleScore = 0;
  const breakdown = [];

  answers.forEach((ans, idx) => {
    const { score, max } = scoreSingleAnswer(ans);
    totalScore += score;
    maxPossibleScore += max;
    breakdown.push({ index: idx, difficulty: ans.difficulty, score: Math.round((score / max) * 100) });
  });

  const percentage = (totalScore / maxPossibleScore) * 100;
  const randomVariation = (Math.random() - 0.5) * 10;
  const finalScore = Math.max(0, Math.min(100, Math.round(percentage + randomVariation)));

  return { finalScore, breakdown };
};

// Simulate keyword scoring
const calculateKeywordScore = (answer, difficulty) => {
  const answerLower = answer.toLowerCase();

  const keywords = {
    easy: ['variable', 'const', 'let', 'jsx', 'react', 'component', 'event', 'state', 'hook'],
    medium: ['state management', 'props', 'lifecycle', 'effect', 'router', 'navigation'],
    hard: ['performance', 'optimization', 'ssr', 'csr', 'reconciliation', 'virtual dom', 'architecture']
  };

  const relevantKeywords = keywords[difficulty] || [];
  let matchCount = 0;

  relevantKeywords.forEach(keyword => {
    if (answerLower.includes(keyword)) {
      matchCount++;
    }
  });

  return Math.min(matchCount / relevantKeywords.length, 0.3); // Max 30% from keywords
};

// Generate AI summary
export const generateAISummary = (answers, score) => {
  const summaries = {
    excellent: [
      "Exceptional candidate with deep technical knowledge and excellent problem-solving skills. Demonstrated strong understanding of React concepts and JavaScript fundamentals.",
      "Outstanding performance across all difficulty levels. Shows great potential for senior-level responsibilities with comprehensive technical expertise.",
      "Impressive technical depth and clear communication. Candidate exhibits strong foundational knowledge with practical application insights."
    ],
    good: [
      "Solid technical foundation with room for growth. Good understanding of core concepts with some advanced knowledge gaps.",
      "Competent candidate with decent problem-solving abilities. Shows promise with continued learning and development.",
      "Good grasp of fundamentals with practical experience evident. Would benefit from exposure to more complex scenarios."
    ],
    average: [
      "Basic understanding of core concepts with significant learning opportunities. Shows potential with proper mentorship.",
      "Foundational knowledge present but lacks depth in advanced topics. Suitable for junior positions with growth trajectory.",
      "Demonstrates willingness to learn with basic technical competency. Would benefit from structured training programs."
    ],
    poor: [
      "Limited technical knowledge with major gaps in fundamental concepts. Requires extensive training and support.",
      "Basic awareness of technologies but lacks practical understanding. Needs significant skill development.",
      "Minimal technical competency with unclear problem-solving approach. Consider entry-level position with intensive mentoring."
    ]
  };

  let category;
  if (score >= 85) category = 'excellent';
  else if (score >= 70) category = 'good';
  else if (score >= 50) category = 'average';
  else category = 'poor';

  const summaryOptions = summaries[category];
  const randomIndex = Math.floor(Math.random() * summaryOptions.length);

  return summaryOptions[randomIndex];
};

// Simulate AI question generation
export const generateFollowUpQuestion = (previousAnswer, difficulty) => {
  const followUpTemplates = {
    easy: [
      "Can you elaborate on {topic}?",
      "What are some common mistakes with {topic}?",
      "How would you explain {topic} to a beginner?"
    ],
    medium: [
      "How would you handle {topic} in a production environment?",
      "What are the trade-offs of using {topic}?",
      "Can you give an example of when you'd use {topic}?"
    ],
    hard: [
      "How would you optimize {topic} for large-scale applications?",
      "What are the architectural implications of {topic}?",
      "How would you test and monitor {topic} in production?"
    ]
  };

  const templates = followUpTemplates[difficulty] || followUpTemplates.medium;
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  // Extract key terms from previous answer (simplified)
  const words = previousAnswer.toLowerCase().split(/\W+/);
  const techTerms = words.filter(word => 
    ['react', 'javascript', 'component', 'state', 'props', 'hook', 'dom'].includes(word)
  );

  const topic = techTerms.length > 0 ? techTerms[0] : 'this concept';

  return randomTemplate.replace('{topic}', topic);
};

// Simulate AI feedback
export const generateAnswerFeedback = (answer, expectedAnswer) => {
  if (!answer || answer.trim().length === 0) {
    return "No answer provided. Consider reviewing the fundamental concepts.";
  }

  const answerLower = answer.toLowerCase();
  const expectedLower = expectedAnswer.toLowerCase();

  // Simple keyword matching
  const expectedWords = expectedLower.split(/\W+/);
  const matchingWords = expectedWords.filter(word => 
    word.length > 3 && answerLower.includes(word)
  );

  const matchPercentage = matchingWords.length / expectedWords.length;

  if (matchPercentage >= 0.7) {
    return "Great answer! You demonstrated a solid understanding of the concept.";
  } else if (matchPercentage >= 0.4) {
    return "Good attempt. You touched on key points but could expand on certain aspects.";
  } else {
    return "Your answer shows some understanding but misses several important points.";
  }
};

// Simulate processing delay
export const simulateProcessingDelay = (minMs = 1000, maxMs = 3000) => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};
