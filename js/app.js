import {projects,logo,categories,services,team} from './data.js';

const app=document.querySelector('#app');
const header=document.querySelector('.site-header');
const overlay=document.querySelector('#overlay');
const cursor=document.querySelector('.custom-cursor');
const menuButton=document.querySelector('.menu-button');
const state={mode:'rings',view:'grid',category:'All',filters:false};
let disposeScene=null;
let renderVersion=0;
let previousFocus=null;
let dialogKind=null;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const projectLink=p=>`#/projects/${p.slug}`;
const picture=(src,alt,classes='',eager=false)=>`<img src="${esc(src)}" alt="${esc(alt)}" class="${classes}" loading="${eager?'eager':'lazy'}" decoding="async">`;
const rolling=text=>`<span class="rolling-text" aria-label="${esc(text)}">${[...text].map((c,i)=>`<span class="rolling-char" aria-hidden="true" style="--i:${i}"><span>${c===' '?'&nbsp;':esc(c)}</span><span>${c===' '?'&nbsp;':esc(c)}</span></span>`).join('')}</span>`;
const navLinks=[['#/works','All Works'],['#/studio','Studio'],['#/contacts','Contact']];

function footer(){return `<footer class="full-footer"><a class="footer-email" href="mailto:info@k95.it">${rolling('info@k95.it')}<span>↗</span></a><div class="footer-columns"><div><p>© 2026 / K95 is a brand of<br>Arti Grafiche Leonardi</p><p>VAT ID 05462590877</p></div><nav aria-label="Footer navigation"><a href="#/">Home</a>${navLinks.map(([url,label])=>`<a href="${url}">${label}</a>`).join('')}<button data-action="cookie-preferences">Cookie preferences</button></nav><div><span class="eyebrow">Find us</span><a href="https://www.google.com/maps/search/?api=1&query=Via+Vittorio+Emanuele+II+140+Catania" target="_blank" rel="noreferrer">Via Vittorio Emanuele II, 140<br>Catania, Italia ↗</a></div><div><span class="eyebrow">Follow us</span><a href="https://www.instagram.com/k95studio/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.behance.net/K95" target="_blank" rel="noreferrer">Behance ↗</a><a href="https://shop.k95.it/" target="_blank" rel="noreferrer">Shop K95 ↗</a></div></div>${picture(logo,'K95','footer-logo')}</footer>`;}

function closeDialog(restore=true){
  overlay.innerHTML='';overlay.hidden=true;dialogKind=null;
  app.inert=false;header.inert=false;document.body.style.overflow='';
  menuButton.setAttribute('aria-expanded','false');
  if(restore&&previousFocus?.isConnected)previousFocus.focus();
}
function showDialog(kind){
  if(!dialogKind)previousFocus=document.activeElement;
  dialogKind=kind;overlay.hidden=false;app.inert=true;header.inert=true;document.body.style.overflow='hidden';
  if(kind==='menu'){
    menuButton.setAttribute('aria-expanded','true');
    overlay.innerHTML=`<div class="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><button class="menu-close glass" data-action="close-dialog">× CLOSE</button><nav>${navLinks.map(([url,label])=>`<a href="${url}">${label}</a>`).join('')}</nav><div class="language"><a href="https://k95.it/" lang="it">IT</a><span>/</span><span>EN</span></div><a class="mobile-email" href="mailto:info@k95.it">info@k95.it ↗</a></div>`;
  }else{
    const manage=kind==='preferences';
    overlay.innerHTML=`<div class="cookie-backdrop"><section class="cookie-dialog glass" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><button class="cookie-close" aria-label="Close cookie notice" data-choice="necessary">×</button><h2 id="cookie-title">${manage?'Cookie preferences':'Cookies'}</h2><p>This local preview uses necessary browser storage to remember your cookie preference. No analytics or tracking scripts are loaded.</p><a href="#/privacy">Cookie & Privacy</a>${manage?'<div class="cookie-necessary"><span>Necessary storage</span><strong>Always active</strong></div>':''}<div class="cookie-actions"><button data-choice="accepted">${manage?'Save preferences':'Accept'}</button><button data-choice="necessary">Reject optional cookies</button>${manage?'':'<button data-action="cookie-preferences">Manage preferences</button>'}</div></section></div>`;
  }
  overlay.querySelector('button,a')?.focus();
}
function saveChoice(choice){try{localStorage.setItem('k95-vanilla-cookie-choice',choice);}catch{/* Optional storage may be disabled. */}closeDialog();}
function go(url){
  const hash=url.replace(/^\/en\/projects\//,'#/projects/').replace(/\/$/,'');
  location.hash=hash.startsWith('#')?hash:'#/';
}

async function home(version){
  app.innerHTML=`<main id="main" class="home-page" tabindex="-1"><h1 class="sr-only">K95 — Brand & Digital Design Studio</h1><div class="gallery-scene" tabindex="0" role="region" aria-label="Interactive artwork gallery. Scroll, drag, or use arrow keys to explore. Choose Works for an accessible project list."><div class="scene-loading" aria-label="Loading gallery"><span></span></div></div><div class="layout-switch glass" role="group" aria-label="Gallery layout"><span class="switch-pill ${state.mode==='spiral'?'switch-right':''}"></span><button data-mode="rings" aria-pressed="${state.mode==='rings'}">Rings</button><button data-mode="spiral" aria-pressed="${state.mode==='spiral'}">Spiral</button></div><div class="scene-caption glass" aria-live="polite"><span>SCROLL TO EXPLORE <span class="down-arrow">↓</span></span></div><footer class="home-footer"><span>Brand & Digital Design Studio</span><span>12 / 20 <span class="selected-word">selected </span><a href="#/works">Works</a></span><span>© 2026</span></footer><nav class="sr-only" aria-label="Selected projects">${projects.slice(0,12).map(p=>`<a href="${projectLink(p)}">${esc(p.title)}</a>`).join('')}</nav></main>`;
  const sceneElement=app.querySelector('.gallery-scene');
  const caption=app.querySelector('.scene-caption');
  const fallback=()=>{sceneElement.innerHTML=`<div class="scene-fallback">${projects.slice(0,12).map(p=>`<a href="${projectLink(p)}">${picture(p.image,p.title)}</a>`).join('')}</div>`;sceneElement.style.overflow='auto';};
  try{
    const {createGallery}=await import('./gallery.js');
    if(version!==renderVersion)return;
    sceneElement.innerHTML='';
    disposeScene=createGallery(sceneElement,{state,onFailure:fallback,navigate:go,onSelect:index=>{
      if(index===null){caption.innerHTML='<span>SCROLL TO EXPLORE <span class="down-arrow">↓</span></span>';return;}
      const p=projects[index];caption.innerHTML=`<a href="${projectLink(p)}"><span>↗</span><span>${esc(p.title)}<small>${esc(p.categories.join(', '))}</small></span></a>`;
    }})||null;
  }catch(error){console.error('Gallery initialization failed:',error);if(version===renderVersion)fallback();}
}
function works(){
  const visible=projects.filter(p=>state.category==='All'||p.categories.includes(state.category));
  app.innerHTML=`<main id="main" class="works-page" tabindex="-1"><h1 class="sr-only">All works — Studio K95</h1><div class="works-view-switch glass" role="group" aria-label="View mode"><span class="switch-pill ${state.view==='list'?'switch-right':''}"></span><button data-view="grid" aria-pressed="${state.view==='grid'}">Grid</button><button data-view="list" aria-pressed="${state.view==='list'}">List</button></div><p class="sr-only" role="status">${visible.length} projects. ${esc(state.category)}.</p><div class="${state.view==='grid'?'works-grid':'works-list'}">${visible.map(p=>`<a href="${projectLink(p)}" class="${state.view==='grid'?'work-card':'work-row'}">${state.view==='grid'?`<div class="work-image">${picture(p.image,p.title)}</div><div class="work-meta"><span>${esc(p.title)}</span><span>↗</span></div>`:`<small>${p.number}</small><span>${esc(p.title)}</span><div class="list-preview">${picture(p.image,'')}</div>`}</a>`).join('')}</div><div class="filter-dock">${state.filters?`<div id="category-filters" class="filter-panel glass" role="group" aria-label="Filter by discipline"><button class="filter-close" data-action="toggle-filters" aria-label="Close filters">×</button>${categories.map(c=>`<button data-category="${esc(c)}" aria-pressed="${state.category===c}"><span>${esc(c)}</span><span>(${c==='All'?projects.length:projects.filter(p=>p.categories.includes(c)).length})</span></button>`).join('')}</div>`:''}<button class="filter-toggle glass" data-action="toggle-filters" aria-expanded="${state.filters}" ${state.filters?'aria-controls="category-filters"':''}>• &nbsp;${esc(state.category)} <sup>(${visible.length})</sup></button></div></main>`;
}
function project(slug){
  const index=projects.findIndex(p=>p.slug===slug);if(index<0){notFound();return;}
  const p=projects[index],next=projects[(index+1)%projects.length];document.title=p.title+' — K95';
  app.innerHTML=`<main id="main" class="project-page" tabindex="-1"><div class="project-topline"><a class="glass" href="#/works">↖ All works</a><span>${p.number} / ${projects.length}</span></div><h1 class="project-heading">${esc(p.title)}</h1><div class="project-description"><div><span class="eyebrow">${esc(p.categories.join(' / '))}</span><span class="eyebrow">Studio K95 — Catania, Italy</span></div><p>${esc(p.description)}</p></div>${picture(p.image,p.title,'project-cover',true)}<div class="project-gallery">${p.gallery.slice(1).map((src,i)=>`<figure>${picture(src,p.title+' — project image '+(i+2))}</figure>`).join('')}</div><a href="${projectLink(next)}" class="next-project"><div><span class="eyebrow">Next project</span><strong>${esc(next.title)}</strong></div><span>↗</span></a></main>${footer()}`;
}
function studio(){
  app.innerHTML=`<main id="main" tabindex="-1"><section class="page-intro"><div class="studio-orbit" aria-hidden="true"></div><h1>Studio</h1><button class="intro-scroll glass" data-scroll="about">SCROLL ↓</button><div class="intro-bottom"><span>Based in Catania / Sicily<br>Since 2017</span><span>Branding / Digital / Type / Packaging</span></div></section><section id="about" class="content-section"><span class="eyebrow">Our attitude</span><h2 class="studio-statement">We don’t just design<br>We define attitudes</h2><div class="studio-copy"><p>We are an Italian graphic design and communication studio. But above all, we are people who simply cannot do things “the way they have always been done”.</p><p>Curious, hungry, rebellious: we are driven by the desire to build something with meaning, character and identity.</p><p>We founded K95 in 2017 to bring together different professional paths and create a studio capable of competing in the world of design, both nationally and internationally. For us, innovation is a method. Experimentation is a discipline.</p></div></section><section class="content-section"><h2 class="services-title">Services</h2>${services.map(([name,description],i)=>`<details class="service"><summary><span><small class="eyebrow">0${i+1}</small>${esc(name)}</span></summary><p>${esc(description)}</p></details>`).join('')}</section><section class="content-section"><h2 class="services-title">Team</h2><div class="team-grid">${team.map(([name,role])=>`<article class="team-person"><h3>${esc(name)}</h3><p>${esc(role)}</p></article>`).join('')}</div></section></main>${footer()}`;
}
function contact(){app.innerHTML=`<main id="main" tabindex="-1"><section class="page-intro contact-intro"><h1>Contact</h1><button data-scroll="contact-details" class="intro-scroll glass">SCROLL ↓</button><div class="intro-bottom"><span>Let’s make something meaningful</span><span>Catania, Italia</span></div></section><section id="contact-details" class="content-section contact-body"><h2>Contact<br>K95 Studio</h2><div class="contact-detail"><p>Contact K95 Studio for brand identity, digital design and web development projects.</p><address>Via Vittorio Emanuele II, 140<br>Catania, Italia</address><a href="mailto:info@k95.it" class="contact-email">info@k95.it ↗</a></div></section></main>${footer()}`;}
function privacy(){app.innerHTML=`<main id="main" class="privacy-page" tabindex="-1"><h1>Cookie & Privacy</h1><p>This is a local reconstruction of the K95 website for design study. This preview does not load analytics, advertising, or third-party tracking scripts.</p><h2>Necessary browser storage</h2><p>The key <code>k95-vanilla-cookie-choice</code> in local storage remembers your cookie selection. It contains no personal information. Use Cookie preferences in the footer to change your selection.</p><h2>External destinations</h2><p>Email, social, maps, shop, and Italian-language links open external services. Those services have their own privacy policies. No form data is collected here.</p><h2>Original website</h2><p>Visit <a href="https://k95.it/en/privacy">K95’s official Cookie & Privacy page ↗</a> for the original policy. Artwork, branding, typography and source copy remain the property of their respective owners.</p></main>${footer()}`;}
function notFound(){document.title='Page not found — K95';app.innerHTML='<main id="main" class="not-found" tabindex="-1"><h1>404</h1><p>This page could not be found.</p><a href="#/works">Explore all works ↗</a></main>';}
function render(initial=false){
  renderVersion++;if(disposeScene){disposeScene();disposeScene=null;}
  closeDialog(false);state.filters=false;
  let route;try{route=decodeURIComponent(location.hash.replace(/^#\/?/,'').replace(/\/$/,''));}catch{route='404';}
  for(const link of header.querySelectorAll('.desktop-nav>a')){const active=link.hash==='#/'+route;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
  document.title='K95 — Brand & Digital Design Studio';
  if(!route)home(renderVersion);
  else if(route==='works'){document.title='Works — K95';works();}
  else if(route.startsWith('projects/'))project(route.slice(9));
  else if(route==='studio'){document.title='Studio — K95';studio();}
  else if(route==='contacts'){document.title='Contact — K95';contact();}
  else if(route==='privacy'){document.title='Cookie & Privacy — K95';privacy();}
  else notFound();
  window.scrollTo({top:0,behavior:'instant'});
  if(!initial)app.querySelector('main')?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
  const element=event.target.closest('button,a');if(!element)return;
  if(element.matches('[data-mode]')){
    state.mode=element.dataset.mode;
    const group=element.closest('.layout-switch');group.querySelector('.switch-pill').classList.toggle('switch-right',state.mode==='spiral');
    group.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
  }else if(element.matches('[data-view]')){state.view=element.dataset.view;works();app.querySelector(`[data-view="${state.view}"]`)?.focus({preventScroll:true});}
  else if(element.matches('[data-category]')){state.category=element.dataset.category;state.filters=false;works();app.querySelector('.filter-toggle')?.focus({preventScroll:true});}
  else if(element.dataset.action==='toggle-filters'){state.filters=!state.filters;works();app.querySelector(state.filters?'.filter-close':'.filter-toggle')?.focus({preventScroll:true});}
  else if(element.dataset.action==='menu')showDialog('menu');
  else if(element.dataset.action==='close-dialog')closeDialog();
  else if(element.dataset.action==='cookie-preferences')showDialog('preferences');
  else if(element.dataset.choice)saveChoice(element.dataset.choice);
  else if(element.dataset.scroll){document.getElementById(element.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  else if(element.hash?.startsWith('#/')){if(element.hash===location.hash){event.preventDefault();closeDialog(false);render();}}
});
document.addEventListener('pointerdown',event=>{
  if(state.filters&&!event.target.closest('.filter-dock')){
    state.filters=false;app.querySelector('.filter-panel')?.remove();
    app.querySelector('.filter-toggle')?.setAttribute('aria-expanded','false');
  }
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    if(dialogKind){if(dialogKind==='menu')closeDialog();else saveChoice('necessary');}
    else if(state.filters){state.filters=false;works();app.querySelector('.filter-toggle')?.focus();}
  }
  if(event.key==='Tab'&&dialogKind){
    const nodes=overlay.querySelectorAll('button,a[href]');const first=nodes[0],last=nodes[nodes.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
document.addEventListener('pointermove',event=>{
  cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;
  cursor.classList.toggle('cursor-hover',Boolean(event.target.closest('a,button,summary')));
},{passive:true});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();app.querySelector('main')?.focus();});
window.addEventListener('hashchange',()=>render());
window.addEventListener('pagehide',()=>{disposeScene?.();disposeScene=null;});
window.addEventListener('pageshow',event=>{if(event.persisted)render(true);});
header.querySelectorAll(".desktop-nav>a").forEach(link=>{link.innerHTML=rolling(link.textContent);});
render(true);
try{if(!localStorage.getItem('k95-vanilla-cookie-choice'))showDialog('cookies');}catch{showDialog('cookies');}
