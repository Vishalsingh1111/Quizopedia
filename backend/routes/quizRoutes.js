import express from "express";
import { healthCheck, generateMCQs, saveHistory, getHistory } from "../controllers/quizController.js";
import { generateAptitudeMCQs, aptitudesaveHistory, aptitudegetHistory } from "../controllers/aptitudeController.js";
import { generateCurrentAffairsMCQs, generateCurrentAffairs, currentAffairsSaveHistory, currentAffairsGetHistory } from '../controllers/currentAffairsController.js';
import { generateSubjectMCQs, subjectSaveHistory, subjectGetHistory, getClassesAndSubjects } from '../controllers/subjectsController.js';
import { generateGeneralKnowledgeMCQs, generalKnowledgeSaveHistory, generalKnowledgeGetHistory, getDifficultyLevelsAndTopics } from "../controllers/GeneralKnowledge.js";
import { generateExamMCQs, examSaveHistory, examGetHistory } from "../controllers/ExamContoller.js";


const router = express.Router();

router.get("/health", healthCheck);
router.post("/generate-mcqs", generateMCQs);
router.post("/save-history", saveHistory);
router.get("/quiz-history", getHistory);

//Aptutude 
router.post("/generate-aptitude-mcqs", generateAptitudeMCQs);
router.post("/aptitude-save-history", aptitudesaveHistory);
router.get("/aptitude-quiz-history", aptitudegetHistory);

//Current Affairs
router.post("/generate-current-affairs-mcqs", generateCurrentAffairsMCQs);
router.post("/current-affairs-save-history", currentAffairsSaveHistory);
router.get("/current-affairs-quiz-history", currentAffairsGetHistory);
// Current Affairs Reader Routes  
router.post('/generate-current-affairs', generateCurrentAffairs);

//Subject
router.post('/generate-subject-mcqs', generateSubjectMCQs);
router.post('/subject-save-history', subjectSaveHistory);
router.get('/subject-quiz-history', subjectGetHistory);
router.get('/classes-and-subjects', getClassesAndSubjects);

//General Knowlwdge
router.post('/generate-general-knowledge-mcqs', generateGeneralKnowledgeMCQs);
router.post('/general-knowledge-save-history', generalKnowledgeSaveHistory);
router.get('/general-knowledge-quiz-history', generalKnowledgeGetHistory);
router.get('/difficulty-levels-and-topics', getDifficultyLevelsAndTopics);

//Exam Based 
// Exam Quiz routes
router.post("/generate-exam-mcqs", generateExamMCQs);
router.post("/exam-save-history", examSaveHistory);
router.get("/exam-quiz-history", examGetHistory);

export default router;
