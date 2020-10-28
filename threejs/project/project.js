// Variables globales imprescindibles
var renderer, scene, camera;

// Variables globales
var angulo = 0;

// dimensiones de la ventana
var r = t = 300;
var l = b = -r;
var cameraControler;

// Monitor de recursos
var stats;

// Objetos
var velocidad = 0;
var giro = 0;
var x = 0;
var z = 0;
var snake = [];

// Keys
var left;
var right;
var up;
var bottom;

// luces
var materialParedes;
var luzAmbiente;
var luzFocal;
var dia = 0;
var intensida = 0.5;
var tiempo = 0.1;

var antes = Date.now();

// Acciones
init();
loadScene();
render();

function init() {
  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  renderer.shadowMap.enabled = true;
  renderer.autoClear = false;
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  var ar =  window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 75, ar, 0.1, 4000 );
  camera.position.set(500, 300, 300);
  scene.add(camera);

  // Crear luces
  setLights();
  
  // Camera a controlar y donde la queremos controlar
  cameraControler = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControler.target.set(0, 0, 0);
  cameraControler.keys = {
    LEFT: 60,
    UP: 61,
    RIGHT: 62,
    BOTTOM: 63
  };

  // STATS --> stats.update() en update()
	stats = new Stats();
	stats.showPanel(0);
  document.getElementById('container').appendChild( stats.domElement );
  
  // Eventos
  window.addEventListener( 'resize', updateAspectRatio );
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
}

function setLights() {
  // Luces
	luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 1);
	scene.add( luzAmbiente );

	luzFocal = new THREE.SpotLight(0xFFFFFF);
	luzFocal.position.set( -1000, 550, -600 );
  luzFocal.angle = Math.PI/4;
  luzFocal.penumbra = 0.1;
  luzFocal.shadow.shadowMapWidth = 64;
  luzFocal.shadow.shadowMapHeight = 64;
  luzFocal.shadow.camera.near = 1;
  luzFocal.shadow.camera.far = 3000;
  luzFocal.shadow.camera.fov = 10;
  luzFocal.castShadow = true;
	scene.add(luzFocal);
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  var paredes = [
    'images/sky+x.jpg', 'images/sky-x.jpg',
		'images/sky+y.jpg', 'images/sky-y.jpg',
		'images/sky+z.jpg', 'images/sky-z.jpg'
	];

  // Textures
  var texturaSuelo = new THREE.TextureLoader().load("images/sand.jpg");
  texturaSuelo.magFilter = THREE.LinearFilter;
	texturaSuelo.minFilter = THREE.LinearFilter;
	texturaSuelo.repeat.set(3, 3);
	texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;
  var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);

  // Materials
  var materialSuelo = new THREE.MeshLambertMaterial({ color:'white', map: texturaSuelo });
  var materialReflectante = new THREE.MeshPhongMaterial({
    color:'white',
    specular:'white',
    shininess: 50,
    reflectivity: 0.8,
    envMap: mapaEntorno
  });

  // Sky
  var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaEntorno;
	var materialParedes = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		dephtWrite: false,
		side: THREE.BackSide
  });
  var sky = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 2000), materialParedes);
  scene.add(sky);

  // base
  var base = new THREE.Mesh(new THREE.PlaneGeometry( 2000, 2000, 200, 200 ), materialSuelo);
  base.receiveShadow = true;
  base.rotation.x = -Math.PI / 2;
  scene.add(base);

  var loader = new THREE.OBJLoader();

  // load snake head
  loader.load(
    'models/snake.obj',
    ( object ) => createSnake(object),
    ( progress ) => console.log( ( progress.loaded / progress.total * 100 ) + '% loaded' ),
    ( error ) => console.log('An error happened', error)
  );

  var house1 = createHouse();
  house1.position.set(-700, 0, -700);
  house1.scale.set(1.5, 1.5, 1.5);
  scene.add(house1);

  var house2 = createHouse();
  house2.position.set(-700, 0, -400);
  scene.add(house2);

  var house3 = createHouse();
  house3.position.set(-400, 0, -700);
  scene.add(house3);
  
  var bosquex = createBosque();
  bosquex.position.set(900, 0, 0);
  scene.add(bosquex);
  var bosquenx = createBosque();
  bosquenx.rotation.y = Math.PI;
  bosquenx.position.set(-900, 0, 0);
  scene.add(bosquenx);
  var bosquezn = createBosque();
  bosquezn.rotation.y = Math.PI / 2;
  bosquezn.position.set(0, 0, -900);
  scene.add(bosquezn);
  var bosquez = createBosque();
  bosquez.rotation.y = -Math.PI / 2;
  bosquez.position.set(0, 0, 900);
  scene.add(bosquez);

  var arbusto = createArbustos();
  arbusto.position.set(700, 0, 800);
  scene.add(arbusto);

  var charca = new THREE.Mesh(new THREE.CylinderGeometry( 200, 200, 5, 30 ), materialReflectante);
  charca.rotation.y = Math.PI/4;
  charca.position.set(-600, -2, 500);
  charca.scale.set(1, 1, 1.5);
  charca.receiveShadow = true;
  charca.castShadow = true;
  scene.add(charca);
}

function updateAspectRatio() {
  // Indicarle al motor las nuevas dimensiones
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Calcumar la nueva razon aspecto
  var ar = window.innerWidth / window.innerHeight;
  
  // Variamos el volumen de la vista, portanto la matriz de projeccion
  // si variamos
  camera.aspect = ar;
  camera.updateProjectionMatrix();
}

function update() {
  // Cambios entre frames
  var ahora = Date.now();	// Hora actual

  dia += ahora - antes;
  if (dia > 500){
    intensida += tiempo;
    luzAmbiente.intensity = intensida;
    luzFocal.intensity = intensida;
    dia = 0;
  }
  

  if (intensida >= 1) tiempo = -0.05;
  if (intensida <= 0) tiempo = 0.05;

  // Obtener la nueva posicion en funcion del giro aplicado
  /* x += velocidad * tiempo_transcurrido * Math.cos(giro);
  z += velocidad * tiempo_transcurrido * Math.sin(giro);

  var vector = snake[0].worldToLocal(new THREE.Vector3(x, 0, z));
  snake[0].rotation.y = giro;
  snake[0].position.x = vector.x;
  snake[0].position.z = vector.z; */

  /* var spline = new THREE.CatmullRomCurve3([
    snake[0].position,
    snake[4].position,
    snake[9].position,
    snake[13].position,
    snake[19].position
  ]);
  
  var points = spline.getPoints( 19 ); */
  
  for (var i = 0; i < snake.length; i++) {
    /* snake[i].position.x = points[i].x;
    snake[i].position.x = points[i].z; */
    if (left) snake[i].position.z += 1;
    if (right) snake[i].position.z -= 1;
    if (up) snake[i].position.x -= 1;
    if (bottom) snake[i].position.x += 1;
  }
  
  // Actualizar antes
  antes = ahora;

	// Control de camra
	cameraControler.update();
	// Actualiza los FPS
	stats.update();
}

function render() {
  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.clear();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );
}

function keydown(e) {
  switch (e.keyCode) {
    case 37:
      left = true;
      if (giro < 6.083) giro += 0.2;
      else giro = 6.283;
      //giro -= 1 * Math.PI / 180;
      break;
    case 39:
      right = true;
      if (giro > 0.2) giro -= 0.2;
		  else giro = 6.283;
      //giro += 1 * Math.PI / 180;
      break;
    case 38:
      up = true;
      velocidad += 1;
      break;
    case 40:
      bottom = true;
      if (velocidad > 0.4) velocidad -= 0.4;
		  else velocidad = 0;
      break;
  }
}

function keyup(e) {
  switch (e.keyCode) {
    case 37:
      left = false;
      break;
    case 39:
      right = false;
      break;
    case 38:
      up = false;
      break;
    case 40:
      bottom = false;
      break;
  }
}

function createSnake(head) {
  var serpiente = new THREE.Object3D();
  var textureSnake = new THREE.TextureLoader().load("images/mamba.jpg");
  var materialSnake = new THREE.MeshLambertMaterial({ color: 'white', map: textureSnake });

  var spline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(75, 0, 40),
    new THREE.Vector3(150, 0, -40),
    new THREE.Vector3(225, 0, 40),
    new THREE.Vector3(300, 0, 0)
  ]);
  
  var points = spline.getPoints( 19 );
  
  for (var i = 0; i < points.length; i++) {
    var p = points[i];

    if (i == 0) {
      head.rotation.y = Math.PI/2;
      head.position.set(p.x, 15, p.z);
      head.scale.set(6, 6, 6);
      head.receiveShadow = true;
      head.castShadow = true;
      snake.push(head);
		  serpiente.add( head );

    } else if (i == 19) {
      var tail = new THREE.Object3D();
      tail.position.set(p.x, 10, p.z);

      var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), materialSnake);
      sphere.receiveShadow = true;
      sphere.castShadow = true;
      tail.add(sphere);
      
      var tailCylinder = new THREE.Mesh( new THREE.CylinderGeometry( 10, 0, 30, 30 ), materialSnake );
      tailCylinder.rotation.z = Math.PI / 2;
      tailCylinder.position.x = 15;
      tailCylinder.receiveShadow = true;
      tailCylinder.castShadow = true;
      tail.add(tailCylinder);

      snake.push(tail);
		  serpiente.add(tail);
      
    } else {
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), materialSnake);
      sphere.position.set(p.x, 10, p.z);
      sphere.receiveShadow = true;
      sphere.castShadow = true;
      snake.push(sphere);
		  serpiente.add(sphere);
    }

    
  };

  scene.add(serpiente);
}

function createHouse() {
  var barrio = new THREE.Object3D();
  var textureBarro = new THREE.TextureLoader().load("images/barro.jpg");
  var materialBarro = new THREE.MeshLambertMaterial({ color: 'white', map: textureBarro });

  var house = new THREE.Mesh( new THREE.CylinderGeometry( 100, 100, 200, 50 ), materialBarro );
  house.position.y = 100;
  house.receiveShadow = true;
  house.castShadow = true;
  barrio.add(house);

  var texturePaja = new THREE.TextureLoader().load("images/paja.jpg");
  var materialPaja = new THREE.MeshLambertMaterial({ color: 'white', map: texturePaja });

  var techo = new THREE.Mesh( new THREE.CylinderGeometry( 120, 0, 60, 50 ), materialPaja );
  techo.rotation.z = Math.PI;
  techo.position.y = 230;
  techo.receiveShadow = true;
  techo.castShadow = true;
  barrio.add(techo);
  
  return barrio;
}

function createTree() {
  var tree = new THREE.Object3D();
  var textureTronco = new THREE.TextureLoader().load("images/tronco.jpg");
  var materialTronco = new THREE.MeshLambertMaterial({ color: 'white', map: textureTronco });

  var tronco = new THREE.Mesh( new THREE.CylinderGeometry( 10, 10, 200, 30 ), materialTronco );
  tronco.position.y = 100;
  tronco.receiveShadow = true;
  tronco.castShadow = true;
  tree.add(tronco);

  var textureHojas = new THREE.TextureLoader().load("images/hojas.jpg");
  var materialHojas = new THREE.MeshLambertMaterial({ color: 'white', map: textureHojas });

  var hojas = new THREE.Mesh( new THREE.SphereGeometry( 60, 30, 30 ), materialHojas );
  hojas.position.y = 160;
  hojas.receiveShadow = true;
  hojas.castShadow = true;
  tree.add(hojas);

  return tree
}

function createArbustos() {
  var arbustos = new THREE.Object3D();

  var textureHojas = new THREE.TextureLoader().load("images/hojas.jpg");
  var materialHojas = new THREE.MeshLambertMaterial({ color: 'white', map: textureHojas });

  var textureHojas2 = new THREE.TextureLoader().load("images/hojas-marrones.jpg");
  var materialHojas2 = new THREE.MeshLambertMaterial({ color: 'white', map: textureHojas2 });

  var hojas = new THREE.Mesh( new THREE.SphereGeometry( 60, 30, 30 ), materialHojas2 );
  hojas.receiveShadow = true;
  hojas.castShadow = true;
  arbustos.add(hojas);

  var cubo = new THREE.Mesh( new THREE.BoxGeometry( 50, 50, 100, 100 ), materialHojas );
  cubo.position.set(30, 25, 40);
  cubo.receiveShadow = true;
  cubo.castShadow = true;
  arbustos.add(cubo);

  return arbustos;
}

function createBosque() {
  var bosque = new THREE.Object3D();

  for(var i=0; i<10; i++) {
    if ( i%2 != 0) {
      var tree = createTree();
      tree.position.set(0, 0, i*100);
      bosque.add(tree);

      var tree2 = createTree();
      tree2.position.set(0, 0, -i*100);
      bosque.add(tree2);
    } else {
      var arbusto = createArbustos();
      arbusto.position.set(-50, 0, i*100);
      bosque.add(arbusto);
  
      var arbusto2 = createArbustos();
      arbusto2.position.set(-50, 0, -i*100);
      bosque.add(arbusto2);
    }
  }

  return bosque;
}