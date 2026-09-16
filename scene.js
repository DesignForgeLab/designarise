// Adaptive WebGL layer; synchronized with the film through the hero timeline.
import * as THREE from '/assets/three.module.js';
if(typeof window!=='undefined'&&typeof document!=='undefined'){
const hero=document.querySelector('.hero');
const hasMatchMedia=typeof window.matchMedia==='function';
const prefersReduced=hasMatchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(hero&&!prefersReduced){
try{
const isSmallScreen=hasMatchMedia&&window.matchMedia('(max-width:800px)').matches;
const low=isSmallScreen||(typeof navigator!=='undefined'&&navigator.hardwareConcurrency<=4);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:!low,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.5));renderer.setSize(hero.clientWidth,hero.clientHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.domElement.setAttribute('aria-hidden','true');hero.insertBefore(renderer.domElement,hero.querySelector('.hero-label'));
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,hero.clientWidth/hero.clientHeight,.1,100);camera.position.set(0,0,9);
const envScene=new THREE.Scene();envScene.background=new THREE.Color('#645546');
for(const [x,y,z,w,h,power] of [[-4,3,2,3,6,5],[4,2,1,2,7,7],[0,5,-4,8,2,4]]){const light=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color('#fff0dc').multiplyScalar(power)}));light.position.set(x,y,z);light.lookAt(0,0,0);envScene.add(light);}
const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.04);scene.environment=env.texture;
const sculpture=new THREE.Group();
const material=new THREE.MeshPhysicalMaterial({color:'#baa389',metalness:1,roughness:.22,clearcoat:.6,clearcoatRoughness:.18,envMapIntensity:1.1});
const ring=new THREE.Mesh(new THREE.TorusKnotGeometry(1,.22,low?100:200,low?12:24,2,3),material);ring.scale.set(1,1.15,.6);sculpture.add(ring);sculpture.scale.setScalar(low?.48:.62);sculpture.position.set(low?1.6:2.8,.45,0);sculpture.rotation.set(.3,.1,-.5);scene.add(sculpture);
scene.add(new THREE.HemisphereLight('#fff1dd','#302218',2));const key=new THREE.DirectionalLight('#fff1d8',3);key.position.set(-3,5,5);scene.add(key);
let running=false,active=true,frame=0,prev=0,slow=0;let current=0;let target=0;
function render(t){if(!active)return;frame=requestAnimationFrame(render);if(low&&t-prev<33)return;if(prev&&t-prev>48)slow++;if(slow>45){renderer.setPixelRatio(.8);slow=0;}prev=t;current+=(target-current)*.055;sculpture.rotation.y=.1+current*.65;sculpture.rotation.z=-.5+current*.25;sculpture.position.z=-current*2;camera.position.x=Math.sin(current*1.4)*.25;camera.position.z=9-current*.45;camera.lookAt(0,0,0);renderer.domElement.style.opacity=String((low?.3:.82)*(1-Math.max(0,current-.75)*4));renderer.render(scene,camera);}
addEventListener('hero-progress',e=>{target=e.detail;});
const observer=new IntersectionObserver(([e])=>{active=e.isIntersecting&&!document.hidden&&!document.body.classList.contains('reduce-motion');cancelAnimationFrame(frame);if(active)frame=requestAnimationFrame(render);});observer.observe(hero);
addEventListener('resize',()=>{renderer.setSize(hero.clientWidth,hero.clientHeight);camera.aspect=hero.clientWidth/hero.clientHeight;camera.updateProjectionMatrix();});
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);active=!document.hidden&&hero.getBoundingClientRect().bottom>0;if(active)frame=requestAnimationFrame(render);});
addEventListener('motion-change',e=>{active=!e.detail;renderer.domElement.hidden=e.detail;cancelAnimationFrame(frame);if(active)frame=requestAnimationFrame(render);});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();active=false;cancelAnimationFrame(frame);renderer.domElement.hidden=true;});
}catch{ /* Film and type remain the complete fallback when WebGL is unavailable. */ }
}
}

