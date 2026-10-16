import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/components/sites/k95/data";
import { Footer } from "@/components/sites/k95/Shell";
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);return{title:p?.title??"Project",description:p?.description};}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const index=projects.findIndex(p=>p.slug===slug);if(index<0)notFound();const p=projects[index];const next=projects[(index+1)%projects.length];
  return <><main id="main" className="project-page"><div className="project-topline"><Link className="glass" href="/en/works/">↖ All works</Link><span>{p.number} / {projects.length}</span></div><h1 className="project-heading">{p.title}</h1><div className="project-description"><div><span className="eyebrow">{p.categories.join(" / ")}</span><span className="eyebrow">Studio K95 — Catania, Italy</span></div><p>{p.description}</p></div><Image className="project-cover" src={p.image} alt={p.title} width={1600} height={1200} sizes="100vw" priority /><div className="project-gallery">{p.gallery.slice(1).map((image,i)=><figure key={image}><Image src={image} alt={`${p.title} — project image ${i+2}`} width={1600} height={1200} sizes="(max-width:768px) 100vw, 50vw" /></figure>)}</div><Link href={`/en/projects/${next.slug}/`} className="next-project"><div><span className="eyebrow">Next project</span><strong>{next.title}</strong></div><span>↗</span></Link></main><Footer /></>;
}
