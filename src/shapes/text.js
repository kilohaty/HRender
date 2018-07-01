import Element from './element';
import CCManager from '../utils/cache-canvas-manager';

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

  render(ctx) {
    let left = this.left;
    let top  = this.top;
    if (this.flipX) left = -(this.left + this.width);
    if (this.flipY) top = -(this.top + this.height);
    ctx.save();
    ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
    ctx.font         = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle    = this.fillStyle;
    ctx.textAlign    = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(this.text, left, top);
    ctx.restore();
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

  isPointOnElement({x, y}) {
    const left   = this.left;
    const right  = this.left + this.width;
    const top    = this.top;
    const bottom = this.top + this.height;
    return x >= left && x <= right && y >= top && y <= bottom;
  }
}

export default Text;