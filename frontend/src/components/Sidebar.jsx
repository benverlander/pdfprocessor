import { useState } from "react";

export default function Sidebar({
  files,
  setFiles,
  groups,
  addGroup,
  activeGroupId,
  setActiveGroupId,
  moveFileToGroup,
}) {
  const [newGroupName, setNewGroupName] = useState("");

  const createGroup = (e) => {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;
    addGroup(name);
    setNewGroupName("");
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res  = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: form,
    });
    const json = await res.json();

    const fileId = crypto.randomUUID();
    const pages = json.thumbnails.map(url => ({
      id: crypto.randomUUID(),
      img: url,
      hidden: false,
    }));

    setFiles(f => [...f, {
      id: fileId,
      name: json.name,
      pages,
      groupId: activeGroupId,   // <-- put it into the currently selected group
    }]);
  };

  const filesInActiveGroup = activeGroupId
    ? files.filter(f => f.groupId === activeGroupId)
    : files;

  return (
    <aside className="sidebar">
      <h3>Groups</h3>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        <button
          onClick={() => setActiveGroupId(null)}
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            border: "1px solid #ccc",
            background: activeGroupId === null ? "#ddd" : "#fff",
            cursor: "pointer",
          }}
        >
          All
        </button>
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGroupId(g.id)}
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: activeGroupId === g.id ? "#ddd" : "#fff",
              cursor: "pointer",
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <form onSubmit={createGroup} style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          style={{ width: "100%", marginBottom: 4 }}
        />
        <button type="submit" className="button" style={{ background: "#eee" }}>
          + Add Group
        </button>
      </form>

      <hr style={{ margin: "8px 0 12px" }} />

      <h3>Uploads</h3>
      <input type="file" accept="application/pdf" onChange={upload} />

      <ul style={{ marginTop: "1rem", fontSize: "0.85rem", paddingLeft: 0 }}>
        {filesInActiveGroup.map(f => (
          <li key={f.id} style={{ listStyle: "none", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
              <span className="truncate" title={f.name} style={{ flex: 1 }}>
                {f.name}
              </span>
              <select
                value={f.groupId || ""}
                onChange={(e) => moveFileToGroup(f.id, e.target.value || null)}
                style={{ fontSize: 12 }}
              >
                <option value="">(no group)</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
        {!filesInActiveGroup.length && <li style={{ listStyle: "none" }}>No files</li>}
      </ul>
    </aside>
  );
}
