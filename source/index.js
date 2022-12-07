import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Gui from "lil-gui";

import vertex_shader from "./vertex.glsl?raw";

import fragment_shader from "./fragment.glsl?raw";

/* ------------------------------------------------------------------------------------------------------ */
/**
 * Camera
 */
const camera = new three.PerspectiveCamera( 75, globalThis.innerWidth / globalThis.innerHeight, 0.01, 100 );

camera.position.set( 3, 3, 3 );

/**
 * Scene
 */
const scene = new three.Scene();

scene.add( camera );

/**
 * Renderer
 */
const canvas = document.querySelector( "canvas" );
const renderer = new three.WebGLRenderer( { canvas, antialias: globalThis.devicePixelRatio < 2 } );

renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
renderer.setSize( globalThis.innerWidth, globalThis.innerHeight );

/**
 * Controls
 */
const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;

/**
 * Resize
 */
globalThis.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
    renderer.setSize( globalThis.innerWidth, globalThis.innerHeight);

    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();

} );

/**
 * Render
 */
renderer.setAnimationLoop( function loop() {

    controls.update();

    renderer.render( scene, camera );

} );

/* ------------------------------------------------------------------------------------------------------ */
/**
 * Debug
 */
const gui = new Gui();
const parameter = {
    count: 100000,
    radius: 5,
    branchCount: 3,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: 0xff6030,
    outsideColor: 0x1b3984,
};

gui.add( parameter, "count" ).min( 100 ).max( 1000000 ).step( 100 ).onFinishChange( updateGalaxy );
gui.add( parameter, "radius" ).min( 0.01 ).max( 20 ).step( 0.01 ).onFinishChange( updateGalaxy );
gui.add( parameter, "branchCount" ).min( 2 ).max( 20 ).step( 1 ).onFinishChange( updateGalaxy );
gui.add( parameter, "randomness" ).min( 0 ).max( 2 ).step( 0.001 ).onFinishChange( updateGalaxy );
gui.add( parameter, "randomnessPower" ).min( 1 ).max( 10 ).step( 0.001 ).onFinishChange( updateGalaxy );

gui.addColor( parameter, "insideColor" ).onFinishChange( updateGalaxy );
gui.addColor( parameter, "outsideColor" ).onFinishChange( updateGalaxy );

/**
 * Galaxy
 */
let galaxy;

/**
 * 更新Galaxy。
 */
function updateGalaxy () {

    if ( galaxy ) {

        scene.remove( galaxy );

        galaxy.geometry.dispose();
        galaxy.material.dispose();

    }

    galaxy = createGalaxy( parameter );

    scene.add( galaxy );

}

/**
 * 创建Galaxy。
 * @param { Object } parameter - 参数字典。
 * @param { number } parameter.count - 粒子的数量。
 * @param { number } parameter.radius - 银河的半径。
 * @param { number } parameter.branchCount - 分支的数量。
 * @param { number } parameter.randomness - ???
 * @param { number } parameter.randomnessPower - ???
 * @param { number } parameter.insideColor - 内环的颜色（hex格式）。
 * @param { number } parameter.outsideColor - 外环的颜色（hex格式）。
 * @returns { Points } - Points实例。
 */
function createGalaxy ( parameter ) {}
