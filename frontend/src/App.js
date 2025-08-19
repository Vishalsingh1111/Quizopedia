import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import QuizApp from "./Components/PracticeQuiz/Quiz";
import HomePage from "./Home";
import AptitudeQuiz from "./Components/ApptitudeQuiz/AptitudeQuiz";
import CurrentAffairs from "./Components/CurrentAffairs/currentAffairsQuiz";
import SubjectQuiz from "./Components/SubjectQuiz/subject";
import ContactUs from "./Components/ContactUs";
import FAQ from "./Components/FAQ";
import ReportIssue from "./Components/ReportIssue";
import Feedback from "./Components/Feedback";
import GeneralKnowledgeQuiz from "./Components/General Knowledge/GeneralKnowledge";
import SpeedQuiz from "./Components/PracticeQuiz/SpeedQuiz";
import ExamQuiz from "./Components/ExamQuiz/ExamQuiz";


export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Quiz/Practice" element={<QuizApp />} />
          <Route path="/Quiz/Aptitude" element={<AptitudeQuiz />} />
          <Route path="/Quiz/Reader/Current-Affairs" element={<CurrentAffairs />} />
          <Route path="/Quiz/Exam-Based" element={<ExamQuiz />} />
          <Route path="/Quiz/Subject" element={<SubjectQuiz />} />
          <Route path="/Quiz/General-Knowledge" element={<GeneralKnowledgeQuiz />} />
          <Route path="/Quiz/Speed-Challenge" element={<SpeedQuiz />} />
          <Route path="/Contact-Us" element={<ContactUs />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Report-Issues" element={<ReportIssue />} />
          <Route path="/FeedBack" element={<Feedback />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
