export const topics = [
  {
    id: "arrays",
    title: "Arrays",
    number: "01",
    description:
      "Build intuition for traversals, two pointers, sliding windows, and prefix sums.",
    status: "Start here",
    lessons: [
      {
        id: "find-max-length",
        title: "525. Contiguous Array",
        difficulty: "Medium",
        status: "available",
        description:
          "Find the longest contiguous subarray with equal numbers of 0s and 1s using prefix sums and a hashmap.",
        path: "/arrays/525-contiguous-array",
        leetcodeUrl:
          "https://leetcode.com/problems/contiguous-array/description/",
      },
      {
        id: "subarray-sum",
        title: "560. Subarray Sum Equals K",
        difficulty: "Medium",
        status: "available",
        description:
          "Use prefix-sum frequencies to count subarrays with a target sum.",
        leetcodeUrl:
          "https://leetcode.com/problems/subarray-sum-equals-k/description/",
      },
      {
        id: "insert-interval",
        title: "57. Insert Interval",
        difficulty: "Medium",
        status: "available",
        description:
          "Insert a new interval into a sorted list, merging overlapping intervals while preserving order.",
        leetcodeUrl: "https://leetcode.com/problems/insert-interval/",
      },
      {
        id: "non-overlapping-intervals",
        title: "435. Non-overlapping Intervals",
        difficulty: "Medium",
        status: "available",
        description:
          "Use a greedy strategy: sort by end time, keep compatible intervals, and count removals.",
        leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/",
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    number: "02",
    description:
      "Explore character counts, windows, matching, and string transformations.",
    status: "Coming next",
    lessons: [
      {
        id: "capitalize-title",
        title: "2129. Capitalize the Title",
        difficulty: "Easy",
        status: "available",
        description:
          "Use two pointers to lowercase each word, then capitalize its first character only when the word has more than two characters.",
        leetcodeUrl: "https://leetcode.com/problems/capitalize-the-title/",
      },

      {
        id: "valid-palindrome",
        title: "125. Valid Palindrome",
        difficulty: "Easy",
        status: "available",
        description:
          "Filter out punctuation, normalize letters to lowercase, and compare characters using two pointers.",
        leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
      },
      {
        id: "reverse-words",
        title: "151. Reverse Words in a String",
        difficulty: "Medium",
        status: "available",
        description:
          "Skip extra spaces, extract each word with two indices, and insert words at the front of the result.",
        leetcodeUrl: "https://leetcode.com/problems/reverse-words-in-a-string/",
      },
      {
        id: "string-compression",
        title: "443. String Compression",
        difficulty: "Medium",
        status: "available",
        description:
          "Count consecutive character groups and write their compressed representation in place.",
        leetcodeUrl: "https://leetcode.com/problems/string-compression/",
      },
      {
        id: "reverse-only-letters",
        title: "917. Reverse Only Letters",
        difficulty: "Easy",
        status: "available",
        description:
          "Reverse letters with two pointers while keeping punctuation in its original position.",
        leetcodeUrl: "https://leetcode.com/problems/reverse-only-letters/",
      },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    number: "03",
    description:
      "Understand hash maps, sets, frequency counting, and lookup trade-offs.",
    status: "Coming next",
    lessons: [
      {
        id: "top-k-frequent",
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        status: "planned",
        description: "Count occurrences and find the most frequent values.",
      },
      {
        id: "contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "Easy",
        status: "planned",
        description:
          "Use a set to detect whether a value appears more than once.",
      },
    ],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    number: "04",
    description:
      "Visualize pointers, node links, reversals, and fast/slow pointers.",
    status: "Coming next",
    lessons: [
      {
        id: "reverse-list",
        title: "Reverse a Linked List",
        difficulty: "Easy",
        status: "planned",
        description: "Watch each pointer change direction, one node at a time.",
      },
      {
        id: "cycle-list",
        title: "Linked List Cycle",
        difficulty: "Easy",
        status: "planned",
        description: "See how slow and fast pointers reveal a cycle.",
      },
    ],
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    number: "05",
    description:
      "Step through LIFO, FIFO, monotonic stacks, and queue patterns.",
    status: "Coming next",
    lessons: [
      {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        status: "planned",
        description: "Track opening and closing brackets using a stack.",
      },
      {
        id: "daily-temperatures",
        title: "Daily Temperatures",
        difficulty: "Medium",
        status: "planned",
        description: "Use a monotonic stack to find the next warmer day.",
      },
    ],
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    number: "06",
    description:
      "Walk through traversal, recursion, BFS, DFS, and graph search.",
    status: "Coming next",
    lessons: [
      {
        id: "tree-level-order",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        status: "planned",
        description: "Use a queue to explore a tree level by level.",
      },
      {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        status: "planned",
        description: "Explore connected cells using BFS or DFS.",
      },
    ],
  },
];
