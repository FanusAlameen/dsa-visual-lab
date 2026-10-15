import { useMemo, useState } from "react";
import "./StringProblems.css";

const PROBLEMS = {
  "valid-palindrome": {
    title: "125. Valid Palindrome",
    url: "https://leetcode.com/problems/valid-palindrome/",
    defaultInput: "A man, a plan, a canal: Panama",
    inputLabel: "Input string",
    complexity: {
      time: "O(n)",
      space: "O(n)",
      explanation:
        "Filtering builds a cleaned character list and string, then the two pointers scan at most half the cleaned string.",
    },
    code: [
      "class Solution:",
      "    def isPalindrome(self, s: str) -> bool:",
      "        sb = []",
      '        temp = ""',
      "        for char in s:",
      "            if char.isalnum():",
      "                sb.append(char.lower())",
      '        temp = "".join(sb)',
      "        left, right = 0, len(temp) - 1",
      "        while left <= right:",
      "            if temp[left] != temp[right]:",
      "                return False",
      "            left += 1",
      "            right -= 1",
      "        return True",
    ],
  },
  "reverse-words": {
    title: "151. Reverse Words in a String",
    url: "https://leetcode.com/problems/reverse-words-in-a-string/",
    defaultInput: "  the sky is blue  ",
    inputLabel: "Input string",
    complexity: {
      time: "O(n²) worst case",
      space: "O(n)",
      explanation:
        "Scanning and slicing are linear overall, but inserting each word at index 0 can shift existing elements repeatedly.",
    },
    code: [
      "class Solution:",
      "    def reverseWords(self, s: str) -> str:",
      "        result = []",
      "        n = len(s)",
      "        i = 0",
      "        while i < n:",
      "            while i < n and s[i] == ' ':",
      "                i += 1",
      "            if i >= n:",
      "                break",
      "            j = i + 1",
      "            while j < n and s[j] != ' ':",
      "                j += 1",
      "            sub = s[i:j]",
      "            if len(result) == 0:",
      "                result.append(sub)",
      "            else:",
      "                result.insert(0, sub)",
      "            i = j + 1",
      "        return ' '.join(result)",
    ],
  },
  "string-compression": {
    title: "443. String Compression",
    url: "https://leetcode.com/problems/string-compression/",
    defaultInput: "a a a b b c".replaceAll(" ", ""),
    inputLabel: "Characters (enter a string)",
    complexity: {
      time: "O(n)",
      space: "O(1) auxiliary",
      explanation:
        "Each character is read and each compressed character is written at most a constant number of times. The input list is modified in place.",
    },
    code: [
      "class Solution:",
      "    def compress(self, chars: list[str]) -> int:",
      "        count = 0",
      "        index = 0",
      "        n = len(chars)",
      "        for i in range(n):",
      "            count += 1",
      "            if i + 1 == n or chars[i] != chars[i + 1]:",
      "                chars[index] = chars[i]",
      "                index += 1",
      "                if count > 1:",
      "                    for ch in str(count):",
      "                        chars[index] = ch",
      "                        index += 1",
      "                count = 0",
      "        return index",
    ],
  },
  "capitalize-title": {
    title: "2129. Capitalize the Title",
    url: "https://leetcode.com/problems/capitalize-the-title/",
    defaultInput: "capiTalIze tHe titLe",
    inputLabel: "Input title",
    complexity: {
      time: "O(n)",
      space: "O(n)",
      explanation:
        "The algorithm processes each character once and builds a new output string. The output requires linear space.",
    },
    code: [
      "class Solution:",
      "    def capitalizeTitle(self, title: str) -> str:",
      "        title = list(title)",
      "        length = len(title)",
      "",
      "        i = 0",
      "        while (i < length):",
      "            first_index = i",
      "            while (i < length and title[i] != ' '):",
      "                title[i] = title[i].lower()",
      "                i += 1",
      "            if (i - first_index > 2):",
      "                title[first_index] = title[first_index].upper()",
      "            i += 1",
      "",
      '        return "".join(title)',
    ],
  },
  "reverse-only-letters": {
    title: "917. Reverse Only Letters",
    url: "https://leetcode.com/problems/reverse-only-letters/",
    defaultInput: "a-bC-dEf-ghIj",
    inputLabel: "Input string",
    complexity: {
      time: "O(n)",
      space: "O(n)",
      explanation:
        "The pointers move inward across the string once. Converting the string to a list requires linear extra space.",
    },
    code: [
      "class Solution:",
      "    def reverseOnlyLetters(self, s: str) -> str:",
      "        n = len(s)",
      "        left, right = 0, n - 1",
      "        s = list(s)",
      "        while left <= right:",
      "            if s[left].isalpha():",
      "                if s[right].isalpha():",
      "                    s[left], s[right] = s[right], s[left]",
      "                    left += 1",
      "                    right -= 1",
      "                else:",
      "                    right -= 1",
      "            else:",
      "                left += 1",
      "        return ''.join(s)",
    ],
  },
};

const isLetterOrNumber = (char) => /[\p{L}\p{N}]/u.test(char);
const isLetter = (char) => /\p{L}/u.test(char);

function makeTrace(problemId, input) {
  const steps = [];
  const add = (step) => steps.push(step);

  if (problemId === "valid-palindrome") {
    const chars = [...input];
    const filtered = [];
    add({
      title: "Start: prepare an empty list",
      explanation:
        "The first loop visits every character. Only letters and digits are kept, and they are converted to lowercase.",
      calculation: "sb = []",
      line: 3,
      chars,
      active: [],
      variables: "sb = []",
    });

    chars.forEach((char, i) => {
      const keep = isLetterOrNumber(char);
      if (keep) filtered.push(char.toLowerCase());
      add({
        title: `Filter character ${i}: ${JSON.stringify(char)}`,
        explanation: keep
          ? `${JSON.stringify(char)} is a letter or digit, so append its lowercase form ${JSON.stringify(char.toLowerCase())} to sb.`
          : `${JSON.stringify(char)} is punctuation or whitespace, so char.isalnum() is false and nothing is appended.`,
        calculation: keep
          ? `sb.append(${JSON.stringify(char.toLowerCase())})`
          : `${JSON.stringify(char)}.isalnum() → False`,
        line: keep ? 7 : 6,
        chars,
        active: [i],
        variables: `sb = [${filtered.map((c) => JSON.stringify(c)).join(", ")}]`,
        filtered: [...filtered],
      });
    });

    const temp = filtered.join("");
    add({
      title: "Join the filtered characters",
      explanation:
        "join combines the list into one clean string. This is the string the two pointers will compare.",
      calculation: `temp = "${temp}"`,
      line: 8,
      chars,
      active: [],
      variables: `temp = "${temp}"`,
      filtered: [...filtered],
      temp,
    });

    let left = 0;
    let right = temp.length - 1;
    while (left <= right) {
      const match = temp[left] === temp[right];
      add({
        title: `Compare temp[${left}] and temp[${right}]`,
        explanation: match
          ? `Both characters are "${temp[left]}". The pair matches, so move left one step right and right one step left.`
          : `The characters "${temp[left]}" and "${temp[right]}" differ. The function immediately returns False.`,
        calculation: `"${temp[left]}" ${match ? "==" : "!="} "${temp[right]}"`,
        line: match ? 13 : 12,
        chars,
        active: [],
        filtered: [...filtered],
        temp,
        left,
        right,
        variables: `left = ${left}, right = ${right}`,
        mismatch: !match,
      });
      if (!match) {
        add({
          title: "Return False",
          explanation:
            "A single mismatched pair proves the string is not a palindrome. There is no need to check the remaining pairs.",
          calculation: "return False",
          line: 12,
          chars,
          active: [],
          filtered: [...filtered],
          temp,
          left,
          right,
          final: "False",
        });
        return steps;
      }
      left += 1;
      right -= 1;
    }
    add({
      title: "All pairs matched — return True",
      explanation:
        "The pointers met or crossed without finding a mismatch. The cleaned string is a palindrome.",
      calculation: `left = ${left}, right = ${right}; left > right`,
      line: 15,
      chars,
      active: [],
      filtered: [...filtered],
      temp,
      left,
      right,
      variables: "Every compared pair matched",
      final: "True",
    });
  }

  if (problemId === "reverse-words") {
    const result = [];
    const n = input.length;
    let i = 0;
    add({
      title: "Initialize the scan",
      explanation:
        "i scans from left to right. result stores complete words in reverse order.",
      calculation: `n = ${n}, i = 0, result = []`,
      line: 3,
      chars: [...input],
      active: [],
      variables: "i = 0 · result = []",
      result: [...result],
    });

    while (i < n) {
      while (i < n && input[i] === " ") {
        add({
          title: `Skip leading/repeated space at index ${i}`,
          explanation:
            "The inner loop skips spaces. No empty word is added to result.",
          calculation: `s[${i}] == " " → i = ${i} + 1 = ${i + 1}`,
          line: 8,
          chars: [...input],
          active: [i],
          variables: `i = ${i}`,
          result: [...result],
        });
        i++;
      }
      if (i >= n) {
        add({
          title: "Reached the end while skipping spaces",
          explanation:
            "There are no more words to process, so break exits the outer loop.",
          calculation: `i = ${i} >= n = ${n}`,
          line: 10,
          chars: [...input],
          active: [],
          variables: `i = ${i}, n = ${n}`,
          result: [...result],
        });
        break;
      }

      const start = i;
      let j = i + 1;
      add({
        title: `Start a word at index ${start}`,
        explanation:
          "j begins just after i and scans until it reaches a space or the end of the string.",
        calculation: `j = i + 1 = ${j}`,
        line: 11,
        chars: [...input],
        active: [start],
        variables: `i = ${i}, j = ${j}`,
        result: [...result],
      });

      while (j < n && input[j] !== " ") {
        add({
          title: `Extend the word: s[${j}] = "${input[j]}"`,
          explanation:
            "This is not a space, so j advances. The current word runs from i up to, but not including, j.",
          calculation: `s[${j}] != " " → j = ${j} + 1 = ${j + 1}`,
          line: 13,
          chars: [...input],
          active: Array.from({ length: j - start + 1 }, (_, k) => start + k),
          variables: `i = ${i}, j = ${j}`,
          result: [...result],
        });
        j++;
      }

      const word = input.slice(i, j);
      add({
        title: `Extract "${word}"`,
        explanation:
          "Python slices s[i:j] from i through j - 1. The character at j is not included.",
        calculation: `sub = s[${i}:${j}] = "${word}"`,
        line: 14,
        chars: [...input],
        active: Array.from({ length: j - start }, (_, k) => start + k),
        variables: `i = ${i}, j = ${j}, sub = "${word}"`,
        result: [...result],
      });

      if (result.length === 0) {
        result.push(word);
        add({
          title: "Add the first word",
          explanation:
            "The result is empty, so append puts the first extracted word into the list.",
          calculation: `result.append("${word}")`,
          line: 16,
          chars: [...input],
          active: [],
          variables: `result = [${result.map((x) => `"${x}"`).join(", ")}]`,
          result: [...result],
        });
      } else {
        result.unshift(word);
        add({
          title: "Insert the word at the front",
          explanation:
            "insert(0, sub) puts this word before the words already collected. That is how the order gets reversed.",
          calculation: `result.insert(0, "${word}")`,
          line: 18,
          chars: [...input],
          active: [],
          variables: `result = [${result.map((x) => `"${x}"`).join(", ")}]`,
          result: [...result],
        });
      }
      i = j + 1;
      add({
        title: "Move i past the word separator",
        explanation:
          "j points at the space after this word, or at the end. Setting i = j + 1 moves to the next word; any repeated spaces are skipped by the next inner loop.",
        calculation: `i = j + 1 = ${j} + 1 = ${i}`,
        line: 19,
        chars: [...input],
        active: [],
        variables: `i = ${i}`,
        result: [...result],
      });
    }

    add({
      title: "Join words with one space",
      explanation:
        "Joining the result list removes extra spaces and places exactly one space between the reversed words.",
      calculation: `return "${result.join(" ")}"`,
      line: 20,
      chars: [...input],
      active: [],
      variables: `result = [${result.map((x) => `"${x}"`).join(", ")}]`,
      result: [...result],
      final: result.join(" "),
    });
  }

  if (problemId === "string-compression") {
    const chars = [...input];
    const n = chars.length;
    let count = 0;
    let index = 0;

    add({
      title: "Initialize the write position",
      explanation:
        "i reads each original character group. index marks where the next compressed character should be written. count tracks the current group size.",
      calculation: `count = 0, index = 0, n = ${n}`,
      line: 3,
      chars: [...chars],
      active: [],
      variables: "count = 0 · index = 0",
    });

    for (let i = 0; i < n; i++) {
      count++;
      add({
        title: `Read chars[${i}] = "${chars[i]}"`,
        explanation: `Count this character in the current consecutive group. count becomes ${count}.`,
        calculation: `count = ${count - 1} + 1 = ${count}`,
        line: 7,
        chars: [...chars],
        active: [i],
        variables: `i = ${i} · count = ${count} · index = ${index}`,
      });

      if (i + 1 === n || chars[i] !== chars[i + 1]) {
        const groupChar = chars[i];
        add({
          title: `End of the "${groupChar}" group`,
          explanation:
            i + 1 === n
              ? "This is the last character, so the group must be written even though there is no next character."
              : `The next character is "${chars[i + 1]}", not "${groupChar}". The current group is complete.`,
          calculation:
            i + 1 === n
              ? `i + 1 = ${i + 1} == n = ${n}`
              : `chars[${i}] != chars[${i + 1}]`,
          line: 8,
          chars: [...chars],
          active: [i],
          variables: `group = "${groupChar}" × ${count} · index = ${index}`,
        });

        chars[index] = groupChar;
        add({
          title: `Write the group character at index ${index}`,
          explanation:
            "Write one copy of the character at the next output position. This can overwrite old characters because the compressed output never grows beyond the original array.",
          calculation: `chars[${index}] = "${groupChar}"`,
          line: 9,
          chars: [...chars],
          active: [index],
          variables: `index = ${index} · count = ${count}`,
        });
        index++;

        if (count > 1) {
          const digits = String(count);
          for (const digit of digits) {
            chars[index] = digit;
            add({
              title: `Write count digit "${digit}"`,
              explanation: `Because the group occurs ${count} times, its count is written after the character. Each digit is written separately, so counts like 12 become "1", then "2".`,
              calculation: `chars[${index}] = "${digit}"`,
              line: 13,
              chars: [...chars],
              active: [index],
              variables: `count = ${count} · index = ${index}`,
            });
            index++;
          }
        } else {
          add({
            title: "Count is 1 — write no digit",
            explanation:
              "A single occurrence is represented by the character alone. The algorithm does not write the digit 1.",
            calculation: "count > 1 → False",
            line: 11,
            chars: [...chars],
            active: [],
            variables: `count = ${count} · index = ${index}`,
          });
        }
        count = 0;
        add({
          title: "Reset for the next group",
          explanation:
            "The current group is finished, so reset count to zero. The next iteration starts counting the next group.",
          calculation: "count = 0",
          line: 15,
          chars: [...chars],
          active: [],
          variables: `count = 0 · index = ${index}`,
        });
      }
    }

    add({
      title: "Return the compressed length",
      explanation:
        "Only the first index characters contain the compressed output. The original array may still have leftover characters after that position; ignore them.",
      calculation: `return index = ${index}; compressed prefix = "${chars.slice(0, index).join("")}"`,
      line: 16,
      chars: [...chars],
      active: Array.from({ length: index }, (_, i) => i),
      variables: `index = ${index}`,
      final: `${chars.slice(0, index).join("")} · length ${index}`,
    });
  }

  if (problemId === "reverse-only-letters") {
    const chars = [...input];
    let left = 0;
    let right = chars.length - 1;
    add({
      title: "Place pointers at both ends",
      explanation:
        "left starts at the beginning, and right starts at the end. The goal is to swap letters while leaving punctuation in its original position.",
      calculation: `left = 0, right = ${right}`,
      line: 4,
      chars: [...chars],
      active: [left, right],
      variables: `left = ${left} · right = ${right}`,
    });

    while (left <= right) {
      if (isLetter(chars[left])) {
        add({
          title: `Left points to letter "${chars[left]}"`,
          explanation:
            "The character at left is a letter, so check whether the character at right is also a letter.",
          calculation: `s[${left}].isalpha() → True`,
          line: 7,
          chars: [...chars],
          active: [left, right],
          variables: `left = ${left} · right = ${right}`,
        });
        if (isLetter(chars[right])) {
          const oldLeft = chars[left];
          const oldRight = chars[right];
          [chars[left], chars[right]] = [chars[right], chars[left]];
          add({
            title: `Swap "${oldLeft}" and "${oldRight}"`,
            explanation:
              "Both pointers are on letters. Swap those two letters, then move both pointers inward.",
            calculation: `s[${left}] ↔ s[${right}]`,
            line: 9,
            chars: [...chars],
            active: [left, right],
            variables: `left = ${left} · right = ${right} · swapped`,
          });
          left++;
          right--;
          add({
            title: "Move both pointers inward",
            explanation:
              "The swapped letters are now in their final positions. Move left rightward and right leftward to find the next pair.",
            calculation: `left = ${left - 1} + 1 = ${left}; right = ${right + 1} - 1 = ${right}`,
            line: 11,
            chars: [...chars],
            active: left <= right ? [left, right] : [],
            variables: `left = ${left} · right = ${right}`,
          });
        } else {
          add({
            title: `Right points to non-letter "${chars[right]}"`,
            explanation:
              "Do not swap punctuation. Move only right inward until it finds a letter.",
            calculation: `s[${right}].isalpha() → False`,
            line: 13,
            chars: [...chars],
            active: [left, right],
            variables: `left = ${left} · right = ${right}`,
          });
          right--;
        }
      } else {
        add({
          title: `Left points to non-letter "${chars[left]}"`,
          explanation:
            "This character is punctuation or a symbol. It must stay where it is, so move only left inward.",
          calculation: `s[${left}].isalpha() → False`,
          line: 15,
          chars: [...chars],
          active: [left, right],
          variables: `left = ${left} · right = ${right}`,
        });
        left++;
      }
    }

    add({
      title: "Pointers have crossed — return the string",
      explanation:
        "Every letter has been swapped into its reversed position. Non-letters were never swapped, so they remain in their original positions.",
      calculation: `left = ${left} > right = ${right}`,
      line: 16,
      chars: [...chars],
      active: [],
      variables: "All letter pairs processed",
      final: chars.join(""),
    });
  }

  if (problemId === "capitalize-title") {
    const chars = [...input];
    const title = [...input];
    const length = title.length;
    let i = 0;

    add({
      title: "Convert the title into a character list",
      explanation:
        "list(title) creates a mutable list of characters, allowing individual characters to be changed in place.",
      calculation: `title = list("${input}")`,
      line: 3,
      chars: [...title],
      active: [],
      variables: `length = ${length} · i = 0`,
    });

    while (i < length) {
      const firstIndex = i;

      add({
        title: `Start a word at index ${firstIndex}`,
        explanation:
          "first_index remembers where the current word begins. The inner while loop will lowercase its characters until it reaches a space or the end.",
        calculation: `first_index = i = ${i}`,
        line: 7,
        chars: [...title],
        active: i < length ? [i] : [],
        variables: `i = ${i} · first_index = ${firstIndex} · length = ${length}`,
      });

      while (i < length && title[i] !== " ") {
        const original = title[i];
        title[i] = title[i].toLowerCase();

        add({
          title: `Lowercase character at index ${i}`,
          explanation: `The inner loop changes "${original}" to "${title[i]}". It continues until a space or the end of the title is reached.`,
          calculation: `title[${i}] = "${title[i]}"`,
          line: 9,
          chars: [...title],
          active: [i],
          variables: `i = ${i} · first_index = ${firstIndex}`,
        });

        i++;
      }

      const wordLength = i - firstIndex;

      add({
        title: "Check the word length",
        explanation:
          "The difference between i and first_index gives the current word's length. Only words longer than two characters need an uppercase first character.",
        calculation: `${i} - ${firstIndex} = ${wordLength}; ${wordLength} > 2 → ${wordLength > 2}`,
        line: 11,
        chars: [...title],
        active:
          wordLength > 0
            ? Array.from({ length: wordLength }, (_, k) => firstIndex + k)
            : [],
        variables: `i = ${i} · first_index = ${firstIndex} · word length = ${wordLength}`,
      });

      if (wordLength > 2) {
        title[firstIndex] = title[firstIndex].toUpperCase();

        add({
          title: "Capitalize the first character",
          explanation:
            "Because this word has more than two characters, its first character becomes uppercase. The remaining characters are already lowercase.",
          calculation: `title[${firstIndex}] = "${title[firstIndex]}"`,
          line: 12,
          chars: [...title],
          active: [firstIndex],
          variables: `first_index = ${firstIndex} · word length = ${wordLength}`,
        });
      } else {
        add({
          title: "Keep the short word lowercase",
          explanation:
            "Words with one or two characters remain entirely lowercase.",
          calculation: `${wordLength} <= 2 → no capitalization`,
          line: 11,
          chars: [...title],
          active:
            wordLength > 0
              ? Array.from({ length: wordLength }, (_, k) => firstIndex + k)
              : [],
          variables: `first_index = ${firstIndex} · word length = ${wordLength}`,
        });
      }

      // Match the original implementation's i += 1 after each word.
      i++;

      add({
        title: "Advance to the next word",
        explanation:
          "The outer loop increments i after processing a word. If i was at a space, this moves past it; if the word ended at the string boundary, the loop terminates.",
        calculation: `i = ${i}`,
        line: 13,
        chars: [...title],
        active: i < length ? [i] : [],
        variables: `i = ${i} · length = ${length}`,
      });
    }

    const finalTitle = title.join("");

    add({
      title: "Join the characters",
      explanation:
        "join combines the modified character list back into a string. The original spacing is preserved.",
      calculation: `return "${finalTitle}"`,
      line: 15,
      chars: [...title],
      active: [],
      variables: `length = ${length} · i = ${i}`,
      final: finalTitle,
    });
  }

  return steps;
}

function PythonEditor({ code, activeLine }) {
  const keywords = new Set([
    "class",
    "def",
    "for",
    "if",
    "else",
    "while",
    "return",
    "in",
    "and",
    "or",
    "break",
  ]);
  return (
    <div className="sp-editor">
      <div className="sp-editor-toolbar">
        <span className="sp-lights">
          <i />
          <i />
          <i />
        </span>
        <span>solution.py</span>
        <span className="sp-language">Python 3</span>
      </div>
      <pre className="sp-code">
        <code>
          {code.map((line, index) => {
            const number = index + 1;
            return (
              <div
                key={number}
                className={`sp-code-line ${activeLine === number ? "sp-line-active" : ""}`}
              >
                <span className="sp-line-number">{number}</span>
                <span className="sp-source">
                  {line
                    .split(
                      /(\bclass\b|\bdef\b|\bfor\b|\bif\b|\belse\b|\bwhile\b|\breturn\b|\bin\b|\band\b|\bor\b|\bbreak\b|"[^"]*"|'[^']*'|\b\d+\b)/g,
                    )
                    .map((part, i) => {
                      let kind = "plain";
                      if (keywords.has(part)) kind = "keyword";
                      else if (/^["']/.test(part)) kind = "string";
                      else if (/^\d+$/.test(part)) kind = "number";
                      else if (/^(len|range|str|list)$/.test(part))
                        kind = "builtin";
                      return (
                        <span key={i} className={`sp-${kind}`}>
                          {part}
                        </span>
                      );
                    })}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
      <div className="sp-editor-status">
        <span>● Ready</span>
        <span>UTF-8</span>
        <span>Python</span>
      </div>
    </div>
  );
}

export default function StringProblems({ problemId }) {
  const config = PROBLEMS[problemId];
  const [input, setInput] = useState(config?.defaultInput ?? "");
  const [loadedInput, setLoadedInput] = useState(config?.defaultInput ?? "");
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");

  const trace = useMemo(
    () => (config ? makeTrace(problemId, loadedInput) : []),
    [problemId, loadedInput, config],
  );
  const step = trace[Math.min(activeStep, trace.length - 1)];

  if (!config || !step) return <div className="panel">Lesson not found.</div>;

  function loadInput() {
    if (input.length > 100) {
      setError("Please keep the input to 100 characters or fewer.");
      return;
    }
    setError("");
    setLoadedInput(input);
    setActiveStep(0);
  }

  return (
    <section className="panel sp-visualizer">
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · STRINGS</div>
      <div className="sp-heading">
        <div>
          <h2>{config.title}</h2>
          <p>Step through the algorithm and follow the active Python line.</p>
        </div>
        <a
          className="button secondary"
          href={config.url}
          target="_blank"
          rel="noreferrer"
        >
          Open LeetCode ↗
        </a>
      </div>

      <label className="sp-input-label" htmlFor="sp-input">
        {config.inputLabel}
      </label>
      <div className="sp-input-row">
        <input
          id="sp-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") loadInput();
          }}
        />
        <button className="button primary" type="button" onClick={loadInput}>
          Load input
        </button>
      </div>
      <small className="sp-muted">
        For String Compression, each character is processed individually.
      </small>
      {error && <p className="sp-error">{error}</p>}

      <div className="sp-output">
        <span>Current data</span>
        <div className="sp-char-array">
          {(step.chars ?? [...loadedInput]).map((char, index) => (
            <div
              key={index}
              className={`sp-char-cell ${(step.active ?? []).includes(index) ? "sp-char-active" : ""}`}
            >
              <small>{index}</small>
              <strong>{char === " " ? "␠" : char}</strong>
            </div>
          ))}
        </div>
        {step.filtered && (
          <p>
            <b>Filtered characters:</b> {step.filtered.join("")}
          </p>
        )}
        {step.temp !== undefined && (
          <p>
            <b>Clean string:</b> {step.temp}
          </p>
        )}
        {step.result && (
          <p>
            <b>Result list:</b> [
            {step.result.map((word) => `"${word}"`).join(", ")}]
          </p>
        )}
      </div>

      <div className="sp-state">
        <span>
          <small>VARIABLES / POINTERS</small>
          <strong>{step.variables ?? "—"}</strong>
        </span>
        {step.left !== undefined && (
          <span>
            <small>LEFT</small>
            <strong>{step.left}</strong>
          </span>
        )}
        {step.right !== undefined && (
          <span>
            <small>RIGHT</small>
            <strong>{step.right}</strong>
          </span>
        )}
      </div>

      <div className="sp-explanation">
        <span className="section-kicker">
          STEP {activeStep + 1} OF {trace.length}
        </span>
        <h3>{step.title}</h3>
        <p>{step.explanation}</p>
        <div className="sp-calculation">
          <small>CALCULATION / CONDITION</small>
          <code>{step.calculation}</code>
        </div>
        {step.final !== undefined && (
          <div className="sp-final">
            <small>FINAL ANSWER</small>
            <strong>{step.final}</strong>
          </div>
        )}
      </div>

      <div className="sp-controls">
        <button
          className="button secondary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
        >
          ← Previous
        </button>
        <div className="sp-progress">
          <div
            style={{ width: `${((activeStep + 1) / trace.length) * 100}%` }}
          />
        </div>
        <button
          className="button primary"
          disabled={activeStep === trace.length - 1}
          onClick={() =>
            setActiveStep((s) => Math.min(trace.length - 1, s + 1))
          }
        >
          Next step →
        </button>
      </div>
      <div className="sp-reset-row">
        <span>
          Step {activeStep + 1} / {trace.length}
        </span>
        <button onClick={() => setActiveStep(0)}>Reset walkthrough</button>
      </div>

      <div className="sp-complexity">
        <h3>Complexity analysis</h3>
        <div className="sp-complexity-grid">
          <div>
            <small>TIME COMPLEXITY</small>
            <strong>{config.complexity.time}</strong>
          </div>
          <div>
            <small>AUXILIARY SPACE</small>
            <strong>{config.complexity.space}</strong>
          </div>
        </div>
        <p>{config.complexity.explanation}</p>
      </div>

      <div className="sp-code-heading">
        <div>
          <h3>Python solution</h3>
          <p>Syntax highlighting · active line follows the dry run</p>
        </div>
      </div>
      <PythonEditor code={config.code} activeLine={step.line} />
    </section>
  );
}
