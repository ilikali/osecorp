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


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer, GodRays } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );



const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const cubeTextureLoader = new THREE.CubeTextureLoader()

$(document).ready(function() {
  const canvas = document.querySelector('.webgl')
  const gui = new dat.GUI();
  const debugObject = {}

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     antialias: true
  })

  const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

  window.addEventListener('resize', () =>
  {

      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  const updateAllMaterials = () =>
  {
      scene.traverse((child) =>
      {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
          {
              // child.material.envMap = environmentMap
              child.material.envMapIntensity = debugObject.envMapIntensity
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
          }
      })
  }


  const environmentMap = cubeTextureLoader.load([
      '/textures/environmentMap/px.png',
      '/textures/environmentMap/nx.png',
      '/textures/environmentMap/py.png',
      '/textures/environmentMap/ny.png',
      '/textures/environmentMap/pz.png',
      '/textures/environmentMap/nz.png'
  ])
  environmentMap.encoding = THREE.sRGBEncoding
  scene.environment = environmentMap



  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)

  gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
  gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
  gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
  gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


  camera.position.set(2, 2, 2)
  gui.add(camera.position, 'x').min(- 5).max(5).step(0.001).name('cameraX')
  gui.add(camera.position, 'y').min(- 5).max(5).step(0.001).name('cameraY')
  gui.add(camera.position, 'z').min(- 5).max(5).step(0.001).name('cameraZ')
  scene.add(camera)

  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


  debugObject.envMapIntensity = 0.5
  gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

  const cameraControls = new CameraControls( camera, renderer.domElement);
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
            gltf.scene.scale.set(1, 1, 1)
            scene.add(gltf.scene)
            updateAllMaterials()
        }
    )

    const geometry = new THREE.CircleGeometry( 7, 60 );
    const groundMirror = new Reflector( geometry, {
    	clipBias: 0.005,
    	textureWidth: window.innerWidth * window.devicePixelRatio,
    	textureHeight: window.innerHeight * window.devicePixelRatio,
    	color: 0x777777
    });
    groundMirror.position.y = 0.01;
    groundMirror.rotateX( - Math.PI / 2 );
    scene.add( groundMirror );

    const curve = new THREE.CatmullRomCurve3( [
    	new THREE.Vector3( - 3,   2, 1 ),
    	new THREE.Vector3(   2,   2, 0 ),
    	new THREE.Vector3( - 1,   0, 3 ),
    	new THREE.Vector3(   2, - 1, 0 ),
    ] );
    const points = curve.getPoints( 50 );
    const pathMesh = new THREE.Line(
    	new THREE.BufferGeometry().setFromPoints( points ),
    	new THREE.LineBasicMaterial( { color: 0x00ffff } )
    );
    scene.add( pathMesh );
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

});






// window.addEventListener('resize', () =>
// {
//
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })
//
// const updateAllMaterials = () =>
// {
//     scene.traverse((child) =>
//     {
//         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
//         {
//             // child.material.envMap = environmentMap
//             child.material.envMapIntensity = debugObject.envMapIntensity
//             child.material.needsUpdate = true
//             child.castShadow = true
//             child.receiveShadow = true
//         }
//     })
// }
//
//
// const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMap/px.png',
//     '/textures/environmentMap/nx.png',
//     '/textures/environmentMap/py.png',
//     '/textures/environmentMap/ny.png',
//     '/textures/environmentMap/pz.png',
//     '/textures/environmentMap/nz.png'
// ])
// environmentMap.encoding = THREE.sRGBEncoding
// scene.environment = environmentMap
//
//
//
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
//
// // gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// // gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
// // gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
// // gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
//
//
// camera.position.set(2, 2, 2)
// // gui.add(camera.position, 'x').min(- 5).max(5).step(0.001).name('cameraX')
// // gui.add(camera.position, 'y').min(- 5).max(5).step(0.001).name('cameraY')
// // gui.add(camera.position, 'z').min(- 5).max(5).step(0.001).name('cameraZ')
// scene.add(camera)
//
// renderer.physicallyCorrectLights = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMappingExposure = 3
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//
//
// debugObject.envMapIntensity = 0.5
// // gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
//
// const cameraControls = new CameraControls( camera, renderer.domElement);
// cameraControls.enabled = false;
//
//
// const clock = new THREE.Clock()
// let previousTime = 0
//
// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime
//     renderer.render(scene, camera)
//
//     const updated = cameraControls.update( deltaTime );
//     if ( updated ) {
//      renderer.render( scene, camera );
//     }
//
//     window.requestAnimationFrame(tick)
// }
//
// tick()


$(document).on('turbolinks:request-start.transition', function() {
  console.log('turbolinks:request-start.transition')
})

$(document).on('turbolinks:load.transition', function() {
  console.log('turbolinks:load.transition')
})
