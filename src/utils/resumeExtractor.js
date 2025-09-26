// Resume data extraction utilities
// In production, this would use actual PDF/DOCX parsing libraries

// Simulate resume data extraction
export const extractResumeData = async (file) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PDF or DOCX file.');
  }

  // Validate file size (10MB limit)
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('File size too large. Please upload a file smaller than 10MB.');
  }

  // Simulate extraction results with some randomness
  const sampleData = generateSampleResumeData(file.name);

  // Randomly simulate missing fields to test the collection flow
  const missingFieldChance = Math.random();
  if (missingFieldChance < 0.3) {
    // 30% chance of missing phone
    delete sampleData.phone;
  } else if (missingFieldChance < 0.5) {
    // 20% chance of missing email  
    delete sampleData.email;
  } else if (missingFieldChance < 0.6) {
    // 10% chance of missing name
    delete sampleData.name;
  }

  return sampleData;
};

// Generate sample resume data based on filename
const generateSampleResumeData = (filename) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Alex', 'Sam', 'Taylor'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Wilson'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'university.edu'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  // Try to extract name from filename
  const nameFromFile = extractNameFromFilename(filename);
  const finalFirstName = nameFromFile ? nameFromFile.split(' ')[0] : firstName;
  const finalLastName = nameFromFile ? nameFromFile.split(' ')[1] || lastName : lastName;

  return {
    name: `${finalFirstName} ${finalLastName}`,
    email: `${finalFirstName.toLowerCase()}.${finalLastName.toLowerCase()}@${domain}`,
    phone: generatePhoneNumber(),
    extractedAt: new Date().toISOString(),
    filename: filename,
    fileSize: Math.floor(Math.random() * 1000000) + 50000, // 50KB - 1MB
  };
};

// Extract name from filename
const extractNameFromFilename = (filename) => {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(pdf|docx|doc)$/i, '');

  // Common patterns: "John_Doe_Resume", "jane-doe-cv", "Resume_John_Smith"
  const patterns = [
    /^([A-Za-z]+)[_\s-]+([A-Za-z]+)[_\s-]*(?:resume|cv)?$/i,
    /^(?:resume|cv)[_\s-]+([A-Za-z]+)[_\s-]+([A-Za-z]+)$/i,
  ];

  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }

  return null;
};

// Generate random phone number
const generatePhoneNumber = () => {
  const formats = [
    '+1-XXX-XXX-XXXX',
    '(XXX) XXX-XXXX',
    'XXX.XXX.XXXX',
    'XXX-XXX-XXXX'
  ];

  const format = formats[Math.floor(Math.random() * formats.length)];

  return format.replace(/X/g, () => Math.floor(Math.random() * 10));
};

// Validate extracted data
export const validateResumeData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Valid phone number is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data
  };
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9]?[0-9]{7,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone);
};

// Get missing fields
export const getMissingFields = (data) => {
  const requiredFields = ['name', 'email', 'phone'];
  return requiredFields.filter(field => !data[field] || data[field].trim().length === 0);
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
    return `+1 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  }

  return phone; // Return original if can't format
};

// Process file for preview
export const processFileForPreview = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      // For PDF files, we'd use pdf-parse or similar
      resolve({
        type: 'pdf',
        name: file.name,
        size: file.size,
        preview: 'PDF file detected. Processing for data extraction...'
      });
    } else if (file.type.includes('wordprocessingml') || file.type === 'application/msword') {
      // For DOCX files, we'd use mammoth or similar
      resolve({
        type: 'docx',
        name: file.name,
        size: file.size,
        preview: 'Word document detected. Processing for data extraction...'
      });
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

// Simulate actual PDF parsing (placeholder)
export const parsePDFContent = async (file) => {
  // In production, use pdf-parse or pdf2json
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "Sample PDF content extracted...";
};

// Simulate actual DOCX parsing (placeholder)
export const parseDocxContent = async (file) => {
  // In production, use mammoth.js
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "Sample DOCX content extracted...";
};
