/** Seminario 1. Pintar un rectangulo azul */

function main() {
    // Obtener el canvas
    var canvas = document.getElementById("canvas");

    // Obtener el contexto de render (herramientas de dibujo)
    var gl = getWebGLContext(canvas);

    // fijar el color de borrado del lienzo
    gl.clearColor( 0.0, 0.0, 0.3, 1.0 );

    // borranos el camvas
    gl.clear(gl.COLOR_BUFFER_BIT);
}