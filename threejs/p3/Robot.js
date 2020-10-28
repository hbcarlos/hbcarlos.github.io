// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var angulo = 0;
// dimensiones de la ventana
var r = t = 300;
var l = b = -r;
var cameraControler;
var planta;

// Acciones
init();
loadScene();
render();

function setCameras(ar) {
  // ortograficas
  if (ar > 1) {
    planta = new THREE.OrthographicCamera( l*ar, r*ar, t, b, -1, 1000 );
  } else {
    planta = new THREE.OrthographicCamera( l, r, t/ar, b/ar, -1, 1000 );
  }

  planta.position.set(0, l, 0);
  planta.lookAt(new THREE.Vector3(0, 0, 0));
  planta.up = new THREE.Vector3(0, 0, -1);

  // Perspectiva
  // añadimos camara en el eje de coordenas mirando hacia -z
  camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 4000 );
  camera.position.set(500, 300, 300);

  // añadir camaras a la escena
  scene.add(planta);
  scene.add(camera);
}


function init() {
  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  renderer.autoClear = false;
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  var ar =  window.innerWidth / window.innerHeight;
  setCameras(ar);
  
  // Camera a controlar y donde la queremos controlar
  cameraControler = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControler.target.set(0, 0, 0);
  cameraControler.noKeys = true;

  // Eventos
  window.addEventListener( 'resize', updateAspectRatio );
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  var material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
  
  // Robot
  var geoRobot = new THREE.PlaneGeometry( 800, 800, 10, 10 );
  var robot = new THREE.Mesh( geoRobot, material );
  robot.rotation.x = Math.PI / 2;

  // Base
  var geoBase = new THREE.CylinderGeometry( 50, 50, 15, 50 );
  var base = new THREE.Mesh( geoBase, material );
  base.rotation.x = Math.PI / 2;
  robot.add(base);

  // Brazo
  var brazo = crearBrazo(material);
  base.add(brazo);

  var antebrazo = crearAntebrazo(material);
  antebrazo.position.y = -120;
  brazo.add(antebrazo);

  var mano = crearMano(material);
  mano.position.y = -80;
  antebrazo.add(mano);
  
  scene.add(robot);
  scene.add( new THREE.AxisHelper(1000) );
}

function updateAspectRatio() {
  // Indicarle al motor las nuevas dimensiones
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Calcumar la nueva razon aspecto
  var ar = window.innerWidth / window.innerHeight;
  
  // Variamos el volumen de la vista, portanto la matriz de projeccion
  // si variamos 
  if (ar > 1) {
    planta.left = l*ar;
    planta.right = r*ar;
    planta.top = t;
    planta.bottom = b;
  } else {
    planta.left = l;
    planta.right = r;
    planta.top = t/ar;
    planta.bottom = b/ar;
  }

  planta.updateProjectionMatrix();
  
  camera.aspect = ar;
  camera.updateProjectionMatrix();
}

function update(){
  // Cambios entre frames
}

function render(){
  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.clear();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );

  renderer.setViewport(2, 2, window.innerWidth/4, window.innerHeight/4);
  renderer.render( scene, planta );
}

function crearBrazo(material){
  var brazo = new THREE.Object3D();

  var geoEje = new THREE.CylinderGeometry( 20, 20, 18, 50 );
  var eje = new THREE.Mesh( geoEje, material );
  eje.rotation.x = Math.PI / 2;
  brazo.add(eje);

  var geoEsparrago = new THREE.BoxGeometry( 18, 120, 12 );
  var esparrago = new THREE.Mesh( geoEsparrago, material );
  esparrago.position.y = -60;
  brazo.add(esparrago);

  var geoRotula = new THREE.SphereGeometry( 20, 32, 32 );
  var rotula = new THREE.Mesh( geoRotula, material );
  rotula.position.y = -120;
  brazo.add(rotula);

  return brazo;
}

function crearAntebrazo(material){
  // Antebrazo
  var antebrazo = new THREE.Object3D();
  var geoDisco = new THREE.CylinderGeometry( 22, 22, 6, 22 );
  var disco = new THREE.Mesh( geoDisco, material );
  antebrazo.add(disco);

  var nervios = crearNervios(material);
  nervios.position.y = -40;
  antebrazo.add(nervios);
  
  return antebrazo;
}

function crearNervios(material){
  var nervios = new THREE.Object3D();
  var geoNervio = new THREE.BoxGeometry( 4, 80, 4 );

  var nervio1 = new THREE.Mesh( geoNervio, material );
  nervio1.position.x = 8;
  nervio1.position.z = 8;
  nervios.add(nervio1);

  var nervio2 = new THREE.Mesh( geoNervio, material );
  nervio2.position.x = -8;
  nervio2.position.z = 8;
  nervios.add(nervio2);

  var nervio3 = new THREE.Mesh( geoNervio, material );
  nervio3.position.x = 8;
  nervio3.position.z = -8;
  nervios.add(nervio3);

  var nervio4 = new THREE.Mesh( geoNervio, material );
  nervio4.position.x = -8;
  nervio4.position.z = -8;
  nervios.add(nervio4);

  return nervios;
}

function crearMano(material){
  var mano = new THREE.Object3D();

  var geoPalma = new THREE.CylinderGeometry( 15, 15, 40, 15 );
  var palma = new THREE.Mesh( geoPalma, material );
  palma.rotation.x = Math.PI / 2;
  mano.add(palma);

  var coordenadas = [
     0,  10,   2,
    19,  10,   2,
    19, -10,   2,
     0, -10,   2,
    38,  -4,   2,
    38,   4,   2,
    38,   4,   0,
    38,  -4,   0,
    19,  10,  -2,
     0,  10,  -2,
     0, -10,  -2,
    19, -10,  -2
  ];

  var indices = [
    0,3,1,    3,2,1,    1,2,5,    2,4,5,    6,7,8,
    7,11,8,   8,11,9,   11,10,9,  9,10,0,   5,4,6,
    10,3,0,   9,0,8,    0,1,8,    3,10,2,   4,7,6,
    10,11,2,  8,1,6,    1,5,6,    2,11,4,   11,7,4
  ];

  var geoPinza = new THREE.Geometry();
  for (var i=0; i<coordenadas.length; i+=3) {
    var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
    geoPinza.vertices.push(vertice);
  }

  for (var i=0; i<indices.length; i+=3) {
    var face = new THREE.Face3( indices[i], indices[i+1], indices[i+2] );
    geoPinza.faces.push(face);
  }

  var pinza_de = new THREE.Mesh( geoPinza, material );
  pinza_de.position.z = -10;
  mano.add(pinza_de);

  var pinza_iz = new THREE.Mesh( geoPinza, material );
  pinza_iz.rotation.x = Math.PI;
  pinza_iz.position.z = 10;
  mano.add(pinza_iz);

  return mano;
}