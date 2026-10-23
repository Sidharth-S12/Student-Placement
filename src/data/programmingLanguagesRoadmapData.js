/**
 * Comprehensive Programming Languages Placement & Learning Dataset
 * Covers 40+ programming languages from mainstream to specialized & minute languages.
 */

export const languageCategories = [
  { id: "all", label: "All Languages", count: 40 },
  { id: "popular", label: "Popular & Placement Staples", count: 8 },
  { id: "systems", label: "Systems & Low-Level", count: 7 },
  { id: "web-mobile", label: "Web, Mobile & Full Stack", count: 7 },
  { id: "data-ai", label: "Data Science, AI & Math", count: 5 },
  { id: "functional", label: "Functional & Concurrency", count: 7 },
  { id: "enterprise", label: "Enterprise & Specialized", count: 6 },
];

export const programmingLanguages = [
  // 1. Python
  {
    id: "python",
    name: "Python",
    category: "popular",
    badge: "Most Popular",
    version: "3.12+",
    paradigm: "Multi-paradigm (OOP, Functional, Procedural), Interpreted/Bytecode",
    difficulty: "Beginner Friendly",
    compilerRuntime: "CPython, PyPy, Jython",
    industryUse: "Web Backends, AI/ML, Data Analytics, Automation Scripting, DevOps",
    topCompanies: ["Google", "Netflix", "Meta", "Spotify", "Dropbox", "Instagram"],
    officialDocs: "https://docs.python.org/3/",
    interactiveLearn: "https://exercism.org/tracks/python",
    description: "Versatile, high-level language with clean syntax, dynamic typing, and the world's largest data science & AI ecosystem.",
    keyEcosystem: ["FastAPI", "Django", "NumPy", "Pandas", "PyTorch", "Poetry", "PyTest"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Python Fundamentals & Data Types",
          topics: [
            { id: "py-b1", title: "Variables, Dynamic Typing & Memory References", detail: "id(), type(), mutability vs immutability (integers, floats, booleans, None)." },
            { id: "py-b2", title: "Control Flow: If-Elif-Else & Match-Case (Python 3.10+)", detail: "Conditional logic, short-circuit evaluation, structural pattern matching." },
            { id: "py-b3", title: "Loops: For, While, Range & Enumerate", detail: "Looping idioms, break, continue, else clauses on loops, zip() iteration." },
            { id: "py-b4", title: "Built-in Collections: Lists, Tuples, Sets & Dictionaries", detail: "Indexing, slicing, dictionary views, set unions/intersections, comprehensions." },
            { id: "py-b5", title: "Functions, Default Parameters, *args & **kwargs", detail: "Function scope, LEGB rule (Local, Enclosing, Global, Built-in), lambda expressions." },
          ],
          project: "Command-Line Expense Tracker with file persistence using JSON.",
          drillQuestion: "Explain the difference between mutable and immutable types in Python with practical examples.",
        },
        {
          phase: "Phase 2: Strings, File I/O & Exception Handling",
          topics: [
            { id: "py-b6", title: "String Manipulation, F-Strings & Unicode", detail: "String methods (split, join, strip), slicing step, formatted string literals." },
            { id: "py-b7", title: "File Operations: Reading, Writing & Context Managers (with)", detail: "Text vs binary mode, buffering, automatic cleanup with context managers." },
            { id: "py-b8", title: "Robust Exception Handling (try-except-else-finally)", detail: "Custom exception hierarchies, raising exceptions, tracebacks." },
            { id: "py-b9", title: "Modular Code: Imports, Modules & Virtual Environments (venv)", detail: "sys.path, __init__.py, pip, requirements.txt, virtual environment isolation." },
          ],
          project: "Automated Log File Analyzer that parses server error logs and generates summary reports.",
          drillQuestion: "Why should you use 'with open()' instead of manual f.open() and f.close()?",
        },
        {
          phase: "Phase 3: OOP & Standard Library Mastery",
          topics: [
            { id: "py-b10", title: "Classes, Objects, __init__ & self", detail: "Instance variables, class variables, __str__ vs __repr__." },
            { id: "py-b11", title: "Inheritance, Polymorphism & super()", detail: "Method resolution order (MRO), multiple inheritance, composition over inheritance." },
            { id: "py-b12", title: "Standard Library Highlights: collections, itertools, functools", detail: "defaultdict, Counter, deque, partial, lru_cache." },
          ],
          project: "Bank Account Management System with transaction logging and validation.",
          drillQuestion: "Explain Python's Method Resolution Order (MRO) and the C3 linearization algorithm.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Advanced Functional & Iteration Patterns",
          topics: [
            { id: "py-i1", title: "Iterators, Iterable Protocol & Generators (yield)", detail: "__iter__, __next__, generator expressions, memory efficiency with large datasets." },
            { id: "py-i2", title: "Decorators & Closures", detail: "Function closures, parameterized decorators, class decorators, functools.wraps." },
            { id: "py-i3", title: "Dunder (Magic) Methods & Operator Overloading", detail: "__getitem__, __setitem__, __len__, __enter__, __exit__, __call__." },
            { id: "py-i4", title: "Type Hinting & Static Checking (mypy)", detail: "typing module, Union, Optional, Callable, Generics, Protocol classes." },
          ],
          project: "Custom In-Memory Caching & Rate-Limiting Decorator with TTL support.",
          drillQuestion: "What is a closure in Python, and how does a decorator utilize it under the hood?",
        },
        {
          phase: "Phase 2: Concurrency, Asyncio & Multiprocessing",
          topics: [
            { id: "py-i5", title: "The Global Interpreter Lock (GIL) Deep Dive", detail: "CPU-bound vs I/O-bound bottlenecks, sub-interpreters (PEP 684), GIL-free Python." },
            { id: "py-i6", title: "Threading vs Multiprocessing in Python", detail: "threading.Thread, multiprocessing.Process, Queues, Locks, ProcessPoolExecutor." },
            { id: "py-i7", title: "Asynchronous Programming with asyncio", detail: "Event loop, async/await, coroutines, asyncio.gather(), aiohttp." },
          ],
          project: "Concurrent Web Scraper fetching and processing 1,000 URLs with asyncio and aiohttp.",
          drillQuestion: "When would you choose multiprocessing over threading in Python?",
        },
        {
          phase: "Phase 3: Testing, Packaging & Web Architecture",
          topics: [
            { id: "py-i8", title: "Unit Testing with PyTest & Mocking", detail: "Fixtures, parameterized tests, pytest-cov, unittest.mock." },
            { id: "py-i9", title: "Building REST APIs with FastAPI / Flask", detail: "Pydantic validation, dependency injection, async route handlers." },
            { id: "py-i10", title: "Database Integration: SQLAlchemy ORM & Alembic", detail: "Declarative models, sessions, connection pooling, migrations." },
          ],
          project: "Full-Stack RESTful Microservice with FastAPI, SQLAlchemy, PostgreSQL, and PyTest.",
          drillQuestion: "Explain how dependency injection works in FastAPI and why it promotes testability.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Python Internals & Memory Architecture",
          topics: [
            { id: "py-a1", title: "CPython Virtual Machine: Bytecode, Frame Objects & Eval Loop", detail: "dis module, code objects, ceval.c execution cycle." },
            { id: "py-a2", title: "Memory Allocation & Garbage Collection (PyMalloc & Cycles)", detail: "Arenas, pools, reference counting, cyclic garbage collection (gc module)." },
            { id: "py-a3", title: "Metaclasses, Descriptors & __new__ vs __init__", detail: "type as metaclass, property descriptor mechanics (__get__, __set__)." },
          ],
          project: "Custom Object-Relational Mapper (ORM) using Python Metaclasses and Descriptors.",
          drillQuestion: "Walk through how Python's garbage collector resolves reference cycles with the generational algorithm.",
        },
        {
          phase: "Phase 2: C Extensions & High-Performance Python",
          topics: [
            { id: "py-a4", title: "C Extensions: ctypes, CFFI & Cython", detail: "Wrapping C libraries, calling C functions, compiling Cython for 100x speedup." },
            { id: "py-a5", title: "Profiling & Optimization: cProfile, line_profiler, memory_profiler", detail: "Identifying CPU hotspots, reducing memory bloat, slots optimization (__slots__)." },
          ],
          project: "High-Performance Numerical Accelerator comparing pure Python, Cython, and C-extension implementations.",
          drillQuestion: "How does `__slots__` reduce memory footprint for millions of class instances?",
        },
      ],
    },
  },

  // 2. Java
  {
    id: "java",
    name: "Java",
    category: "popular",
    badge: "Enterprise Standard",
    version: "Java 21 LTS",
    paradigm: "Object-Oriented, Class-Based, Strongly Typed, Compiled to Bytecode (JVM)",
    difficulty: "Moderate",
    compilerRuntime: "javac, OpenJDK / HotSpot JVM, GraalVM",
    industryUse: "Enterprise Backend Systems, Android, High-Frequency Trading, Cloud Services",
    topCompanies: ["Amazon", "LinkedIn", "Netflix", "Google", "Goldman Sachs", "Uber"],
    officialDocs: "https://dev.java/learn/",
    interactiveLearn: "https://exercism.org/tracks/java",
    description: "Robust, platform-independent language powering planetary-scale banking, enterprise microservices, and big data systems.",
    keyEcosystem: ["Spring Boot", "Hibernate", "Maven", "Gradle", "JUnit 5", "Kafka", "Lombok"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Java Syntax, Types & OOP Foundations",
          topics: [
            { id: "jv-b1", title: "JVM Architecture: JDK, JRE, JVM, ClassLoader & Bytecode", detail: "Write Once Run Anywhere (WORA), execution flow, JIT compilation." },
            { id: "jv-b2", title: "Primitive Types, Reference Types & Wrapper Classes", detail: "byte, int, long, double, char, boolean, Autoboxing/Unboxing." },
            { id: "jv-b3", title: "Control Statements & Modern Switch Expressions", detail: "Pattern matching for switch, yield keyword, break, continue." },
            { id: "jv-b4", title: "OOP Core: Classes, Objects, Constructors & 'this'", detail: "Method overloading, constructor chaining, encapsulation with private fields." },
            { id: "jv-b5", title: "Inheritance, Method Overriding (@Override) & Polymorphism", detail: "Dynamic method dispatch, 'super' keyword, final classes and methods." },
          ],
          project: "Console-Based University Course Registration System with OOP principles.",
          drillQuestion: "Explain the difference between JDK, JRE, and JVM, and why Java is platform-independent.",
        },
        {
          phase: "Phase 2: Abstract Classes, Interfaces & Collections Framework",
          topics: [
            { id: "jv-b6", title: "Interfaces vs Abstract Classes & Default/Static Methods", detail: "Contract design, multiple interface inheritance, marker interfaces." },
            { id: "jv-b7", title: "Java Collections Framework: List, Set, Map & Queue", detail: "ArrayList vs LinkedList, HashSet vs TreeSet, HashMap hashing mechanics." },
            { id: "jv-b8", title: "Generics: Type Safety, Wildcards (? extends, ? super)", detail: "Compile-time checks, type erasure, bounded type parameters." },
            { id: "jv-b9", title: "Checked vs Unchecked Exceptions & Custom Exceptions", detail: "try-catch-finally, try-with-resources (AutoCloseable), Exception vs RuntimeException." },
          ],
          project: "Inventory Management Application using Generics, Custom Collections, and CSV storage.",
          drillQuestion: "How does HashMap work internally in Java 8+? Explain collision handling with linked lists and Red-Black Trees.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Modern Java (8 through 21): Lambdas, Streams & Records",
          topics: [
            { id: "jv-i1", title: "Lambda Expressions & Functional Interfaces (@FunctionalInterface)", detail: "Predicate, Consumer, Supplier, Function, method references (::)." },
            { id: "jv-i2", title: "Stream API: Intermediate vs Terminal Operations", detail: "map, filter, flatMap, reduce, collect, Collectors.groupingBy, parallel streams." },
            { id: "jv-i3", title: "Modern Features: Records, Sealed Classes & Pattern Matching", detail: "Immutable data carriers, exhaustive pattern matching, sealed hierarchies." },
            { id: "jv-i4", title: "Java I/O vs NIO.2 (Non-blocking I/O)", detail: "Files, Paths, Channels, ByteBuffers, asynchronous file channels." },
          ],
          project: "High-Throughput Log Streaming Analyzer using Java Streams and NIO.",
          drillQuestion: "Explain the difference between intermediate and terminal operations in the Java Stream API.",
        },
        {
          phase: "Phase 2: Concurrency, Virtual Threads (Project Loom) & Testing",
          topics: [
            { id: "jv-i5", title: "Threads, Runnable, Callable & ExecutorService", detail: "Thread lifecycle, Future, CompletableFuture, thread pools (Fixed, Cached)." },
            { id: "jv-i6", title: "Thread Safety: synchronized, volatile, Atomic Variables & Locks", detail: "Java Memory Model (JMM), ReentrantLock, ReadWriteLock, deadlocks." },
            { id: "jv-i7", title: "Virtual Threads (Java 21 Project Loom)", detail: "Platform threads vs Virtual threads, carrier threads, structured concurrency." },
            { id: "jv-i8", title: "Unit Testing with JUnit 5 & Mockito", detail: "Annotations (@Test, @ParameterizedTest), mocking dependencies, assertions." },
          ],
          project: "Multi-threaded Banking Transaction Simulator with optimistic & pessimistic locking.",
          drillQuestion: "What problem do Java 21 Virtual Threads solve compared to traditional platform threads?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: JVM Internals, Garbage Collection & Spring Boot Architecture",
          topics: [
            { id: "jv-a1", title: "JVM Memory Structure: Heap (Young/Old), Stack, Metaspace", detail: "Stack frames, escape analysis, heap memory allocation, out of memory errors." },
            { id: "jv-a2", title: "Garbage Collectors: G1GC, ZGC, Shenandoah", detail: "Generational GC, STW pauses, tuning JVM flags (-Xms, -Xmx, -XX:+UseZGC)." },
            { id: "jv-a3", title: "Spring Boot Microservices & Dependency Injection (IoC)", detail: "Bean lifecycle, @Autowired, Spring Data JPA, Spring Security with JWT." },
          ],
          project: "Production-Ready E-Commerce Microservice with Spring Boot, Spring Security, Redis & PostgreSQL.",
          drillQuestion: "Explain the difference between G1GC and ZGC in terms of pause times and memory footprints.",
        },
      ],
    },
  },

  // 3. C++
  {
    id: "cpp",
    name: "C++",
    category: "popular",
    badge: "Performance Beast",
    version: "C++20 / C++23",
    paradigm: "Multi-paradigm (Procedural, OOP, Generic, Functional), Compiled",
    difficulty: "Challenging",
    compilerRuntime: "GCC (g++), Clang, MSVC",
    industryUse: "Game Engines (Unreal), High-Frequency Trading, Operating Systems, Browsers",
    topCompanies: ["Jane Street", "Citadel", "Epic Games", "Google", "Microsoft", "Nvidia"],
    officialDocs: "https://en.cppreference.com/w/",
    interactiveLearn: "https://exercism.org/tracks/cpp",
    description: "The gold standard for zero-overhead performance, hardware control, competitive programming, and low-latency systems.",
    keyEcosystem: ["CMake", "Boost", "STL", "GTest", "Catch2", "Vcpkg", "Unreal Engine"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Core C++ Syntax, Pointers & Memory",
          topics: [
            { id: "cpp-b1", title: "Compiling C++: Preprocessor, Compilation, Linking", detail: "Header files (.h/.hpp), source files (.cpp), translation units." },
            { id: "cpp-b2", title: "Pointers, References & Pointer Arithmetic", detail: "Address-of operator (&), dereference (*), NULL vs nullptr, pass-by-reference." },
            { id: "cpp-b3", title: "Dynamic Memory: new, delete & Memory Leaks", detail: "Heap vs Stack allocation, array allocation, Valgrind leak detection." },
            { id: "cpp-b4", title: "Classes, Encapsulation, Constructors & Destructors", detail: "Initializer lists, default constructors, copy constructors, RAII concept." },
          ],
          project: "Custom Dynamic Array (MyVector) with manual dynamic memory resizing.",
          drillQuestion: "What is the difference between a pointer and a reference in C++?",
        },
        {
          phase: "Phase 2: Standard Template Library (STL) Mastery",
          topics: [
            { id: "cpp-b5", title: "Sequence Containers: std::vector, std::deque, std::list", detail: "Iterators, iterator invalidation, time complexities." },
            { id: "cpp-b6", title: "Associative Containers: std::map, std::set, std::unordered_map", detail: "Red-black trees vs hash buckets, custom hash functions." },
            { id: "cpp-b7", title: "STL Algorithms: std::sort, std::binary_search, std::transform", detail: "Lambda functions in STL algorithms, custom comparators." },
          ],
          project: "High-Performance In-Memory Student Registry using STL maps, sets, and algorithms.",
          drillQuestion: "Explain iterator invalidation rules when modifying an std::vector.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Modern C++ (C++11/14/17): Smart Pointers & Move Semantics",
          topics: [
            { id: "cpp-i1", title: "Smart Pointers: std::unique_ptr, std::shared_ptr, std::weak_ptr", detail: "Ownership semantics, reference counts, circular reference mitigation." },
            { id: "cpp-i2", title: "Lvalues, Rvalues, Move Semantics & std::move", detail: "Rvalue references (&&), move constructor, move assignment operator." },
            { id: "cpp-i3", title: "RAII (Resource Acquisition Is Initialization)", detail: "Automating mutex locks, file handles, and memory deallocation." },
            { id: "cpp-i4", title: "Templates & Generic Programming", detail: "Function templates, class templates, template specialization, typename vs class." },
          ],
          project: "Thread-Safe In-Memory Key-Value Store with RAII and smart pointers.",
          drillQuestion: "Explain move semantics in C++11 and how std::move enables zero-copy resource transfers.",
        },
        {
          phase: "Phase 2: Modern C++20 Features & Multithreading",
          topics: [
            { id: "cpp-i5", title: "C++20 Concepts, Ranges & Coroutines", detail: "Constraining templates with concepts, composable range pipelines." },
            { id: "cpp-i6", title: "Multithreading: std::thread, std::mutex, std::condition_variable", detail: "std::lock_guard, std::unique_lock, race conditions, atomic operations." },
          ],
          project: "Lock-Free Bounded Queue using C++ atomic primitives.",
          drillQuestion: "What are C++20 Concepts and how do they improve compiler error messages over SFINAE?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Low-Latency Systems & Cache Optimization",
          topics: [
            { id: "cpp-a1", title: "Cache Locality, Memory Alignment & SIMD", detail: "L1/L2/L3 cache misses, struct padding, alignas, AVX vectorization." },
            { id: "cpp-a2", title: "Template Metaprogramming & constexpr / consteval", detail: "Compile-time computation, type traits, folding expressions." },
          ],
          project: "High-Frequency Trading Order Matching Engine with microsecond latency benchmarks.",
          drillQuestion: "How does false sharing degrade multithreaded performance in C++, and how do you prevent it?",
        },
      ],
    },
  },

  // 4. C Programming
  {
    id: "c",
    name: "C Language",
    category: "systems",
    badge: "Foundation of Computing",
    version: "C17 / C23",
    paradigm: "Procedural, Imperative, Structured, Low-level Compiled",
    difficulty: "Challenging",
    compilerRuntime: "GCC, Clang, MSVC",
    industryUse: "Linux Kernel, Embedded Systems, IoT, Device Drivers, Microcontrollers",
    topCompanies: ["Intel", "Qualcomm", "Nvidia", "Apple", "ARM", "Microsoft"],
    officialDocs: "https://en.cppreference.com/w/c",
    interactiveLearn: "https://exercism.org/tracks/c",
    description: "The mother of modern languages. Offers uncompromising hardware access, minimal runtime overhead, and explicit memory control.",
    keyEcosystem: ["Make", "GDB", "Valgrind", "AddressSanitizer", "CMake"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: C Syntax, Data Types & Control Flow",
          topics: [
            { id: "c-b1", title: "Structure of a C Program & Compilation Stages", detail: "Preprocessing, compiling, assembling, linking." },
            { id: "c-b2", title: "Variables, Format Specifiers & Standard I/O", detail: "printf, scanf, getchar, integer sizes, limits.h." },
            { id: "c-b3", title: "Control Structures & Loops", detail: "if, switch, for, while, do-while." },
            { id: "c-b4", title: "Arrays & Character Strings", detail: "Null-terminated strings, string.h functions (strlen, strcpy, strcmp)." },
          ],
          project: "CLI Student Record Database using arrays and standard I/O.",
          drillQuestion: "Explain why gets() is deprecated and dangerous in C.",
        },
        {
          phase: "Phase 2: Pointers & Dynamic Memory Allocation",
          topics: [
            { id: "c-b5", title: "Pointers: Addresses, Dereferencing & Double Pointers", detail: "Pointer arithmetic, void pointers, NULL vs dangling pointers." },
            { id: "c-b6", title: "Dynamic Memory: malloc, calloc, realloc, free", detail: "Heap management, memory leaks, heap fragmentation." },
            { id: "c-b7", title: "Structures, Unions & Typedef", detail: "Struct alignment, padding, bit fields, unions." },
            { id: "c-b8", title: "File I/O: fopen, fread, fwrite, fclose", detail: "Binary vs text file processing, error handling with errno." },
          ],
          project: "Custom Memory-Managed Linked List and Stack Library in C.",
          drillQuestion: "What is the difference between malloc() and calloc() in C?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Advanced Pointers & Systems Programming",
          topics: [
            { id: "c-i1", title: "Function Pointers & Callback Architectures", detail: "Passing functions as arguments, callback handlers, jump tables." },
            { id: "c-i2", title: "Bitwise Operators & Bit Manipulation", detail: "&, |, ^, ~, <<, >>, setting, clearing, and toggling specific bits." },
            { id: "c-i3", title: "Preprocessor Directives & Macros", detail: "#define, #ifdef, #ifndef, header guards, token pasting (##)." },
            { id: "c-i4", title: "Debugging with GDB & Memory Profiling with Valgrind", detail: "Breakpoints, inspecting memory, detecting use-after-free and leaks." },
          ],
          project: "Custom Shell Implementation (Unix mini-shell) supporting fork(), execvp(), and pipes.",
          drillQuestion: "How do you declare a function pointer that takes two ints and returns a double?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: OS Interfaces, System Calls & Embedded C",
          topics: [
            { id: "c-a1", title: "Linux System Calls: read, write, open, mmap, brk/sbrk", detail: "Kernel space vs user space, context switches." },
            { id: "c-a2", title: "Building a Custom Malloc (Memory Allocator)", detail: "Free list management, boundary tags, splitting and coalescing blocks." },
            { id: "c-a3", title: "Volatile Keyword & Embedded Hardware Registers", detail: "Preventing compiler optimizations on memory-mapped I/O." },
          ],
          project: "Custom Dynamic Memory Allocator (my_malloc & my_free) using sbrk/mmap.",
          drillQuestion: "Why is the volatile keyword critical in embedded C and interrupt service routines?",
        },
      ],
    },
  },

  // 5. JavaScript
  {
    id: "javascript",
    name: "JavaScript",
    category: "popular",
    badge: "Web Ubiquitous",
    version: "ES2024 / Modern ESNext",
    paradigm: "Multi-paradigm (Event-driven, Functional, Prototype-based OOP), JIT Compiled",
    difficulty: "Beginner Friendly",
    compilerRuntime: "V8 (Chrome, Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari)",
    industryUse: "Web Frontends, Full-Stack Node.js, Mobile Apps (React Native), Desktop (Electron)",
    topCompanies: ["Meta", "Google", "Airbnb", "Netflix", "Uber", "Amazon"],
    officialDocs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    interactiveLearn: "https://exercism.org/tracks/javascript",
    description: "The programming language of the open web. Powers interactive client-side experiences and scalable asynchronous server runtimes.",
    keyEcosystem: ["Node.js", "React", "Next.js", "Express", "npm", "Jest", "Vite"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Modern JS Syntax, Types & Functions",
          topics: [
            { id: "js-b1", title: "let, const vs var & Lexical Scoping", detail: "Block scoping, temporal dead zone (TDZ), hoisting mechanics." },
            { id: "js-b2", title: "Data Types & Type Coercion (== vs ===)", detail: "Primitives vs objects, truthy/falsy values, Symbol, BigInt." },
            { id: "js-b3", title: "Arrow Functions, Rest/Spread & Destructuring", detail: "Array & object destructuring, default parameters, this binding." },
            { id: "js-b4", title: "Array Methods: map, filter, reduce, find, some, every", detail: "Declarative transformations, chaining array operations." },
          ],
          project: "Interactive Task & Budget Management Web App using vanilla JS and LocalStorage.",
          drillQuestion: "Explain the difference between == and === with coercive edge cases.",
        },
        {
          phase: "Phase 2: DOM Manipulation & Event Handling",
          topics: [
            { id: "js-b5", title: "DOM Traversal & Manipulation", detail: "querySelector, createElement, appendChild, classList." },
            { id: "js-b6", title: "Event Propagation: Bubbling, Capturing & Delegation", detail: "addEventListener, stopPropagation, event.target." },
            { id: "js-b7", title: "Browser Storage & APIs: LocalStorage, SessionStorage, Fetch API", detail: "HTTP requests, parsing JSON, storing state." },
          ],
          project: "Real-time Weather Dashboard fetching live API data with search and favorites.",
          drillQuestion: "What is event delegation in JavaScript, and why is it beneficial for performance?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Asynchronous JavaScript & The Event Loop",
          topics: [
            { id: "js-i1", title: "The Event Loop, Call Stack, Microtasks & Macrotasks", detail: "Promise resolution microtasks vs setTimeout macrotasks." },
            { id: "js-i2", title: "Promises & Async/Await Architecture", detail: "Promise.all, Promise.race, Promise.allSettled, error handling with try/catch." },
            { id: "js-i3", title: "Closures, Currying & Functional Programming", detail: "Data privacy with closures, partial application, higher-order functions." },
            { id: "js-i4", title: "Prototypes & Prototypal Inheritance", detail: "__proto__, prototype chain, Object.create(), ES6 class syntax under the hood." },
          ],
          project: "Custom Promise Implementation (MyPromise) from scratch compliant with Promises/A+.",
          drillQuestion: "Trace how the JavaScript Event Loop coordinates the Call Stack, Microtask Queue, and Macrotask Queue.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: JS Engines, Memory Management & Modern Tooling",
          topics: [
            { id: "js-a1", title: "V8 Engine Internals: Ignition & TurboFan", detail: "Just-In-Time compilation, hidden classes, inline caching, deoptimizations." },
            { id: "js-a2", title: "Memory Leaks & Garbage Collection (Mark-and-Sweep)", detail: "Detecting leaks with Chrome DevTools memory heap snapshots." },
            { id: "js-a3", title: "Web Workers & SharedArrayBuffer", detail: "Multi-threaded JavaScript execution off the main UI thread." },
          ],
          project: "High-Performance Data Visualization Dashboard rendering 50,000 live data points using Web Workers and Canvas.",
          drillQuestion: "How do hidden classes and inline caches optimize property access in V8?",
        },
      ],
    },
  },

  // 6. TypeScript
  {
    id: "typescript",
    name: "TypeScript",
    category: "web-mobile",
    badge: "Industry Standard",
    version: "5.4+",
    paradigm: "Typed superset of JavaScript, Multi-paradigm, Transpiled",
    difficulty: "Moderate",
    compilerRuntime: "tsc, ts-node, Bun, Deno",
    industryUse: "Enterprise Web Applications, Scalable Frontend/Backend, Large Codebases",
    topCompanies: ["Microsoft", "Slack", "Airbnb", "Google", "Stripe", "Asana"],
    officialDocs: "https://www.typescriptlang.org/docs/",
    interactiveLearn: "https://exercism.org/tracks/typescript",
    description: "JavaScript with syntax for types. Eliminates runtime type errors, accelerates developer velocity, and powers large-scale web engineering.",
    keyEcosystem: ["React", "NestJS", "Next.js", "Zod", "Prisma", "ESLint"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Type Annotations, Interfaces & Unions",
          topics: [
            { id: "ts-b1", title: "Basic Types: string, number, boolean, any, unknown, never", detail: "Type inference vs explicit annotations, unknown vs any." },
            { id: "ts-b2", title: "Interfaces vs Type Aliases", detail: "Declaration merging, extending interfaces, intersection types (&)." },
            { id: "ts-b3", title: "Union Types, Literal Types & Type Narrowing", detail: "typeof, instanceof, in operator, truthiness narrowing." },
          ],
          project: "Type-Safe Contact and Address Book with input validation.",
          drillQuestion: "Explain the difference between `any` and `unknown` in TypeScript.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Generics, Utility Types & Advanced Narrowing",
          topics: [
            { id: "ts-i1", title: "Generics: Generic Functions, Interfaces & Constraints", detail: "<T extends object>, keyof operator, generic defaults." },
            { id: "ts-i2", title: "Built-in Utility Types: Partial, Required, Pick, Omit, Record", detail: "Transforming existing types cleanly without duplication." },
            { id: "ts-i3", title: "Discriminated Unions & Custom Type Guards", detail: "is predicate functions (pet is Dog), exhaustive switch checks with never." },
          ],
          project: "Type-Safe State Machine & Event Dispatcher using Discriminated Unions.",
          drillQuestion: "How do custom type guards (`val is Type`) work and why are they safer than type assertions (`as Type`)?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Conditional Types & Template Literal Types",
          topics: [
            { id: "ts-a1", title: "Conditional Types & infer Keyword", detail: "T extends U ? X : Y, extracting return types with infer R." },
            { id: "ts-a2", title: "Mapped Types & Template Literal Types", detail: "[K in keyof T]: T[K], building type-safe routing strings (`/api/${string}`)." },
            { id: "ts-a3", title: "Type-Level Programming & Zod Schema Inference", detail: "Generating runtime validation schemas and TypeScript types simultaneously." },
          ],
          project: "Type-Safe Query Builder Library inferring SQL table schemas at compile time.",
          drillQuestion: "Write a custom TypeScript utility type `DeepReadonly<T>` that recursively makes all properties immutable.",
        },
      ],
    },
  },

  // 7. C# (.NET)
  {
    id: "csharp",
    name: "C#",
    category: "popular",
    badge: "Enterprise & Gaming",
    version: ".NET 8 / C# 12",
    paradigm: "Object-Oriented, Component-Oriented, Functional, Compiled (CLR)",
    difficulty: "Moderate",
    compilerRuntime: "Roslyn Compiler, .NET Core / CLR",
    industryUse: "Enterprise Web Services, Game Development (Unity), Cloud APIs (Azure), Desktop",
    topCompanies: ["Microsoft", "Accenture", "Stack Overflow", "Siemens", "EA Games"],
    officialDocs: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    interactiveLearn: "https://exercism.org/tracks/csharp",
    description: "Modern, type-safe, object-oriented language developed by Microsoft for cloud APIs, enterprise microservices, and Unity game development.",
    keyEcosystem: [".NET 8", "ASP.NET Core", "Entity Framework Core", "Unity", "xUnit"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: C# Syntax, Types & OOP",
          topics: [
            { id: "cs-b1", title: ".NET Architecture: CLR, CIL, JIT & Assemblies", detail: "Managed code execution, garbage collection." },
            { id: "cs-b2", title: "Value Types vs Reference Types & Structs vs Classes", detail: "Stack vs heap allocation, nullable value types (int?)." },
            { id: "cs-b3", title: "OOP: Classes, Properties, Auto-implemented Properties, Records", detail: "get/set accessors, init-only setters, record structs." },
          ],
          project: "Console-Based Bank Management System using C# classes, records, and exceptions.",
          drillQuestion: "Explain the difference between value types and reference types in C#.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: LINQ, Generics & Async/Await",
          topics: [
            { id: "cs-i1", title: "Language Integrated Query (LINQ): Method vs Query Syntax", detail: "Select, Where, GroupBy, Join, deferred execution (IEnumerable vs IQueryable)." },
            { id: "cs-i2", title: "Asynchronous Programming with async/await & Task", detail: "Task, Task<T>, ConfigureAwait, cancellation tokens (CancellationToken)." },
            { id: "cs-i3", title: "Delegates, Events & Lambdas", detail: "Action, Func, Predicate, event pub-sub pattern." },
          ],
          project: "High-Performance RESTful API using ASP.NET Core, EF Core, and PostgreSQL.",
          drillQuestion: "Explain the difference between IEnumerable and IQueryable in LINQ.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Memory Internals, Span<T> & High-Throughput .NET",
          topics: [
            { id: "cs-a1", title: "Zero-Allocation C#: Span<T>, Memory<T> & ReadOnlySpan", detail: "Contiguous memory manipulation without heap allocation." },
            { id: "cs-a2", title: "CLR Garbage Collection: Gen 0, Gen 1, Gen 2 & LOH", detail: "Large Object Heap (LOH), GC tuning, IDisposable & finalizers." },
          ],
          project: "Low-Allocation High-Speed JSON Parser utilizing Span<T> and UTF8String.",
          drillQuestion: "How does `Span<T>` allow safe, zero-allocation memory slicing across stack, heap, and native memory?",
        },
      ],
    },
  },

  // 8. Go (Golang)
  {
    id: "go",
    name: "Go (Golang)",
    category: "popular",
    badge: "Cloud-Native King",
    version: "Go 1.22+",
    paradigm: "Concurrent, Imperative, Compiled, Garbage-collected",
    difficulty: "Moderate",
    compilerRuntime: "gc (standard Go compiler), gccgo",
    industryUse: "Cloud Infrastructure (Docker, Kubernetes), Microservices, High-throughput Networking",
    topCompanies: ["Google", "Uber", "Cloudflare", "Twitch", "Netflix", "HashiCorp"],
    officialDocs: "https://go.dev/doc/",
    interactiveLearn: "https://exercism.org/tracks/go",
    description: "Created by Google for simplicity, speed, and massive concurrency. Powers the modern cloud infrastructure stack (Docker, Kubernetes, Terraform).",
    keyEcosystem: ["Goroutines", "Gin", "Echo", "gRPC", "Docker", "Kubernetes", "Prometheus"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Go Syntax, Types & Structs",
          topics: [
            { id: "go-b1", title: "Go Philosophy: Simplicity, Fast Compilation, Formatting (gofmt)", detail: "Explicit code, no inheritance, no exceptions." },
            { id: "go-b2", title: "Variables, Zero Values & Pointers", detail: "Short declaration (:=), pointer mechanics, pass by value." },
            { id: "go-b3", title: "Slices & Maps: Internal Header Mechanics", detail: "Length vs capacity, slice headers, make() vs new(), map iteration." },
            { id: "go-b4", title: "Structs, Methods & Value vs Pointer Receivers", detail: "Composition over inheritance, struct embedding." },
            { id: "go-b5", title: "Interfaces (Implicit Implementation)", detail: "Duck typing, empty interface (any), type assertions, type switches." },
            { id: "go-b6", title: "Explicit Error Handling Pattern (val, err := ...)", detail: "errors.Is, errors.As, defer, panic, and recover." },
          ],
          project: "Command-Line File Encryption and Compression Tool in pure Go.",
          drillQuestion: "How do interfaces work implicitly in Go, and how does a slice differ from an array?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Concurrency: Goroutines & Channels",
          topics: [
            { id: "go-i1", title: "Goroutines vs OS Threads: M:N Scheduler Mechanics", detail: "Go runtime scheduler (GMP model: Goroutine, Machine, Processor)." },
            { id: "go-i2", title: "Channels: Buffered vs Unbuffered & Select Statement", detail: "Channel direction (chan<- / <-chan), deadlocks, non-blocking selects." },
            { id: "go-i3", title: "Synchronization with sync.WaitGroup, sync.Mutex & sync.RWMutex", detail: "Preventing race conditions, the `-race` detector flag." },
            { id: "go-i4", title: "Context Package (context.Context)", detail: "Cancellation propagation, timeouts, deadlines, request-scoped values." },
          ],
          project: "Concurrent Worker Pool HTTP Health-Checker inspecting 500 endpoints concurrently.",
          drillQuestion: "Explain the GMP concurrency scheduler model in Go.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Network Systems & Profiling (pprof)",
          topics: [
            { id: "go-a1", title: "Microservices with gRPC & Protocol Buffers", detail: "Streaming RPCs, protobuf schema compilation, interceptors." },
            { id: "go-a2", title: "Profiling with pprof & Memory Escape Analysis", detail: "Stack vs heap escape analysis (`go build -gcflags='-m'`), CPU profiling." },
          ],
          project: "High-Throughput Distributed Rate-Limiting Microservice with gRPC and Redis.",
          drillQuestion: "How does Go's escape analysis decide whether a variable is allocated on the stack or the heap?",
        },
      ],
    },
  },

  // 9. Rust
  {
    id: "rust",
    name: "Rust",
    category: "systems",
    badge: "Memory-Safe Systems",
    version: "Rust 2021 Edition (1.76+)",
    paradigm: "Multi-paradigm (Functional, Imperative, Generic), Compiled",
    difficulty: "Steep Learning Curve",
    compilerRuntime: "rustc, LLVM backend",
    industryUse: "Systems Software, OS Kernels (Linux, Windows), WebAssembly, Crypto/Web3, Browsers",
    topCompanies: ["Amazon (AWS)", "Microsoft", "Meta", "Cloudflare", "Discord", "Figma"],
    officialDocs: "https://www.rust-lang.org/learn",
    interactiveLearn: "https://exercism.org/tracks/rust",
    description: "Guarantees memory safety and thread safety without a garbage collector through its revolutionary borrow checker and ownership model.",
    keyEcosystem: ["Cargo", "Tokio (Async)", "Actix-Web", "Serde", "Rayon", "WebAssembly"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Ownership, Borrowing & Lifetimes",
          topics: [
            { id: "rs-b1", title: "The Ownership Model: Move Semantics & Copy Trait", detail: "Each value has one owner; value drops when owner goes out of scope." },
            { id: "rs-b2", title: "References & Borrowing (& and &mut)", detail: "Aliasing XOR Mutability rule: multiple immutable borrows OR one mutable borrow." },
            { id: "rs-b3", title: "Slices, Strings (String vs &str) & Memory Layout", detail: "Fat pointers, stack allocated pointer + len + capacity vs pointer + len." },
            { id: "rs-b4", title: "Structs, Enums & Pattern Matching (match)", detail: "Option<T> and Result<T, E>, eliminating NullPointerExceptions." },
          ],
          project: "Custom CLI Markdown-to-HTML parser enforcing zero memory leaks.",
          drillQuestion: "Explain the two fundamental rules of Rust's borrow checker.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Traits, Generics, Error Handling & Concurrency",
          topics: [
            { id: "rs-i1", title: "Traits & Dynamic Dispatch (impl Trait vs dyn Trait)", detail: "Monomorphization vs vtables, standard traits (Clone, Display, Iterator)." },
            { id: "rs-i2", title: "Error Handling with Result and the `?` Operator", detail: "Custom error types with `thiserror` and `anyhow`." },
            { id: "rs-i3", title: "Fearless Concurrency: Send & Sync Traits", detail: "std::thread, Arc<Mutex<T>>, message passing with mpsc channels." },
            { id: "rs-i4", title: "Asynchronous Rust with Tokio", detail: "Futures, async/await, pin/unpin, non-blocking I/O runtime." },
          ],
          project: "Multi-threaded Web Crawler and Indexer using Tokio, Reqwest, and Arc<Mutex>.",
          drillQuestion: "What do the `Send` and `Sync` marker traits signify in Rust multithreading?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Unsafe Rust & Systems Programming",
          topics: [
            { id: "rs-a1", title: "Unsafe Rust & Raw Pointers (*const T, *mut T)", detail: "Dereferencing raw pointers, FFI (calling C libraries), building safe abstractions." },
            { id: "rs-a2", title: "Lifetime Annotations ('a, 'static) Deep Dive", detail: "Subtyping, variance, lifetime elision rules." },
          ],
          project: "Custom Lock-Free Concurrent Ring Buffer implemented with Unsafe Rust and atomics.",
          drillQuestion: "When is it necessary to use Unsafe Rust, and how do you wrap it in a safe public API?",
        },
      ],
    },
  },

  // 10. Kotlin
  {
    id: "kotlin",
    name: "Kotlin",
    category: "web-mobile",
    badge: "Modern Android & JVM",
    version: "Kotlin 1.9 / 2.0",
    paradigm: "Multi-paradigm (OOP, Functional), Statically Typed, JVM & Native",
    difficulty: "Moderate",
    compilerRuntime: "kotlinc, JVM, Kotlin/Native, Kotlin/Wasm",
    industryUse: "Android App Development, Modern Spring Boot Backends, Multiplatform Mobile (KMP)",
    topCompanies: ["Google", "Pinterest", "Netflix", "Uber", "Duolingo", "Cash App"],
    officialDocs: "https://kotlinlang.org/docs/home.html",
    interactiveLearn: "https://exercism.org/tracks/kotlin",
    description: "Concise, expressive language fully interoperable with Java. Google's preferred language for Android, and rising rapidly for backend microservices.",
    keyEcosystem: ["Coroutines", "Jetpack Compose", "Ktor", "Spring Boot", "Android SDK"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Null Safety & Modern Syntax",
          topics: [
            { id: "kt-b1", title: "Null Safety: Nullable Types (?) & Elvis Operator (?:)", detail: "Safe calls (?.), non-null assertion (!!), safe casts (as?)." },
            { id: "kt-b2", title: "Val vs Var, Data Classes & Smart Casts", detail: "Auto-generated equals, hashCode, copy, destructuring declarations." },
            { id: "kt-b3", title: "Functions, Default Arguments & Extension Functions", detail: "Extending third-party classes without inheritance." },
          ],
          project: "Habit Tracker App with data classes, null-safe collections, and file persistence.",
          drillQuestion: "How does Kotlin's type system eliminate NullPointerExceptions at compile time?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Coroutines, Flows & Android Jetpack Compose",
          topics: [
            { id: "kt-i1", title: "Kotlin Coroutines: Suspend Functions & CoroutineScope", detail: "Dispatchers (Main, IO, Default), structured concurrency, launch vs async." },
            { id: "kt-i2", title: "Reactive Streams with Kotlin Flow & StateFlow", detail: "Cold vs hot streams, intermediate operators (map, filter), collect." },
            { id: "kt-i3", title: "Modern Android Development with Jetpack Compose", detail: "Declarative UI, recomposition, State management (remember, mutableStateOf)." },
          ],
          project: "Real-time Crypto Price Tracker Android App with Jetpack Compose and Coroutines Flow.",
          drillQuestion: "Explain the difference between `launch` and `async` coroutine builders in Kotlin.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Kotlin Multiplatform (KMP) & Compiler Plugins",
          topics: [
            { id: "kt-a1", title: "Kotlin Multiplatform: Sharing Logic between iOS & Android", detail: "expect/actual declarations, multiplatform networking with Ktor." },
          ],
          project: "Cross-Platform Mobile App sharing business logic and network layer across iOS and Android.",
          drillQuestion: "How does Kotlin Multiplatform differ from Flutter and React Native in compilation and execution?",
        },
      ],
    },
  },

  // 11. Swift
  {
    id: "swift",
    name: "Swift",
    category: "web-mobile",
    badge: "Apple Ecosystem",
    version: "Swift 5.10 / Swift 6",
    paradigm: "Protocol-Oriented, Functional, Object-Oriented, Compiled",
    difficulty: "Moderate",
    compilerRuntime: "swiftc, LLVM backend",
    industryUse: "iOS, macOS, watchOS, visionOS App Development, Server-side Swift",
    topCompanies: ["Apple", "Airbnb", "Uber", "Lyft", "Robinhood", "LinkedIn"],
    officialDocs: "https://www.swift.org/documentation/",
    interactiveLearn: "https://exercism.org/tracks/swift",
    description: "Fast, modern, and safe programming language developed by Apple for building world-class native experiences across iOS, macOS, and visionOS.",
    keyEcosystem: ["SwiftUI", "Combine", "UIKit", "CoreData", "SwiftData", "Vapor"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Swift Basics, Optionals & Control Flow",
          topics: [
            { id: "sw-b1", title: "Optionals, Optional Binding (if let, guard let) & Nil-Coalescing (??)", detail: "Unwrapping safely, avoiding runtime crashes." },
            { id: "sw-b2", title: "Structs vs Classes: Value Semantics vs Reference Semantics", detail: "Copy-on-write, mutability rules, memory behavior." },
            { id: "sw-b3", title: "Enums with Associated Values & Pattern Matching", detail: "Type-safe modeling of state machines and API results." },
          ],
          project: "iOS Unit Converter App using SwiftUI and value-type models.",
          drillQuestion: "Explain why Apple prefers Structs over Classes in modern Swift and SwiftUI.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Protocols, SwiftUI & Modern Swift Concurrency",
          topics: [
            { id: "sw-i1", title: "Protocol-Oriented Programming (POP)", detail: "Protocols, protocol extensions, default implementations, generics constraints." },
            { id: "sw-i2", title: "SwiftUI Declarative Architecture (@State, @Binding, @Observable)", detail: "View lifecycle, environment values, navigation stacks." },
            { id: "sw-i3", title: "Swift Concurrency: async/await, Tasks & Actors", detail: "Actor isolation preventing data races, MainActor for UI updates." },
          ],
          project: "Native iOS News & Podcast Reader App with SwiftUI, Swift Concurrency, and SwiftData.",
          drillQuestion: "What is an `actor` in Swift and how does it prevent data races at compile time?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Memory Management (ARC) & Server-side Swift",
          topics: [
            { id: "sw-a1", title: "Automatic Reference Counting (ARC): Weak & Unowned References", detail: "Retain cycles, memory leak profiling with Xcode Instruments." },
          ],
          project: "Full-Stack Native App with an iOS SwiftUI frontend and a Vapor (Server-side Swift) backend.",
          drillQuestion: "Explain the difference between `weak` and `unowned` references in preventing ARC memory leaks.",
        },
      ],
    },
  },

  // 12. SQL
  {
    id: "sql",
    name: "SQL",
    category: "data-ai",
    badge: "Data Query Standard",
    version: "ANSI SQL:2023 / PostgreSQL",
    paradigm: "Declarative, Relational, Set-based",
    difficulty: "Beginner Friendly",
    compilerRuntime: "PostgreSQL, MySQL, SQL Server, SQLite, Oracle",
    industryUse: "Database Management, Data Analytics, Backend APIs, Business Intelligence",
    topCompanies: ["Amazon", "Meta", "Google", "Microsoft", "JPMorgan", "Snowflake"],
    officialDocs: "https://www.postgresql.org/docs/",
    interactiveLearn: "https://sqlbolt.com/",
    description: "The universal language for storing, querying, and manipulating relational data across all global enterprises and database engines.",
    keyEcosystem: ["PostgreSQL", "MySQL", "DBeaver", "Prisma", "dbt", "Snowflake"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Relational Foundations & Filtering",
          topics: [
            { id: "sql-b1", title: "SELECT, WHERE, DISTINCT, ORDER BY, LIMIT / OFFSET", detail: "Basic filtering, sorting, pagination." },
            { id: "sql-b2", title: "Aggregation Functions: COUNT, SUM, AVG, MIN, MAX & GROUP BY", detail: "HAVING clause vs WHERE clause differences." },
            { id: "sql-b3", title: "Relational Joins: INNER, LEFT, RIGHT, FULL OUTER & CROSS JOIN", detail: "Multi-table queries, foreign keys, handling NULLs." },
          ],
          project: "E-Commerce Database Schema and Sales Analysis Query Suite.",
          drillQuestion: "What is the logical query processing order in SQL (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY)?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Window Functions & Subqueries",
          topics: [
            { id: "sql-i1", title: "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE()", detail: "PARTITION BY, ORDER BY, running totals, top-N per category." },
            { id: "sql-i2", title: "Common Table Expressions (CTEs) & Recursive CTEs", detail: "Hierarchical org charts, readable modular queries." },
            { id: "sql-i3", title: "Database Normalization (1NF to BCNF) & Constraints", detail: "Primary keys, foreign keys, check constraints, cascade deletes." },
          ],
          project: "Complex Financial Cohort and Retention Analytics using Window Functions and CTEs.",
          drillQuestion: "Explain the difference between `RANK()` and `DENSE_RANK()` with duplicate values.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Performance Tuning & Indexing Internals",
          topics: [
            { id: "sql-a1", title: "Query Optimization with EXPLAIN ANALYZE", detail: "Index scans vs sequential scans, cost estimates, join strategies (Hash vs Nested Loop)." },
            { id: "sql-a2", title: "B-Tree vs Hash vs GIN Indexes & Partitioning", detail: "Clustered indexes, composite indexes, table partitioning strategies." },
          ],
          project: "Database Performance Tuning on a 5-million-row database optimizing slow queries from 12s to 15ms.",
          drillQuestion: "How does a B-Tree index structure accelerate range and point lookups?",
        },
      ],
    },
  },

  // 13. PHP
  {
    id: "php",
    name: "PHP",
    category: "web-mobile",
    badge: "Powers 75% of Web",
    version: "PHP 8.3+",
    paradigm: "Multi-paradigm (OOP, Procedural, Functional), Interpreted / JIT",
    difficulty: "Beginner Friendly",
    compilerRuntime: "PHP-FPM, Zend Engine, JIT Compiler",
    industryUse: "Web Backends (Laravel, Symfony), CMS (WordPress), E-Commerce (Shopify/Magento)",
    topCompanies: ["Meta", "Wikipedia", "Slack", "Automattic", "Mailchimp", "Canva"],
    officialDocs: "https://www.php.net/docs.php",
    interactiveLearn: "https://exercism.org/tracks/php",
    description: "Powers over 75% of websites worldwide. Modern PHP 8+ is fast, strictly typed, and features the world-class Laravel framework.",
    keyEcosystem: ["Laravel", "Composer", "PHPUnit", "Symfony", "Doctrine", "Pest"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Modern PHP 8 Syntax & OOP",
          topics: [
            { id: "php-b1", title: "Strict Typing, Named Arguments & Union Types (PHP 8)", detail: "declare(strict_types=1), nullsafe operator (??=, ?->)." },
            { id: "php-b2", title: "OOP: Classes, Constructor Property Promotion, Enums", detail: "Typed properties, readonly classes, interfaces." },
          ],
          project: "RESTful Task Management API using pure PHP 8 and PDO with prepared statements.",
          drillQuestion: "What is constructor property promotion in PHP 8 and how does it clean up boilerplate?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: The Laravel Framework Mastery",
          topics: [
            { id: "php-i1", title: "Laravel Routing, Middleware, Controllers & Blade", detail: "RESTful resource routing, request validation." },
            { id: "php-i2", title: "Eloquent ORM: Relationships, Migrations & Seeders", detail: "Eager loading (with) to prevent N+1 queries, mutators." },
          ],
          project: "Complete SaaS Multi-Tenant Platform with Laravel, Livewire, and Stripe integration.",
          drillQuestion: "How does eager loading in Eloquent prevent the notorious N+1 query problem?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Async PHP & High-Concurreny Runtimes",
          topics: [
            { id: "php-a1", title: "High-Performance PHP with Swoole, RoadRunner & Octane", detail: "Long-running daemonized PHP avoiding request startup overhead." },
          ],
          project: "Real-time WebSocket Chat and Notification Server with Laravel Octane and Swoole.",
          drillQuestion: "How does running PHP with RoadRunner/Octane eliminate the traditional PHP-FPM process spin-up cost?",
        },
      ],
    },
  },

  // 14. Ruby
  {
    id: "ruby",
    name: "Ruby",
    category: "web-mobile",
    badge: "Developer Happiness",
    version: "Ruby 3.3+ (YJIT)",
    paradigm: "Pure Object-Oriented, Dynamic, Metaprogramming-rich",
    difficulty: "Beginner Friendly",
    compilerRuntime: "MRI (CRuby) with YJIT, JRuby, TruffleRuby",
    industryUse: "Rapid Startup MVPs, Ruby on Rails Backends, DevOps Scripting (Homebrew, Chef)",
    topCompanies: ["Shopify", "GitHub", "Airbnb", "GitLab", "Basecamp", "Twitch"],
    officialDocs: "https://www.ruby-lang.org/en/documentation/",
    interactiveLearn: "https://exercism.org/tracks/ruby",
    description: "Designed for developer happiness. Pure object-oriented language where everything is an object, famed for Ruby on Rails.",
    keyEcosystem: ["Ruby on Rails", "Bundler", "RSpec", "Sidekiq", "Devise"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Ruby Syntax, Blocks & Everything-is-an-Object",
          topics: [
            { id: "rb-b1", title: "Dynamic Typing, Symbols vs Strings & Method Calls", detail: "Symbols as immutable identifiers, parentheses-optional syntax." },
            { id: "rb-b2", title: "Blocks, Procs, Lambdas & Yield", detail: "Code blocks with each, map, select; difference between Proc and Lambda." },
            { id: "rb-b3", title: "OOP: Classes, Modules, Mixins & attr_accessor", detail: "Multiple inheritance via modules (include vs prepend vs extend)." },
          ],
          project: "CLI E-Commerce Shopping Cart and Invoice Generator in pure Ruby.",
          drillQuestion: "Explain the difference between a Proc and a Lambda in Ruby.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Ruby on Rails & Active Record",
          topics: [
            { id: "rb-i1", title: "Convention over Configuration & MVC Architecture", detail: "Rails routing, controllers, views, params handling." },
            { id: "rb-i2", title: "Active Record: Associations, Validations & Scopes", detail: "has_many, belongs_to, polymorphic associations, callbacks." },
          ],
          project: "Full-Stack Blog Platform with authentication (Devise) and background job processing (Sidekiq).",
          drillQuestion: "What is Convention over Configuration, and how does Rails use it to speed up development?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Metaprogramming & Ruby 3 YJIT",
          topics: [
            { id: "rb-a1", title: "Ruby Metaprogramming: method_missing, define_method & eval", detail: "Dynamic method creation, DSL building, open classes." },
          ],
          project: "Custom Domain Specific Language (DSL) for HTML template generation and configuration.",
          drillQuestion: "Explain how `method_missing` works in Ruby and how to properly pair it with `respond_to_missing?`.",
        },
      ],
    },
  },

  // 15. R Language
  {
    id: "r",
    name: "R",
    category: "data-ai",
    badge: "Statistical Computing",
    version: "4.3+",
    paradigm: "Functional, Statistical, Array-based, Vectorized",
    difficulty: "Moderate",
    compilerRuntime: "R interpreter, RStudio",
    industryUse: "Bioinformatics, Clinical Trials, Academic Research, Econometrics, Quantitative Finance",
    topCompanies: ["FDA", "Pfizer", "Google", "Bank of America", "World Bank", "Novartis"],
    officialDocs: "https://www.r-project.org/other-docs.html",
    interactiveLearn: "https://exercism.org/tracks/r",
    description: "The specialized language for statistical computing, scientific research, and data visualization. Standard in clinical research and bioinformatics.",
    keyEcosystem: ["Tidyverse", "ggplot2", "dplyr", "RStudio", "Shiny", "Bioconductor"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: R Fundamentals, Vectors & DataFrames",
          topics: [
            { id: "r-b1", title: "Vectors, Matrices, Factors & Lists", detail: "Vectorization operations, recycling rule, 1-based indexing." },
            { id: "r-b2", title: "DataFrames & Missing Values (NA, NaN, NULL)", detail: "Subsetting with `[`, `[[`, and `$`, is.na() handling." },
          ],
          project: "Exploratory Statistical Analysis on public health survey data with summary statistics.",
          drillQuestion: "How does vector recycling work in R, and what are its potential pitfalls?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: The Tidyverse: dplyr & ggplot2",
          topics: [
            { id: "r-i1", title: "Data Wrangling with dplyr (filter, select, mutate, summarize)", detail: "Pipe operator (%>%), group_by, joins." },
            { id: "r-i2", title: "Publication-Quality Visualizations with ggplot2", detail: "Grammar of Graphics: aesthetics, geoms, scales, facets, themes." },
          ],
          project: "Interactive COVID-19 Epidemiology Dashboard using R Shiny and ggplot2.",
          drillQuestion: "Explain the philosophy of the 'Grammar of Graphics' implemented by ggplot2.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Advanced Statistical Modeling & Bio-computing",
          topics: [
            { id: "r-a1", title: "Linear, Logistic & Mixed-Effects Regression Modeling", detail: "lm(), glm(), ANOVA, model diagnostic plots, residuals." },
          ],
          project: "Predictive Healthcare Patient Mortality Model with cross-validation and ROC curves.",
          drillQuestion: "How do you diagnose multicollinearity in an R regression model using VIF?",
        },
      ],
    },
  },

  // 16. Dart
  {
    id: "dart",
    name: "Dart",
    category: "web-mobile",
    badge: "Powers Flutter",
    version: "Dart 3.3+",
    paradigm: "Object-Oriented, Class-based, Sound Null Safety, AOT/JIT Compiled",
    difficulty: "Beginner Friendly",
    compilerRuntime: "Dart VM (JIT for dev), dart2js, AOT native compiler",
    industryUse: "Cross-Platform Mobile Apps (iOS & Android via Flutter), Web & Desktop",
    topCompanies: ["Google", "BMW", "Alibaba", "ByteDance", "eBay", "Toyota"],
    officialDocs: "https://dart.dev/guides",
    interactiveLearn: "https://exercism.org/tracks/dart",
    description: "Client-optimized programming language created by Google. Features lightning-fast stateful hot reload and powers Flutter cross-platform apps.",
    keyEcosystem: ["Flutter", "Pub.dev", "Bloc", "Provider", "Riverpod", "Dio"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Dart 3 Syntax & Sound Null Safety",
          topics: [
            { id: "dt-b1", title: "Sound Null Safety: Non-nullable by default", detail: "Nullable types (?), late keyword, null-aware operators (?., ??, ??=)." },
            { id: "dt-b2", title: "Classes, Named Constructors & Factory Constructors", detail: "Initializer lists, const constructors for immutability." },
          ],
          project: "Cross-Platform Expense Tracker App using Flutter and Dart.",
          drillQuestion: "Explain the difference between `const` and `final` in Dart.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Asynchronous Dart & Flutter State Management",
          topics: [
            { id: "dt-i1", title: "Futures, Streams & Async/Await", detail: "Single-subscription vs broadcast streams, StreamBuilder." },
            { id: "dt-i2", title: "Flutter State Management with Riverpod or Bloc", detail: "Separating business logic from UI, reactive state binding." },
          ],
          project: "Full-Featured Social Media Feed App with Flutter, REST API integration, and Riverpod.",
          drillQuestion: "How does Flutter's Stateful Hot Reload work without restarting the Dart VM?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Isolates & Native FFI",
          topics: [
            { id: "dt-a1", title: "Dart Isolates: True Multi-threaded Concurrency", detail: "Message passing with SendPort and ReceivePort, avoiding UI frame drops." },
          ],
          project: "High-Performance Image Filtering App running heavy image processing in background Dart Isolates.",
          drillQuestion: "Why don't Dart Isolates share memory, and how do they communicate?",
        },
      ],
    },
  },

  // 17. Scala
  {
    id: "scala",
    name: "Scala",
    category: "functional",
    badge: "Big Data & Distributed",
    version: "Scala 3.3 LTS",
    paradigm: "Object-Oriented + Pure Functional, Statically Typed, JVM",
    difficulty: "Challenging",
    compilerRuntime: "scalac, JVM, Scala.js, Scala Native",
    industryUse: "Big Data Processing (Apache Spark), Distributed Reactive Systems (Akka), Fintech",
    topCompanies: ["Twitter/X", "Netflix", "Morgan Stanley", "LinkedIn", "Apple", "Zalando"],
    officialDocs: "https://docs.scala-lang.org/",
    interactiveLearn: "https://exercism.org/tracks/scala",
    description: "Fuses functional programming with object-oriented mechanics on the JVM. The powerhouse behind Apache Spark and distributed big data pipelines.",
    keyEcosystem: ["Apache Spark", "Akka / Pekko", "Cats", "ZIO", "sbt", "Play Framework"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Scala 3 Syntax, Immutability & Case Classes",
          topics: [
            { id: "sc-b1", title: "Vals vs Vars, Expressions & Python-like Indentation Syntax", detail: "Everything is an expression returning a value." },
            { id: "sc-b2", title: "Case Classes & Structural Pattern Matching", detail: "Pattern matching with guards, algebraic data types (ADTs)." },
          ],
          project: "Mathematical Expression Evaluator and Simplifier using Scala Pattern Matching.",
          drillQuestion: "What are Case Classes in Scala and what methods does the compiler auto-generate?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Functional Programming & Apache Spark",
          topics: [
            { id: "sc-i1", title: "Higher-Order Functions, Currying & Partial Functions", detail: "map, flatMap, foldLeft, composing pure functions." },
            { id: "sc-i2", title: "Apache Spark DataFrames & RDDs in Scala", detail: "Distributed data transformations, lazy evaluation, Spark SQL." },
          ],
          project: "Distributed Big Data Analytics Pipeline processing 10 million transactions with Apache Spark.",
          drillQuestion: "Explain the difference between RDDs and DataFrames in Apache Spark.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Typeclasses, Contextual Abstractions & ZIO",
          topics: [
            { id: "sc-a1", title: "Scala 3 Given & Using Clauses (Contextual Abstractions)", detail: "Replacing Scala 2 implicits with type-safe given instances." },
          ],
          project: "High-Throughput Distributed Microservice built with ZIO and pure functional effects.",
          drillQuestion: "How do `given` and `using` in Scala 3 improve upon implicit parameters in Scala 2?",
        },
      ],
    },
  },

  // 18. Shell / Bash
  {
    id: "bash",
    name: "Bash / Shell",
    category: "systems",
    badge: "DevOps & Automation",
    version: "Bash 5.2+ / POSIX sh",
    paradigm: "Command Language, Scripting, Procedural",
    difficulty: "Moderate",
    compilerRuntime: "Bash, Zsh, Sh",
    industryUse: "Server Automation, CI/CD Pipelines, Linux Sysadmin, Docker initialization",
    topCompanies: ["All Cloud & Tech Companies", "AWS", "Google", "Red Hat", "Canonical"],
    officialDocs: "https://www.gnu.org/software/bash/manual/",
    interactiveLearn: "https://exercism.org/tracks/bash",
    description: "The ubiquitous command language of Linux servers and container environments. Essential for DevOps, deployment automation, and system administration.",
    keyEcosystem: ["grep", "awk", "sed", "curl", "jq", "cron", "systemd"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Bash Scripting Fundamentals & Redirection",
          topics: [
            { id: "sh-b1", title: "Variables, Environment Variables ($PATH) & Quoting Rules", detail: "Single vs double quotes, variable interpolation, exit codes ($?)." },
            { id: "sh-b2", title: "Standard Streams & Redirection (stdin, stdout, stderr)", detail: "> vs >>, 2>&1, pipes (|), /dev/null discarding." },
            { id: "sh-b3", title: "Control Flow: If-Else, Test Commands ([ vs [[) & Loops", detail: "String comparisons, numerical tests, for in loops, while read." },
          ],
          project: "Automated Daily Backup Script that zips directories and uploads to S3 with rotating retention.",
          drillQuestion: "Explain the difference between `[ ]` and `[[ ]]` in Bash.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Text Processing: Grep, Awk & Sed",
          topics: [
            { id: "sh-i1", title: "Text Extraction with Regular Expressions & Grep", detail: "grep -E, -v, -i, matching log patterns." },
            { id: "sh-i2", title: "Stream Editing with Sed & Column Parsing with Awk", detail: "Regex search-and-replace, field separators, formatted summary tables." },
            { id: "sh-i3", title: "Bash Error Safety: set -euo pipefail", detail: "Writing bulletproof scripts that fail fast on errors." },
          ],
          project: "Nginx Access Log Parser producing real-time Top IP and 404 Error Reports with Awk.",
          drillQuestion: "Why should every production Bash script start with `set -euo pipefail`?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Linux Process Orchestration & Traps",
          topics: [
            { id: "sh-a1", title: "Signals, Traps (trap cleanup EXIT) & Background Jobs", detail: "Signal handling (SIGINT, SIGTERM), job control (&, wait)." },
          ],
          project: "Resilient Server Provisioning & Zero-Downtime Deployment CLI Tool.",
          drillQuestion: "How do `trap` handlers ensure clean resource deallocation when a script receives SIGINT?",
        },
      ],
    },
  },

  // 19. Zig
  {
    id: "zig",
    name: "Zig",
    category: "systems",
    badge: "Modern C Alternative",
    version: "0.11 / 0.12",
    paradigm: "Systems, Imperative, Compile-time Execution (comptime)",
    difficulty: "Challenging",
    compilerRuntime: "zig compiler, LLVM backend",
    industryUse: "Operating Systems, Game Development, High-performance CLI tools, C Compiler Replacement",
    topCompanies: ["Uber", "Bun.sh (uses Zig for core runtime)", "TigerBeetle DB"],
    officialDocs: "https://ziglang.org/documentation/",
    interactiveLearn: "https://exercism.org/tracks/zig",
    description: "General-purpose systems programming language. No hidden control flow, no hidden memory allocations, and revolutionary `comptime` code execution.",
    keyEcosystem: ["Zig Build System", "Bun (built with Zig)", "TigerBeetle"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Zig Syntax, Explicit Allocators & Errors",
          topics: [
            { id: "zig-b1", title: "No Hidden Allocations: Passing std.mem.Allocator explicitly", detail: "GeneralPurposeAllocator, ArenaAllocator, FixedBufferAllocator." },
            { id: "zig-b2", title: "Error Sets & defer / errdefer", detail: "Explicit error union types (!T), guaranteed cleanup with defer." },
          ],
          project: "Memory-Safe CLI File Utility built in Zig with ArenaAllocator.",
          drillQuestion: "Why does Zig require passing an explicit Allocator to functions that allocate memory?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Compile-Time Execution (comptime)",
          topics: [
            { id: "zig-i1", title: "comptime: Metaprogramming and Generics without Macros", detail: "Compile-time type generation, compile-time assertions." },
            { id: "zig-i2", title: "Seamless C Interoperability (@cImport)", detail: "Including C header files directly without bindings." },
          ],
          project: "High-Performance JSON Serializer generated via Zig comptime introspection.",
          drillQuestion: "How does `comptime` in Zig replace templates and macros from other languages?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Systems & Kernel Development",
          topics: [
            { id: "zig-a1", title: "Writing a Bare-Metal OS Kernel in Zig", detail: "Volatile memory, inline assembly, linker scripts." },
          ],
          project: "Mini OS Kernel booting via QEMU with serial output written entirely in Zig.",
          drillQuestion: "Explain the difference between `defer` and `errdefer` in Zig.",
        },
      ],
    },
  },

  // 20. Julia
  {
    id: "julia",
    name: "Julia",
    category: "data-ai",
    badge: "High-Performance Scientific",
    version: "Julia 1.10+",
    paradigm: "Multiple Dispatch, Numerical, Dynamic yet Fast (JIT)",
    difficulty: "Moderate",
    compilerRuntime: "Julia JIT (LLVM)",
    industryUse: "Scientific Computing, Quantitative Finance, Aerospace, Machine Learning, Climate Modeling",
    topCompanies: ["MIT", "NASA", "Federal Reserve", "Pfizer", "Jane Street"],
    officialDocs: "https://docs.julialang.org/",
    interactiveLearn: "https://exercism.org/tracks/julia",
    description: "Solves the 'two-language problem'—writes like Python, runs at the speed of C. Standard for scientific simulations and high-speed quantitative finance.",
    keyEcosystem: ["Flux.jl", "DifferentialEquations.jl", "DataFrames.jl", "Pluto.jl"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Julia Syntax, Types & Multiple Dispatch",
          topics: [
            { id: "jl-b1", title: "Dynamic Typing with High Performance & JIT warmup", detail: "Type annotations, type stability, benchmarking with @btime." },
            { id: "jl-b2", title: "Multiple Dispatch Architecture", detail: "Functions with multiple method signatures resolved at runtime." },
          ],
          project: "Numerical Integration and Differential Equation Solver in pure Julia.",
          drillQuestion: "Explain how Multiple Dispatch differs from classical Object-Oriented single dispatch.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Scientific Modeling & SIMD Parallelism",
          topics: [
            { id: "jl-i1", title: "Vectorization, Broadcasting (dot syntax) & Metaprogramming", detail: "Array operations (f.(x)), macros (@time, @threads)." },
          ],
          project: "Monte Carlo Financial Asset Pricing Simulation utilizing Julia multi-threading.",
          drillQuestion: "What is type instability in Julia and why does it cause massive performance slowdowns?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: High-Performance GPU Computing",
          topics: [
            { id: "jl-a1", title: "CUDA.jl GPU Acceleration for Matrix Computations", detail: "Running native Julia code directly on Nvidia GPU kernels." },
          ],
          project: "GPU-Accelerated N-Body Gravitational Physics Simulator in Julia.",
          drillQuestion: "How does Julia achieve C-like performance without explicit compilation step by the user?",
        },
      ],
    },
  },

  // 21. Elixir
  {
    id: "elixir",
    name: "Elixir",
    category: "functional",
    badge: "Fault-Tolerant Concurrency",
    version: "Elixir 1.16+",
    paradigm: "Functional, Concurrent, Actor Model, Compiled to BEAM bytecode",
    difficulty: "Moderate",
    compilerRuntime: "BEAM (Erlang Virtual Machine)",
    industryUse: "Real-time Chat, Telecommunications, High-Concurrency Web APIs (Phoenix LiveView)",
    topCompanies: ["Discord", "WhatsApp", "Pinterest", "PepsiCo", "Bleacher Report"],
    officialDocs: "https://elixir-lang.org/docs.html",
    interactiveLearn: "https://exercism.org/tracks/elixir",
    description: "Runs on the legendary Erlang BEAM VM. Built for high availability, massive concurrency (millions of processes), and fault tolerance.",
    keyEcosystem: ["Phoenix Framework", "Mix", "Ecto", "LiveView", "Oban"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Functional Elixir & Pattern Matching",
          topics: [
            { id: "ex-b1", title: "Immutability & Pattern Matching (The Match Operator =)", detail: "Matching lists, maps, tuples, pin operator (^)." },
            { id: "ex-b2", title: "The Pipe Operator (|>) & Pure Functions", detail: "Composing readable data transformations." },
          ],
          project: "CLI Text Processing Pipeline using Elixir Stream and Pipe operators.",
          drillQuestion: "Why is `=` called the match operator rather than the assignment operator in Elixir?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: OTP, GenServers & Supervision Trees",
          topics: [
            { id: "ex-i1", title: "BEAM Processes vs OS Threads: Micro-processes", detail: "Spawning lightweight processes, message passing (send / receive)." },
            { id: "ex-i2", title: "GenServer (Generic Server) Architecture", detail: "Managing state, handle_call vs handle_cast." },
            { id: "ex-i3", title: "Supervisors & 'Let It Crash' Philosophy", detail: "Self-healing distributed systems, restart strategies." },
          ],
          project: "Fault-Tolerant In-Memory Key-Value Store with automatic crash recovery.",
          drillQuestion: "Explain the 'Let it Crash' philosophy in Erlang/Elixir systems.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Real-Time Phoenix LiveView",
          topics: [
            { id: "ex-a1", title: "Phoenix LiveView: Server-Rendered Real-Time Web Apps", detail: "Zero client-side JS WebSockets, minimal payload diffs." },
          ],
          project: "Real-Time Collaborative Document Editor built with Phoenix LiveView and PubSub.",
          drillQuestion: "How does Phoenix LiveView update the browser UI over WebSockets without sending full HTML pages?",
        },
      ],
    },
  },

  // 22. Haskell
  {
    id: "haskell",
    name: "Haskell",
    category: "functional",
    badge: "Pure Functional Standard",
    version: "GHC 9.8+",
    paradigm: "Purely Functional, Lazy Evaluation, Static Strong Types",
    difficulty: "Steep Learning Curve",
    compilerRuntime: "GHC (Glasgow Haskell Compiler)",
    industryUse: "Cryptocurrency (Cardano), Formal Verification, Compiler Design, Quant Finance",
    topCompanies: ["Standard Chartered", "Barclays", "Cardano / IOHK", "Jane Street", "Meta"],
    officialDocs: "https://www.haskell.org/documentation/",
    interactiveLearn: "https://exercism.org/tracks/haskell",
    description: "The mathematical benchmark of pure functional programming. Features pure functions, lazy evaluation by default, and monadic side-effect isolation.",
    keyEcosystem: ["Cabal", "Stack", "QuickCheck", "Lens", "GHCi"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Pure Functions, Types & Pattern Matching",
          topics: [
            { id: "hs-b1", title: "Purity & Immutability: No Side Effects", detail: "Mathematical functions, currying by default." },
            { id: "hs-b2", title: "Algebraic Data Types (ADTs): Sum & Product Types", detail: "data Bool = True | False, record syntax." },
            { id: "hs-b3", title: "Typeclasses: Eq, Ord, Show, Read, Num", detail: "Ad-hoc polymorphism vs object-oriented interfaces." },
          ],
          project: "Type-Safe Polish Notation Math Expression Parser.",
          drillQuestion: "What is lazy evaluation in Haskell, and how can infinite data structures like `[1..]` exist?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Functors, Applicatives & Monads",
          topics: [
            { id: "hs-i1", title: "Functor & fmap: Mapping over Containers", detail: "fmap definition and the two functor laws." },
            { id: "hs-i2", title: "Applicative Functors: Pure and (<*>)", detail: "Applying functions in a context to values in a context." },
            { id: "hs-i3", title: "Monads & The IO Monad: Isolating Side Effects", detail: "bind operator (>>=), do notation, Maybe and Either monads." },
          ],
          project: "Safe Database Query Runner isolating all side-effects using the IO and Reader Monads.",
          drillQuestion: "Explain what a Monad is in Haskell in terms of `return` and `(>>=)`.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Advanced Type-Level Programming",
          topics: [
            { id: "hs-a1", title: "GADTs, DataKinds & Type Families", detail: "Enforcing business constraints at compile time via type proofs." },
          ],
          project: "Formally Verified Financial Transaction Ledger with compile-time zero-error guarantees.",
          drillQuestion: "How do GADTs (Generalized Algebraic Data Types) allow more precise type refinement in pattern matches?",
        },
      ],
    },
  },

  // 23. Clojure
  {
    id: "clojure",
    name: "Clojure",
    category: "functional",
    badge: "Modern Lisp on JVM",
    version: "Clojure 1.11+",
    paradigm: "Lisp, Functional, Dynamic, Persistent Data Structures, JVM",
    difficulty: "Moderate",
    compilerRuntime: "JVM, ClojureScript (JS)",
    industryUse: "Data Analysis, Fintech, Scalable Backends (Nubank), Full-Stack Web",
    topCompanies: ["Nubank", "Walmart Labs", "Atlassian", "Funding Circle"],
    officialDocs: "https://clojure.org/reference/documentation",
    interactiveLearn: "https://exercism.org/tracks/clojure",
    description: "A modern, dynamic, and functional Lisp dialect on the JVM. Treats code as data (homoiconicity) with world-class persistent immutable data structures.",
    keyEcosystem: ["Leiningen", "Ring", "Compojure", "ClojureScript", "Reagent"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Lisp Syntax (S-expressions) & Immutability",
          topics: [
            { id: "clj-b1", title: "Prefix Notation & S-Expressions: Code is Data", detail: "Homoiconicity, macros, quoting." },
            { id: "clj-b2", title: "Persistent Data Structures: Lists, Vectors, Maps, Sets", detail: "Structural sharing, zero copy overhead for immutability." },
          ],
          project: "CLI Flashcard Learning System in Clojure with persistent JSON state.",
          drillQuestion: "What is homoiconicity in Lisp/Clojure?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Concurrency with Atoms, Refs & Software Transactional Memory",
          topics: [
            { id: "clj-i1", title: "Managing State: Atoms, swap!, reset!", detail: "Lock-free atomic updates via compare-and-swap." },
            { id: "clj-i2", title: "Software Transactional Memory (STM) with Refs and dosync", detail: "ACID transactions in memory without database locks." },
          ],
          project: "Multi-threaded Banking Balance Manager using STM Refs.",
          drillQuestion: "How does Clojure's Software Transactional Memory (STM) manage coordinated concurrent updates?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Clojure Macros & Metaprogramming",
          topics: [
            { id: "clj-a1", title: "defmacro, syntax-quote (`), and unquote (~)", detail: "Transforming code at compile time before JVM bytecode generation." },
          ],
          project: "Custom Domain Specific Language (DSL) for declarative validation.",
          drillQuestion: "Explain the difference between `quote` and `syntax-quote` in Clojure macros.",
        },
      ],
    },
  },

  // 24. Lua
  {
    id: "lua",
    name: "Lua",
    category: "systems",
    badge: "Lightweight Embeddable",
    version: "Lua 5.4 / LuaJIT",
    paradigm: "Multi-paradigm (Scripting, Procedural, Prototype-based)",
    difficulty: "Beginner Friendly",
    compilerRuntime: "Lua interpreter, LuaJIT",
    industryUse: "Game Scripting (Roblox, World of Warcraft), Web Gateways (Kong, NGINX OpenResty), Redis",
    topCompanies: ["Roblox", "Blizzard", "Kong", "Cloudflare", "Redis Labs"],
    officialDocs: "https://www.lua.org/docs.html",
    interactiveLearn: "https://exercism.org/tracks/lua",
    description: "Incredible speed in a featherweight package (less than 300KB runtime). The premier embedding scripting language for game engines and high-speed API gateways.",
    keyEcosystem: ["LuaJIT", "LÖVE 2D (Game Engine)", "OpenResty", "Roblox Luau"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Lua Syntax, Tables & Functions",
          topics: [
            { id: "lua-b1", title: "The Single Data Structure: Tables (Arrays & Dictionaries unified)", detail: "1-based indexing, numeric keys vs hash keys." },
            { id: "lua-b2", title: "Multiple Return Values, Closures & Lexical Scoping", detail: "Packing and unpacking return values." },
          ],
          project: "Text Adventure Game Engine with table-based world states in Lua.",
          drillQuestion: "How do tables in Lua represent both arrays and dictionaries?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Metatables & Object-Oriented Emulation",
          topics: [
            { id: "lua-i1", title: "Metatables & Metamethods (__index, __newindex, __add)", detail: "Operator overloading and prototype-based OOP inheritance." },
          ],
          project: "2D Arcade Game built with the LÖVE2D Game Engine in Lua.",
          drillQuestion: "How does the `__index` metamethod enable OOP class inheritance in Lua?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: C API Integration & Redis Scripting",
          topics: [
            { id: "lua-a1", title: "Embedding Lua in C/C++ Applications via lua_State", detail: "Stack-based C API for calling Lua from C and vice versa." },
          ],
          project: "Atomic Distributed Rate Limiter written in Lua running directly inside Redis.",
          drillQuestion: "How does the Lua virtual machine communicate with C through the virtual stack?",
        },
      ],
    },
  },

  // 25. Solidity
  {
    id: "solidity",
    name: "Solidity",
    category: "enterprise",
    badge: "Web3 Smart Contracts",
    version: "0.8.24+",
    paradigm: "Contract-Oriented, Object-Oriented, Compiled to EVM bytecode",
    difficulty: "Challenging",
    compilerRuntime: "solc (Solidity Compiler), Ethereum Virtual Machine (EVM)",
    industryUse: "Smart Contracts, Decentralized Finance (DeFi), NFTs, Web3 Protocols",
    topCompanies: ["Uniswap", "OpenSea", "Chainlink", "ConsenSys", "Coinbase", "Polygon"],
    officialDocs: "https://docs.soliditylang.org/",
    interactiveLearn: "https://cryptozombies.io/",
    description: "The primary language for developing smart contracts on Ethereum and EVM-compatible blockchains. Demands extreme security awareness due to immutable code execution.",
    keyEcosystem: ["Hardhat", "Foundry", "OpenZeppelin", "Ethers.js", "Viem"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: EVM Architecture & Solidity Basics",
          topics: [
            { id: "sol-b1", title: "EVM Memory Model: Storage, Memory, Calldata & Stack", detail: "Gas costs of persistent storage vs ephemeral memory." },
            { id: "sol-b2", title: "State Variables, Functions & Visibility (public, private, external, internal)", detail: "View vs Pure functions, payable functions." },
            { id: "sol-b3", title: "Mappings & Structs", detail: "Key-value hash mappings, storage slot mechanics." },
          ],
          project: "ERC-20 Token Smart Contract with minting, transfers, and allowances.",
          drillQuestion: "Explain the difference between `storage`, `memory`, and `calldata` in Solidity gas costs.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Security Patterns & DeFi Mechanics",
          topics: [
            { id: "sol-i1", title: "Reentrancy Attacks & Checks-Effects-Interactions Pattern", detail: "ReentrancyGuard, preventing millions in hack losses." },
            { id: "sol-i2", title: "OpenZeppelin Standards (ERC-721 NFTs, AccessControl)", detail: "Ownable, Pausable, Role-Based Access Control." },
          ],
          project: "Decentralized Escrow and NFT Marketplace with automated fee distribution.",
          drillQuestion: "Walk through the Checks-Effects-Interactions pattern and why it prevents reentrancy.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Assembly (Yul) & Gas Optimization",
          topics: [
            { id: "sol-a1", title: "Inline Assembly (Yul) & EVM Opcodes (sload, sstore)", detail: "Bypassing compiler overhead for micro-gas optimization." },
          ],
          project: "Automated DeFi Liquidity Pool with custom Yul assembly optimizations.",
          drillQuestion: "How do storage slot packings save gas when defining struct state variables?",
        },
      ],
    },
  },

  // 26. Assembly (x86_64 / ARM)
  {
    id: "assembly",
    name: "Assembly (x86_64 / ARM)",
    category: "systems",
    badge: "Hardware Level",
    version: "x86_64 NASM / ARM64",
    paradigm: "Low-level Machine Instructions, Register-based",
    difficulty: "Steep Learning Curve",
    compilerRuntime: "NASM, GAS (GNU Assembler), GCC",
    industryUse: "Reverse Engineering, Malware Analysis, Bootloaders, Cryptographic Kernels, Exploit Dev",
    topCompanies: ["NSA", "CrowdStrike", "Intel", "Apple Silicon", "FireEye"],
    officialDocs: "https://www.nasm.us/doc/",
    interactiveLearn: "https://github.com/0xZ0F/Z0F-Package",
    description: "Direct human-readable representation of CPU machine instructions. The ultimate tool for reverse engineering, exploit development, and hardware tuning.",
    keyEcosystem: ["NASM", "GDB", "Ghidra", "IDA Pro", "Objdump"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Registers, Memory & Basic Instructions",
          topics: [
            { id: "asm-b1", title: "x86_64 General Purpose Registers (RAX, RBX, RCX, RDX, RSI, RDI, RSP, RBP)", detail: "64-bit, 32-bit, 16-bit, 8-bit sub-registers." },
            { id: "asm-b2", title: "Data Movement & Arithmetic: mov, add, sub, mul, div", detail: "Immediate values, memory addressing modes `[rbp - 8]`." },
            { id: "asm-b3", title: "Jumps, Flags (EFLAGS) & Comparison: cmp, jmp, je, jne, jg", detail: "Zero flag, Carry flag, Sign flag." },
          ],
          project: "Bare-Metal 'Hello World' with direct Linux x86_64 syscalls (sys_write, sys_exit).",
          drillQuestion: "Explain the standard x86_64 System V AMD64 calling convention for passing function parameters.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: The Call Stack & Function Calling Conventions",
          topics: [
            { id: "asm-i1", title: "The Stack: push, pop, call, ret, Stack Frames", detail: "Stack alignment, buffer overflows, return address overwriting." },
          ],
          project: "Custom Fast String Matching Routine written in pure assembly and linked into a C program.",
          drillQuestion: "Trace exactly how the `call` and `ret` instructions modify the Instruction Pointer (RIP) and Stack Pointer (RSP).",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Reverse Engineering & SIMD Vectorization",
          topics: [
            { id: "asm-a1", title: "Disassembly Analysis with Ghidra & SIMD AVX-512 Instructions", detail: "Decompiling binaries, vector registers (YMM, ZMM)." },
          ],
          project: "Reverse engineering an unknown compiled binary to reconstruct its original C source code.",
          drillQuestion: "What is a Return-Oriented Programming (ROP) chain, and how do gadgets function in exploit development?",
        },
      ],
    },
  },

  // 27. MATLAB
  {
    id: "matlab",
    name: "MATLAB",
    category: "data-ai",
    badge: "Engineering Simulation",
    version: "R2024a",
    paradigm: "Matrix-based, Numerical, Array Programming",
    difficulty: "Beginner Friendly",
    compilerRuntime: "MathWorks MATLAB Engine, Simulink",
    industryUse: "Control Systems, Aerospace, Signal Processing, Automotive (Simulink), Biomedical",
    topCompanies: ["NASA", "Boeing", "Tesla", "Lockheed Martin", "MathWorks", "Bosch"],
    officialDocs: "https://www.mathworks.com/help/matlab/",
    interactiveLearn: "https://matlabacademy.mathworks.com/",
    description: "The premier computational platform for engineers. Specialized in matrix manipulation, digital signal processing, and Simulink physical modeling.",
    keyEcosystem: ["Simulink", "Signal Processing Toolbox", "Control System Toolbox"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Matrix Operations & Scripting",
          topics: [
            { id: "mat-b1", title: "Matrix Creation, Vectorization & Linear Algebra", detail: "Dot products, matrix inverses, eigenvalues." },
            { id: "mat-b2", title: "Plotting & 3D Surface Visualizations", detail: "plot, subplot, surf, meshgrid." },
          ],
          project: "Digital Filter Design analyzing audio signal frequencies using Fast Fourier Transform (FFT).",
          drillQuestion: "Explain the difference between `*` and `.*` in MATLAB matrix arithmetic.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Simulink Dynamic System Modeling",
          topics: [
            { id: "mat-i1", title: "Simulink Block Diagrams & PID Controller Tuning", detail: "Modeling feedback loops and step responses." },
          ],
          project: "Autonomous Cruise Control Vehicle Simulation with closed-loop PID control in Simulink.",
          drillQuestion: "How do you tune a PID controller in MATLAB to minimize overshoot while maintaining fast rise time?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Hardware-in-the-Loop & C Code Generation",
          topics: [
            { id: "mat-a1", title: "MATLAB Coder: Generating Production C/C++ Code from MATLAB", detail: "Deploying algorithms onto embedded microcontrollers." },
          ],
          project: "Embedded Kalman Filter generated directly into C code for drone flight stabilization.",
          drillQuestion: "What constraints must MATLAB code adhere to in order to successfully generate C code via MATLAB Coder?",
        },
      ],
    },
  },

  // 28. Perl
  {
    id: "perl",
    name: "Perl",
    category: "enterprise",
    badge: "Text Wrangling Legend",
    version: "Perl 5.38+",
    paradigm: "Multi-paradigm (Procedural, Functional, OOP), Dynamic",
    difficulty: "Moderate",
    compilerRuntime: "perl interpreter",
    industryUse: "System Administration, Bioinformatics, Legacy Financial Services, Text Extraction",
    topCompanies: ["Booking.com", "DuckDuckGo", "Craigslist", "Cisco", "Broadcom"],
    officialDocs: "https://perldoc.perl.org/",
    interactiveLearn: "https://exercism.org/tracks/perl5",
    description: "The duct-tape of the internet. Renowned for its world-standard Regular Expression engine and rapid text processing capabilities.",
    keyEcosystem: ["CPAN", "Regexp", "DBI", "Mojolicious"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Perl Syntax, Scalars, Arrays & Hashes",
          topics: [
            { id: "pl-b1", title: "Sigils: Scalars ($), Arrays (@), Hashes (%)", detail: "Context-sensitive evaluation (scalar vs list context)." },
            { id: "pl-b2", title: "World-Class Regular Expressions", detail: "m//, s///, tr///, backreferences, non-greedy matching." },
          ],
          project: "Automated Server Configuration Parser and Migrator using Perl regular expressions.",
          drillQuestion: "Explain the difference between scalar context and list context in Perl.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: CPAN Modules & Database Access (DBI)",
          topics: [
            { id: "pl-i1", title: "Database Connectivity with Perl DBI & Reference Syntax", detail: "References (\\), dereferencing, multi-dimensional data structures." },
          ],
          project: "High-Volume ETL Data Processing Pipeline with Perl and MySQL.",
          drillQuestion: "How do references work in Perl and why are they needed for nested data structures?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Modern Perl & Object-Oriented Moose",
          topics: [
            { id: "pl-a1", title: "Moose: Complete Object System for Perl 5", detail: "Attributes, roles, method modifiers, type constraints." },
          ],
          project: "Enterprise Network Topology Discovery Tool using modern Moose OOP.",
          drillQuestion: "What is Moose in Perl and how does it modernize object-oriented Perl programming?",
        },
      ],
    },
  },

  // 29. Erlang
  {
    id: "erlang",
    name: "Erlang",
    category: "functional",
    badge: "99.9999999% Reliability",
    version: "OTP 26+",
    paradigm: "Functional, Concurrent, Actor-based, Distributed",
    difficulty: "Challenging",
    compilerRuntime: "BEAM Virtual Machine",
    industryUse: "Telecommunications (Ericsson), Financial Exchanges, Real-time Messaging (WhatsApp)",
    topCompanies: ["Ericsson", "WhatsApp", "Cisco", "Bet365", "Klarna"],
    officialDocs: "https://www.erlang.org/docs",
    interactiveLearn: "https://exercism.org/tracks/erlang",
    description: "Engineered by Ericsson for telecom networks that never go down ('nine nines' availability). The foundation of the BEAM virtual machine.",
    keyEcosystem: ["OTP (Open Telecom Platform)", "Rebar3", "Mnesia (Distributed DB)"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Erlang Syntax & Pattern Matching",
          topics: [
            { id: "erl-b1", title: "Prolog-inspired Syntax: Atoms, Tuples, Lists & Pattern Matching", detail: "Variables capitalized, punctuation rules (period, semicolon, comma)." },
            { id: "erl-b2", title: "Recursion & Tail Call Optimization", detail: "No loops; loop via recursive function calls." },
          ],
          project: "Recursive Mathematical Engine and Tokenizer in pure Erlang.",
          drillQuestion: "Why does Erlang have no traditional `for` or `while` loops?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Concurrency & The Actor Model",
          topics: [
            { id: "erl-i1", title: "Processes: spawn, send (!), receive", detail: "Message mailboxes, process isolation, zero shared state." },
            { id: "erl-i2", title: "OTP GenServer & Supervisor Trees", detail: "Worker supervision, one_for_one and one_for_all strategies." },
          ],
          project: "Distributed Chat Room Engine supporting 10,000 concurrent user processes.",
          drillQuestion: "How do process mailboxes work in Erlang, and what happens if a message is never matched?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Distributed Erlang Clusters & Mnesia",
          topics: [
            { id: "erl-a1", title: "Multi-Node Distributed Clusters & Hot Code Swapping", detail: "Upgrading running code without dropping active connections." },
          ],
          project: "Zero-Downtime High-Availability Distributed In-Memory Cache with Hot Code Upgrades.",
          drillQuestion: "Explain how Erlang achieves hot code reloading without restarting the server.",
        },
      ],
    },
  },

  // 30. OCaml
  {
    id: "ocaml",
    name: "OCaml",
    category: "functional",
    badge: "Type Inference Powerhouse",
    version: "5.1+ (Multicore)",
    paradigm: "Functional, Imperative, Object-Oriented, Compiled",
    difficulty: "Challenging",
    compilerRuntime: "ocamlopt (native compiler), ocamlc",
    industryUse: "High-Frequency Trading (Jane Street), Formal Systems, Compilers (Rust compiler original prototype)",
    topCompanies: ["Jane Street", "Bloomberg", "Meta (Flow)", "Docker", "Tezos"],
    officialDocs: "https://ocaml.org/docs",
    interactiveLearn: "https://exercism.org/tracks/ocaml",
    description: "The choice of elite quantitative trading firms like Jane Street. Combines Hindley-Milner type inference, safety, and blazing fast native compilation.",
    keyEcosystem: ["Dune", "Opam", "Core (Jane Street standard library)", "Async"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Functional OCaml & Type Inference",
          topics: [
            { id: "ml-b1", title: "Hindley-Milner Type Inference: Zero Type Annotations Needed", detail: "let bindings, immutability by default." },
            { id: "ml-b2", title: "Algebraic Data Types & Pattern Matching", detail: "Variants, tuples, records, exhaustive compiler warnings." },
          ],
          project: "Arithmetic Calculator & Abstract Syntax Tree (AST) Evaluator in OCaml.",
          drillQuestion: "How does the Hindley-Milner type inference algorithm determine types without user annotations?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Modules, Functors & OCaml 5 Multicore",
          topics: [
            { id: "ml-i1", title: "Module System: Signatures, Structures & Functors (Parameterized Modules)", detail: "Code reuse at the module level." },
            { id: "ml-i2", title: "OCaml 5 Multicore & Effect Handlers", detail: "Parallel programming and algebraic effect systems." },
          ],
          project: "High-Speed In-Memory Limit Order Book for trading using Jane Street's Core library.",
          drillQuestion: "What is an OCaml Functor and how does it differ from a functor in C++ or Haskell?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Formal Verification & Compiler Construction",
          topics: [
            { id: "ml-a1", title: "Writing a Full Programming Language Compiler in OCaml", detail: "Lexer, parser, intermediate representation, bytecode generator." },
          ],
          project: "Mini C Compiler written in OCaml producing x86_64 assembly output.",
          drillQuestion: "Why is OCaml frequently chosen to build compilers for other programming languages?",
        },
      ],
    },
  },

  // 31. F#
  {
    id: "fsharp",
    name: "F#",
    category: "functional",
    badge: "Functional .NET",
    version: "F# 8.0+",
    paradigm: "Functional-first, Object-Oriented, Imperative, Compiled (CLR)",
    difficulty: "Moderate",
    compilerRuntime: "fsc, .NET CLR",
    industryUse: "Fintech, Quantitative Modeling, Complex Data Transformations, Enterprise .NET",
    topCompanies: ["Credit Suisse", "Microsoft", "BlackRock", "Aviva", "GE Healthcare"],
    officialDocs: "https://learn.microsoft.com/en-us/dotnet/fsharp/",
    interactiveLearn: "https://exercism.org/tracks/fsharp",
    description: "Functional-first programming language on the .NET runtime. Lets you solve complex data and financial problems with clean, concise, robust code.",
    keyEcosystem: [".NET SDK", "FSharp.Core", "Giraffe", "Farmer", "FsCheck"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Functional-first Syntax & Discriminated Unions",
          topics: [
            { id: "fs-b1", title: "Piping Operator (|>) & Type Inference", detail: "Currying, immutability, no null references." },
            { id: "fs-b2", title: "Discriminated Unions & Pattern Matching", detail: "Modeling business domains with zero illegal states." },
          ],
          project: "Domain-Driven E-Commerce Order Validation System in F#.",
          drillQuestion: "How do F# Discriminated Unions allow 'making illegal states unrepresentable'?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Type Providers & Web APIs with Giraffe",
          topics: [
            { id: "fs-i1", title: "F# Type Providers: SQL, JSON, CSV Schema Inference", detail: "Compile-time schema checking without code generation." },
            { id: "fs-i2", title: "High-Performance Functional Web APIs with Giraffe and ASP.NET Core", detail: "HttpHandler composition." },
          ],
          project: "Real-time Financial Portfolio Analyzer fetching data with F# Type Providers.",
          drillQuestion: "What is an F# Type Provider and how does it connect external schemas at compile time?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Property-Based Testing with FsCheck",
          topics: [
            { id: "fs-a1", title: "Property-Based Testing vs Example-Based Testing", detail: "Generating 10,000 random inputs to test mathematical invariants." },
          ],
          project: "Complete Financial Ledger System validated via FsCheck property tests.",
          drillQuestion: "How does property-based testing in FsCheck uncover edge-case bugs that unit tests miss?",
        },
      ],
    },
  },

  // 32. Groovy
  {
    id: "groovy",
    name: "Groovy",
    category: "enterprise",
    badge: "CI/CD & JVM Scripting",
    version: "Apache Groovy 4.0+",
    paradigm: "Multi-paradigm (OOP, Scripting, Dynamic & Static), JVM",
    difficulty: "Beginner Friendly",
    compilerRuntime: "groovyc, JVM",
    industryUse: "Jenkins CI/CD Pipelines, Gradle Build Automation, Enterprise JVM Testing (Spock)",
    topCompanies: ["Netflix", "Google", "Target", "IBM", "Mastercard"],
    officialDocs: "https://groovy-lang.org/documentation.html",
    interactiveLearn: "https://exercism.org/tracks/groovy",
    description: "Dynamic yet statically compilable language for the JVM. The standard scripting engine behind Jenkins CI/CD automation and Gradle build configurations.",
    keyEcosystem: ["Gradle", "Jenkins Pipeline", "Spock Framework", "Grails"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Groovy Syntax & JVM Interop",
          topics: [
            { id: "gv-b1", title: "Groovy Syntax Shortcuts: Optional Semicolons & Def Keyword", detail: "Dynamic typing, string interpolation (GStrings)." },
            { id: "gv-b2", title: "Closures & Collection Utilities", detail: "each, collect, find, spread-dot operator (*.)." },
          ],
          project: "Automated Build and Artifact Publisher Script using Groovy and Maven.",
          drillQuestion: "What is a GString in Groovy and how does it differ from a standard Java String?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Jenkins Declarative & Scripted Pipelines",
          topics: [
            { id: "gv-i1", title: "Jenkins Shared Libraries & Declarative Pipelines", detail: "Stages, steps, post actions, parallel stages, credential handling." },
            { id: "gv-i2", title: "BDD Testing with the Spock Framework", detail: "given-when-then syntax, data tables for parameterized testing." },
          ],
          project: "Enterprise Multi-Branch CI/CD Jenkins Shared Library in Groovy with automated testing.",
          drillQuestion: "Explain the difference between declarative and scripted Jenkins pipelines.",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: CompileStatic & Metaprogramming",
          topics: [
            { id: "gv-a1", title: "@CompileStatic & AST Transformations", detail: "Compile-time performance boost matching native Java speed." },
          ],
          project: "Custom Gradle Plugin automating container vulnerability scans during build.",
          drillQuestion: "How does the `@CompileStatic` annotation in Groovy eliminate dynamic method dispatch overhead?",
        },
      ],
    },
  },

  // 33. Fortran
  {
    id: "fortran",
    name: "Fortran",
    category: "enterprise",
    badge: "Supercomputing & Physics",
    version: "Fortran 2018 / 2023",
    paradigm: "Imperative, Array-oriented, Compiled",
    difficulty: "Moderate",
    compilerRuntime: "gfortran, Intel oneAPI Fortran Compiler (ifort)",
    industryUse: "Supercomputers, Weather Forecasting (NOAA), Computational Fluid Dynamics (CFD), Nuclear Physics",
    topCompanies: ["NASA", "US National Labs (Oak Ridge, Los Alamos)", "Met Office", "CERN"],
    officialDocs: "https://fortran-lang.org/learn/",
    interactiveLearn: "https://exercism.org/tracks/fortran",
    description: "Formula Translation: the world's first high-level language. Continues to power the world's fastest supercomputers and weather prediction simulations.",
    keyEcosystem: ["BLAS", "LAPACK", "gfortran", "OpenMP", "MPI"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Modern Fortran Syntax & Multidimensional Arrays",
          topics: [
            { id: "ft-b1", title: "Modern Free-Form Fortran Syntax & Implicit None", detail: "Enforcing strict variable declaration." },
            { id: "ft-b2", title: "Array Operations: Whole Array Math & Slicing", detail: "1-based indexing, column-major order." },
          ],
          project: "Numerical 2D Heat Dissipation Simulation with matrix array calculations.",
          drillQuestion: "Why is understanding Column-Major array layout critical for Fortran memory performance?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: High-Performance Parallelism (OpenMP & Coarrays)",
          topics: [
            { id: "ft-i1", title: "Parallel Processing with OpenMP Directives", detail: "!$omp parallel do, multi-core vectorization." },
            { id: "ft-i2", title: "Coarray Fortran (CAF) for Distributed Supercomputing", detail: "PGAS (Partitioned Global Address Space) model." },
          ],
          project: "Parallel Fluid Dynamics Simulation utilizing OpenMP multi-threading.",
          drillQuestion: "What is `implicit none` in Fortran and why is it mandatory in modern code?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: MPI Distributed Supercomputing Clusters",
          topics: [
            { id: "ft-a1", title: "MPI (Message Passing Interface) for Supercomputing Clusters", detail: "Scaling physics simulations across thousands of CPU nodes." },
          ],
          project: "Atmospheric Weather Forecasting Simulation scaled across a multi-node MPI cluster.",
          drillQuestion: "How does Fortran maintain an edge over C/C++ in numerical vectorization due to pointer aliasing guarantees?",
        },
      ],
    },
  },

  // 34. COBOL
  {
    id: "cobol",
    name: "COBOL",
    category: "enterprise",
    badge: "Global Banking Backbone",
    version: "COBOL 2014 / Enterprise COBOL",
    paradigm: "Procedural, Record-oriented, English-like",
    difficulty: "Moderate",
    compilerRuntime: "IBM Enterprise COBOL, GnuCOBOL",
    industryUse: "Mainframe Banking Systems, Credit Card Processing, ATM Networks, Social Security",
    topCompanies: ["IBM", "JPMorgan Chase", "Bank of America", "IRS", "Visa", "Citi"],
    officialDocs: "https://www.ibm.com/docs/en/cobol-zos",
    interactiveLearn: "https://exercism.org/tracks/cobol",
    description: "Powers 80% of global in-person financial transactions and $3 trillion in daily commerce. Unmatched precision in financial decimal arithmetic.",
    keyEcosystem: ["IBM z/OS Mainframe", "JCL (Job Control Language)", "CICS", "DB2"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: COBOL Structure: Divisions & Picture Clauses",
          topics: [
            { id: "cob-b1", title: "The 4 Core Divisions: Identification, Environment, Data, Procedure", detail: "Strict column layouts (Area A vs Area B)." },
            { id: "cob-b2", title: "Data Division & Picture (PIC) Clauses", detail: "PIC 9 (numeric), PIC X (alphanumeric), PIC 9(5)V99 (implied decimals)." },
            { id: "cob-b3", title: "Procedure Division Verbs: MOVE, ADD, PERFORM, COMPUTE", detail: "English-like operational syntax." },
          ],
          project: "Bank Account Ledger calculating compounding monthly interest with exact decimal precision.",
          drillQuestion: "Explain how `PIC 9(5)V99` represents numbers without floating-point rounding errors.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Mainframe File Processing & Tables",
          topics: [
            { id: "cob-i1", title: "Sequential File Processing: OPEN, READ, WRITE, CLOSE", detail: "Processing batch transactional customer records." },
            { id: "cob-i2", title: "COBOL Tables (Arrays): OCCURS & INDEXED BY", detail: "SEARCH, SEARCH ALL (binary search) verbs." },
          ],
          project: "Batch Payroll Processing Program processing 100,000 employee records with deduction checks.",
          drillQuestion: "What is the difference between `PERFORM ... UNTIL` and traditional while loops?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Mainframe CICS & DB2 Integration",
          topics: [
            { id: "cob-a1", title: "Embedded SQL in COBOL (EXEC SQL ... END-EXEC)", detail: "Interacting with enterprise DB2 databases." },
            { id: "cob-a2", title: "CICS Real-time Online Transaction Processing", detail: "Connecting ATM transactions to mainframe core banking." },
          ],
          project: "Simulated Real-time ATM Withdrawal Transaction System with CICS and DB2.",
          drillQuestion: "Why does the banking industry continue to rely on COBOL instead of rewriting systems in Java/Go?",
        },
      ],
    },
  },

  // 35. Nim
  {
    id: "nim",
    name: "Nim",
    category: "systems",
    badge: "Python Syntax, C Speed",
    version: "Nim 2.0+",
    paradigm: "Multi-paradigm (Imperative, Functional, OOP, Meta), Compiled to C/C++",
    difficulty: "Moderate",
    compilerRuntime: "nim compiler (transpiles to C, C++, or JavaScript)",
    industryUse: "Game Development, Systems Tools, Cybersecurity Tools, High-Performance Backends",
    topCompanies: ["Status.im", "Ethereum Foundation", "Nightowl"],
    officialDocs: "https://nim-lang.org/documentation.html",
    interactiveLearn: "https://exercism.org/tracks/nim",
    description: "Combines Python's clean indentation syntax with the raw execution speed and hardware efficiency of C. Powerful macro system with ARC/ORC memory management.",
    keyEcosystem: ["Nimble", "ARC/ORC Memory Management", "Chronos (Async)"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Nim Syntax, Types & ARC Memory",
          topics: [
            { id: "nim-b1", title: "Pythonic Syntax with Static Typing: let, var, const", detail: "Type inference, procs, indentation rules." },
            { id: "nim-b2", title: "ARC/ORC Automatic Memory Management", detail: "Deterministic reference counting with cycle collector, zero GC pauses." },
          ],
          project: "CLI System Resource Monitor written in Nim compiled to a tiny 150KB native binary.",
          drillQuestion: "How does Nim's ORC memory management eliminate garbage collection pauses?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Compile-Time Macros & C Interop",
          topics: [
            { id: "nim-i1", title: "Nim AST Macros: Unmatched Metaprogramming", detail: "Manipulating code at compile time, building DSLs." },
            { id: "nim-i2", title: "Zero-Cost C/C++ Interoperability", detail: "importc pragmas, wrapping C libraries without wrappers." },
          ],
          project: "High-Throughput Asynchronous Web Scraper using Chronos and native C sockets.",
          drillQuestion: "How does Nim compile to C before machine code, and what advantages does this provide?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Systems & Kernel Exploration in Nim",
          topics: [
            { id: "nim-a1", title: "Bare-Metal Programming without C Runtime in Nim", detail: "Operating system development with pure Nim." },
          ],
          project: "Custom Network Packet Sniffer in pure Nim directly accessing raw sockets.",
          drillQuestion: "Explain the difference between `let` and `const` in Nim.",
        },
      ],
    },
  },

  // 36. Objective-C
  {
    id: "objc",
    name: "Objective-C",
    category: "enterprise",
    badge: "Apple Foundation",
    version: "2.0",
    paradigm: "Object-Oriented, Dynamic Message Passing, C Superset",
    difficulty: "Moderate",
    compilerRuntime: "Clang (LLVM)",
    industryUse: "Legacy iOS/macOS Codebases, Apple Framework Internals, Cocoa/Cocoa Touch",
    topCompanies: ["Apple", "Uber", "Facebook/Meta", "Spotify", "Snap Inc."],
    officialDocs: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/",
    interactiveLearn: "https://exercism.org/tracks/objective-c",
    description: "The language that built the original iPhone and Mac OS X. Combines C with Smalltalk-style dynamic message passing `[object message]`.",
    keyEcosystem: ["Cocoa Touch", "Foundation", "UIKit", "Xcode"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Square Bracket Syntax & Message Passing",
          topics: [
            { id: "ob-b1", title: "Square Bracket Syntax: [receiver message:arg]", detail: "Dynamic dispatch via objc_msgSend." },
            { id: "ob-b2", title: "Header (.h) and Implementation (.m) Files", detail: "@interface, @implementation, @property." },
            { id: "ob-b3", title: "Automatic Reference Counting (ARC) in Objective-C", detail: "strong, weak, assign, copy attributes." },
          ],
          project: "Native macOS Desktop Calculator built using Objective-C and AppKit.",
          drillQuestion: "Explain what happens under the hood when `[object method]` is called in Objective-C.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Categories, Protocols & Swift Interoperability",
          topics: [
            { id: "ob-i1", title: "Categories & Protocols", detail: "Adding methods to existing classes without subclassing." },
            { id: "ob-i2", title: "Bridging Objective-C and Swift", detail: "Bridging headers, @objc annotations, mixed-language projects." },
          ],
          project: "Bridged iOS Library enabling modern Swift code to consume legacy Objective-C frameworks.",
          drillQuestion: "What is an Objective-C Category, and how does it compare to a Swift Extension?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Objective-C Runtime & Method Swizzling",
          topics: [
            { id: "ob-a1", title: "Method Swizzling via <objc/runtime.h>", detail: "Dynamically swapping method implementations at runtime for analytics and debugging." },
          ],
          project: "Automated User Analytics Tracking SDK using Objective-C Method Swizzling.",
          drillQuestion: "What is Method Swizzling, and why should it be used with extreme caution?",
        },
      ],
    },
  },

  // 37. V (Vlang)
  {
    id: "vlang",
    name: "V (Vlang)",
    category: "systems",
    badge: "Fast & Minimalist",
    version: "0.4+",
    paradigm: "Imperative, Systems, Statically Typed, Compiled",
    difficulty: "Beginner Friendly",
    compilerRuntime: "v compiler (direct machine code or C generation)",
    industryUse: "Fast Compilation CLI Tools, Game Engines, Systems Tools",
    topCompanies: ["Open Source Community", "High-Speed Tooling Startups"],
    officialDocs: "https://docs.vlang.io/",
    interactiveLearn: "https://vlang.io/",
    description: "Simple, fast, safe, and compiled language. Compiles in fractions of a second, produces tiny native executables, and boasts zero dependencies.",
    keyEcosystem: ["vpm", "vweb", "gg (Graphics Library)"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: V Syntax, Immutability & Safety",
          topics: [
            { id: "v-b1", title: "Immutable Variables by Default (mut keyword for mutable)", detail: "Clean Go-like syntax with zero nulls." },
            { id: "v-b2", title: "Option/Result Types & Error Handling", detail: "or blocks for error recovery." },
          ],
          project: "Fast CLI Markdown Generator in V compiling in under 200 milliseconds.",
          drillQuestion: "How does V achieve compile times of over 1 million lines of code per second?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: vweb & Graphical Applications",
          topics: [
            { id: "v-i1", title: "Building Web Apps with vweb", detail: "Built-in web server with route annotations." },
          ],
          project: "Lightweight High-Speed REST API built using the vweb framework.",
          drillQuestion: "How does memory management work in V without a garbage collector?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Cross-Compilation & C Interop",
          topics: [
            { id: "v-a1", title: "Zero-Dependency Cross-Compilation", detail: "Targeting Windows, Linux, and macOS without extra toolchains." },
          ],
          project: "Cross-Platform 2D Graphical Game using V's native graphics module.",
          drillQuestion: "How does V cross-compile to different OS architectures without complex toolchain setup?",
        },
      ],
    },
  },

  // 38. Crystal
  {
    id: "crystal",
    name: "Crystal",
    category: "web-mobile",
    badge: "Fast as C, Slick as Ruby",
    version: "1.11+",
    paradigm: "Object-Oriented, Compiled, Statically Typed, Type-Inferred",
    difficulty: "Moderate",
    compilerRuntime: "crystal compiler, LLVM backend",
    industryUse: "High-Performance Web APIs, CLI Tools, Microservices",
    topCompanies: ["Manas.Tech", "SaaS Startups", "High-Speed Microservices"],
    officialDocs: "https://crystal-lang.org/reference/",
    interactiveLearn: "https://exercism.org/tracks/crystal",
    description: "Syntax as slick and readable as Ruby, performance as blindingly fast as C. Statically type-checked via global type inference.",
    keyEcosystem: ["Shards", "Kemal (Web Framework)", "Lucky"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: Crystal Syntax & Global Type Inference",
          topics: [
            { id: "cr-b1", title: "Ruby-like Syntax with Compile-Time Static Typing", detail: "Zero type annotations required for most code." },
            { id: "cr-b2", title: "Classes, Structs, Methods & Blocks", detail: "Value types (struct) vs reference types (class)." },
          ],
          project: "Ultra-Fast CLI Text Transformer written with Crystal's Ruby-like syntax.",
          drillQuestion: "How does Crystal achieve C-like speed while looking almost identical to Ruby?",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: Kemal Framework & Fibers (Concurrency)",
          topics: [
            { id: "cr-i1", title: "Fibers & Channels: CSP Concurrency Model", detail: "Lightweight green threads and message passing." },
            { id: "cr-i2", title: "Building High-Throughput APIs with Kemal", detail: "Handling tens of thousands of requests per second." },
          ],
          project: "High-Performance Microservice benchmarked handling 50,000 req/sec with Kemal.",
          drillQuestion: "What is a Fiber in Crystal and how does it enable lightweight concurrency?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Crystal Macros & C Bindings",
          topics: [
            { id: "cr-a1", title: "Compile-time Macros with Crystal AST Access", detail: "Generating boilerplate-free JSON serializations." },
          ],
          project: "Automated C Library Wrapper utilizing Crystal's lib and macro system.",
          drillQuestion: "How do macros in Crystal run during compilation to inspect types and generate code?",
        },
      ],
    },
  },

  // 39. Common Lisp
  {
    id: "lisp",
    name: "Common Lisp",
    category: "functional",
    badge: "The Programmable Language",
    version: "ANSI Common Lisp",
    paradigm: "Multi-paradigm (Functional, Procedural, Dynamic Object-Oriented - CLOS)",
    difficulty: "Moderate",
    compilerRuntime: "SBCL (Steel Bank Common Lisp), CCL, CLISP",
    industryUse: "Symbolic AI, Quantum Computing (Rigetti), Space Missions (NASA JPL)",
    topCompanies: ["NASA", "Rigetti Computing", "Boeing", "Grammarly (early core)"],
    officialDocs: "https://common-lisp.net/documentation",
    interactiveLearn: "https://exercism.org/tracks/common-lisp",
    description: "The programmable programming language. Pioneer of REPL-driven development, image-based programming, and the Common Lisp Object System (CLOS).",
    keyEcosystem: ["Quicklisp", "SBCL", "SLIME / SLY (Emacs)", "CLOS"],
    phases: {
      Beginner: [
        {
          phase: "Phase 1: S-Expressions, Lists & Functions",
          topics: [
            { id: "lsp-b1", title: "S-Expressions: Prefix Syntax and Evaluation Rules", detail: "Atoms, lists, quote ('), defun, let." },
            { id: "lsp-b2", title: "List Operations: cons, car, cdr (first, rest)", detail: "Linked lists as the fundamental data structure." },
          ],
          project: "Symbolic Algebraic Simplifier evaluating polynomials in Common Lisp.",
          drillQuestion: "Explain the fundamental difference between `car`, `cdr`, and `cons`.",
        },
      ],
      Intermediate: [
        {
          phase: "Phase 1: CLOS (Common Lisp Object System) & The REPL",
          topics: [
            { id: "lsp-i1", title: "CLOS: defclass, defgeneric, defmethod", detail: "Multiple dispatch, method combinations (:before, :after, :around)." },
            { id: "lsp-i2", title: "The Condition System: Better than Exceptions", detail: "Restarts: handling errors interactively without unwinding the stack." },
          ],
          project: "Interactive Text Adventure Game Engine with dynamic CLOS method combinations.",
          drillQuestion: "How does the Common Lisp Condition System allow resuming execution without unwinding the call stack?",
        },
      ],
      Advanced: [
        {
          phase: "Phase 1: Defmacro: The Ultimate Metaprogramming",
          topics: [
            { id: "lsp-a1", title: "Writing Lisp Macros with Backquote (`) and Comma (,)", detail: "Creating custom syntax and control structures within the language." },
          ],
          project: "Custom Pattern Matching and Object-Query DSL implemented via Lisp Macros.",
          drillQuestion: "Why is Common Lisp often described as a 'programmable programming language'?",
        },
      ],
    },
  },

  // 40. Solidity / Web3 (Fallback / Extra)
  // Already included as 25!
];
