// One toggleable fault section (delay, error, malformed response, rate
// limit). Renders its own enable switch and whatever fields are passed in.
function FaultConfigCard({ title, description, enabled, onToggle, children }) {
  return (
    <div className="fault-card">
      <div className="fault-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <label className="fault-toggle">
          <input type="checkbox" checked={!!enabled} onChange={(e) => onToggle(e.target.checked)} />
          <span className="fault-toggle-slider" />
        </label>
      </div>

      {enabled && children && <div className="fault-card-fields">{children}</div>}
    </div>
  )
}

export default FaultConfigCard
