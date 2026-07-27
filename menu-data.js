// Datos de la carta — espejo 1:1 del Excel (Categoría, Producto, Variante/Tamaño, Precio €).
// Para conectar el Excel/CSV del cliente: regenerar FILAS con las mismas 4 columnas.
//
// IMPORTANTE — este fichero es un *script clásico*, no un módulo ES.
// Se carga con un <script src="./menu-data.js"> normal en el <head>, así que para
// cuando arranca el componente los datos ya están en memoria en window.MENU_DATA:
// cero promesas, cero import() dinámico, cero espera de red. Eso es lo que garantiza
// que la carta se pinte llena en el primer frame aunque Google Sheets tarde o no
// conteste nunca. Si vuelve a convertirse en módulo ES, vuelve el contenedor en blanco.
(function (global) {
  'use strict';

  var FILAS = [
    ["Café", "Solo", "70 ml", 1.4], ["Café", "Solo", "180 ml", 1.6],
    ["Café", "Con Leche", "70 ml", 1.4], ["Café", "Con Leche", "180 ml", 1.6], ["Café", "Con Leche", "230 ml", 1.8],
    ["Café", "Bombón", "70 ml", 2], ["Café", "Bombón", "180 ml", 2.5],
    ["Café", "Carajillo (Baileys / Tía María)", "70 ml", 2],
    ["Café", "Cold Brew", "180 ml", 2.8],
    ["Café", "Flat White", "180 ml", 2.2],
    ["Café", "Capuchino", "180 ml", 2.2],
    ["Café", "Café de filtro (Moccamaster)", "180 ml", 2.5],
    ["Café", "Moka", "180 ml", 2.5],
    ["Café", "Café hielo Baileys", "180 ml", 2.9], ["Café", "Café hielo Baileys", "230 ml", 3.6],
    ["Café", "Té o infusiones", "180 ml", 1.8],
    ["Café", "Té con leche", "180 ml", 2],
    ["Café", "Cola Cao", "180 ml", 1.8],
    ["Café", "Vaso de leche", "180 ml", 1.6],
    ["Chocolate", "A la taza", "180 ml", 2.3], ["Chocolate", "A la taza", "230 ml", 2.7],
    ["Chocolate", "Con nata", "180 ml", 2.6],
    ["Chocolate", "Con Baileys", "180 ml", 2.7],
    ["Chocolate", "Con nata y Baileys", "180 ml", 3.1],
    ["Bebidas", "Agua", "500 ml", 1.3],
    ["Bebidas", "Agua con gas", "500 ml", 1.7],
    ["Bebidas", "Refrescos", "Estándar", 2.5],
    ["Bebidas", "Estrella Galicia tercio", "Estándar", 2.5],
    ["Bebidas", "Estrella Galicia 0,0", "Estándar", 2.5],
    ["Bebidas", "Zumo de naranja", "250 ml", 2.6],
    ["Bebidas", "Zumo piña / melocotón", "Botellín", 1.8],
    ["Bebidas", "Zumo de mango", "Botellín", 1.9],
    ["Bebidas", "Batidos", "Botellín", 1.8],
    ["Pitufos", "Mantequilla / mermelada", "Medio", 1.2], ["Pitufos", "Mantequilla / mermelada", "Entero", 1.6],
    ["Pitufos", "Aceite", "Medio", 1.2], ["Pitufos", "Aceite", "Entero", 1.6],
    ["Pitufos", "Aceite y tomate", "Medio", 1.3], ["Pitufos", "Aceite y tomate", "Entero", 1.7],
    ["Pitufos", "Pavo / York", "Medio", 1.4], ["Pitufos", "Pavo / York", "Entero", 1.8],
    ["Pitufos", "Mixto", "Medio", 1.4], ["Pitufos", "Mixto", "Entero", 2.1],
    ["Pitufos", "Paté ibérico", "Medio", 1.4], ["Pitufos", "Paté ibérico", "Entero", 2],
    ["Pitufos", "Queso manchego", "Medio", 1.4], ["Pitufos", "Queso manchego", "Entero", 2.2],
    ["Pitufos", "Queso fresco", "Medio", 1.4], ["Pitufos", "Queso fresco", "Entero", 2.3],
    ["Pitufos", "Serrano", "Medio", 1.4], ["Pitufos", "Serrano", "Entero", 2],
    ["Pitufos", "Catalana", "Medio", 1.4], ["Pitufos", "Catalana", "Entero", 2.3],
    ["Pitufos", "Serrano manchego", "Entero", 2.5],
    ["Pitufos", "Catalana manchego", "Entero", 2.6],
    ["Pitufos", "Lomo horneado", "Entero", 2.4],
    ["Pitufos", "Lomo manchego", "Entero", 2.6],
    ["Pitufos", "Atún", "Entero", 2.1],
    ["Pitufos", "Atún con tomate", "Entero", 2.3],
    ["Pitufos", "Sándwich mixto", "Entero", 2.6],
    ["Dulces", "Croissant", "Estándar", 1.9],
    ["Dulces", "Croissant MM (mantequilla / mermelada)", "Estándar", 2.4],
    ["Dulces", "Croissant mixto", "Estándar", 2.7],
    ["Dulces", "Croissant Nutella", "Estándar", 2.6],
    ["Dulces", "Croissant con serrano", "Estándar", 2.7],
    ["Dulces", "Vigilante de dulce de leche", "Estándar", 2.1],
    ["Dulces", "Alfajores de maizena con dulce de leche", "Estándar", 2.6],
    ["Dulces", "Cono de coco", "Estándar", 3.2],
    ["Dulces", "Rollo de canela", "Estándar", 2.3],
    ["Dulces", "Cookies triple chocolate", "Estándar", 2.1],
    ["Tartas", "Tartas caseras", "Porción", 3.3],
    ["Tartas", "Tartas caseras veganas", "Porción", 3.8]
  ];

  // Descripciones opcionales por producto (se muestran si existen).
  var DESCRIPCIONES = {
    "Solo": "Espresso de tueste natural, intenso y limpio.",
    "Con Leche": "Nuestro clásico. Leche cremada a 65 °C.",
    "Bombón": "Espresso sobre leche condensada.",
    "Cold Brew": "Extracción en frío durante 12 horas.",
    "Flat White": "Doble espresso con microespuma sedosa.",
    "Capuchino": "Equilibrio perfecto de café, leche y espuma.",
    "Café de filtro (Moccamaster)": "Método de filtrado suave, taza aromática.",
    "Moka": "Café, chocolate y leche cremada.",
    "A la taza": "Chocolate espeso, receta de siempre.",
    "Zumo de naranja": "Recién exprimido.",
    "Mixto": "York y queso fundido en pan recién horneado.",
    "Rollo de canela": "Horneado del día.",
    "Tartas caseras": "Pregunta por la tarta del día.",
    "Tartas caseras veganas": "Sin ingredientes de origen animal."
  };

  global.MENU_DATA = { FILAS: FILAS, DESCRIPCIONES: DESCRIPCIONES };
})(typeof globalThis !== 'undefined' ? globalThis : window);
