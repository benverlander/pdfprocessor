export default function ActionPanel({ onHide, onCallGpt, disabled, thumbWidth, setThumbWidth}) {
  return (
    <aside className="action">
        <label style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
            Page size: {thumbWidth}px
            <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={thumbWidth}
                onChange={(e) => {
                    const v = Number(e.target.value);
                    console.log("slider ->", v);   // <— watch this in DevTools console
                    setThumbWidth(v);
                    }}
                style={{width: "100%"}}
    
            />
        </label>  
      <button className="button button-blue" onClick={onCallGpt} disabled={disabled}>
        Call GPT
      </button>
      <button className="button button-ylw" onClick={onHide} disabled={disabled}>
        Hide
      </button>
    </aside>
  );
}
