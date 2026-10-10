import { useMemo, useState } from 'react'
import './SubarraySumEqualsK.css'

const DEFAULT_NUMS = '1, 2, 3'
const DEFAULT_K = '3'

function makeTrace(nums, target) {
  const freq = new Map([[0, 1]])
  let prefix = 0
  let count = 0
  const trace = [{ index: -1, num: null, prefix: 0, diff: null, matches: 0, count: 0, freq: [{ sum: 0, frequency: 1 }], title: 'Initialize the prefix-sum frequency map', explanation: 'Before reading any number, the running sum is 0. Store it once: this lets us count a subarray that starts at index 0 when its sum equals k.', code: 'sumFreq = {0: 1}', kind: 'start' }]

  nums.forEach((num, index) => {
    prefix += num
    const diff = prefix - target
    const matches = freq.get(diff) ?? 0
    count += matches
    const oldFrequency = freq.get(prefix) ?? 0
    freq.set(prefix, oldFrequency + 1)

    let title
    let explanation
    let kind
    if (matches > 0) {
      title = `Found ${matches} matching prefix ${diff}`
      explanation = `Current prefix sum is ${prefix}. We need an earlier prefix of ${prefix} − ${target} = ${diff}. It has appeared ${matches} time(s), so ${matches} subarray(s) ending at index ${index} sum to k = ${target}. Add ${matches} to the answer.`
      kind = 'match'
    } else {
      title = `No earlier prefix equals ${diff}`
      explanation = `Current prefix sum is ${prefix}. To make a subarray sum to ${target}, an earlier prefix would need to be ${prefix} − ${target} = ${diff}. We have not seen that sum, so the answer does not increase at this step.`
      kind = 'no-match'
    }
    trace.push({
      index, num, prefix, diff, matches, count,
      freq: [...freq.entries()].map(([sum, frequency]) => ({ sum, frequency })),
      title, explanation,
      code: `count += sumFreq.get(${diff}, 0)  # +${matches}\nsumFreq[${prefix}] = ${oldFrequency + 1}`,
      kind,
    })
  })
  return trace
}

const PYTHON_CODE = `class Solution:\n    def subarraySum(self, nums: List[int], k: int) -> int:\n        count, prefixSum = 0, 0\n        sumFreq = {0: 1}\n\n        for num in nums:\n            prefixSum += num\n            diff = prefixSum - k\n            count += sumFreq.get(diff, 0)\n            sumFreq[prefixSum] = sumFreq.get(prefixSum, 0) + 1\n\n        return count`

export default function SubarraySumEqualsK() {
  const [input, setInput] = useState(DEFAULT_NUMS)
  const [targetInput, setTargetInput] = useState(DEFAULT_K)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const nums = useMemo(() => input.split(/[\s,]+/).filter(Boolean).map(Number), [input])
  const target = Number(targetInput)
  const valid = nums.length > 0 && nums.length <= 30 && nums.every(Number.isFinite) && targetInput.trim() !== '' && Number.isFinite(target)
  const trace = useMemo(() => valid ? makeTrace(nums, target) : [], [nums, target, valid])
  const step = trace[Math.min(activeStep, trace.length - 1)]

  function loadInput() {
    const parts = input.split(/[\s,]+/).filter(Boolean)
    const parsed = parts.map(Number)
    if (!parts.length || parts.length > 30 || parsed.some((num) => !Number.isFinite(num))) {
      setError('Enter 1–30 valid numbers, separated by commas or spaces.')
      return
    }
    if (targetInput.trim() === '' || !Number.isFinite(Number(targetInput))) {
      setError('Enter a valid target k.')
      return
    }
    setError('')
    setActiveStep(0)
  }

  if (!valid) {
    return <section className="visualizer panel"><h2>Subarray Sum Equals K</h2><p>Enter a valid array of numbers and a target k.</p><p className="error">{error || 'Check the input values and try again.'}</p></section>
  }

  return (
    <section className="visualizer panel subarray-visualizer" id="subarray-sum-equals-k">
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · PREFIX SUM + HASHING</div>
      <div className="visualizer-heading">
        <div><h2>Subarray Sum Equals K</h2><p>Count contiguous subarrays whose sum equals your target.</p></div>
        <div className="visualizer-links"><span className="complexity-chip">O(n) time · O(n) space</span><a className="button secondary leetcode-inline-link" href="https://leetcode.com/problems/subarray-sum-equals-k/" target="_blank" rel="noreferrer">LeetCode 560 ↗</a></div>
      </div>

      <div className="input-row">
        <label htmlFor="subarray-input">Try your own numbers</label>
        <div className="subarray-inputs">
          <input id="subarray-input" aria-label="Array numbers" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') loadInput() }} />
          <label className="target-input-label" htmlFor="subarray-target">Target k</label>
          <input id="subarray-target" className="target-input" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') loadInput() }} inputMode="decimal" />
          <button className="button secondary" type="button" onClick={loadInput}>Load</button>
        </div>
        <small>Supports positive numbers, negative numbers, and zero. Use up to 30 values.</small>
        {error && <small className="error">{error}</small>}
      </div>

      <div className="subheading-row"><h3>Array</h3><span>Step {activeStep} / {nums.length}</span></div>
      <div className="subarray-array-grid">
        {nums.map((num, index) => <div key={`${index}-${num}`} className={`subarray-cell ${step.index === index ? 'subarray-cell-current' : ''}`}><span className="array-index">{index}</span><strong>{num}</strong>{step.index === index && <span className="subarray-current-label">current</span>}</div>)}
      </div>
      <div className="subarray-legend"><span><i className="subarray-legend-dot" /> Current number being processed</span><span>Prefix sum = sum from index 0 to current index</span></div>

      <div className="metrics-grid subarray-metrics">
        <div className="metric"><span>Current index</span><strong>{step.index < 0 ? '—' : step.index}</strong></div>
        <div className="metric"><span>Prefix sum</span><strong>{step.prefix}</strong></div>
        <div className="metric"><span>Needed prefix (sum − k)</span><strong>{step.diff === null ? '—' : step.diff}</strong></div>
        <div className="metric"><span>Matches found now</span><strong>{step.matches}</strong></div>
        <div className="metric highlight-metric"><span>Total subarrays</span><strong>{step.count}</strong></div>
      </div>

      <div className="explanation-box">
        <div className="explanation-icon">{step.kind === 'match' ? '✓' : step.kind === 'start' ? '0' : '→'}</div>
        <div><span className="section-kicker">WHAT HAPPENED?</span><h3>{step.title}</h3><p>{step.explanation}</p><code>{step.code}</code></div>
      </div>

      <div className="map-section">
        <div className="subheading-row"><h3>sumFreq hashmap</h3><span>Prefix sum → number of times seen</span></div>
        <div className="subarray-frequency-grid">{step.freq.map(({ sum, frequency }) => <div className={`map-entry ${sum === step.prefix ? 'map-entry-current' : ''}`} key={sum}><span>Prefix sum</span><strong>{sum}</strong><span>Frequency: {frequency}</span></div>)}</div>
        <p className="map-note">We look up <strong>prefixSum − k</strong> before recording the current prefix sum. That order prevents the current prefix from matching itself when k = 0.</p>
      </div>

      <div className="step-controls"><button className="button secondary" type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={activeStep === 0}>← Previous</button><div className="step-progress" aria-label={`Step ${activeStep} of ${nums.length}`}><div style={{ width: `${(activeStep / nums.length) * 100}%` }} /></div><button className="button primary" type="button" onClick={() => setActiveStep((current) => Math.min(nums.length, current + 1))} disabled={activeStep === nums.length}>Next step →</button></div>
      <button className="reset-button" type="button" onClick={() => setActiveStep(0)}>Reset walkthrough</button>
      {activeStep === nums.length && <div className="final-answer"><span>Final answer</span><strong>{step.count}</strong><p>There {step.count === 1 ? 'is' : 'are'} {step.count} contiguous subarray{step.count === 1 ? '' : 's'} with sum k = {target}.</p></div>}

      <section className="subarray-code-section">
        <div><span className="section-kicker">REFERENCE IMPLEMENTATION</span><h3>Python solution</h3><p>Compare each line with the state changes above.</p></div>
        <pre className="code-block"><code>{PYTHON_CODE}</code></pre>
        <button className="button secondary" type="button" onClick={async () => { try { await navigator.clipboard.writeText(PYTHON_CODE) } catch { /* Clipboard may be unavailable in this browser context. */ } }}>Copy Python code</button>
      </section>
    </section>
  )
}
