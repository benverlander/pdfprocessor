// components/PageGrid.jsx
export default function PageGrid({ files, selected, setSelected }) {
  const toggle = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const pages = files.flatMap(f => f.pages.filter(p => !p.hidden));

  return (
    <main className="page-grid">
      {pages.map(p => (
        <div key={p.id} className="thumb-box">
          <img src={p.img} alt="" width="160" height="210" />
          <input type="checkbox"
                 checked={selected.includes(p.id)}
                 onChange={() => toggle(p.id)} />
        </div>
      ))}
      {!pages.length && <p>No pages yet — upload a PDF.</p>}
    </main>
  );
}
