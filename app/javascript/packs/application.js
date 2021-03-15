// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.


require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("turbolinks").start()
require("jquery")
require("stylesheets/application.scss")

import { gsap, TweenLite, TweenMax, Sine } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import CameraControls from 'camera-controls';
import { GodRaysEffect, EffectPass, RenderPass, EffectComposer} from "postprocessing";
import Cursor from './cursor3';


CameraControls.install( { THREE: THREE } );



const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const cubeTextureLoader = new THREE.CubeTextureLoader()

let canvas, scene, renderer, sizes, camera, updateAllMaterials, environmentMap, directionalLight, cameraControls, listener, sound, audioLoader

function initScene(){







}

$(document).ready(function() {

  canvas = document.querySelector('.webgl')
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     antialias: true
  })

  sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }

  camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100)

  window.addEventListener('resize', () =>
  {

      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  updateAllMaterials = () =>
  {
      scene.traverse((child) =>
      {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
          {
              child.material.envMapIntensity = 0.2
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
          }
      })
  }
  environmentMap = cubeTextureLoader.load([
      '/textures/environmentMap/px.png',
      '/textures/environmentMap/nx.png',
      '/textures/environmentMap/py.png',
      '/textures/environmentMap/ny.png',
      '/textures/environmentMap/pz.png',
      '/textures/environmentMap/nz.png'
  ])
  environmentMap.encoding = THREE.sRGBEncoding
  scene.environment = environmentMap


  directionalLight = new THREE.DirectionalLight('#ffffff', 3)


  camera.position.set(0, 10, 0)
  camera.lookAt(0, 0, 0)
  scene.add(camera)



  listener = new THREE.AudioListener();
  camera.add( listener );

  // create a global audio source
  sound = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  // audioLoader = new THREE.AudioLoader();
  // audioLoader.load( '/sounds/background.ogg', function( buffer ) {
  //   sound.setBuffer( buffer );
  //   sound.setLoop( true );
  //   sound.setVolume( 0.5 );
  //   sound.play();
  // });

  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



  cameraControls = new CameraControls( camera, renderer.domElement);
  cameraControls.enabled = false;


  function firstScene(){
    directionalLight.castShadow = true
    directionalLight.intensity = 0.3
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, - 2.25)
    scene.add(directionalLight)

    gltfLoader.load(
        '/models/composition.gltf',
        (gltf) =>
        {
            console.log()
            gltf.scene.scale.set(1, 1, 1)
            scene.add(gltf.scene)
            updateAllMaterials()
            cameraControls.setLookAt( 1, 1.5, 2, -5, 0, -2, true )
        }
    )

    const geometry = new THREE.CircleGeometry( 7, 60 );
    const groundMirror = new Reflector( geometry, {
      transparent:true,
      clipBias: 0.005,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x777777,
      shader: {
        transparent: true,
        uniforms: {
      		'color': {
      			value: null
      		},
      		'tDiffuse': {
      			value: null
      		},
      		'textureMatrix': {
      			value: null
      		}
        },
        vertexShader:`
        uniform mat4 textureMatrix;
        varying vec4 vUv;

        void main() {

          vUv = textureMatrix * vec4( position, 1.0 );

          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }`,
        fragmentShader:`
          uniform vec3 color;
          uniform sampler2D tDiffuse;
          varying vec4 vUv;

          float blendOverlay( float base, float blend ) {

            return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

          }

          vec3 blendOverlay( vec3 base, vec3 blend ) {

            return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

          }

          void main() {

            vec4 base = texture2DProj( tDiffuse, vUv );
            gl_FragColor = vec4( blendOverlay( base.rgb, color ), 0.2 );

          }`


      }

    });
    groundMirror.position.y = 0.01;
    groundMirror.rotateX( - Math.PI / 2 );
    scene.add( groundMirror );

    // const curve = new THREE.CatmullRomCurve3( [
    //   new THREE.Vector3( - 3,   2, 1 ),
    //   new THREE.Vector3(   2,   2, 0 ),
    //   new THREE.Vector3( - 1,   0, 3 ),
    //   new THREE.Vector3(   2, - 1, 0 ),
    // ] );
    // const points = curve.getPoints( 50 );
    // const pathMesh = new THREE.Line(
    //   new THREE.BufferGeometry().setFromPoints( points ),
    //   new THREE.LineBasicMaterial( { color: 0x00ffff } )
    // );
    // scene.add( pathMesh );
  }

  firstScene()

  const clock = new THREE.Clock()
  let previousTime = 0

  const tick = () =>
  {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime
      renderer.render(scene, camera)

      const updated = cameraControls.update(deltaTime);
      if ( updated ) {
       renderer.render( scene, camera );
      }

      window.requestAnimationFrame(tick)
  }

  tick()

  const cursor = new Cursor(document.querySelector('.cursor'));
  [...document.querySelectorAll('a')].forEach(el => {
      el.addEventListener('mouseenter', () => cursor.emit('enter'));
      el.addEventListener('mouseleave', () => cursor.emit('leave'));
  });
  [...document.querySelectorAll('button')].forEach(el => {
      el.addEventListener('mouseenter', () => cursor.emit('enter'));
      el.addEventListener('mouseleave', () => cursor.emit('leave'));
  });
  initScene()
});



$(document).on('turbolinks:load', function() {
  initScene()
  console.log(2)
})



$(document).on('turbolinks:request-start.transition', function() {
  console.log('turbolinks:request-start.transition')
})

$(document).on('turbolinks:load.transition', function() {
  console.log('turbolinks:load.transition')
})
