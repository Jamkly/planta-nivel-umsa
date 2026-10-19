PORTAL PLANTA DE NIVEL — INSTALACIÓN

1. Extrae este ZIP en una carpeta temporal.
2. Copia las carpetas web y scripts a la raíz de tu repositorio local planta-nivel-umsa. No copies el ZIP dentro del repositorio.
3. Copia también PORTAL_CLOUDFLARE.md a la raíz. No necesitas ejecutar comandos en tu computadora.
4. Abre GitHub Desktop, revisa los nuevos archivos y escribe: Agrega portal documental para Cloudflare.
5. Pulsa Commit to main y luego Push origin.
6. En Cloudflare: Workers & Pages > Create application > Pages > Import an existing Git repository. Conecta GitHub y selecciona Jamkly/planta-nivel-umsa.
7. Configura: rama main; framework None; comando node scripts/build-catalog.js; directorio de salida dist; directorio raíz vacío (raíz del repositorio).
8. Pulsa Save and Deploy. El enlace terminado en pages.dev aparecerá al finalizar.

MANTENIMIENTO
Sube documentos a documentacion/, global/, semestres/, database/ o evidencias/. El catálogo se reconstruye durante cada despliegue. Las carpetas vacías no se registran en Git. Los enlaces HTTP(S) escritos en archivos .md y .txt aparecen como accesos externos.
Los archivos originales se consultan en GitHub (rama main); el portal no los duplica. No realiza adquisición de datos ni ejecuta SQL.
La carpeta dist se genera en Cloudflare; no hace falta crearla o subirla desde tu PC.
Los nombres actuales con espacios y tildes están soportados.

VALIDACIÓN REALIZADA
Catálogo de 118 documentos, recursos e índices (120 archivos versionados incluyendo README.md y .gitignore). Sintaxis JavaScript y generación verificadas. No se verificaron visualmente en navegador ni los permisos de enlaces externos.
