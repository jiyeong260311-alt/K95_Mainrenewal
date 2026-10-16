"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, projects } from "./data";

export function Works() {
  const [view,setView]=useState<"grid"|"list">("grid");
  const [category,setCategory]=useState("All");
  const [filters,setFilters]=useState(false);
  const dock=useRef<HTMLDivElement>(null);
  const filterButton=useRef<HTMLButtonElement>(null);
  const visible=projects.filter(p=>category==="All"||p.categories.includes(category));
  useEffect(()=>{
    function outside(e:PointerEvent){if(dock.current&&!dock.current.contains(e.target as Node))setFilters(false);}
    function key(e:KeyboardEvent){if(e.key==="Escape"){setFilters(false);filterButton.current?.focus();}}
    if(filters){document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);}
    return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);};
  },[filters]);
  return <main id="main" className="works-page"><h1 className="sr-only">All works — Studio K95</h1><div className="works-view-switch glass" role="group" aria-label="View mode"><span className={`switch-pill ${view==="list"?"switch-right":""}`} /><button aria-pressed={view==="grid"} onClick={()=>setView("grid")}>Grid</button><button aria-pressed={view==="list"} onClick={()=>setView("list")}>List</button></div>
    <p className="sr-only" role="status">{visible.length} projects. {category}.</p>
    <div className={view==="grid"?"works-grid":"works-list"} key={`${view}-${category}`}>
      {visible.map(p=><Link key={p.slug} href={`/en/projects/${p.slug}/`} className={view==="grid"?"work-card":"work-row"}>
        {view==="grid"?<><div className="work-image"><Image src={p.image} alt={p.title} width={640} height={850} sizes="(max-width: 768px) 42vw, 20vw" /></div><div className="work-meta"><span>{p.title}</span><span>↗</span></div></>:<><small>{p.number}</small><span>{p.title}</span><div className="list-preview"><Image src={p.image} alt="" width={420} height={560} sizes="20vw" /></div></>}
      </Link>)}
    </div>
    <div ref={dock} className="filter-dock">{filters&&<div id="category-filters" className="filter-panel glass" role="group" aria-label="Filter by discipline"><button className="filter-close" onClick={()=>{setFilters(false);filterButton.current?.focus();}} aria-label="Close filters">×</button>{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);setFilters(false);filterButton.current?.focus();}}><span>{c}</span><span>({c==="All"?projects.length:projects.filter(p=>p.categories.includes(c)).length})</span></button>)}</div>}<button ref={filterButton} className="filter-toggle glass" aria-expanded={filters} aria-controls="category-filters" onClick={()=>setFilters(!filters)}>• &nbsp;{category} <sup>({visible.length})</sup></button></div>
  </main>;
}
