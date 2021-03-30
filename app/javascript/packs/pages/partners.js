import * as THREE from 'three'
import { gsap, Power2, Power0 } from 'gsap'
import Scrollbar from 'smooth-scrollbar';

export default class Partners{
    constructor(options){
      const parent = options.this
      const that = parent
      let hands;


      gsap.to( parent.camera.position, {x: 0.1987, y: -0.04, z: 0, duration: 0.1});
      gsap.to( parent.camera.rotation, {y: THREE.Math.degToRad(90), duration: 0.1});




      parent.gltfLoader.load(
          '/models/hands_2.gltf',
          (gltf) =>
          {
              $('.fader').fadeOut(1000);

              gltf.scene.scale.set(0.2, 0.2, 0.2);
              hands = gltf.scene.children[0]
              console.log(hands.material)
              hands.position.z = -0.4847
              // parent.gui.add(hands.position, 'x').min(-5).max(5).step(0.0001).name('posionX')
              // parent.gui.add(hands.position, 'y').min(-5).max(5).step(0.0001).name('posionY')
              // parent.gui.add(hands.position, 'z').min(-5).max(5).step(0.0001).name('posionZ')
              // parent.gui.add(hands.rotation, 'x').min(-5).max(5).step(0.0001).name('rotationX')
              // parent.gui.add(hands.rotation, 'y').min(-5).max(5).step(0.0001).name('rotationY')
              // parent.gui.add(hands.rotation, 'z').min(-5).max(5).step(0.0001).name('rotationZ')

              parent.scene.add(gltf.scene)
              parent.updateAllMaterials()
          }
      )


      const partnersLightGeometry = new THREE.CircleGeometry( 0.09, 60 );
      const partnersLightMaterial = new THREE.MeshBasicMaterial({ color: 0x006FFF });
      const partnersLight = new THREE.Mesh( partnersLightGeometry, partnersLightMaterial );
      partnersLight.layers.enable( parent.BLOOM_SCENE );
      partnersLight.position.set(-0.0353, 0.0219, 0)
      partnersLight.rotation.y = THREE.Math.degToRad(90)
      parent.scene.add( partnersLight );


      const geometry = new THREE.ConeGeometry( 0.02, 0.05, 8 );
      const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0,
        metalness: 1,
      });
      const cone = new THREE.Mesh( geometry, material );
      cone.position.set(0.0362, -0.1641, -0.0926)
      cone.rotation.x = THREE.Math.degToRad(45)
      gsap.to(cone.rotation, 10, {z:6.28319, ease: "linear", repeat:-1});
      parent.scene.add( cone );


      const icosahedronGeometry = new THREE.IcosahedronGeometry( 0.05, 0);
      const icosahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0,
        metalness: 1,
      });
      const icosahedron = new THREE.Mesh( icosahedronGeometry, icosahedronMaterial );
      icosahedron.position.set(0, -0.2462, 0.1187)
      gsap.to(icosahedron.rotation, 10, {z:6.28319, ease: "linear", repeat:-1});
      parent.scene.add( icosahedron );


      parent.gui.add(icosahedron.position, 'x').min(-5).max(5).step(0.0001).name('posionX')
      parent.gui.add(icosahedron.position, 'y').min(-5).max(5).step(0.0001).name('posionY')
      parent.gui.add(icosahedron.position, 'z').min(-5).max(5).step(0.0001).name('posionZ')
      parent.gui.add(icosahedron.rotation, 'x').min(-5).max(5).step(0.0001).name('rotationX')
      parent.gui.add(icosahedron.rotation, 'y').min(-5).max(5).step(0.0001).name('rotationY')
      parent.gui.add(icosahedron.rotation, 'z').min(-5).max(5).step(0.0001).name('rotationZ')



      let partners = document.querySelector('.partners')
      let scrollbar = Scrollbar.init(partners);
      scrollbar.track.xAxis.element.remove();
      scrollbar.addListener((s) => {
          that.camera.position.y = -0.04 - s.offset.y/5000;
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
