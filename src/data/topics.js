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
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "Easy",
        status: "planned",
        description:
          "Compare character frequencies to see whether two strings contain the same letters.",
      },
      {
        id: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        status: "planned",
        description:
          "Track a moving window while keeping every character unique.",
      },
      {
        id: "palindrome",
        title: "Valid Palindrome",
        difficulty: "Easy",
        status: "planned",
        description: "Use two pointers to compare characters from both ends.",
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
