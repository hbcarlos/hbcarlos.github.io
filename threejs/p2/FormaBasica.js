/**
 * Seminario GPC 2. FormaBasica
 * 
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var esferacubo, cubo, angulo = 0;

// Acciones
init();
loadScene();
render();


function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x0000AA) );
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;
  // args: angulo, ar, distancia init foto, distancia fin foto
  camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 100 );
  // añadimos camara en el eje de coordenas mirando hacia -z
  scene.add(camera);
  // Movemos la camare respecto al sistema de referencia de la scena
  camera.position.set(0.5, 3, 9);
  camera.lookAt(new THREE.Vector3(0,0,0));
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

function update(){
  // Cambios entre frames
  angulo += Math.PI / 100;
  esferacubo.rotation.y = angulo;
  cubo.rotation.x = angulo / 2;
}

function render(){
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.render( scene, camera );
}