# Página Web · 100% COFFEE (Málaga)

Landing page de la cafetería de especialidad **100% COFFEE** (Carretera de Cádiz, Málaga).
Café de especialidad · desayunos · reseñas de Google · Instagram · localización.

## Estructura del proyecto

```
Página Web 100% COFFEE/
├── 100 Coffee Landing.dc.html   ← página principal (abre directamente en el navegador)
├── kinetic-menu.jsx             ← menú kinetic a pantalla completa (GSAP)
├── menu-data.js                 ← datos de la carta (espejo del Excel del cliente)
├── support.js                   ← runtime del componente (no editar)
└── uploads/                     ← imágenes (taza, granos, fotos de Instagram)
```

## Cómo verlo en local

Es un único componente HTML autocontenido. Necesita servirse por HTTP (no `file://`)
porque carga `menu-data.js` / `kinetic-menu.jsx` como módulos.

```bash
# desde esta carpeta
python3 -m http.server 8000
# luego abre http://localhost:8000/100%20Coffee%20Landing.dc.html
```

o con Node:

```bash
npx serve .
```

## Secciones

- **Hero** — fondo negro, taza con levitación (CSS), granos en parallax con el ratón (mousemove),
  título "100 % COFFEE" con reveal de máscara, flecha manuscrita y marquee infinito. Layout
  asimétrico en móvil.
- **La Carta** — categorías/productos/precios generados desde `menu-data.js` (tabs por categoría).
  Solo texto, sin imágenes de producto.
- **Comunidad & Inspiración** — grid de Instagram (fotos en `uploads/`), enlaza a
  `https://www.instagram.com/100_coffee_mlg/`.
- **Un muro de amor** — reseñas reales de Google como *card stack* sticky que escala al hacer scroll.
- **Visítanos** — dirección, horarios, Instagram, mapa embebido y CTA "Cómo llegar"
  (`https://maps.app.goo.gl/GKaq3qdyVo62jsaj7`).

## Editar la carta

Toda la carta vive en `menu-data.js`:
- `FILAS` — array `[categoría, producto, variante, precio]` (espejo 1:1 del Excel).
- `DESCRIPCIONES` — mapa opcional producto → descripción.

Para actualizar precios/productos basta con editar `FILAS`; la interfaz se regenera sola.
Preparado para conectar a un Excel/CSV en el futuro manteniendo esas 4 columnas.

## Integraciones futuras (pendientes)

- **Reseñas**: conectar a Google Places API (Place ID `ChIJHcmBCdv5cg0RgC_fr3Tf5fY`)
  manteniendo el diseño de las tarjetas.
- **Instagram**: sustituir las fotos del grid por el feed real del perfil.

## Empezar con Git

```bash
cd "Página Web 100% COFFEE"
git init
git add .
git commit -m "Primera versión de la landing 100% COFFEE"
```

Sugerencia de `.gitignore` si más adelante añades build tooling:

```
node_modules/
dist/
.DS_Store
```

## Dependencias

- **GSAP 3.12** — se carga automáticamente por CDN desde `kinetic-menu.jsx` (no requiere npm install).
- Fuentes **Oswald**, **Jost**, **Cormorant Garamond** y **Caveat** vía Google Fonts.

## Marca

- Dirección: C. Realenga de San Luis, 10 · Carretera de Cádiz · 29004 Málaga
- Horario: L–V 8:00–13:00 / 17:00–20:30 · Sáb 8:30–13:00 · Dom cerrado
- Instagram: [@100_coffee_mlg](https://www.instagram.com/100_coffee_mlg/)
