function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  })
}

// Renders as a table on wider screens and stacked cards on mobile, using
// the same markup — the reflow is handled entirely in CSS.
function RequestLogTable({ logs }) {
  return (
    <div className="log-table">
      <div className="log-row log-row-head">
        <span>Time</span>
        <span>Method</span>
        <span>Path</span>
        <span>Status</span>
        <span>Response Time</span>
        <span>Fault</span>
      </div>

      {logs.map((log) => (
        <div className="log-row" key={log.id}>
          <span data-label="Time">{formatTime(log.timestamp)}</span>
          <span data-label="Method">{log.method}</span>
          <span data-label="Path">{log.path}</span>
          <span data-label="Status" className={log.statusCode >= 400 ? 'log-status-error' : ''}>
            {log.statusCode}
          </span>
          <span data-label="Response Time">{log.responseTime} ms</span>
          <span data-label="Fault">{log.faultApplied ? 'Yes' : 'No'}</span>
        </div>
      ))}
    </div>
  )
}

export default RequestLogTable
