"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logo } from "./data";

const links = [{ href: "/en/works/", label: "All Works" }, { href: "/en/studio/", label: "Studio" }, { href: "/en/contacts/", label: "Contact" }];
export function RollingText({ text }: { text: string }) {
  return <span className="rolling-text" aria-label={text}>{[...text].map((char, i) => <span className="rolling-char" aria-hidden="true" style={{ "--i": i } as React.CSSProperties} key={i}><span>{char === " " ? "\u00a0" : char}</span><span>{char === " " ? "\u00a0" : char}</span></span>)}</span>;
}
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cookie, setCookie] = useState<"hidden" | "ask" | "manage">("hidden");
  const cursor = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const cookieDialog = useRef<HTMLDivElement>(null);
  const cookieTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const preferenceFrame = requestAnimationFrame(() => {
      try { if (!localStorage.getItem("k95-cookie-choice")) setCookie("ask"); } catch { setCookie("ask"); }
    });
    const move = (e: PointerEvent) => {
      if (!cursor.current) return;
      cursor.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      cursor.current.classList.toggle("cursor-hover", !!(e.target as Element).closest("a,button"));
    };
    const preferences = () => { cookieTrigger.current = document.activeElement as HTMLElement; setCookie("manage"); };
    window.addEventListener("pointermove", move);
    window.addEventListener("k95-cookie-preferences", preferences);
    return () => { cancelAnimationFrame(preferenceFrame); window.removeEventListener("pointermove", move); window.removeEventListener("k95-cookie-preferences", preferences); };
  }, []);
  function saveCookie(value: string) {
    try { localStorage.setItem("k95-cookie-choice", value); } catch { /* Storage is optional. */ }
    setCookie("hidden"); cookieTrigger.current?.focus();
  }
  useEffect(() => {
    const activeDialog = cookie !== "hidden" ? cookieDialog.current : open ? menu.current : null;
    document.body.style.overflow = open || cookie !== "hidden" ? "hidden" : "";
    activeDialog?.querySelector<HTMLElement>("button,a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (cookie !== "hidden") { try { localStorage.setItem("k95-cookie-choice", "necessary"); } catch {} setCookie("hidden"); cookieTrigger.current?.focus(); }
        else if (open) { setOpen(false); menuButton.current?.focus(); }
      }
      if (event.key === "Tab" && activeDialog) {
        const focusable = activeDialog.querySelectorAll<HTMLElement>('a[href], button, input');
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, cookie]);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Link href="/en/" aria-label="K95 home" className="brand" onClick={() => setOpen(false)}><Image src={logo} width={95} height={32} alt="K95" priority /></Link>
      <nav aria-label="Main navigation" className="desktop-nav">{links.map(link => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href.slice(0,-1)) ? "active" : ""}><RollingText text={link.label} /></Link>)}<span className="language"><a href="https://k95.it/" lang="it" aria-label="Italian — original K95 website">IT</a><span>/</span><span aria-current="true">EN</span></span></nav>
      <button ref={menuButton} className="glass menu-button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "× CLOSE" : "• MENU"}</button>
    </header>
    {open && <div ref={menu} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><button className="menu-close glass" onClick={() => { setOpen(false); menuButton.current?.focus(); }}>× CLOSE</button><nav>{links.map(link => <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav><div className="language"><a href="https://k95.it/" lang="it">IT</a><span>/</span><span>EN</span></div><a className="mobile-email" href="mailto:info@k95.it">info@k95.it ↗</a></div>}
    {children}
    <div ref={cursor} className="custom-cursor" aria-hidden="true" />
    {cookie !== "hidden" && <div className="cookie-backdrop"><section ref={cookieDialog} className="cookie-dialog glass" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><button className="cookie-close" aria-label="Close cookie notice" onClick={() => saveCookie("necessary")}>×</button><h2 id="cookie-title">{cookie === "manage" ? "Cookie preferences" : "Cookies"}</h2><p>This local preview uses necessary browser storage to remember your cookie preference. No analytics or tracking scripts are loaded.</p><Link href="/en/privacy/" onClick={() => saveCookie("necessary")}>Cookie & Privacy</Link>{cookie === "manage" && <div className="cookie-necessary"><span>Necessary storage</span><strong>Always active</strong></div>}<div className="cookie-actions"><button onClick={() => saveCookie("accepted")}>{cookie === "manage" ? "Save preferences" : "Accept"}</button><button onClick={() => saveCookie("necessary")}>Reject optional cookies</button>{cookie !== "manage" && <button onClick={() => setCookie("manage")}>Manage preferences</button>}</div></section></div>}
  </>;
}
export function Footer() {
  return <footer className="full-footer"><a className="footer-email" href="mailto:info@k95.it"><RollingText text="info@k95.it" /><span>↗</span></a><div className="footer-columns"><div><p>© 2026 / K95 is a brand of<br />Arti Grafiche Leonardi</p><p>VAT ID 05462590877</p></div><nav aria-label="Footer navigation"><Link href="/en/">Home</Link>{links.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}<button onClick={() => window.dispatchEvent(new Event("k95-cookie-preferences"))}>Cookie preferences</button></nav><div><span className="eyebrow">Find us</span><a href="https://www.google.com/maps/search/?api=1&query=Via+Vittorio+Emanuele+II+140+Catania" target="_blank" rel="noreferrer">Via Vittorio Emanuele II, 140<br />Catania, Italia ↗</a></div><div><span className="eyebrow">Follow us</span><a href="https://www.instagram.com/k95studio/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.behance.net/K95" target="_blank" rel="noreferrer">Behance ↗</a><a href="https://shop.k95.it/" target="_blank" rel="noreferrer">Shop K95 ↗</a></div></div><Image className="footer-logo" src={logo} alt="K95" width={950} height={320} /></footer>;
}
