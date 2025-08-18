import express from "express";
import { healthCheck, generateMCQs, saveHistory, getHistory } from "../controllers/quizController.js";
import { generateAptitudeMCQs, aptitudesaveHistory, aptitudegetHistory } from "../controllers/aptitudeController.js";
import { generateCurrentAffairsMCQs, generateCurrentAffairs, currentAffairsSaveHistory, currentAffairsGetHistory } from '../controllers/currentAffairsController.js';
import { generateSubjectMCQs, subjectSaveHistory, subjectGetHistory, getClassesAndSubjects } from '../controllers/subjectsController.js';
import { generateGeneralKnowledgeMCQs, generalKnowledgeSaveHistory, generalKnowledgeGetHistory, getDifficultyLevelsAndTopics } from "../controllers/GeneralKnowledge.js";

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
export default router;
