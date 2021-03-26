import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Home{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(0, 25, 0)
      parent.camera.lookAt(0, 0, 0)

      let men, light_1, light_2, woman, globe, floor, totalScene;
      let camera = parent.camera;

      let titles = document.querySelectorAll('.scroll_desc h3');
      titles.forEach(title => {
        let splitted = title.textContent.split("");
        title.textContent = "";
        splitted.forEach((element) => {
            title.innerHTML += "<span>" + element + "</span>";
        });
      })


      parent.animationParams = {
        globalDuration: 4,
        globalEase: "power4.inOut",
      }

      parent.globalPositions = {
        firstScroll:{
          camera:{
            position:{
              x: 2.2,
              y: 0.9,
              z: 2.6,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: THREE.Math.degToRad(0),
              y: THREE.Math.degToRad(60),
              z: THREE.Math.degToRad(0),
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          men:{
            position:{
              x: -0.19,
              y: 0.23,
              z: -0.23,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.57,
              y: 0,
              z: 0.42,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          woman:{
            position:{
              x: -0.54,
              y: 0.68,
              z: 0.61,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.06,
              y: -0.12,
              z: -2.56,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 0,
              y: 0,
              z: 0,
              duration: 2,
              ease: parent.animationParams.globalEase
            }
          },
          globe:{
            position:{
              x: -0.61,
              y: 3.244,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
          },
          refractGlobe: {
            position:{
              x: -0.61,
              y: 3.244,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
          }
        },
        secondScroll:{
          camera:{
            position:{
              x: 0,
              y: 1.8,
              z: 0,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: THREE.Math.degToRad(0),
              y: THREE.Math.degToRad(53),
              z: THREE.Math.degToRad(0),
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          men:{
            position:{
              x: -0.18,
              y: 0.23,
              z: -0.31,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.6,
              y: 0,
              z: 0.7,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          woman:{
            position:{
              x: -0.54,
              y: 0.73,
              z: 0.61,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.06,
              y: -0.12,
              z: -2.56,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 0.8,
              y: 0.8,
              z: 0.8,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          globe:{
            position:{
              x: -0.61,
              y: 3.244,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 0.2,
              y: 0.2,
              z: 0.2,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          refractGlobe: {
            position:{
              x: -0.61,
              y: 3.244,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 1,
              y: 1,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          }
        },
        thirdScroll:{
          camera:{
            position:{
              x: -0.125,
              y: 1.9,
              z: 1.2,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: THREE.Math.degToRad(0),
              y: THREE.Math.degToRad(74),
              z: THREE.Math.degToRad(0),
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          men:{
            position:{
              x: -0.18,
              y: 0.23,
              z: -0.31,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.6,
              y: 0,
              z: 0.7,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          woman:{
            position:{
              x: -0.69,
              y: 0.68,
              z: 0.57,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: 1.6,
              y: -0.03,
              z: -0.6,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 0.8,
              y: 0.8,
              z: 0.8,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          globe:{
            position:{
              x: -0.61,
              y: 1.96,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 0.2,
              y: 0.2,
              z: 0.2,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          refractGlobe: {
            position:{
              x: -0.61,
              y: 1.96,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            scale:{
              x: 1,
              y: 1,
              z: 1,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          }
        }
      }

      parent.gltfLoader.load(
          '/models/composition_3.gltf',
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


              men = gltf.scene.children.find(x => x.name === "men");
              woman = gltf.scene.children.find(x => x.name === "woman");
              woman.scale.set(0, 0, 0)

              globe = gltf.scene.children.find(x => x.name === "globe");
              globe.position.set(-0.61, 3.244, 1)
              gsap.to(globe.rotation, 10, {z:6.28319, ease: "linear", repeat:-1});

              // light_1 = gltf.scene.children.find(x => x.name === "light_1");
              light_2 = gltf.scene.children.find(x => x.name === "light_2");
              light_2.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
              light_2.layers.enable( parent.BLOOM_SCENE );

              // light_1.position.y = 10
              // light_1.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
              // light_1.layers.enable( parent.BLOOM_SCENE );

              floor = gltf.scene.children.find(x => x.name === "floor");
              floor.position.y = 8
              parent.scene.add(gltf.scene)


              parent.updateAllMaterials()
              let gltfObject = {
                menScale: 1
              }
              let interval = setInterval(function(){
                if(parent.animation_start) {
                  setTimeout(function(){
                    gsap.to( floor.position, {y:0, duration: 4, ease: "power4.inOut" });
                    // gsap.to( light_1.position, {y:-4, duration: 4, ease: "power4.inOut" });
                    $(".firstScroll").trigger("click")
                  },1)
                  clearInterval(interval);
                  interval = 0;
                }
              }, 1);

          }
      )

      parent.globeSphereGeometry = new THREE.SphereGeometry( 0.101, 64, 32 );
      parent.globeSphereMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        envMap: parent.environmentMap,
        refractionRatio: 1,
        reflectivity: 1,
        opacity: 0.2
      });
      parent.refractGlobe = new THREE.Mesh( parent.globeSphereGeometry, parent.globeSphereMaterial );
      parent.refractGlobe.position.set(-0.61, 3.244, 1)
      parent.refractGlobe.scale.set(0, 0, 0)
      parent.scene.add(parent.refractGlobe);


      let showScrollDescritpion = function(){
        $(".scroll_desc span").removeAttr("style");
        $(".home_scroll_item").removeClass("animate");
        $(".home_scroll_item.active").addClass("animate");
        let active = $('.home_scroll_item.animate');
        let titleLetters = active.find('h3 span');
        let lettersArray = titleLetters.toArray();
        lettersArray.sort(function() {return 0.5-Math.random()});
        gsap.to( lettersArray, {
          duration: 0.5,
          top: 0,
          opacity: 1,
          stagger: 0.02
        }).play();
      }

      let detectActiveScroll = function(t){
        let scrollName = t.attr('data-scroll')
        $(".scroll_bttns").removeClass("active");
        t.addClass("active")
        $(".home_scroll_item").removeClass("active");
        setTimeout(function(){
          $(".home_scroll_item[data-scroll='"+scrollName+"']").addClass("active");
          showScrollDescritpion();
        },4000)
      }

      $(document).on('click', '.firstScroll', function (e) {
        var t = $(this);
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
        gsap.to( parent.refractGlobe.position, that.globalPositions.firstScroll.refractGlobe.position);

        detectActiveScroll(t)

        setTimeout(function(){
          $("body").addClass("ready_to_scroll")
        },4000)

      });

      $(document).on('click', '.secondScroll', function (e) {
        var t = $(this);
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
        gsap.to( parent.refractGlobe.position, that.globalPositions.secondScroll.refractGlobe.position);
        gsap.to( parent.refractGlobe.scale, that.globalPositions.secondScroll.refractGlobe.scale);
        // woman
        setTimeout(function(){
          gsap.to( woman.position, that.globalPositions.secondScroll.woman.position);
          gsap.to( woman.rotation, that.globalPositions.secondScroll.woman.rotation);
          gsap.to( woman.scale, that.globalPositions.secondScroll.woman.scale);
        },1000)

        detectActiveScroll(t)
      });

      $(document).on('click', '.thirdScroll', function (e) {
        var t = $(this);
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
        gsap.to( parent.refractGlobe.position, that.globalPositions.thirdScroll.refractGlobe.position);
        gsap.to( parent.refractGlobe.scale, that.globalPositions.thirdScroll.refractGlobe.scale);

        detectActiveScroll(t)
      });

      parent.camera.rotation.x = THREE.Math.degToRad(-90)

      parent.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
      parent.directionalLight.castShadow = true
      parent.directionalLight.intensity = 1
      parent.directionalLight.shadow.camera.far = 15
      parent.directionalLight.shadow.mapSize.set(1024, 1024)
      parent.directionalLight.shadow.normalBias = 0.05
      parent.directionalLight.position.set(0.25, 3, - 2.25)
      parent.scene.add(parent.directionalLight)

      function myHandler(event, delta) {
          if ($("body").hasClass("ready_to_scroll")) {
            if (event.originalEvent.wheelDelta > 0) {
                $("body.action_home").unbind('mousewheel', myHandler);
                go_to_slide("prev")
            } else {
                $("body.action_home").unbind('mousewheel', myHandler)
                go_to_slide("next")
            }
          }
      }

      function go_to_slide(direction) {
          var a = $(".home_navigation .active");
          if (direction == "prev") {
            if(a.prev().length > 0){
              a.prev().trigger("click");
              setTimeout(function () {
                  $("body.action_home").bind("mousewheel", myHandler);
              }, 4000);
            }else {
              $("body.action_home").bind("mousewheel", myHandler);
            }
          } else {
            if(a.next().length > 0){
              a.next().trigger("click");
              setTimeout(function () {
                  $("body.action_home").bind("mousewheel", myHandler);
              }, 4000);
            }else {
              $("body.action_home").bind("mousewheel", myHandler);
            }
          }
      }


      $("body.action_home").bind("mousewheel", myHandler);

      const fog = new THREE.Fog('#000000',  0.1, 0)
      parent.scene.fog = fog

    }
}
