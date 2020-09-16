/** Seminario 1. Hacer click y pintar un punto rojo */

// Shader de vertices
var VSHADER_SOURCE = 
'attribute vec4 posicion;   \n' +
'void main(){               \n' +
'   gl_Position = posicion; \n' +
'   gl_PointSize = 10.0;    \n' +
'}                          \n';

var FSHADER_SOURCE = 
'void main(){                                   \n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    \n' +
'}                                              \n';

function main() {
    // Obtener el canvas
    var canvas = document.getElementById("canvas");

    // Obtener el contexto de render (herramientas de dibujo)
    var gl = getWebGLContext(canvas);

    // fijar el color de borrado del lienzo
    gl.clearColor( 0.0, 0.0, 0.5, 1.0 );

    // carger, compilar y montar los shader en un 'programa'
    if ( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) ) {
        console.error("Fallo al cargar los shaders");
        return;
    }

    // borramos el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Obtener referencia a la variable posicion del shader
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');

    // Ecuchar eventos de ratón
    canvas.onmousedown = function (evento) { click(evento, gl, canvas, coordenadas); }
}

var puntos = [];

function click(evento, gl, canvas, coordenadas) {
    // Recuperar las coordenadas del click
    var x = evento.clientX;
    var y = evento.clientY;
    var rect = evento.target.getBoundingClientRect();

    // conversion de coordenadas al sistema de webgl por defecto
    // cuadrado de 2x2 centrado
    // ejercicio: trasladar al sistema de coordenadas correcto
    x = ((x - rect.left) - canvas.width / 2) * 2/canvas.width;
    y = (canvas.height / 2 - (y - rect.top))  * 2/canvas.height;

    // guardar coordenadas
    puntos.push(x); puntos.push(y);

    // borrar el canvas y redibujar
    gl.clear(gl.COLOR_BUFFER_BIT);

    // insertar las coordenadas como atributo y dibujarlos uno a uno
    for (var i = 0; i < puntos.length; i += 2){
        gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}