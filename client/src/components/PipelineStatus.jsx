const PIPELINE_STEPS = ['Configured', 'Captured', 'Schema Ready', 'Mock Ready']

// Shows how far a project has moved through the capture -> schema -> mock
// pipeline. "Active" counts as having completed every step.
function PipelineStatus({ status }) {
  const currentIndex =
    status === 'Active' ? PIPELINE_STEPS.length - 1 : PIPELINE_STEPS.indexOf(status)

  return (
    <div className="pipeline-status">
      {PIPELINE_STEPS.map((step, index) => {
        const isDone = index <= currentIndex
        return (
          <div key={step} className="pipeline-step">
            <div className={`pipeline-dot ${isDone ? 'pipeline-dot-done' : ''}`} />
            <span className={isDone ? 'pipeline-label-done' : 'pipeline-label'}>{step}</span>
            {index < PIPELINE_STEPS.length - 1 && (
              <div className={`pipeline-line ${isDone ? 'pipeline-line-done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PipelineStatus
