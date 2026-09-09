function valueType(value) {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'null'
  return typeof value
}

// Recursively renders a JSON object as a nested field/type tree.
function SchemaTree({ data }) {
  return (
    <ul className="schema-tree">
      {Object.entries(data).map(([key, value]) => (
        <SchemaField key={key} name={key} value={value} />
      ))}
    </ul>
  )
}

function SchemaField({ name, value }) {
  const type = valueType(value)
  const isExpandable = type === 'object' || type === 'array'

  return (
    <li className="schema-field">
      <div className="schema-field-row">
        <span className="schema-field-name">{name}</span>
        <span className="schema-field-type">
          {type === 'array' ? `array<${valueType(value[0])}>` : type}
        </span>
      </div>

      {isExpandable && type === 'object' && (
        <ul className="schema-tree schema-tree-nested">
          {Object.entries(value).map(([key, val]) => (
            <SchemaField key={key} name={key} value={val} />
          ))}
        </ul>
      )}

      {type === 'array' && typeof value[0] === 'object' && value[0] !== null && (
        <ul className="schema-tree schema-tree-nested">
          {Object.entries(value[0]).map(([key, val]) => (
            <SchemaField key={key} name={key} value={val} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default SchemaTree
