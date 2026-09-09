const STATUS_CLASS = {
  Draft: 'status-draft',
  Configured: 'status-configured',
  Captured: 'status-captured',
  'Schema Ready': 'status-schema',
  'Mock Ready': 'status-mock',
  Active: 'status-active',
}

function StatusBadge({ status }) {
  const className = STATUS_CLASS[status] || 'status-draft'

  return <span className={`status-badge ${className}`}>{status}</span>
}

export default StatusBadge
