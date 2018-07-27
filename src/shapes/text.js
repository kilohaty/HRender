import Element from './element';
import CCManager from '../utils/cache-canvas-manager';
import Utils from '../utils/misc';

const DEFAULT_ATTRIBUTES = {
  type: 'text',
  text: '',
  fillStyle: '#000',
  fontSize: 12,
  fontFamily: '"Helvetica", "Tahoma", "Arial", "PingFang SC", "Hiragino Sans GB", "Heiti SC", STXihei, "Microsoft YaHei", "SimHei", "WenQuanYi Micro Hei"',
  textAlign: 'left',
  textBaseline: 'top',
  updateList: ['text', 'fillStyle', 'fontSize', 'fontFamily', 'textAlign', 'textBaseline']
};

class Text extends Element {
  constructor(options = {}) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
  }

  update() {
    const {ctx, id}  = CCManager.get();
    ctx.font         = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle    = this.fillStyle;
    ctx.textAlign    = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    this.width       = ctx.measureText(this.text).width;
    this.height      = Math.round(1.32 * this.fontSize);
    CCManager.free(id);
  }

  _render(ctx) {
    const left = this.flipX ? -this.width : 0;
    const top  = this.flipY ? -this.height : 0;
    ctx.save();
    ctx.translate(this.left, this.top);
    if (this.angle) {
      ctx.rotate(this.angle / 180 * Math.PI);
    }
    ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
    ctx.font         = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle    = this.fillStyle;
    ctx.textAlign    = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(this.text, left, top);
    ctx.restore();
  }

  isPointOnElement(point) {
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

export default Text;