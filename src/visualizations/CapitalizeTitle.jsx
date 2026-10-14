import { useMemo, useState } from 'react'
import './CapitalizeTitle.css'

const DEFAULT_TITLE = 'capiTalIze tHe titLe'

const PYTHON_LINES = [
  { n: 1, indent: 0, parts: [['kw', 'class'], ['plain', ' Solution:']] },
  { n: 2, indent: 1, parts: [['kw', 'def'], ['fn', ' capitalizeTitle'], ['plain', '(self, title: '], ['type', 'str'], ['plain', ') -> '], ['type', 'str'], ['plain', ':']] },
  { n: 3, indent: 2, parts: [['plain', 'title = '], ['fn', 'list'], ['plain', '(title)']] },
  { n: 4, indent: 2, parts: [['plain', 'length = len(title)']] },
  { n: 5, indent: 0, parts: [] },
  { n: 6, indent: 2, parts: [['plain', 'i = '], ['num', '0']] },
  { n: 7, indent: 2, parts: [['kw', 'while'], ['plain', ' i < length:']] },
  { n: 8, indent: 3, parts: [['plain', 'first_index = i']] },
  { n: 9, indent: 3, parts: [['kw', 'while'], ['plain', ' i < length '], ['kw', 'and'], ['plain', ' title[i] != '], ['str', '" "'], ['plain', ':']] },
  { n: 10, indent: 4, parts: [['plain', 'title[i] = title[i].'], ['fn', 'lower'], ['plain', '()']] },
  { n: 11, indent: 4, parts: [['plain', 'i += '], ['num', '1']] },
  { n: 12, indent: 3, parts: [['kw', 'if'], ['plain', ' i - first_index > '], ['num', '2'], ['plain', ':']] },
  { n: 13, indent: 4, parts: [['plain', 'title[first_index] = title[first_index].'], ['fn', 'upper'], ['plain', '()']] },
  { n: 14, indent: 3, parts: [['plain', 'i += '], ['num', '1']] },
  { n: 15, indent: 2, parts: [['kw', 'return'], ['plain', ' '], ['str', '""'], ['plain', '.'], ['fn', 'join'], ['plain', '(title)']] },
]

function buildTrace(title) {
  const chars = [...title]
  const trace = []
  const add = (event) => trace.push({ chars: [...chars], ...event })

  add({
    index: -1, firstIndex: null, wordStart: null, wordEnd: null,
    outer: 'setup', inner: 'idle', kind: 'start',
    title: 'Set up the character array',
    explanation: 'list(title) makes the string editable one character at a time. i is the cursor that moves through the whole string.',
    calculation: 'i = 0',
    codeLine: 3,
  })

  let i = 0
  while (i < chars.length) {
    const firstIndex = i
    add({
      index: i, firstIndex, wordStart: firstIndex, wordEnd: null,
      outer: 'active', inner: 'check', kind: 'word-start',
      title: `Outer loop: begin a word at index ${firstIndex}`,
      explanation: 'The outer while loop handles one word per pass. Save the current i in first_index so we remember where this word began.',
      calculation: `first_index = i = ${firstIndex}`,
      codeLine: 8,
    })

    while (i < chars.length && chars[i] !== ' ') {
      add({
        index: i, firstIndex, wordStart: firstIndex, wordEnd: null,
        outer: 'active', inner: 'check', kind: 'inner-check',
        title: `Inner loop checks index ${i}`,
        explanation: i < chars.length
          ? (chars[i] !== ' '
              ? `i (${i}) is inside the string, and title[${i}] is "${chars[i]}", not a space. The inner loop can process this character.`
              : 'This character is a space, so the inner loop stops. The outer loop will move past the space.')
          : 'i has reached the end of the string, so there are no more characters in this word.',
        calculation: `i < ${chars.length} and title[${i}] != " "`,
        codeLine: 9,
      })
      const before = chars[i]
      chars[i] = chars[i].toLowerCase()
      add({
        index: i, firstIndex, wordStart: firstIndex, wordEnd: null,
        outer: 'active', inner: 'body', kind: 'lower',
        title: `Lowercase character at index ${i}`,
        explanation: before === chars[i]
          ? `"${before}" is already lowercase. The assignment leaves it unchanged; the loop still advances i.`
          : `Convert "${before}" to "${chars[i]}". Every letter is lowercased first, including the first letter, because we only decide capitalization after the whole word is scanned.`,
        calculation: `title[${i}] = "${before}".lower() → "${chars[i]}"`,
        codeLine: 10,
      })
      i += 1
      add({
        index: i < chars.length ? i : -1, firstIndex, wordStart: firstIndex, wordEnd: null,
        outer: 'active', inner: 'advance', kind: 'advance',
        title: `Move i forward to ${i}`,
        explanation: 'i += 1 advances the cursor by one character. The inner loop checks the next character on its next pass.',
        calculation: `i = ${i - 1} + 1 = ${i}`,
        codeLine: 11,
      })
    }

    const wordEnd = i
    const wordLength = i - firstIndex
    add({
      index: wordLength > 0 ? firstIndex : -1, firstIndex, wordStart: firstIndex, wordEnd,
      wordLength, outer: 'active', inner: 'finished', kind: 'length',
      title: 'Calculate the word length',
      explanation: 'When the inner loop stops, i points at the space after the word (or just past the last character). Subtract the saved starting index to get how many characters were scanned.',
      calculation: `i - first_index = ${i} - ${firstIndex} = ${wordLength}`,
      codeLine: 12,
    })

    if (wordLength > 2) {
      const before = chars[firstIndex]
      chars[firstIndex] = chars[firstIndex].toUpperCase()
      add({
        index: firstIndex, firstIndex, wordStart: firstIndex, wordEnd,
        wordLength, outer: 'active', inner: 'finished', kind: 'capitalize',
        title: `Condition is TRUE: ${wordLength} > 2`,
        explanation: `This word has ${wordLength} characters, which is more than 2. title[first_index] selects the first character at index ${firstIndex}; .upper() turns "${before}" into "${chars[firstIndex]}".`,
        calculation: `${wordLength} > 2 → True; title[${firstIndex}] = "${before}".upper() → "${chars[firstIndex]}"`,
        codeLine: 13,
      })
    } else {
      add({
        index: wordLength > 0 ? firstIndex : -1, firstIndex, wordStart: firstIndex, wordEnd,
        wordLength, outer: 'active', inner: 'finished', kind: 'short-word',
        title: `Condition is FALSE: ${wordLength} > 2`,
        explanation: `This word has ${wordLength} character${wordLength === 1 ? '' : 's'}. Since ${wordLength} is not greater than 2, the if-body is skipped and the word remains lowercase.`,
        calculation: `${wordLength} > 2 → False; do not change the first character`,
        codeLine: 12,
      })
    }

    if (i < chars.length && chars[i] === ' ') {
      add({
        index: i, firstIndex, wordStart: firstIndex, wordEnd,
        wordLength, outer: 'active', inner: 'space', kind: 'space',
        title: `Skip the space at index ${i}`,
        explanation: 'The inner loop stopped because it reached a space. This i += 1 moves past the separator, so the next outer-loop pass starts at the next word.',
        calculation: `i = ${i} + 1 = ${i + 1}`,
        codeLine: 14,
      })
      i += 1
    } else {
      add({
        index: -1, firstIndex, wordStart: firstIndex, wordEnd,
        wordLength, outer: 'active', inner: 'end', kind: 'end-word',
        title: 'Reached the end of the string',
        explanation: 'There is no space to skip. The outer loop condition will now be false, and the function can return the completed title.',
        calculation: `i = ${i}; length = ${chars.length}`,
        codeLine: 7,
      })
    }
  }

  add({
    index: -1, firstIndex: null, wordStart: null, wordEnd: null,
    outer: 'done', inner: 'done', kind: 'done',
    title: 'Return the joined string',
    explanation: 'All words have been processed. join(title) combines the updated character list back into one string while preserving the original spaces.',
    calculation: `return "${chars.join('')}"`,
    codeLine: 15,
  })
  return trace
}

function PythonCode({ activeLine }) {
  return (
    <div className="capitalize-python-editor" aria-label="Python solution with syntax highlighting">
      <div className="capitalize-python-toolbar">
        <div className="capitalize-python-lights"><i /><i /><i /></div>
        <span>solution.py</span>
        <span className="capitalize-python-language">Python 3</span>
      </div>
      <pre className="capitalize-python-pre"><code>
        {PYTHON_LINES.map((line) => (
          <div key={line.n} className={`capitalize-python-line ${activeLine === line.n ? 'line-active' : ''}`}>
            <span className="capitalize-python-line-number">{line.n}</span>
            <span className="capitalize-python-source" style={{ paddingLeft: `${line.indent * 1.45}rem` }}>
              {line.parts.map(([kind, value], index) => <span key={index} className={`py-${kind}`}>{value}</span>)}
            </span>
          </div>
        ))}
      </code></pre>
      <div className="capitalize-python-status"><span><i /> Ready</span><span>UTF-8</span><span>Python</span></div>
    </div>
  )
}

export default function CapitalizeTitle() {
  const [input, setInput] = useState(DEFAULT_TITLE)
  const [loadedTitle, setLoadedTitle] = useState(DEFAULT_TITLE)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const trace = useMemo(() => buildTrace(loadedTitle), [loadedTitle])
  const step = trace[Math.min(activeStep, trace.length - 1)]

  function loadTitle() {
    if (!input.trim()) {
      setError('Enter a title containing at least one non-space character.')
      return
    }
    if (input.length > 80) {
      setError('Keep the title to 80 characters or fewer for this visualization.')
      return
    }
    setError('')
    setLoadedTitle(input)
    setActiveStep(0)
  }

  async function copyCode() {
    const code = `class Solution:\n    def capitalizeTitle(self, title: str) -> str:\n        title = list(title)\n        length = len(title)\n\n        i = 0\n        while i < length:\n            first_index = i\n            while i < length and title[i] != " ":\n                title[i] = title[i].lower()\n                i += 1\n            if i - first_index > 2:\n                title[first_index] = title[first_index].upper()\n            i += 1\n        return "".join(title)`
    try {
      await navigator.clipboard.writeText(code)
      setError('')
    } catch {
      setError('Clipboard access was blocked. The syntax-highlighted code below can still be selected and copied.')
    }
  }

  const wordLength = step.wordLength ?? 0

  return (
    <section className="visualizer panel capitalize-title-visualizer">
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · STRINGS</div>
      <div className="capitalize-title-heading">
        <div><h2>2129. Capitalize the Title</h2><p>Follow both while loops and see exactly how the word length is calculated.</p></div>
        <a className="button secondary" href="https://leetcode.com/problems/capitalize-the-title/" target="_blank" rel="noreferrer">LeetCode 2129 ↗</a>
      </div>

      <div className="capitalize-title-input">
        <label htmlFor="capitalize-title-input">Try your own title</label>
        <div className="capitalize-title-input-row">
          <input id="capitalize-title-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') loadTitle() }} maxLength={80} />
          <button className="button primary" type="button" onClick={loadTitle}>Load title</button>
        </div>
        <small>Spaces are preserved. Words with 1–2 characters stay lowercase.</small>
        {error && <p className="capitalize-title-error">{error}</p>}
      </div>

      <div className="capitalize-title-result">
        <span>String after the current operation</span>
        <strong>{step.chars.map((char, index) => (
          <span key={index} className={index === step.index ? 'result-current-char' : ''}>{char === ' ' ? '\u00a0' : char}</span>
        ))}</strong>
        <small>Input: {loadedTitle}</small>
      </div>

      <div className="capitalize-title-loop-map">
        <div className={`loop-card ${step.outer === 'active' ? 'loop-card-active' : ''}`}>
          <span className="loop-number">LOOP 1</span>
          <strong>Outer while</strong>
          <code>while i &lt; length</code>
          <p>Finds the start of each word and moves to the next word.</p>
        </div>
        <div className={`loop-card ${step.inner === 'check' || step.inner === 'body' || step.inner === 'advance' ? 'loop-card-active' : ''}`}>
          <span className="loop-number">LOOP 2</span>
          <strong>Inner while</strong>
          <code>while i &lt; length and title[i] != " "</code>
          <p>Walks character by character until it meets a space or the string ends.</p>
        </div>
      </div>

      <div className="capitalize-title-array-wrap">
        <div className="capitalize-title-array-label"><h3>Character-by-character view</h3><span>Index · character</span></div>
        <div className="capitalize-title-array">
          {step.chars.map((char, index) => (
            <div key={index} className={[
              'capitalize-title-cell',
              index === step.index ? 'is-active' : '',
              index === step.firstIndex ? 'is-first' : '',
              index === step.index && step.kind === 'capitalize' ? 'is-capitalize' : '',
              char === ' ' ? 'is-space' : '',
            ].filter(Boolean).join(' ')}>
              <span className="capitalize-title-index">{index}</span>
              <strong>{char === ' ' ? '␠' : char}</strong>
              {index === step.firstIndex && <small>first_index</small>}
              {index === step.index && step.kind === 'lower' && <small>i →</small>}
            </div>
          ))}
        </div>
        <div className="capitalize-title-legend">
          <span><i className="legend-active" /> Current position (i)</span>
          <span><i className="legend-first" /> Saved word start (first_index)</span>
          <span>␠ = space</span>
        </div>
      </div>

      <div className="capitalize-title-stats">
        <div><span>i (current cursor)</span><strong>{step.index < 0 ? '—' : step.index}</strong></div>
        <div><span>first_index (word start)</span><strong>{step.firstIndex == null ? '—' : step.firstIndex}</strong></div>
        <div><span>i − first_index (word length)</span><strong>{step.firstIndex == null ? '—' : wordLength}</strong></div>
      </div>

      <div className="capitalize-title-explanation">
        <div className={`capitalize-title-step-icon kind-${step.kind}`}>{step.kind === 'done' ? '✓' : step.kind === 'capitalize' ? 'A' : step.kind === 'lower' ? 'a' : '→'}</div>
        <div className="capitalize-title-explanation-copy">
          <span className="section-kicker">CURRENT STEP · {activeStep + 1} / {trace.length}</span>
          <h3>{step.title}</h3>
          <p>{step.explanation}</p>
          <div className="capitalize-calculation"><span>CALCULATION / CHECK</span><code>{step.calculation}</code></div>
        </div>
      </div>

      <div className="capitalize-title-rule">
        <h3>What does <code>i - first_index &gt; 2</code> mean?</h3>
        <p><strong>i</strong> is where the inner loop stopped. <strong>first_index</strong> is where this word began. Subtracting them gives the number of characters in the word.</p>
        <div className="length-examples">
          <div><span>Word: <b>to</b></span><code>2 - 0 = 2</code><em className="condition-false">2 &gt; 2 → False</em><small>Keep lowercase: to</small></div>
          <div><span>Word: <b>cat</b></span><code>3 - 0 = 3</code><em className="condition-true">3 &gt; 2 → True</em><small>Capitalize: Cat</small></div>
        </div>
        <p className="capitalize-title-rule-footnote">Notice it is <strong>&gt; 2</strong>, not <strong>&gt;= 2</strong>. Two-letter words must stay lowercase.</p>
      </div>

      <div className="capitalize-title-controls">
        <button className="button secondary" type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={activeStep === 0}>← Previous</button>
        <div className="capitalize-title-progress"><div style={{ width: `${((activeStep + 1) / trace.length) * 100}%` }} /></div>
        <button className="button primary" type="button" onClick={() => setActiveStep((current) => Math.min(trace.length - 1, current + 1))} disabled={activeStep === trace.length - 1}>Next step →</button>
      </div>
      <div className="capitalize-title-bottom-controls"><span>Step {activeStep + 1} of {trace.length}</span><button className="capitalize-title-reset" type="button" onClick={() => setActiveStep(0)}>Reset walkthrough</button></div>

      {activeStep === trace.length - 1 && <div className="capitalize-title-final"><span>Final answer</span><strong>{step.chars.join('')}</strong></div>}

      <div className="capitalize-title-code-heading">
        <div><h3>Python solution</h3><p>Syntax-highlighted · active line follows the dry run</p></div>
        <button className="button secondary" type="button" onClick={copyCode}>Copy code</button>
      </div>
      <PythonCode activeLine={step.codeLine} />
    </section>
  )
}
