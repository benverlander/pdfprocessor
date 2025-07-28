export default function PageGrid({ files, selected, setSelected, thumbWidth, activeGroupId}) {
   // console.log("PageGrid thumbWidth =", thumbWidth);

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);


  //const pages = files.flatMap(f => f.pages.filter(p => !p.hidden));

    const visibleFiles= activeGroupId
        ? files.filter(f=> f.groupId === activeGroupId)
        : files; 

    const pages = visibleFiles.flatMap(f=> f.pages.filter(p => !p.hidden));

  const col= `${thumbWidth}px`;

  return (
    <main className="page-grid" style={{ gridTemplateColumns: `repeat(auto-fit, ${col})` }}>
      {pages.map((p) => {
        const isSel = selected.includes(p.id);
        return (
          <div
            key={p.id}
            className={`thumb-box ${isSel ? "selected" : ""}`}
            style={{ width: col }}
            onClick={() => toggle(p.id)}
          >
            <img
              src={p.img}
              alt=""
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        );
      })}
      {!pages.length && <p>No pages yet — upload a PDF.</p>}
    </main>
  );
}
