import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Works{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(-14.7, 1.4, 0)

      parent.work_videos = []
      const workGroup = new THREE.Group();
      const workGeometry = new THREE.PlaneGeometry( 4, 2.2, 32 );
      workGroup.position.set(-0.0307, 0, 0.0994);

      const fog = new THREE.Fog('#000000', 1, 2)
      parent.scene.fog = fog

      that.camera.rotation.y = THREE.Math.degToRad(90);
      parent.gltfLoader.load(
          '/models/works_3.gltf',
          (gltf) =>
          {
              let totalScene = gltf.scene
              const cursor = {
                  x: 0,
                  y: 0
              }

              $('.fader').fadeOut(1000);
              gltf.scene.scale.set(1, 1, 1);

              let floor_light = gltf.scene.children.find(x => x.name === "floor_light");
              floor_light.material = new THREE.MeshBasicMaterial( { color: 0x006FFF } );
              floor_light.layers.enable( parent.BLOOM_SCENE );

              $(".work_slide").each(function(i){
                let t = $(this);
                let video = t.find(".video_holder")[0];
                    video.load();
                    video.play();
                let videoTexture = new THREE.Texture(video);
                    videoTexture.minFilter = THREE.LinearFilter;
                    videoTexture.magFilter = THREE.LinearFilter;
                    videoTexture.center = new THREE.Vector2(0.5, 0.5);
                    // videoTexture.rotation = Math.PI;
                    // videoTexture.flipY = false;
                let workMaterial = new THREE.MeshBasicMaterial( {color:0xFFFFFF, map:videoTexture, side:THREE.DoubleSide } );
                let workItem = new THREE.Mesh( workGeometry, workMaterial);
                    workItem.position.x = 10.35;
                    workItem.position.y = 1.9
                    workItem.position.z = 0 + (-i*5);
                    workItem.rotation.y = THREE.Math.degToRad(90);
                let videoItem = [video, videoTexture]
                    parent.work_videos.push(videoItem)
                    workGroup.add( workItem);
              })

              gltf.scene.add(workGroup)

              $(document).on('mousemove', '.works_page_holder', function (event) {
                cursor.x = event.clientX / parent.width - 0.5
                cursor.y = event.clientY / parent.height - 0.5
                // totalScene.rotation.x = cursor.x/100
                workGroup.position.z = cursor.x/4
                gltf.scene.position.z = cursor.x/6
              });

              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()


              gsap.to( fog, {
                far: 30,
                duration: 4,
                ease: "power4.inOut"
              });
              gsap.to( parent.camera.position, {
                x: 14.65,
                y: 1.4,
                z: 0,
                duration: 4,
                ease: "power4.inOut"
              });
              gsap.to( workGroup.position, {
                y: 0,
                duration: 4,
                ease: "power4.inOut"
              });
          }
      )






      parent.debugObject.positionX = 14.6044
      parent.debugObject.positionY = 1.4
      parent.debugObject.positionZ = 0
      parent.debugObject.targetX = 0
      parent.debugObject.targetY = 90;
      parent.debugObject.targetZ = 0
      parent.gui.add(parent.debugObject, 'positionX').min(-120).max(120).step(0.0001).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })
      parent.gui.add(parent.debugObject, 'positionY').min(-20).max(20).step(0.0001).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })
      parent.gui.add(parent.debugObject, 'positionZ').min(-20).max(20).step(0.0001).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })
      parent.gui.add(parent.debugObject, 'targetX').min(-180).max(180).step(1).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })
      parent.gui.add(parent.debugObject, 'targetY').min(-180).max(180).step(1).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })
      parent.gui.add(parent.debugObject, 'targetZ').min(-180).max(180).step(1).onChange(function(){
        parent.camera.position.set(parent.debugObject.positionX, parent.debugObject.positionY, parent.debugObject.positionZ)
        parent.camera.rotation.x = THREE.Math.degToRad(parent.debugObject.targetX);
        parent.camera.rotation.y = THREE.Math.degToRad(parent.debugObject.targetY);
        parent.camera.rotation.z = THREE.Math.degToRad(parent.debugObject.targetZ);
      })




      parent.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
      parent.directionalLight.castShadow = true
      parent.directionalLight.intensity = 2
      parent.directionalLight.shadow.camera.far = 15
      parent.directionalLight.shadow.mapSize.set(1024, 1024)
      parent.directionalLight.shadow.normalBias = 0.05
      parent.directionalLight.position.set(0.25, 3, - 2.25)
      parent.scene.add(parent.directionalLight)

    }
}
