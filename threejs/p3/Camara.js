/**
 * Seminario GPC 3. Camara
 * 
 * Mover camara
 */

 /**
  *  Practica: 
  *     vista interactiva donde movemos la camara
  *     mini vista cenital de 1/4 de la longitud de la vista mas pequña ( cuadrada )
  */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var esferacubo, cubo, angulo = 0;
// dimensiones de la ventana
var r = t = 4;
var l = b = -r;
var cameraControler;
var alzado, planta, perfil;

// Acciones
init();
loadScene();
render();

function setCameras(ar) {
  // construir las 4 camaras

  var origen = new THREE.Vector3(0, 0, 0);
  // ortograficas
  var camOrtografica;
  if (ar > 1) {
    camOrtografica = new THREE.OrthographicCamera( l*ar, r*ar, t, b, -20, 20 );
  } else {
    camOrtografica = new THREE.OrthographicCamera( l, r, t/ar, b/ar, -20, 20 );
  }

  alzado = camOrtografica.clone();
  alzado.position.set(0, 0, 4);
  alzado.lookAt(origen);

  perfil = camOrtografica.clone();
  perfil.position.set(4, 0, 0);
  perfil.lookAt(origen);

  planta = camOrtografica.clone();
  planta.position.set(0, 4, 0);
  planta.lookAt(origen);
  planta.up = new THREE.Vector3(0, 0, -1);

  // Perspectiva
  // añadimos camara en el eje de coordenas mirando hacia -z
  camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 100 );
  // Movemos la camare respecto al sistema de referencia de la scena
  camera.position.set(0.5, 3, 9);
  // Movemos la camare respecto al sistema de referencia de la scena
  camera.lookAt(new THREE.Vector3(0,0,0));

  // añadir camaras a la escena
  scene.add(alzado);
  scene.add(perfil);
  scene.add(planta);
  scene.add(camera);
}

function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x0000AA) );
  renderer.autoClear = false;
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;
  // args: angulo (zoom en la camara), ar, distancia init foto, distancia fin foto
  // camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 100 );

  // izq, der, arriva, abajo, cerca, lejos
  // definimos la caja que se vera, centrada en el origen de coordenadas
  // Modificamos para mantener la relacion de aspecto con la camara ortogonal
  /* if (ar > 1) {
    camOrtografica = new THREE.OrthographicCamera( l*ar, r*ar, t, b, -20, 20 );
  } else {
    camOrtografica = new THREE.OrthographicCamera( l, r, t/ar, b/ar, -20, 20 );
  } */

  setCameras(ar);
  
  // Camera a controlar y donde la queremos controlar
  cameraControler = new THREE.OrbitControls( camera, renderer.domElement );
  // Donde orbita la camara
  cameraControler.target.set(0, 0, 0);
  cameraControler.noKeys = true;

  // Eventos
  window.addEventListener( 'resize', updateAspectRatio );
  renderer.domElement.addEventListener( 'dblclick', rotate );
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
  
  // Geometrias
  var geocubo = new THREE.BoxGeometry(2, 2, 2);
  var geoesfera = new THREE.SphereGeometry(1, 30, 30);

  // objetos
  cubo = new THREE.Mesh(geocubo, material);
  cubo.position.x = -1;

  var esfera = new THREE.Mesh(geoesfera, material);
  esfera.position.x = 1;

  esferacubo = new THREE.Object3D();
  esferacubo.position.y = 1;

  // Modelo importado
  var loader = new THREE.ObjectLoader();
  loader.load('models/soldado/soldado.json', obj => {    
    obj.position.y = 1;
    cubo.add(obj);
  });

  // construir escena
  esferacubo.add(cubo);
  esferacubo.add(esfera);
  
  scene.add(esferacubo);
  cubo.add( new THREE.AxisHelper(3) );
  scene.add( new THREE.AxisHelper(3) );
}

function rotate(event) {
  // Localiza el objeto seleccionado y lo gira 45º
  
  var x = event.clientX;
  var y = event.clientY;

  // obtener el cuadrante de la camara
  var derecha = abajo = false;
  var cam = null;

  // obtener el cuadrante de la seleccion
  // y reducir las x e y al tamaño de un cuadrante
  if ( x > window.innerWidth/2 ) {
    x -= window.innerWidth / 2;
    derecha = true;
  }

  if ( y > window.innerHeight/2 ) {
    y -= window.innerHeight / 2;
    abajo = true;
  }

  if (derecha) {
    if (abajo) cam = camera;
    else cam = perfil;
  } else {
    if (abajo) cam = planta;
    else cam = alzado;
  }
  
  // Convertir al cuadrado canonico (2x2) centrado en el origen de coordenadas
  // escalado * translacion
  x = ( 2*x/window.innerWidth ) * 2 - 1;
  y = -( 2*y/window.innerHeight ) * 2 + 1;

  // construccion del rayo e interseccion con la escena
  var rayo = new THREE.Raycaster();
  // calculo del rayo
  rayo.setFromCamera( new THREE.Vector2(x, y), cam );

  // Calculo intersecciones. Los hijos de la escena (true para recursive todos los hijos de los hijos)
  var interseccion = rayo.intersectObjects( scene.children, true );

  if (interseccion.length > 0) {
    // cojemos el primero porque estan ordenados y es el más cercano
    interseccion[0].object.rotation.y += Math.PI / 4;
  }
}

function updateAspectRatio() {
  // Indicarle al motor las nuevas dimensiones
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Calcumar la nueva razon aspecto
  var ar = window.innerWidth / window.innerHeight;
  
  // Variamos el volumen de la vista, portanto la matriz de projeccion
  // si variamos 
  if (ar > 1) {
    alzado.left = perfil.left = planta.left = l*ar;
    alzado.right = perfil.right = planta.right = r*ar;
    alzado.top = perfil.top = planta.top = t;
    alzado.bottom = perfil.bottom = planta.bottom = b;
  } else {
    alzado.left = perfil.left = planta.left = l;
    alzado.right = perfil.right = planta.right = r;
    alzado.top = perfil.top = planta.top = t/ar;
    alzado.bottom = perfil.bottom = planta.bottom = b/ar;
  }

  camera.aspect = ar;

  alzado.updateProjectionMatrix();
  planta.updateProjectionMatrix();
  perfil.updateProjectionMatrix();
  camera.updateProjectionMatrix();
}

function update() {
  // Cambios entre frames
}

function render() {
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.clear();

  // usamos el viewport (marco) para fijar las camaras
  renderer.setViewport(0, 0, window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, alzado );

  renderer.setViewport(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, perfil );

  renderer.setViewport(0, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, planta );

  renderer.setViewport(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, camera );
}