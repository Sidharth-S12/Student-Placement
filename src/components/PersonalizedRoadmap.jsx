
import React, { useMemo, useState } from "react";
import {
  Sparkles,
  ChevronRight,
  Clock3,
  BookOpen,
  CheckCircle2,
  Download,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import "./PersonalizedRoadmap.css";

const skills = [
  { name: "Python Programming", icon: "🐍", description: "Programming and problem solving" },
  { name: "SQL & DBMS", icon: "🗃️", description: "Databases and SQL queries" },
  { name: "Java Programming", icon: "☕", description: "Object-oriented programming" },
  { name: "Machine Learning", icon: "🤖", description: "Models and intelligent systems" },
  { name: "Data Structures & Algorithms", icon: "🧩", description: "Logic and coding problems" },
  { name: "Web Development", icon: "🌐", description: "HTML, CSS and JavaScript" },
  { name: "Data Analytics", icon: "📊", description: "Excel, Python and visualization" },
  { name: "Cloud Computing", icon: "☁️", description: "Cloud services and deployment" },
  { name: "C Programming", icon: "💻", description: "Programming fundamentals" },
];

const resources = {
  "Python Programming": [
    { name: "Coursera – Python courses", url: "https://www.coursera.org/courses?query=python" },
    { name: "YouTube – Python tutorials", url: "https://www.youtube.com/results?search_query=python+programming+tutorial" },
    { name: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
  ],
  "SQL & DBMS": [
    { name: "Coursera – SQL courses", url: "https://www.coursera.org/courses?query=sql" },
    { name: "YouTube – SQL and DBMS", url: "https://www.youtube.com/results?search_query=SQL+DBMS+tutorial" },
    { name: "SQLBolt – Interactive lessons", url: "https://sqlbolt.com/" },
  ],
  "Java Programming": [
    { name: "Coursera – Java courses", url: "https://www.coursera.org/courses?query=java" },
    { name: "YouTube – Java tutorials", url: "https://www.youtube.com/results?search_query=java+programming+tutorial" },
    { name: "Official Java Tutorials", url: "https://dev.java/learn/" },
  ],
  "Machine Learning": [
    { name: "Coursera – Machine Learning", url: "https://www.coursera.org/courses?query=machine%20learning" },
    { name: "YouTube – ML tutorials", url: "https://www.youtube.com/results?search_query=machine+learning+beginner+tutorial" },
    { name: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
  ],
  "Data Structures & Algorithms": [
    { name: "Coursera – Algorithms courses", url: "https://www.coursera.org/courses?query=data%20structures%20algorithms" },
    { name: "YouTube – DSA tutorials", url: "https://www.youtube.com/results?search_query=data+structures+algorithms+tutorial" },
    { name: "VisuAlgo – Visual learning", url: "https://visualgo.net/en" },
  ],
  "Web Development": [
    { name: "Coursera – Web Development", url: "https://www.coursera.org/courses?query=web%20development" },
    { name: "YouTube – Web development", url: "https://www.youtube.com/results?search_query=HTML+CSS+JavaScript+tutorial" },
    { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
  ],
  "Data Analytics": [
    { name: "Coursera – Data Analytics", url: "https://www.coursera.org/courses?query=data%20analytics" },
    { name: "YouTube – Data analytics", url: "https://www.youtube.com/results?search_query=data+analytics+beginner+tutorial" },
    { name: "Microsoft Learn – Power BI", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" },
  ],
  "Cloud Computing": [
    { name: "Coursera – Cloud Computing", url: "https://www.coursera.org/courses?query=cloud%20computing" },
    { name: "YouTube – Cloud computing", url: "https://www.youtube.com/results?search_query=cloud+computing+for+beginners" },
    { name: "AWS Skill Builder", url: "https://skillbuilder.aws/" },
  ],
  "C Programming": [
    { name: "Coursera – C programming", url: "https://www.coursera.org/courses?query=c%20programming" },
    { name: "YouTube – C programming", url: "https://www.youtube.com/results?search_query=C+programming+beginner+tutorial" },
    { name: "Learn-C.org", url: "https://www.learn-c.org/" },
  ],
};

// Each skill has a different syllabus for each experience level.
// Each lesson contains: title, topics, project, revision focus.
const levelLessons = {
  "Python Programming": {
    Beginner: [
      ["Python Fundamentals", "Variables, data types, operators, input and output", "Write 10 small Python programs", "Variables, types and operators"],
      ["Conditions and Loops", "If/else, for loops, while loops and nested loops", "Build a number guessing game", "Conditions and loop tracing"],
      ["Functions and Collections", "Functions, lists, tuples, sets and dictionaries", "Create a student marks manager", "Functions and collections"],
      ["Strings and Files", "String methods, reading files, writing files and exceptions", "Build a text-file record system", "String operations and file handling"],
      ["Problem Solving", "Searching, sorting, debugging and basic time complexity", "Solve beginner coding challenges", "Algorithms and debugging"],
      ["Final Python Project", "Combine Python fundamentals and test the complete program", "Build and document a student management tool", "Explain code and program flow"],
    ],
    Intermediate: [
      ["Modular Python", "Packages, imports, virtual environments and project structure", "Organize a multi-file Python application", "Modules and packages"],
      ["Object-Oriented Python", "Classes, inheritance, polymorphism and composition", "Create a library management application", "OOP concepts and design"],
      ["Advanced Data Handling", "Comprehensions, iterators, generators and lambda functions", "Build a data-processing utility", "Iterators and generators"],
      ["Files, APIs and Exceptions", "JSON, CSV, REST APIs, custom exceptions and logging", "Create an API-based data collection tool", "API handling and exceptions"],
      ["Testing and Databases", "Unit testing, debugging, SQLite and database operations", "Build a tested database application", "Testing and database integration"],
      ["Intermediate Python Project", "Combine OOP, APIs, databases and automated tests", "Build a complete Python application", "Explain architecture and testing"],
    ],
    Advanced: [
      ["Python Internals", "Object model, memory references, mutability and execution model", "Investigate memory behavior in Python", "Memory and object model"],
      ["Advanced Language Features", "Decorators, closures, descriptors and metaclasses", "Create reusable decorators and utilities", "Decorators and descriptors"],
      ["Concurrency and Async", "Threading, multiprocessing, asyncio and task coordination", "Build a concurrent data-processing tool", "Concurrency trade-offs"],
      ["Performance Engineering", "Profiling, algorithm optimization, caching and memory usage", "Optimize a slow Python application", "Profiling and complexity"],
      ["Architecture and Quality", "Design patterns, type hints, packaging, testing and CI concepts", "Create a maintainable Python package", "Architecture and code quality"],
      ["Advanced Python Project", "Combine performance, testing, architecture and documentation", "Develop a production-style Python application", "Explain design and optimization"],
    ],
  },

  "SQL & DBMS": {
    Beginner: [
      ["Database Fundamentals", "Tables, rows, columns, schemas and relational databases", "Design a student database", "Tables and keys"],
      ["Basic SQL Queries", "SELECT, WHERE, DISTINCT, ORDER BY and LIMIT", "Query a student records table", "Filtering and sorting"],
      ["Functions and Grouping", "COUNT, SUM, AVG, MIN, MAX and GROUP BY", "Analyze student marks using SQL", "Aggregate functions"],
      ["Relationships and Joins", "Primary keys, foreign keys, INNER JOIN and LEFT JOIN", "Combine students and marks tables", "Keys and joins"],
      ["DBMS Fundamentals", "Normalization, constraints, transactions and ACID basics", "Normalize a small database", "Normalization and ACID"],
      ["SQL Mini Project", "Create tables, insert records and write useful queries", "Build a student database project", "Explain schema and queries"],
    ],
    Intermediate: [
      ["Advanced Querying", "Subqueries, correlated queries, CASE and set operations", "Solve multi-table business queries", "Subqueries and CASE"],
      ["Complex Joins", "Self joins, multiple joins and anti-join patterns", "Analyze related sales tables", "Join selection"],
      ["Database Design", "Normalization, functional dependencies and schema refinement", "Improve a poorly designed schema", "Normal forms"],
      ["Views and Programming", "Views, common table expressions and stored procedures", "Build reusable reporting queries", "Views and CTEs"],
      ["Transactions and Indexes", "Isolation levels, locking, indexes and transaction control", "Test transaction behavior", "Transactions and indexing"],
      ["Intermediate SQL Project", "Combine schema design, complex queries and reporting", "Build a relational reporting system", "Explain design choices"],
    ],
    Advanced: [
      ["Window Functions", "Ranking, partitions, frames and analytical functions", "Build a ranking and trend report", "Window function behavior"],
      ["Query Optimization", "Execution plans, index selection and query cost", "Optimize slow SQL queries", "Execution plans"],
      ["Advanced Database Design", "Advanced normalization, denormalization and partitioning", "Design a scalable data schema", "Schema trade-offs"],
      ["Concurrency and Recovery", "Deadlocks, isolation anomalies, logging and recovery", "Analyze concurrent transaction scenarios", "Concurrency control"],
      ["Data Warehousing", "Star schemas, snowflake schemas and analytical workloads", "Design a small analytics warehouse", "Warehouse modelling"],
      ["Advanced SQL Project", "Optimize complex queries and document performance decisions", "Build an optimized analytics database", "Optimization and architecture"],
    ],
  },

  "Java Programming": {
    Beginner: [
      ["Java Fundamentals", "Variables, data types, operators and input/output", "Build a basic calculator", "Types and operators"],
      ["Conditions and Loops", "If/else, switch, for and while loops", "Create a menu-driven program", "Control flow"],
      ["Methods and Arrays", "Methods, arrays, strings and basic algorithms", "Build a marks processing program", "Methods and arrays"],
      ["Classes and Objects", "Classes, objects, constructors and encapsulation", "Create a student class model", "Object-oriented basics"],
      ["Exceptions and Files", "Exception handling and basic file operations", "Build a simple contact manager", "Exceptions and files"],
      ["Java Mini Project", "Combine methods, classes, arrays and exceptions", "Build a console-based management system", "Explain program structure"],
    ],
    Intermediate: [
      ["Object-Oriented Design", "Inheritance, polymorphism, interfaces and composition", "Design a library management system", "OOP design"],
      ["Collections and Generics", "Lists, sets, maps, iterators and generic types", "Build a contact search application", "Collections and generics"],
      ["Modern Java Features", "Lambdas, streams, Optional and functional interfaces", "Create a stream-based data processor", "Streams and lambdas"],
      ["Database Connectivity", "JDBC, SQL integration and transaction handling", "Connect a Java application to a database", "JDBC and transactions"],
      ["Testing and Exceptions", "Custom exceptions, unit testing and debugging", "Test a Java application", "Testing and error handling"],
      ["Intermediate Java Project", "Combine collections, database access and testing", "Build a database-backed Java application", "Explain architecture"],
    ],
    Advanced: [
      ["Advanced Java Design", "SOLID principles, design patterns and dependency injection concepts", "Refactor an application using design patterns", "Design principles"],
      ["Concurrency", "Threads, executors, synchronization and concurrent collections", "Build a concurrent processing application", "Thread safety"],
      ["JVM and Performance", "Garbage collection, memory, profiling and JVM behavior", "Investigate and optimize a Java program", "JVM and profiling"],
      ["Advanced APIs", "Reflection, annotations, generics and advanced stream operations", "Create a reusable Java library", "Advanced language features"],
      ["Enterprise Java Concepts", "REST APIs, application architecture, logging and integration testing", "Build a service-oriented Java application", "API and architecture"],
      ["Advanced Java Project", "Combine architecture, concurrency, testing and optimization", "Create a well-tested Java service", "Explain scalability and trade-offs"],
    ],
  },

  "Machine Learning": {
    Beginner: [
      ["Python for ML", "Python basics, NumPy, Pandas and dataset loading", "Explore a small dataset", "Data preparation"],
      ["Statistics Fundamentals", "Mean, median, variance, probability and correlation", "Summarize a dataset statistically", "Basic statistics"],
      ["Regression", "Linear regression, features, labels and prediction", "Predict a numerical value", "Regression concepts"],
      ["Classification", "Classification, training/testing splits and basic algorithms", "Build a simple classification model", "Classification"],
      ["Model Evaluation", "Accuracy, confusion matrix, precision and recall", "Evaluate a classification model", "Evaluation metrics"],
      ["Beginner ML Project", "Combine data cleaning, training and evaluation", "Create and document a prediction project", "Explain model results"],
    ],
    Intermediate: [
      ["Feature Engineering", "Missing values, encoding, scaling and feature selection", "Prepare a real-world dataset", "Data preprocessing"],
      ["Tree-Based Models", "Decision trees, random forests and ensemble basics", "Compare tree-based models", "Overfitting and ensembles"],
      ["Model Selection", "Cross-validation, hyperparameter tuning and pipelines", "Tune a model using cross-validation", "Validation strategies"],
      ["Unsupervised Learning", "K-means, hierarchical clustering and dimensionality reduction", "Group similar records in a dataset", "Clustering"],
      ["Imbalanced Data", "Class imbalance, resampling and evaluation trade-offs", "Compare models on imbalanced data", "Precision, recall and F1"],
      ["Intermediate ML Project", "Build a repeatable pipeline and compare candidate models", "Create a complete ML workflow", "Explain model selection"],
    ],
    Advanced: [
      ["Mathematical Foundations", "Optimization, regularization, gradients and statistical assumptions", "Experiment with model regularization", "Optimization concepts"],
      ["Advanced Ensembles", "Gradient boosting, ensemble strategies and calibration", "Compare advanced ensemble models", "Ensemble trade-offs"],
      ["Deep Learning", "Neural networks, backpropagation and training optimization", "Train a small neural network", "Neural network concepts"],
      ["Explainable ML", "Feature importance, model interpretation, bias and fairness", "Analyze model predictions and limitations", "Explainability and fairness"],
      ["Deployment and MLOps", "Model serving, versioning, monitoring and data drift", "Deploy a model behind an API", "Monitoring and deployment"],
      ["Advanced ML Project", "Combine experiment tracking, deployment and model monitoring", "Deliver a documented ML application", "Explain production considerations"],
    ],
  },

  "Data Structures & Algorithms": {
    Beginner: [
      ["Complexity and Arrays", "Big-O basics, arrays, indexing and strings", "Solve array exercises", "Time and space complexity"],
      ["Searching and Sorting", "Linear search, binary search and elementary sorting", "Compare searching and sorting methods", "Algorithm tracing"],
      ["Linked Lists", "Nodes, traversal, insertion and deletion", "Implement a linked list", "Linked list operations"],
      ["Stacks and Queues", "LIFO, FIFO and common applications", "Implement a stack and queue", "Operation tracing"],
      ["Trees and Hashing", "Tree basics, traversals, maps and sets", "Solve basic tree and hash exercises", "Traversals and hashing"],
      ["DSA Mini Project", "Combine data structures and simple algorithms", "Build a small algorithm demonstration", "Explain approach and complexity"],
    ],
    Intermediate: [
      ["Recursive Problem Solving", "Recursion, backtracking and recursive complexity", "Solve recursive coding problems", "Recursion tracing"],
      ["Advanced Trees", "Binary search trees, heaps and balanced-tree concepts", "Implement tree operations and a heap", "Tree operations"],
      ["Graph Algorithms", "Graph representations, BFS and DFS", "Implement graph traversal", "Graph traversal"],
      ["Algorithm Strategies", "Greedy algorithms, divide and conquer and dynamic programming basics", "Solve classic optimization problems", "Algorithm selection"],
      ["Hashing and Optimization", "Hash collisions, amortized analysis and efficient data structures", "Optimize a collection-based solution", "Complexity trade-offs"],
      ["Intermediate DSA Project", "Combine graph, tree and optimization techniques", "Build a problem-solving toolkit", "Explain complexity and correctness"],
    ],
    Advanced: [
      ["Advanced Dynamic Programming", "State design, memoization, tabulation and optimization", "Solve advanced DP challenges", "DP state transitions"],
      ["Advanced Graph Algorithms", "Shortest paths, minimum spanning trees and topological sorting", "Implement advanced graph solutions", "Graph algorithm selection"],
      ["Advanced Data Structures", "Tries, segment trees, disjoint sets and range queries", "Implement a range-query structure", "Data structure trade-offs"],
      ["Algorithm Analysis", "Correctness proofs, recurrence relations and amortized analysis", "Analyze algorithm complexity rigorously", "Proof and complexity"],
      ["Optimization Challenges", "Space optimization, pruning and efficient implementation", "Optimize solutions under constraints", "Performance trade-offs"],
      ["Advanced DSA Project", "Combine advanced structures and algorithm design", "Create a tested algorithm library", "Explain correctness and efficiency"],
    ],
  },

  "Web Development": {
    Beginner: [
      ["HTML Fundamentals", "Elements, links, images, forms and semantic HTML", "Build a personal webpage", "HTML structure"],
      ["CSS Fundamentals", "Selectors, colors, box model, margins and padding", "Style a webpage", "CSS box model"],
      ["JavaScript Basics", "Variables, conditions, loops, functions and arrays", "Create an interactive calculator", "JavaScript basics"],
      ["DOM and Events", "DOM selection, event listeners and form validation", "Build a to-do list", "DOM and events"],
      ["Responsive Design", "Flexbox, Grid, media queries and mobile-friendly layouts", "Create a responsive portfolio", "Responsive layouts"],
      ["Beginner Web Project", "Combine HTML, CSS and JavaScript", "Publish a personal portfolio website", "Explain the page structure"],
    ],
    Intermediate: [
      ["Modern JavaScript", "Modules, destructuring, promises and async/await", "Build an API-driven interface", "Asynchronous JavaScript"],
      ["Frontend Frameworks", "Components, props, state and component lifecycle concepts", "Create a component-based interface", "State and component design"],
      ["Backend Development", "HTTP, REST APIs, routing, middleware and validation", "Build a simple backend API", "REST and HTTP"],
      ["Database Integration", "Relational databases, CRUD and API integration", "Create a full-stack record manager", "CRUD and data flow"],
      ["Authentication and Testing", "Authentication concepts, validation and automated tests", "Add secure login flows to a demo app", "Authentication and testing"],
      ["Intermediate Web Project", "Combine frontend, backend and database functionality", "Build a full-stack web application", "Explain application architecture"],
    ],
    Advanced: [
      ["Application Architecture", "Component architecture, modular design and state management", "Refactor a large frontend application", "Architecture trade-offs"],
      ["Performance Optimization", "Rendering performance, caching, lazy loading and bundle size", "Profile and optimize a web application", "Performance analysis"],
      ["Web Security", "Input validation, access control, XSS and CSRF prevention", "Review and secure a demo application", "Common web vulnerabilities"],
      ["Scalable Backend Systems", "API design, caching, background jobs and rate limiting", "Design a scalable service", "Scalability"],
      ["Deployment and Observability", "CI/CD concepts, environment configuration, logging and monitoring", "Deploy a tested application", "Deployment and monitoring"],
      ["Advanced Web Project", "Combine security, performance, testing and deployment", "Deliver a production-style web project", "Explain design and security choices"],
    ],
  },

  "Data Analytics": {
    Beginner: [
      ["Spreadsheet Fundamentals", "Rows, columns, formulas, sorting and filtering", "Clean a sample spreadsheet", "Spreadsheet basics"],
      ["SQL for Analytics", "SELECT, WHERE, joins and aggregate functions", "Analyze sample sales records", "SQL filtering and grouping"],
      ["Python Data Analysis", "Pandas, NumPy and basic data cleaning", "Analyze a CSV dataset", "Data cleaning"],
      ["Charts and Visualization", "Bar charts, line charts, pie charts and chart selection", "Create a simple visual report", "Choosing charts"],
      ["Statistics and Insights", "Mean, median, outliers and correlation", "Write insights from a dataset", "Descriptive statistics"],
      ["Beginner Analytics Project", "Combine data cleaning, analysis and visualization", "Build a simple analytics dashboard", "Explain findings"],
    ],
    Intermediate: [
      ["Advanced Spreadsheet Analysis", "Lookup functions, pivot tables and data validation", "Build an interactive report", "Pivot tables and lookups"],
      ["Intermediate SQL", "CTEs, subqueries, joins and window-function basics", "Create a multi-table analysis", "Advanced SQL queries"],
      ["Data Transformation", "Data modelling, missing-value strategies and transformation workflows", "Prepare a reusable analysis dataset", "Transformation decisions"],
      ["Dashboard Design", "Power BI or similar tools, KPIs, filters and drill-downs", "Build an interactive business dashboard", "Dashboard design"],
      ["Statistical Analysis", "Hypothesis testing, distributions and regression basics", "Test a data-driven hypothesis", "Statistical interpretation"],
      ["Intermediate Analytics Project", "Combine SQL, data transformation and dashboards", "Create a business analytics report", "Explain business insights"],
    ],
    Advanced: [
      ["Advanced SQL Analytics", "Window functions, query optimization and analytical patterns", "Create an advanced reporting query", "Query efficiency"],
      ["Predictive Analytics", "Forecasting, regression, validation and prediction errors", "Build a small forecasting model", "Forecast evaluation"],
      ["Advanced Statistics", "Statistical inference, experiment design and uncertainty", "Analyze an experiment dataset", "Statistical assumptions"],
      ["Analytics Engineering", "Reusable transformations, data quality checks and data modelling", "Create a repeatable analytics pipeline", "Data quality"],
      ["Advanced BI and Storytelling", "Semantic models, performance, KPI governance and communication", "Design an executive-level dashboard", "Communicating insights"],
      ["Advanced Analytics Project", "Combine data pipelines, modelling and actionable insights", "Deliver a documented analytics solution", "Explain limitations and decisions"],
    ],
  },

  "Cloud Computing": {
    Beginner: [
      ["Cloud Fundamentals", "Cloud concepts, deployment models and service models", "Compare public, private and hybrid cloud", "IaaS, PaaS and SaaS"],
      ["Compute and Storage", "Virtual machines, object storage and basic databases", "Design a simple cloud architecture", "Compute and storage"],
      ["Cloud Networking", "Virtual networks, IP addresses, DNS and security groups", "Draw a basic cloud network", "Networking concepts"],
      ["Identity and Security", "IAM concepts, roles, permissions and shared responsibility", "Create a cloud security checklist", "Identity and access"],
      ["Basic Deployment", "Deploying a static website and configuring storage", "Publish a basic demo website", "Deployment steps"],
      ["Beginner Cloud Project", "Combine basic compute, storage and access controls", "Document a simple cloud solution", "Explain cloud service choices"],
    ],
    Intermediate: [
      ["Cloud Architecture", "Multi-tier architectures, load balancers and availability zones", "Design a highly available application", "Architecture decisions"],
      ["Containers", "Container images, Docker basics and container registries", "Containerize a small application", "Container fundamentals"],
      ["Infrastructure as Code", "Infrastructure templates, configuration and repeatable deployment", "Write a basic infrastructure template", "Infrastructure automation"],
      ["Managed Data Services", "Cloud databases, backups, replication and access control", "Design a managed database setup", "Database reliability"],
      ["Monitoring and Scaling", "Metrics, logs, autoscaling and alerting", "Create a monitoring and scaling plan", "Monitoring and scaling"],
      ["Intermediate Cloud Project", "Combine deployment, networking, security and monitoring", "Deploy a multi-tier demo application", "Explain reliability choices"],
    ],
    Advanced: [
      ["Distributed Cloud Architecture", "Microservices, event-driven systems and resilience patterns", "Design a resilient distributed service", "Distributed systems"],
      ["Container Orchestration", "Kubernetes concepts, deployments, services and scaling", "Deploy a containerized application", "Orchestration"],
      ["Cloud Security Engineering", "Least privilege, secrets, encryption and security monitoring", "Perform a cloud security review", "Security design"],
      ["Reliability Engineering", "Fault tolerance, disaster recovery, recovery objectives and testing", "Create a disaster recovery plan", "Reliability and recovery"],
      ["Cost and Performance", "Cost optimization, capacity planning and performance monitoring", "Optimize a sample cloud architecture", "Cost and performance trade-offs"],
      ["Advanced Cloud Project", "Combine automation, observability, security and resilience", "Document an advanced cloud architecture", "Explain architecture trade-offs"],
    ],
  },

  "C Programming": {
    Beginner: [
      ["C Fundamentals", "Variables, data types, operators and input/output", "Build a basic calculator", "Types and operators"],
      ["Conditions and Loops", "If/else, switch, for and while loops", "Create a menu-driven program", "Control flow"],
      ["Arrays and Strings", "Arrays, character arrays and common string functions", "Build a string utility program", "Array and string operations"],
      ["Functions", "Function declarations, parameters, return values and recursion basics", "Create a function-based calculator", "Functions"],
      ["Structures and Files", "Structures, basic file handling and error checking", "Build a student record program", "Structures and files"],
      ["Beginner C Project", "Combine functions, arrays, structures and files", "Create a console-based record system", "Explain program flow"],
    ],
    Intermediate: [
      ["Pointers in Depth", "Pointer arithmetic, arrays and pointers, and parameter passing", "Write pointer-based array utilities", "Pointers"],
      ["Dynamic Memory", "malloc, calloc, realloc, free and memory ownership", "Build a dynamically allocated collection", "Memory management"],
      ["Advanced Data Structures", "Linked lists, stacks, queues and trees in C", "Implement a linked list and stack", "Data structure operations"],
      ["Modular C Projects", "Header files, multiple source files and compilation", "Split a project into modules", "Compilation and linking"],
      ["File Processing and Debugging", "Binary files, error handling, debugging and sanitizers concepts", "Create a file-based data processor", "Debugging and file operations"],
      ["Intermediate C Project", "Combine pointers, dynamic memory and modular design", "Build a tested record management application", "Explain memory and structure"],
    ],
    Advanced: [
      ["Memory and Undefined Behavior", "Object lifetime, alignment, undefined behavior and safe memory access", "Investigate and fix memory errors", "Memory safety"],
      ["Low-Level Programming", "Bitwise operations, data representation and byte manipulation", "Build a binary data utility", "Bitwise operations"],
      ["Systems Programming", "Processes, system calls and operating-system interfaces", "Create a small systems utility", "System-level concepts"],
      ["Concurrency Concepts", "Threads, synchronization and race-condition basics", "Build a small concurrent C program", "Thread safety"],
      ["Performance and Portability", "Profiling, compiler warnings, portability and optimization", "Benchmark and improve a C program", "Performance trade-offs"],
      ["Advanced C Project", "Combine memory safety, modularity, testing and optimization", "Build a documented systems-oriented application", "Explain memory and performance"],
    ],
  },
};

// Certifications or learning pathways by skill and level.
const skillCertifications = {
  "Python Programming": {
    Beginner: "Python for Everybody – University of Michigan (Coursera). Focus: variables, loops, functions and basic programs.",
    Intermediate: "PCAP certification preparation. Focus: modules, exceptions, file handling and object-oriented programming.",
    Advanced: "PCPP certification pathway. Focus: advanced Python, concurrency, design patterns, testing and optimization.",
  },
  "SQL & DBMS": {
    Beginner: "Introduction to SQL – Coursera. Focus: SELECT, WHERE, sorting and basic queries.",
    Intermediate: "Intermediate SQL training. Focus: joins, subqueries, grouping, views and common table expressions.",
    Advanced: "Advanced SQL training. Focus: window functions, indexing, query optimization, transactions and execution plans.",
  },
  "Java Programming": {
    Beginner: "Java programming courses – Oracle learning resources. Focus: variables, conditions, loops, arrays and methods.",
    Intermediate: "Intermediate Java training. Focus: object-oriented programming, collections, exceptions and file handling.",
    Advanced: "Advanced Java certification preparation. Focus: generics, streams, concurrency, JVM concepts and performance.",
  },
  "Machine Learning": {
    Beginner: "Machine Learning Specialization – DeepLearning.AI and Stanford Online (Coursera). Focus: regression, classification and basic evaluation.",
    Intermediate: "Intermediate ML training. Focus: feature engineering, decision trees, clustering, cross-validation and tuning.",
    Advanced: "Advanced ML and MLOps training. Focus: deep learning, deployment, explainability, monitoring and production pipelines.",
  },
  "Data Structures & Algorithms": {
    Beginner: "Beginner DSA courses. Focus: arrays, strings, searching, sorting and basic complexity.",
    Intermediate: "Algorithms courses. Focus: recursion, trees, graphs, greedy algorithms and dynamic programming.",
    Advanced: "Advanced algorithms training. Focus: advanced dynamic programming, graph algorithms, correctness and optimization.",
  },
  "Web Development": {
    Beginner: "Responsive Web Design – freeCodeCamp. Focus: HTML, CSS, forms and responsive layouts.",
    Intermediate: "Full-stack web development training. Focus: JavaScript, frontend frameworks, APIs, backend and databases.",
    Advanced: "Advanced web development training. Focus: application architecture, security, performance, testing and deployment.",
  },
  "Data Analytics": {
    Beginner: "Google Data Analytics Professional Certificate – Coursera. Focus: spreadsheets, data cleaning, SQL basics and visualization.",
    Intermediate: "Microsoft Power BI Data Analyst (PL-300) preparation. Focus: data modelling, DAX, dashboards and reporting.",
    Advanced: "Advanced analytics training. Focus: advanced SQL, statistical analysis, forecasting and business insights.",
  },
  "Cloud Computing": {
    Beginner: "AWS Certified Cloud Practitioner or Microsoft Azure Fundamentals preparation. Focus: cloud concepts, services and security.",
    Intermediate: "AWS Solutions Architect Associate or Azure Administrator preparation. Focus: networking, deployment and cloud architecture.",
    Advanced: "Advanced cloud architecture training. Focus: scalable systems, automation, containers, monitoring and cost optimization.",
  },
  "C Programming": {
    Beginner: "Beginner C programming courses. Focus: variables, conditions, loops, arrays and functions.",
    Intermediate: "Intermediate C programming training. Focus: pointers, structures, dynamic memory and file handling.",
    Advanced: "Advanced C and systems programming training. Focus: memory management, debugging, concurrency and performance.",
  },
};

const durations = [
  { value: "3", title: "3 Months", subtitle: "Quick start" },
  { value: "6", title: "6 Months", subtitle: "Balanced plan" },
  { value: "9", title: "9 Months", subtitle: "In-depth learning" },
  { value: "12", title: "12 Months", subtitle: "Extended learning" },
];

const levels = [
  { name: "Beginner", icon: "🌱", description: "Start from the basics" },
  { name: "Intermediate", icon: "⚡", description: "Practise existing skills" },
  { name: "Advanced", icon: "🚀", description: "Learn advanced concepts" },
];

function buildMonths(skill, level, duration) {
  const syllabus =
    levelLessons[skill]?.[level] ||
    levelLessons["Python Programming"].Beginner;

  const count = Number(duration);

  return Array.from({ length: count }, (_, index) => {
    const original = syllabus[index % syllabus.length];
    const [baseTitle, baseTopics, baseProject, baseInterview] = original;

    let title = baseTitle;
    let topics = baseTopics;
    let project = baseProject;
    let interview = baseInterview;

    // Repeat the syllabus with progressively more independent practice
    // when the user selects a duration longer than six months.
    if (index >= syllabus.length) {
      const stage = Math.floor(index / syllabus.length) + 1;
      title = `${level} Practice ${stage}: ${baseTitle}`;
      topics = `${baseTopics}. Complete additional exercises, investigate mistakes, and apply the concepts independently.`;
      project = `Extend your project: ${baseProject}. Add tests, handle edge cases, and improve documentation.`;
      interview = `Practise more challenging questions about ${baseInterview.toLowerCase()}.`;
    }

    if (index === count - 1) {
      title = `${level} Final Project and Revision`;
      topics += " Review key concepts, fix weak areas, and revise the complete learning plan.";
      project = `Complete and document a final ${skill} project appropriate for the ${level.toLowerCase()} level.`;
      interview = `Review the important concepts, explain your project, and practise ${level.toLowerCase()}-level questions.`;
    }

    return {
      month: index + 1,
      title,
      topics,
      project,
      interview,
    };
  });
}

export default function PersonalizedRoadmap() {
  const [skill, setSkill] = useState("Python Programming");
  const [duration, setDuration] = useState("6");
  const [level, setLevel] = useState("Beginner");
  const [generated, setGenerated] = useState(false);
  const [activeMonth, setActiveMonth] = useState(1);
  const [completed, setCompleted] = useState([]);

  const months = useMemo(
    () => buildMonths(skill, level, duration),
    [skill, level, duration]
  );

  const certification =
    skillCertifications[skill]?.[level] ||
    "Choose a learning pathway related to your selected skill and level.";

  const storageKey = `${skill}-${level}-${duration}`;
  const current = months[activeMonth - 1] || months[0];
  const progress = Math.round((completed.length / months.length) * 100);
  const skillResources = resources[skill] || [];

  function generateRoadmap() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("skillRoadmapProgress") || "{}"
      );
      setCompleted(saved[storageKey] || []);
    } catch {
      setCompleted([]);
    }

    setActiveMonth(1);
    setGenerated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleComplete(month) {
    const next = completed.includes(month)
      ? completed.filter((item) => item !== month)
      : [...completed, month];

    setCompleted(next);

    try {
      const saved = JSON.parse(
        localStorage.getItem("skillRoadmapProgress") || "{}"
      );
      saved[storageKey] = next;
      localStorage.setItem("skillRoadmapProgress", JSON.stringify(saved));
    } catch (error) {
      console.error("Could not save learning progress", error);
    }
  }

  function downloadPlan() {
    const lines = [
      `${skill} Learning Roadmap`,
      `Experience level: ${level}`,
      `Duration: ${duration} months`,
      `Recommended learning pathway: ${certification}`,
      "",
      ...months.flatMap((month) => [
        `MONTH ${month.month}: ${month.title}`,
        `Topics: ${month.topics}`,
        `Practice project: ${month.project}`,
        `Revision focus: ${month.interview}`,
        "",
      ]),
      "LEARNING RESOURCES",
      ...skillResources.map(
        (resource) => `${resource.name}: ${resource.url}`
      ),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${skill
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-learning-roadmap.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="roadmap-page">
      <div className="roadmap-brand">
        <span className="roadmap-brand-mark">✦</span>
        SKILL<span className="roadmap-brand-divider">/</span>
        <span className="roadmap-brand-muted">LEARNING ROADMAP</span>
      </div>

      {!generated ? (
        <>
          <header className="generator-heading">
            <span className="generator-kicker">
              <Sparkles size={13} /> PERSONALIZED SKILL DEVELOPMENT
            </span>

            <h1>Skill Learning Planner</h1>

            <p>
              Choose a skill, your current experience level and learning
              duration. Get a monthly plan with level-specific topics,
              learning resources, practical tasks and revision.
            </p>
          </header>

          <section className="generator-panel">
            <h2>What skill do you want to learn?</h2>
            <p className="generator-help">Select a skill to get started.</p>

            <div className="career-grid">
              {skills.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`career-option ${
                    skill === item.name ? "selected" : ""
                  }`}
                  onClick={() => setSkill(item.name)}
                >
                  <span className="career-option-icon">{item.icon}</span>
                  <span className="career-option-name">{item.name}</span>
                  <span className="career-option-description">
                    {item.description}
                  </span>
                  {skill === item.name && (
                    <span className="career-selected-mark">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="generator-setting">
              <h3>Learning duration</h3>

              <div className="choice-row duration-options">
                {durations.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    className={`choice-card ${
                      duration === item.value ? "selected" : ""
                    }`}
                    onClick={() => setDuration(item.value)}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="generator-setting">
              <h3>Current experience level</h3>

              <div className="choice-row level-options">
                {levels.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`choice-card level-card ${
                      level === item.name ? "selected" : ""
                    }`}
                    onClick={() => setLevel(item.name)}
                  >
                    <span className="level-icon">{item.icon}</span>
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="generate-roadmap-button"
              onClick={generateRoadmap}
            >
              <Sparkles size={16} />
              Generate My Learning Roadmap
              <ChevronRight size={16} />
            </button>
          </section>
        </>
      ) : (
        <section className="generated-roadmap">
          <div className="generated-heading">
            <div className="generated-heading-top">
              <span className="generated-career-icon">
                {skills.find((item) => item.name === skill)?.icon}
              </span>

              <span className="generated-label">
                YOUR PERSONALIZED LEARNING PLAN
              </span>

              <button
                type="button"
                className="roadmap-reset-button"
                onClick={() => setGenerated(false)}
              >
                ← Change selections
              </button>

              <button
                type="button"
                className="roadmap-download"
                onClick={downloadPlan}
              >
                <Download size={14} /> Download plan
              </button>
            </div>

            <h1>{skill} Learning Roadmap</h1>

            <p>
              A learning plan for <strong>{level}</strong> level, planned
              across {duration} months.
            </p>

            <div className="roadmap-meta">
              <span>
                <Clock3 size={14} /> {duration} months
              </span>
              <span>
                <BookOpen size={14} /> {level} level
              </span>
              <span>
                <CheckCircle2 size={14} /> {completed.length}/{months.length}{" "}
                months completed
              </span>
            </div>

            <div className="roadmap-overall-progress">
              <div>
                <span>Overall learning progress</span>
                <strong>{progress}%</strong>
              </div>

              <div className="roadmap-progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="roadmap-stage-tabs">
            {months.map((month) => (
              <button
                type="button"
                key={month.month}
                className={activeMonth === month.month ? "active" : ""}
                onClick={() => setActiveMonth(month.month)}
              >
                Month {month.month}
                {completed.includes(month.month) ? " ✓" : ""}
              </button>
            ))}
          </div>

          <article
            className={`roadmap-stage-card ${
              completed.includes(current.month) ? "stage-complete" : ""
            }`}
          >
            <div className="stage-card-heading">
              <span className="stage-number">
                {String(current.month).padStart(2, "0")}
              </span>

              <div className="stage-title-wrap">
                <span className="stage-period">
                  MONTH {current.month} OF {duration}
                </span>

                <h2>{current.title}</h2>

                <p>
                  {level === "Beginner"
                    ? "Build a strong foundation through guided examples and regular practice."
                    : level === "Intermediate"
                    ? "Apply your knowledge through practical problems and independent projects."
                    : "Explore advanced techniques, optimization, architecture and real-world challenges."}
                </p>
              </div>

              <button
                type="button"
                className={`stage-complete-button ${
                  completed.includes(current.month) ? "done" : ""
                }`}
                onClick={() => toggleComplete(current.month)}
              >
                {completed.includes(current.month) ? (
                  <>
                    <CheckCircle2 size={14} /> Completed
                  </>
                ) : (
                  "Mark month complete"
                )}
              </button>
            </div>

            <div className="stage-card-content">
              <div>
                <h3>📘 TOPICS TO LEARN</h3>
                <p className="roadmap-detail-text">{current.topics}</p>

                <h3 className="roadmap-subheading">
                  🛠️ PRACTICAL TASK / PROJECT
                </h3>
                <p className="roadmap-detail-text">{current.project}</p>
              </div>

              <div>
                <h3>🎓 WHERE TO LEARN</h3>

                <div className="learning-resource-list">
                  {skillResources.map((resource) => (
                    <a
                      className="learning-resource-link"
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GraduationCap size={15} />
                      <span>{resource.name}</span>
                      <ExternalLink size={13} />
                    </a>
                  ))}
                </div>

                <h3 className="roadmap-subheading">
                  📝 REVISION / PRACTICE FOCUS
                </h3>
                <p className="roadmap-detail-text">{current.interview}</p>
              </div>
            </div>
          </article>

          <article className="roadmap-info-card certification-card">
            <h3>
              <GraduationCap size={16} />
              Recommended Certification / Learning Path
            </h3>

            <p>{certification}</p>

            <small>
              Some recommendations are learning pathways rather than formal
              certifications. Check the official provider website for current
              syllabus, exam availability and fees.
            </small>
          </article>

          <div className="roadmap-bottom-actions">
            <button
              type="button"
              className="roadmap-secondary-button"
              disabled={activeMonth === 1}
              onClick={() => setActiveMonth((month) => month - 1)}
            >
              ← Previous month
            </button>

            {activeMonth < months.length ? (
              <button
                type="button"
                className="generate-roadmap-button compact"
                onClick={() => setActiveMonth((month) => month + 1)}
              >
                Next month <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="generate-roadmap-button compact"
                onClick={downloadPlan}
              >
                <Download size={15} /> Download full plan
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
