import { useEffect, useState } from 'react'
import { topics } from '../data/topics.js'
import TopicCard from '../components/TopicCard.jsx'
import FindMaxLength from '../visualizations/FindMaxLength.jsx'
import SubarraySumEqualsK from '../visualizations/SubarraySumEqualsK.jsx'

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      <span className="theme-toggle-icon" aria-hidden="true">{isDark ? '☀' : '☾'}</span>
      <span className="theme-toggle-label">{isDark ? 'Light' : 'Dark'} mode</span>
    </button>
  )
}

export default function Home() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('dsa-visual-lab-theme') || 'light' } catch { return 'light' }
  })
  const [activeTopicId, setActiveTopicId] = useState(null)
  const [activeLessonId, setActiveLessonId] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('dsa-visual-lab-theme', theme) } catch { /* Theme still works for this session. */ }
  }, [theme])

  const selectedTopic = topics.find((topic) => topic.id === activeTopicId)
  const selectedLesson = selectedTopic?.lessons.find((lesson) => lesson.id === activeLessonId)

  function openTopic(topic) {
    setActiveTopicId(topic.id)
    setActiveLessonId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openLesson(lesson) {
    if (lesson.status !== 'available') return
    setActiveLessonId(lesson.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function goHome() {
    setActiveTopicId(null)
    setActiveLessonId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function goToTopic() {
    setActiveLessonId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="site-shell" id="top">
      <header className="topbar">
        <button className="brand brand-button" type="button" onClick={goHome} aria-label="DSA Visual Lab home">
          <span className="brand-mark">∑</span><span className="brand-main">DSA</span><span className="brand-subtitle">VISUAL LAB</span>
        </button>
        <div className="topbar-actions">
          <a className="top-link" href="https://github.com/fanusalameen/dsa-visual-lab" target="_blank" rel="noreferrer">View on GitHub ↗</a>
          <ThemeToggle theme={theme} onToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
        </div>
      </header>

      {!selectedTopic && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> LEARN BY SEEING</span>
              <h1>Don't just memorize<br /><em>the algorithm.</em><br />See why it works.</h1>
              <p>A visual playground for building DSA intuition, one step at a time. Explore the state, follow the decisions, and understand the why behind the code.</p>
              <a className="button primary hero-button" href="#topics">Explore topics <span>↓</span></a>
            </div>
            <div className="hero-art" aria-label="Illustration of an array and running prefix sums">
              <div className="art-label">RUNNING PREFIX SUM</div>
              <div className="art-array">{[0, 1, 0, 1, 1, 0].map((n, i) => <div key={i} className={`art-cell ${n === 0 ? 'art-zero' : 'art-one'}`}><small>{i}</small><strong>{n}</strong></div>)}</div>
              <div className="art-connector">↓ &nbsp; −1 for 0 &nbsp; · &nbsp; +1 for 1</div>
              <div className="art-sums"><span>−1</span><span>0</span><span>−1</span><span>0</span><span>1</span><span>0</span></div>
              <div className="art-caption"><span className="art-pulse" /> A repeated sum reveals a balanced range</div>
            </div>
          </section>
          <section className="topics-section" id="topics">
            <div className="section-heading"><div><span className="section-kicker">YOUR LEARNING MAP</span><h2>Explore by topic</h2><p>Choose a topic to browse its problems. Open a lesson when you're ready to dry-run it.</p></div><span className="topic-count">{topics.length} TOPICS</span></div>
            <div className="topic-grid">{topics.map((topic) => <TopicCard key={topic.id} topic={topic} onOpen={() => openTopic(topic)} />)}</div>
          </section>
        </>
      )}

      {selectedTopic && !selectedLesson && (
        <section className="library-view">
          <button className="back-link" type="button" onClick={goHome}>← All topics</button>
          <div className="library-heading"><span className="section-kicker">TOPIC {selectedTopic.number}</span><h1>{selectedTopic.title}</h1><p>{selectedTopic.description}</p></div>
          <div className="lesson-list-heading"><div><h2>Problems & visualizations</h2><p>Select an available lesson to open its interactive dry run.</p></div><span className="topic-count">{selectedTopic.lessons.filter((lesson) => lesson.status === 'available').length} AVAILABLE</span></div>
          <div className="lesson-list">
            {selectedTopic.lessons.map((lesson, index) => (
              <article className={`lesson-card ${lesson.status !== 'available' ? 'lesson-card-disabled' : ''}`} key={lesson.id}>
                <div className="lesson-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="lesson-copy"><div className="lesson-meta"><span className={`lesson-status ${lesson.status === 'available' ? 'lesson-status-available' : ''}`}>{lesson.status === 'available' ? 'Interactive' : 'Coming soon'}</span>{lesson.difficulty && <span className="difficulty-label">{lesson.difficulty}</span>}</div><h3>{lesson.title}</h3><p>{lesson.description}</p></div>
                <button className={`button ${lesson.status === 'available' ? 'primary' : 'secondary'} lesson-open-button`} type="button" onClick={() => openLesson(lesson)} disabled={lesson.status !== 'available'}>{lesson.status === 'available' ? <>Open dry run <span aria-hidden="true">→</span></> : 'Planned'}</button>
              </article>
            ))}
          </div>
          <p className="library-footnote">New problems will appear here as their interactive walkthroughs are added.</p>
        </section>
      )}

      {selectedTopic && selectedLesson && (
        <section className="lesson-view">
          <div className="breadcrumbs"><button type="button" onClick={goHome}>All topics</button><span>/</span><button type="button" onClick={goToTopic}>{selectedTopic.title}</button><span>/</span><span>{selectedLesson.title}</span></div>
          {selectedLesson.id === 'find-max-length' ? <FindMaxLength /> : selectedLesson.id === 'subarray-sum' ? <SubarraySumEqualsK /> : <div className="panel"><h2>Lesson not found</h2><button className="button primary" onClick={goToTopic}>Back to problems</button></div>}
          <button className="back-link lesson-back-link" type="button" onClick={goToTopic}>← Back to {selectedTopic.title} problems</button>
        </section>
      )}
      <footer className="footer"><span>DSA VISUAL LAB</span><span>Understand the why. Remember the how.</span></footer>
    </main>
  )
}
