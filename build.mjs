import { mkdir, copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { homeRest, footer, pages } from './content.mjs';
const root=process.cwd();
const dist=path.join(root,'dist');
await mkdir(path.join(dist,'assets'),{recursive:true});
const shell=await readFile('index.html','utf8');
let origin='';
try { origin=(await readFile('.sites-runtime/origin.txt','utf8')).trim(); } catch{}
function metadata(html,title,description,route){return html.replace(/<title>.*?<\/title>/,`<title>${title} — FORMA</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${description}"><meta property="og:title" content="${title} — FORMA"><meta property="og:description" content="${description}"><meta property="og:type" content="website">${origin?`<link rel="canonical" href="${origin}${route}"><meta property="og:url" content="${origin}${route}">`:''}`).replace('</body>',`${footer}<script src="/assets/gsap.min.js" defer></script><script src="/assets/scroll-trigger.min.js" defer></script><script type="module" src="/scene.js"></script></body>`);}
await writeFile(path.join(dist,'index.html'),metadata(shell.replace('</main>',homeRest+'</main>'),'Digital craftsmanship','An independent studio shaping brands and digital experiences with lasting presence.','/'));
for(const [route,p] of Object.entries(pages)){const dir=path.join(dist,route);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),metadata(shell.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${p.html}</main>`),p.title,p.description,route));}
for(const file of ['styles.css','fonts.css','app.js','scene.js','sw.js','_headers'])await copyFile(file,path.join(dist,file));
for(const file of await readdir('assets'))if(/\.(webp|woff2|txt|mp4|js)$/i.test(file))await copyFile(path.join('assets',file),path.join(dist,'assets',file));
await writeFile(path.join(dist,'404.html'),metadata(shell.replace(/<main id="main">[\s\S]*?<\/main>/,'<main id="main"><section class="page-heading section"><p class="eyebrow">404 / A DIFFERENT DIRECTION</p><h1>This page has<br><em>moved out of frame.</em></h1><a class="glass" href="/">Back to the studio ↗</a></section></main>'),'Page not found','Return to the FORMA studio.','/404'));
console.log(`Built ${Object.keys(pages).length+1} pages in dist.`);
