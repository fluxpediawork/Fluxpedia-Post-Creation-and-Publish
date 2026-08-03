"use client";

import { useEffect, useMemo, useState } from "react";

const stages = [
  { id: "research", n: "01", title: "Research", hint: "Current, corroborated and clearly sourced", tasks: ["News is from today's cycle", "Location and people are verified", "A second reputable source corroborates it", "Sensitivity gate is completed", "Visual or illustration matches the incident", "Original credit is recorded"] },
  { id: "media", n: "02", title: "Media & folder", hint: "One story, one organized workspace", tasks: ["Story folder created", "Correct video or generated-image route used", "Highest-quality permitted asset saved", "Original source remains unchanged", "Media opens correctly", "Final export filename is clear"] },
  { id: "canva", n: "03", title: "Canva", hint: "Replace content, preserve the design", tasks: ["Old foreground media removed", "Old background media removed", "New media fills the frame", "Video or image is at the bottom of the layer stack", "All branding and text layers remain above media", "Existing date element updated", "Existing headline element updated", "Only the key phrase is highlighted", "Playback and layer order checked"] },
  { id: "trello", n: "04", title: "Trello", hint: "Prepare in On Posting only", tasks: ["Card is in On Posting", "Correct final export attached", "TezScroll and Post labels added", "FluxPedia member added", "Due date is today", "Complete caption and disclaimers added"] },
  { id: "meta", n: "05", title: "Publish", hint: "Verify first, close out second", tasks: ["TezScroll / tezscroll selected", "Matching Trello media uploaded", "Matching Trello caption pasted", "Facebook and Instagram previews checked", "Published item verified", "Trello card marked complete", "Card moved to Completed"] },
];

type Checks = Record<string, boolean>;

export default function Home() {
  const [story, setStory] = useState("");
  const [source, setSource] = useState("");
  const [headline, setHeadline] = useState("\n\n");
  const [caption, setCaption] = useState("");
  const [checks, setChecks] = useState<Checks>({});
  const [flags, setFlags] = useState<Checks>({});
  const [active, setActive] = useState("research");
  const [ready, setReady] = useState(false);
  const [lesson, setLesson] = useState("");
  const [syncState, setSyncState] = useState<"idle"|"syncing"|"saved"|"error">("idle");

  useEffect(() => {
    const saved = localStorage.getItem("tezscroll-workspace");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStory(data.story || ""); setSource(data.source || ""); setHeadline(data.headline || "\n\n"); setCaption(data.caption || ""); setChecks(data.checks || {}); setFlags(data.flags || {}); setLesson(data.lesson || ""); setActive(data.active || "research");
      } catch { /* start clean */ }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("tezscroll-workspace", JSON.stringify({ story, source, headline, caption, checks, flags, lesson, active }));
  }, [story, source, headline, caption, checks, flags, lesson, active, ready]);

  const allTasks = stages.flatMap(s => s.tasks.map((_, i) => `${s.id}-${i}`));
  const done = allTasks.filter(k => checks[k]).length;
  const progress = Math.round(done / allTasks.length * 100);
  const current = stages.find(s => s.id === active) || stages[0];
  const lines = headline.split("\n").slice(0, 3);
  const wordCounts = lines.map(l => l.trim() ? l.trim().split(/\s+/).length : 0);
  const folder = `Tezscroll News - ${new Date().toISOString().slice(0,10)} - ${story.trim() || "Short Story Name"}`;
  const sensitive = Object.values(flags).some(Boolean);

  const captionTemplate = useMemo(() => `[Paragraph 1: Explain who, what, where, and the immediate circumstances.]\n\n[Paragraph 2: Explain the impact, response, safety issue, investigation, or wider significance.]\n\nCredit: ${source || "[Original source]"}. Visual source: [Visual owner/source if known]. If you are the rightful owner of this video, please contact us for credit or removal.\n\nFAIR USE: Copyright Disclaimer under Section 107 of the Copyright Act, 1976. Allowance is made for fair use for purposes such as criticism, comment, news reporting, teaching, scholarship and research. We do not claim ownership of the content featured in this post.\n\nDisclaimer: This page shares publicly available content for informational and awareness purposes only.\n\nInformation is based on publicly available reports at the time of posting. All rights and credits belong to their respective owners. If you are the rightful owner of any content and would like it credited or removed, please contact us via DM or email.`, [source]);

  function reset() {
    if (!confirm("Start a new story? This clears the current workspace.")) return;
    setStory(""); setSource(""); setHeadline("\n\n"); setCaption(""); setChecks({}); setFlags({}); setLesson(""); setActive("research"); setSyncState("idle");
  }

  async function syncToGitHub() {
    if (!story.trim()) { alert("Add a story name before syncing."); return; }
    setSyncState("syncing");
    try {
      const response = await fetch("/api/stories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ story, source, headline, caption, checks, flags, lesson, active, progress, folder, mediaDecision: sensitive ? "generated-image-only" : "video-allowed-after-checks", updatedAt: new Date().toISOString() }) });
      if (!response.ok) throw new Error("sync failed");
      setSyncState("saved");
    } catch { setSyncState("error"); }
  }

  return <main>
    <header>
      <div className="brand"><span className="mark">TS</span><div><strong>TEZSCROLL</strong><small>Newsroom workflow</small></div></div>
      <div className="header-actions"><span className="autosave"><i /> Draft saved on device</span><button className="sync" onClick={syncToGitHub} disabled={syncState==="syncing"}>{syncState==="syncing" ? "Syncing..." : syncState==="saved" ? "Saved to GitHub" : syncState==="error" ? "Retry sync" : "Save to GitHub"}</button><button className="ghost" onClick={reset}>New story</button></div>
    </header>

    <section className="hero">
      <div><p className="eyebrow">LIVE PRODUCTION DESK</p><h1>Publish the story.<br/><em>Keep every detail right.</em></h1><p className="lede">A guided workspace built from the TezScroll SOP, from credible source to verified publication.</p></div>
      <div className="progress-card"><div className="ring" style={{"--p": `${progress * 3.6}deg`} as React.CSSProperties}><span>{progress}<small>%</small></span></div><div><b>{done} of {allTasks.length}</b><p>checks complete</p></div></div>
    </section>

    <section className="story-bar">
      <label><span>STORY NAME</span><input value={story} onChange={e=>setStory(e.target.value)} placeholder="e.g. Pune crane collapse" /></label>
      <label><span>PRIMARY SOURCE / CREDIT</span><input value={source} onChange={e=>setSource(e.target.value)} placeholder="e.g. ANI / PMRDA" /></label>
      <div className="folder"><span>FOLDER NAME</span><code>{folder}</code></div>
    </section>

    <section className={`safety-gate ${sensitive ? "restricted" : "clear"}`}>
      <div className="safety-copy"><p>MANDATORY MEDIA SAFETY GATE</p><h2>{sensitive ? "Do not use the incident video" : "Source video may be considered"}</h2><span>{sensitive ? "Generate a respectful, non-graphic illustrative image. Label it as an illustration and never imply it is authentic footage." : "Only after source, date, context, rights, and visual relevance are verified."}</span></div>
      <div className="flags" aria-label="Sensitive-content checks">
        {[["minor","Minor involved"],["blood","Blood or graphic injury"],["sexual","Sexual content or abuse"],["selfharm","Self-injury or suicide"]].map(([key,label])=><label key={key}><input type="checkbox" checked={!!flags[key]} onChange={()=>setFlags({...flags,[key]:!flags[key]})}/><span>{flags[key] ? "✓" : ""}</span>{label}</label>)}
      </div>
      <div className="media-decision"><small>MEDIA DECISION</small><strong>{sensitive ? "GENERATED IMAGE ONLY" : "VIDEO ALLOWED AFTER CHECKS"}</strong></div>
    </section>

    <nav className="stage-nav" aria-label="Workflow stages">
      {stages.map(s => { const complete = s.tasks.every((_,i)=>checks[`${s.id}-${i}`]); return <button key={s.id} className={active===s.id?"active":""} onClick={()=>setActive(s.id)}><span>{complete ? "✓" : s.n}</span><div><b>{s.title}</b><small>{s.hint}</small></div></button>})}
    </nav>

    <section className="workspace">
      <div className="check-panel">
        <div className="section-title"><p>STAGE {current.n}</p><h2>{current.title}</h2><span>{current.tasks.filter((_,i)=>checks[`${current.id}-${i}`]).length}/{current.tasks.length}</span></div>
        <div className="checklist">{current.tasks.map((task,i)=>{const key=`${current.id}-${i}`;return <label key={key} className={checks[key]?"checked":""}><input type="checkbox" checked={!!checks[key]} onChange={()=>setChecks({...checks,[key]:!checks[key]})}/><span className="box">{checks[key]?"✓":""}</span><span>{task}</span></label>})}</div>
        <div className="rule"><b>Core rule</b><p>Preserve the established design. Replace content inside the existing structure; never rebuild it from scratch.</p></div>
      </div>

      <aside>
        <div className="tool-card"><div className="tool-head"><div><p>HEADLINE CHECK</p><h3>Three-line title</h3></div><span>5-6 words / line</span></div><textarea className="headline" rows={3} value={headline} onChange={e=>setHeadline(e.target.value.split("\n").slice(0,3).join("\n"))} placeholder={'LINE ONE HAS FIVE WORDS\nLINE TWO HAS FIVE WORDS\nLINE THREE HAS FIVE WORDS'} />
          <div className="line-counts">{[0,1,2].map(i=><span key={i} className={wordCounts[i]>=5&&wordCounts[i]<=6?"good":""}>Line {i+1}: {wordCounts[i]||0} words</span>)}</div>
        </div>
        <div className="tool-card"><div className="tool-head"><div><p>CAPTION BUILDER</p><h3>Publishing copy</h3></div><button onClick={()=>setCaption(captionTemplate)}>Use template</button></div><textarea rows={9} value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Build the verified caption here..."/><button className="copy" onClick={()=>navigator.clipboard.writeText(caption)}>Copy complete caption</button></div>
        <div className="tool-card"><div className="tool-head"><div><p>REPOSITORY MEMORY</p><h3>Lesson from this story</h3></div><span>Saved with record</span></div><textarea rows={4} value={lesson} onChange={e=>setLesson(e.target.value)} placeholder="What source, query, format, check, or correction should improve the next story?"/></div>
      </aside>
    </section>

    <footer><span>Accuracy first</span><i/> <span>Consistency second</span><i/> <span>Speed third</span></footer>
  </main>
}
