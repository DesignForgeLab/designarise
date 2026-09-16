const hasMatchMedia=typeof window!=='undefined'&&typeof window.matchMedia==='function';
const reduceQuery=hasMatchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
let reduced=reduceQuery?reduceQuery.matches:false;
const fine=hasMatchMedia?window.matchMedia('(hover:hover) and (pointer:fine)').matches:false;

if(typeof window!=='undefined'&&typeof document!=='undefined'){
const nav=document.querySelector('.nav');const film=document.querySelector('#hero-video');const track=document.querySelector('.hero-track');const heroCopy=document.querySelector('.hero-copy');const progressEl=document.querySelector('.progress');
let target=0,current=0,raf=0,visible=true,heroCompleted=false,heroTrigger=null;
const clamp=x=>Math.max(0,Math.min(1,x));
function renderHeroFrame(p){
  if(!film)return;
  if(Number.isFinite(film.duration)&&!film.seeking){
    const t=reduced?0:p*Math.max(0,film.duration-.045);
    if(Math.abs(film.currentTime-t)>.02)film.currentTime=t;
  }
  film.style.transform=reduced?'none':`scale(${1+p*.055})`;
  if(progressEl)progressEl.style.width=`${p*100}%`;
  if(heroCopy){
    heroCopy.style.transform=reduced?'none':`translateY(${-p*75}px)`;
    const op=p<.55?1:Math.max(0,1-(p-.55)/.4);
    heroCopy.style.opacity=reduced?'1':String(op);
    if(p>=.98)heroCopy.style.pointerEvents='none';
  }
  dispatchEvent(new CustomEvent('hero-progress',{detail:p}));
}
function lockHeroCompleted(){
  if(heroCompleted)return;
  heroCompleted=true;current=1;target=1;
  if(raf){cancelAnimationFrame(raf);raf=0;}
  if(film){
    if(Number.isFinite(film.duration))film.currentTime=Math.max(0,film.duration-.045);
    film.style.transform=reduced?'none':`scale(${1+.055})`;
  }
  if(heroCopy){
    heroCopy.style.transform=reduced?'none':'translateY(-75px)';
    heroCopy.style.opacity='0';
    heroCopy.style.pointerEvents='none';
  }
  if(progressEl)progressEl.style.width='100%';
  dispatchEvent(new CustomEvent('hero-progress',{detail:1}));
  if(heroTrigger){heroTrigger.disable(false);}
}
function animate(t){
  raf=0;
  if(heroCompleted||!visible||document.hidden)return;
  current+=(target-current)*.18;
  if(Math.abs(current-target)<.002)current=target;
  if(current>=.995||target>=1){
    lockHeroCompleted();
    return;
  }
  renderHeroFrame(current);
  if(Math.abs(current-target)>.001||(film&&film.seeking))raf=requestAnimationFrame(animate);
}
function kick(){
  if(heroCompleted)return;
  if(!raf&&film&&visible&&!document.hidden)raf=requestAnimationFrame(animate);
}
function onScroll(){
  nav.classList.toggle('compact',scrollY>50);
  if(heroCompleted||reduced||!track)return;
  const maxScroll=track.offsetHeight-innerHeight;
  if(maxScroll<=0)return;
  const p=clamp(-track.getBoundingClientRect().top/maxScroll);
  if(p>=1){
    lockHeroCompleted();
    return;
  }
  target=p;
  kick();
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
if(film){
  film.addEventListener('loadedmetadata',()=>{if(!heroCompleted){renderHeroFrame(current);kick();}});
  film.addEventListener('seeked',()=>{if(!heroCompleted)kick();});
  new IntersectionObserver(([e])=>{
    visible=e.isIntersecting;
    if(heroCompleted)return;
    if(visible)kick();
    else{cancelAnimationFrame(raf);raf=0;}
  }).observe(track);
  document.addEventListener('visibilitychange',()=>{if(!heroCompleted)kick();});
}
addEventListener('load',()=>{
  if(window.gsap&&window.ScrollTrigger&&!reduced){
    gsap.registerPlugin(ScrollTrigger);
    if(track&&!heroCompleted){
      heroTrigger=ScrollTrigger.create({
        trigger:track,
        start:'top top',
        end:'bottom bottom',
        onUpdate:self=>{
          if(heroCompleted)return;
          if(self.progress>=1){
            lockHeroCompleted();
            return;
          }
          target=self.progress;
          kick();
        }
      });
    }
    gsap.utils.toArray('.reveal,.intro h2,.intro-copy,.process-grid article').forEach(el=>gsap.from(el,{y:30,opacity:.35,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    document.querySelectorAll('[data-count]').forEach(el=>{let obj={n:0};gsap.to(obj,{n:Number(el.dataset.count),duration:1.4,scrollTrigger:{trigger:el,start:'top 90%',once:true},onUpdate:()=>el.textContent=Math.round(obj.n)});});
  }
});
const modal=document.querySelector('#mobile-menu'),menu=document.querySelector('.menu');menu?.addEventListener('click',()=>{modal.showModal();menu.setAttribute('aria-expanded','true');});document.querySelector('.close-menu')?.addEventListener('click',()=>modal.close());modal?.addEventListener('close',()=>{menu.setAttribute('aria-expanded','false');menu.focus();});modal?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>modal.close()));
const cursor=document.querySelector('.custom-cursor');if(fine&&cursor){addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});document.querySelectorAll('a,button,summary').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.add('hover');cursor.textContent=el.dataset.cursor||'';});el.addEventListener('pointerleave',()=>{cursor.classList.remove('hover');cursor.textContent='';});});document.querySelectorAll('.project-image').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced)return;const r=el.getBoundingClientRect();el.style.transform=`perspective(1400px) rotateX(${-(e.clientY-r.top-r.height/2)/r.height*4}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*4}deg)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});}
const rail=document.querySelector('.projects');if(rail){const cards=[...rail.children],prev=document.querySelector('[data-prev]'),next=document.querySelector('[data-next]');let index=0,drag=false,moved=false,x=0,start=0,lastX=0,velocity=0,inertia=0;function update(){index=cards.reduce((best,c,i)=>Math.abs(c.offsetLeft-rail.offsetLeft-rail.scrollLeft)<Math.abs(cards[best].offsetLeft-rail.offsetLeft-rail.scrollLeft)?i:best,0);cards.forEach((c,i)=>c.classList.toggle('active',i===index));prev.disabled=index===0;next.disabled=index===cards.length-1;document.querySelector('.project-count').textContent=`0${index+1} / 03`;}function go(i){rail.scrollTo({left:cards[Math.max(0,Math.min(2,i))].offsetLeft-rail.offsetLeft,behavior:reduced?'instant':'smooth'});}prev.onclick=()=>go(index-1);next.onclick=()=>go(index+1);rail.addEventListener('scroll',update,{passive:true});rail.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}});rail.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;if((e.deltaY>0&&rail.scrollLeft<rail.scrollWidth-rail.clientWidth-2)||(e.deltaY<0&&rail.scrollLeft>2)){e.preventDefault();rail.scrollLeft+=e.deltaY;}},{passive:false});rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag=true;moved=false;x=e.clientX;lastX=x;start=rail.scrollLeft;velocity=0;cancelAnimationFrame(inertia);rail.style.scrollSnapType='none';});addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-x;if(Math.abs(delta)>5)moved=true;velocity=lastX-e.clientX;lastX=e.clientX;rail.scrollLeft=start-delta;if(moved){cursor.textContent='DRAG';cursor.classList.add('hover');}});function endDrag(){if(!drag)return;drag=false;function coast(){velocity*=.9;rail.scrollLeft+=velocity;if(Math.abs(velocity)>.3&&!reduced)inertia=requestAnimationFrame(coast);else{rail.style.scrollSnapType='x mandatory';update();}}coast();}addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);rail.addEventListener('dragstart',e=>e.preventDefault());rail.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);update();}
const quotes=['“The details are not the finishing touch. They are the work.”','“Nothing should move without a reason.”','“A distinct point of view is the beginning of good design.”'];document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#quote-text').textContent=quotes[Number(b.dataset.quote)];document.querySelectorAll('[data-quote]').forEach(q=>q.setAttribute('aria-pressed',String(q===b)));}));
function setMotion(value){reduced=value;document.body.classList.toggle('reduce-motion',value);const motionToggle=document.querySelector('#motion-toggle');if(motionToggle)motionToggle.textContent=value?'Enable motion':'Reduce motion';if(value){if(!heroCompleted)target=current=0;window.ScrollTrigger?.getAll().forEach(t=>t.disable(false));document.querySelectorAll('.reveal,.intro h2,.intro-copy,.process-grid article').forEach(el=>{el.style.opacity='1';el.style.transform='none';});if(heroCompleted&&heroCopy){heroCopy.style.opacity='0';heroCopy.style.transform='none';}}else{window.ScrollTrigger?.getAll().forEach(t=>{if(t!==heroTrigger||!heroCompleted)t.enable();});}dispatchEvent(new CustomEvent('motion-change',{detail:value}));if(!heroCompleted){renderHeroFrame(current);onScroll();kick();}}document.querySelector('#motion-toggle')?.addEventListener('click',()=>setMotion(!reduced));reduceQuery?.addEventListener?.('change',e=>setMotion(e.matches));if(reduced)setMotion(true);
document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',e=>{const u=new URL(a.href);if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||u.origin!==location.origin||u.pathname===location.pathname||reduced)return;e.preventDefault();document.querySelector('.page-curtain').classList.add('depart');setTimeout(()=>location.assign(u.href),450);}));addEventListener('pageshow',()=>document.querySelector('.page-curtain')?.classList.remove('depart'));
const form=document.querySelector('#contact-form');let mockReady=null;if(form&&'serviceWorker' in navigator){mockReady=navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{if(navigator.serviceWorker.controller)return;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('The demo connection is not ready. Please reload and try again.')),6000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(timer);resolve();},{once:true});});});mockReady.catch(()=>{});}
form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=document.querySelector('#form-status'),button=form.querySelector('button[type=submit]');status.className='';status.textContent='Sending your demo inquiry…';button.disabled=true;button.textContent='Sending…';try{if(!mockReady)throw new Error('This browser cannot run the demo form. Please try a browser with service worker support.');await mockReady;const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(10000)});const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||'Something went wrong. Please try again.');status.className='success';status.textContent='Thank you. We’ll be in touch shortly. Demo complete — your inquiry was not stored or delivered.';form.reset();}catch(err){status.className='error';status.textContent=err.message||'Unable to connect. Please try again.';}finally{button.disabled=false;button.innerHTML='Send demo inquiry <span>↗</span>';}});
}


