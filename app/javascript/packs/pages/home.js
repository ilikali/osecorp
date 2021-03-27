import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'
import Scrollbar from 'smooth-scrollbar';

export default class Home{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(0, 25, 0)
      parent.camera.lookAt(0, 0, 0)

      let men, light_1, light_2, woman, globe, floor, totalScene, works;
      let camera = parent.camera;

      parent.home_videos = []
      const workGroup = new THREE.Group();
      const workGeometry = new THREE.PlaneGeometry( 0.3, 0.2, 32 );
      workGroup.position.set(-0.0307, 0, 0.0994);

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
          },
          works:{
            position:{
              x: -2.4655,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          workGroup: {
            position:{
              x: -0.0307,
              y: 0,
              z: 0.0994,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          }
        },
        forthScroll:{
          camera:{
            position:{
              x: -2.09,
              y: 2.15,
              z: 2.63,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            },
            rotation:{
              x: THREE.Math.degToRad(0),
              y: THREE.Math.degToRad(69),
              z: THREE.Math.degToRad(0),
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          works:{
            position:{
              x: -2.40,
              duration: parent.animationParams.globalDuration,
              ease: parent.animationParams.globalEase
            }
          },
          workGroup: {
            position:{
              x: 0,
              y: 0,
              z: 0,
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

              // window.addEventListener('mousemove', (event) =>{
              //     cursor.x = event.clientX / that.width - 0.5
              //     cursor.y = event.clientY / that.height - 0.5
              //
              //     totalScene.position.x = cursor.x/80
              //     totalScene.position.y = cursor.y/80
              //     // $(".project_video").css("transform","translate3d("+cursor.x*100+"px,"+cursor.y*100+"px,0px)");
              // })

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

              works = gltf.scene.children.find(x => x.name === "works");
              works.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
              works.position.x = -2.4655;
              works.layers.enable( parent.BLOOM_SCENE );

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
        // works
        gsap.to( works.position, that.globalPositions.thirdScroll.works.position);
        gsap.to( workGroup.position, that.globalPositions.thirdScroll.workGroup.position);


        detectActiveScroll(t)
      });

      let projects = document.querySelector('.projects')
      let scrollbar;

      $(document).on('click', '.forthScroll', function (e) {
        var t = $(this);
        // camera
        gsap.to( camera.position, that.globalPositions.forthScroll.camera.position);
        gsap.to( camera.rotation, that.globalPositions.forthScroll.camera.rotation);
        // works
        gsap.to( works.position, that.globalPositions.forthScroll.works.position);
        gsap.to( workGroup.position, that.globalPositions.forthScroll.workGroup.position);

        setTimeout(function () {
            scrollbar = Scrollbar.init(projects);
            scrollbar.track.xAxis.element.remove();
            scrollbar.addListener((s) => {
                if(s.offset.y == 0) {
                  scrollbar.destroy()
                  go_to_slide("prev")
                }else {
                  that.camera.position.y = 2.15 - s.offset.y/10000;
                }
            })
            $(".steps_scroll").unbind("mousewheel", myHandler);
        }, 4000);

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






      $(".home_project_item.with_content").each(function(i){
        let t = $(this);
        let video = t.find(".video_holder")[0];
            video.load();
            video.play();
        let videoTexture = new THREE.Texture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.center = new THREE.Vector2(0.5, 0.5);
            videoTexture.rotation = Math.PI;
            videoTexture.flipY = false;
        let workMaterial = new THREE.MeshBasicMaterial( {color:0xFFFFFF, map:videoTexture, side:THREE.DoubleSide } );
        let workItem = new THREE.Mesh( workGeometry, workMaterial);
            workItem.position.x = -2.36256;
            workItem.position.y = 1.99859 - (i*2.2/10);
            workItem.position.z = 2.63945;
            workItem.rotation.y = -1.45;
            workItem.x = -1;
        let videoItem = [video, videoTexture]
            parent.home_videos.push(videoItem)
            workGroup.add( workItem);
      })

      parent.scene.add(workGroup);


      function myHandler(event, delta) {
          $(".steps_scroll").unbind('mousewheel', myHandler);
          if($(".home_scroll_item[data-scroll='forthScroll']").hasClass('active')){
          }else {
            if ($("body").hasClass("ready_to_scroll")) {
              if (event.originalEvent.wheelDelta > 0) {
                  go_to_slide("prev")
              } else {
                  go_to_slide("next")
              }
            }
          }

      }

      function go_to_slide(direction) {
          var data = jQuery._data($(".steps_scroll")[0], 'events')
          var a = $(".home_navigation .active");
          if (direction == "prev") {
            if(a.prev().length > 0){
              a.prev().trigger("click");
              setTimeout(function () {
                  if (data === undefined || data.length === 0) {
                    $(".steps_scroll").bind("mousewheel", myHandler);
                  }
              }, 4000);
            }else {
              if (data === undefined || data.length === 0) {
                $(".steps_scroll").bind("mousewheel", myHandler);
              }
            }
          } else {
            if(a.next().length > 0){
              a.next().trigger("click");
              setTimeout(function () {
                  if (data === undefined || data.length === 0) {
                    $(".steps_scroll").bind("mousewheel", myHandler);
                  }
              }, 4000);
            }else {
              if (data === undefined || data.length === 0) {
                $(".steps_scroll").bind("mousewheel", myHandler);
              }
            }
          }
      }


      $(".steps_scroll").bind("mousewheel", myHandler);

      const fog = new THREE.Fog('#000000',  0.1, 0)
      parent.scene.fog = fog






    }
}
