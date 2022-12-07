import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* ------------------------------------------------------------------------------------------------------ */
/* Camera */
const camera = new three.PerspectiveCamera( 75, globalThis.innerWidth / globalThis.innerHeight, 0.01, 100 );

camera.position.set( 0, 0, 3 );

/* Scene */
const scene = new three.Scene();

scene.add( camera );

/* Renderer */
const canvas = document.querySelector( "canvas" );
const renderer = new three.WebGLRenderer( { canvas, antialias: globalThis.devicePixelRatio < 2 } );

renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
renderer.setSize( globalThis.innerWidth, globalThis.innerHeight );

/* Controls */
const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;

/* Resize */
globalThis.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
    renderer.setSize( globalThis.innerWidth, globalThis.innerHeight);

    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();

} );

/* Render */
renderer.setAnimationLoop( function loop() {

    controls.update();

    renderer.render( scene, camera );

} );

/* ------------------------------------------------------------------------------------------------------ */
/* Test */
const mesh = new three.Mesh( new three.BoxGeometry(), new three.MeshNormalMaterial() );

scene.add( mesh );
