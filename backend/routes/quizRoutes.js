import express from "express";
import { healthCheck, generateMCQs } from "../controllers/quizController.js";
import { generateAptitudeMCQs } from "../controllers/aptitudeController.js";
import { generateCurrentAffairsMCQs, generateCurrentAffairs } from '../controllers/currentAffairsController.js';
import { generateSubjectMCQs, getClassesAndSubjects } from '../controllers/subjectsController.js';
import { generateGeneralKnowledgeMCQs, getDifficultyLevelsAndTopics } from "../controllers/GeneralKnowledge.js";
import { generateBPSCTREMCQs, getBPSCTRETopics } from "../controllers/bpscTreContoller.js";
import { generateExamMCQs } from "../controllers/ExamContoller.js";
import { generateCSMCQs } from '../controllers/computerScienceController.js';


const router = express.Router();

router.get("/health", healthCheck);
router.post("/generate-mcqs", generateMCQs);

//Aptutude 
router.post("/generate-aptitude-mcqs", generateAptitudeMCQs);

//Current Affairs
router.post("/generate-current-affairs-mcqs", generateCurrentAffairsMCQs);
// Current Affairs Reader Routes  
router.post('/generate-current-affairs', generateCurrentAffairs);

//Subject
router.post('/generate-subject-mcqs', generateSubjectMCQs);
router.get('/classes-and-subjects', getClassesAndSubjects);

//General Knowlwdge
router.post('/generate-general-knowledge-mcqs', generateGeneralKnowledgeMCQs);
router.get('/difficulty-levels-and-topics', getDifficultyLevelsAndTopics);

// Exam Quiz routes
router.post("/generate-exam-mcqs", generateExamMCQs);

//computer science
router.post('/generate-cs-mcqs', generateCSMCQs);

//BPSC TRE
router.get("/topics", getBPSCTRETopics);
router.post("/BpscTre", generateBPSCTREMCQs);

export default router;
