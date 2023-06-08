import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/blendColorFs.glsl'
import * as THREE from 'three'
import { calcCoveredTextureScale } from '../utils/coveredTexture'

export class BlendColorPass extends ShaderPass {
  constructor() {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        uImage: { value: { data: null, scale: new THREE.Vector2() } },
        uFade: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
  }

  resize(aspect: number) {
    calcCoveredTextureScale(this.uniforms.uImage.value.data, aspect, this.uniforms.uImage.value.scale)
  }

  setImage(texture: THREE.Texture, aspect: number) {
    this.uniforms.uImage.value.data = texture
    this.resize(aspect)
  }

  set fade(val: number) {
    this.uniforms.uFade.value = val
  }
}
