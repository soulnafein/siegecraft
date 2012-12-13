var Siegecraft = Siegecraft || {};
(function() {
  Siegecraft.World = makeClass();
  var proto = Siegecraft.World.prototype;

  proto.init = function() {
    this.width = 128;
    this.depth = 128;
    this.halfWidth = this.width / 2
    this.halfDepth = this.depth / 2
  };

  proto.generate = function() {
    this.data = generateHeight( this.width, this.depth );


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

    for ( var z = 0; z < this.depth; z ++ ) {

      for ( var x = 0; x < this.width; x ++ ) {

        var h = this.getY( x, z );

        dummy.position.x = x * 100 - this.halfWidth * 100;
        dummy.position.y = h * 100;
        dummy.position.z = z * 100 - this.halfDepth * 100;

        var px = this.getY( x + 1, z );
        var nx = this.getY( x - 1, z );
        var pz = this.getY( x, z + 1 );
        var nz = this.getY( x, z - 1 );

        dummy.geometry = pyGeometry;
        THREE.GeometryUtils.merge( geometry, dummy );

        if ( ( px != h && px != h + 1 ) || x == 0 ) {

          dummy.geometry = pxGeometry;
          THREE.GeometryUtils.merge( geometry, dummy );

        }

        if ( ( nx != h && nx != h + 1 ) || x == this.width - 1 ) {

          dummy.geometry = nxGeometry;
          THREE.GeometryUtils.merge( geometry, dummy );

        }

        if ( ( pz != h && pz != h + 1 ) || z == this.depth - 1 ) {

          dummy.geometry = pzGeometry;
          THREE.GeometryUtils.merge( geometry, dummy );

        }

        if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

          dummy.geometry = nzGeometry;
          THREE.GeometryUtils.merge( geometry, dummy );

        }

      }

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

  proto.getY = function( x, z ) {
    return ( this.data[ x + z * this.width ] * 0.2 ) | 0;
  };

  function generateHeight( width, height ) {
    var data = [], perlin = new ImprovedNoise(),
    size = width * height, quality = 2, z = Math.random() * 100;

    for ( var j = 0; j < 4; j ++ ) {
      if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;

      for ( var i = 0; i < size; i ++ ) {
        var x = i % width, y = ( i / width ) | 0;
        data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
      }

      quality *= 4
    }

    return data;
  }
}())
