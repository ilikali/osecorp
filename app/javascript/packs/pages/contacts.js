import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Contacts{
    constructor(options){
      const parent = options.this
      const that = parent


      parent.mixer = null

      parent.gltfLoader.load(
          '/models/run.gltf',
          (gltf) =>
          {
              $('.fader').fadeOut(1000);

              gltf.scene.scale.set(0.2, 0.2, 0.2);
              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()

              console.log(gltf.animations)
              // mixer = new THREE.AnimationMixer(gltf.scene)
              // const action = mixer.clipAction(gltf.animations[0])
              // action.play()
          }
      )

      console.log(1)








    }
}
