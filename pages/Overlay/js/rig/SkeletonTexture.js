import { mapObject, NO_OP } from "../utils/object"
import { MathUtils } from "three"

const lerp = MathUtils.lerp

export default class SkeletonTexture {
  constructor(images) {
    // console.log(images)
    this.layers = mapObject(images, img => new Layer(img))
    const [firstImg] = Object.values(images)
    const cv = document.createElement('canvas')
    cv.width = firstImg.width
    cv.height = firstImg.height

    this.canvas = cv
    this.ctx = this.canvas.getContext('2d')
    // this.ctx.filter = `sepia(100%)`;
    this.ctx.fillStyle = 'rgba(5, 50, 50)'
    // this.ctx.fillStyle = 'red'

    this.canvas.style.cssText = `
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
    z-index:1000`

    document.body.appendChild(this.canvas)

    this.debug(false)
    this.update()
  }

  setLayerOpacity(layerName, opacity) {
    this.layers[layerName].setOpacity(opacity)
  }

  loopLayers(callback = NO_OP) {
    Object.entries(this.layers).forEach(([name, layer]) => callback(layer, name, this.layers))
  }

  setLayersOpacity(opacity) {
    this.loopLayers(layer => layer.setOpacity(opacity))
  }

  debug(show) {
    this.canvas.style.display = show ? 'block' : 'none'
  }

  update() {
    const { width, height } = this.canvas
    this.ctx.save()
    this.ctx.fillRect(0, 0, width, height)
    // this.ctx.globalCompositeOperation = 'lighter'
    this.loopLayers(layer => layer.draw(this.ctx))
    this.ctx.restore()
  }

  static async preload(texFiles, texFolder) {
    const images = {}
    const loads = Object.entries(texFiles).map(([name, path]) => {
      const img = new Image()
      const prom = new Promise(resolve => img.onload = resolve)
      img.src = texFolder + path
      images[name] = img
      return prom
    })

    await Promise.all(loads)
    return new this(images)
  }
}

class Layer {
  constructor(image) {
    this.img = image
    this.opacity = 1
    this.smoothedOpacity = this.opacity
  }

  setOpacity(opacity) {
    this.opacity = opacity
  }

  draw(ctx) {
    this.smoothedOpacity = lerp(this.smoothedOpacity, this.opacity, 0.1)
    ctx.globalAlpha = this.smoothedOpacity
    ctx.drawImage(this.img, 0, 0)
    ctx.globalAlpha = 1
  }
}