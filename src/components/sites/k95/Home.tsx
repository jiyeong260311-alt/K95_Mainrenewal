"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects } from "./data";
const GalleryScene = dynamic(() => import("./GalleryScene").then(m => m.GalleryScene), { ssr: false, loading: () => <div className="scene-loading" aria-label="Loading gallery"><span /></div> });
export function Home() {
  const [mode, setMode] = useState<"rings" | "spiral">("rings");
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  return <main id="main" className="home-page"><h1 className="sr-only">K95 — Brand & Digital Design Studio</h1>
    {!failed ? <GalleryScene mode={mode} onFailure={() => setFailed(true)} onSelect={setSelected} /> : <div className="scene-fallback">{projects.slice(0,12).map(p => <Link href={`/en/projects/${p.slug}/`} key={p.slug}><Image src={p.image} width={320} height={420} alt={p.title} /></Link>)}</div>}
    <div className="layout-switch glass" role="group" aria-label="Gallery layout"><span className={`switch-pill ${mode === "spiral" ? "switch-right" : ""}`} /><button aria-pressed={mode === "rings"} onClick={() => setMode("rings")}>Rings</button><button aria-pressed={mode === "spiral"} onClick={() => setMode("spiral")}>Spiral</button></div>
    <div className="scene-caption glass" aria-live="polite">{selected !== null ? <Link href={`/en/projects/${projects[selected].slug}/`}><span>↗</span><span>{projects[selected].title}<small>{projects[selected].categories.join(", ")}</small></span></Link> : <span>SCROLL TO EXPLORE <span className="down-arrow">↓</span></span>}</div>
    <footer className="home-footer"><span>Brand & Digital Design Studio</span><span>12 / 20 <span className="selected-word">selected </span><Link href="/en/works/">Works</Link></span><span>© 2026</span></footer>
    <nav className="sr-only" aria-label="Selected projects">{projects.slice(0,12).map(p => <Link key={p.slug} href={`/en/projects/${p.slug}/`}>{p.title}</Link>)}</nav>
  </main>;
}
