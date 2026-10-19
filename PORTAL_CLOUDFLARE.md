# Portal de Planta de Nivel — versión 2

## 1. Instalar la actualización

1. Extrae el ZIP fuera de tu repositorio.
2. Copia `web/`, `scripts/`, `config/`, `.gitignore` y este archivo a la raíz de tu repositorio local.
3. Acepta combinar carpetas y reemplazar los archivos de la versión anterior. Conserva intactos `documentacion/`, `global/` y `semestres/`.
4. En GitHub Desktop revisa los cambios. Summary: `Renueva portal documental con secciones, temas y equipo`.
5. Commit to main y Push origin. El Worker actual puede reconstruirse; el nuevo proyecto Pages se configura aparte.

No subas `dist/` ni el ZIP. Cloudflare genera `dist/` automáticamente. Este paquete NO contiene ni reemplaza tus documentos técnicos.

## 2. Publicar en Cloudflare Pages, sin nombre personal en la dirección

1. Entra a tu cuenta de Cloudflare.
2. Abre Workers & Pages, vuelve a la lista de proyectos y pulsa Create application.
3. Selecciona Pages. Si la primera pantalla ofrece crear un Worker, busca el enlace `Looking to deploy Pages?` / `Get started` o la pestaña Pages.
4. Elige Connect to Git / Import an existing Git repository.
5. Conecta GitHub y permite acceso al repositorio Jamkly/planta-nivel-umsa.
6. Selecciona ese repositorio y pulsa Begin setup.
7. Project name: `planta-nivel-umsa` (si no está disponible, usa `planta-nivel-control-umsa`).
8. Production branch: `main`.
9. Framework preset: `None`.
10. Build command: `node scripts/build-catalog.js`.
11. Build output directory: `dist`.
12. Root directory: vacío. No introduzcas un Deploy command de Wrangler; ese campo pertenece al flujo de Workers.
13. Save and Deploy. Espera a que termine y copia la URL real `.pages.dev` mostrada por Cloudflare. El nombre depende de su disponibilidad.
14. Comprueba las seis secciones, el buscador, los temas, un PDF y un enlace externo.

La dirección de Pages usa el nombre del proyecto; no contiene el subdominio personal de Workers. No es necesario cambiar el repositorio de GitHub. Conserva el Worker anterior hasta comprobar Pages. La eliminación o desactivación del Worker es opcional y se realiza después.

## 3. Actualización automática

Con Pages conectado a GitHub, cada push a main inicia una construcción. Los cambios de ramas se incorporan a producción cuando se fusionan con main. La página se actualiza cuando termina correctamente el despliegue.

El generador vuelve a recorrer las carpetas técnicas y consulta autores y últimos 12 commits de GitHub. No requiere tokens. Si la API no responde o alcanza su límite, utiliza el historial Git disponible durante la construcción; en ese caso los recuentos pueden ser parciales y la página lo indica. No expone correos de los autores.

## 4. Organización y mantenimiento

- Inicio: portada conceptual, estadísticas calculadas y accesos por semestre.
- Documentación: guías, informes, fichas, planos, presentaciones e índices.
- Programas: proyectos PLC, MATLAB, Simulink, Arduino, SQL y enlaces de programas.
- Galería: imágenes originales del archivo y enlaces externos de videos/Drive.
- Explorador: rutas y carpetas reales, incluyendo espacios y tildes.
- Equipo: contribuciones registradas y últimos commits, sin inventar participantes.

Los formatos PDF e imagen de hasta 24 MiB se copian a la publicación para visualización. El código de texto pequeño se incluye como texto seguro. Los proyectos binarios y documentos Office conservan acceso al original y requieren su aplicación de origen. Los archivos grandes permanecen en GitHub o Drive. No se ejecutan programas del archivo, SQL ni comunicación con el PLC.

### Personalizar sin modificar la interfaz

Edita `config/portal.json`. Para declarar integrantes sin atribuirles commits, utiliza:

```json
"equipo": [
  {"nombre": "Nombre real del integrante", "usuario": "usuarioGitHub", "rol": "Responsabilidad real"}
]
```

Para mejorar un título, descripción o categoría, añade una entrada usando su ruta exacta:

```json
"archivos": {
  "semestres/II 2023/Guia Rapida Sist. de Nivel F.pdf": {
    "title": "Guía rápida del sistema de nivel",
    "description": "Documento conservado del semestre II-2023."
  }
}
```

Conserva JSON válido: comillas dobles y sin coma después del último elemento. No inventes una categoría nueva si deseas mantener la organización actual. No modifiques las rutas de los archivos para cambiar su título visible.

Los temas azul técnico, claro y oscuro se recuerdan en el navegador. Si el almacenamiento está bloqueado, el selector sigue funcionando en la sesión.

### Escudo e ilustración

El escudo UMSA se guarda localmente en web/assets/logo-umsa.png, recuperado del repositorio de referencia proporcionado. No se depende del sitio del compañero para mostrarlo. La ilustración hidráulica es original, conceptual y no sustituye el P&ID. Las vistas reales del archivo están en Galería.

## 5. Validación de esta entrega

Se verificaron sintaxis JavaScript, generación de 118 entradas, existencia de archivos locales, límite de tamaño y lógica de las seis rutas, búsqueda, carpeta con espacios y visores mediante un DOM simulado. La presentación visual, el comportamiento en navegadores reales y la conexión a tu cuenta Pages requieren comprobación tras publicar; no se realizaron desde esta entrega.

Las fichas históricas conservan sus periodos. Los documentos de otros semestres son antecedentes, no resultados del semestre actual. Los commits son trazabilidad de autoría, no una medición de calidad o esfuerzo.
