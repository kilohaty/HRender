import Element from './element';
import CCManager from '../utils/cache-canvas-manager';
import Utils from '../utils/misc';

const abs = Math.abs;

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
    this.width       = ctx.measureText(this.text).width * abs(this.scaleX);
    this.height      = Math.round(1.32 * this.fontSize) * abs(this.scaleY);
    CCManager.free(id);
  }

  _render(ctx) {
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