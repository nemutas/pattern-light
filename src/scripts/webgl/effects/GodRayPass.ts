import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/godrayFs.glsl'
import * as THREE from 'three'
import { gui } from '../utils/Gui'

export class GodRayPass extends ShaderPass {
  private mouseTarget = new THREE.Vector2()

  constructor(needSwap = true) {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
        exposure: { value: 0.5 },
        decay: { value: 0.95 },
        density: { value: 1 },
        weight: { value: 1 },
        samples: { value: 100 },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
    this.needsSwap = needSwap
    this.setControls()
  }

  private setControls() {
    const add = (name: string, min = 0, max = 1, step = 0.01) => {
      gui.add(this.uniforms[name], 'value', min, max, step).name(name)
    }

    add('exposure')
    add('decay', 0.9, 1.0, 0.01)
    add('density')
    add('weight')
    add('samples', 10, 100, 10)
  }

  update(mouse: [number, number]) {
    const scale = 1
    const mx = mouse[0] * 0.5 * scale + 0.5
    const my = mouse[1] * 0.5 * scale + 0.5
    this.mouseTarget.set(mx, my)
    this.uniforms.lightPosition.value.lerp(this.mouseTarget, 0.05)
  }
}
