// components/Sidebar.jsx
import { v4 as uuid } from "uuid";

export default function Sidebar({ files, setFiles }) {
  const upload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res   = await fetch("http://localhost:5000/api/upload", { method: "POST", body: form });
    const json  = await res.json();

    const id = uuid();
    const pages = json.thumbnails.map(url => ({ id: uuid(), img: url, hidden: false }));
    setFiles(f => [...f, { id, name: json.name, pages }]);
  };

  return (
    <aside className="sidebar">
      <h3>Uploads</h3>
      <input type="file" accept="application/pdf" onChange={upload} />
      <ul style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        {files.map(f => <li key={f.id}>{f.name}</li>)}
      </ul>
    </aside>
  );
}
