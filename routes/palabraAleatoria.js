const fs = require('fs');
const listaPalabras = JSON.parse(fs.readFileSync('palabrasAhorcado.json', 'utf-8'));

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = function () {
    let posAleatoriaListaPalabras = getRandomArbitrary(0, listaPalabras.length - 1);
    let palabraAleatoria = listaPalabras[posAleatoriaListaPalabras];
    let palabraAdivinar = palabraAleatoria['palabra'].split('');
    return palabraAdivinar;
};