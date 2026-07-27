// Regenera kinetic-menu.js (precompilado) a partir de kinetic-menu.jsx (la fuente).
//
// Uso:   node tools/build-kinetic-menu.mjs
//
// Por qué existe: support.js solo descarga @babel/standalone (3,0 MB) cuando la URL
// de <x-import> termina en .jsx/.tsx. Sirviendo el .js ya compilado, esa descarga y
// la compilación en el navegador desaparecen del arranque de cada visita.
//
// Usa exactamente la misma versión y los mismos presets que usaría support.js en el
// navegador, así que el resultado es idéntico al que se venía ejecutando en runtime.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BABEL_URL = 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js';

// Babel se descarga a un temporal bajo demanda: así el repo no necesita npm install
// ni un node_modules versionado para una web que es puramente estática.
const cache = join(tmpdir(), 'babel-standalone-7.29.0.js');
if (!existsSync(cache)) {
  mkdirSync(dirname(cache), { recursive: true });
  const res = await fetch(BABEL_URL);
  if (!res.ok) throw new Error(`No se pudo descargar Babel: HTTP ${res.status}`);
  writeFileSync(cache, Buffer.from(await res.arrayBuffer()));
}
const Babel = createRequire(import.meta.url)(cache);

const entrada = join(RAIZ, 'kinetic-menu.jsx');
const salida = join(RAIZ, 'kinetic-menu.js');

// Mismos presets que support.js aplica en runtime (ver external.ts → load()).
const { code } = Babel.transform(readFileSync(entrada, 'utf8'), {
  filename: './kinetic-menu.jsx',
  presets: ['react', 'typescript'],
});

const cabecera = `// ARCHIVO GENERADO — no editar a mano.
// Fuente: kinetic-menu.jsx  ·  Regenerar con:  node tools/build-kinetic-menu.mjs
//
// Se precompila en origen para que el navegador NO tenga que descargar
// @babel/standalone (3,0 MB) ni compilar JSX en cada visita.
`;

writeFileSync(salida, cabecera + code + '\n');
console.log(`OK — kinetic-menu.js regenerado (${code.length} bytes)`);
