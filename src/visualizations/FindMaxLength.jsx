import { useMemo, useState } from 'react'

function buildTrace(nums) {
  // Store the first index of each prefix sum. Index -1 represents the empty prefix.
  const firstIndex = new Map([[0, -1]])
  let prefixSum = 0
  let longest = 0
  const trace = [{
    index: -1, num: null, prefixSum: 0, longest: 0,
    map: [{ sum: 0, index: -1 }],
    title: 'Start before the array',
    explanation: 'Treat 0 as −1 and 1 as +1. We store prefix sum 0 at index −1 so a balanced prefix starting at index 0 is counted correctly.',
    code: 'firstIndex = {0: -1}',
    kind: 'start', balancedRange: null,
  }]

  nums.forEach((num, index) => {
    prefixSum += num === 0 ? -1 : 1
    let title = ''
    let explanation = ''
    let code = ''
    let kind = ''
    let balancedRange = null

    if (firstIndex.has(prefixSum)) {
      const earlierIndex = firstIndex.get(prefixSum)
      const candidateLength = index - earlierIndex
      longest = Math.max(longest, candidateLength)
      title = `Prefix sum ${prefixSum} has appeared before`
      explanation = `This sum first appeared at index ${earlierIndex}. The range from index ${earlierIndex + 1} through ${index} has net sum 0, so it has equal numbers of 0s and 1s. Its length is ${candidateLength}.`
      code = `longest = max(longest, ${index} - (${earlierIndex}))`
      kind = 'repeat'
      balancedRange = [earlierIndex + 1, index]
    } else {
      firstIndex.set(prefixSum, index)
      title = `Remember the new sum ${prefixSum}`
      explanation = `This is the first time we have seen ${prefixSum}. Save index ${index}. Keeping the earliest index makes future balanced ranges as long as possible.`
      code = `firstIndex[${prefixSum}] = ${index}`
      kind = 'new'
    }

    trace.push({
      index, num, prefixSum, longest,
      map: [...firstIndex.entries()].map(([sum, i]) => ({ sum, index: i })),
      title, explanation, code, kind, balancedRange,
    })
  })
  return trace
}

const PYTHON_CODE = `class Solution:
    def findMaxLength(self, nums: list[int]) -> int:
        first_index = {0: -1}
        prefix_sum = 0
        longest = 0

        for i, num in enumerate(nums):
            prefix_sum += 1 if num == 1 else -1
            if prefix_sum in first_index:
                longest = max(longest, i - first_index[prefix_sum])
            else:
                first_index[prefix_sum] = i

        return longest`

const JAVA_CODE = `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> firstIndex = new HashMap<>();
        firstIndex.put(0, -1);

        int prefixSum = 0;
        int longest = 0;

        for (int i = 0; i < nums.length; i++) {
            prefixSum += nums[i] == 1 ? 1 : -1;
            if (firstIndex.containsKey(prefixSum)) {
                longest = Math.max(longest, i - firstIndex.get(prefixSum));
            } else {
                firstIndex.put(prefixSum, i);
            }
        }

        return longest;
    }
}`

function CodeSolutions() {
  const [language, setLanguage] = useState('python')
  const code = language === 'python' ? PYTHON_CODE : JAVA_CODE

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // If clipboard access is blocked, the code can still be selected and copied manually.
    }
  }

  return (
    <section className="code-solutions panel">
      <div className="code-heading">
        <div>
          <span className="section-kicker">REFERENCE IMPLEMENTATIONS</span>
          <h2>Solution code</h2>
          <p>Compare the implementation with each step of the visual dry run.</p>
        </div>
        <div className="code-actions">
          <div className="language-switch" role="group" aria-label="Choose programming language">
            <button type="button" className={language === 'python' ? 'selected' : ''} onClick={() => setLanguage('python')}>Python</button>
            <button type="button" className={language === 'java' ? 'selected' : ''} onClick={() => setLanguage('java')}>Java</button>
          </div>
          <button className="button secondary copy-code-button" type="button" onClick={copyCode}>Copy code</button>
        </div>
      </div>
      <pre className="code-block"><code>{code}</code></pre>
      <p className="code-footnote">Core idea: treat 0 as −1 and 1 as +1. If a prefix sum repeats, the range after its first occurrence through the current index has sum zero.</p>
    </section>
  )
}

const DEFAULT_INPUT = '0, 1, 0, 1, 1, 0'

export default function FindMaxLength({ leetcodeUrl = 'https://leetcode.com/problems/contiguous-array/description/' } = {}) {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [activeStep, setActiveStep] = useState(0)
  const [inputError, setInputError] = useState('')
  const nums = useMemo(() => input.split(/[\\s,]+/).filter(Boolean).map(Number), [input])
  const valid = nums.length > 0 && nums.every((n) => n === 0 || n === 1) && nums.length <= 40
  const trace = useMemo(() => valid ? buildTrace(nums) : [], [nums, valid])
  const step = trace[activeStep] ?? trace[0]

  function applyInput() {
    const parts = input.split(/[\\s,]+/).filter(Boolean)
    const parsed = parts.map(Number)
    if (!parts.length || parsed.some((n) => n !== 0 && n !== 1)) {
      setInputError('Enter only 0s and 1s, separated by commas or spaces.')
      return
    }
    if (parsed.length > 40) {
      setInputError('Use 40 elements or fewer to keep the visualization readable.')
      return
    }
    setInputError('')
    setActiveStep(0)
  }

  if (!valid) {
    return (
      <section className="visualizer panel">
        <h2>525. Contiguous Array</h2>
        <p>Enter a valid array of 0s and 1s.</p>
        <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Binary array input" />
        <button className="button primary" onClick={applyInput}>Load array</button>
        <p className="error">{inputError || 'Only 0s and 1s are supported.'}</p>
      </section>
    )
  }

  return (
    <section className="visualizer panel" id="find-max-length">
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · ARRAYS + HASHING</div>
      <div className="visualizer-heading">
        <div><h2>525. Contiguous Array</h2><p>Longest contiguous subarray with equal numbers of 0s and 1s.</p></div>
        <div className="visualizer-links">
          <span className="complexity-chip">O(n) time · O(n) space</span>
          <a className="button secondary leetcode-inline-link" href={leetcodeUrl} target="_blank" rel="noreferrer">View on LeetCode ↗</a>
        </div>
      </div>
      <div className="input-row">
        <label htmlFor="array-input">Try your own array</label>
        <div className="input-controls">
          <input id="array-input" value={input} onChange={(e) => setInput(e.target.value)} aria-describedby="array-help" />
          <button className="button secondary" onClick={applyInput}>Load</button>
        </div>
        <small id="array-help">Use 0s and 1s, e.g. 0, 1, 0, 1, 1, 0 (up to 40 values).</small>
        {inputError && <small className="error">{inputError}</small>}
      </div>
      <div className="array-area">
        <div className="subheading-row"><h3>Array</h3><span>Current step: {activeStep} / {nums.length}</span></div>
        <div className="array-grid">
          {nums.map((num, i) => {
            const isCurrent = step.index === i
            const isBalanced = step.balancedRange && i >= step.balancedRange[0] && i <= step.balancedRange[1]
            return <div key={`${i}-${num}`} className={`array-cell ${num === 0 ? 'zero-cell' : 'one-cell'} ${isCurrent ? 'current-cell' : ''} ${isBalanced ? 'balanced-cell' : ''}`}>
              <span className="array-index">{i}</span><strong>{num}</strong><span className="array-contribution">{num === 0 ? '−1' : '+1'}</span>
            </div>
          })}
        </div>
        <div className="legend"><span><i className="legend-dot zero-dot" /> 0 contributes −1</span><span><i className="legend-dot one-dot" /> 1 contributes +1</span><span><i className="legend-dot balanced-dot" /> Balanced range found</span></div>
      </div>
      <div className="metrics-grid">
        <div className="metric"><span>Current index</span><strong>{step.index < 0 ? '—' : step.index}</strong></div>
        <div className="metric"><span>Prefix sum</span><strong>{step.prefixSum}</strong></div>
        <div className="metric highlight-metric"><span>Longest length so far</span><strong>{step.longest}</strong></div>
      </div>
      <div className="explanation-box">
        <div className="explanation-icon">{step.kind === 'repeat' ? '↔' : step.kind === 'zero' ? '✓' : '→'}</div>
        <div><span className="section-kicker">WHAT HAPPENED?</span><h3>{step.title}</h3><p>{step.explanation}</p><code>{step.code}</code></div>
      </div>
      <div className="map-section">
        <div className="subheading-row"><h3>sumToIndex hashmap</h3><span>Prefix sum → earliest index</span></div>
        {step.map.length === 0 ? <div className="empty-map">No prefix sums stored yet.</div> : <div className="map-grid">{step.map.map(({ sum, index }) => <div className={`map-entry ${sum === step.prefixSum ? 'map-entry-current' : ''}`} key={sum}><span>Sum</span><strong>{sum}</strong><span>First index: {index}</span></div>)}</div>}
        <p className="map-note">Why keep the earliest index? A repeated prefix sum gives a balanced subarray. The earlier the first occurrence, the longer that subarray can be.</p>
      </div>
      <div className="step-controls">
        <button className="button secondary" onClick={() => setActiveStep((s) => Math.max(0, s - 1))} disabled={activeStep === 0}>← Previous</button>
        <div className="step-progress" aria-label={`Step ${activeStep} of ${nums.length}`}><div style={{ width: `${(activeStep / nums.length) * 100}%` }} /></div>
        <button className="button primary" onClick={() => setActiveStep((s) => Math.min(nums.length, s + 1))} disabled={activeStep === nums.length}>Next step →</button>
      </div>
      <button className="reset-button" onClick={() => setActiveStep(0)}>Reset walkthrough</button>
      {activeStep === nums.length && <div className="final-answer"><span>Final answer</span><strong>{step.longest}</strong><p>The longest balanced subarray has length {step.longest}.</p></div>}
      <CodeSolutions />
    </section>
  )
}
