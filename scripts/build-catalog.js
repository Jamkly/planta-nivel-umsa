/* Catálogo del portal: sin dependencias externas ni credenciales. Node 18+. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist'),cfg=JSON.parse(fs.readFileSync(path.join(root,'config/portal.json'),'utf8'));
const repo=`https://github.com/${cfg.repositorio}`,norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
function git(args){try{return execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:10e6}).trim()}catch{return ''}}
function category(p,ext){const n=norm(p);if(['ino','m','py','js','c','cpp','h','sql','rss','mer','slx','slxc','awl','lad'].includes(ext))return 'Programas';if(['png','jpg','jpeg','webp','gif'].includes(ext))return 'Imágenes';if(ext==='dwg'||ext==='cad'||ext==='dxf'||/diagram|planos|ortogonal|simbolos|p&id/.test(n))return 'Planos y diagramas';if(/datasheet/.test(n))return 'Manuales y fichas';if(['pptx','ppt'].includes(ext))return 'Presentaciones';if(/guias_laboratorios/.test(n))return 'Guías de laboratorio';if(['md','txt'].includes(ext))return 'Enlaces e índices';return 'Informes y documentos'}
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const f of ['index.html','style.css','app.js'])fs.copyFileSync(path.join(root,'web',f),path.join(out,f));
fs.cpSync(path.join(root,'web/assets'),path.join(out,'assets'),{recursive:true});
const files=[],textExt=['md','txt','ino','m','py','sql','js','c','cpp','h','csv','json'];
// Detecta los nombres antiguos y actuales sin incluir carpetas del código del portal.
function periodLabel(value){const n=norm(value).replace(/[_-]+/g,' ').trim();const m=n.match(/^(ii|i)\s*(20\d{2})$/i);return m?m[1].toUpperCase()+'-'+m[2]:value;}
const sources=new Map();
for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&!d.isSymbolicLink())){
 const n=norm(d.name).replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();let source;
 if(/^documentacion(?:\s|$)/.test(n)){const m=n.match(/\b(ii|i)\s*(20\d{2})\b/i);source={path:d.name,group:'Trabajo actual',period:m?m[1].toUpperCase()+'-'+m[2]:cfg.semestreActual};}
 else if(['semestres','semestres pasados'].includes(n))source={path:d.name,group:'Archivo histórico',historical:true};
 else if(n==='global')source={path:d.name,group:'Recursos técnicos',period:'Compartido'};
 else if(n==='database')source={path:d.name,group:'Base de datos',period:cfg.semestreActual};
 else if(n==='evidencias')source={path:d.name,group:'Evidencias',period:cfg.semestreActual};
 if(source)sources.set(d.name,source);
}
// Opcional: fuentes adicionales para nombres que no siguen las convenciones anteriores.
for(const source of cfg.fuentes||[]){
 if(!source||typeof source.path!=='string'||path.isAbsolute(source.path)||source.path.split(/[\\/]/).includes('..')||!source.group)throw Error('Fuente inválida en config/portal.json');
 const resolved=path.resolve(root,source.path);if(resolved===root||!resolved.startsWith(root+path.sep))throw Error('La fuente debe estar dentro del repositorio');
 if(fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory())sources.set(source.path,source);else console.warn('Fuente no encontrada: '+source.path);
}
if(!sources.size)throw Error('No se encontraron carpetas documentales. Revisa config/portal.json');
const visited=new Set();
function walk(dir,source){if(!fs.existsSync(path.join(root,dir)))return;for(const d of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){if(d.name.startsWith('.')||d.isSymbolicLink())continue;const p=dir+'/'+d.name;if(d.isDirectory())walk(p,source);else{if(visited.has(p))continue;visited.add(p);const parts=p.split('/'),ext=path.extname(p).slice(1).toLowerCase(),size=fs.statSync(path.join(root,p)).size;
const relative=p.slice(source.path.length+1),first=relative.split('/')[0];
const period=source.historical?(first==='videos_semestres'?'Varios semestres':periodLabel(first)):source.period||cfg.semestreActual;
const group=source.group;
const f={name:d.name,title:d.name.replace(/\.[^.]+$/,'').replace(/_/g,' '),path:p,ext,size,period,group,category:category(p,ext),url:repo+'/blob/'+cfg.rama+'/'+enc(p),raw:`https://raw.githubusercontent.com/${cfg.repositorio}/${cfg.rama}/`+enc(p),links:[]};
if(textExt.includes(ext)&&size<512000){f.text=fs.readFileSync(path.join(root,p),'utf8');let heading='';for(const line of f.text.split(/\r?\n/)){const urls=line.match(/https?:\/\/[^\s<>\)\]]+/g);if(urls){for(const url of urls)if(!f.links.some(l=>l.url===url))f.links.push({url,title:heading||d.name,kind:/youtu/.test(url)?'Video':/drive.google/.test(url)?'Google Drive':'Enlace'});}else if(line.trim())heading=line.replace(/^#+\s*/,'').trim();}}
if(['pdf','png','jpg','jpeg','webp','gif'].includes(ext)&&size<=24*1048576){const dest=path.join(out,'archivos',p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,p),dest);f.local='archivos/'+enc(p);}
const over=cfg.archivos[p]||{};for(const k of ['title','description','category'])if(typeof over[k]==='string')f[k]=over[k];files.push(f);
}}}
for(const source of [...sources.values()].sort((a,b)=>b.path.length-a.path.length))walk(source.path,source);
console.log('Fuentes documentales: '+[...sources.keys()].join(', '));
files.sort((a,b)=>a.path.localeCompare(b.path,'es',{numeric:true}));
async function api(endpoint){const res=await fetch('https://api.github.com/repos/'+cfg.repositorio+'/'+endpoint,{headers:{'User-Agent':'Planta-Nivel-Portal','Accept':'application/vnd.github+json'},signal:AbortSignal.timeout(8000)});if(!res.ok)throw Error('GitHub '+res.status);return res.json()}
(async()=>{let contributors=[],commits=[],source='GitHub';try{const [cs,ms]=await Promise.all([api('contributors?per_page=100'),api('commits?per_page=12')]);contributors=cs.map(c=>({name:c.login,url:c.html_url,avatar:c.avatar_url,count:c.contributions}));commits=ms.map(c=>({sha:c.sha.slice(0,7),message:c.commit.message.split('\n')[0],name:c.author?.login||c.commit.author.name,date:c.commit.author.date,url:c.html_url}));}catch(e){source='Historial Git disponible durante la construcción';const log=git(['log','-100','--format=%h%x1f%an%x1f%aI%x1f%s']);for(const l of log.split('\n').filter(Boolean)){const [sha,name,date,message]=l.split('\x1f');let c=contributors.find(x=>x.name===name);if(!c)contributors.push(c={name,count:0});c.count++;if(commits.length<12)commits.push({sha,name,date,message,url:repo+'/commit/'+sha});}console.warn('API no disponible; se usa historial local. Los recuentos pueden ser parciales.');}
const result={config:cfg,sources:[...sources.values()],files,contributors,commits,contributorSource:source,builtAt:new Date().toISOString(),sha:git(['rev-parse','--short','HEAD'])};fs.writeFileSync(path.join(out,'catalogo.json'),JSON.stringify(result));fs.copyFileSync(path.join(root,'web/_headers'),path.join(out,'_headers'));console.log(`Portal construido: ${files.length} archivos, ${contributors.length} autores. Salida: dist/`);})();
