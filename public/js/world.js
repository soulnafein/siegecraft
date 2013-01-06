var Siegecraft = Siegecraft || {};
(function() {
  Siegecraft.World = makeClass();
  var proto = Siegecraft.World.prototype;

  proto.init = function() {
    this.width = 20;
    this.depth = 20;
    this.height = 10;
    this.halfWidth = this.width / 2
    this.halfDepth = this.depth / 2
  };

  proto.generate = function() {
    var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
    pxGeometry.faces[ 0 ].materialIndex = 1;
    pxGeometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
    pxGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 50, 0, 0 ) );

    var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
    nxGeometry.faces[ 0 ].materialIndex = 1;
    nxGeometry.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI / 2 ) );
    nxGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( - 50, 0, 0 ) );

    var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
    pyGeometry.faces[ 0 ].materialIndex = 0;
    pyGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    pyGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 50, 0 ) );

    var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
    pzGeometry.faces[ 0 ].materialIndex = 1;
    pzGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 50 ) );

    var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
    nzGeometry.faces[ 0 ].materialIndex = 1;
    nzGeometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    nzGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -50 ) );

    //

    var geometry = new THREE.Geometry();
    var dummy = new THREE.Mesh();

    var response = JSON.parse($.ajax({url: 'http://localhost:5000/world.json', async: false, dataType: 'json'}).response)[0];
    
    for(var i=0; i<response.length; i+=4) {
      var x = response[i].charCodeAt();
      var h = response[i+1].charCodeAt();
      var z = response[i+2].charCodeAt();
      var type = response[i+3].charCodeAt();

      dummy.position.x = x * 100 - this.halfWidth * 100;
      dummy.position.y = h * 100 - this.height*100;
      dummy.position.z = z * 100 - this.halfDepth * 100;


      dummy.geometry = pyGeometry;
      THREE.GeometryUtils.merge( geometry, dummy );

      dummy.geometry = pxGeometry;
      THREE.GeometryUtils.merge( geometry, dummy );

      dummy.geometry = nxGeometry;
      THREE.GeometryUtils.merge( geometry, dummy );

      dummy.geometry = pzGeometry;
      THREE.GeometryUtils.merge( geometry, dummy );

      dummy.geometry = nzGeometry;
      THREE.GeometryUtils.merge( geometry, dummy );
    }

    var textureGrass = THREE.ImageUtils.loadTexture( 'textures/grass.png' );
    textureGrass.magFilter = THREE.NearestFilter;
    textureGrass.minFilter = THREE.LinearMipMapLinearFilter;

    var textureGrassDirt = THREE.ImageUtils.loadTexture( 'textures/grass_dirt.png' );
    textureGrassDirt.magFilter = THREE.NearestFilter;
    textureGrassDirt.minFilter = THREE.LinearMipMapLinearFilter;

    var material1 = new THREE.MeshLambertMaterial( { map: textureGrass, ambient: 0xbbbbbb } );
    var material2 = new THREE.MeshLambertMaterial( { map: textureGrassDirt, ambient: 0xbbbbbb } );

    this.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( [ material1, material2 ] ) );
  };

  proto.addToScene = function( scene ) {
    scene.add( this.mesh );
  };
}())
