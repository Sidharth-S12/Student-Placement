// Comprehensive database of 45+ industry job roles with required technical skills,
// keyword aliases for ATS parsing, soft skills, typical placement salaries, top recruiters,
// and curated certifications/learning paths.

export const JOB_CATEGORIES = [
  "All Roles",
  "Software Engineering",
  "Data Science & AI",
  "Cloud & DevOps",
  "Cybersecurity",
  "Testing & QA",
  "Design & Product",
  "Emerging Tech"
];

export const JOB_ROLES_DATA = {
  // ==========================================
  // SOFTWARE ENGINEERING
  // ==========================================
  "Software Engineer (SDE)": {
    category: "Software Engineering",
    description: "Designs, develops, tests, and maintains robust software systems, algorithms, and backend services.",
    salaryRange: "₹6,00,000 - ₹18,00,000 / year",
    topCompanies: ["Google", "Microsoft", "Amazon", "Adobe", "Flipkart", "TCS Digital", "Infosys"],
    technical: {
      "Data Structures & Algorithms": ["dsa", "data structures", "algorithms", "arrays", "trees", "graphs", "dynamic programming"],
      "Python / Java / C++": ["python", "java", "c++", "cpp", "c programming"],
      "Object-Oriented Programming (OOP)": ["oop", "object-oriented", "polymorphism", "inheritance", "encapsulation"],
      "Git & Version Control": ["git", "github", "gitlab", "version control"],
      "SQL & Relational Databases": ["sql", "mysql", "postgresql", "sqlite", "relational database"],
      "RESTful APIs": ["api", "apis", "rest", "restful", "http"],
      "Unit Testing & Debugging": ["unit testing", "testing", "junit", "pytest", "jest", "debugging"],
      "Operating Systems & Multithreading": ["operating systems", "os", "multithreading", "concurrency", "processes", "threads"],
      "System Design Basics": ["system design", "low-level design", "lld", "hld", "architecture"],
      "Software Development Lifecycle (SDLC)": ["sdlc", "agile", "scrum", "software development"]
    },
    soft: ["Problem Solving", "Analytical Thinking", "Effective Communication", "Team Collaboration", "Debugging Persistence"],
    certifications: [
      { name: "GitHub Foundations Certification", provider: "GitHub", url: "https://resources.github.com/learn/certifications/" },
      { name: "Oracle Certified Professional: Java SE Programmer", provider: "Oracle", url: "https://education.oracle.com/java-se-programmer-i/pexam_1Z0-815" }
    ],
    courses: [
      { name: "Data Structures & Algorithms in Java/C++", provider: "GeeksforGeeks / LeetCode", url: "https://leetcode.com/explore/" },
      { name: "Computer Science Career Path", provider: "Codecademy", url: "https://www.codecademy.com/learn/paths/computer-science" }
    ]
  },

  "Frontend Developer": {
    category: "Software Engineering",
    description: "Builds responsive, high-performance, and visually appealing web user interfaces.",
    salaryRange: "₹4,50,000 - ₹14,00,000 / year",
    topCompanies: ["Swiggy", "Zomato", "Razorpay", "CRED", "Accenture", "Cognizant", "Wipro"],
    technical: {
      "HTML5 & Semantic Markup": ["html", "html5", "semantic html", "web accessibility", "a11y"],
      "CSS3 & Responsive Design": ["css", "css3", "flexbox", "css grid", "responsive design", "media queries"],
      "JavaScript (ES6+)": ["javascript", "js", "es6", "vanilla js", "dom manipulation", "async/await"],
      "React.js": ["react", "react.js", "reactjs", "react hooks", "jsx"],
      "TypeScript": ["typescript", "ts"],
      "Tailwind CSS / CSS Frameworks": ["tailwind", "tailwindcss", "bootstrap", "sass", "styled-components"],
      "State Management (Redux/Zustand)": ["redux", "zustand", "context api", "state management"],
      "Git & GitHub": ["git", "github"],
      "REST APIs & Fetch/Axios": ["fetch", "axios", "rest api", "ajax", "api integration"],
      "Web Performance & Bundlers": ["webpack", "vite", "lighthouse", "performance optimization", "lazy loading"]
    },
    soft: ["Design Sensibility", "Attention to Detail", "Cross-browser Empathy", "Effective Communication", "User-Centric Thinking"],
    certifications: [
      { name: "Meta Front-End Developer Professional Certificate", provider: "Meta / Coursera", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
      { name: "freeCodeCamp Responsive Web Design & JavaScript", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/" }
    ],
    courses: [
      { name: "The Complete 2026 Web Development Bootcamp", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "Frontend Masters React Path", provider: "Frontend Masters", url: "https://frontendmasters.com/" }
    ]
  },

  "Backend Developer (Node.js)": {
    category: "Software Engineering",
    description: "Creates scalable server-side applications, microservices, and database pipelines using Node.js.",
    salaryRange: "₹5,00,000 - ₹16,00,000 / year",
    topCompanies: ["Paytm", "PhonePe", "Uber", "Amazon", "Infosys", "Deloitte"],
    technical: {
      "JavaScript & TypeScript": ["javascript", "typescript", "node", "nodejs", "node.js"],
      "Express.js / NestJS": ["express", "express.js", "nestjs", "fastify", "koa"],
      "REST & GraphQL APIs": ["rest api", "restful", "graphql", "crud", "api design"],
      "SQL (PostgreSQL / MySQL)": ["postgresql", "mysql", "sql", "sequelize", "prisma", "typeorm"],
      "NoSQL (MongoDB / Redis)": ["mongodb", "mongo", "mongoose", "redis", "caching"],
      "Authentication & JWT": ["jwt", "json web token", "oauth", "bcrypt", "authentication", "authorization"],
      "Git & CI/CD": ["git", "github", "ci/cd", "docker basics"],
      "Unit Testing (Jest/Mocha)": ["jest", "mocha", "chai", "supertest", "unit testing"],
      "System Design & Microservices": ["microservices", "architecture", "scalability", "load balancing", "message queue", "rabbitmq"],
      "Asynchronous Event Loop": ["event loop", "promises", "async/await", "streams", "buffers"]
    },
    soft: ["Analytical Troubleshooting", "Clean Code Mindset", "Systematic Problem Solving", "Collaboration"],
    certifications: [
      { name: "OpenJS Node.js Application Developer (JAD)", provider: "Linux Foundation", url: "https://training.linuxfoundation.org/certification/jsnad/" },
      { name: "AWS Certified Developer – Associate", provider: "AWS", url: "https://aws.amazon.com/certification/" }
    ],
    courses: [
      { name: "Node.js, Express, MongoDB & More: The Complete Bootcamp", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "Full Stack Open (Backend Part)", provider: "University of Helsinki", url: "https://fullstackopen.com/en/" }
    ]
  },

  "Backend Developer (Java / Spring Boot)": {
    category: "Software Engineering",
    description: "Architects enterprise-grade backend microservices and reliable transaction systems using Java & Spring.",
    salaryRange: "₹5,50,000 - ₹17,00,000 / year",
    topCompanies: ["Morgan Stanley", "JPMorgan Chase", "Oracle", "Goldman Sachs", "TCS", "Capgemini", "Wipro"],
    technical: {
      "Java (Core & Advanced)": ["java", "core java", "java 8", "java 17", "jvm", "streams", "collections"],
      "Spring Boot & Spring Cloud": ["spring", "spring boot", "spring mvc", "spring cloud", "spring security"],
      "Hibernate / JPA": ["hibernate", "jpa", "orm", "entity manager"],
      "SQL & Relational Databases": ["sql", "mysql", "oracle", "postgresql", "stored procedures"],
      "RESTful Web Services": ["rest", "restful", "web services", "json", "microservices"],
      "Data Structures & Algorithms": ["data structures", "dsa", "algorithms", "time complexity"],
      "Git & Maven / Gradle": ["git", "maven", "gradle", "dependency management"],
      "Testing (JUnit, Mockito)": ["junit", "mockito", "test-driven development", "tdd"],
      "Message Brokers (Kafka / RabbitMQ)": ["kafka", "apache kafka", "rabbitmq", "activemq"],
      "Docker & Deployment": ["docker", "containerization", "kubernetes", "ci/cd"]
    },
    soft: ["Enterprise Architecture Thinking", "Detail Orientation", "Code Review Diligence", "Communication"],
    certifications: [
      { name: "Spring Certified Professional", provider: "VMware / Broadcom", url: "https://www.vmware.com/learning/certification/spring-certified-pro.html" },
      { name: "Oracle Certified Professional: Java SE Developer", provider: "Oracle", url: "https://education.oracle.com/" }
    ],
    courses: [
      { name: "Spring Boot 3 & Spring Framework 6 Master Class", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "Java Enterprise Architecture Path", provider: "Coursera", url: "https://www.coursera.org/" }
    ]
  },

  "Backend Developer (Python / Django)": {
    category: "Software Engineering",
    description: "Develops rapid, secure server systems, high-speed APIs, and data integration pipelines using Python.",
    salaryRange: "₹5,00,000 - ₹15,00,000 / year",
    topCompanies: ["Cisco", "Intel", "IBM", "Swiggy", "Zoho", "ThoughtWorks"],
    technical: {
      "Python 3 (Advanced)": ["python", "python3", "oop", "generators", "decorators", "asyncio"],
      "Django & Django REST Framework (DRF)": ["django", "django rest framework", "drf", "django orm"],
      "FastAPI & Flask": ["fastapi", "flask", "pydantic", "starlette", "uvicorn"],
      "PostgreSQL & MySQL": ["postgresql", "mysql", "sql", "sqlite", "database indexing"],
      "Redis & Celery": ["redis", "celery", "task queue", "caching", "background jobs"],
      "RESTful API Design": ["rest api", "api documentation", "swagger", "openapi"],
      "Git & GitHub": ["git", "github", "gitlab"],
      "Docker & Linux": ["docker", "linux", "bash", "nginx", "gunicorn"],
      "Testing (pytest / unittest)": ["pytest", "unittest", "mocking", "test coverage"],
      "Data Structures & Algorithms": ["dsa", "data structures", "algorithms"]
    },
    soft: ["Clean Code Practices", "Problem Solving", "Documentation Habits", "Team Collaboration"],
    certifications: [
      { name: "Certified Associate in Python Programming (PCAP)", provider: "Python Institute", url: "https://pythoninstitute.org/pcap" },
      { name: "AWS Certified Developer – Associate", provider: "AWS", url: "https://aws.amazon.com/certification/" }
    ],
    courses: [
      { name: "FastAPI - The Complete Course", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "Python and Django Full Stack Bootcamp", provider: "Coursera / Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Full Stack Developer (MERN)": {
    category: "Software Engineering",
    description: "Builds complete web applications end-to-end using MongoDB, Express.js, React.js, and Node.js.",
    salaryRange: "₹5,00,000 - ₹16,00,000 / year",
    topCompanies: ["Flipkart", "Paytm", "InMobi", "TCS", "Infosys", "Mindtree", "Startups"],
    technical: {
      "React.js & Frontend": ["react", "react.js", "reactjs", "react hooks", "redux", "html5", "css3"],
      "Node.js & Express.js": ["node", "nodejs", "express", "express.js", "rest api"],
      "MongoDB & Mongoose": ["mongodb", "mongoose", "nosql", "aggregation", "database"],
      "JavaScript & ES6+": ["javascript", "js", "es6", "async/await", "dom"],
      "TypeScript": ["typescript", "ts"],
      "Git & Version Control": ["git", "github", "version control"],
      "Authentication (JWT / OAuth)": ["jwt", "oauth", "authentication", "authorization", "bcrypt"],
      "Tailwind CSS": ["tailwind", "tailwindcss", "responsive design", "bootstrap"],
      "Deployment (Vercel / Render / AWS)": ["vercel", "render", "netlify", "aws", "docker", "deployment"],
      "API Integration & Postman": ["postman", "axios", "fetch", "restful", "crud"]
    },
    soft: ["Agile Mindset", "Full-Stack Versatility", "Clear Communication", "Debugging Tenacity"],
    certifications: [
      { name: "Meta Full-Stack Developer Professional Certificate", provider: "Meta / Coursera", url: "https://www.coursera.org/professional-certificates/meta-full-stack-developer" },
      { name: "MongoDB Associate Developer", provider: "MongoDB University", url: "https://learn.mongodb.com/" }
    ],
    courses: [
      { name: "Full Stack Open (Deep Dive to Modern Web Development)", provider: "University of Helsinki", url: "https://fullstackopen.com/en/" },
      { name: "The MERN Fullstack Guide", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Android App Developer (Kotlin)": {
    category: "Software Engineering",
    description: "Engineers native mobile experiences for Android smartphones and tablets using Kotlin and Jetpack Compose.",
    salaryRange: "₹4,50,000 - ₹15,00,000 / year",
    topCompanies: ["PhonePe", "Flipkart", "Swiggy", "Google", "Samsung", "Ola"],
    technical: {
      "Kotlin Programming": ["kotlin", "java", "coroutines", "flow", "extension functions"],
      "Jetpack Compose & XML UI": ["jetpack compose", "compose", "xml", "views", "material design"],
      "Android SDK & Architecture": ["android sdk", "activity", "fragment", "lifecycle", "services"],
      "MVVM / MVI Architecture": ["mvvm", "mvi", "viewmodel", "livedata", "clean architecture"],
      "Room Database & SQLite": ["room", "sqlite", "local storage", "orm"],
      "Retrofit & REST APIs": ["retrofit", "okhttp", "rest api", "json", "moshi", "gson"],
      "Dependency Injection (Hilt / Dagger)": ["hilt", "dagger", "dagger2", "dependency injection"],
      "Git & Version Control": ["git", "github", "gitlab"],
      "Unit & UI Testing": ["junit", "espresso", "mockk", "testing"],
      "Google Play Store Deployment": ["play console", "apk", "aab", "app bundle", "publishing"]
    },
    soft: ["User Experience Awareness", "Mobile Device Resource Awareness", "Problem Solving", "Adaptability"],
    certifications: [
      { name: "Associate Android Developer Certification", provider: "Google Developers", url: "https://developers.google.com/certification/associate-android-developer" }
    ],
    courses: [
      { name: "Android Basics with Compose", provider: "Google Developer Training", url: "https://developer.android.com/courses/android-basics-compose/course" }
    ]
  },

  "iOS App Developer (Swift)": {
    category: "Software Engineering",
    description: "Crafts elegant, high-performance native iOS applications for iPhone and iPad using Swift and SwiftUI.",
    salaryRange: "₹5,50,000 - ₹18,00,000 / year",
    topCompanies: ["Apple", "Uber", "CRED", "Myntra", "Wipro", "Infosys"],
    technical: {
      "Swift Programming": ["swift", "swift 5", "closures", "generics", "protocols", "optionals"],
      "SwiftUI & UIKit": ["swiftui", "uikit", "autolayout", "storyboard", "combine"],
      "iOS Architecture (MVVM / VIPER)": ["mvvm", "viper", "clean swift", "architecture"],
      "CoreData & SwiftData": ["coredata", "core data", "swiftdata", "userdefaults", "persistence"],
      "URLSession & REST APIs": ["urlsession", "alamofire", "rest api", "codable", "json"],
      "Git & Xcode Tools": ["xcode", "git", "github", "instruments", "cocoapods", "spm"],
      "Unit & UI Testing (XCTest)": ["xctest", "unit testing", "ui testing"],
      "App Store Guidelines & TestFlight": ["app store", "testflight", "certificates", "provisioning"],
      "Apple Human Interface Guidelines": ["hig", "human interface guidelines", "accessibility"],
      "Async/Await & Concurrency": ["async/await", "actors", "concurrency", "grand central dispatch", "gcd"]
    },
    soft: ["Pixel Perfection", "App Usability Intuition", "Attention to Detail", "Communication"],
    certifications: [
      { name: "App Development with Swift Certified User", provider: "Apple / Certiport", url: "https://certiport.pearsonvue.com/Certifications/Apple/App-Dev-With-Swift" }
    ],
    courses: [
      { name: "100 Days of SwiftUI", provider: "Hacking with Swift (Paul Hudson)", url: "https://www.hackingwithswift.com/100/swiftui" }
    ]
  },

  "Cross-Platform Mobile Developer (Flutter)": {
    category: "Software Engineering",
    description: "Builds unified, high-framerate mobile apps for iOS and Android from a single codebase using Flutter & Dart.",
    salaryRange: "₹4,50,000 - ₹14,00,000 / year",
    topCompanies: ["BMW", "Alibaba", "Tencent", "Grab", "Zoho", "Lenskart"],
    technical: {
      "Dart Programming": ["dart", "oop", "async/await", "null safety", "streams"],
      "Flutter Framework & Widgets": ["flutter", "widgets", "stateless", "stateful", "custom widgets"],
      "State Management (Bloc / Riverpod / Provider)": ["bloc", "riverpod", "provider", "getx", "state management"],
      "REST APIs & HTTP / Dio": ["dio", "http", "rest api", "json serialization"],
      "Local Storage (Hive / SQLite / SharedPrefs)": ["hive", "sqflite", "shared preferences", "local database"],
      "Firebase Integration": ["firebase", "firestore", "push notifications", "fcm", "auth"],
      "Git & CI/CD": ["git", "github", "fastlane", "codemagic"],
      "Native Device Features (Camera, GPS)": ["geolocator", "camera", "permissions", "platform channels"],
      "App Store & Play Store Deployment": ["app store", "play store", "build", "release"],
      "Animations & UI Responsiveness": ["flutter animations", "hero animation", "responsive layout"]
    },
    soft: ["Multiplatform Empathy", "Visual Aesthetics", "Fast Prototyping", "Problem Solving"],
    certifications: [
      { name: "Flutter Certified Application Developer", provider: "Flutter / Android ATC", url: "https://androidatc.com/" }
    ],
    courses: [
      { name: "The Complete Flutter Development Bootcamp with Dart", provider: "Udemy / App Brewery", url: "https://www.udemy.com/" }
    ]
  },

  "Embedded Systems Engineer (C/C++)": {
    category: "Software Engineering",
    description: "Programs microcontrollers, firmware, and embedded IoT hardware using C, C++, and low-level protocols.",
    salaryRange: "₹5,00,000 - ₹16,00,000 / year",
    topCompanies: ["Bosch", "Qualcomm", "Texas Instruments", "Intel", "NXP", "L&T Technology Services"],
    technical: {
      "C Programming (Embedded)": ["c", "embedded c", "pointers", "bit manipulation", "memory management"],
      "C++ Programming": ["c++", "cpp", "oop", "embedded c++"],
      "Microcontrollers (ARM, STM32, ESP32, AVR)": ["microcontroller", "arm", "cortex-m", "stm32", "esp32", "arduino", "pic"],
      "Communication Protocols (I2C, SPI, UART, CAN)": ["i2c", "spi", "uart", "can", "can bus", "rs-232", "ble"],
      "Real-Time Operating Systems (FreeRTOS)": ["rtos", "freertos", "real-time", "tasks", "semaphores", "mutex"],
      "Hardware Debugging (Oscilloscope, Logic Analyzer)": ["jtag", "swd", "oscilloscope", "logic analyzer", "debugging"],
      "Device Drivers & Register-Level Coding": ["device driver", "gpio", "timer", "adc", "dma", "registers"],
      "PCB Basics & Schematics": ["pcb", "schematics", "hardware", "kicad", "altium"],
      "Git & Embedded Toolchains": ["git", "keil", "cubeide", "gcc", "make", "cmake"],
      "IoT Protocols (MQTT, CoAP)": ["mqtt", "coap", "iot", "sensor interfacing"]
    },
    soft: ["Meticulous Attention to Detail", "Hardware-Software Patience", "Analytical Rigor", "Safety Mindset"],
    certifications: [
      { name: "ARM Certified Engineer", provider: "ARM", url: "https://www.arm.com/" }
    ],
    courses: [
      { name: "Mastering Microcontroller with Embedded Driver Development", provider: "Udemy / FastBit", url: "https://www.udemy.com/" }
    ]
  },

  // ==========================================
  // DATA SCIENCE, AI & MACHINE LEARNING
  // ==========================================
  "Data Analyst": {
    category: "Data Science & AI",
    description: "Transforms raw corporate data into actionable business intelligence through dashboards and statistical analysis.",
    salaryRange: "₹4,50,000 - ₹12,00,000 / year",
    topCompanies: ["Deloitte", "EY", "KPMG", "PwC", "Mu Sigma", "Fractal Analytics", "Amazon"],
    technical: {
      "SQL (Complex Queries & Joins)": ["sql", "mysql", "postgresql", "joins", "subqueries", "window functions", "group by"],
      "Python for Data Analysis": ["python", "pandas", "numpy", "matplotlib", "seaborn"],
      "Microsoft Excel & Advanced Spreadsheets": ["excel", "vlookup", "xlookup", "pivot tables", "index match", "macros"],
      "Power BI / Tableau": ["power bi", "powerbi", "tableau", "dax", "dashboard", "data visualization"],
      "Statistical Analysis": ["statistics", "hypothesis testing", "p-value", "regression", "probability", "correlation"],
      "Data Cleaning & Preprocessing": ["data cleaning", "etl", "data wrangling", "missing value treatment"],
      "Business Metrics & KPIs": ["kpi", "metrics", "roi", "churn", "retention", "a/b testing"],
      "Exploratory Data Analysis (EDA)": ["eda", "exploratory data analysis", "outlier detection"],
      "Data Storytelling & Reporting": ["reporting", "presentation", "insights", "storytelling"],
      "Basic Machine Learning": ["scikit-learn", "linear regression", "logistic regression", "clustering"]
    },
    soft: ["Business Acumen", "Curiosity", "Critical Thinking", "Stakeholder Communication", "Attention to Detail"],
    certifications: [
      { name: "Google Data Analytics Professional Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/" }
    ],
    courses: [
      { name: "SQL for Data Science", provider: "UC Davis / Coursera", url: "https://www.coursera.org/learn/sql-for-data-science" },
      { name: "Python for Data Science and Machine Learning Bootcamp", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Data Scientist": {
    category: "Data Science & AI",
    description: "Leverages predictive modeling, deep statistical methods, and machine learning to uncover breakthrough insights.",
    salaryRange: "₹7,00,000 - ₹20,00,000 / year",
    topCompanies: ["Microsoft", "Amazon", "Walmart Global Tech", "Tiger Analytics", "Flipkart", "Accenture AI"],
    technical: {
      "Python & Scientific Stack": ["python", "numpy", "pandas", "scipy", "scikit-learn"],
      "Statistics & Probability": ["statistics", "probability", "bayesian", "inferential statistics", "hypothesis testing"],
      "Machine Learning Algorithms": ["machine learning", "random forest", "xgboost", "gradient boosting", "svm", "knn", "clustering"],
      "Deep Learning Basics": ["deep learning", "neural networks", "tensorflow", "keras", "pytorch"],
      "SQL & Advanced Data Extraction": ["sql", "postgresql", "spark sql", "database"],
      "Feature Engineering & Selection": ["feature engineering", "pca", "dimensionality reduction", "encoding"],
      "Data Visualization (Seaborn/Plotly)": ["matplotlib", "seaborn", "plotly", "data visualization"],
      "Model Evaluation & Metrics": ["roc-auc", "f1 score", "precision", "recall", "cross-validation", "confusion matrix"],
      "Big Data Tools (Spark / Hadoop)": ["pyspark", "spark", "hadoop", "big data"],
      "Git & Reproducible Research": ["git", "github", "jupyter", "experiment tracking"]
    },
    soft: ["Scientific Rigor", "Hypothesis Formulation", "Business Value Translation", "Storytelling with Data"],
    certifications: [
      { name: "IBM Data Science Professional Certificate", provider: "IBM / Coursera", url: "https://www.coursera.org/professional-certificates/ibm-data-science" },
      { name: "Google Advanced Data Analytics Professional Certificate", provider: "Google", url: "https://www.coursera.org/professional-certificates/google-advanced-data-analytics" }
    ],
    courses: [
      { name: "Applied Data Science with Python Specialization", provider: "University of Michigan / Coursera", url: "https://www.coursera.org/" }
    ]
  },

  "Machine Learning Engineer": {
    category: "Data Science & AI",
    description: "Builds, deploys, and scales production machine learning pipelines and real-time inference systems.",
    salaryRange: "₹8,00,000 - ₹22,00,000 / year",
    topCompanies: ["NVIDIA", "Meta", "Google", "Amazon", "Adobe", "Qualcomm", "Ola Electric"],
    technical: {
      "Python & OOP": ["python", "oop", "numpy", "pandas"],
      "Machine Learning Frameworks": ["scikit-learn", "sklearn", "xgboost", "lightgbm"],
      "Deep Learning (PyTorch / TensorFlow)": ["pytorch", "tensorflow", "keras", "neural networks", "cnn", "rnn", "transformers"],
      "Linear Algebra & Calculus": ["linear algebra", "multivariate calculus", "optimization", "gradient descent"],
      "Model Deployment & FastAPI / Flask": ["fastapi", "flask", "model serving", "rest api", "triton", "onnx"],
      "Docker & Containerization": ["docker", "dockerfile", "containerization", "kubernetes"],
      "MLOps & Experiment Tracking (MLflow/Weights&Biases)": ["mlflow", "wandb", "dvc", "experiment tracking", "model registry"],
      "SQL & Feature Stores": ["sql", "feast", "database", "data pipeline"],
      "Cloud ML (AWS SageMaker / GCP Vertex)": ["sagemaker", "vertex ai", "azure ml", "cloud ml"],
      "Git & CI/CD for ML": ["git", "github", "cml", "ci/cd"]
    },
    soft: ["Iterative Experimentation", "Mathematical Intuition", "Cross-Functional Collaboration", "Problem Solving"],
    certifications: [
      { name: "AWS Certified Machine Learning – Specialty", provider: "AWS", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" },
      { name: "TensorFlow Developer Certificate", provider: "Google", url: "https://www.tensorflow.org/certificate" }
    ],
    courses: [
      { name: "Deep Learning Specialization", provider: "DeepLearning.AI / Andrew Ng", url: "https://www.coursera.org/specializations/deep-learning" },
      { name: "Full Stack Deep Learning", provider: "FSDL", url: "https://fullstackdeeplearning.com/" }
    ]
  },

  "NLP & LLM Engineer": {
    category: "Data Science & AI",
    description: "Develops state-of-the-art Natural Language Processing applications, Retrieval-Augmented Generation (RAG), and fine-tuned LLMs.",
    salaryRange: "₹9,00,000 - ₹25,00,000 / year",
    topCompanies: ["Microsoft", "Google", "OpenAI", "Cognizant AI", "Infosys Topaz", "AI Startups"],
    technical: {
      "Python & PyTorch": ["python", "pytorch", "hugging face", "transformers", "datasets"],
      "Large Language Models (LLMs) & Prompt Engineering": ["llm", "gpt", "llama", "mistral", "claude", "prompt engineering", "few-shot"],
      "LangChain / LlamaIndex": ["langchain", "llamaindex", "agents", "chains", "rag"],
      "Vector Databases (Pinecone / Chroma / Milvus / Qdrant)": ["vector database", "pinecone", "chromadb", "weaviate", "qdrant", "embeddings"],
      "Retrieval-Augmented Generation (RAG)": ["rag", "retrieval", "semantic search", "chunking", "re-ranking"],
      "Fine-Tuning (LoRA / QLoRA / PEFT)": ["fine-tuning", "lora", "qlora", "peft", "quantization", "bitsandbytes"],
      "NLP Fundamentals (Tokenization, TF-IDF, Word2Vec)": ["nlp", "tokenization", "spacy", "nltk", "named entity recognition", "sentiment analysis"],
      "FastAPI & Model Serving": ["fastapi", "rest api", "vllm", "tgi", "ollama"],
      "Evaluation & Benchmarking": ["ragas", "eval", "bleu", "rouge", "perplexity"],
      "Docker & Cloud Deployment": ["docker", "cloud", "aws", "gcp"]
    },
    soft: ["Linguistic Curiosity", "AI Ethics Awareness", "Rapid Prototyping", "Technical Communication"],
    certifications: [
      { name: "Generative AI with Large Language Models", provider: "DeepLearning.AI & AWS / Coursera", url: "https://www.coursera.org/learn/generative-ai-with-llms" }
    ],
    courses: [
      { name: "Hugging Face NLP Course", provider: "Hugging Face", url: "https://huggingface.co/learn/nlp-course" }
    ]
  },

  "Computer Vision Engineer": {
    category: "Data Science & AI",
    description: "Designs computer vision systems for image classification, object detection, video analytics, and autonomous perception.",
    salaryRange: "₹8,00,000 - ₹22,00,000 / year",
    topCompanies: ["Intel", "Qualcomm", "Bosch", "Tesla", "Samsung R&D", "TCS Research"],
    technical: {
      "OpenCV & Image Processing": ["opencv", "image processing", "filtering", "edge detection", "contours", "morphology"],
      "Deep Learning (PyTorch / TensorFlow)": ["pytorch", "tensorflow", "cnn", "convolutional neural networks", "resnet", "vgg"],
      "Object Detection (YOLO / Faster R-CNN)": ["yolo", "yolov8", "yolov5", "faster r-cnn", "object detection", "bounding box"],
      "Image Segmentation (U-Net / Mask R-CNN)": ["segmentation", "semantic segmentation", "u-net", "mask r-cnn"],
      "Python & NumPy": ["python", "numpy", "matplotlib", "scikit-image"],
      "Vision Transformers (ViT)": ["vision transformers", "vit", "clip", "attention"],
      "Model Optimization (TensorRT / OpenVINO / ONNX)": ["tensorrt", "openvino", "onnx", "quantization", "edge ai"],
      "Video Analytics & Tracking (DeepSORT)": ["deepsort", "object tracking", "video processing", "optical flow"],
      "Docker & GPU Acceleration (CUDA)": ["cuda", "gpu", "docker", "nvidia-docker"],
      "Git & Version Control": ["git", "github"]
    },
    soft: ["Spatial Reasoning", "Research Mindset", "Attention to Detail", "Problem Solving"],
    certifications: [
      { name: "Deep Learning Specialization - Vision Track", provider: "Coursera", url: "https://www.coursera.org/" }
    ],
    courses: [
      { name: "CS231n: Deep Learning for Computer Vision", provider: "Stanford Online", url: "http://cs231n.stanford.edu/" }
    ]
  },

  "Data Engineer": {
    category: "Data Science & AI",
    description: "Builds high-throughput ETL data pipelines, data warehouses, and streaming infrastructure for enterprise analytics.",
    salaryRange: "₹6,50,000 - ₹18,00,000 / year",
    topCompanies: ["Amazon", "Walmart", "American Express", "Target", "Infosys", "Wipro", "Tiger Analytics"],
    technical: {
      "SQL & Advanced Data Warehousing": ["sql", "data warehouse", "snowflake", "bigquery", "redshift", "star schema"],
      "Python / Scala for Data Engineering": ["python", "scala", "pyspark", "etl", "data processing"],
      "Apache Spark & Big Data Frameworks": ["spark", "apache spark", "hadoop", "mapreduce", "databricks"],
      "Data Orchestration (Apache Airflow)": ["airflow", "apache airflow", "dag", "orchestration", "cron"],
      "Streaming Data (Apache Kafka)": ["kafka", "apache kafka", "streaming", "event streaming", "flink"],
      "Data Modeling & Schema Design": ["data modeling", "dimension tables", "fact tables", "normalization"],
      "Cloud Storage (AWS S3 / Azure Data Lake)": ["s3", "blob storage", "data lake", "delta lake", "iceberg"],
      "Git & CI/CD for Data (dbt)": ["dbt", "data build tool", "git", "ci/cd"],
      "Linux & Bash Scripting": ["linux", "bash", "shell scripting"],
      "Docker & Kubernetes": ["docker", "kubernetes"]
    },
    soft: ["Pipeline Reliability Mindset", "Data Integrity Consciousness", "Collaboration", "Troubleshooting"],
    certifications: [
      { name: "AWS Certified Data Engineer – Associate", provider: "AWS", url: "https://aws.amazon.com/certification/" },
      { name: "Google Cloud Certified Professional Data Engineer", provider: "Google Cloud", url: "https://cloud.google.com/certification/data-engineer" }
    ],
    courses: [
      { name: "Data Engineering with AWS", provider: "Udacity", url: "https://www.udacity.com/" },
      { name: "Databricks Spark Developer Training", provider: "Databricks Academy", url: "https://www.databricks.com/learn" }
    ]
  },

  "Business Intelligence (BI) Analyst": {
    category: "Data Science & AI",
    description: "Translates complex operational datasets into executive Power BI / Tableau dashboards and KPI tracking reports.",
    salaryRange: "₹4,50,000 - ₹13,00,000 / year",
    topCompanies: ["Accenture", "Cognizant", "Deloitte", "Genpact", "Citibank", "Amazon"],
    technical: {
      "Power BI & DAX": ["power bi", "powerbi", "dax", "power query", "m code", "data modeling"],
      "Tableau Desktop": ["tableau", "tableau desktop", "calculated fields", "visualizations"],
      "SQL (Joins, Aggregations, Views)": ["sql", "mysql", "sql server", "tsql", "joins", "views"],
      "Advanced Microsoft Excel": ["excel", "pivot tables", "vlookup", "power pivot", "macros"],
      "Data Warehousing Concepts": ["data warehouse", "dimensional modeling", "star schema", "etl"],
      "KPI Definition & Metrics Tracking": ["kpi", "business metrics", "scorecard", "roi"],
      "Data Storytelling & Executive Presentations": ["storytelling", "executive presentation", "dashboards"],
      "Python for BI (Basic)": ["python", "pandas", "data cleaning"],
      "Data Governance & Quality": ["data quality", "data governance", "validation"],
      "Git / Version Tracking for Reports": ["git", "version control"]
    },
    soft: ["Business Strategy Acumen", "Active Listening", "Clear Presentation", "Detail-Oriented"],
    certifications: [
      { name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/" },
      { name: "Tableau Certified Desktop Specialist", provider: "Tableau / Salesforce", url: "https://www.tableau.com/learn/certification" }
    ],
    courses: [
      { name: "Business Analytics Specialization", provider: "Wharton / Coursera", url: "https://www.coursera.org/specializations/business-analytics" }
    ]
  },

  // ==========================================
  // CLOUD, DEVOPS & INFRASTRUCTURE
  // ==========================================
  "Cloud Engineer (AWS)": {
    category: "Cloud & DevOps",
    description: "Provisions, configures, and secures cloud infrastructure, compute instances, and virtual networks on AWS.",
    salaryRange: "₹5,50,000 - ₹17,00,000 / year",
    topCompanies: ["Amazon Web Services", "Infosys", "Capgemini", "LTIMindtree", "Cognizant", "TCS"],
    technical: {
      "AWS Core Compute (EC2, Lambda, ECS)": ["aws", "ec2", "lambda", "ecs", "serverless", "auto scaling"],
      "AWS Storage & Database (S3, RDS, DynamoDB)": ["s3", "rds", "dynamodb", "aurora", "ebs"],
      "AWS Networking (VPC, Subnets, Route 53)": ["vpc", "subnets", "route 53", "security groups", "nacl", "alb"],
      "Identity & Access Management (IAM)": ["iam", "policies", "roles", "mfa", "least privilege"],
      "Infrastructure as Code (Terraform / CloudFormation)": ["terraform", "cloudformation", "iac", "hcl"],
      "Linux Administration & Bash": ["linux", "bash", "shell scripting", "ssh", "systemctl"],
      "Docker & Containerization": ["docker", "dockerfile", "containers"],
      "Monitoring (CloudWatch, CloudTrail)": ["cloudwatch", "cloudtrail", "sns", "sqs", "monitoring"],
      "CI/CD Pipelines (CodePipeline / GitHub Actions)": ["codepipeline", "github actions", "ci/cd", "jenkins"],
      "Git & Version Control": ["git", "github"]
    },
    soft: ["Operational Vigilance", "Problem Solving", "Documentation Culture", "Cost Consciousness"],
    certifications: [
      { name: "AWS Certified Solutions Architect – Associate", provider: "AWS", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
      { name: "HashiCorp Certified: Terraform Associate", provider: "HashiCorp", url: "https://www.hashicorp.com/certification/terraform-associate" }
    ],
    courses: [
      { name: "AWS Certified Solutions Architect Associate Course", provider: "Udemy (Stephane Maarek)", url: "https://www.udemy.com/" }
    ]
  },

  "Cloud Engineer (Azure)": {
    category: "Cloud & DevOps",
    description: "Deploys, monitors, and administrates Microsoft Azure cloud infrastructure, Azure Active Directory, and virtual machines.",
    salaryRange: "₹5,50,000 - ₹16,50,000 / year",
    topCompanies: ["Microsoft", "Wipro", "TCS", "Accenture", "Hexaware", "EY"],
    technical: {
      "Azure Compute (VMs, App Services, Functions)": ["azure", "virtual machines", "app service", "azure functions", "serverless"],
      "Azure Storage & Databases (Blob, Azure SQL, Cosmos DB)": ["blob storage", "azure sql", "cosmos db", "storage accounts"],
      "Azure Networking (VNet, NSGs, Azure DNS, VPN)": ["vnet", "nsg", "virtual network", "load balancer", "azure front door"],
      "Azure Active Directory / Microsoft Entra ID": ["azure ad", "entra id", "iam", "rbac", "conditional access"],
      "Infrastructure as Code (Bicep / Terraform / ARM)": ["bicep", "arm templates", "terraform", "iac"],
      "Linux & PowerShell Administration": ["powershell", "linux", "azure cli", "bash"],
      "Azure DevOps & CI/CD": ["azure devops", "azure pipelines", "ci/cd", "repos"],
      "Docker & Azure Kubernetes Service (AKS)": ["docker", "aks", "kubernetes", "acr"],
      "Monitoring (Azure Monitor & Log Analytics)": ["azure monitor", "log analytics", "application insights"],
      "Git & GitHub": ["git", "github"]
    },
    soft: ["Enterprise Mindset", "Systematic Troubleshooting", "Security Awareness", "Collaboration"],
    certifications: [
      { name: "Microsoft Certified: Azure Administrator Associate (AZ-104)", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/" },
      { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/" }
    ],
    courses: [
      { name: "Microsoft Azure Administrator (AZ-104)", provider: "Microsoft Learn", url: "https://learn.microsoft.com/" }
    ]
  },

  "DevOps Engineer": {
    category: "Cloud & DevOps",
    description: "Automates software delivery, builds robust CI/CD pipelines, containerizes services, and manages infrastructure as code.",
    salaryRange: "₹6,00,000 - ₹18,00,000 / year",
    topCompanies: ["ThoughtWorks", "Red Hat", "Amazon", "Infosys", "Cisco", "Siemens"],
    technical: {
      "CI/CD Pipelines (Jenkins / GitHub Actions / GitLab CI)": ["ci/cd", "jenkins", "github actions", "gitlab ci", "continuous integration"],
      "Docker & Containerization": ["docker", "docker-compose", "dockerfile", "containerization"],
      "Kubernetes & Container Orchestration": ["kubernetes", "k8s", "helm", "pods", "deployments", "services"],
      "Infrastructure as Code (Terraform / Ansible)": ["terraform", "ansible", "iac", "configuration management"],
      "Linux System Administration & Bash": ["linux", "bash", "shell scripting", "cron", "systemd"],
      "Cloud Platform (AWS / Azure / GCP)": ["aws", "azure", "gcp", "cloud computing"],
      "Git & Branching Strategies": ["git", "github", "gitflow", "trunk-based development"],
      "Monitoring & Observability (Prometheus, Grafana)": ["prometheus", "grafana", "elk stack", "logstash", "datadog"],
      "Python / Go for Automation": ["python", "golang", "go", "scripting"],
      "Security & DevSecOps": ["devsecops", "sonarqube", "trivy", "vulnerability scanning"]
    },
    soft: ["Automation-First Instinct", "Incident Calmness", "Cross-Team Bridge-Building", "Analytical Thinking"],
    certifications: [
      { name: "Certified Kubernetes Administrator (CKA)", provider: "Linux Foundation / CNCF", url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/" },
      { name: "Docker Certified Associate", provider: "Docker / Mirantis", url: "https://www.docker.com/" }
    ],
    courses: [
      { name: "DevOps Beginners to Advanced with Projects", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "KodeKloud DevOps Learning Path", provider: "KodeKloud", url: "https://kodekloud.com/" }
    ]
  },

  "Site Reliability Engineer (SRE)": {
    category: "Cloud & DevOps",
    description: "Applies software engineering disciplines to ensure high availability, fault tolerance, and minimal downtime for large-scale production systems.",
    salaryRange: "₹7,50,000 - ₹20,00,000 / year",
    topCompanies: ["Google", "LinkedIn", "Uber", "Salesforce", "Atlassian", "PhonePe"],
    technical: {
      "System Reliability Metrics (SLI, SLO, SLA, Error Budgets)": ["sli", "slo", "sla", "error budget", "reliability"],
      "Linux Internals & Performance Tuning": ["linux", "kernel", "memory management", "tcp/ip", "strace", "sysstat"],
      "Kubernetes & Containerization": ["kubernetes", "k8s", "docker", "microservices"],
      "Observability (Prometheus, Grafana, OpenTelemetry)": ["prometheus", "grafana", "opentelemetry", "jaeger", "metrics"],
      "Automation & Scripting (Go / Python)": ["python", "golang", "go", "bash", "automation"],
      "Incident Response & Post-Mortem Analysis": ["incident response", "post-mortem", "on-call", "root cause analysis", "rca"],
      "Infrastructure as Code (Terraform)": ["terraform", "iac", "ansible"],
      "Networking & DNS Protocols": ["networking", "dns", "load balancer", "bgp", "tls", "http/2"],
      "Chaos Engineering": ["chaos engineering", "gremlin", "resilience testing"],
      "Git & CI/CD": ["git", "github", "ci/cd"]
    },
    soft: ["Crisis Leadership", "Blameless Accountability", "High Resilience", "Clear Written Communication"],
    certifications: [
      { name: "Certified Kubernetes Application Developer (CKAD)", provider: "CNCF", url: "https://training.linuxfoundation.org/" },
      { name: "Google Cloud Certified Professional Cloud DevOps Engineer", provider: "Google Cloud", url: "https://cloud.google.com/certification" }
    ],
    courses: [
      { name: "Site Reliability Engineering: Measuring and Managing Reliability", provider: "Coursera / Google", url: "https://www.coursera.org/learn/sre-measuring-and-managing-reliability" }
    ]
  },

  "Network Engineer": {
    category: "Cloud & DevOps",
    description: "Configures, optimizes, and secures enterprise LAN/WAN networks, routers, switches, and firewalls.",
    salaryRange: "₹4,00,000 - ₹12,00,000 / year",
    topCompanies: ["Cisco", "Juniper Networks", "Tata Communications", "Airtel", "Infosys", "HCLTech"],
    technical: {
      "TCP/IP & OSI Model": ["tcp/ip", "osi model", "ipv4", "ipv6", "subnetting", "vlsm"],
      "Routing Protocols (OSPF, BGP, EIGRP)": ["routing", "ospf", "bgp", "eigrp", "static routing"],
      "Switching & VLANs (STP, Trunking)": ["switching", "vlan", "stp", "spanning tree", "802.1q", "vtp"],
      "Network Hardware (Cisco / Juniper)": ["cisco", "juniper", "routers", "switches", "ios"],
      "Firewalls & VPNs (IPSec, SSL VPN)": ["firewall", "vpn", "ipsec", "nat", "acl", "access control list"],
      "Network Troubleshooting (Wireshark, Ping, Traceroute)": ["wireshark", "packet analysis", "traceroute", "ping", "netstat"],
      "DNS, DHCP & Network Services": ["dns", "dhcp", "snmp", "ntp", "ssh", "radius"],
      "Network Automation (Python, Netmiko)": ["python", "netmiko", "paramiko", "ansible"],
      "Wireless Networking (Wi-Fi, 802.11)": ["wireless", "wi-fi", "wlan", "ssid"],
      "Network Security Basics": ["network security", "ids/ips", "segmentation"]
    },
    soft: ["Methodical Troubleshooting", "Patience Under Pressure", "Clear Documentation"],
    certifications: [
      { name: "Cisco Certified Network Associate (CCNA 200-301)", provider: "Cisco", url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" },
      { name: "CompTIA Network+", provider: "CompTIA", url: "https://www.comptia.org/certifications/network" }
    ],
    courses: [
      { name: "Cisco CCNA 200-301 Complete Course", provider: "Udemy (Neil Anderson)", url: "https://www.udemy.com/" }
    ]
  },

  // ==========================================
  // CYBERSECURITY & COMPLIANCE
  // ==========================================
  "Cybersecurity Analyst (SOC Analyst)": {
    category: "Cybersecurity",
    description: "Monitors enterprise networks, analyzes security alerts, investigates incidents, and triages cyber threats.",
    salaryRange: "₹5,00,000 - ₹14,00,000 / year",
    topCompanies: ["IBM Security", "Wipro", "PwC", "Accenture Security", "TCS Cyber Defense", "Infosys"],
    technical: {
      "SIEM Tools (Splunk / Microsoft Sentinel / QRadar)": ["siem", "splunk", "sentinel", "qradar", "log analysis"],
      "Network Security & Protocols": ["networking", "tcp/ip", "firewalls", "ids/ips", "dns", "wireshark"],
      "Incident Response & Triage": ["incident response", "triage", "forensics", "playbooks", "alert handling"],
      "Linux & Windows Security": ["linux", "windows", "active directory", "sysinternals", "powershell"],
      "Threat Intelligence & MITRE ATT&CK": ["threat intelligence", "mitre att&ck", "indicators of compromise", "ioc"],
      "Vulnerability Assessment (Nessus / Qualys)": ["vulnerability assessment", "nessus", "qualys", "cve"],
      "Malware Analysis Basics": ["malware", "phishing analysis", "virustotal", "sandboxing"],
      "Python / Bash for Security Scripting": ["python", "bash", "scripting", "regex"],
      "Security Fundamentals & CIA Triad": ["cia triad", "cryptography", "encryption", "least privilege"],
      "Endpoint Detection & Response (EDR)": ["edr", "crowdstrike", "defender for endpoint", "carbon black"]
    },
    soft: ["Investigative Mindset", "High Vigilance", "Calm Under Attack", "Ethical Integrity"],
    certifications: [
      { name: "CompTIA Security+", provider: "CompTIA", url: "https://www.comptia.org/certifications/security" },
      { name: "Certified SOC Analyst (CSA)", provider: "EC-Council", url: "https://www.eccouncil.org/programs/certified-soc-analyst-csa/" }
    ],
    courses: [
      { name: "Google Cybersecurity Professional Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity" }
    ]
  },

  "Penetration Tester / Ethical Hacker": {
    category: "Cybersecurity",
    description: "Simulates adversarial cyberattacks to discover security vulnerabilities before malicious hackers can exploit them.",
    salaryRange: "₹6,00,000 - ₹18,00,000 / year",
    topCompanies: ["EY", "Deloitte", "FireEye / Mandiant", "CrowdStrike", "KPMG", "Bug Bounty Programs"],
    technical: {
      "Web Application Pentesting (OWASP Top 10)": ["owasp", "owasp top 10", "sql injection", "xss", "csrf", "ssrf"],
      "Burp Suite & Proxy Tools": ["burp suite", "zap", "owasp zap", "proxy", "request tampering"],
      "Kali Linux & Security Tools": ["kali linux", "nmap", "metasploit", "wireshark", "hydra", "john the ripper"],
      "Network Penetration Testing": ["network pentesting", "port scanning", "man-in-the-middle", "arp spoofing"],
      "Python / Bash Exploit Scripting": ["python", "bash", "exploit", "socket programming"],
      "Active Directory Attacks": ["active directory", "bloodhound", "kerberoasting", "mimikatz", "privilege escalation"],
      "Vulnerability Reporting & CVSS": ["cvss", "vulnerability reporting", "remediation", "proof of concept"],
      "API Security Testing": ["api security", "postman", "jwt attacks", "graphql security"],
      "Cryptography & Hash Cracking": ["cryptography", "hashing", "md5", "sha256", "hashcat"],
      "Git & Linux Administration": ["git", "linux", "permissions"]
    },
    soft: ["Adversarial Thinking", "Ethical Judgment", "Tenacity", "Clear Vulnerability Reporting"],
    certifications: [
      { name: "Certified Ethical Hacker (CEH)", provider: "EC-Council", url: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" },
      { name: "Offensive Security Certified Professional (OSCP)", provider: "OffSec", url: "https://www.offsec.com/courses/pen-200/" }
    ],
    courses: [
      { name: "Practical Ethical Hacking", provider: "TCM Security", url: "https://academy.tcm-sec.com/" },
      { name: "TryHackMe / HackTheBox Labs", provider: "TryHackMe", url: "https://tryhackme.com/" }
    ]
  },

  "Application Security (AppSec) Engineer": {
    category: "Cybersecurity",
    description: "Embeds security into the development lifecycle through SAST, DAST, secure code reviews, and threat modeling.",
    salaryRange: "₹7,00,000 - ₹19,00,000 / year",
    topCompanies: ["Salesforce", "Atlassian", "Adobe", "Razorpay", "PayPal", "Wipro"],
    technical: {
      "Secure Code Review": ["secure code review", "code review", "remediation", "vulnerabilities"],
      "SAST & DAST Tools (SonarQube, Checkmarx)": ["sast", "dast", "sonarqube", "checkmarx", "fortify", "veracode"],
      "OWASP Top 10 & SANS 25": ["owasp", "owasp top 10", "sans 25", "xss", "sqli", "insecure deserialization"],
      "Threat Modeling (STRIDE / PASTA)": ["threat modeling", "stride", "data flow diagrams", "risk assessment"],
      "DevSecOps & CI/CD Security": ["devsecops", "ci/cd security", "pipeline scanning", "dependency-check"],
      "Software Composition Analysis (Snyk / Dependabot)": ["snyk", "dependabot", "sca", "third-party risk"],
      "Authentication & OAuth / OpenID Connect": ["oauth", "oidc", "saml", "jwt", "mfa"],
      "Programming Skills (Python / Java / JavaScript)": ["python", "java", "javascript", "code analysis"],
      "API Security (REST / GraphQL)": ["api security", "rate limiting", "authorization"],
      "Git & Version Control": ["git", "github", "gitlab"]
    },
    soft: ["Empathy for Developers", "Pragmatic Risk Mindset", "Communication", "Problem Solving"],
    certifications: [
      { name: "Certified Secure Software Lifecycle Professional (CSSLP)", provider: "ISC2", url: "https://www.isc2.org/certifications/csslp" }
    ],
    courses: [
      { name: "Software Security Specialization", provider: "University of Maryland / Coursera", url: "https://www.coursera.org/" }
    ]
  },

  // ==========================================
  // TESTING & QUALITY ASSURANCE
  // ==========================================
  "QA Automation Engineer (SDET)": {
    category: "Testing & QA",
    description: "Designs, codes, and executes automated functional, regression, and end-to-end test suites across web and mobile platforms.",
    salaryRange: "₹5,00,000 - ₹15,00,000 / year",
    topCompanies: ["Cognizant", "TCS", "Accenture", "Infosys", "EPAM", "Qualitest", "Amazon"],
    technical: {
      "Java / Python / JavaScript for Automation": ["java", "python", "javascript", "oop", "coding"],
      "Selenium WebDriver": ["selenium", "selenium webdriver", "page object model", "locators", "xpath"],
      "Modern Web Testing (Cypress / Playwright)": ["cypress", "playwright", "e2e testing", "headless testing"],
      "TestNG / JUnit / PyTest": ["testng", "junit", "pytest", "assertions", "test suites", "annotations"],
      "API Automation (RestAssured / Postman)": ["rest assured", "restassured", "postman", "api testing", "json validation"],
      "CI/CD Integration (Jenkins / GitHub Actions)": ["jenkins", "github actions", "continuous testing", "ci/cd"],
      "BDD Frameworks (Cucumber / Gherkin)": ["cucumber", "gherkin", "bdd", "feature files"],
      "Git & Version Control": ["git", "github", "bitbucket"],
      "SQL & Database Verification": ["sql", "database testing", "queries", "validation"],
      "Defect Tracking (Jira / Bugzilla)": ["jira", "bug tracking", "test management", "test cases"]
    },
    soft: ["Destructive Curiosity (Bug Hunting)", "Eye for Edge Cases", "Quality Advocacy", "Clear Bug Reporting"],
    certifications: [
      { name: "ISTQB Certified Tester Foundation Level (CTFL)", provider: "ISTQB", url: "https://www.istqb.org/certifications/certified-tester-foundation-level" }
    ],
    courses: [
      { name: "Selenium WebDriver with Java - Basics to Advanced+Frameworks", provider: "Udemy (Rahul Shetty)", url: "https://www.udemy.com/" },
      { name: "Playwright Automation Testing", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Manual QA / Quality Analyst": {
    category: "Testing & QA",
    description: "Validates user workflows, creates detailed test scenarios, conducts smoke/regression tests, and enforces quality standards.",
    salaryRange: "₹3,50,000 - ₹9,00,000 / year",
    topCompanies: ["TCS", "Wipro", "HCLTech", "Capgemini", "L&T Infotech", "Cognizant"],
    technical: {
      "Software Testing Methodologies (STLC / SDLC)": ["stlc", "sdlc", "testing lifecycle", "smoke testing", "regression testing", "sanity testing"],
      "Test Case Design & Execution": ["test cases", "test scenarios", "test plan", "boundary value analysis", "equivalence partitioning"],
      "Defect Management (Jira / Bugzilla)": ["jira", "bug life cycle", "defect severity", "priority"],
      "API Testing (Postman Basics)": ["postman", "http methods", "status codes", "api testing"],
      "Database / SQL Verification": ["sql", "select queries", "joins", "data validation"],
      "Cross-Browser & Mobile Testing": ["cross-browser", "browserstack", "mobile testing", "responsive testing"],
      "Usability & Acceptance Testing (UAT)": ["uat", "acceptance testing", "user experience testing"],
      "Agile & Scrum Testing": ["agile", "scrum", "sprint", "standup"],
      "Basic HTML/CSS Knowledge": ["html", "css", "developer tools", "console"],
      "Test Reporting & Metrics": ["test metrics", "test summary report", "pass/fail rate"]
    },
    soft: ["Sharp Attention to Detail", "End-User Empathy", "Effective Written Communication", "Organized Methodology"],
    certifications: [
      { name: "ISTQB Foundation Level Certification", provider: "ISTQB", url: "https://www.istqb.org/" }
    ],
    courses: [
      { name: "Software Testing Masterclass: From Novice to Expert", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  // ==========================================
  // DESIGN & PRODUCT MANAGEMENT
  // ==========================================
  "UI/UX Designer": {
    category: "Design & Product",
    description: "Transforms user needs and business goals into intuitive wireframes, interactive prototypes, and polished design systems.",
    salaryRange: "₹4,50,000 - ₹15,00,000 / year",
    topCompanies: ["Swiggy", "CRED", "Zomato", "Razorpay", "Adobe", "Infosys", "Tata Elxsi"],
    technical: {
      "Figma (Components, Auto-Layout, Variants)": ["figma", "auto-layout", "variants", "components", "figma plugins"],
      "Wireframing & Prototyping": ["wireframing", "wireframes", "prototyping", "interactive prototype", "lo-fi", "hi-fi"],
      "User Research & Usability Testing": ["user research", "interviews", "usability testing", "user personas", "journey mapping"],
      "Design Systems & Component Libraries": ["design system", "design systems", "typography", "color palette", "tokens"],
      "Information Architecture (IA)": ["information architecture", "sitemaps", "user flows", "card sorting"],
      "Visual Design & Visual Hierarchy": ["visual design", "visual hierarchy", "spacing", "grid systems", "contrast"],
      "Accessibility & WCAG Guidelines": ["accessibility", "a11y", "wcag", "color contrast"],
      "Micro-Interactions & Motion Design": ["micro-interactions", "animations", "transitions"],
      "Design-to-Development Handoff": ["handoff", "developer handoff", "zeplin", "specs"],
      "Basic HTML & CSS Understanding": ["html", "css", "responsive layout"]
    },
    soft: ["Deep Empathy", "Storytelling", "Active Listening", "Receptive to Feedback", "Creative Problem Solving"],
    certifications: [
      { name: "Google UX Design Professional Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { name: "Interaction Design Foundation (IxDF) Certification", provider: "IxDF", url: "https://www.interaction-design.org/" }
    ],
    courses: [
      { name: "Figma UI UX Design Essentials", provider: "Udemy (Daniel Walter Scott)", url: "https://www.udemy.com/" }
    ]
  },

  "Associate Product Manager (APM)": {
    category: "Design & Product",
    description: "Defines product requirements, analyzes user metrics, prioritizes features, and bridges engineering with business stakeholders.",
    salaryRange: "₹8,00,000 - ₹20,00,000 / year",
    topCompanies: ["Flipkart", "Uber", "Razorpay", "Swiggy", "Google", "Microsoft", "Paytm"],
    technical: {
      "Product Strategy & Roadmap Planning": ["product strategy", "roadmap", "feature prioritization", "product lifecycle", "mvp"],
      "PRD & User Story Writing": ["prd", "product requirements", "user stories", "acceptance criteria"],
      "Data Analytics & Metrics (SQL, Mixpanel, Amplitude)": ["sql", "mixpanel", "amplitude", "google analytics", "funnels", "cohort analysis"],
      "A/B Testing & Experimentation": ["a/b testing", "hypothesis testing", "experimentation", "statistical significance"],
      "Agile & Scrum Methodologies": ["agile", "scrum", "sprints", "backlog grooming", "jira"],
      "User Research & Customer Interviews": ["customer interviews", "user research", "surveys", "pain points"],
      "Market Analysis & Competitor Benchmarking": ["market research", "competitive analysis", "swot", "tam"],
      "Wireframing Basics (Figma / Miro)": ["figma", "miro", "wireframes", "mockups"],
      "Tech Architecture Basics": ["apis", "system design basics", "databases"],
      "Financial Metrics (CAC, LTV, MRR, Churn)": ["cac", "ltv", "mrr", "churn", "retention", "monetization"]
    },
    soft: ["Influencing Without Authority", "First-Principles Thinking", "Extreme Clarity", "Decisiveness"],
    certifications: [
      { name: "Product Management Professional Certificate", provider: "Product School", url: "https://productschool.com/" },
      { name: "Certified Scrum Product Owner (CSPO)", provider: "Scrum Alliance", url: "https://www.scrumalliance.org/" }
    ],
    courses: [
      { name: "Become a Product Manager | Learn the Skills & Get the Job", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Scrum Master / Agile Coordinator": {
    category: "Design & Product",
    description: "Facilitates sprint ceremonies, removes blockers for dev squads, and champions Agile best practices across delivery teams.",
    salaryRange: "₹6,00,000 - ₹16,00,000 / year",
    topCompanies: ["Capgemini", "Accenture", "TCS", "Cognizant", "Barclays", "Wipro"],
    technical: {
      "Scrum Ceremonies Facilitation": ["scrum", "sprint planning", "daily standup", "sprint review", "retrospective"],
      "Jira & Confluence Administration": ["jira", "confluence", "boards", "kanban", "burndown chart", "velocity"],
      "Agile Metrics Tracking": ["velocity", "burndown", "burnup", "cycle time", "lead time"],
      "Backlog Management & Refinement": ["backlog", "refinement", "user stories", "story points", "estimation"],
      "Impediment Removal & Conflict Resolution": ["impediments", "blockers", "dependency management"],
      "Kanban Framework": ["kanban", "wip limits", "workflow visualization"],
      "Scaled Agile (SAFe) Basics": ["safe", "scaled agile", "release train"],
      "CI/CD Awareness": ["ci/cd", "continuous integration", "devops basics"],
      "SDLC Understanding": ["sdlc", "software lifecycle", "qa process"],
      "Documentation & Reporting": ["documentation", "status reporting", "stakeholder management"]
    },
    soft: ["Servant Leadership", "Emotional Intelligence", "Conflict Resolution", "Active Listening"],
    certifications: [
      { name: "Professional Scrum Master I (PSM I)", provider: "Scrum.org", url: "https://www.scrum.org/professional-scrum-master-i-certification" },
      { name: "Certified ScrumMaster (CSM)", provider: "Scrum Alliance", url: "https://www.scrumalliance.org/" }
    ],
    courses: [
      { name: "Scrum Master Certification Preparation", provider: "Coursera", url: "https://www.coursera.org/" }
    ]
  },

  // ==========================================
  // EMERGING TECH & SPECIALIZED ROLES
  // ==========================================
  "Blockchain & Web3 Developer": {
    category: "Emerging Tech",
    description: "Develops decentralized smart contracts, DeFi protocols, and Web3 decentralized applications (dApps) using Solidity.",
    salaryRange: "₹7,00,000 - ₹22,00,000 / year",
    topCompanies: ["Polygon", "ConsenSys", "Coinbase", "Crypto Startups", "Infosys Blockchain Lab"],
    technical: {
      "Solidity Programming": ["solidity", "smart contracts", "evm", "gas optimization", "ethereum"],
      "Web3 Libraries (Ethers.js / Web3.js)": ["ethers.js", "web3.js", "metamask", "wallet integration"],
      "Development Frameworks (Hardhat / Foundry)": ["hardhat", "foundry", "truffle", "remix ide"],
      "Smart Contract Security & Auditing": ["reentrancy", "auditing", "slither", "security", "openzeppelin"],
      "Token Standards (ERC-20, ERC-721, ERC-1155)": ["erc-20", "erc-721", "erc-1155", "nft", "tokens"],
      "Frontend Integration (React / Next.js)": ["react", "next.js", "dapp", "typescript"],
      "Decentralized Storage (IPFS / Arweave)": ["ipfs", "filecoin", "arweave"],
      "Blockchain Architecture & Consensus": ["blockchain", "proof of stake", "pos", "pow", "layer 2", "rollups"],
      "Git & Version Control": ["git", "github"],
      "Testing (Waffle / Mocha / Chai)": ["unit testing", "testing", "waffle", "smart contract testing"]
    },
    soft: ["Security Paranoia", "Autonomous Problem Solving", "Decentralization Philosophy", "Documentation"],
    certifications: [
      { name: "Certified Blockchain Developer", provider: "Blockchain Council", url: "https://www.blockchain-council.org/" }
    ],
    courses: [
      { name: "Ethereum and Solidity: The Complete Developer's Guide", provider: "Udemy", url: "https://www.udemy.com/" },
      { name: "CryptoZombies Interactive Solidity Tutorial", provider: "CryptoZombies", url: "https://cryptozombies.io/" }
    ]
  },

  "Game Developer (Unity / C#)": {
    category: "Emerging Tech",
    description: "Designs and codes interactive 2D/3D games, physics mechanics, and immersive player experiences in Unity with C#.",
    salaryRange: "₹4,50,000 - ₹15,00,000 / year",
    topCompanies: ["Ubisoft", "EA Games", "Zynga", "Moonfrog Labs", "Rockstar Games", "JioGames"],
    technical: {
      "C# Scripting for Games": ["c#", "csharp", "oop", "delegates", "events", "coroutines", "linq"],
      "Unity Game Engine (2D & 3D)": ["unity", "unity engine", "gameobjects", "prefabs", "scenes", "components"],
      "Game Physics & Collisions": ["physics", "rigidbody", "colliders", "raycasting", "forces"],
      "Animation & Animator Controllers": ["animator", "animation", "blend trees", "inverse kinematics"],
      "UI & Canvas Systems": ["unity ui", "canvas", "textmeshpro", "menus", "hud"],
      "Asset Management & Optimization": ["occlusion culling", "draw calls", "asset bundles", "profiler"],
      "Audio & Sound Effects Implementation": ["audio source", "audio mixer", "sound effects"],
      "Math for Games (Vectors, Quaternions, Trigonometry)": ["vectors", "quaternions", "dot product", "cross product", "math"],
      "Git & Version Control for Unity": ["git", "github", "lfs", "large file storage"],
      "Multiplayer Basics (Photon / Netcode)": ["photon", "pun", "netcode", "multiplayer", "networking"]
    },
    soft: ["Creative Passion", "Playfulness & Gameplay Empathy", "Spatial Thinking", "Problem Solving"],
    certifications: [
      { name: "Unity Certified Associate: Game Developer", provider: "Unity", url: "https://unity.com/products/unity-certifications" }
    ],
    courses: [
      { name: "Complete C# Unity Game Developer 2D/3D", provider: "Udemy (GameDev.tv)", url: "https://www.udemy.com/" }
    ]
  },

  "Salesforce Developer": {
    category: "Emerging Tech",
    description: "Customizes enterprise CRM solutions using Apex code, Lightning Web Components (LWC), and SOQL.",
    salaryRange: "₹5,00,000 - ₹16,00,000 / year",
    topCompanies: ["Salesforce", "Deloitte", "Cognizant", "TCS", "Accenture", "PwC"],
    technical: {
      "Apex Programming": ["apex", "oop", "triggers", "classes", "governor limits"],
      "Lightning Web Components (LWC)": ["lwc", "lightning web components", "aura", "javascript", "html"],
      "SOQL & SOSL": ["soql", "sosl", "salesforce queries", "database"],
      "Salesforce Administration & Configuration": ["salesforce", "objects", "fields", "workflows", "flows", "validation rules"],
      "Security & Sharing Model": ["profiles", "permission sets", "owd", "sharing rules", "roles"],
      "Integration & REST/SOAP APIs": ["rest api", "soap", "callouts", "web services", "integration"],
      "Asynchronous Apex": ["batch apex", "future methods", "queueable", "schedulable"],
      "Testing & Code Coverage": ["test classes", "unit testing", "code coverage", "system.assert"],
      "Git & Salesforce DX (SFDX)": ["sfdx", "git", "cli", "scratch orgs", "deployment"],
      "Data Migration (Data Loader)": ["data loader", "import wizard", "etl"]
    },
    soft: ["Business Process Comprehension", "Client Empathy", "Meticulousness", "Communication"],
    certifications: [
      { name: "Salesforce Certified Platform Developer I (PDI)", provider: "Salesforce Trailhead", url: "https://trailhead.salesforce.com/credentials/platformdeveloperi" },
      { name: "Salesforce Certified Administrator", provider: "Salesforce Trailhead", url: "https://trailhead.salesforce.com/credentials/administrator" }
    ],
    courses: [
      { name: "Salesforce Trailhead Developer Pathways", provider: "Salesforce", url: "https://trailhead.salesforce.com/" }
    ]
  },

  "Database Administrator (DBA)": {
    category: "Emerging Tech",
    description: "Ensures maximum database uptime, performance tuning, automated backup/recovery, and schema security.",
    salaryRange: "₹5,00,000 - ₹15,00,000 / year",
    topCompanies: ["Oracle", "IBM", "TCS", "Cognizant", "HCLTech", "Wipro"],
    technical: {
      "RDBMS Mastery (MySQL / PostgreSQL / Oracle / SQL Server)": ["mysql", "postgresql", "oracle", "sql server", "rdbms"],
      "Advanced SQL & Stored Procedures": ["sql", "stored procedures", "triggers", "views", "functions"],
      "Performance Tuning & Index Optimization": ["indexing", "query optimization", "explain plan", "profiling", "performance tuning"],
      "Backup, Restore & Disaster Recovery": ["backup", "restore", "disaster recovery", "replication", "high availability"],
      "Database Security & User Permissions": ["user permissions", "roles", "grants", "encryption", "auditing"],
      "Linux Administration & Shell Scripting": ["linux", "bash", "cron", "automation"],
      "Database Clustering & Sharding": ["clustering", "sharding", "partitioning", "failover"],
      "NoSQL Databases (MongoDB / Cassandra)": ["mongodb", "cassandra", "nosql", "dynamodb"],
      "Monitoring Tools": ["monitoring", "nagios", "datadog", "pgadmin"],
      "Cloud Databases (AWS RDS / Aurora)": ["aws rds", "aurora", "cloud database"]
    },
    soft: ["High Reliability", "Disaster Calmness", "Analytical Thinking", "Attention to Detail"],
    certifications: [
      { name: "Oracle Certified Professional: Database Administrator", provider: "Oracle", url: "https://education.oracle.com/" }
    ],
    courses: [
      { name: "PostgreSQL Database Administration", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Cloud Solutions Architect": {
    category: "Cloud & DevOps",
    description: "Designs scalable, fault-tolerant, and secure enterprise multi-tier architectures across hybrid and multi-cloud environments.",
    salaryRange: "₹10,00,000 - ₹28,00,000 / year",
    topCompanies: ["Amazon Web Services", "Microsoft", "Google Cloud", "IBM", "TCS", "Wipro"],
    technical: {
      "Multi-Cloud Architecture (AWS / Azure / GCP)": ["aws", "azure", "gcp", "cloud architecture", "high availability"],
      "Microservices & Serverless Systems": ["microservices", "serverless", "lambda", "event-driven", "api gateway"],
      "Cloud Security & Compliance": ["cloud security", "iam", "encryption", "soc2", "gdpr", "hipaa"],
      "Infrastructure as Code (Terraform)": ["terraform", "iac", "ansible", "cloudformation"],
      "Networking & Hybrid Connectivity (Direct Connect / ExpressRoute)": ["vpc", "vpn", "direct connect", "expressroute", "sd-wan"],
      "Cost Optimization & FinOps": ["finops", "cost optimization", "reserved instances", "savings plans"],
      "Disaster Recovery & Business Continuity": ["disaster recovery", "rto", "rpo", "backup strategy", "multi-region"],
      "Container Orchestration (Kubernetes)": ["kubernetes", "k8s", "docker", "service mesh", "istio"],
      "Databases & Caching (Relational + NoSQL)": ["rds", "dynamodb", "aurora", "redis", "caching"],
      "System Design & Enterprise Patterns": ["system design", "hld", "togaf", "distributed systems"]
    },
    soft: ["Executive Communication", "Strategic Vision", "Consensus Building", "Mentorship"],
    certifications: [
      { name: "AWS Certified Solutions Architect – Professional", provider: "AWS", url: "https://aws.amazon.com/certification/" },
      { name: "Google Cloud Certified Professional Cloud Architect", provider: "Google Cloud", url: "https://cloud.google.com/certification" }
    ],
    courses: [
      { name: "Enterprise Architecture with AWS", provider: "Coursera", url: "https://www.coursera.org/" }
    ]
  },

  "Full Stack Developer (Java + React)": {
    category: "Software Engineering",
    description: "Develops complete enterprise web applications integrating modern React frontends with Java Spring Boot backend APIs.",
    salaryRange: "₹5,50,000 - ₹17,00,000 / year",
    topCompanies: ["JPMorgan Chase", "Capgemini", "Accenture", "TCS", "Infosys", "Wells Fargo"],
    technical: {
      "React.js & Frontend": ["react", "react.js", "javascript", "typescript", "html5", "css3"],
      "Java & Spring Boot": ["java", "spring boot", "spring mvc", "spring security", "rest api"],
      "Hibernate & JPA": ["hibernate", "jpa", "orm", "entity"],
      "SQL (PostgreSQL / MySQL / Oracle)": ["sql", "mysql", "postgresql", "oracle", "database"],
      "RESTful API Integration": ["rest", "restful", "json", "axios", "postman"],
      "State Management (Redux)": ["redux", "context api", "state management"],
      "Git & Maven / Gradle": ["git", "github", "maven", "gradle"],
      "Testing (JUnit & Jest)": ["junit", "jest", "unit testing", "mockito"],
      "Docker & Deployment": ["docker", "containerization", "ci/cd"],
      "Security (JWT & Spring Security)": ["jwt", "spring security", "cors", "authentication"]
    },
    soft: ["End-to-End Ownership", "Communication", "Problem Solving", "Adaptability"],
    certifications: [
      { name: "Oracle Java SE Certification", provider: "Oracle", url: "https://education.oracle.com/" }
    ],
    courses: [
      { name: "Full Stack Java developer with Spring Boot & React", provider: "Udemy", url: "https://www.udemy.com/" }
    ]
  },

  "Information Security Engineer": {
    category: "Cybersecurity",
    description: "Implements encryption, firewall defenses, identity access governance, and security controls across corporate IT infrastructure.",
    salaryRange: "₹6,00,000 - ₹17,00,000 / year",
    topCompanies: ["Cisco", "Deloitte", "PwC", "Infosys", "TCS Cyber Defense", "Barclays"],
    technical: {
      "Firewalls & Unified Threat Management": ["firewall", "palo alto", "fortinet", "utm", "vpn"],
      "Identity & Access Management (IAM)": ["iam", "active directory", "mfa", "sso", "rbac"],
      "Encryption & PKI Infrastructure": ["encryption", "aes", "rsa", "tls", "pki", "ssl certificates"],
      "Vulnerability Management": ["vulnerability management", "qualys", "rapid7", "patch management"],
      "Security Audits & Compliance (ISO 27001, SOC 2)": ["iso 27001", "soc 2", "pci dss", "compliance", "audit"],
      "Endpoint Security (EDR & Antivirus)": ["edr", "antivirus", "crowdstrike", "sentinelone"],
      "Network Protocols & Architecture": ["networking", "tcp/ip", "dns", "dmz", "segmentation"],
      "Python / PowerShell Scripting": ["python", "powershell", "automation", "bash"],
      "Incident Response Basics": ["incident response", "security policy", "playbooks"],
      "Linux & Windows Server Security": ["linux", "windows server", "hardening", "group policy"]
    },
    soft: ["Risk Management Intuition", "Integrity", "Analytical Persistence", "Discretion"],
    certifications: [
      { name: "CompTIA Security+", provider: "CompTIA", url: "https://www.comptia.org/certifications/security" },
      { name: "Certified Information Systems Security Professional (CISSP)", provider: "ISC2", url: "https://www.isc2.org/" }
    ],
    courses: [
      { name: "Information Security Principles", provider: "Coursera", url: "https://www.coursera.org/" }
    ]
  },

  "AI & Deep Learning Specialist": {
    category: "Data Science & AI",
    description: "Researches and trains advanced deep neural networks for speech recognition, generative media, and autonomous intelligence.",
    salaryRange: "₹9,00,000 - ₹26,00,000 / year",
    topCompanies: ["NVIDIA", "Intel AI", "Google DeepMind", "Amazon Science", "Samsung R&D", "TCS Innovation Labs"],
    technical: {
      "PyTorch & Deep Learning": ["pytorch", "neural networks", "backpropagation", "loss functions", "optimizers"],
      "Generative AI & Diffusion Models": ["generative ai", "diffusion", "stable diffusion", "gan", "vae", "transformers"],
      "Transformer Architecture & Attention Mechanisms": ["transformers", "self-attention", "bert", "gpt", "encoder-decoder"],
      "Mathematics (Linear Algebra, Calculus, Optimization)": ["linear algebra", "multivariate calculus", "eigenvalues", "matrix decomposition"],
      "Python & Scientific Computing": ["python", "numpy", "scipy", "einops", "cuda"],
      "Hardware Acceleration & Distributed Training": ["cuda", "distributed training", "deepspeed", "horovod", "gpus"],
      "Model Quantization & Pruning": ["quantization", "pruning", "distillation", "onnx", "tensorrt"],
      "Computer Vision & NLP Tasks": ["cnn", "rnn", "lstm", "object detection", "text generation"],
      "Experiment Tracking (W&B / MLflow)": ["wandb", "mlflow", "tensorboard", "experiment tracking"],
      "Git & Open Source Research": ["git", "github", "arxiv", "paper reproduction"]
    },
    soft: ["Mathematical Curiosity", "Patience with Model Convergence", "Research Humility", "Vision"],
    certifications: [
      { name: "Deep Learning Specialization", provider: "DeepLearning.AI / Coursera", url: "https://www.coursera.org/specializations/deep-learning" }
    ],
    courses: [
      { name: "Stanford CS224N: Natural Language Processing with Deep Learning", provider: "Stanford Online", url: "https://web.stanford.edu/class/cs224n/" }
    ]
  },

  "IT Support & Systems Engineer": {
    category: "Cloud & DevOps",
    description: "Maintains hardware, client operating systems, Active Directory domain accounts, network printers, and workplace productivity tools.",
    salaryRange: "₹3,50,000 - ₹8,50,000 / year",
    topCompanies: ["HCLTech", "Wipro", "Tech Mahindra", "DXC Technology", "Capgemini", "Concentrix"],
    technical: {
      "Windows & macOS Administration": ["windows 10", "windows 11", "macos", "troubleshooting", "operating systems"],
      "Active Directory & Microsoft 365": ["active directory", "azure ad", "office 365", "exchange", "user management"],
      "Hardware Diagnostics & Peripheral Setup": ["hardware", "ram", "ssd", "motherboard", "bios", "printers"],
      "Basic Networking (IP, DNS, DHCP, VPN)": ["ip address", "dns", "dhcp", "vpn", "lan", "wi-fi troubleshooting"],
      "Ticketing Systems (ServiceNow / Jira Service Management)": ["servicenow", "jira", "helpdesk", "ticketing", "sla"],
      "Remote Desktop Support Tools": ["remote desktop", "teamviewer", "anydesk", "rdp"],
      "Antivirus & Endpoint Security": ["antivirus", "malware removal", "bitlocker", "security updates"],
      "Scripting Basics (PowerShell / Batch)": ["powershell", "batch script", "command prompt", "cmd"],
      "System Imaging & Backup Solutions": ["imaging", "ghost", "sccm", "backup", "restore"],
      "Customer Service & ITIL Framework": ["itil", "customer support", "incident logging", "documentation"]
    },
    soft: ["Customer Empathy", "Patience", "Clear Verbal Communication", "Calm Demeanor"],
    certifications: [
      { name: "CompTIA A+", provider: "CompTIA", url: "https://www.comptia.org/certifications/a" },
      { name: "Microsoft Certified: Endpoint Administrator Associate", provider: "Microsoft", url: "https://learn.microsoft.com/" }
    ],
    courses: [
      { name: "Google IT Support Professional Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-it-support" }
    ]
  },

  "Robotic Process Automation (RPA) Developer": {
    category: "Emerging Tech",
    description: "Automates repetitive business processes and workflow data entry using bots developed with UiPath, Automation Anywhere, and OCR.",
    salaryRange: "₹4,50,000 - ₹13,00,000 / year",
    topCompanies: ["UiPath", "Genpact", "Cognizant", "Deloitte", "Accenture", "TCS"],
    technical: {
      "UiPath Studio & Orchestrator": ["uipath", "orchestrator", "bots", "reframe", "robotic process automation"],
      "Process Mapping & PDD / SDD": ["pdd", "sdd", "process mapping", "flowcharts", "automation design"],
      "Selectors & UI Automation": ["selectors", "ui explorer", "anchor base", "web automation", "desktop automation"],
      "OCR & Document Understanding": ["ocr", "document understanding", "tesseract", "abbyy", "pdf extraction"],
      "Programming Basics (C# / VB.NET / Python)": ["c#", "vb.net", "python", "variables", "regex"],
      "Excel & Database Automation": ["excel automation", "sql", "database", "datatable", "linq"],
      "API & Email Automation": ["smtp", "imap", "outlook", "http request", "rest api"],
      "Exception Handling & Logging": ["try catch", "business rule exception", "logging", "monitoring"],
      "Automation Anywhere / Power Automate (Secondary)": ["automation anywhere", "power automate", "blue prism"],
      "Git & Version Control": ["git", "github", "tfs"]
    },
    soft: ["Business Workflow Visualization", "Analytical Decomposition", "Accuracy", "Collaboration"],
    certifications: [
      { name: "UiPath Certified Professional Automation Developer Associate", provider: "UiPath", url: "https://www.uipath.com/learning/certification" }
    ],
    courses: [
      { name: "UiPath Academy Developer Track", provider: "UiPath Academy (Free)", url: "https://academy.uipath.com/" }
    ]
  }
};

export const JOB_ROLES_LIST = Object.keys(JOB_ROLES_DATA);
