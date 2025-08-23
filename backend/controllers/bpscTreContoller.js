import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

const BPSC_TRE_TOPICS = {
    "Current Affairs": [
        "Current Affairs",
        "Computers",
        "General Knowledge",
        "Environment",
        "Government Schemes",
        "Disaster Management"
    ],
    "General Ability": [
        "Logical Reasoning",
        "Analytical Ability",
        "Decision Making and Problem-Solving",
        "Data interpretation- Charts, Graphs, etc (Class X level)",
        "Numbers and their relations (Class X level)",
        "Problems with Data Sufficiency",
        "Orders of magnitude (Class X level)"
    ],
    "Mental Ability": [
        "Data Interpretation",
        "Analytical Ability",
        "Logical Reasoning",
        "Data Sufficiency",
        "Major developments in Information Technology",
        "Decision Making and Problem solving"
    ],
    "Fundamentals of Computer": [
        "Overview of Input and Output devices, pointing devices and scanner",
        "Representation of data (Digital versus Analog, Number system, Decimal, Binary and Hexadecimal)",
        "Introduction to Data processing",
        "Concept of files and its types"
    ],
    "Programming Fundamentals": [
        "C, C++",
        "Java",
        "DotNet",
        "Artificial Intelligence (AI)",
        "Machine learning",
        "Python and BlockChain programming",
        "Principles and programming techniques",
        "Introduction to object-oriented programming (OOPs)",
        "Introduction to Integrated Development Environment and its advantages"
    ],
    "Data Processing": [
        "Word Processing (MS Word)",
        "SpreadSheet Software (MS Excel)",
        "Presentation Software (MS Powerpoint)",
        "DBMS Software (MS Access)"
    ],
    "Data structures and Algorithms": [
        "Algorithms for problem-solving",
        "Abstract data types",
        "Arrays as data structures",
        "Linked list v/s array for storage",
        "Stack and stack operations",
        "Queues",
        "Binary trees, binary search trees",
        "Graphs and their representations",
        "Sorting and searching, symbol table",
        "Data structure using C and C++"
    ],
    "Communication and Network Concepts": [
        "Introduction to computer networks",
        "Introduction: Network layers/Models",
        "Networking Devices",
        "Fundamentals of Mobile Communication"
    ],
    "Network Security": [
        "Protecting the computer from virus and malicious attacks",
        "Introduction to firewalls and its utility",
        "Backup and restoring data",
        "Networking (LAN and WAN)",
        "Security",
        "Ethical Hacking"
    ],
    "Computer Organization and Operation System": [
        "Basic Structure of Computers",
        "Computer Arithmetic Operations",
        "Central Processing Unit and Instructions",
        "Memory Organization",
        "I/O Organization",
        "Operating Systems Overview",
        "Finding and Processing Files",
        "Process Management"
    ],
    "Database Management Systems": [
        "An overview of Database Management",
        "Architecture of Database Management",
        "Relational Database Management",
        "Database Design",
        "Manipulating data",
        "No SQL Database technologies",
        "Selecting Right Database"
    ],
    "System Analysis and Design": [
        "Introduction",
        "Requirement Gathering and Feasibility Analysis",
        "Structured Analysis",
        "Structured Design",
        "Object-Oriented Modelling using UML",
        "Testing",
        "System Implementation and Maintenance",
        "Other Software development approaches"
    ],
    "Internet of Things and its application": [
        "Introduction of Internet Technology and Protocol",
        "LAN",
        "WAN",
        "MAN",
        "Search services/engine",
        "Introduction to online/offline messaging",
        "World wide web browsers",
        "Web publishing",
        "Basic Knowledge HTML.XML.Script",
        "Creation of Maintenance and websites",
        "HTML Interactivity tool",
        "Multimedia and Graphics",
        "Voicemail and video conferencing",
        "Introduction to e-commerce"
    ],
    "Miscellaneous": [
        "Mixed Topics from All Categories"
    ]
};

/**
 * Get detailed syllabus information for BPSC TRE topics
 */
const getBPSCTRESyllabusInfo = (topic) => {
    const syllabusDetails = {
        "Current Affairs": "Current national and international events, computer technology updates, environmental issues, government schemes, disaster management protocols, and general awareness topics relevant to computer education",

        "General Ability": "Logical reasoning, analytical thinking, decision-making skills, data interpretation through charts and graphs, numerical relationships, data sufficiency problems, and basic mathematical concepts at Class X level",

        "Mental Ability": "Advanced data interpretation, analytical problem-solving, logical reasoning patterns, data sufficiency analysis, recent IT developments, and complex decision-making scenarios",

        "Fundamentals of Computer": "Computer hardware components, input/output devices, data representation systems (binary, decimal, hexadecimal), digital vs analog concepts, data processing fundamentals, and file management concepts",

        "Programming Fundamentals": "Programming languages (C, C++, Java, .NET, Python), AI and machine learning basics, blockchain programming, object-oriented programming concepts, IDE tools, and modern programming techniques",

        "Data Processing": "Microsoft Office suite applications including Word processing, Excel spreadsheets, PowerPoint presentations, and Access database management for educational purposes",

        "Data structures and Algorithms": "Algorithm design and analysis, abstract data types, array operations, linked lists, stack and queue operations, tree structures, graph algorithms, sorting and searching techniques using C/C++",

        "Communication and Network Concepts": "Computer networking fundamentals, OSI and TCP/IP models, networking devices (routers, switches, hubs), mobile communication technologies, and network topologies",

        "Network Security": "Cybersecurity fundamentals, virus protection, firewall configuration, data backup and recovery, LAN/WAN security, ethical hacking principles, and computer security best practices",

        "Computer Organization and Operation System": "Computer architecture, CPU operations, memory hierarchy, I/O systems, operating system concepts, process management, file systems, and system performance optimization",

        "Database Management Systems": "Database concepts, DBMS architecture, relational database design, SQL operations, NoSQL technologies, data modeling, normalization, and database selection criteria",

        "System Analysis and Design": "Software development lifecycle, requirements analysis, system design methodologies, UML modeling, testing strategies, implementation approaches, and maintenance procedures",

        "Internet of Things and its application": "Web technologies, internet protocols, network types (LAN/WAN/MAN), HTML/XML programming, website development, multimedia applications, e-commerce fundamentals, and IoT applications in education",

        "Miscellaneous": "Comprehensive coverage of all BPSC TRE computer teacher examination topics including mixed questions from fundamentals, programming, networking, database management, and current technology trends"
    };

    return syllabusDetails[topic] || "General computer science concepts, programming fundamentals, networking, database management, and current technology trends relevant to computer education";
};

/**
 * Get subtopics for a specific BPSC TRE topic
 */
const getTopicSubtopics = (topic) => {
    return BPSC_TRE_TOPICS[topic] || [];
};

/**
 * Generate MCQs for BPSC TRE Computer Teacher examination
 */
export const generateBPSCTREMCQs = async (req, res) => {
    try {
        let { topic = "Miscellaneous", count = 10 } = req.body;
        count = Math.min(Math.max(parseInt(count) || 10, 1), 30);

        console.log(`🤖 Generating ${count} MCQs for BPSC TRE Computer Teacher exam on topic: ${topic}`);

        // Validate topic
        if (!topic || topic.trim() === "") {
            console.error('❌ Invalid topic:', topic);
            return res.status(400).json({ error: "Invalid or missing topic name." });
        }

        const topicSyllabus = getBPSCTRESyllabusInfo(topic);
        const subtopics = getTopicSubtopics(topic);
        const subtopicsText = subtopics.length > 0 ? subtopics.join(", ") : "General computer science concepts";

        // Create comprehensive prompt based on topic
        let prompt;

        // For Miscellaneous/Mixed Topics
        if (topic === "Miscellaneous" || topic.toLowerCase() === "miscellaneous") {
            prompt = `You are an expert quiz generator for the BPSC TRE (Bihar Public Service Commission - Teacher Recruitment Examination). Generate exactly ${count} multiple-choice questions following the EXACT format and pattern of BPSC TRE previous year questions.

EXAMINATION: BPSC TRE Computer Teacher
QUESTION PATTERN: Follow the exact format of BPSC TRE with 5 options including "More than one of the above" and "None of the above"

COMPLETE SYLLABUS COVERAGE (All BPSC TRE Topics):

**CURRENT AFFAIRS & GENERAL KNOWLEDGE:**
- Current national/international IT developments
- Computer technology updates and trends
- Environmental IT applications
- Government digital schemes and initiatives
- IT in disaster management

**GENERAL ABILITY & MENTAL ABILITY:**
- Logical reasoning with computer applications
- Data interpretation using charts/graphs
- Analytical problem-solving in IT context
- Decision making in computer systems
- Basic mathematics for computer science

**FUNDAMENTALS OF COMPUTER:**
- Input/output devices (keyboard, mouse, scanner, printer)
- Data representation (binary, decimal, hexadecimal)
- Digital vs analog concepts
- Data processing fundamentals
- File types and management

**PROGRAMMING FUNDAMENTALS:**
- C, C++ programming concepts
- Java programming basics
- .NET framework
- Python programming
- Artificial Intelligence and Machine Learning basics
- Blockchain programming concepts
- Object-oriented programming (OOPs)
- Integrated Development Environment (IDE)

**DATA PROCESSING:**
- MS Word processing features
- MS Excel spreadsheet operations
- MS PowerPoint presentation tools
- MS Access database operations

**DATA STRUCTURES & ALGORITHMS:**
- Algorithm design and analysis
- Arrays and linked lists
- Stacks and queues
- Binary trees and search trees
- Graph algorithms
- Sorting and searching techniques
- Symbol tables and data structures in C/C++

**COMMUNICATION & NETWORKS:**
- Computer networking fundamentals
- Network layers and models (OSI, TCP/IP)
- Networking devices (routers, switches, hubs)
- Mobile communication technologies
- LAN, WAN, MAN concepts

**NETWORK SECURITY:**
- Virus protection and malware defense
- Firewalls and security systems
- Data backup and recovery
- Network security protocols
- Ethical hacking fundamentals

**COMPUTER ORGANIZATION & OS:**
- Computer architecture and organization
- CPU operations and instruction sets
- Memory hierarchy and organization
- I/O systems and operations
- Operating system concepts
- Process management and scheduling
- File systems

**DATABASE MANAGEMENT:**
- DBMS architecture and concepts
- Relational database design
- SQL operations and queries
- NoSQL database technologies
- Database normalization
- Data modeling techniques

**SYSTEM ANALYSIS & DESIGN:**
- Software development lifecycle
- Requirements analysis and gathering
- System design methodologies
- UML modeling and documentation
- Testing strategies and implementation
- System maintenance procedures

**INTERNET OF THINGS & WEB TECH:**
- Internet protocols and technologies
- HTML, XML, and web scripting
- Website development and maintenance
- E-commerce fundamentals
- Multimedia and graphics
- IoT applications in education

QUESTION FORMAT REQUIREMENTS:
1. Each question must have EXACTLY 5 options: (A), (B), (C), (D) More than one of the above, (E) None of the above
2. Questions should be factual, direct, and similar to BPSC TRE previous year pattern
3. Include fill-in-the-blanks, definitions, technical specifications
4. Mix of basic and intermediate difficulty level suitable for teacher recruitment
5. Generate questions similar to previous year papers with updated content
6. IMPORTANT: DO NOT write (A), (B), (C) options inside the question text
7. IMPORTANT: Question field should contain ONLY the question, options go in separate "options" array

CORRECT QUESTION FORMAT EXAMPLES:
✅ CORRECT: "The brain of computer is"
✅ CORRECT: "Intel 8085 microprocessor is of _____ generation."
✅ CORRECT: "Which of the following contains a laser?"
✅ CORRECT: "_____ is used to store softwares that does not update."

❌ WRONG: "The brain of computer is (A) CPU (B) memory (C) I/O device"
❌ WRONG: "Which of the following contains a laser? (A) CD Drive (B) RAM (C) Hard Disk"

QUESTION DISTRIBUTION (Generate mix from ALL syllabus areas):
- Computer Fundamentals & Hardware (15-20%)
- Programming & Software Tools (15-20%)
- Data Structures & Algorithms (10-15%)
- Database Management (10-15%)
- Computer Networks & Security (10-15%)
- Operating Systems & Architecture (10-15%)
- Web Technologies & IoT (10-15%)
- Current Affairs & General Knowledge (5-10%)

Return output as a JSON array only (no extra text). Each element must be:
{
  "question": string (ONLY the question text - DO NOT include any (A), (B), (C) options here),
  "options": ["option A text", "option B text", "option C text", "More than one of the above", "None of the above"],
  "answer": string (MUST exactly match one of the 5 options above),
  "explanation": string (2-3 sentences explaining why this answer is correct)
}

EXAMPLES OF CORRECT FORMAT:
{
  "question": "The brain of computer is",
  "options": ["CPU", "memory", "I/O device", "More than one of the above", "None of the above"],
  "answer": "CPU",
  "explanation": "..."
}

{
  "question": "Which of the following contains a laser?",
  "options": ["CD Drive", "RAM", "Hard Disk Drive", "More than one of the above", "None of the above"],
  "answer": "CD Drive",
  "explanation": "..."
}

CRITICAL REQUIREMENTS:
1. Question text must be clean without any options listed
2. All 5 options go in the separate "options" array
3. Answer must exactly match one option from the array

Generate comprehensive questions covering ALL syllabus areas mentioned above, ensuring proper distribution across all topics for complete BPSC TRE preparation.`;

        } else {
            // For Specific Topics
            prompt = `You are an expert quiz generator for the BPSC TRE (Bihar Public Service Commission - Teacher Recruitment Examination). Generate exactly ${count} multiple-choice questions specifically on "${topic}" following the EXACT BPSC TRE format.

EXAMINATION: BPSC TRE Computer Teacher
SPECIFIC TOPIC: ${topic}
TOPIC SYLLABUS: ${topicSyllabus}
SUBTOPICS: ${subtopicsText}

COMPREHENSIVE TOPIC COVERAGE:
Generate questions covering ALL subtopics mentioned above for complete understanding of "${topic}" as per BPSC TRE syllabus.

QUESTION FORMAT REQUIREMENTS:
1. ALL questions must be strictly related to "${topic}" and its subtopics
2. Each question must have EXACTLY 5 options: (A), (B), (C), (D) More than one of the above, (E) None of the above
3. Follow BPSC TRE previous year question pattern and difficulty level
4. Include technical specifications, definitions, and practical applications
5. Questions should be direct, factual, and examination-oriented
6. Mix fill-in-the-blanks and conceptual questions

PREVIOUS YEAR QUESTION STYLES FOR REFERENCE:
- "_____ microprocessor is of _____ generation."
- "The maximum memory size of _____ generation microprocessor is"
- "Which of the following is used for _____?"
- "A computer program that _____ is called"
- "Which of the following is not _____?"
- "The key/keys used to _____ is/are"

CRITICAL: Write ONLY the question text without any (A), (B), (C) options. The options will be provided separately in the JSON structure.

ENSURE COMPLETE SYLLABUS COVERAGE:
Generate questions that comprehensively cover all aspects of "${topic}" as defined in the BPSC TRE syllabus, ensuring students get thorough preparation for this specific topic.

Return output as a JSON array only (no extra text). Each element must be:
{
  "question": string (question text with options A, B, C clearly stated),
  "options": ["option A text", "option B text", "option C text", "More than one of the above", "None of the above"],
  "answer": string (MUST exactly match one of the 5 options above - either "option A text" OR "option B text" OR "option C text" OR "More than one of the above" OR "None of the above"),
  "explanation": string (2-3 sentences explaining the correct answer with educational context relevant to computer teaching)
}

CRITICAL ANSWER REQUIREMENT: The "answer" field must be an EXACT copy of one of the strings from the "options" array. Do not paraphrase or modify the option text. If option A is "CPU", then answer must be exactly "CPU", not "Central Processing Unit" or "cpu".

Focus on creating questions that match BPSC TRE standards and provide comprehensive coverage of "${topic}" for computer teacher recruitment preparation.`;
        }

        let mcqs = [];

        try {
            const model = getGeminiModel();
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            console.log('✅ Received response from Gemini API');

            mcqs = extractAndParseJSON(text);

        } catch (err) {
            console.error("❌ Gemini generation failed:", err.message);

            // Return API limit hit error instead of fallback questions
            return res.status(503).json({
                error: "API_LIMIT_HIT",
                message: "API limit reached. Please try again later."
            });
        }

        // Validate MCQ format - ensure 5 options and correct answer matching
        if (Array.isArray(mcqs) && mcqs.length > 0) {
            mcqs = mcqs.filter(mcq => {
                // Basic structure validation
                if (!mcq || !mcq.question || !Array.isArray(mcq.options) || !mcq.answer || !mcq.explanation) {
                    console.log('❌ MCQ missing basic structure:', mcq?.question?.substring(0, 50));
                    return false;
                }

                // Validate exactly 5 options
                if (mcq.options.length !== 5) {
                    console.log('❌ MCQ does not have 5 options:', mcq.question.substring(0, 50), 'Options:', mcq.options.length);
                    return false;
                }

                // Validate standard format for options D and E
                if (mcq.options[3] !== "More than one of the above" || mcq.options[4] !== "None of the above") {
                    console.log('❌ MCQ incorrect format for options D/E:', mcq.question.substring(0, 50));
                    return false;
                }

                // CRITICAL: Validate that answer matches exactly one of the options
                const answerExists = mcq.options.includes(mcq.answer);
                if (!answerExists) {
                    console.log('❌ Answer does not match any option:', {
                        question: mcq.question.substring(0, 50),
                        answer: mcq.answer,
                        options: mcq.options
                    });
                    return false;
                }

                // Additional validation: ensure question doesn't contain options (A), (B), (C)
                if (mcq.question.includes('(A)') || mcq.question.includes('(B)') || mcq.question.includes('(C)')) {
                    console.log('❌ Question contains options in text:', mcq.question.substring(0, 100));
                    return false;
                }

                // Additional validation: ensure answer is not empty or just whitespace
                if (!mcq.answer.trim()) {
                    console.log('❌ Empty or whitespace answer:', mcq.question.substring(0, 50));
                    return false;
                }

                return true;
            });
        }

        if (!Array.isArray(mcqs) || !mcqs.length) {
            console.error('❌ No valid MCQs generated with proper 5-option format and correct answers');
            return res.status(503).json({
                error: "VALIDATION_FAILED",
                message: "Failed to generate valid 5-option MCQs with correct answer matching. Please try again later."
            });
        }

        const finalMcqs = mcqs.slice(0, count);
        console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for BPSC TRE - ${topic}`);

        res.json({
            mcqs: finalMcqs,
            exam: "BPSC TRE Computer Teacher",
            topic,
            subtopics: subtopics,
            generated: new Date().toISOString(),
            format: "5-option format with (D) More than one of the above, (E) None of the above",
            validation: {
                totalGenerated: mcqs.length,
                validMCQs: finalMcqs.length,
                allAnswersVerified: true
            }
        });

    } catch (error) {
        console.error("❌ generateBPSCTREMCQs error:", error);
        res.status(503).json({
            error: "API_LIMIT_HIT",
            message: "Service temporarily unavailable. Please try again later.",
            details: error.message
        });
    }
};

/**
 * Get available BPSC TRE topics and subtopics
 */
export const getBPSCTRETopics = (req, res) => {
    try {
        console.log('📋 Fetching BPSC TRE topics and subtopics');

        res.json({
            exam: "BPSC TRE Computer Teacher",
            topics: BPSC_TRE_TOPICS,
            totalTopics: Object.keys(BPSC_TRE_TOPICS).length,
            description: "Bihar Public Service Commission - Teacher Recruitment Examination for Computer Teachers",
            format: "5-option MCQs with (D) More than one of the above, (E) None of the above"
        });
    } catch (error) {
        console.error("❌ getBPSCTRETopics error:", error);
        res.status(500).json({
            error: "Failed to fetch topics",
            details: error.message
        });
    }
};