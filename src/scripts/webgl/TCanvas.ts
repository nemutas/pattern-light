import * as THREE from 'three'
import { gl } from './core/WebGL'
import fragmentShader from './shader/screenFs.glsl'
import vertexShader from './shader/screenVs.glsl'
import { Assets, loadAssets } from './utils/assetLoader'
import { calcCoveredTextureScale } from './utils/coveredTexture'
import { effects } from './effects/Effects'
import { mouse2d } from './utils/Mouse2D'
import VirtualScroll from 'virtual-scroll'
import { gsap } from 'gsap'

export class TCanvas {
  private images: THREE.Texture[] = []
  private patterns: THREE.Texture[] = []
  private prevImageIndex = 0
  private prevPatternIndex = 0
  private readyTextureChange = true

  private assets: Assets = {
    image1: { path: 'images/unsplash1.jpg' },
    image2: { path: 'images/unsplash2.jpg' },
    image3: { path: 'images/unsplash3.jpg' },
    image4: { path: 'images/unsplash4.jpg' },
    image5: { path: 'images/unsplash5.jpg' },
    pattern1: { path: 'images/pattern1.jpg' },
    pattern2: { path: 'images/pattern2.jpg' },
    pattern3: { path: 'images/pattern3.jpg' },
    pattern4: { path: 'images/pattern4.jpg' },
    pattern5: { path: 'images/pattern5.jpg' },
  }

  constructor(private container: HTMLElement) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      this.setTexture()
      gl.requestAnimationFrame(this.anime)
    })
  }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.z = 1

    Object.keys(this.assets).forEach((key) => {
      if (key.startsWith('image')) {
        this.images.push(this.assets[key].data as THREE.Texture)
      } else if (key.startsWith('pattern')) {
        this.patterns.push(this.assets[key].data as THREE.Texture)
      }
    })

    gl.setResizeCallback(() => {
      const screen = gl.getMesh<THREE.ShaderMaterial>('screen')
      const uniforms = screen.material.uniforms
      calcCoveredTextureScale(uniforms.uPattern.value.data, gl.size.aspect, uniforms.uPattern.value.scale)
      uniforms.uAspect.value = gl.size.aspect

      effects.resize()
    })

    this.addEvents()
  }

  private addEvents() {
    const scroller = new VirtualScroll()
    scroller.on((e) => {
      if (e.deltaY < 0) {
        this.handleTextureChange()
      }
    })
  }

  private getRandomTexture() {
    let imageIndex = 0
    for (let i = 0; i < 10; i++) {
      imageIndex = ~~(Math.random() * this.images.length)
      if (imageIndex !== this.prevImageIndex) break
    }
    this.prevImageIndex = imageIndex
    const image = this.images[imageIndex]

    let patternIndex = 0
    for (let i = 0; i < 10; i++) {
      patternIndex = ~~(Math.random() * this.patterns.length)
      if (patternIndex !== this.prevPatternIndex) break
    }
    this.prevPatternIndex = patternIndex
    const pattern = this.patterns[patternIndex]

    return { image, pattern }
  }

  private createObjects() {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPattern: { value: { data: null, scale: new THREE.Vector2() } },
        uMouse: { value: new THREE.Vector2() },
        uAspect: { value: gl.size.aspect },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'screen'

    gl.scene.add(mesh)
  }

  private setTexture() {
    const { image, pattern } = this.getRandomTexture()

    const screen = gl.getMesh<THREE.ShaderMaterial>('screen')
    const uniforms = screen.material.uniforms
    uniforms.uPattern.value.data = pattern
    calcCoveredTextureScale(uniforms.uPattern.value.data, gl.size.aspect, uniforms.uPattern.value.scale)

    effects.setup(image)
  }

  private handleTextureChange() {
    if (!this.readyTextureChange) return
    this.readyTextureChange = false

    const obj = { progress: 0 }

    const tl = gsap.timeline()
    tl.to(obj, {
      progress: 1,
      ease: 'power1.out',
      duration: 0.5,
      onUpdate: () => {
        effects.fade = obj.progress
      },
    })
    tl.call(() => this.setTexture())
    tl.to(obj, {
      progress: 0,
      ease: 'power1.inOut',
      duration: 0.5,
      onUpdate: () => {
        effects.fade = obj.progress
      },
    })
    tl.set(this, { readyTextureChange: true, delay: 0.5 })
  }

  // ----------------------------------
  // animation
  private anime = () => {
    const screen = gl.getMesh<THREE.ShaderMaterial>('screen')
    screen.material.uniforms.uMouse.value.set(mouse2d.position[0], mouse2d.position[1])

    // gl.render()
    effects.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
