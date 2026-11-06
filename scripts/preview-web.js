import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { characters } from '../characters/catalog.js';
import { characterIdFromUrl } from '../web/character-links.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
export function createPreviewServer(directory = root) {
return http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    const characterRoute=pathname.startsWith('/character/') && characterIdFromUrl(url.href,characters);
    const file=path.resolve(directory,'.'+(pathname==='/' || characterRoute?'/index.html':pathname));
    if(!file.startsWith(directory+path.sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
});
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createPreviewServer().listen(4173,'127.0.0.1',()=>console.log('Persa preview: http://127.0.0.1:4173'));
}
