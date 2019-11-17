THREEx.ArToolkitContext.baseURL = '../data/'

var renderer	= new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( 640, 480 );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );

// array of functions for the rendering loop
var onRenderFcts= [];

// init scene and camera
var scene	= new THREE.Scene();

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
	// to read from the webcam
	// sourceType : 'webcam',

	// // to read from an image
	// sourceType : 'image',
	// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

	// to read from a video
	sourceType : 'video',
	sourceUrl : '../assets/test.mp4',

})

// arToolkitSource.init(() => {
//     rootDiv.appendChild(arToolkitSource.domElement);
//     onResize();
// });
// arToolkitSource.domElement.srcObject = webRTCRemoteStream;

arToolkitSource.init(function onReady(){
	onResize()
})

// handle resize
window.addEventListener('resize', function(){
	onResize()
})
function onResize(){
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if( arToolkitContext.arController !== null ){
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
	}
}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
	// cameraParametersUrl: 'data/camera_para.dat',
	cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/camera_para.dat',
	detectionMode: 'mono',
})
// initialize it
arToolkitContext.init(function onCompleted(){
	// copy projection matrix to camera
	camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

// update artoolkit on every frame
onRenderFcts.push(function(){
	if( arToolkitSource.ready === false )	return

	arToolkitContext.update( arToolkitSource.domElement )

	// update scene.visible if the marker is seen
	scene.visible = camera.visible
})

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
	type : 'pattern',
	patternUrl : THREEx.ArToolkitContext.baseURL + 'data/patt.kanji',
	// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
	// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
	changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot
var geometry	= new THREE.CubeGeometry(1,1,1);
var material	= new THREE.MeshNormalMaterial({
	transparent : true,
	opacity: 0.5,
	side: THREE.DoubleSide
});
var mesh	= new THREE.Mesh( geometry, material );
mesh.position.y	= geometry.parameters.height/2
scene.add( mesh );


// Create a material
var textureLoader = new THREE.TextureLoader();
var map = textureLoader.load('../assets/texture.png');
var material = new THREE.MeshPhongMaterial({map: map});

var loader = new THREE.OBJLoader();
loader.load('../assets/stitch.OBJ', function ( object ) {

	// For any meshes in the model, add our material.
	object.traverse( function ( node ) {

		if ( node.isMesh ) {
			node.material = material;
		}

	} );

	object.scale.x = .2
	object.scale.y = .2
	object.scale.z = .2

	// object.scale.x = 2

	// Add the model to the scene.
	scene.add( object );

	onRenderFcts.push(function(delta){
		object.rotation.y += Math.PI*delta
	})
} );

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function(){
	renderer.render( scene, camera );
})

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})
