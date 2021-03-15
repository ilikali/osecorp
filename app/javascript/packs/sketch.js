import { gsap, TweenLite, TweenMax, TimelineMax } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import CameraControls from 'camera-controls';
import Cursor from './cursor';


export default class Sketch{
    constructor(options){
        CameraControls.install({ THREE: THREE });
        this.loadingManager = new THREE.LoadingManager(
            () =>
            {
              $(".preloader").fadeOut(800, function(){
                $(".enter_wrap").fadeIn(800);
              });
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
        this.container = options.dom;
        this.scene = new THREE.Scene();
        this.scene.environment = this.environmentMap

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 100)
        this.camera.position.set(0, 10, 0)
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
          sound.setVolume( 0.5 );
          // sound.play();
        });


        document.querySelector('.enter').addEventListener('click', (e)=>{
          $(".enter_wrap").fadeOut(function(){
            console.log(1)
            $(".total_wrap").addClass("show");
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

        this.addCursor()
        this.initScene()
        this.resize()
        this.setupResize();
        this.composerPass()
        this.render();
    }


    loadState(url){
      let that = this
      $('.fader').fadeIn(100, function(){
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
      $('.fader').fadeOut(500);
      this.gltfLoader.load(
          '/models/composition.gltf',
          (gltf) =>
          {
              gltf.scene.scale.set(1, 1, 1)
              this.scene.add(gltf.scene)
              // updateAllMaterials()
              // this.cameraControls.setLookAt( 1, 1.5, 2, -5, 0, -2, true )
          }
      )

      // directionalLight.castShadow = true
      // directionalLight.intensity = 0.3
      // directionalLight.shadow.camera.far = 15
      // directionalLight.shadow.mapSize.set(1024, 1024)
      // directionalLight.shadow.normalBias = 0.05
      // directionalLight.position.set(0.25, 3, - 2.25)
      // scene.add(directionalLight)
      //

      //
      // const geometry = new THREE.CircleGeometry( 7, 60 );
      // const groundMirror = new Reflector( geometry, {
      //   transparent:true,
      //   clipBias: 0.005,
      //   textureWidth: window.innerWidth * window.devicePixelRatio,
      //   textureHeight: window.innerHeight * window.devicePixelRatio,
      //   color: 0x777777,
      // });
      // groundMirror.position.y = 0.01;
      // groundMirror.rotateX( - Math.PI / 2 );
      // scene.add( groundMirror );
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
        this.time+=0.05;
        // this.cameraControls.update(deltaTime);

        this.composer.render()
        window.requestAnimationFrame(this.render.bind(this));
    }
}
