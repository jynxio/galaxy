import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * Base
 */

// Canvas
const canvas = document.createElement( "canvas" );

document.body.append( canvas );

// Scene
const scene = new three.Scene();

/**
 * Galaxy
 */
let geometry;
let material;
let points;

const parameters = {
    count: 100000,
    size: 1,
    radius: 5,
    branches: 3,
    spin: 5,
    randomness: 1,
    randomnessPower: 4,
    insideColor: 0xff6030,
    outsideColor: 0x1b3984,
};

generateGalaxy( parameters );

function generateGalaxy() {

    if ( points ) {

        geometry.dispose();
        material.dispose();
        scene.remove( points );

    }

    /**
     * Geometry
     */
    geometry = new three.BufferGeometry();

    const positions = new Float32Array( parameters.count * 3 );
    const colors = new Float32Array( parameters.count * 3 );

    const color_inside = new three.Color( parameters.insideColor );
    const color_outside = new three.Color( parameters.outsideColor );

    for ( let i = 0; i < parameters.count; i ++ ) {

        const i_3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spin_angle = radius * parameters.spin;
        const branch_angle = ( i % parameters.branches ) / parameters.branches * Math.PI * 2;

        //
        const random_x = Math.pow( Math.random(), parameters.randomnessPower ) * ( Math.random() < 0.5 ? 1 : -1 ) * parameters.randomness * radius;
        const random_y = Math.pow( Math.random(), parameters.randomnessPower ) * ( Math.random() < 0.5 ? 1 : -1 ) * parameters.randomness * radius;
        const random_z = Math.pow( Math.random(), parameters.randomnessPower ) * ( Math.random() < 0.5 ? 1 : -1 ) * parameters.randomness * radius;

        positions[ i_3 ] = Math.cos( branch_angle + spin_angle ) * radius + random_x;
        positions[ i_3 + 1 ] = random_y;
        positions[ i_3 + 2 ] = Math.sin( branch_angle + spin_angle ) * radius + random_z;

        //
        const mixed_color = color_inside.clone().lerp( color_outside, radius / parameters.radius );

        colors[ i_3 ] = mixed_color.r;
        colors[ i_3 + 1 ] = mixed_color.g;
        colors[ i_3 + 2 ] = mixed_color.b;

    }

    geometry.setAttribute( "position", new three.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( "color", new three.BufferAttribute( colors, 3 ) );

    /**
     * Material
     */
    material = new three.PointsMaterial( {
        size: parameters.size,
        sizeAttenuation: false,
        depthWrite: false,
        blending: three.AdditiveBlending,
        vertexColors: true,
    } );

    /**
     * Points
     */
    points = new three.Points( geometry, material );
    scene.add( points );

}

/**
 * Size
 */
const size = {
    width: globalThis.innerWidth,
    height: globalThis.innerHeight
};

globalThis.addEventListener( "resize", () => {

    size.width = globalThis.innerWidth;
    size.height = globalThis.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize( size.width, size.height );
    renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );

})

/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera( 75, size.width / size.height, 0.1, 100 );
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add( camera );

// Controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer( {
    canvas: canvas,
    antialias: true
} );
renderer.setSize( size.width, size.height );
renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );

/**
 * Animate
 */
const clock = new three.Clock();

tick();

function tick() {

    globalThis.requestAnimationFrame( tick );

    const elapsed_time = clock.getElapsedTime();

    points.rotation.y = elapsed_time * 0.1;

    controls.update();
    renderer.render( scene, camera );

}

/**
 * 泛光
 */
floodlight();

function floodlight() {

    const composer = new EffectComposer( renderer );                                                                              // 效果合成器
    const pass_render = new RenderPass( scene, camera );                                                                          // 后期处理（基本）
    const pass_bloom = new UnrealBloomPass( new three.Vector2( globalThis.innerWidth, globalThis.innerHeight ), 1.5, 0.4, 0.85 ); // 后期处理（泛光）

    pass_bloom.renderToScreen = true; // 最终过程是否被渲染到屏幕
    pass_bloom.threshold = 0;         // ？
    pass_bloom.strength = 1;          // 强度
    pass_bloom.radius = 0;            // 半径

    composer.setSize( globalThis.innerWidth, globalThis.innerHeight ); // 尺寸
    composer.addPass( pass_render );                                   // 将该后期处理环节添加至过程链
    composer.addPass( pass_bloom );                                    // 将该后期处理环节添加至过程链

    renderer.setAnimationLoop( () => {

        composer.render();  // 按顺序执行所有启用的后期处理环节, 来产生最终的帧

    } );

    globalThis.addEventListener( "resize", _ => {

        composer.setSize( globalThis.innerWidth, globalThis.innerHeight );

    } );

}
