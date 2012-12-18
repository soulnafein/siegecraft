var Siegecraft = Siegecraft || {};
(function() {
  Siegecraft.Game = makeClass();
  var proto = Siegecraft.Game.prototype;

  proto.init = function() {
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    this.controls = new THREE.FirstPersonControls( this.camera );

    this.controls.movementSpeed = 1000;
    this.controls.lookSpeed = 0.125;
    this.controls.lookVertical = true;

    this.scene = new THREE.Scene();

    this.world = Siegecraft.World();
    this.world.generate();
    this.world.addToScene( this.scene );


    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    this.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLight.position.set( 1, 1, 0.5 ).normalize();
    this.scene.add( directionalLight );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.bind(this.onWindowResize), false );

    this.animate();
  };

  proto.animate = function() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( this.bind(this.animate) );

    this.controls.update( this.clock.getDelta() );

    this.renderer.render( this.scene, this.camera );
  };

  proto.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.controls.handleResize();
  };
}())


