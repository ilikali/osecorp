import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Works{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(14.6044, 1.4, 0)

      parent.work_videos = []
      const workGroup = new THREE.Group();
      const workGeometry = new THREE.PlaneGeometry( 4, 2.2, 32 );


      workGroup.position.set(-0.0307, 0, 0.0994);

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


              // const workGeometryVideo = new THREE.PlaneGeometry( 3.8, 1.8, 32 );
              // let workItemVideo = new THREE.Mesh( workGeometryVideo, workMaterialBg);
              // workItemVideo.rotation.y = THREE.Math.degToRad(90);
              // workItemVideo.position.set(10.35, 1.75, 0)
              // gltf.scene.add(workItemVideo)


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
                console.log(cursor.x)
                totalScene.rotation.x = cursor.x/100
                workGroup.rotation.x = -cursor.x/50
              });

              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()
          }
      )



      const fog = new THREE.Fog('#000000', 1, 30)
      parent.scene.fog = fog


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
