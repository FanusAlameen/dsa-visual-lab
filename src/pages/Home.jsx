import { useEffect, useState } from 'react'
import { topics } from '../data/topics.js'
import TopicCard from '../components/TopicCard.jsx'
import FindMaxLength from '../visualizations/FindMaxLength.jsx'

const BASE_PATH = '/dsa-visual-lab'
const LESSON_PATH = '/arrays/525-contiguous-array'

function readRoute() {
  const path = window.location.pathname.replace(/\\/$/, '')
  if (path.endsWith(LESSON_PATH)) return { topicId: 'arrays', lessonId: 'find-max-length' }
  const topic = topics.find((item) => path.endsWith('/' + item.id))
  if (topic) return { topicId: topic.id, lessonId: null }
  return { topicId: null, lessonId: null }
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}><span aria-hidden="true">{isDark ? '☀' : '☾'}</span> {isDark ? 'Light' : 'Dark'} mode</button>
}

export default function Home() {
  const [route, setRoute] = useState(readRoute)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('dsa-visual-lab-theme') || 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    const onPopState = () => setRoute(readRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('dsa-visual-lab-theme', theme) } catch { /* optional persistence */ }
  }, [theme])

  const selectedTopic = topics.find((topic) => topic.id === route.topicId)
  const selectedLesson = selectedTopic?.lessons.find((lesson) => lesson.id === route.lessonId)

  function navigate(path, nextRoute) {
    window.history.pushState({}, '', `${BASE_PATH}${path}`)
    setRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function goHome() { navigate('/', { topicId: null, lessonId: null }) }
  function openTopic(topic) { navigate('/' + topic.id, { topicId: topic.id, lessonId: null }) }
  function openLesson(lesson) { if (lesson.status === 'available') navigate(lesson.path, { topicId: 'arrays', lessonId: lesson.id }) }

  return (
    <main className="site-shell" id="top">
      <header className="topbar">
        <button className="brand brand-button" type="button" onClick={goHome} aria-label="DSA Visual Lab home"><span className="brand-mark">∑</span><span className="brand-main">DSA</span><span className="brand-subtitle">VISUAL LAB</span></button>
        <div className="topbar-actions"><a className="top-link" href="https://github.com/FanusAlameen/dsa-visual-lab" target="_blank" rel="noreferrer">View on GitHub ↗</a><ThemeToggle theme={theme} onToggle={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} /></div>
      </header>

      {!selectedTopic && <>
        <section className="hero">
          <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> LEARN BY SEEING</span><h1>Don't just memorize<br /><em>the algorithm.</em><br />See why it works.</h1><p>A visual playground for building DSA intuition, one step at a time. Explore the state, follow the decisions, and understand the why behind the code.</p><a className="button primary hero-button" href="#topics">Explore topics <span>↓</span></a></div>
          <div className="hero-art" aria-label="Illustration of an array and running prefix sums"><div className="art-label">RUNNING PREFIX SUM</div><div className="art-array">{[0,1,0,1,1,0].map((n,i)=><div key={i} className={`art-cell ${n===0?'art-zero':'art-one'}`}><small>{i}</small><strong>{n}</strong></div>)}</div><div className="art-connector">↓ &nbsp; −1 for 0 &nbsp; · &nbsp; +1 for 1</div><div className="art-sums"><span>−1</span><span>0</span><span>−1</span><span>0</span><span>1</span><span>0</span></div><div className="art-caption"><span className="art-pulse" /> A repeated sum reveals a balanced range</div></div>
        </section>
        <section className="topics-section" id="topics"><div className="section-heading"><div><span className="section-kicker">YOUR LEARNING MAP</span><h2>Explore by topic</h2><p>Choose a topic to browse its problems. Open a lesson when you're ready to dry-run it.</p></div><span className="topic-count">{topics.length} TOPICS</span></div><div className="topic-grid">{topics.map((topic)=><TopicCard key={topic.id} topic={topic} onOpen={()=>openTopic(topic)} />)}</div></section>
      </>}

      {selectedTopic && !selectedLesson && <section className="library-view">
        <button className="back-link" type="button" onClick={goHome}>← All topics</button>
        <div className="library-heading"><span className="section-kicker">TOPIC {selectedTopic.number}</span><h1>{selectedTopic.title}</h1><p>{selectedTopic.description}</p></div>
        <div className="lesson-list-heading"><div><h2>Problems & visualizations</h2><p>Select an available lesson to open its interactive dry run.</p></div><span className="topic-count">{selectedTopic.lessons.filter((lesson)=>lesson.status==='available').length} AVAILABLE</span></div>
        <div className="lesson-list">{selectedTopic.lessons.map((lesson,index)=><article className="lesson-card" key={lesson.id}><div className="lesson-number">{String(index+1).padStart(2,'0')}</div><div className="lesson-copy"><div className="lesson-meta"><span className="lesson-status lesson-status-available">Interactive</span>{lesson.difficulty && <span className="difficulty-label">{lesson.difficulty}</span>}</div><h3>{lesson.title}</h3><p>{lesson.description}</p></div><button className="button primary lesson-open-button" type="button" onClick={()=>openLesson(lesson)}>Open dry run →</button></article>)}</div>
        <p className="library-footnote">New problems will appear here as their interactive walkthroughs are added.</p>
      </section>}

      {selectedTopic && selectedLesson && <section className="lesson-view">
        <div className="breadcrumbs"><button type="button" onClick={goHome}>All topics</button><span>/</span><button type="button" onClick={()=>navigate('/arrays',{topicId:'arrays',lessonId:null})}>Arrays</button><span>/</span><span>{selectedLesson.title}</span></div>
        <div className="lesson-intro"><div><span className="section-kicker">LEETCODE 525 · MEDIUM</span><h1>{selectedLesson.title}</h1><p>Longest contiguous subarray with equal numbers of 0s and 1s.</p></div><a className="button secondary" href={selectedLesson.leetcodeUrl} target="_blank" rel="noreferrer">View on LeetCode ↗</a></div>
        <p className="shareable-url">Shareable lesson URL: <a href={window.location.href}>{window.location.href}</a> <button type="button" className="copy-link-button" onClick={()=>navigator.clipboard?.writeText(window.location.href)}>Copy link</button></p>
        <FindMaxLength leetcodeUrl={selectedLesson.leetcodeUrl} />
        <button className="back-link lesson-back-link" type="button" onClick={()=>navigate('/arrays',{topicId:'arrays',lessonId:null})}>← Back to Arrays problems</button>
      </section>}

      <footer className="footer"><span>DSA VISUAL LAB</span><span>Understand the why. Remember the how.</span></footer>
    </main>
  )
}
