import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'

export default class Works{
    constructor(options){
      const parent = options.this
      const that = parent

      parent.camera.position.set(7.2, 1.4, 0)

      that.camera.rotation.y = THREE.Math.degToRad(90);
      parent.gltfLoader.load(
          '/models/works.gltf',
          (gltf) =>
          {
              console.log(gltf.scene)
              gltf.scene.scale.set(1, 1, 1);
              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()
          }
      )



      const cubeGeometry = new THREE.BoxGeometry( 3, 3, 3 );
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x006FFF } );
      const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
      cube.layers.enable( parent.BLOOM_SCENE );


      const planeFrontGeometry = new THREE.PlaneGeometry( 2.8, 2.8, 32 );
      const planeFrontMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: parent.textureLoader.load('https://previews.123rf.com/images/jackreznor7/jackreznor71707/jackreznor7170700032/81602950-abstract-colorful-fluid-background.jpg'),
      });
      const planeFront = new THREE.Mesh( planeFrontGeometry, planeFrontMaterial );
      planeFront.position.set( 1.51, 0, 0 );
      planeFront.rotation.y = THREE.Math.degToRad(90)


      const planeBackGeometry = new THREE.PlaneGeometry( 2.8, 2.8, 32 );
      const planeBackMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
      const planeBack = new THREE.Mesh( planeBackGeometry, planeBackMaterial );
      planeBack.position.set( 0, -1.51, 0);
      planeBack.rotation.x = THREE.Math.degToRad(90)


      const group = new THREE.Group();
      group.add( cube );
      group.add( planeFront );
      group.add( planeBack );
      group.position.set(0.3, 1.6, 1.93);
      parent.scene.add( group );

      //
      // document.querySelector('.firstScroll').addEventListener('click', (e)=>{
      //
      //   gsap.to( that.camera.rotation, {
      //     y: THREE.Math.degToRad(78),
      //     duration: 4,
      //     ease: "power4.inOut"
      //   });
      //
      //   gsap.to( that.camera.position, {
      //     x: 7.18,
      //     y: 1.8,
      //     z: 5.6,
      //     duration: 4,
      //     ease: "power4.inOut"
      //   });
      //   gsap.to( group.rotation, {
      //     y: `+=${THREE.Math.degToRad(360)}`,
      //     duration: 4,
      //     ease: "power4.inOut"
      //   });
      //   setTimeout(function(){
      //     planeFrontMaterial.map = that.textureLoader.load('https://blobcdn.same.energy/b/6b/f6/6bf632db38e78033f98b94c8853f26210d4ba443');
      //   },1000)
      //
      // });
      //

      const fog = new THREE.Fog('#000000', 3, 15)
      parent.scene.fog = fog


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
