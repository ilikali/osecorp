import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Works{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(14.6044, 1.4, 0)



      that.camera.rotation.y = THREE.Math.degToRad(90);
      parent.gltfLoader.load(
          '/models/works_2.gltf',
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


              const workGeometry = new THREE.PlaneGeometry( 4, 2, 32 );
              const workMaterial = new THREE.MeshBasicMaterial( { color: 0x006FFF });

              let workItem = new THREE.Mesh( workGeometry, parent.color_material);
              workItem.rotation.y = THREE.Math.degToRad(90);
              workItem.position.set(10.3383, 1.7964, 0)
              parent.gui.add(workItem.position, 'x').min(-20).max(20).step(0.0001)
              parent.gui.add(workItem.position, 'y').min(-20).max(20).step(0.0001)
              parent.gui.add(workItem.position, 'z').min(-20).max(20).step(0.0001)

              gltf.scene.add(workItem)


              // $(document).on('mousemove', '.works_page_holder', function (event) {
              //   cursor.x = event.clientX / parent.width - 0.5
              //   cursor.y = event.clientY / parent.height - 0.5
              //   console.log(cursor.y)
              //   // totalScene.rotation.x = cursor.x/20
              //   totalScene.rotation.y = 1.5708 - cursor.y/20
              // });

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
