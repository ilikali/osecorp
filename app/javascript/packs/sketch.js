import { gsap, Power2 } from 'gsap'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import CameraControls from 'camera-controls';
import Cursor from './cursor';
const TWEEN = require('@tweenjs/tween.js')


export default class Sketch{
    constructor(options){

        this.gui = new dat.GUI({
          width: 200,
          closed: true
        })
        this.debugObject = {}

        CameraControls.install({ THREE: THREE });
        let loaded_manager = 1
        // this.loadingManager = new THREE.LoadingManager()
        this.loadingManager = new THREE.LoadingManager(
            () =>
            {
              if(loaded_manager) {
                $(".preloader").fadeOut(800, function(){
                  $(".enter_wrap").fadeIn(800);
                  loaded_manager = 0
                });
              }
            },

            (itemUrl, itemsLoaded, itemsTotal) =>
            {
              const progressRatio = itemsLoaded / itemsTotal * 100
              document.querySelector('.preloader_line').style.width = progressRatio+"%"
            }
        )
        this.dracoLoader = new DRACOLoader(this.loadingManager)
        this.dracoLoader.setDecoderPath('/draco/')

        this.gltfLoader = new GLTFLoader(this.loadingManager)
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)

        this.audioLoader = new THREE.AudioLoader(this.loadingManager);


        this.environmentMap = this.cubeTextureLoader.load([
            '/textures/environmentMap/px.png',
            '/textures/environmentMap/nx.png',
            '/textures/environmentMap/py.png',
            '/textures/environmentMap/ny.png',
            '/textures/environmentMap/pz.png',
            '/textures/environmentMap/nz.png'
        ])
        this.environmentMap.encoding = THREE.sRGBEncoding

        this.time = 0;
        this.clock = new THREE.Clock()
        this.previousTime = 0

        this.container = options.dom;
        this.scene = new THREE.Scene();
        this.scene.environment = this.environmentMap

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100)
        this.camera.position.set(0, 20, 0)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.ReinhardToneMapping
        this.renderer.toneMappingExposure = 3
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize(this.width , this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.cameraControls = new CameraControls( this.camera, this.renderer.domElement);
        this.cameraControls.enabled = false;

        this.container.appendChild( this.renderer.domElement );

        this.audioListener = new THREE.AudioListener();
        this.camera.add( this.audioListener );
        const sound = new THREE.Audio(this.audioListener);
        this.audioLoader.load( '/sounds/background.ogg', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.2 );
          // sound.play();
        });


        document.querySelector('.enter').addEventListener('click', (e)=>{
          $(".enter_wrap").fadeOut(function(){
            $(".total_wrap").addClass("show");
            sound.play();
          })
        });


        this.popped = ('state' in window.history && window.history.state !== null), this.initialURL = location.href;
        window.addEventListener('popstate', (e)=>{
          let initialPop = !this.popped && location.href == this.nitialURL;
          this.popped = true;
          if (initialPop) return;
          this.loadState(location.pathname)
        });

        this.links = [...document.querySelectorAll('a')];
        this.links.forEach((link) => {
          link.addEventListener('click', (e)=>{
            e.preventDefault();
            const url = e.target.getAttribute('href')
            this.loadState(url)
            history.pushState({page:url}, null, url);
          });
        });

        // window.addEventListener('mousewheel', (e)=>{
        //   console.log('mousewheel')
        // })
        //
        // window.addEventListener('DOMMouseScroll', (e)=>{
        //   console.log('DOMMouseScroll')
        // })
        //
        // window.addEventListener('MozMousePixelScroll', (e)=>{
        //   console.log('MozMousePixelScroll')
        // })



        this.initScene();
        this.addCursor();
        this.resize();
        this.setupResize();
        this.composerPass();
        this.render();
    }


    loadState(url){
      let that = this
      $('.fader').fadeIn(1000, function(){
        fetch(url)
        .then(data => {
          return data.text()
        }).then(function(html) {
          let parser = new DOMParser();
          let doc = parser.parseFromString(html, "text/html");
          document.body.classList = doc.body.classList;
          document.querySelector('.content_area').innerHTML = doc.querySelector('.content_area').innerHTML;
          that.initScene();

        }).catch(error => {
          console.log(error)
        });
      })


    }

    initScene(){
      $('.fader').fadeOut(1000);

      while(this.scene.children.length > 0){
        this.scene.remove(this.scene.children[0]);
      }

      if (document.body.classList.contains('action_home')) {




        // function myHandler(event, delta) {
        //     if (event.originalEvent.wheelDelta > 0) {
        //         $("body.action_home").unbind('mousewheel', myHandler);
        //         go_to_slide("prev")
        //     } else {
        //         $("body.action_home").unbind('mousewheel', myHandler)
        //         go_to_slide("next")
        //     }
        // }
        //
        // function go_to_slide(direction) {
        //     console.log(direction)
        //     if (direction == "prev") {
        //
        //     } else {
        //
        //     }
        //
        //     setTimeout(function () {
        //         $("body.action_home").bind("mousewheel", myHandler);
        //         $("body").addClass("for_scroll");
        //     }, 2050);
        // }
        //
        // $("body.action_home").bind("mousewheel", myHandler);


        // scroll start
        // this.cameraControls.setLookAt( 1, 1.5, 2, -5, 0, -2, true )

        // scroll first
        // this.cameraControls.setLookAt( -0.017, 1.768, -0.017, -10, 1.301, -3.418, true )

        let men, light_1, light_2;

        this.gltfLoader.load(
            '/models/composition.gltf',
            (gltf) =>
            {
                gltf.scene.scale.set(1, 1, 1);
                men = gltf.scene.children[3];
                // men.material = new THREE.MeshStandardMaterial({
                //     color: 0x000000,
                //     metalness: 20,
                //     roughness: 20
                // });

                light_1 = gltf.scene.children[4]
                light_2 = gltf.scene.children[5]
                light_2.material = new THREE.MeshBasicMaterial();
                this.scene.add(gltf.scene)
                this.updateAllMaterials()
            }
        )

        let camera = this.camera

        setTimeout(function(){
          gsap.to( camera.position, {
          	duration: 4,
          	x: 2.2,
          	y: 0.9,
          	z: 2.6,
            ease: "power4.inOut"
          });
          gsap.to( camera.rotation, {
          	duration: 4,
          	x: THREE.Math.degToRad(0),
          	y: THREE.Math.degToRad(60),
          	z: THREE.Math.degToRad(0),
            ease: "power4.inOut"
          });
        },2500)

        document.querySelector('.scroll_1').addEventListener('click', (e)=>{

          gsap.to( camera.position, {
          	duration: 4,
          	x: 2.2,
          	y: 0.9,
          	z: 2.6,
            ease: "power4.inOut"
          });
          gsap.to( camera.rotation, {
          	duration: 4,
          	x: THREE.Math.degToRad(0),
          	y: THREE.Math.degToRad(60),
          	z: THREE.Math.degToRad(0),
            ease: "power4.inOut"
          });
        });

        document.querySelector('.scroll_2').addEventListener('click', (e)=>{
          gsap.to( camera.position, {
          	duration: 4,
          	x: 0.22,
          	y: 1.8,
          	z: 0.05,
            ease: "power4.inOut"
          });
          gsap.to( camera.rotation, {
          	duration: 4,
          	x: THREE.Math.degToRad(-10),
          	y: THREE.Math.degToRad(80),
          	z: THREE.Math.degToRad(0),
            ease: "power4.inOut"
          });
        });

        this.camera.rotation.x = THREE.Math.degToRad(-90)


        let that = this
        this.debugObject.positionX = 0.22
        this.debugObject.positionY = 1.8
        this.debugObject.positionZ = 0.05
        this.debugObject.targetX = -10
        this.debugObject.targetY = 80
        this.debugObject.targetZ = 0
        this.gui.add(this.debugObject, 'positionX').min(-20).max(20).step(0.0001).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })
        this.gui.add(this.debugObject, 'positionY').min(-20).max(20).step(0.0001).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })
        this.gui.add(this.debugObject, 'positionZ').min(-20).max(20).step(0.0001).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })

        this.gui.add(this.debugObject, 'targetX').min(-180).max(180).step(1).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })
        this.gui.add(this.debugObject, 'targetY').min(-180).max(180).step(1).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })
        this.gui.add(this.debugObject, 'targetZ').min(-180).max(180).step(1).onChange(function(){
          that.camera.position.set(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ)
          that.camera.rotation.x = THREE.Math.degToRad(that.debugObject.targetX);
          that.camera.rotation.y = THREE.Math.degToRad(that.debugObject.targetY);
          that.camera.rotation.z = THREE.Math.degToRad(that.debugObject.targetZ);
        })



        // this.gui.add(this.debugObject, 'positionY').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'positionZ').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        //
        // this.gui.add(this.debugObject, 'targetX').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'targetY').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'targetZ').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })

        // let that = this
        // this.debugObject.positionX = -0.069
        // this.debugObject.positionY = 1.881
        // this.debugObject.positionZ = -0.089
        // this.debugObject.targetX = -10
        // this.debugObject.targetY = -1.153
        // this.debugObject.targetZ = -6.356
        // this.gui.add(this.debugObject, 'positionX').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'positionY').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'positionZ').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        //
        // this.gui.add(this.debugObject, 'targetX').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'targetY').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })
        // this.gui.add(this.debugObject, 'targetZ').min(-10).max(10).step(0.001).onChange(function(){
        //   that.cameraControls.setLookAt(that.debugObject.positionX, that.debugObject.positionY, that.debugObject.positionZ, that.debugObject.targetX, that.debugObject.targetY, that.debugObject.targetZ, true )
        // })


        this.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        this.directionalLight.castShadow = true
        this.directionalLight.intensity = 0.3
        this.directionalLight.shadow.camera.far = 15
        this.directionalLight.shadow.mapSize.set(1024, 1024)
        this.directionalLight.shadow.normalBias = 0.05
        this.directionalLight.position.set(0.25, 3, - 2.25)
        this.scene.add(this.directionalLight)

        const geometry = new THREE.CircleGeometry( 7, 60 );
        const groundMirror = new Reflector( geometry, {
        	clipBias: 0.005,
        	textureWidth: window.innerWidth * window.devicePixelRatio,
        	textureHeight: window.innerHeight * window.devicePixelRatio,
        	color: 0x777777
        });
        groundMirror.position.y = 0.01;
        groundMirror.rotateX( - Math.PI / 2 );
        this.scene.add( groundMirror );

      }

    }




    updateAllMaterials(){
      this.scene.traverse((child) =>
      {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
          {
              // child.material.envMap = environmentMap
              child.material.envMapIntensity = 0.2
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
          }
      })
    }

    addCursor(){
      const cursor = new Cursor(document.querySelector('.cursor'));
      [...document.querySelectorAll('a')].forEach(el => {
          el.addEventListener('mouseenter', () => cursor.emit('enter'));
          el.addEventListener('mouseleave', () => cursor.emit('leave'));
      });
      [...document.querySelectorAll('button')].forEach(el => {
          el.addEventListener('mouseenter', () => cursor.emit('enter'));
          el.addEventListener('mouseleave', () => cursor.emit('leave'));
      });
    }

    composerPass(){
      this.composer = new EffectComposer(this.renderer);
      this.renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
    }

    setupResize(){
        window.addEventListener('resize',this.resize.bind(this));
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize( this.width,this.height );
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();
    }

    render(){
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.time+=0.05;
        // this.cameraControls.update(deltaTime);

        this.composer.render()
        window.requestAnimationFrame(this.render.bind(this));
    }
}
