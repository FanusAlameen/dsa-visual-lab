export default function TopicCard({ topic, onOpen }) {
  return (
    <button className="topic-card" onClick={onOpen}>
      <div className="topic-card-top">
        <span className="topic-number">{topic.number}</span>
        <span className={topic.lessons.length ? 'status-pill active' : 'status-pill'}>{topic.status}</span>
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div className="topic-card-bottom">
        <span>{topic.lessons.length ? `${topic.lessons.length} lesson` : 'Lessons planned'}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </button>
  )
}
