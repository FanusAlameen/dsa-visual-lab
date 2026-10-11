import { useMemo, useState } from 'react'
import './IntervalsVisualizations.css'

const DEFAULT_INTERVALS = '1,3; 6,9'
const DEFAULT_NEW_INTERVAL = '2,5'
const PYTHON_CODE = `class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []

        for interval in intervals:
            if newInterval[1] < interval[0]:
                result.append(newInterval)
                newInterval = interval
            elif interval[1] < newInterval[0]:
                result.append(interval)
            else:
                newInterval[0] = min(newInterval[0], interval[0])
                newInterval[1] = max(newInterval[1], interval[1])

        result.append(newInterval)
        return result`

function parseIntervals(value) {
  const rows = value.split(';').map((part) => part.trim()).filter(Boolean)
  if (!rows.length) throw new Error('Enter at least one interval, for example: 1,3; 6,9')
  const intervals = rows.map((row) => {
    const parts = row.split(/[ ,]+/).filter(Boolean).map(Number)
    if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n)) || parts[0] > parts[1]) {
      throw new Error('Each interval must have two numbers in start,end order, separated by a comma. Example: 1,3; 6,9')
    }
    return parts
  })
  for (let i = 1; i < intervals.length; i += 1) {
    if (intervals[i][0] < intervals[i - 1][0]) {
      throw new Error('Intervals must already be sorted by start time, as required by this solution.')
    }
    if (intervals[i][0] <= intervals[i - 1][1]) {
      throw new Error('The original intervals must be sorted and non-overlapping.')
    }
  }
  return intervals
}

function makeTrace(intervals, newInterval) {
  const result = []
  let currentNew = [...newInterval]
  const trace = [{
    kind: 'start', index: -1, result: [], newInterval: [...currentNew], interval: null,
    title: 'Start with an empty result',
    explanation: 'The original intervals are sorted and non-overlapping. We compare each one with the interval we need to insert.',
    code: 'result = []',
  }]

  intervals.forEach((interval, index) => {
    const current = [...interval]
    if (currentNew[1] < current[0]) {
      result.push([...currentNew])
      const previousNew = [...currentNew]
      currentNew = current
      trace.push({
        kind: 'before', index, interval: current, result: result.map((x) => [...x]), newInterval: [...currentNew], previousNew,
        title: 'The new interval belongs before this one',
        explanation: `The new interval ends at ${previousNew[1]}, before [${current[0]}, ${current[1]}] starts at ${current[0]}. Append the new interval, then keep this interval as the one to insert later.`,
        code: 'if newInterval[1] < interval[0]: result.append(newInterval); newInterval = interval',
      })
    } else if (current[1] < currentNew[0]) {
      result.push(current)
      trace.push({
        kind: 'after', index, interval: current, result: result.map((x) => [...x]), newInterval: [...currentNew],
        title: 'This interval is completely before the new one',
        explanation: `[${current[0]}, ${current[1]}] ends before the current new interval starts at ${currentNew[0]}. It cannot overlap, so append it unchanged.`,
        code: 'elif interval[1] < newInterval[0]: result.append(interval)',
      })
    } else {
      const before = [...currentNew]
      currentNew = [Math.min(currentNew[0], current[0]), Math.max(currentNew[1], current[1])]
      trace.push({
        kind: 'merge', index, interval: current, result: result.map((x) => [...x]), newInterval: [...currentNew], previousNew: before,
        title: 'These intervals overlap — merge them',
        explanation: `Their ranges overlap. Expand the start to min(${before[0]}, ${current[0]}) and the end to max(${before[1]}, ${current[1]}), giving [${currentNew[0]}, ${currentNew[1]}].`,
        code: 'newInterval[0] = min(newInterval[0], interval[0]); newInterval[1] = max(newInterval[1], interval[1])',
      })
    }
  })
  result.push([...currentNew])
  trace.push({
    kind: 'done', index: intervals.length, interval: null, result: result.map((x) => [...x]), newInterval: [...currentNew],
    title: 'Append the final interval',
    explanation: 'After every original interval has been processed, append the current new/merged interval. The result is sorted and non-overlapping.',
    code: 'result.append(newInterval); return result',
  })
  return trace
}

function IntervalPills({ intervals, active, emptyText = 'No intervals yet' }) {
  if (!intervals.length) return <p className="iv-empty">{emptyText}</p>
  return <div className="iv-interval-row">{intervals.map(([start, end], index) => (
    <div className={`iv-interval ${active === index ? 'is-active' : ''}`} key={`${start}-${end}-${index}`}>
      <span className="iv-endpoint">{start}</span><span className="iv-range-line" aria-hidden="true" /><span className="iv-endpoint">{end}</span>
      <small>[{start}, {end}]</small>
    </div>
  ))}</div>
}

export default function InsertInterval() {
  const [intervalText, setIntervalText] = useState(DEFAULT_INTERVALS)
  const [newText, setNewText] = useState(DEFAULT_NEW_INTERVAL)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const parsed = useMemo(() => {
    try {
      const intervals = parseIntervals(intervalText)
      const values = newText.split(/[ ,]+/).filter(Boolean).map(Number)
      if (values.length !== 2 || values.some((n) => !Number.isFinite(n)) || values[0] > values[1]) throw new Error('New interval must contain two numbers in start,end order. Example: 2,5')
      return { intervals, newInterval: values, error: '' }
    } catch (err) {
      return { intervals: [], newInterval: [], error: err.message }
    }
  }, [intervalText, newText])
  const trace = useMemo(() => parsed.error ? [] : makeTrace(parsed.intervals, parsed.newInterval), [parsed])
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
      <div className="section-kicker">INTERACTIVE WALKTHROUGH · INTERVALS</div>
      <div className="visualizer-heading">
        <div><h2>57. Insert Interval</h2><p>Place a new interval in a sorted list, merging overlaps without disturbing the order.</p></div>
        <div className="visualizer-links"><span className="complexity-chip">O(n) time · O(n) space</span><a className="button secondary" href="https://leetcode.com/problems/insert-interval/" target="_blank" rel="noreferrer">LeetCode 57 ↗</a></div>
      </div>

      <div className="iv-input-panel">
        <label htmlFor="insert-intervals">Existing intervals</label>
        <input id="insert-intervals" value={intervalText} onChange={(event) => setIntervalText(event.target.value)} placeholder="1,3; 6,9" />
        <small>Enter sorted, non-overlapping intervals separated by semicolons, e.g. 1,3; 6,9; 12,16.</small>
        <label htmlFor="insert-new-interval">New interval [start, end]</label>
        <input id="insert-new-interval" value={newText} onChange={(event) => setNewText(event.target.value)} placeholder="2,5" />
        <button className="button secondary" type="button" onClick={load}>Load example</button>
        {(error || parsed.error) && <p className="iv-error" role="alert">{error || parsed.error}</p>}
      </div>

      {!parsed.error && step && <>
        <div className="iv-state-grid">
          <div className="iv-state-card"><span>Current original interval</span><strong>{step.interval ? `[${step.interval.join(', ')}]` : '—'}</strong></div>
          <div className="iv-state-card iv-state-highlight"><span>New / merged interval</span><strong>[{step.newInterval.join(', ')}]</strong></div>
          <div className="iv-state-card"><span>Intervals in result</span><strong>{step.result.length}</strong></div>
        </div>
        <div className="iv-visual-section">
          <div className="iv-section-heading"><h3>Current decision</h3><span>Step {stepIndex + 1} of {trace.length}</span></div>
          <div className="iv-timeline-row"><div><span className="iv-label">Original intervals</span><IntervalPills intervals={parsed.intervals} active={step.index >= 0 && step.index < parsed.intervals.length ? step.index : -1} /></div><div><span className="iv-label">New interval being carried forward</span><IntervalPills intervals={[step.newInterval]} /></div></div>
          <div className={`iv-explanation iv-kind-${step.kind}`}><span className="iv-decision-icon">{step.kind === 'merge' ? '↔' : step.kind === 'done' ? '✓' : step.kind === 'start' ? '◎' : '→'}</span><div><span className="section-kicker">WHY THIS BRANCH?</span><h3>{step.title}</h3><p>{step.explanation}</p><code>{step.code}</code></div></div>
          <div className="iv-result-block"><div className="iv-section-heading"><h3>Result so far</h3><span>{step.result.length} interval(s)</span></div><IntervalPills intervals={step.result} /></div>
        </div>
        <div className="step-controls"><button className="button secondary" type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>← Previous</button><div className="step-progress" aria-label={`Step ${stepIndex + 1} of ${trace.length}`}><div style={{ width: `${((stepIndex + 1) / trace.length) * 100}%` }} /></div><button className="button primary" type="button" onClick={() => setActiveStep((current) => Math.min(trace.length - 1, current + 1))} disabled={stepIndex === trace.length - 1}>Next step →</button></div>
        <button className="reset-button" type="button" onClick={() => setActiveStep(0)}>Reset walkthrough</button>
        {step.kind === 'done' && <div className="iv-final-answer"><span>Final merged intervals</span><div className="iv-final-pills"><IntervalPills intervals={step.result} /></div><p>Every original interval is preserved, and the new interval is inserted in the correct position after merging any overlaps.</p></div>}
      </>}

      <details className="iv-code-details"><summary>View Python solution</summary><pre><code>{PYTHON_CODE}</code></pre><button className="button secondary" type="button" onClick={copyCode}>Copy Python code</button></details>
      <p className="iv-footnote">Important: this implementation expects the original intervals to be sorted by start and non-overlapping. Touching endpoints are treated as overlapping because the comparisons use strict less-than.</p>
    </section>
  )
}
