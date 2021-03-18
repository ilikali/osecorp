import { gsap, Power2, Power0 } from 'gsap'
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
import Stats from 'three/examples/jsm/libs/stats.module.js';
const TWEEN = require('@tweenjs/tween.js')
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



export default class Sketch{
    constructor(options){

        this.gui = new dat.GUI({
          closed: true
        })
        this.debugObject = {}

        CameraControls.install({ THREE: THREE });

        this.audioListener = new THREE.AudioListener();
        const sound = new THREE.Audio(this.audioListener);

        let loaded_manager = 1

        if(options.showLoader){
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
          );
          document.querySelector('.enter').addEventListener('click', (e)=>{
            $(".enter_wrap").fadeOut(function(){
              $(".total_wrap").addClass("show");
              sound.play();
            })
          });
        }else {
          this.loadingManager = new THREE.LoadingManager()
          document.querySelector('.preloader_things').style.display = 'none';
          document.querySelector('.total_wrap').classList.add("show");
          this.gui.closed = false
        }
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
        this.camera.position.set(0, 25, 0)
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

        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        this.camera.add( this.audioListener );
        this.audioLoader.load( '/sounds/background.ogg', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.2 );
          sound.play();
        });

        let that = this

        document.querySelector('.audio_swither').addEventListener('click', (e)=>{
          gsap.to( that.audioListener.gain.gain, {value:0, duration: 2});

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


        /* -------------------- bloomPass params  --------------------  */
        this.ENTIRE_SCENE = 0;
        this.BLOOM_SCENE = 1;
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set( this.BLOOM_SCENE );
        this.materials = {};


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
      let that = this

      while(this.scene.children.length > 0){
        this.scene.remove(this.scene.children[0]);
      }

      if (document.body.classList.contains('action_home')) {


        let men, light_1, light_2, woman, globe, floor, totalScene;
        let camera = this.camera;

        let titles = document.querySelectorAll('.scroll_desc h3');
        titles.forEach(title => {
          let splitted = title.textContent.split("");
          title.textContent = "";
          splitted.forEach((element) => {
              title.innerHTML += "<span>" + element + "</span>";
          });
        })


        this.animationParams = {
          globalDuration: 4,
          globalEase: "power4.inOut",
        }

        this.globalPositions = {
          firstScroll:{
            camera:{
              position:{
                x: 2.2,
                y: 0.9,
                z: 2.6,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: THREE.Math.degToRad(0),
                y: THREE.Math.degToRad(60),
                z: THREE.Math.degToRad(0),
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            men:{
              position:{
                x: -0.19,
                y: 0.23,
                z: -0.23,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.57,
                y: 0,
                z: 0.42,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            woman:{
              position:{
                x: -0.54,
                y: 0.68,
                z: 0.61,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.06,
                y: -0.12,
                z: -2.56,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 0,
                y: 0,
                z: 0,
                duration: 2,
                ease: this.animationParams.globalEase
              }
            },
            globe:{
              position:{
                x: -0.61,
                y: 3.244,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
            },
            refractGlobe: {
              position:{
                x: -0.61,
                y: 3.244,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
            }
          },
          secondScroll:{
            camera:{
              position:{
                x: 0,
                y: 1.8,
                z: 0,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: THREE.Math.degToRad(0),
                y: THREE.Math.degToRad(53),
                z: THREE.Math.degToRad(0),
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            men:{
              position:{
                x: -0.18,
                y: 0.23,
                z: -0.31,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.6,
                y: 0,
                z: 0.7,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            woman:{
              position:{
                x: -0.54,
                y: 0.73,
                z: 0.61,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.06,
                y: -0.12,
                z: -2.56,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 0.8,
                y: 0.8,
                z: 0.8,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            globe:{
              position:{
                x: -0.61,
                y: 3.244,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 0.2,
                y: 0.2,
                z: 0.2,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            refractGlobe: {
              position:{
                x: -0.61,
                y: 3.244,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 1,
                y: 1,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            }
          },
          thirdScroll:{
            camera:{
              position:{
                x: -0.125,
                y: 1.9,
                z: 1.2,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: THREE.Math.degToRad(0),
                y: THREE.Math.degToRad(74),
                z: THREE.Math.degToRad(0),
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            men:{
              position:{
                x: -0.18,
                y: 0.23,
                z: -0.31,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.6,
                y: 0,
                z: 0.7,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            woman:{
              position:{
                x: -0.69,
                y: 0.68,
                z: 0.57,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              rotation:{
                x: 1.6,
                y: -0.03,
              	z: -0.6,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 0.8,
                y: 0.8,
                z: 0.8,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            globe:{
              position:{
                x: -0.61,
                y: 1.96,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 0.2,
                y: 0.2,
                z: 0.2,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            },
            refractGlobe: {
              position:{
                x: -0.61,
                y: 1.96,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              },
              scale:{
                x: 1,
                y: 1,
                z: 1,
                duration: this.animationParams.globalDuration,
                ease: this.animationParams.globalEase
              }
            }
          }
        }

        this.gltfLoader.load(
            '/models/composition_2.gltf',
            (gltf) =>
            {
                totalScene = gltf.scene

                const cursor = {
                    x: 0,
                    y: 0
                }

                window.addEventListener('mousemove', (event) =>{
                    cursor.x = event.clientX / that.width - 0.5
                    cursor.y = event.clientY / that.height - 0.5

                    totalScene.position.x = cursor.x/80
                    totalScene.position.y = cursor.y/80
                })

                gltf.scene.scale.set(1, 1, 1);


                men = gltf.scene.children[3];
                woman = gltf.scene.children[6];
                woman.scale.set(0, 0, 0)

                globe = gltf.scene.children[7];
                globe.position.set(-0.61, 3.244, 1)
                gsap.to(globe.rotation, 10, {z:6.28319, ease: "linear", repeat:-1});

                light_1 = gltf.scene.children[4]
                light_2 = gltf.scene.children[5]
                light_2.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
                light_2.layers.enable( this.BLOOM_SCENE );

                light_1.position.y = 10
                light_1.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
                light_1.layers.enable( this.BLOOM_SCENE );

                floor = gltf.scene.children[1]
                floor.position.y = 8
                this.scene.add(gltf.scene)


                this.updateAllMaterials()
                let gltfObject = {
                  menScale: 1
                }

                setTimeout(function(){
                  gsap.to( floor.position, {y:0, duration: 4, ease: "power4.inOut" });
                  gsap.to( light_1.position, {y:-4, duration: 4, ease: "power4.inOut" });
                  $(".firstScroll").trigger("click")
                },1000)

                this.menFolder = this.gui.addFolder('Men');
                this.menFolder.add(men.position, 'x').min(-5).max(5).step(0.0001).name('posionX')
                this.menFolder.add(men.position, 'y').min(-5).max(5).step(0.0001).name('posionY')
                this.menFolder.add(men.position, 'z').min(-5).max(5).step(0.0001).name('posionZ')
                this.menFolder.add(men.rotation, 'x').min(-2).max(2).step(0.0001).name('rotationX')
                this.menFolder.add(men.rotation, 'y').min(-2).max(2).step(0.0001).name('rotationY')
                this.menFolder.add(men.rotation, 'z').min(-2).max(2).step(0.0001).name('rotationZ')
                this.menFolder.add(gltfObject, 'menScale').min(-1).max(1).step(0.0001).name('sale').onChange(function(){
                  men.scale.set(gltfObject.menScale, gltfObject.menScale, gltfObject.menScale)
                })
                this.womanFolder = this.gui.addFolder('Woman');
                this.womanFolder.add(woman.position, 'x').min(-20).max(20).step(0.0001).name('menPosionX')
                this.womanFolder.add(woman.position, 'y').min(-20).max(20).step(0.0001).name('menPosionY')
                this.womanFolder.add(woman.position, 'z').min(-20).max(20).step(0.0001).name('menPosionZ')
                this.womanFolder.add(woman.rotation, 'x').min(-6).max(6).step(0.0001).name('menRotationX')
                this.womanFolder.add(woman.rotation, 'y').min(-6).max(6).step(0.0001).name('menRotationY')
                this.womanFolder.add(woman.rotation, 'z').min(-6).max(6).step(0.0001).name('menRotationZ')

                this.globeFolder = this.gui.addFolder('Globe');
                this.globeFolder.add(globe.position, 'x').min(-20).max(20).step(0.0001).name('globePosionX')
                this.globeFolder.add(globe.position, 'y').min(-20).max(20).step(0.0001).name('globePosionY')
                this.globeFolder.add(globe.position, 'z').min(-20).max(20).step(0.0001).name('globePosionZ')
                this.globeFolder.add(globe.rotation, 'x').min(-6).max(6).step(0.0001).name('globeRotationX')
                this.globeFolder.add(globe.rotation, 'y').min(-6).max(6).step(0.0001).name('globeRotationY')
                this.globeFolder.add(globe.rotation, 'z').min(-6).max(6).step(0.0001).name('globeRotationZ')
            }
        )

        this.globeSphereGeometry = new THREE.SphereGeometry( 0.101, 64, 32 );
        this.globeSphereMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
      		color: 0xffffff,
      		envMap: this.environmentMap,
      		refractionRatio: 1,
      		reflectivity: 1,
          opacity: 0.2
    		});
	      this.refractGlobe = new THREE.Mesh( this.globeSphereGeometry, this.globeSphereMaterial );
        this.refractGlobe.position.set(-0.61, 3.244, 1)
        this.refractGlobe.scale.set(0, 0, 0)
        this.scene.add(this.refractGlobe);


        let showScrollDescritpion = function(){
          $(".scroll_desc span").removeAttr("style");
          $(".home_scroll_item.active").addClass("animate")
          let active = $('.home_scroll_item.animate');
          let titleLetters = active.find('h3 span');
          let lettersArray = titleLetters.toArray();
          lettersArray.sort(function() {return 0.5-Math.random()});
          gsap.to( lettersArray, {
            duration: 1,
            top: 0,
            opacity: 1,
            stagger: 0.02
          }).play();
        }

        let detectActiveScroll = function(e){
          let scrollName = e.srcElement.getAttribute('data-scroll')
          $(".scroll_bttns").removeClass("active");
          $(this).addClass("active");
          $(".home_scroll_item").removeClass("active");
          setTimeout(function(){
            $(".home_scroll_item[data-scroll='"+scrollName+"']").addClass("active");
            showScrollDescritpion();
          },4000)
        }

        document.querySelector('.firstScroll').addEventListener('click', (e)=>{
          // camera
          gsap.to( camera.position, that.globalPositions.firstScroll.camera.position);
          gsap.to( camera.rotation, that.globalPositions.firstScroll.camera.rotation);
          // men
          gsap.to( men.position, that.globalPositions.firstScroll.men.position);
          gsap.to( men.rotation, that.globalPositions.firstScroll.men.rotation);
          // woman
          gsap.to( woman.position, that.globalPositions.firstScroll.woman.position);
          gsap.to( woman.rotation, that.globalPositions.firstScroll.woman.rotation);
          gsap.to( woman.scale, that.globalPositions.firstScroll.woman.scale);
          // globe
          gsap.to( globe.position, that.globalPositions.firstScroll.globe.position);
          // refractGlobe
          gsap.to( this.refractGlobe.position, that.globalPositions.firstScroll.refractGlobe.position);

          detectActiveScroll(e)
        });

        document.querySelector('.secondScroll').addEventListener('click', (e)=>{
          // camera
          gsap.to( camera.position, that.globalPositions.secondScroll.camera.position);
          gsap.to( camera.rotation, that.globalPositions.secondScroll.camera.rotation);
          // men
          gsap.to( men.position, that.globalPositions.secondScroll.men.position);
          gsap.to( men.rotation, that.globalPositions.secondScroll.men.rotation);
          // globe
          gsap.to( globe.position, that.globalPositions.secondScroll.globe.position);
          gsap.to( globe.scale, that.globalPositions.secondScroll.globe.scale);
          // refractGlobe
          gsap.to( this.refractGlobe.position, that.globalPositions.secondScroll.refractGlobe.position);
          gsap.to( this.refractGlobe.scale, that.globalPositions.secondScroll.refractGlobe.scale);
          // woman
          setTimeout(function(){
            gsap.to( woman.position, that.globalPositions.secondScroll.woman.position);
            gsap.to( woman.rotation, that.globalPositions.secondScroll.woman.rotation);
            gsap.to( woman.scale, that.globalPositions.secondScroll.woman.scale);
          },1000)

          detectActiveScroll(e)
        });

        document.querySelector('.thirdScroll').addEventListener('click', (e)=>{
          // camera
          gsap.to( camera.position, that.globalPositions.thirdScroll.camera.position);
          gsap.to( camera.rotation, that.globalPositions.thirdScroll.camera.rotation);
          // men
          gsap.to( men.position, that.globalPositions.thirdScroll.men.position);
          gsap.to( men.rotation, that.globalPositions.thirdScroll.men.rotation);
          // woman
          gsap.to( woman.position, that.globalPositions.thirdScroll.woman.position);
          gsap.to( woman.rotation, that.globalPositions.thirdScroll.woman.rotation);
          gsap.to( woman.scale, that.globalPositions.thirdScroll.woman.scale);
          // globe
          gsap.to( globe.position, that.globalPositions.thirdScroll.globe.position);
          gsap.to( globe.scale, that.globalPositions.thirdScroll.globe.scale);
          // refractGlobe
          gsap.to( this.refractGlobe.position, that.globalPositions.thirdScroll.refractGlobe.position);
          gsap.to( this.refractGlobe.scale, that.globalPositions.thirdScroll.refractGlobe.scale);

          detectActiveScroll(e)
        });

        this.camera.rotation.x = THREE.Math.degToRad(-90)

        this.debugObject.positionX = 0
        this.debugObject.positionY = 1.76
        this.debugObject.positionZ = 0
        this.debugObject.targetX = 0
        this.debugObject.targetY = 53
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







        this.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        this.directionalLight.castShadow = true
        this.directionalLight.intensity = 1
        this.directionalLight.shadow.camera.far = 15
        this.directionalLight.shadow.mapSize.set(1024, 1024)
        this.directionalLight.shadow.normalBias = 0.05
        this.directionalLight.position.set(0.25, 3, - 2.25)
        this.scene.add(this.directionalLight)

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


      }

    }




    updateAllMaterials(){
      this.scene.traverse((child) => {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.envMapIntensity = 1
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
      let params = {
      	exposure: 1,
      	bloomStrength: 1,
      	bloomThreshold: 0,
      	bloomRadius: 0.5,
      	scene: "Scene with Glow"
      };

      this.renderScene = new RenderPass( this.scene, this.camera );

      this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      this.bloomPass.threshold = params.bloomThreshold;
      this.bloomPass.strength = params.bloomStrength;
      this.bloomPass.radius = params.bloomRadius;

      this.bloomComposer = new EffectComposer( this.renderer );
      this.bloomComposer.renderToScreen = false;
      this.bloomComposer.addPass( this.renderScene );
      this.bloomComposer.addPass( this.bloomPass );

      this.finalPass = new ShaderPass(
      	new THREE.ShaderMaterial( {
      		uniforms: {
      			baseTexture: { value: null },
      			bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
      		},
      		vertexShader: `
          varying vec2 vUv;

      			void main() {

      				vUv = uv;

      				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      			}
          `,
      		fragmentShader: `
          uniform sampler2D baseTexture;
      			uniform sampler2D bloomTexture;

      			varying vec2 vUv;

      			void main() {

      				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

      			}`,
      		defines: {}
      	} ), "baseTexture"
      );
      this.finalPass.needsSwap = true;

      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( this.renderScene );
      this.composer.addPass( this.finalPass );
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

    darkenNonBloomed() {
      this.scene.traverse((child) => {
        if ( child.isMesh && this.bloomLayer.test( child.layers ) === false ) {
          this.materials[ child.uuid ] = child.material;
          child.material = new THREE.MeshBasicMaterial( { color: "black" } );
        }
      })
    }

    restoreMaterial() {
      this.scene.traverse((child) => {
      	if ( this.materials[ child.uuid ] ) {
      		child.material = this.materials[ child.uuid ];
      		delete this.materials[ child.uuid ];
      	}
      })
    }


    render(){

        this.stats.begin()

        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime
        this.time+=0.05;
        this.darkenNonBloomed()
    		this.bloomComposer.render();
    		this.restoreMaterial()
        this.composer.render()

        window.requestAnimationFrame(this.render.bind(this));

        this.stats.end()

    }
}
