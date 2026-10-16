"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { logo, projects } from "./data";

type Props = { mode: "rings" | "spiral"; onFailure: () => void; onSelect: (index: number | null) => void };
export function GalleryScene({ mode, onFailure, onSelect }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);
  const selectRef = useRef(onSelect);
  const failRef = useRef(onFailure);
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { selectRef.current = onSelect; failRef.current = onFailure; }, [onSelect,onFailure]);
  useEffect(() => {
    const container = mount.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch { failRef.current(); return; }
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    const setReduced = () => { reduced = reducedQuery.matches; };
    reducedQuery.addEventListener("change", setReduced);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x1500e1, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
    camera.position.z = 11;
    const gallery = new THREE.Group(); scene.add(gallery);
    const loader = new THREE.TextureLoader();
    const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
    const textures: THREE.Texture[] = [];
    let disposed = false;
    const vertex = `uniform float uTime;uniform float uBend;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.y*3.14159+uTime*.65)*.055*uBend;p.z-=(p.x*p.x)*.1*uBend;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
    const fragment = `uniform sampler2D uTexture;uniform float uHover;varying vec2 vUv;void main(){vec4 color=texture2D(uTexture,vUv);color.rgb*=1.+uHover*.12;gl_FragColor=color;\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}`;
    const selection=projects.slice(0,12);
    [...selection,...selection].forEach((project, i) => {
      const texture = loader.load(project.image, loaded => {
        if(disposed) {loaded.dispose();return;}
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      });
      texture.colorSpace=THREE.SRGBColorSpace; textures.push(texture);
      const material = new THREE.ShaderMaterial({ uniforms: { uTexture: { value: texture }, uTime: { value: 0 }, uBend: { value: reduced ? 0 : 1 }, uHover: { value: 0 } }, vertexShader: vertex, fragmentShader: fragment, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.65,2.25,12,16), material);
      mesh.userData.projectIndex=i%12;
      gallery.add(mesh); planes.push(mesh);
    });
    // Curved grid gives the gallery a continuous spatial backdrop.
    const gridPoints: THREE.Vector3[]=[];
    for(let x=-22;x<=22;x+=1.1) for(let y=-18;y<18;y+=.5){gridPoints.push(new THREE.Vector3(x,y,-7+(x*x)*.012),new THREE.Vector3(x,y+.5,-7+(x*x)*.012));}
    for(let y=-18;y<=18;y+=1.1) for(let x=-22;x<22;x+=.5){gridPoints.push(new THREE.Vector3(x,y,-7+(x*x)*.012),new THREE.Vector3(x+.5,y,-7+((x+.5)**2)*.012));}
    const grid = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPoints),new THREE.LineBasicMaterial({color:0x07006f,transparent:true,opacity:.36}));
    scene.add(grid);
    const emblem = new THREE.Group(); scene.add(emblem);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room,.04);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.AmbientLight(0xffffff,1.6));
    const light = new THREE.DirectionalLight(0xffffff,5);light.position.set(2,5,8);scene.add(light);
    const metal = new THREE.MeshPhysicalMaterial({color:0xe4e8ee,metalness:1,roughness:.19,clearcoat:1,envMapIntensity:2.2});
    const logoGeometries: THREE.ExtrudeGeometry[]=[];
    new SVGLoader().load(logo, data => {
      if(disposed)return;
      const emblemShape = new THREE.Group();
      data.paths.forEach(p => SVGLoader.createShapes(p).forEach(shape => {
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:7,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:1.0,bevelThickness:1.2,curveSegments:10});
        logoGeometries.push(geometry);emblemShape.add(new THREE.Mesh(geometry,metal));
      }));
      const box = new THREE.Box3().setFromObject(emblemShape);
      const center = box.getCenter(new THREE.Vector3());
      emblemShape.position.copy(center).multiplyScalar(-1);
      const normalized=new THREE.Group();normalized.add(emblemShape);normalized.scale.setScalar(.033);normalized.scale.y*=-1;
      emblem.add(normalized);
    });
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(4,4);
    const parallax = new THREE.Vector2();
    let frame=0, rotation=.12, desiredRotation=.12, layout=0, dragging=false, downX=0, downY=0, moved=false, hovered:number|null=null, lastTime=0, visible=true;
    const last = new THREE.Vector2();
    function updatePointer(e: PointerEvent) {
      const bounds=container!.getBoundingClientRect();
      pointer.set(((e.clientX-bounds.left)/bounds.width)*2-1,-((e.clientY-bounds.top)/bounds.height)*2+1);
      parallax.set(pointer.x,pointer.y);
    }
    function move(e:PointerEvent) {
      updatePointer(e);
      if(dragging){desiredRotation+=((e.clientX-last.x)+(e.clientY-last.y)*.65)*.004;moved ||= Math.hypot(e.clientX-downX,e.clientY-downY)>7;last.set(e.clientX,e.clientY);}
    }
    function down(e:PointerEvent) { dragging=true;moved=false;downX=e.clientX;downY=e.clientY;last.set(e.clientX,e.clientY);container!.setPointerCapture(e.pointerId);updatePointer(e); }
    function up(e:PointerEvent) {
      dragging=false;if(container!.hasPointerCapture(e.pointerId))container!.releasePointerCapture(e.pointerId);
      if(e.type!=="pointercancel"&&!moved && hovered!==null)routerRef.current.push(`/en/projects/${projects[hovered].slug}/`);
    }
    function leave(){if(!dragging){pointer.set(4,4);parallax.set(0,0);}}
    function wheel(e:WheelEvent){e.preventDefault();desiredRotation+=Math.max(-120,Math.min(120,e.deltaY+e.deltaX))*.0025;}
    function key(e:KeyboardEvent){if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();desiredRotation+=.32;}if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();desiredRotation-=.32;}}
    function resize(){const w=container!.clientWidth,h=container!.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<769?60:50;camera.position.z=w<769?7:11;camera.updateProjectionMatrix();}
    function visibility(){visible=!document.hidden;}
    const observer=new ResizeObserver(resize);observer.observe(container);resize();
    container.addEventListener("pointermove",move);container.addEventListener("pointerdown",down);container.addEventListener("pointerup",up);container.addEventListener("pointercancel",up);container.addEventListener("pointerleave",leave);container.addEventListener("wheel",wheel,{passive:false});container.addEventListener("keydown",key);document.addEventListener("visibilitychange",visibility);
    function animate(time:number) {
      frame=requestAnimationFrame(animate);
      const delta=Math.min((time-lastTime)/1000,.04);lastTime=time;
      if(!visible)return;
      if(!reduced&&!dragging)desiredRotation+=delta*.025;
      rotation=THREE.MathUtils.damp(rotation,desiredRotation,7,delta);
      layout=THREE.MathUtils.damp(layout,modeRef.current==="spiral"?1:0,reduced?100:4,delta);
      const mobile=camera.aspect<.85;
      planes.forEach((mesh,i)=>{
        const ring=Math.floor(i/8),col=i%8;
        const angle=col/8*Math.PI*2+rotation+(ring%2)*.39;
        const x=Math.sin(angle)*(mobile?5:6.2),y=(ring-1)*3.35,z=Math.cos(angle)*2.8-1.8;
        const spiralAngle=i*.78+rotation;
        const sx=Math.sin(spiralAngle)*(mobile?4.6:5.6),sy=(i-11.5)*.62,sz=Math.cos(spiralAngle)*2.8-1.8;
        mesh.position.set(THREE.MathUtils.lerp(x,sx,layout),THREE.MathUtils.lerp(y,sy,layout),THREE.MathUtils.lerp(z,sz,layout));
        mesh.rotation.y=THREE.MathUtils.lerp(Math.sin(angle)*-.28,Math.sin(spiralAngle)*-.34,layout);
        mesh.rotation.z=reduced?0:Math.sin(time*.00025+i)*.035;
        const scale=hovered===i%12?1.06:1;mesh.scale.lerp(new THREE.Vector3(scale,scale,scale),.12);
        mesh.material.uniforms.uTime.value=time*.001+i;
        mesh.material.uniforms.uBend.value=reduced?0:1;
        mesh.material.uniforms.uHover.value=THREE.MathUtils.damp(mesh.material.uniforms.uHover.value,hovered===i%12?1:0,8,delta);
      });
      emblem.rotation.set(.2+(reduced?0:Math.sin(time*.0003)*.15),reduced?-.4:time*.00025,-.25);
      emblem.position.z=-.1;emblem.position.y=Math.sin(time*.0005)*.12*(reduced?0:1);
      camera.position.x=THREE.MathUtils.damp(camera.position.x,reduced?0:parallax.x*.3,3,delta);
      camera.position.y=THREE.MathUtils.damp(camera.position.y,reduced?0:parallax.y*.2,3,delta);camera.lookAt(0,0,-1);
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(planes,false)[0];
      const next=hit?hit.object.userData.projectIndex as number:null;
      if(next!==hovered){hovered=next;selectRef.current(next);container!.style.cursor=next!==null?"pointer":dragging?"grabbing":"grab";}
      renderer.render(scene,camera);
    }
    frame=requestAnimationFrame(animate);
    function contextLost(e:Event){e.preventDefault();failRef.current();}
    renderer.domElement.addEventListener("webglcontextlost",contextLost);
    return () => {
      disposed=true;cancelAnimationFrame(frame);observer.disconnect();reducedQuery.removeEventListener("change",setReduced);document.removeEventListener("visibilitychange",visibility);
      container.removeEventListener("pointermove",move);container.removeEventListener("pointerdown",down);container.removeEventListener("pointerup",up);container.removeEventListener("pointercancel",up);container.removeEventListener("pointerleave",leave);container.removeEventListener("wheel",wheel);container.removeEventListener("keydown",key);
      renderer.domElement.removeEventListener("webglcontextlost",contextLost);
      planes.forEach(m=>{m.geometry.dispose();m.material.dispose();});textures.forEach(t=>t.dispose());logoGeometries.forEach(g=>g.dispose());metal.dispose();environment.dispose();grid.geometry.dispose();(grid.material as THREE.Material).dispose();renderer.dispose();renderer.domElement.remove();
    };
  }, []);
  return <div ref={mount} className="gallery-scene" tabIndex={0} role="region" aria-label="Interactive artwork gallery. Scroll, drag, or use arrow keys to explore. Choose Works for an accessible project list." />;
}
