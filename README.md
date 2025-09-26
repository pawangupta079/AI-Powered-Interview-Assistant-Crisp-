# AI-Powered Interview Assistant

A comprehensive React application built for the Swipe Internship Assignment that serves as an AI-powered interview assistant with real-time chat interface and dashboard management.

## 🚀 Features

### Interviewee Tab (Chat Interface)
- **Resume Upload**: Support for PDF and DOCX files with drag-and-drop functionality
- **Data Extraction**: Automatically extracts Name, Email, and Phone from resumes
- **Missing Field Collection**: AI chatbot prompts for missing information before starting interview
- **Timed Interview**: 6 progressive difficulty questions (2 Easy → 2 Medium → 2 Hard)
- **Auto-Submit**: Questions automatically submit when timer expires
- **Real-time Progress**: Visual progress indicator and countdown timers
- **AI Scoring**: Comprehensive scoring and summary generation

### Interviewer Tab (Dashboard)
- **Candidate Management**: Complete list of all candidates with sorting and filtering
- **Score-based Ranking**: Candidates ordered by performance scores
- **Detailed Views**: Individual candidate profiles with complete interview history
- **Search Functionality**: Advanced search and filter options
- **Professional UI**: Clean, responsive dashboard interface

### Data Persistence
- **Local Storage**: All data persisted locally using Redux Persist
- **Session Recovery**: "Welcome Back" modal for incomplete interviews
- **State Management**: Complete application state preserved across sessions
- **Data Integrity**: Robust error handling and data validation

## 🛠 Technical Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit + Redux Persist
- **UI Components**: Custom components with Lucide React icons
- **File Processing**: PDF-parse, Mammoth for document extraction
- **Styling**: Modern CSS with CSS Variables
- **Deployment**: Vercel/Netlify ready
- **Storage**: localStorage with Redux Persist

## 📁 Project Structure

```
ai-interview-assistant/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── IntervieweeTab/
│   │   │   ├── IntervieweeTab.js
│   │   │   ├── FileUpload.js
│   │   │   ├── ChatInterface.js
│   │   │   ├── Timer.js
│   │   │   └── ProgressBar.js
│   │   ├── InterviewerTab/
│   │   │   ├── InterviewerTab.js
│   │   │   ├── CandidateList.js
│   │   │   ├── CandidateDetails.js
│   │   │   └── SearchBar.js
│   │   └── Common/
│   │       ├── Modal.js
│   │       ├── LoadingSpinner.js
│   │       └── TabNavigation.js
│   ├── utils/
│   │   ├── localStorage.js
│   │   ├── resumeExtractor.js
│   │   ├── aiSimulator.js
│   │   └── questionBank.js
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useTimer.js
│   │   └── useInterview.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interview-assistant.git
   cd ai-interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_NAME=AI Interview Assistant
REACT_APP_VERSION=1.0.0
```

### Deployment

#### Vercel
```bash
npm run build
# Deploy to Vercel
```

#### Netlify
```bash
npm run build
# Upload build folder to Netlify
```

#### GitHub Pages
```bash
npm run deploy
```

## 🎯 Usage

### For Interviewees
1. Navigate to the **Interviewee** tab
2. Upload your resume (PDF or DOCX)
3. Complete any missing information when prompted
4. Answer 6 timed questions progressing from Easy to Hard
5. View your final score and AI-generated summary

### For Interviewers
1. Navigate to the **Interviewer** tab
2. View all candidates sorted by score
3. Search and filter candidates
4. Click on any candidate to view detailed interview history
5. Review AI scoring and candidate summaries

## 🧪 Testing

### Manual Testing
- Test resume upload with various PDF/DOCX files
- Verify timer functionality and auto-submission
- Check data persistence across browser sessions
- Test responsive design on different screen sizes

### Sample Test Files
Include sample resume files in `public/samples/`:
- `sample-resume.pdf`
- `sample-resume.docx`

## 📊 Question Bank

### Easy Questions (20 seconds each)
- What is the difference between let and const in JavaScript?
- What is JSX in React?
- How do you handle events in React?
- What is the purpose of useState hook?

### Medium Questions (60 seconds each)
- Explain the concept of state management in React
- What are React hooks and why are they useful?
- How would you implement routing in a React application?
- What is the difference between props and state?

### Hard Questions (120 seconds each)
- How would you optimize a React application for performance?
- Explain server-side rendering vs client-side rendering
- How would you implement a custom hook for data fetching?
- Describe how you would architect a large-scale React application

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design suitable for corporate use
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: User-friendly error messages and validation
- **Loading States**: Smooth loading indicators and transitions
- **Toast Notifications**: Real-time feedback for user actions

## 🔒 Data Privacy

- All data stored locally on user's device
- No data transmitted to external servers
- Resume content processed client-side only
- GDPR compliant data handling

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo for optimization
- **Bundle Size**: Optimized dependencies and build process
- **Caching**: Efficient localStorage usage
- **Responsive Images**: Optimized asset loading

## 🐛 Troubleshooting

### Common Issues

**File Upload Not Working**
- Ensure file is PDF or DOCX format
- Check file size (max 10MB)
- Try refreshing the browser

**Timer Issues**
- Check browser permissions for notifications
- Ensure JavaScript is enabled
- Clear localStorage if needed

**Data Not Persisting**
- Check browser localStorage limits
- Ensure localStorage is enabled
- Try incognito mode to test

## 📈 Future Enhancements

- Integration with real AI APIs (OpenAI, Claude)
- Video interview capabilities
- Advanced analytics dashboard
- Export functionality for candidate reports
- Multi-language support
- Custom question bank editor

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for the Swipe Internship Assignment. All rights reserved.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Swipe for the internship opportunity
- React community for excellent documentation
- Open source contributors for the libraries used

---

**Built with ❤️ for Swipe Internship Assignment**

For any questions or support, please reach out via the contact information above.
