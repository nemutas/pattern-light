import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { gl } from '../core/WebGL'
import { GodRayPass } from './GodRayPass'
import { BlendColorPass } from './BlendColorPass'
import { mouse2d } from '../utils/Mouse2D'
import { HorizontalBlurPass, VerticalBlurPass } from './BlurPass'

class Effects {
  private composer!: EffectComposer
  private godRayPass = new GodRayPass()
  private blendColorPass = new BlendColorPass()

  constructor() {
    this.init()
  }

  private init() {
    this.composer = new EffectComposer(gl.renderer)
    this.composer.addPass(new RenderPass(gl.scene, gl.camera))
    this.composer.addPass(this.godRayPass)
    this.composer.addPass(new HorizontalBlurPass(1024))
    this.composer.addPass(new VerticalBlurPass(1024))
    this.composer.addPass(this.blendColorPass)
  }

  setup(blendTexture: THREE.Texture) {
    this.blendColorPass.setImage(blendTexture, gl.size.aspect)
  }

  resize() {
    const { width, height, aspect } = gl.size
    this.blendColorPass.resize(aspect)
    this.composer.setSize(width, height)
  }

  set fade(val: number) {
    this.blendColorPass.fade = val
  }

  render() {
    this.godRayPass.update(mouse2d.position)
    this.composer.render()
  }

  dispose() {
    this.composer.passes.forEach((pass) => pass.dispose())
    this.composer.dispose()
  }
}

export const effects = new Effects()
