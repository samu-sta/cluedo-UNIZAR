/*************************************************
 * Configuración de Babel
 * 
 * Este archivo configura el compilador Babel para
 * poder usar características modernas de JavaScript
 * como ES modules y propiedades de clase, asegurando
 * la compatibilidad en diferentes entornos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-class-properties"
  ]
};
