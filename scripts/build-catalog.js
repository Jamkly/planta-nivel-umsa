const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const repo='https://github.com/Jamkly/planta-nivel-umsa';
const files=[];
function walk(dir){if(!fs.existsSync(path.join(root,dir)))return;for(const d of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){if(d.name.startsWith('.'))continue;const p=dir+'/'+d.name;if(d.isDirectory())walk(p);else{const parts=p.split('/'),ext=path.extname(p).slice(1).toLowerCase();const group=parts[0]==='semestres'?'Histórico':parts[0]==='global'?'Recursos técnicos':parts[0]==='database'?'Base de datos':parts[0]==='evidencias'?'Evidencias':'Documentación actual';const period=parts[0]==='semestres'?(parts[1]==='videos_semestres'?'Varios semestres':parts[1]):'Compartido / actual';const enc=p.split('/').map(encodeURIComponent).join('/');let links=[];if(['txt','md'].includes(ext)){const txt=fs.readFileSync(path.join(root,p),'utf8');links=[...new Set(txt.match(/https?:\/\/[^\s<>\)\]]+/g)||[])].map(url=>({url,title:url.includes('youtube')?'Ver video en YouTube':url.includes('drive.google')?'Abrir recurso en Drive':'Abrir enlace externo'}));}files.push({name:d.name,path:p,ext,group,period,size:fs.statSync(path.join(root,p)).size,url:repo+'/blob/main/'+enc,raw:'https://raw.githubusercontent.com/Jamkly/planta-nivel-umsa/main/'+enc,links});}}}
for(const d of ['documentacion','global','semestres','database','evidencias'])walk(d);
files.sort((a,b)=>a.path.localeCompare(b.path,'es'));
fs.mkdirSync(out,{recursive:true});for(const f of ['index.html','style.css','app.js'])fs.copyFileSync(path.join(root,'web',f),path.join(out,f));
fs.writeFileSync(path.join(out,'catalogo.json'),JSON.stringify(files));console.log('Catálogo generado: '+files.length+' archivos.');
