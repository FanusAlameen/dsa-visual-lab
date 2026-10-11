import { useMemo, useState } from 'react'
import './IntervalsVisualizations.css'

const DEFAULT_INTERVALS = '1,2; 2,3; 1,3; 3,4'
const PYTHON_CODE = `class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[1])

        remove = 0
        end = -100000

        for interval in intervals:
            if interval[0] >= end:
                end = interval[1]
            else:
                remove += 1
        return remove`

function parseIntervals(value) {
  const rows = value.split(';').map((part) => part.trim()).filter(Boolean)
  if (!rows.length) throw new Error('Enter intervals like: 1,2; 2,3; 1,3; 3,4')
  return rows.map((row) => {
    const parts = row.split(/[ ,]+/).filter(Boolean).map(Number)
    if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n)) || parts[0] > parts[1]) {
      throw new Error('Each interval must have two numbers in start,end order. Example: 1,2; 2,3; 1,3')
    }
    return parts
  })
}

function makeTrace(input) {
  const sorted = input.map((interval, originalIndex) => ({ interval: [...interval], originalIndex }))
    .sort((a, b) => a.interval[1] - b.interval[1])
  const trace = [{
    kind: 'sort', index: -1, sorted, remove: 0, end: -100000, kept: [], removed: [],
    title: 'Sort intervals by end time',
    explanation: 'The earliest finishing interval leaves the most room for future intervals. Greedily keeping it is the key idea: it maximizes how much time remains available.',
    code: 'intervals.sort(key=lambda x: x[1])',
  }]
  let end = -100000
  let remove = 0
  const kept = []
  const removed = []
  sorted.forEach(({ interval, originalIndex }, index) => {
    if (interval[0] >= end) {
      end = interval[1]
      kept.push([...interval])
      trace.push({
        kind: 'keep', index, sorted, interval: [...interval], originalIndex, remove, end, kept: kept.map((x) => [...x]), removed: removed.map((x) => [...x]),
        title: 'Keep this interval',
        explanation: `Its start ${interval[0]} is greater than or equal to the end of the last kept interval (${end === interval[1] ? (kept.length > 1 ? kept[kept.length - 2][1] : -100000) : end}). It does not overlap the last kept interval, so keep it and update end to ${interval[1]}.`,
        code: 'if interval[0] >= end: end = interval[1]',
      })
    } else {
      remove += 1
      removed.push([...interval])
      trace.push({
        kind: 'remove', index, sorted, interval: [...interval], originalIndex, remove, end, kept: kept.map((x) => [...x]), removed: removed.map((x) => [...x]),
        title: 'Remove this interval',
        explanation: `It starts at ${interval[0]}, before the last kept interval ends at ${end}. They overlap. Since intervals are sorted by end time, keeping the earlier-ending interval is the greedy choice; count this one for removal.`,
        code: 'else: remove += 1',
      })
    }
  })
  trace.push({
    kind: 'done', index: sorted.length, sorted, remove, end, kept: kept.map((x) => [...x]), removed: removed.map((x) => [...x]),
    title: 'Return the minimum number of removals',
    explanation: `The greedy scan kept ${kept.length} mutually non-overlapping intervals and removed ${remove}.`,
    code: 'return remove',
  })
  return trace
}

function IntervalPills({ intervals, activeIndex = -1, sortedItems = null, removed = false }) {
  if (!intervals.length) return <p className="iv-empty">None yet</p>
  return <div className="iv-interval-row">{intervals.map((interval, index) => {
    const isActive = sortedItems ? sortedItems[index]?.originalIndex === activeIndex : index === activeIndex
    return <div className={`iv-interval ${isActive ? 'is-active' : ''} ${removed ? 'is-removed' : ''}`} key={`${interval[0]}-${interval[1]}-${index}`}>
      <span className="iv-endpoint">{interval[0]}</span><span className="iv-range-line" aria-hidden="true" /><span className="iv-endpoint">{interval[1]}</span><small>[{interval[0]}, {interval[1]}]</small>
    </div>
  } )}</div>
}

export default function NonOverlappingIntervals() {
  const [intervalText, setIntervalText] = useState(DEFAULT_INTERVALS)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const parsed = useMemo(() => {
    try { return { intervals: parseIntervals(intervalText), error: '' } }
    catch (err) { return { intervals: [], error: err.message } }
  }, [intervalText])
  const trace = useMemo(() => parsed.error ? [] : makeTrace(parsed.intervals), [parsed])
  const stepIndex = Math.min(activeStep, Math.max(0, trace.length - 1))
  const step = trace[stepIndex]

  function load() {
    if (parsed.error) { setError(parsed.error); return }
    setError('')
    setActiveStep(0)
  }
  async function copyCode() {
    try { await navigator.clipboard.writeText(PYTHON_CODE); setError('Python solution copied.') }
    catch { setError('Copy was unavailable in this browser. You can select and copy the code below.') }
  }

  return (
    <section className="visualizer panel iv-visualizer">
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · GREEDY + INTERVALS</div>
      <div className="visualizer-heading">
        <div><h2>435. Non-overlapping Intervals</h2><p>Find the minimum number of intervals to remove so the rest do not overlap.</p></div>
        <div className="visualizer-links"><span className="complexity-chip">O(n log n) time · O(n) space for trace</span><a className="button secondary" href="https://leetcode.com/problems/non-overlapping-intervals/" target="_blank" rel="noreferrer">LeetCode 435 ↗</a></div>
      </div>

      <div className="iv-input-panel">
        <label htmlFor="non-overlap-intervals">Your intervals</label>
        <input id="non-overlap-intervals" value={intervalText} onChange={(event) => setIntervalText(event.target.value)} placeholder="1,2; 2,3; 1,3; 3,4" />
        <small>Enter any intervals separated by semicolons. The visualizer will show the sort-by-end step first.</small>
        <button className="button secondary" type="button" onClick={load}>Load example</button>
        {(error || parsed.error) && <p className="iv-error" role="alert">{error || parsed.error}</p>}
      </div>

      {!parsed.error && step && <>
        <div className="iv-state-grid">
          <div className="iv-state-card"><span>Current interval</span><strong>{step.interval ? `[${step.interval.join(', ')}]` : '—'}</strong></div>
          <div className="iv-state-card"><span>End of last kept interval</span><strong>{step.end === -100000 ? 'None yet' : step.end}</strong></div>
          <div className="iv-state-card iv-state-highlight"><span>Intervals to remove</span><strong>{step.remove}</strong></div>
        </div>
        <div className="iv-visual-section">
          <div className="iv-section-heading"><h3>Sorted by end time</h3><span>Step {stepIndex + 1} of {trace.length}</span></div>
          <p className="iv-helper">We sort first so each kept interval finishes as early as possible, leaving maximum room for the remaining intervals.</p>
          <IntervalPills intervals={step.sorted.map((item) => item.interval)} activeIndex={step.interval ? step.originalIndex : -1} sortedItems={step.sorted} />
          <div className={`iv-explanation iv-kind-${step.kind}`}><span className="iv-decision-icon">{step.kind === 'keep' ? '✓' : step.kind === 'remove' ? '×' : step.kind === 'done' ? '✓' : '↕'}</span><div><span className="section-kicker">GREEDY DECISION</span><h3>{step.title}</h3><p>{step.explanation}</p><code>{step.code}</code></div></div>
          <div className="iv-two-columns">
            <div className="iv-result-block"><div className="iv-section-heading"><h3>Kept</h3><span>{step.kept.length}</span></div><IntervalPills intervals={step.kept} /></div>
            <div className="iv-result-block"><div className="iv-section-heading"><h3>Removed</h3><span>{step.removed.length}</span></div><IntervalPills intervals={step.removed} removed /></div>
          </div>
        </div>
        <div className="step-controls"><button className="button secondary" type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>← Previous</button><div className="step-progress" aria-label={`Step ${stepIndex + 1} of ${trace.length}`}><div style={{ width: `${((stepIndex + 1) / trace.length) * 100}%` }} /></div><button className="button primary" type="button" onClick={() => setActiveStep((current) => Math.min(trace.length - 1, current + 1))} disabled={stepIndex === trace.length - 1}>Next step →</button></div>
        <button className="reset-button" type="button" onClick={() => setActiveStep(0)}>Reset walkthrough</button>
        {step.kind === 'done' && <div className="iv-final-answer"><span>Minimum removals</span><strong>{step.remove}</strong><p>Remove {step.remove} interval{step.remove === 1 ? '' : 's'} to leave a non-overlapping set. The greedy choice keeps intervals that finish earliest.</p></div>}
      </>}

      <details className="iv-code-details"><summary>View Python solution</summary><pre><code>{PYTHON_CODE}</code></pre><button className="button secondary" type="button" onClick={copyCode}>Copy Python code</button></details>
      <p className="iv-footnote">The algorithm sorts the input list in place by end time. The sentinel end = -100000 is safe for the usual LeetCode constraints; conceptually, it means no interval has been kept yet.</p>
    </section>
  )
}
