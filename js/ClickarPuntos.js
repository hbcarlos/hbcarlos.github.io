/** Seminario 1. Hacer click y pintar un punto rojo */

// Shader de vertices
var VSHADER_SOURCE = 
'precision mediump float;                                           \n' +
'attribute vec4 posicion;                                           \n' +
'varying vec4 color;                                                \n' +
'void main(){                                                       \n' +
'   gl_Position = posicion;                                         \n' +
'   gl_PointSize = 10.0;                                            \n' +
'   float i = sqrt(pow(posicion[0], 2.0) + pow(posicion[1], 2.0));  \n' +
'   color = vec4(1.0-i, 1.0-i, 1.0-i, 1.0);                         \n' +
'}                                                                  \n';

var FSHADER_SOURCE = 
'precision mediump float;     \n' +
'varying vec4 color;          \n' +
'void main(){                 \n' +
'   gl_FragColor = color;     \n' +
'}                            \n';

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
  gl.clearColor(0.1, 0.3, 0.9, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Obtener referencia a la variable posicion del shader
  var coordenadas = gl.getAttribLocation(gl.program, 'posicion');

  // Ecuchar eventos de ratón
  canvas.onmousedown = evento => click( evento, gl, canvas, coordenadas );
}

const puntos = [];

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
  puntos.push(x);
  puntos.push(y);
  puntos.push(0);

  // borrar el canvas y redibujar
  gl.clear(gl.COLOR_BUFFER_BIT);

  // insertar las coordenadas como atributo y dibujarlos uno a uno
  //for (var i = 0; i < puntos.length; i += 2){
  //    gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
  //    gl.drawArrays(gl.POINTS, 0, 1);
  //}

  const points = new Float32Array(puntos);
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  gl.vertexAttribPointer(coordenadas, 3.0, gl.FLOAT, false, 0.0, 0.0);
  gl.enableVertexAttribArray(coordenadas);

  gl.drawArrays(gl.POINTS, 0.0, points.length/3);
  gl.drawArrays(gl.LINE_STRIP, 0.0, points.length/3);
}