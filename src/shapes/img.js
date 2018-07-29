import Element from './element';
import Utils from '../utils/misc';

const abs = Math.abs;

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
      this.width            = this.imageSource.width * abs(this.scaleX);
      this.height           = this.imageSource.height * abs(this.scaleY);
      this.attributeChanged = true;
    } catch (err) {
      console.error(err);
    }
  }

  _render(ctx) {
    if (!this.imageSource) return;

    const scaleX = this.flipX ? -this.scaleX : this.scaleX;
    const scaleY = this.flipY ? -this.scaleY : this.scaleY;
    const left   = scaleX < 0 ? this.width / scaleX : 0;
    const top    = scaleY < 0 ? this.height / scaleY : 0;

    ctx.save();
    ctx.translate(this.left, this.top);
    if (this.angle) {
      ctx.rotate(this.angle / 180 * Math.PI);
    }
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(this.imageSource, left, top);
    ctx.restore();
  }

  isPointOnElement(point) {
    if (!this.imageSource) return false;

    return Utils.isPointOnRect(
      {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        angle: this.angle,
      },
      point);
  }

}

export default Img;