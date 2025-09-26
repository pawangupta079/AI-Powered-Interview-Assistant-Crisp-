// Question bank with different difficulty levels
export const QUESTION_BANK = {
  easy: [
    {
      id: 1,
      text: "What is the difference between let and const in JavaScript?",
      timeLimit: 20,
      category: "JavaScript Fundamentals",
      expectedAnswer: "let allows reassignment, const doesn't",
      difficulty: "easy"
    },
    {
      id: 2,
      text: "What is JSX in React?",
      timeLimit: 20,
      category: "React Basics",
      expectedAnswer: "JavaScript XML syntax extension",
      difficulty: "easy"
    },
    {
      id: 3,
      text: "How do you handle events in React?",
      timeLimit: 20,
      category: "React Basics",
      expectedAnswer: "Using event handlers like onClick",
      difficulty: "easy"
    },
    {
      id: 4,
      text: "What is the purpose of useState hook?",
      timeLimit: 20,
      category: "React Hooks",
      expectedAnswer: "To manage state in functional components",
      difficulty: "easy"
    },
    {
      id: 5,
      text: "What is the virtual DOM in React?",
      timeLimit: 20,
      category: "React Concepts",
      expectedAnswer: "A JavaScript representation of the real DOM",
      difficulty: "easy"
    }
  ],

  medium: [
    {
      id: 6,
      text: "Explain the concept of state management in React",
      timeLimit: 60,
      category: "React Architecture",
      expectedAnswer: "Managing data flow and state across components",
      difficulty: "medium"
    },
    {
      id: 7,
      text: "What are React hooks and why are they useful?",
      timeLimit: 60,
      category: "React Hooks",
      expectedAnswer: "Functions that let you use state and lifecycle features",
      difficulty: "medium"
    },
    {
      id: 8,
      text: "How would you implement routing in a React application?",
      timeLimit: 60,
      category: "React Router",
      expectedAnswer: "Using React Router library with Route components",
      difficulty: "medium"
    },
    {
      id: 9,
      text: "What is the difference between props and state?",
      timeLimit: 60,
      category: "React Concepts",
      expectedAnswer: "Props are passed from parent, state is internal",
      difficulty: "medium"
    },
    {
      id: 10,
      text: "Explain the useEffect hook and its use cases",
      timeLimit: 60,
      category: "React Hooks",
      expectedAnswer: "For side effects like API calls and subscriptions",
      difficulty: "medium"
    }
  ],

  hard: [
    {
      id: 11,
      text: "How would you optimize a React application for performance?",
      timeLimit: 120,
      category: "React Performance",
      expectedAnswer: "Memoization, lazy loading, code splitting, etc.",
      difficulty: "hard"
    },
    {
      id: 12,
      text: "Explain the concept of server-side rendering vs client-side rendering",
      timeLimit: 120,
      category: "Rendering Patterns",
      expectedAnswer: "SSR renders on server, CSR renders in browser",
      difficulty: "hard"
    },
    {
      id: 13,
      text: "How would you implement a custom hook for data fetching?",
      timeLimit: 120,
      category: "Custom Hooks",
      expectedAnswer: "Use useState and useEffect with async functions",
      difficulty: "hard"
    },
    {
      id: 14,
      text: "Describe how you would architect a large-scale React application",
      timeLimit: 120,
      category: "Architecture",
      expectedAnswer: "Component structure, state management, routing",
      difficulty: "hard"
    },
    {
      id: 15,
      text: "Explain React's reconciliation algorithm and how it works",
      timeLimit: 120,
      category: "React Internals",
      expectedAnswer: "Diffing algorithm for efficient DOM updates",
      difficulty: "hard"
    }
  ]
};

// Infer simple skills set from candidate data
const inferSkillsFromCandidate = (candidate) => {
  const skills = new Set(
    (candidate?.skills || [])
      .map(s => String(s).toLowerCase())
  );
  // Heuristics from email/filename or defaults
  const text = `${candidate?.email || ''} ${candidate?.filename || ''}`.toLowerCase();
  if (text.includes('react')) skills.add('react');
  if (text.includes('node')) skills.add('node');
  if (text.includes('ts') || text.includes('typescript')) skills.add('typescript');
  if (skills.size === 0) {
    ['react','javascript','css'].forEach(s => skills.add(s));
  }
  return Array.from(skills);
};

// Map skill to question categories
const skillToCategories = (skill) => {
  const map = {
    react: ['React Basics','React Hooks','React Concepts','React Performance','React Router', 'Architecture'],
    javascript: ['JavaScript Fundamentals','React Concepts'],
    typescript: ['React Concepts','Architecture'],
    css: ['React Basics'],
    node: ['Architecture']
  };
  return map[skill] || [];
};

// Get personalized question based on candidate skills and overall question index (0..5)
export const getPersonalizedQuestion = (candidate, globalIndex) => {
  // Determine difficulty tier by global index
  let difficulty;
  let localIndex = globalIndex;
  if (globalIndex < 2) { difficulty = 'easy'; localIndex = globalIndex; }
  else if (globalIndex < 4) { difficulty = 'medium'; localIndex = globalIndex - 2; }
  else { difficulty = 'hard'; localIndex = globalIndex - 4; }

  const all = QUESTION_BANK[difficulty] || [];
  if (all.length === 0) throw new Error(`No questions in bank for ${difficulty}`);

  // Try to filter by categories inferred from candidate skills
  const skills = inferSkillsFromCandidate(candidate).map(s => s.toLowerCase());
  const preferredCategories = new Set(skills.flatMap(skillToCategories));
  const filtered = all.filter(q => preferredCategories.has(q.category));
  const pool = filtered.length > 0 ? filtered : all;

  // Deterministic selection using localIndex
  const pick = pool[localIndex % pool.length];
  return pick;
};

// Get question by difficulty and index
export const getQuestionByDifficulty = (difficulty, questionIndex) => {
  const questions = QUESTION_BANK[difficulty];
  if (!questions || questions.length === 0) {
    throw new Error(`No questions found for difficulty: ${difficulty}`);
  }

  // Use modulo to cycle through questions if we run out
  const index = questionIndex % questions.length;
  return questions[index];
};

// Get random question by difficulty
export const getRandomQuestion = (difficulty) => {
  const questions = QUESTION_BANK[difficulty];
  if (!questions || questions.length === 0) {
    throw new Error(`No questions found for difficulty: ${difficulty}`);
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Get all questions for a difficulty
export const getQuestionsByDifficulty = (difficulty) => {
  return QUESTION_BANK[difficulty] || [];
};

// Get question statistics
export const getQuestionStats = () => {
  const easy = QUESTION_BANK.easy.length;
  const medium = QUESTION_BANK.medium.length;
  const hard = QUESTION_BANK.hard.length;

  return {
    easy,
    medium,
    hard,
    total: easy + medium + hard
  };
};

// Validate question format
export const isValidQuestion = (question) => {
  return (
    question &&
    typeof question.id === 'number' &&
    typeof question.text === 'string' &&
    typeof question.timeLimit === 'number' &&
    typeof question.category === 'string' &&
    typeof question.difficulty === 'string' &&
    question.text.length > 0 &&
    question.timeLimit > 0
  );
};

// Get question sequence for interview (2 easy, 2 medium, 2 hard)
export const getInterviewQuestionSequence = () => {
  const sequence = [];

  // Add 2 easy questions
  const easyQuestions = [...QUESTION_BANK.easy];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * easyQuestions.length);
    sequence.push(easyQuestions.splice(randomIndex, 1)[0]);
  }

  // Add 2 medium questions  
  const mediumQuestions = [...QUESTION_BANK.medium];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * mediumQuestions.length);
    sequence.push(mediumQuestions.splice(randomIndex, 1)[0]);
  }

  // Add 2 hard questions
  const hardQuestions = [...QUESTION_BANK.hard];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * hardQuestions.length);
    sequence.push(hardQuestions.splice(randomIndex, 1)[0]);
  }

  return sequence;
};
