import React from "react";

export default function OutputBar({ tableData }) {
  if (!tableData) return null;

  const header = tableData.columns || [];
  const rows = tableData.rows || [];

  const toTSV = () => {
    const body = rows.map(r => r.join('\t')).join('\n');
    return [header.join('\t'), body].join('\n');
  };

  const copyToClipboard = () => {
    const text = toTSV();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="output-bar">
      <div className="output-header">
        <strong>{tableData.title || 'Table'}</strong>
        <button className="button" style={{width:'auto'}} onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>
      <table>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}