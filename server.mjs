import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = (query) => ({
    matches: false,
    media: query || '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
const defaultRoot=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
export const securityHeaders={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"};
export function createSiteServer(siteRoot=defaultRoot){return http.createServer(async(req,res)=>{for(const[n,v]of Object.entries(securityHeaders))res.setHeader(n,v);if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/')pathname='/index.html';if(!/^\/(?:assets\/[a-zA-Z0-9.-]+\.(?:webp|woff2|mp4|js)|(?:styles|fonts)\.css|(?:app|scene|sw)\.js|index\.html|(?:work\/(?:arc|verdant|forma)|studio|contact|insights(?:\/(?:the-art-of-restraint|motion-with-meaning|a-more-considered-web))?)\/?)$/.test(pathname)){res.writeHead(404);return res.end('Not found');}if(pathname==='/'||!path.extname(pathname))pathname=pathname.replace(/\/$/,'')+'/index.html';const content=await readFile(path.join(siteRoot,pathname.slice(1)));let start=0,end=content.length-1,status=200;const range=req.headers.range;if(range&&pathname.endsWith('.mp4')){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(m){start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;if(start>end){res.writeHead(416,{'Content-Range':`bytes */${content.length}`});return res.end();}status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${content.length}`);}}res.writeHead(status,{'Content-Type':types[path.extname(pathname)],'Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content.subarray(start,end+1));}catch{res.writeHead(404);res.end('Not found');}});}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const port=Number(process.env.PORT||3016);createSiteServer().listen(port,'127.0.0.1',()=>console.log(`FORMA preview: http://localhost:${port}`));}

