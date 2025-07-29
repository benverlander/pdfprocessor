import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PageGrid from "./components/PageGrid";
import ActionPanel from "./components/ActionPanel";
import OutputBar from "./components/OutputBar";
import "./index.css";

export default function App() {
  const [files, setFiles] = useState([]);       // [{ id, name, pages:[{id,img,hidden}] }]
  const [selected, setSelected] = useState([]);  // page ids
  const [thumbWidth, setThumbWidth]= useState(160); //px
  const [groups, setGroups] = useState([]); 
  const [activeGroupId, setActiveGroupId]= useState(null);
  const [tableData, setTableData] = useState(null);


  // Optional: centralize API base if you want absolute URLs.
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

  const addGroup = (name) => {
    const id = crypto.randomUUID();
    setGroups ((g) => [...g, {id, name}]); 
    setActiveGroupId(id);
  }

  const moveFileToGroup = (fileId, groupId) => {
    setFiles((fs) => fs.map(f=> f.id === fileId ? {...f, groupId} : f));
  }

  const hideSelected = () => {
    setFiles(f =>
      f.map(file => ({
        ...file,
        pages: file.pages.map(p =>
          selected.includes(p.id) ? { ...p, hidden: true } : p
        ),
      }))
    );
    setSelected([]);
  };

  // --- New helper: resolve selected page URLs (and useful metadata) ---
  const getSelectedPageUrls = () => {
    const out = [];
    for (const file of files) {
      for (let i = 0; i < file.pages.length; i++) {
        const page = file.pages[i];
        if (!selected.includes(page.id)) continue;

        const pageNo = i + 1; // 1-based page number within the PDF
        // Priority: explicit page.url → page.img (what you're rendering now) → computed backend route
        const computedBackendURL = `${API_BASE}/api/files/${file.id}/pages/${pageNo}.png`;
        const url = page.url || page.img || computedBackendURL;

        out.push({
          fileId: file.id,
          fileName: file.name,
          pageId: page.id,
          pageNo,
          url,
        });
      }
    }
    return out;
  };

  const callGpt = async () => {
    if (!selected.length) return;

    const hits = getSelectedPageUrls();
    const img_path = hits[0].url;  // Only use the first selected page
    console.log(img_path)

    try {
    const res = await fetch("http://localhost:5000/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ img_path }),
    });

    const json = await res.json();
    console.log("GPT Result:", json);
    //alert("GPT finished:\n" + JSON.stringify(json, null, 2));
    setTableData(json.tables);
    } catch (err) {
    console.error("Error calling GPT:", err);
    alert("GPT call failed");
    }
  };

  
  return (
    <div className="app-container">
      <div className="flex main-content">
      <Sidebar  files={files} 
                setFiles={setFiles}
                groups={groups}
                addGroup={addGroup}
                activeGroupId= {activeGroupId}
                setActiveGroupId={setActiveGroupId}
                moveFileToGroup={moveFileToGroup}
                />
      <PageGrid files={files} 
                selected={selected} 
                setSelected={setSelected} 
                thumbWidth={thumbWidth}
                activeGroupId={activeGroupId}/>
      <ActionPanel
        onHide={hideSelected}
        onCallGpt={callGpt}
        disabled={!selected.length}
        thumbWidth={thumbWidth}
        setThumbWidth={setThumbWidth}
      />
    </div>
    <OutputBar tableData={tableData} /> 
    </div>
  );
}
