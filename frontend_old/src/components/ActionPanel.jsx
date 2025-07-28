// components/ActionPanel.jsx
export default function ActionPanel({ onHide, onCallGpt, disabled }) {
  return (
    <aside className="action">
      <button className="button button-blue" onClick={onCallGpt} disabled={disabled}>
        Call GPT
      </button>
      <button className="button button-ylw" onClick={onHide} disabled={disabled}>
        Hide
      </button>
    </aside>
  );
}
