import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Gui from "lil-gui";

import vertex_shader from "./vertex.glsl?raw";

import fragment_shader from "./fragment.glsl?raw";

import { calculatePointRotateAroundAxis } from "./math";

/* ------------------------------------------------------------------------------------------------------ */
/**
 * Camera
 */
const camera = new three.PerspectiveCamera( 75, globalThis.innerWidth / globalThis.innerHeight, 0.01, 100 );

camera.position.set( 0, 0, 3 );

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
    // radius: 5,
    // branchCount: 3,
    // randomness: 0.2,

    count: 500000,
    size: 0.01,
    insideColor: 0xff6030,
    outsideColor: 0x1b3984,
    armLength: 5,           // 旋臂的长度
    armRadius: 0.5,         // 旋臂的半径
    eccentricity: 8,        // 离心率
    spin: 0.5,              // 旋转程度
};

gui.add( parameter, "count" ).min( 10000 ).max( 1000000 ).step( 100 ).onFinishChange( updateGalaxy );
gui.add( parameter, "size" ).min( 0.001 ).max( 0.05 ).step( 0.001 ).onFinishChange( updateGalaxy );
gui.add( parameter, "armLength" ).min( 1 ).max( 10 ).step( 0.01 ).onFinishChange( updateGalaxy );
gui.add( parameter, "armRadius" ).min( 0.1 ).max( 10 ).step( 0.1 ).onFinishChange( updateGalaxy );
gui.add( parameter, "eccentricity" ).min( 1 ).max( 20 ).step( 0.001 ).onFinishChange( updateGalaxy );
gui.add( parameter, "spin" ).min( 0.1 ).max( 1 ).step( 0.01 ).onFinishChange( updateGalaxy );
// gui.add( parameter, "radius" ).min( 0.01 ).max( 20 ).step( 0.01 ).onFinishChange( updateGalaxy );
// gui.add( parameter, "branchCount" ).min( 2 ).max( 20 ).step( 1 ).onFinishChange( updateGalaxy );
// gui.add( parameter, "randomness" ).min( 0 ).max( 2 ).step( 0.001 ).onFinishChange( updateGalaxy );

gui.addColor( parameter, "insideColor" ).onFinishChange( updateGalaxy );
gui.addColor( parameter, "outsideColor" ).onFinishChange( updateGalaxy );

/**
 * 初始化Galaxy
 */
let galaxy;

updateGalaxy();

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
 * @returns { Points } - Points实例。
 */
function createGalaxy ( parameter ) {

    /**
     * Geometry
     */
    const color_array = new Float32Array( parameter.count * 3 );
    const scale_array = new Float32Array( parameter.count * 1 );
    const position_array = new Float32Array( parameter.count * 3 );
    const randomness_array = new Float32Array( parameter.count * 3 );

    const inside_color = new three.Color( parameter.insideColor );
    const outside_color = new three.Color( parameter.outsideColor );

    for ( let i = 0; i < parameter.count; i ++ ) {

        const i_3 = i * 3;

        /**
         * Position
         */
        // let x
        //     = ( Math.random() < 0.5 ? 1 : - 1 )
        //     * Math.random() * parameter.armLength;

        // const random_radius
        //     = Math.random() * parameter.armRadius
        //     * Math.pow( Math.random(), parameter.eccentricity );

        // let y
        //     = ( Math.random() < 0.5 ? 1 : - 1 )
        //     * Math.random() * random_radius;

        // let z
        //     = ( Math.random() < 0.5 ? 1 : - 1 )
        //     * Math.sqrt( random_radius * random_radius - y * y );

        const radius = ( Math.random() < 0.5 ? 1 : - 1 ) * Math.random() * parameter.armLength; // 该点距原点的距离
        const rotation = Math.abs( radius ) * Math.PI * 2 * parameter.spin;                     // 该点绕原点的旋转角度

        let x = radius * Math.cos( rotation );
        let y = radius * Math.sin( rotation );

        let z = ( Math.random() < 0.5 ? 1 : - 1 ) * Math.random() * parameter.armRadius;

        y += ( Math.random() < 0.5 ? 1 : - 1 ) * Math.sqrt( parameter.armRadius * parameter.armRadius - z * z )

        position_array[ i_3 + 0 ] = x;
        position_array[ i_3 + 1 ] = y;
        position_array[ i_3 + 2 ] = z;

        /**
         * Color
         */
        // const mixed_color = inside_color.clone().lerp( outside_color, random_radius / parameter.armRadius * 2 );

        // color_array[ i_3 + 0 ] = mixed_color.r;
        // color_array[ i_3 + 1 ] = mixed_color.g;
        // color_array[ i_3 + 2 ] = mixed_color.b;

    }

    const geometry = new three.BufferGeometry();

    geometry.setAttribute( "position", new three.BufferAttribute( position_array, 3 ) );
    geometry.setAttribute( "color", new three.BufferAttribute( color_array, 3 ) );

    /**
     * Material
     */
    const material = new three.PointsMaterial( {
        size: parameter.size,
        sizeAttenuation: true,
        vertexColors: false,
        depthWrite: false,
        depthTest: false,
        blending: three.AdditiveBlending,
    } );

    /**
     * Points
     */
    const points = new three.Points( geometry, material );

    return points;

}

/**
 * 创建一个位于球体之内的随机位置（球心坐标默认为[0,0,0]）。
 * @param { number } radius - 球的半径。
 * @returns { number[] } - 随机位置。
 */
function createRandomSpherePosition ( radius ) {

    const random_radius = Math.random() * radius;

    let x = Math.random() * random_radius;
    let y = Math.random() * Math.sqrt( random_radius * random_radius - x * x );
    let z = Math.sqrt( random_radius * random_radius - y * y - x * x );

    x *= Math.random() < 0.5 ? 1 : - 1;
    y *= Math.random() < 0.5 ? 1 : - 1;
    z *= Math.random() < 0.5 ? 1 : - 1;

    return [ x, y, z ];

}
