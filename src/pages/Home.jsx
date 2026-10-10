import { useState } from 'react'
import { topics } from '../data/topics.js'
import TopicCard from '../components/TopicCard.jsx'
import FindMaxLength from '../visualizations/FindMaxLength.jsx'

export default function Home() {
  const [activeTopic, setActiveTopic] = useState('arrays')
  const [showLesson, setShowLesson] = useState(true)

  function openTopic(topic) {
    setActiveTopic(topic.id)
    if (topic.id === 'arrays') {
      setShowLesson(true)
      window.setTimeout(() => document.getElementById('find-max-length')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } else {
      setShowLesson(false)
    }
  }

  const selectedTopic = topics.find((topic) => topic.id === activeTopic)

  return (
    <main className="site-shell">
      <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">∑</span> DSA <span>VISUAL LAB</span></a><a className="top-link" href="https://github.com" target="_blank" rel="noreferrer">Built for curious minds ↗</a></header>
      <section className="hero" id="top">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> LEARN BY SEEING</span><h1>Don't just memorize<br /><em>the algorithm.</em><br />See why it works.</h1><p>A visual playground for building DSA intuition, one step at a time. Explore the state, follow the decisions, and understand the why behind the code.</p><a className="button primary hero-button" href="#topics">Explore topics <span>↓</span></a></div>
        <div className="hero-art" aria-label="Illustration of an array and running prefix sums"><div className="art-label">RUNNING PREFIX SUM</div><div className="art-array">{[0,1,0,1,1,0].map((n,i)=><div key={i} className={`art-cell ${n===0?'art-zero':'art-one'}`}><small>{i}</small><strong>{n}</strong></div>)}</div><div className="art-connector">↓ &nbsp; −1 for 0 &nbsp; · &nbsp; +1 for 1</div><div className="art-sums"><span>−1</span><span>0</span><span>−1</span><span>0</span><span>1</span><span>0</span></div><div className="art-caption"><span className="art-pulse" /> A repeated sum reveals a balanced range</div></div>
      </section>
      <section className="topics-section" id="topics"><div className="section-heading"><div><span className="section-kicker">YOUR LEARNING MAP</span><h2>Explore by topic</h2><p>Pick a topic. Build the intuition. Then trace the code.</p></div><span className="topic-count">{topics.length} TOPICS</span></div><div className="topic-grid">{topics.map((topic)=><TopicCard key={topic.id} topic={topic} onOpen={()=>openTopic(topic)} />)}</div></section>
      {showLesson ? <FindMaxLength /> : <section className="panel coming-panel"><span className="section-kicker">{selectedTopic?.number} / {selectedTopic?.title.toUpperCase()}</span><h2>{selectedTopic?.title} visualizations are next.</h2><p>{selectedTopic?.description}</p><p className="coming-note">This is your growing learning lab. Add each new visualization as a separate component, then link it to its topic.</p><button className="button primary" onClick={()=>{setActiveTopic('arrays');setShowLesson(true)}}>Open the Arrays lesson</button></section>}
      <footer className="footer"><span>DSA VISUAL LAB</span><span>Understand the why. Remember the how.</span></footer>
    </main>
  )
}
