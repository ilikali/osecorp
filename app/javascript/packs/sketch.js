import { gsap, Power2, Power0 } from 'gsap'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Cursor from './cursor';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
const TWEEN = require('@tweenjs/tween.js')


import Home from './pages/home';
import Works from './pages/works';
import Partners from './pages/partners';





export default class Sketch{
    constructor(options){

        let that = this
        this.gui = new dat.GUI({
          closed: true
        })
        this.debugObject = {}
        this.animation_start = !options.showLoader

        this.audioListener = new THREE.AudioListener();
        this.sound = new THREE.Audio(this.audioListener);

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
              that.sound.play();
              that.animation_start = true;
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

        this.textureLoader = new THREE.TextureLoader();

        this.time = 0;
        this.clock = new THREE.Clock()
        this.previousTime = 0

        this.container = options.dom;
        this.scene = new THREE.Scene();
        this.scene.environment = this.environmentMap

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100)

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



        this.container.appendChild( this.renderer.domElement );



        this.stats = new Stats()
        this.stats.showPanel(0)
        // document.body.appendChild(this.stats.dom)

        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


        /* -------------------- audio player --------------------  */

        this.camera.add( this.audioListener );
        this.audioLoader.load( '/sounds/background.ogg', function( buffer ) {
          that.sound.setBuffer( buffer );
          that.sound.setLoop( true );
          that.sound.setVolume( 0.2 );
        });

        $(document).on('click', '.audio_swither', function (e) {
          var t = $(this);
            if(t.hasClass("mute")){
              gsap.to( that.audioListener.gain.gain, {value:1, duration: 2});
              t.removeClass("mute")
            }else {
              gsap.to( that.audioListener.gain.gain, {value:0, duration: 2});
              t.addClass("mute")
            }
        })

        /* -------------------- link clickes --------------------  */

        this.popped = ('state' in window.history && window.history.state !== null), this.initialURL = location.href;
        window.addEventListener('popstate', (e)=>{
          let initialPop = !this.popped && location.href == this.nitialURL;
          this.popped = true;
          if (initialPop) return;
          this.loadState(location.pathname)
        });

        $(document).on('click', 'a', function (e) {
            var t = $(this);
            e.preventDefault();
            if(!t.hasClass("disabled")){
              $("a").addClass("disabled");
              $(".main_nav_link").removeClass("active");
              t.addClass("active")
              const url = t.attr('href')
              that.loadState(url)
              history.pushState({page:url}, null, url);
            }
        });


        /* -------------------- menu opener --------------------  */

        $(document).on('click', '.menu_opener', function (e) {
          var t = $(this);
            if(t.hasClass("active")){
              $(".mobile_menu").fadeOut();
              t.removeClass("active")
            }else {
              $(".mobile_menu").fadeIn();
              t.addClass("active")
            }
        })
        $(document).on('click', '.mobile_menu a', function (e) {
          $(".mobile_menu").fadeOut();
          $(".menu_opener").removeClass("active")
        })


        /* -------------------- bloomPass params  --------------------  */
        this.ENTIRE_SCENE = 0;
        this.BLOOM_SCENE = 1;
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set( this.BLOOM_SCENE );
        this.materials = {};



        this.color_material =  new THREE.ShaderMaterial({
          fragmentShader: `
            uniform vec3 iResolution;
            uniform float iTime;
            uniform sampler2D sky;
            varying vec2 vUv;
            varying vec3 vNormal;

            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

            float cnoise(vec4 P, vec4 rep){
              vec4 Pi0 = mod(floor(P), rep); // Integer part modulo rep
              vec4 Pi1 = mod(Pi0 + 1.0, rep); // Integer part + 1 mod rep
              vec4 Pf0 = fract(P); // Fractional part for interpolation
              vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = vec4(Pi0.zzzz);
              vec4 iz1 = vec4(Pi1.zzzz);
              vec4 iw0 = vec4(Pi0.wwww);
              vec4 iw1 = vec4(Pi1.wwww);

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);
              vec4 ixy00 = permute(ixy0 + iw0);
              vec4 ixy01 = permute(ixy0 + iw1);
              vec4 ixy10 = permute(ixy1 + iw0);
              vec4 ixy11 = permute(ixy1 + iw1);

              vec4 gx00 = ixy00 / 7.0;
              vec4 gy00 = floor(gx00) / 7.0;
              vec4 gz00 = floor(gy00) / 6.0;
              gx00 = fract(gx00) - 0.5;
              gy00 = fract(gy00) - 0.5;
              gz00 = fract(gz00) - 0.5;
              vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
              vec4 sw00 = step(gw00, vec4(0.0));
              gx00 -= sw00 * (step(0.0, gx00) - 0.5);
              gy00 -= sw00 * (step(0.0, gy00) - 0.5);

              vec4 gx01 = ixy01 / 7.0;
              vec4 gy01 = floor(gx01) / 7.0;
              vec4 gz01 = floor(gy01) / 6.0;
              gx01 = fract(gx01) - 0.5;
              gy01 = fract(gy01) - 0.5;
              gz01 = fract(gz01) - 0.5;
              vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
              vec4 sw01 = step(gw01, vec4(0.0));
              gx01 -= sw01 * (step(0.0, gx01) - 0.5);
              gy01 -= sw01 * (step(0.0, gy01) - 0.5);

              vec4 gx10 = ixy10 / 7.0;
              vec4 gy10 = floor(gx10) / 7.0;
              vec4 gz10 = floor(gy10) / 6.0;
              gx10 = fract(gx10) - 0.5;
              gy10 = fract(gy10) - 0.5;
              gz10 = fract(gz10) - 0.5;
              vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
              vec4 sw10 = step(gw10, vec4(0.0));
              gx10 -= sw10 * (step(0.0, gx10) - 0.5);
              gy10 -= sw10 * (step(0.0, gy10) - 0.5);

              vec4 gx11 = ixy11 / 7.0;
              vec4 gy11 = floor(gx11) / 7.0;
              vec4 gz11 = floor(gy11) / 6.0;
              gx11 = fract(gx11) - 0.5;
              gy11 = fract(gy11) - 0.5;
              gz11 = fract(gz11) - 0.5;
              vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
              vec4 sw11 = step(gw11, vec4(0.0));
              gx11 -= sw11 * (step(0.0, gx11) - 0.5);
              gy11 -= sw11 * (step(0.0, gy11) - 0.5);

              vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
              vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
              vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
              vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
              vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
              vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
              vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
              vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
              vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
              vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
              vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
              vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
              vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
              vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
              vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
              vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

              vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
              g0000 *= norm00.x;
              g0100 *= norm00.y;
              g1000 *= norm00.z;
              g1100 *= norm00.w;

              vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
              g0001 *= norm01.x;
              g0101 *= norm01.y;
              g1001 *= norm01.z;
              g1101 *= norm01.w;

              vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
              g0010 *= norm10.x;
              g0110 *= norm10.y;
              g1010 *= norm10.z;
              g1110 *= norm10.w;

              vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
              g0011 *= norm11.x;
              g0111 *= norm11.y;
              g1011 *= norm11.z;
              g1111 *= norm11.w;

              float n0000 = dot(g0000, Pf0);
              float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
              float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
              float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
              float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
              float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
              float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
              float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
              float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
              float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
              float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
              float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
              float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
              float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
              float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
              float n1111 = dot(g1111, Pf1);

              vec4 fade_xyzw = fade(Pf0);
              vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
              vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
              vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
              vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
              float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
              return 2.2 * n_xyzw;
            }

            void main(){
              vec4 txt = texture2D(sky,vUv + 0.2 * cnoise(vec4(vUv*5., iTime/2., 0.), vec4(10.)));
              gl_FragColor = txt;
            }

          `,
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
              vUv = uv;
              vNormal = normal;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
          `,
          uniforms: {
            sky: {type: "t", value: this.textureLoader.load('/textures/sky.png')},
            iTime: { value: 0 },
            iResolution:  { value: new THREE.Vector3(1,1,1) },
          }
        });

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
      setTimeout(function(){
        $("a").removeClass("disabled");
      },4000)
      let that = this;
      $(".steps_scroll").unbind('mousewheel');

      while(this.scene.children.length > 0){
        this.scene.remove(this.scene.children[0]);
      }

      if (document.body.classList.contains('action_home')) {
        new Home({this: this});
      }
      else if (document.body.classList.contains('action_works')) {
        new Works({this: this});
      }else if (document.body.classList.contains('action_partners')) {
        new Partners({this: this});
      }else if (document.body.classList.contains('action_about')) {
        this.camera.position.set(0, 0, 2)
        this.camera.lookAt(0, 0, 0)
        const fragmentShader = `uniform vec3 iResolution;
              uniform float iTime;
              uniform float iAngle;
              uniform sampler2D iChannel0;
              uniform sampler2D iChannel1;

              #if __VERSION__ < 130
              #define TEXTURE2D texture2D
              #else
              #define TEXTURE2D texture
              #endif


              float snoise(vec3 uv, float res)	// by trisomie21
              {
              	const vec3 s = vec3(1e0, 1e2, 1e4);

              	uv *= res;

              	vec3 uv0 = floor(mod(uv, res))*s;
              	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;

              	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

              	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
              		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

              	vec4 r = fract(sin(v*1e-3)*1e5);
              	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

              	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
              	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

              	return mix(r0, r1, f.z)*2.-1.;
              }

              float freqs[4];

              void mainImage( out vec4 fragColor, in vec2 fragCoord )
              {
              	freqs[0] = TEXTURE2D( iChannel1, vec2( 0.01, 0.25 ) ).x;
              	freqs[1] = TEXTURE2D( iChannel1, vec2( 0.07, 0.25 ) ).x;
              	freqs[2] = TEXTURE2D( iChannel1, vec2( 0.15, 0.25 ) ).x;
              	freqs[3] = TEXTURE2D( iChannel1, vec2( 0.30, 0.25 ) ).x;

              	float brightness	= freqs[1] * 0.25 + freqs[2] * 0.25;
              	float radius		= 0.24 + brightness * 0.2;
              	float invRadius 	= 1.0/radius;

              	vec3 orange			= vec3( 0.8, 0.65, 0.3 );
              	vec3 orangeRed		= vec3( 0.8, 0.35, 0.1 );
              	float time		= iTime / 100.0;
              	float aspect	= 1.5 ;
              	vec2 uv			= fragCoord.xy / iResolution.xy;
              	vec2 p 			= -0.5 + uv;
              	p.x *= aspect;

              	float fade		= pow( length( 2.0 * p ), 0.5 );
              	float fVal1		= 1.0 - fade;
              	float fVal2		= 1.0 - fade;

              	float angle		= atan( p.x, p.y )/iAngle;
              	float dist		= length(p);
              	vec3 coord		= vec3( angle, dist, time * 0.1 );

              	float newTime1	= abs( snoise( coord + vec3( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );
              	float newTime2	= abs( snoise( coord + vec3( 0.0, -time * ( 0.15 + brightness * 0.001 ), time * 0.015 ), 45.0 ) );
              	for( int i=1; i<=7; i++ ){
              		float power = pow( 2.0, float(i + 1) );
              		fVal1 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );
              		fVal2 += ( 0.5 / power ) * snoise( coord + vec3( 0.0, -time, time * 0.2 ), ( power * ( 25.0 ) * ( newTime2 + 1.0 ) ) );
              	}

              	float corona		= pow( fVal1 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
              	corona				+= pow( fVal2 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
              	corona				*= 1.2 - newTime1;
              	vec3 sphereNormal 	= vec3( 0.0, 0.0, 1.0 );
              	vec3 dir 			= vec3( 0.0 );
              	vec3 center			= vec3( 0.5, 0.5, 1.0 );
              	vec3 starSphere		= vec3( 0.0 );

              	vec2 sp = -1.0 + 2.0 * uv;
              	sp.x *= aspect;
              	sp *= ( 2.0 - brightness );
                float r = dot(sp,sp);
              	float f = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
              	if( dist < radius ){
              		corona			*= pow( dist * invRadius, 24.0 );
                	vec2 newUv;
               		newUv.x = sp.x*f;
                	newUv.y = sp.y*f;
              		newUv += vec2( time, 0.0 );

              		vec3 texSample 	= TEXTURE2D( iChannel0, newUv ).rgb;
              		float uOff		= ( texSample.g * brightness * 4.5 + time / 0.8 );
              		vec2 starUV		= newUv + vec2( uOff, 0.0 );
              		starSphere		= TEXTURE2D( iChannel0, starUV ).rgb;
              	}

              	float starGlow	= min( max( 1.0 - dist * ( 1.0 - brightness ), 0.0 ), 1.0 );
              	//fragColor.rgb	= vec3( r );
              	fragColor.rgb	= vec3( f * ( 0.75 + brightness * 0.3 ) * orange ) + starSphere + corona * orange + starGlow * orangeRed;
              	fragColor.a		= 1.0;
              }

              varying vec2 vUv;

              void main() {
                mainImage(gl_FragColor, vUv * iResolution.xy);
              }
      `

        const geometry = new THREE.PlaneGeometry(4, 2.66, 32, 32)

        const resolution = new THREE.Vector2(this.container.offsetWidth, this.container.offsetHeight);


        const texture = this.textureLoader.load('/textures/texture.jpeg');
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;


        const fftSize = 128;
        this.analyser = new THREE.AudioAnalyser( this.sound, fftSize );
        const format = THREE.RedFormat;
        this.uniforms = {
        iTime: { value: 0 },
        iResolution:  { value: new THREE.Vector3(1,1,1) },
        iChannel0: { value: texture },
        iChannel1: { value: new THREE.DataTexture( this.analyser.data, fftSize / 2, 1, format ) },
        iAngle: {value: 6.2832}
        };
        const material = new THREE.ShaderMaterial({
          fragmentShader: fragmentShader,
          vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
          `,
          uniforms: that.uniforms
        });
        const mesh = new THREE.Mesh(geometry, material)

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh)

        // const scroll = Scrollbar.init(document.querySelector('.partners_content'));
        // scroll.addListener((s) => {
        //     that.camera.position.y = -s.offset.y / 1000;
        // })


      }

      // Scrollbar.initAll();
    }




    updateAllMaterials(){
      this.scene.traverse((child) => {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.envMapIntensity = 0.7
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
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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

        this.color_material.uniforms.iTime.value = elapsedTime;

        if (document.body.classList.contains('action_home')) {
          if ( this.home_videos ) {
            this.home_videos.forEach(function(videoItem) {
                if ( videoItem[0].readyState === videoItem[0].HAVE_ENOUGH_DATA ) {
                    videoItem[1].needsUpdate = true;
                }
            });
          }
        }

        if (document.body.classList.contains('action_partners')) {
        }

        if (document.body.classList.contains('action_works')) {
          if ( this.work_videos ) {
            this.work_videos.forEach(function(videoItem) {
                if ( videoItem[0].readyState === videoItem[0].HAVE_ENOUGH_DATA ) {
                    videoItem[1].needsUpdate = true;
                }
            });
          }
        }

        if (document.body.classList.contains('action_about')) {
          this.analyser.getFrequencyData();
          this.uniforms.iChannel1.value.needsUpdate = true;
          const canvas = this.renderer.domElement;
          this.uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
          this.uniforms.iTime.value = elapsedTime;
        }

        this.stats.end()

    }
}
