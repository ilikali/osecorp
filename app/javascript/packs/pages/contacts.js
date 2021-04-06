import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Contacts{
    constructor(options){
      const parent = options.this
      const that = parent

      gsap.to( parent.camera.position, {x: 0.4162, y: 0.0694, z: 0.149, duration: 0.1});
      gsap.to( parent.camera.rotation, {y: THREE.Math.degToRad(73), duration: 0.1});


      parent.mixer = null

      parent.gltfLoader.load(
          '/models/run_2.gltf',
          (gltf) =>
          {
              $('.fader').fadeOut(1000);

              gltf.scene.scale.set(0.1, 0.1, 0.1);


              gltf.scene.children[0].children[1].material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                skinning: true
              });
              // gltf.scene.children[0].children[1].material.

              let runner = gltf.scene.children[0].children[1]

              parent.gui.add(runner.position, 'x').min(-120).max(120).step(0.0001)
              parent.gui.add(runner.position, 'y').min(-120).max(120).step(0.0001)
              parent.gui.add(runner.position, 'z').min(-120).max(120).step(0.0001)

              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()
              parent.mixer = new THREE.AnimationMixer(gltf.scene)
              const action = parent.mixer.clipAction(gltf.animations[0])
              action.play()
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
