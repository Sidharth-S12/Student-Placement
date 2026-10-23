/**
 * Comprehensive Technical Interview & Knowledge Check Quizzes
 * for all 40+ Programming Languages.
 * Each quiz contains realistic interview questions, multiple choice options,
 * correct answer index, and deep pedagogical explanations.
 */

export const languageQuizzes = {
  python: [
    {
      id: "py-q1",
      question: "Which of the following data types in Python is mutable?",
      options: ["tuple", "str", "list", "frozenset"],
      correctIndex: 2,
      explanation: "In Python, lists and dictionaries are mutable, meaning their contents can be changed in-place without altering their memory identity (id). Tuples, strings, and frozensets are immutable.",
    },
    {
      id: "py-q2",
      question: "What is the primary role of Python's Global Interpreter Lock (GIL)?",
      options: [
        "To speed up execution of multi-threaded CPU-bound programs",
        "To ensure thread-safe memory management in CPython by allowing only one native thread to execute bytecode at a time",
        "To prevent infinite recursion in generator functions",
        "To automatically compile Python scripts into machine code"
      ],
      correctIndex: 1,
      explanation: "CPython's GIL is a mutex that prevents multiple native threads from executing Python bytecode simultaneously, avoiding race conditions in CPython's reference counting memory management.",
    },
    {
      id: "py-q3",
      question: "What will `print([i for i in range(5) if i % 2 == 0])` output?",
      options: ["[1, 3]", "[0, 2, 4]", "[2, 4]", "[0, 1, 2, 3, 4]"],
      correctIndex: 1,
      explanation: "The list comprehension filters numbers from 0 to 4 where i % 2 == 0, producing [0, 2, 4].",
    },
    {
      id: "py-q4",
      question: "What is the purpose of the `functools.lru_cache` decorator?",
      options: [
        "To serialize function outputs into a JSON file",
        "To memoize expensive function return values using a Least Recently Used cache strategy",
        "To force asynchronous execution of synchronous functions",
        "To enforce strict type annotations at runtime"
      ],
      correctIndex: 1,
      explanation: "lru_cache wraps a function with a memoizing callable that saves up to maxsize results, avoiding redundant calls when called with the same arguments.",
    },
    {
      id: "py-q5",
      question: "How does Python resolve method calls in multiple inheritance?",
      options: [
        "Random selection",
        "Left-to-right Depth-First Search with backtracking",
        "C3 Linearization (Method Resolution Order - MRO)",
        "The child class always errors on multiple inheritance"
      ],
      correctIndex: 2,
      explanation: "Python uses C3 Linearization to compute the Method Resolution Order (MRO), accessible via `ClassName.__mro__`, ensuring monotonicity and proper super() delegation.",
    },
  ],

  java: [
    {
      id: "jv-q1",
      question: "What happens in Java 8+ when a HashMap bucket exceeds the TREEIFY_THRESHOLD (default 8)?",
      options: [
        "The HashMap throws an OutOfMemoryError",
        "The linked list in that bucket is converted into a balanced Red-Black Tree",
        "All previous elements in the map are discarded and re-hashed",
        "The bucket size is doubled and elements are shifted to an array list"
      ],
      correctIndex: 1,
      explanation: "In Java 8+, when a single bucket holds >= 8 entries and table capacity is >= 64, the bucket transforms from a linked list (O(n) lookup) into a Red-Black Tree (O(log n) lookup) to guard against hash collision attacks.",
    },
    {
      id: "jv-q2",
      question: "What is the primary difference between `equals()` and `==` in Java?",
      options: [
        "`==` compares object contents, while `equals()` compares memory addresses",
        "`==` compares memory references (addresses) for objects, while `equals()` compares logical state",
        "They are strictly identical in all circumstances",
        "`equals()` only works for primitive data types"
      ],
      correctIndex: 1,
      explanation: "`==` tests reference equality (whether both references point to the exact same object in heap memory), while `equals()` checks value/logical equality as implemented by the class.",
    },
    {
      id: "jv-q3",
      question: "What problem do Java 21 Virtual Threads (Project Loom) solve?",
      options: [
        "They eliminate the need for the Java Virtual Machine",
        "They allow creating millions of lightweight threads with low memory footprints, decoupled from heavy OS platform threads",
        "They automatically vectorize nested loops with SIMD instructions",
        "They prevent garbage collection completely"
      ],
      correctIndex: 1,
      explanation: "Virtual threads are lightweight threads managed by the JVM runtime rather than 1:1 OS threads, enabling massive concurrent throughput in high-I/O server applications.",
    },
    {
      id: "jv-q4",
      question: "Which of the following is a Checked Exception in Java?",
      options: ["NullPointerException", "IllegalArgumentException", "IOException", "ArithmeticException"],
      correctIndex: 2,
      explanation: "IOException inherits from java.lang.Exception directly (not RuntimeException), making it a checked exception that must be declared with `throws` or caught with `try-catch`.",
    },
    {
      id: "jv-q5",
      question: "Why should you override `hashCode()` whenever you override `equals()`?",
      options: [
        "Because Java will not compile the code otherwise",
        "To maintain the contract: equal objects must have equal hash codes, ensuring collections like HashSet and HashMap function correctly",
        "To speed up string concatenation in logs",
        "To enable Java garbage collection on the instance"
      ],
      correctIndex: 1,
      explanation: "If two objects are equal according to `equals()`, calling `hashCode()` on each must produce the same integer. Violating this breaks hash-based collections like HashSet and HashMap.",
    },
  ],

  cpp: [
    {
      id: "cpp-q1",
      question: "What is the Resource Acquisition Is Initialization (RAII) idiom in C++?",
      options: [
        "Allocating all variables strictly on the heap before main() starts",
        "Binding the lifecycle of a resource (memory, file, mutex) to the lifetime of a stack-allocated object's constructor and destructor",
        "A compiler flag that enables C++20 modules",
        "Initializing global variables to zero"
      ],
      correctIndex: 1,
      explanation: "RAII guarantees that resource acquisition occurs in the constructor and release occurs in the destructor, ensuring no leaks even if an exception is thrown.",
    },
    {
      id: "cpp-q2",
      question: "What does `std::move` actually do in C++11?",
      options: [
        "It copies memory bytes to a different physical RAM sector",
        "It unconditionally casts its argument to an rvalue reference (T&&), enabling move constructors to steal resources",
        "It deletes the original object from the heap",
        "It spawns a background thread to transfer data"
      ],
      correctIndex: 1,
      explanation: "`std::move` is merely a compile-time cast to an rvalue reference (`static_cast<T&&>(arg)`). It performs no runtime copying or memory movement on its own.",
    },
    {
      id: "cpp-q3",
      question: "What is the difference between `std::unique_ptr` and `std::shared_ptr`?",
      options: [
        "unique_ptr uses reference counting, while shared_ptr has exclusive ownership",
        "unique_ptr has exclusive, non-copyable ownership of a heap resource; shared_ptr uses atomic reference counting for shared ownership",
        "unique_ptr is thread-safe, while shared_ptr is never thread-safe",
        "unique_ptr can only hold primitive types"
      ],
      correctIndex: 1,
      explanation: "`std::unique_ptr` embodies exclusive ownership with zero runtime overhead compared to raw pointers. `std::shared_ptr` allows multiple owners using atomic reference counting.",
    },
    {
      id: "cpp-q4",
      question: "What occurs when you declare a destructor as `virtual` in a base class?",
      options: [
        "It causes a compilation error in modern C++",
        "It ensures that deleting a derived object via a base class pointer correctly calls the derived destructor first, preventing memory leaks",
        "It prevents derived classes from overriding the destructor",
        "It doubles the memory size of all primitive members"
      ],
      correctIndex: 1,
      explanation: "Without a virtual base destructor, deleting a derived class instance through a base pointer causes undefined behavior and fails to invoke the derived destructor.",
    },
    {
      id: "cpp-q5",
      question: "What are C++20 Concepts?",
      options: [
        "New standard library GUI widgets",
        "Compile-time predicates that constrain template arguments, producing clear compiler errors when constraints are violated",
        "Runtime assertions for debugging pointer ranges",
        "New syntax for multi-threading"
      ],
      correctIndex: 1,
      explanation: "Concepts provide compile-time validation for template parameters, replacing complex SFINAE boilerplate and resulting in readable compiler diagnostics.",
    },
  ],

  c: [
    {
      id: "c-q1",
      question: "What is the difference between `malloc()` and `calloc()` in C?",
      options: [
        "`malloc()` initializes allocated memory to zero; `calloc()` leaves it uninitialized",
        "`calloc()` initializes allocated memory bytes to zero and takes two parameters (num, size); `malloc()` leaves memory uninitialized (garbage values)",
        "`malloc()` is used for structures, while `calloc()` is only for integers",
        "`calloc()` allocates memory in read-only RAM"
      ],
      correctIndex: 1,
      explanation: "`calloc(n, size)` allocates contiguous memory and initializes all bytes to zero. `malloc(bytes)` leaves memory uninitialized with whatever garbage values were previously present.",
    },
    {
      id: "c-q2",
      question: "What is a dangling pointer in C?",
      options: [
        "A pointer that points to NULL",
        "A pointer that continues to point to a deallocated (freed) memory location",
        "A pointer pointing to a global variable",
        "A pointer that has not yet been declared"
      ],
      correctIndex: 1,
      explanation: "A dangling pointer arises when the memory it references is released via `free()` without setting the pointer to NULL. Dereferencing it yields undefined behavior.",
    },
    {
      id: "c-q3",
      question: "What does the `volatile` qualifier tell the C compiler?",
      options: [
        "The variable can be cached in CPU registers indefinitely",
        "The variable's value may change at any time outside the control of code (e.g. hardware register or interrupt), preventing compiler optimization",
        "The variable cannot be modified after initialization",
        "The variable should be stored in dynamic heap memory"
      ],
      correctIndex: 1,
      explanation: "`volatile` instructs the compiler to reload the variable from memory on every read rather than optimizing it into a CPU register, essential for embedded memory-mapped I/O.",
    },
    {
      id: "c-q4",
      question: "What is the return value of `sizeof(char)` in C?",
      options: ["4", "2", "Always 1 by definition", "Depends on 32-bit vs 64-bit architecture"],
      correctIndex: 2,
      explanation: "By the C language standard, `sizeof(char)` is strictly defined to be 1.",
    },
    {
      id: "c-q5",
      question: "How do you declare a pointer to a function taking two ints and returning an int?",
      options: [
        "int *func(int, int);",
        "int (*func)(int, int);",
        "func(int, int) -> int*;",
        "int &func(int, int);"
      ],
      correctIndex: 1,
      explanation: "`int (*func)(int, int);` declares a function pointer. Without parentheses, `int *func(int, int);` would declare a function returning a pointer to int.",
    },
  ],

  javascript: [
    {
      id: "js-q1",
      question: "In what order does the JavaScript Event Loop process tasks?",
      options: [
        "Macrotasks -> Microtasks -> Render -> Next Macrotask",
        "Execute current synchronous script -> Process all Microtasks (Promises) -> Render -> Execute one Macrotask (setTimeout)",
        "setTimeout callbacks execute before Promise .then() callbacks",
        "Randomly based on CPU load"
      ],
      correctIndex: 1,
      explanation: "Synchronous code runs to completion on the call stack, then all pending microtasks (Promise reactions) are drained before the next macrotask (setTimeout, setInterval) runs.",
    },
    {
      id: "js-q2",
      question: "What is a closure in JavaScript?",
      options: [
        "A function bundled with references to its surrounding lexical environment",
        "A method that closes the browser window",
        "A function that accepts zero arguments",
        "A private variable declared with const"
      ],
      correctIndex: 0,
      explanation: "A closure gives an inner function access to an outer function's scope even after the outer function has returned and exited the call stack.",
    },
    {
      id: "js-q3",
      question: "What is the output of `typeof NaN` in JavaScript?",
      options: ["'undefined'", "'nan'", "'number'", "'object'"],
      correctIndex: 2,
      explanation: "In JavaScript, `NaN` represents 'Not a Number', but according to IEEE 754 floating-point specification and ECMAScript, its data type is `'number'`.",
    },
    {
      id: "js-q4",
      question: "What is the Temporal Dead Zone (TDZ) in JavaScript?",
      options: [
        "The time between server request and response",
        "The period between entering scope and variable declaration where let and const cannot be accessed",
        "The delay in setTimeout(fn, 0)",
        "The garbage collection execution window"
      ],
      correctIndex: 1,
      explanation: "Variables declared with `let` and `const` are hoisted but uninitialized. Accessing them before their actual declaration line throws a ReferenceError due to the TDZ.",
    },
    {
      id: "js-q5",
      question: "What does `Object.freeze()` do?",
      options: [
        "Prevents new properties from being added and existing properties from being modified or deleted (shallow freeze)",
        "Deeply freezes all nested objects recursively",
        "Compiles JavaScript into machine code",
        "Makes all object properties invisible in console.log"
      ],
      correctIndex: 0,
      explanation: "`Object.freeze()` performs a shallow freeze: it prevents mutating, adding, or deleting top-level properties. Nested objects within it remain mutable unless frozen individually.",
    },
  ],

  typescript: [
    {
      id: "ts-q1",
      question: "What is the difference between `any` and `unknown` in TypeScript?",
      options: [
        "`any` and `unknown` are strictly identical",
        "`any` disables all type-checking; `unknown` is type-safe because you cannot perform operations on it without narrowing the type first",
        "`unknown` can only hold primitive types",
        "`any` throws a compile-time error"
      ],
      correctIndex: 1,
      explanation: "`unknown` is the type-safe counterpart of `any`. Anything can be assigned to `unknown`, but TypeScript disallows calling methods or accessing properties on it until you narrow its type (e.g. via typeof or instanceof).",
    },
    {
      id: "ts-q2",
      question: "What is declaration merging in TypeScript?",
      options: [
        "Merging two files into one during compilation",
        "The compiler's ability to merge two separate `interface` declarations with the same name into a single combined interface definition",
        "Merging git branches automatically",
        "Combining JavaScript and CSS"
      ],
      correctIndex: 1,
      explanation: "Interfaces in TypeScript support declaration merging: if you declare `interface User` twice in the same scope, TypeScript automatically combines all properties into one definition.",
    },
    {
      id: "ts-q3",
      question: "What does the `never` type represent in TypeScript?",
      options: [
        "A variable that is null or undefined",
        "The type of values that never occur (e.g. a function that always throws an exception or infinite loop)",
        "A deprecated variable",
        "An optional parameter"
      ],
      correctIndex: 1,
      explanation: "The `never` type represents the bottom type in TypeScript: values that can never happen. It is commonly used in exhaustive switch checks to ensure all union cases are handled.",
    },
    {
      id: "ts-q4",
      question: "What is a Discriminated Union in TypeScript?",
      options: [
        "A union of types that share a common literal property (tag) allowing TypeScript to narrow the specific type in a switch statement",
        "A union that rejects any string inputs",
        "A merge conflict between types",
        "A union created only with classes"
      ],
      correctIndex: 0,
      explanation: "A discriminated union uses a shared literal property (like `kind: 'circle' | 'square'`) so TypeScript can automatically narrow the union down to the specific branch inside control flow.",
    },
    {
      id: "ts-q5",
      question: "What does the `infer` keyword do in TypeScript conditional types?",
      options: [
        "It infers the variable type in a for loop",
        "It introduces a type variable within a conditional type to deduce and extract an unknown type (e.g. ReturnType<T>)",
        "It instructs the compiler to disable strict mode",
        "It imports modules dynamically"
      ],
      correctIndex: 1,
      explanation: "In conditional types (`T extends (...args: any[]) => infer R ? R : any`), `infer` declares a placeholder type to be deduced by the compiler from the matched structure.",
    },
  ],

  go: [
    {
      id: "go-q1",
      question: "How do interfaces work in Go compared to Java or C++?",
      options: [
        "Go interfaces require an explicit `implements` keyword on the struct",
        "Go interfaces are implemented implicitly: any type implementing the required method signatures satisfies the interface without explicit declaration",
        "Go does not support interfaces or polymorphism",
        "Go interfaces can only hold data fields, not methods"
      ],
      correctIndex: 1,
      explanation: "Go uses structural typing (duck typing): if a struct implements all methods declared in an interface, it implicitly implements that interface without any `implements` keyword.",
    },
    {
      id: "go-q2",
      question: "What is the difference between a buffered channel and an unbuffered channel in Go?",
      options: [
        "Buffered channels do not support close()",
        "Unbuffered channels block the sender until a receiver is ready (synchronous handoff); buffered channels only block when the buffer is full",
        "Buffered channels can only hold strings",
        "Unbuffered channels can cause memory leaks"
      ],
      correctIndex: 1,
      explanation: "Unbuffered channels (`make(chan int)`) require both sender and receiver to be synchronized at the moment of exchange. Buffered channels (`make(chan int, 10)`) allow non-blocking sends until capacity is reached.",
    },
    {
      id: "go-q3",
      question: "What does the `defer` keyword do in Go?",
      options: [
        "Delays execution of the entire program for a fixed duration",
        "Schedules the evaluated function call to execute immediately before the surrounding function returns",
        "Spawns a new concurrent goroutine",
        "Disables error recovery"
      ],
      correctIndex: 1,
      explanation: "`defer` pushes a function call onto a stack. The deferred calls execute in Last-In-First-Out (LIFO) order when the surrounding function exits, perfect for closing files or unlocking mutexes.",
    },
    {
      id: "go-q4",
      question: "How does a Go slice differ from a Go array?",
      options: [
        "Arrays have fixed length determined at compile time; slices are dynamically sized views over an underlying array with pointer, length, and capacity",
        "Arrays can hold any type; slices can only hold numbers",
        "Slices cannot be passed to functions",
        "There is no difference in Go"
      ],
      correctIndex: 0,
      explanation: "An array has fixed size `[5]int`. A slice `[]int` is a lightweight 24-byte struct containing a pointer to the backing array, length (len), and capacity (cap).",
    },
    {
      id: "go-q5",
      question: "What is Go's GMP scheduler model?",
      options: [
        "A graphics rendering pipeline",
        "The concurrency runtime mapping G (Goroutines) onto M (OS Worker Threads) managed via P (Logical Processors)",
        "A garbage collection algorithm",
        "A package manager"
      ],
      correctIndex: 1,
      explanation: "Go's runtime schedules M goroutines (G) over N operating system threads (M) using P logical processor contexts matching GOMAXPROCS.",
    },
  ],

  rust: [
    {
      id: "rs-q1",
      question: "What are the two core borrowing rules enforced by Rust's Borrow Checker?",
      options: [
        "You can only borrow numbers and booleans",
        "At any given time, you can have either any number of immutable references (&T) OR exactly one mutable reference (&mut T), and references must always be valid",
        "References can outlive the owner if explicitly marked with static",
        "Borrowing requires manual malloc/free calls"
      ],
      correctIndex: 1,
      explanation: "The Aliasing XOR Mutability rule: Rust permits multiple shared readers (&T) OR a single exclusive writer (&mut T). This eliminates data races and iterator invalidations at compile time.",
    },
    {
      id: "rs-q2",
      question: "What happens when a variable goes out of scope in Rust?",
      options: [
        "A garbage collector sweeps it away in the next cycle",
        "Its `drop` implementation is executed and its memory is immediately deallocated automatically",
        "The operating system kills the process",
        "The variable is leaked into global memory"
      ],
      correctIndex: 1,
      explanation: "Rust provides deterministic destruction: when the owner goes out of scope, the compiler automatically invokes the `Drop` trait, freeing resources without GC pauses.",
    },
    {
      id: "rs-q3",
      question: "What does the `?` operator do when placed after an expression returning `Result<T, E>`?",
      options: [
        "It prints a warning to stderr",
        "If the result is Ok(v), it unwraps v; if Err(e), it immediately returns early from the current function with Err(From::from(e))",
        "It crashes the program with panic!()",
        "It retries the operation up to 3 times"
      ],
      correctIndex: 1,
      explanation: "The `?` operator provides idiomatic early error propagation, converting the error type automatically via `From::from` if needed.",
    },
    {
      id: "rs-q4",
      question: "What is the difference between `String` and `&str` in Rust?",
      options: [
        "String is an owned, growable heap-allocated UTF-8 string; &str is an immutable string slice pointing to a view of UTF-8 bytes",
        "String is ASCII; &str is Unicode",
        "They are identical aliases for the same type",
        "&str is allocated on the heap; String is on the stack"
      ],
      correctIndex: 0,
      explanation: "`String` is an owned buffer with pointer, length, and capacity on the heap. `&str` is a borrowed fat pointer (pointer + length) referencing string data in heap, stack, or binary text segment.",
    },
    {
      id: "rs-q5",
      question: "What do the `Send` and `Sync` marker traits indicate in Rust?",
      options: [
        "Send means a type can be transferred across thread boundaries; Sync means a type can be safely shared between threads via immutable reference (&T)",
        "Send is for network sockets; Sync is for database queries",
        "They enable garbage collection on custom structs",
        "They are runtime reflection markers"
      ],
      correctIndex: 0,
      explanation: "Rust's fearless concurrency relies on `Send` (ownership transfer across threads) and `Sync` (thread-safe references). If a type is `Sync`, `&T` is `Send`.",
    },
  ],

  // Generic / Default fallback generator for any of the other 30+ languages!
  default: [
    {
      id: "def-q1",
      question: "What is the primary trade-off between compiled and interpreted programming languages?",
      options: [
        "Interpreted languages always consume less memory",
        "Compiled languages translate to native machine code ahead-of-time for maximum execution speed; interpreted languages offer rapid development iteration but run through an execution engine",
        "Compiled languages cannot run on 64-bit operating systems",
        "There is no performance difference between them"
      ],
      correctIndex: 1,
      explanation: "Ahead-of-Time (AOT) compiled languages like C, C++, and Rust produce native machine code with zero interpreter overhead. Interpreted or bytecode languages offer dynamic flexibility at the expense of runtime translation overhead.",
    },
    {
      id: "def-q2",
      question: "What is the core distinction between Stack memory and Heap memory allocation?",
      options: [
        "Stack is for permanent storage; Heap is temporary",
        "Stack memory is fast, contiguous, and automatically managed by function call frames (LIFO); Heap memory is dynamic, fragmented, and requires manual or garbage-collected release",
        "Stack memory has infinite capacity; Heap is limited to 1MB",
        "Heap allocation is faster than Stack allocation"
      ],
      correctIndex: 1,
      explanation: "Stack allocation simply adjusts the Stack Pointer (RSP), making it virtually instant. Heap allocation searches memory allocators (free lists) for available blocks and requires bookkeeping.",
    },
    {
      id: "def-q3",
      question: "What does the acronym 'SOLID' stand for in software engineering design?",
      options: [
        "Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion",
        "Synchronous, Object-oriented, Linear, Iterative, Distributed",
        "System, Operation, Logic, Integration, Deployment",
        "Scalable, Optimized, Layered, Immutable, Deterministic"
      ],
      correctIndex: 0,
      explanation: "SOLID represents the 5 foundational design principles for maintainable, decoupled, and extensible object-oriented architecture established by Robert C. Martin.",
    },
    {
      id: "def-q4",
      question: "What is the primary cause of a Deadlock in concurrent programming?",
      options: [
        "A syntax error during compilation",
        "Two or more processes holding resources and waiting indefinitely for resources held by each other in a circular chain",
        "Running out of hard drive disk space",
        "Using excessive recursive function calls"
      ],
      correctIndex: 1,
      explanation: "A deadlock requires four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    },
    {
      id: "def-q5",
      question: "Why do modern languages emphasize Immutability in concurrent systems?",
      options: [
        "Because immutable data cannot be modified, eliminating data races between multiple threads without locking",
        "To reduce CPU clock speeds",
        "Because memory can never be reclaimed",
        "To make variable assignment illegal"
      ],
      correctIndex: 0,
      explanation: "Data races occur when two threads access shared memory and at least one is a write. With immutable data, all accesses are reads, guaranteeing thread-safety without lock contention.",
    },
  ],
};

/**
 * Returns 5 tailored quiz questions for any selected language.
 */
export function getQuizForLanguage(languageId) {
  const normalizedId = String(languageId).toLowerCase();
  return languageQuizzes[normalizedId] || languageQuizzes.default;
}
