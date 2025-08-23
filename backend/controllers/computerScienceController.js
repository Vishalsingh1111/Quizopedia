import extractAndParseJSON from "../utils/extractAndParseJSON.js";
import { getGeminiModel } from "../config/gemini.js";

/**
 * Technology stacks and programming languages
 */
const TECH_STACKS = [
    "JavaScript", "Python", "Java", "C++", "C#", "React.js", "Node.js", "Angular",
    "Vue.js", "Django", "Flask", "Spring Boot", "Express.js", "MongoDB", "MySQL",
    "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
    "Git", "Linux", "Machine Learning", "Data Structures & Algorithms", "System Design",
    "DevOps", "Cybersecurity", "Blockchain", "Mobile Development", "Web Development",
    "Software Engineering", "Database Management", "Cloud Computing", "Artificial Intelligence"
];

/**
 * Get comprehensive topic coverage for each tech stack
 */
const getTechStackTopics = (techStack) => {
    const topicMap = {
        "JavaScript": "Variables, Functions, Objects, Arrays, ES6+ features, Promises, Async/Await, DOM manipulation, Event handling, Closures, Prototypes, Hoisting, Scope",
        "Python": "Data types, Control structures, Functions, Classes, Modules, File handling, Exception handling, Decorators, Generators, Lambda functions, Libraries (NumPy, Pandas)",
        "Java": "OOP concepts, Collections, Inheritance, Polymorphism, Encapsulation, Exception handling, Multithreading, JDBC, Spring framework, JVM concepts",
        "C++": "Pointers, References, Classes, Inheritance, Polymorphism, Templates, STL containers, Memory management, Operator overloading, Virtual functions",
        "C#": ".NET framework, Classes, Objects, LINQ, Entity framework, ASP.NET, WPF, Exception handling, Delegates, Events, Generics",
        "React.js": "Components, JSX, Props, State, Hooks, Context API, Redux, Router, Lifecycle methods, Virtual DOM, Event handling",
        "Node.js": "Express.js, NPM, Modules, File system, HTTP modules, Middleware, REST APIs, Database integration, Authentication, Error handling",
        "Angular": "Components, Services, Directives, Routing, Forms, HTTP client, Dependency injection, Observables, TypeScript integration",
        "Vue.js": "Components, Directives, Vue CLI, Vuex, Vue Router, Computed properties, Watchers, Lifecycle hooks, Single file components",
        "Django": "Models, Views, Templates, URLs, Forms, Admin interface, ORM, Middleware, Authentication, REST framework",
        "Flask": "Routes, Templates, Blueprints, Session management, Database integration, Forms, Authentication, RESTful APIs",
        "Spring Boot": "Dependency injection, Auto-configuration, Actuator, Data JPA, Security, REST controllers, Microservices",
        "Express.js": "Routing, Middleware, Template engines, Session management, Authentication, Error handling, RESTful APIs",
        "MongoDB": "Collections, Documents, Queries, Indexing, Aggregation, Replication, Sharding, GridFS, Atlas",
        "MySQL": "Tables, Queries, Joins, Indexes, Stored procedures, Triggers, Transactions, Normalization, Optimization",
        "PostgreSQL": "Advanced SQL, JSON support, Indexes, Views, Stored functions, Triggers, Partitioning, Full-text search",
        "Redis": "Data structures, Caching, Pub/Sub, Persistence, Clustering, Sentinel, Pipelines, Transactions",
        "Docker": "Containers, Images, Dockerfile, Docker Compose, Volumes, Networks, Registry, Orchestration",
        "Kubernetes": "Pods, Services, Deployments, ConfigMaps, Secrets, Ingress, Namespaces, Helm charts",
        "AWS": "EC2, S3, RDS, Lambda, CloudFormation, IAM, VPC, Load Balancers, Auto Scaling, CloudWatch",
        "Azure": "Virtual Machines, Storage, SQL Database, Functions, Resource Manager, Active Directory, Load Balancer",
        "Google Cloud": "Compute Engine, Cloud Storage, BigQuery, Cloud Functions, Kubernetes Engine, Firebase",
        "Git": "Version control, Branching, Merging, Rebasing, Pull requests, Conflict resolution, Git flow",
        "Linux": "File system, Commands, Shell scripting, Process management, Permissions, Networking, System administration",
        "Machine Learning": "Supervised/Unsupervised learning, Neural networks, Feature engineering, Model evaluation, Scikit-learn, TensorFlow",
        "Data Structures & Algorithms": "Arrays, Linked lists, Stacks, Queues, Trees, Graphs, Sorting, Searching, Dynamic programming",
        "System Design": "Scalability, Load balancing, Databases, Caching, Microservices, APIs, Message queues",
        "DevOps": "CI/CD, Infrastructure as Code, Monitoring, Logging, Automation, Configuration management",
        "Cybersecurity": "Encryption, Authentication, Authorization, Vulnerabilities, Penetration testing, Security protocols",
        "Blockchain": "Distributed ledger, Smart contracts, Consensus algorithms, Cryptocurrency, DeFi, NFTs",
        "Mobile Development": "Native vs Cross-platform, UI/UX design, App lifecycle, APIs, Push notifications, App store deployment",
        "Web Development": "HTML, CSS, JavaScript, Responsive design, RESTful APIs, Security, Performance optimization",
        "Software Engineering": "SDLC, Agile methodologies, Testing, Code review, Documentation, Design patterns",
        "Database Management": "RDBMS, NoSQL, Query optimization, Indexing, Transactions, Backup and recovery",
        "Cloud Computing": "IaaS, PaaS, SaaS, Virtualization, Containerization, Serverless, Multi-cloud strategies",
        "Artificial Intelligence": "Machine learning, Deep learning, NLP, Computer vision, Expert systems, AI ethics"
    };

    return topicMap[techStack] || "General programming concepts, Problem solving, Algorithms, Best practices";
};

/**
 * Generate MCQs for computer science topics
 */
export const generateCSMCQs = async (req, res) => {
    try {
        let { techStack, topic = "Miscellaneous", count = 10 } = req.body;
        count = Math.min(Math.max(parseInt(count) || 10, 1), 30);

        console.log(`🤖 Generating ${count} CS MCQs for ${techStack} on topic: ${topic}`);

        // Validate tech stack
        if (!techStack || techStack.trim() === "") {
            console.error('❌ Invalid tech stack:', techStack);
            return res.status(400).json({ error: "Invalid or missing tech stack name." });
        }

        const techTopics = getTechStackTopics(techStack);

        // Create comprehensive prompt based on tech stack and topic
        let prompt;
        if (topic === "Miscellaneous" || topic.toLowerCase() === "miscellaneous") {
            prompt = `You are an expert computer science quiz generator. Generate exactly ${count} multiple-choice questions (4 options each) for "${techStack}".

TECHNOLOGY COVERAGE: ${techTopics}

Since topic is "Miscellaneous", create a comprehensive test that covers ALL major aspects of ${techStack}. Distribute questions across different concepts proportionally.

CRITICAL REQUIREMENTS:
1. Focus specifically on ${techStack} concepts, syntax, and best practices
2. Include practical coding scenarios and real-world applications
3. Cover both theoretical concepts and practical implementation
4. Include questions on common pitfalls and debugging scenarios
5. Ensure questions are up-to-date with latest ${techStack} standards
6. Mix difficulty levels: 30% beginner, 50% intermediate, 20% advanced

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string],
  "answer": string,
  "explanation": string (2-3 sentences explaining the concept and why this answer is correct)
}

Where "answer" must exactly equal one of the options. Make questions challenging yet fair for ${techStack} developers.`;
        } else {
            prompt = `You are an expert computer science quiz generator. Generate exactly ${count} multiple-choice questions (4 options each) specifically on the topic "${topic}" for "${techStack}".

TECHNOLOGY CONTEXT: ${techStack}
TECHNOLOGY CONCEPTS: ${techTopics}
SPECIFIC TOPIC: ${topic}

CRITICAL REQUIREMENTS:
1. ALL questions must be strictly focused on the topic "${topic}" within ${techStack}
2. Include practical coding examples and scenarios related to ${topic}
3. Cover both theoretical understanding and practical application of ${topic}
4. Include edge cases and common mistakes related to ${topic}
5. Ensure questions are technically accurate and up-to-date
6. Mix difficulty levels appropriate for ${topic} in ${techStack}

Return output as a JSON array only (no extra text). Each element must be an object with keys:
{
  "question": string,
  "options": [string, string, string, string],
  "answer": string,
  "explanation": string (2-3 sentences explaining the concept and why this answer is correct)
}

Where "answer" must exactly equal one of the options. Focus specifically on ${topic} concepts within ${techStack}.`;
        }

        let mcqs = [];

        try {
            const model = getGeminiModel();
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            console.log('✅ Received response from Gemini API');

            mcqs = extractAndParseJSON(text);

            if (!Array.isArray(mcqs) || !mcqs.length) {
                throw new Error('Invalid response format from AI');
            }

            const finalMcqs = mcqs.slice(0, count);
            console.log(`✅ Successfully generated ${finalMcqs.length} MCQs for ${techStack}`);

            res.json({
                mcqs: finalMcqs,
                techStack,
                topic,
                fallback: false,
                generated: new Date().toISOString()
            });

        } catch (err) {
            console.error("❌ Gemini generation failed:", err.message);

            // Return error response indicating API limit hit - no fallback questions
            return res.status(503).json({
                error: "API_LIMIT_HIT",
                message: "The API Hit Limit. Please Try Again",
                techStack,
                topic,
                fallback: true
            });
        }

    } catch (error) {
        console.error("❌ generateCSMCQs error:", error);
        res.status(500).json({
            error: "Failed to generate MCQs",
            details: error.message
        });
    }
};