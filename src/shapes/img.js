import Element from './element';
import Utils from '../utils/misc';

const DEFAULT_ATTRIBUTES = {
  type: 'img',
  src: '',
  imageSource: null,
  updateList: ['src']
};

class Img extends Element {
  constructor(options = {}) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
  }

  async update() {
    try {
      this.imageSource      = await Utils.loadImage(this.src);
      this.width            = this.imageSource.width;
      this.height           = this.imageSource.height;
      this.attributeChanged = true;
    } catch (err) {
      console.error(err);
    }
  }

  _render(ctx) {
    if (!this.imageSource) return;
    const left = this.flipX ? -this.width : 0;
    const top  = this.flipY ? -this.height : 0;
    ctx.save();
    ctx.translate(this.left, this.top);
    if (this.angle) {
      ctx.rotate(this.angle / 180 * Math.PI);
    }
    ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
    ctx.drawImage(this.imageSource, left, top);
    ctx.restore();
  }

  isPointOnElement({x, y}) {
    const left   = this.left;
    const right  = this.left + this.width;
    const top    = this.top;
    const bottom = this.top + this.height;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

}

export default Img;