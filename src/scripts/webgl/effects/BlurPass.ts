import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader'

export class HorizontalBlurPass extends ShaderPass {
  constructor(resolution = 512) {
    super(HorizontalBlurShader)
    this.uniforms.h.value = 1 / resolution
  }
}

export class VerticalBlurPass extends ShaderPass {
  constructor(resolution = 512) {
    super(VerticalBlurShader)
    this.uniforms.v.value = 1 / resolution
  }
}
