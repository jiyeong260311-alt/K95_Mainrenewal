import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../out');
const port=Number(process.env.PORT||3000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
try {await fs.access(path.join(root,'index.html'));}catch{console.error('Build files are missing. Run pnpm build first.');process.exit(1);}
const server=http.createServer(async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target=path.resolve(root,'.'+pathname);
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    let info;try{info=await fs.stat(target);}catch{ /* Try a static route below. */ }
    if(info?.isDirectory())target=path.join(target,'index.html');
    if(!info&&!path.extname(target))target=path.join(target,'index.html');
    const content=await fs.readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:content);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await fs.readFile(path.join(root,'404.html')).catch(()=>'<h1>404</h1>'));}
});
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`Port ${port} is in use. Open http://localhost:${port}/en/ or choose another PORT.`:err.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`K95 preview: http://localhost:${port}/en/\nPress Ctrl+C to stop.`));
