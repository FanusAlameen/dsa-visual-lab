export default function TopicCard({ topic, onOpen }) {
  const availableCount = topic.lessons.filter((lesson) => lesson.status === 'available').length
  return (
    <button className="topic-card" onClick={onOpen} type="button" aria-label={`Browse ${topic.title} problems`}>
      <div className="topic-card-top">
        <span className="topic-number">{topic.number}</span>
        <span className={availableCount ? 'status-pill active' : 'status-pill'}>{availableCount ? 'Ready to explore' : 'In the roadmap'}</span>
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div className="topic-card-bottom">
        <span>{topic.lessons.length} {topic.lessons.length === 1 ? 'problem' : 'problems'} in roadmap</span>
        <span aria-hidden="true">↗</span>
      </div>
    </button>
  )
}
