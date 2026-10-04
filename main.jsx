import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, Users, UsersRound, Lightbulb, Trophy, Hammer,
  Send, Upload, Plus, Search, Menu, X, ChevronRight, CheckCircle2,
  Clock3, AlertCircle, Download, Trash2
} from "lucide-react";
import "./styles.css";

const initialStudents = [
  { id:"STU001", name:"Demo Student 1", roll:"23Y1A0501", branch:"CSE", year:"III", kickoff:true, team:"TEAM001" },
  { id:"STU002", name:"Demo Student 2", roll:"23Y1A0502", branch:"CSE", year:"III", kickoff:true, team:"TEAM001" },
  { id:"STU003", name:"Demo Student 3", roll:"23Y1A0503", branch:"AIML", year:"III", kickoff:true, team:"TEAM001" },
  { id:"STU004", name:"Demo Student 4", roll:"23Y1A0504", branch:"CSE", year:"III", kickoff:true, team:"TEAM001" },
];

const initialTeams = [
  { id:"TEAM001", name:"Innovators", members:["STU001","STU002","STU003","STU004"], problem:"P001", idea:"AI-based campus support system", top50:true, build:"In Progress", final:false }
];

const initialProblems = [
  { id:"P001", title:"Smart Campus", description:"Use technology to improve student and campus services." },
  { id:"P002", title:"Education Technology", description:"Build an innovative solution for teaching and learning." },
  { id:"P003", title:"Healthcare", description:"Create a technology solution for accessible healthcare." },
];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function App() {
  const [page, setPage] = useState("dashboard");
  const [mobile, setMobile] = useState(false);
  const [students, setStudents] = useState(() => load("v3_students", initialStudents));
  const [teams, setTeams] = useState(() => load("v3_teams", initialTeams));
  const [problems, setProblems] = useState(() => load("v3_problems", initialProblems));
  const [query, setQuery] = useState("");

  const updateStudents = (v) => { setStudents(v); save("v3_students", v); };
  const updateTeams = (v) => { setTeams(v); save("v3_teams", v); };
  const updateProblems = (v) => { setProblems(v); save("v3_problems", v); };

  const stats = useMemo(() => ({
    students: students.length,
    kickoff: students.filter(s=>s.kickoff).length,
    teams: teams.length,
    ideas: teams.filter(t=>t.idea).length,
    top50: teams.filter(t=>t.top50).length,
    building: teams.filter(t=>t.build === "In Progress").length,
    final: teams.filter(t=>t.final).length
  }), [students, teams]);

  const nav = [
    ["dashboard","Dashboard",LayoutDashboard],
    ["students","Students",Users],
    ["teams","Teams",UsersRound],
    ["problems","Problem Statements",Lightbulb],
    ["ideas","Idea Submissions",Send],
    ["top50","Top 50",Trophy],
    ["build","Build Stage",Hammer],
    ["final","Final Submission",CheckCircle2]
  ];

  const pageTitle = nav.find(n=>n[0]===page)?.[1] || "Dashboard";

  return <div className="app">
    <aside className={`sidebar ${mobile ? "open":""}`}>
      <div className="brand">
        <div className="brand-mark">V3</div>
        <div><strong>Event Manager</strong><span>Smart College System</span></div>
        <button className="icon-btn close-mobile" onClick={()=>setMobile(false)}><X size={20}/></button>
      </div>
      <nav>{nav.map(([id,label,Icon]) =>
        <button key={id} className={page===id?"nav active":"nav"} onClick={()=>{setPage(id);setMobile(false)}}>
          <Icon size={18}/><span>{label}</span>
        </button>
      )}</nav>
      <div className="sidebar-foot">
        <div className="stage">V3.0 <span>FREE</span></div>
        <small>Data is stored in this browser until cloud database is connected.</small>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-menu" onClick={()=>setMobile(true)}><Menu size={22}/></button>
        <div><h1>{pageTitle}</h1><p>Student Innovation & Hackathon Management</p></div>
        <div className="top-actions">
          <div className="search"><Search size={17}/><input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
          <button className="btn primary" onClick={()=>setPage("students")}><Plus size={17}/> Add Student</button>
        </div>
      </header>

      {page==="dashboard" && <Dashboard stats={stats} setPage={setPage} />}
      {page==="students" && <Students students={students} updateStudents={updateStudents} query={query}/>}
      {page==="teams" && <Teams teams={teams} students={students} updateTeams={updateTeams} problems={problems}/>}
      {page==="problems" && <Problems problems={problems} updateProblems={updateProblems}/>}
      {page==="ideas" && <Ideas teams={teams} problems={problems} updateTeams={updateTeams}/>}
      {page==="top50" && <Top50 teams={teams} updateTeams={updateTeams}/>}
      {page==="build" && <Build teams={teams} updateTeams={updateTeams}/>}
      {page==="final" && <Final teams={teams} updateTeams={updateTeams}/>}
    </main>
  </div>
}

function Stat({label,value,icon:Icon,onClick}) {
 return <button className="stat-card" onClick={onClick}><div className="stat-icon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong></div></button>
}

function Dashboard({stats,setPage}) {
 return <section className="content">
   <div className="welcome"><div><span className="eyebrow">VERSION 3</span><h2>Event workflow at a glance</h2><p>Track every student, team and project from kickoff to final submission.</p></div><button className="btn light" onClick={()=>setPage("students")}><Upload size={16}/> Import Students</button></div>
   <div className="stats-grid">
    <Stat label="Total Students" value={stats.students} icon={Users} onClick={()=>setPage("students")}/>
    <Stat label="Kickoff Attended" value={stats.kickoff} icon={CheckCircle2} onClick={()=>setPage("students")}/>
    <Stat label="Teams Registered" value={stats.teams} icon={UsersRound} onClick={()=>setPage("teams")}/>
    <Stat label="Ideas Submitted" value={stats.ideas} icon={Lightbulb} onClick={()=>setPage("ideas")}/>
    <Stat label="Top 50 Teams" value={stats.top50} icon={Trophy} onClick={()=>setPage("top50")}/>
    <Stat label="Building" value={stats.building} icon={Hammer} onClick={()=>setPage("build")}/>
    <Stat label="Final Submitted" value={stats.final} icon={Send} onClick={()=>setPage("final")}/>
   </div>
   <div className="workflow">
    <div className="section-head"><div><h3>Event Workflow</h3><p>Progress through each stage</p></div></div>
    <div className="flow">
      {[
       ["01","Kickoff","Students attended",stats.kickoff,"students"],
       ["02","Team Registration","Teams of 4 or 6",stats.teams,"teams"],
       ["03","Problem & Idea","Idea submitted",stats.ideas,"ideas"],
       ["04","Top 50","Selected teams",stats.top50,"top50"],
       ["05","Build","Project development",stats.building,"build"],
       ["06","Final","Final submission",stats.final,"final"]
      ].map((x,i)=><React.Fragment key={x[0]}><button className="flow-step" onClick={()=>setPage(x[4])}><b>{x[0]}</b><strong>{x[1]}</strong><span>{x[2]}</span><em>{x[3]}</em></button>{i<5&&<ChevronRight className="flow-arrow"/>}</React.Fragment>)}
    </div>
   </div>
 </section>
}

function Students({students,updateStudents,query}) {
 const [show,setShow]=useState(false);
 const [form,setForm]=useState({name:"",roll:"",branch:"CSE",year:"III",kickoff:true});
 const filtered=students.filter(s=>(s.name+" "+s.roll+" "+s.branch).toLowerCase().includes(query.toLowerCase()));
 function add(){ if(!form.name||!form.roll)return; updateStudents([...students,{...form,id:"STU"+String(Date.now()).slice(-6),team:""}]); setForm({name:"",roll:"",branch:"CSE",year:"III",kickoff:true}); setShow(false); }
 function importCSV(e){
   const file=e.target.files?.[0]; if(!file)return;
   const reader=new FileReader();
   reader.onload=ev=>{
     const lines=String(ev.target.result).split(/\r?\n/).filter(Boolean);
     if(lines.length<2)return;
     const headers=lines[0].split(",").map(x=>x.trim().toLowerCase());
     const rows=lines.slice(1).map((line,i)=>{
       const vals=line.split(","); const o=Object.fromEntries(headers.map((h,j)=>[h,(vals[j]||"").trim()]));
       return {id:o.id||"STU"+Date.now()+i,name:o.name||o.student_name||"",roll:o.roll||o.roll_no||o.reg_no||"",branch:o.branch||"CSE",year:o.year||"III",kickoff:["true","yes","1","y"].includes((o.kickoff||"true").toLowerCase()),team:o.team||""};
     }).filter(x=>x.name||x.roll);
     updateStudents([...students,...rows]);
   }; reader.readAsText(file); e.target.value="";
 }
 return <section className="content">
  <div className="section-head"><div><h2>Students</h2><p>Bulk upload student data or add students individually.</p></div>
   <div className="actions"><label className="btn light"><Upload size={16}/> Import CSV<input hidden type="file" accept=".csv" onChange={importCSV}/></label><button className="btn primary" onClick={()=>setShow(true)}><Plus size={16}/> Add Student</button></div>
  </div>
  {show&&<div className="panel form-panel"><h3>Add Student</h3><div className="form-grid">
    <input placeholder="Student Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
    <input placeholder="Roll Number" value={form.roll} onChange={e=>setForm({...form,roll:e.target.value})}/>
    <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}><option>CSE</option><option>AIML</option><option>CSDS</option><option>CSM</option><option>Other</option></select>
    <select value={form.year} onChange={e=>setForm({...form,year:e.target.value})}><option>II</option><option>III</option><option>IV</option></select>
  </div><label className="check"><input type="checkbox" checked={form.kickoff} onChange={e=>setForm({...form,kickoff:e.target.checked})}/> Kickoff attended</label><div className="actions"><button className="btn primary" onClick={add}>Save Student</button><button className="btn light" onClick={()=>setShow(false)}>Cancel</button></div></div>}
  <div className="panel"><div className="table-note"><span>{filtered.length} students</span><button className="btn small light" onClick={()=>downloadCSV(students,"students-v3.csv")}><Download size={14}/> Export</button></div>
   <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Roll No.</th><th>Branch</th><th>Year</th><th>Kickoff</th><th>Team</th><th></th></tr></thead>
   <tbody>{filtered.map(s=><tr key={s.id}><td className="mono">{s.id}</td><td><strong>{s.name}</strong></td><td className="mono">{s.roll}</td><td>{s.branch}</td><td>{s.year}</td><td>{s.kickoff?<span className="badge success">Present</span>:<span className="badge">Absent</span>}</td><td>{s.team||"—"}</td><td><button className="icon-btn danger" onClick={()=>updateStudents(students.filter(x=>x.id!==s.id))}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>
  </div>
  <div className="hint"><AlertCircle size={16}/><span>CSV columns supported: <b>name, roll, branch, year, kickoff, team</b>. You can upload your existing student list in one file.</span></div>
 </section>
}

function Teams({teams,students,updateTeams,problems}) {
 const [show,setShow]=useState(false); const [name,setName]=useState(""); const [members,setMembers]=useState([]);
 function add(){if(!name||members.length<4||members.length>6)return; const id="TEAM"+String(Date.now()).slice(-5); updateTeams([...teams,{id,name,members,problem:"",idea:"",top50:false,build:"Not Started",final:false}]);setName("");setMembers([]);setShow(false)}
 return <section className="content"><div className="section-head"><div><h2>Teams</h2><p>Register teams with 4–6 members.</p></div><button className="btn primary" onClick={()=>setShow(true)}><Plus size={16}/> Create Team</button></div>
 {show&&<div className="panel form-panel"><h3>Create Team</h3><input placeholder="Team Name" value={name} onChange={e=>setName(e.target.value)}/><p className="muted">Select 4 to 6 kickoff students.</p><div className="member-picker">{students.filter(s=>!s.team||members.includes(s.id)).map(s=><label className="member"><input type="checkbox" checked={members.includes(s.id)} onChange={e=>setMembers(e.target.checked?[...members,s.id]:members.filter(x=>x!==s.id))}/><span>{s.name}<small>{s.roll}</small></span></label>)}</div><div className="actions"><button className="btn primary" disabled={members.length<4||members.length>6} onClick={add}>Create Team ({members.length}/6)</button><button className="btn light" onClick={()=>setShow(false)}>Cancel</button></div></div>}
 <div className="team-grid">{teams.map(t=><TeamCard key={t.id} t={t} students={students} problems={problems} updateTeams={updateTeams} teams={teams}/>)}</div>
 </section>
}

function TeamCard({t,students,problems,updateTeams,teams}) {
 const memberNames=t.members.map(id=>students.find(s=>s.id===id)?.name).filter(Boolean);
 const problem=problems.find(p=>p.id===t.problem)?.title||"Problem not selected";
 function update(p){updateTeams(teams.map(x=>x.id===t.id?{...x,...p}:x))}
 return <div className="team-card"><div className="team-head"><div className="team-avatar"><UsersRound size={20}/></div><div><h3>{t.name}</h3><span>{t.id} · {memberNames.length} members</span></div>{t.top50&&<span className="badge gold">Top 50</span>}</div><div className="team-members">{memberNames.map((n,i)=><span key={i}>{n}</span>)}</div><div className="team-meta"><div><small>Problem</small><strong>{problem}</strong></div><div><small>Build</small><strong>{t.build}</strong></div></div><div className="team-actions"><select value={t.problem} onChange={e=>update({problem:e.target.value})}><option value="">Select problem</option>{problems.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><button className="btn small light" onClick={()=>update({idea:t.idea?"":"Idea pending"})}>{t.idea?"Idea Added":"Mark Idea"}</button></div></div>
}

function Problems({problems,updateProblems}) {
 const [title,setTitle]=useState("");const [desc,setDesc]=useState("");
 function add(){if(!title)return;updateProblems([...problems,{id:"P"+String(Date.now()).slice(-5),title,description:desc}]);setTitle("");setDesc("")}
 return <section className="content"><div className="section-head"><div><h2>Problem Statements</h2><p>Manage the challenges available to teams.</p></div></div>
 <div className="split"><div className="panel form-panel"><h3>Add Problem</h3><input placeholder="Problem title" value={title} onChange={e=>setTitle(e.target.value)}/><textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)}/><button className="btn primary" onClick={add}><Plus size={16}/> Add Problem</button></div>
 <div className="problem-list">{problems.map(p=><div className="panel problem" key={p.id}><span className="problem-id">{p.id}</span><h3>{p.title}</h3><p>{p.description}</p><button className="icon-btn danger" onClick={()=>updateProblems(problems.filter(x=>x.id!==p.id))}><Trash2 size={15}/></button></div>)}</div></div></section>
}

function Ideas({teams,problems,updateTeams}) {
 const ideas=teams.filter(t=>t.idea); return <section className="content"><div className="section-head"><div><h2>Idea Submissions</h2><p>Review team ideas and mark them as submitted.</p></div></div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Team</th><th>Problem</th><th>Idea</th><th>Status</th></tr></thead><tbody>{teams.map(t=><tr key={t.id}><td><strong>{t.name}</strong></td><td>{problems.find(p=>p.id===t.problem)?.title||"Not selected"}</td><td><input className="inline-input" value={t.idea||""} placeholder="Enter idea..." onChange={e=>updateTeams(teams.map(x=>x.id===t.id?{...x,idea:e.target.value}:x))}/></td><td>{t.idea?<span className="badge success">Submitted</span>:<span className="badge">Pending</span>}</td></tr>)}</tbody></table></div></div></section>
}

function Top50({teams,updateTeams}) {
 const ideas=teams.filter(t=>t.idea); return <section className="content"><div className="section-head"><div><h2>Top 50 Selection</h2><p>Select teams for the project-building stage.</p></div></div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Team</th><th>Idea</th><th>Top 50</th></tr></thead><tbody>{ideas.map(t=><tr key={t.id}><td><strong>{t.name}</strong></td><td>{t.idea}</td><td><label className="toggle"><input type="checkbox" checked={!!t.top50} onChange={e=>updateTeams(teams.map(x=>x.id===t.id?{...x,top50:e.target.checked}:x))}/><span></span></label></td></tr>)}</tbody></table></div></div></section>
}

function Build({teams,updateTeams}) {
 const selected=teams.filter(t=>t.top50); return <section className="content"><div className="section-head"><div><h2>Build Stage</h2><p>Track project development of Top 50 teams.</p></div></div><div className="build-grid">{selected.map(t=><div className="build-card" key={t.id}><div><span className="badge gold">Top 50</span><h3>{t.name}</h3><p>{t.idea}</p></div><select value={t.build} onChange={e=>updateTeams(teams.map(x=>x.id===t.id?{...x,build:e.target.value}:x))}><option>Not Started</option><option>In Progress</option><option>Completed</option></select></div>)}{!selected.length&&<Empty text="No Top 50 teams selected yet."/>}</div></section>
}

function Final({teams,updateTeams}) {
 const selected=teams.filter(t=>t.top50&&t.build==="Completed"); return <section className="content"><div className="section-head"><div><h2>Final Submission</h2><p>Record final project submissions.</p></div></div><div className="panel"><div className="table-wrap"><table><thead><tr><th>Team</th><th>Idea</th><th>Build</th><th>Final Submission</th></tr></thead><tbody>{selected.map(t=><tr key={t.id}><td><strong>{t.name}</strong></td><td>{t.idea}</td><td><span className="badge success">Completed</span></td><td><button className={t.final?"btn small success-btn":"btn small primary"} onClick={()=>updateTeams(teams.map(x=>x.id===t.id?{...x,final:!x.final}:x))}>{t.final?"Submitted":"Mark Submitted"}</button></td></tr>)}</tbody></table></div>{!selected.length&&<Empty text="Teams appear here after their build stage is completed."/>}</div></section>
}

function Empty({text}){return <div className="empty"><Clock3 size={22}/><span>{text}</span></div>}
function downloadCSV(rows,name){const keys=Object.keys(rows[0]||{});const csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replaceAll('"','""')}"`).join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=name;a.click();}

createRoot(document.getElementById("root")).render(<App />);
