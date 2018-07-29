import Element from './element';
import CCManager from '../utils/cache-canvas-manager';

const abs = Math.abs;

const DEFAULT_ATTRIBUTES = {
  type: 'polygon',
  /**
   * 多边形的点
   * [{x: 0, y: 0}, {x: 20, y: 0}, {x: 20, y: 20}, {x: 0, y: 20}]
   * @type Array
   */
  points: null,
  lineWidth: 1,
  strokeStyle: '#000000',
  fillStyle: 'transparent',
  updateList: ['points', 'lineWidth', 'strokeStyle', 'fillStyle'],
  boundingRect: null,
};

class Polygon extends Element {
  constructor(options) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
    this.boundingRect = this.getBoundingRect();
  }

  update(attr) {
    if (attr === 'points') {
      this.boundingRect = this.getBoundingRect();
    }
  }

  getBoundingRect() {
    const minX = Math.min(...this.points.map(p => p.x));
    const maxX = Math.max(...this.points.map(p => p.x));
    const minY = Math.min(...this.points.map(p => p.y));
    const maxY = Math.max(...this.points.map(p => p.y));

    return {
      left: this.left + minX,
      top: this.top + minY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    };
  }

  _render(ctx) {
    if (!this.points) return;

    const scaleX = this.flipX ? -this.scaleX : this.scaleX;
    const scaleY = this.flipY ? -this.scaleY : this.scaleY;

    ctx.save();
    ctx.translate(this.left || 0, this.top || 0);
    ctx.lineWidth   = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle   = this.fillStyle;
    ctx.beginPath();
    if (this.angle) {
      ctx.rotate(this.angle / 180 * Math.PI);
    }
    ctx.scale(abs(scaleX), abs(scaleY));
    this.points.forEach((point, i) => {
      const x = scaleX < 0 ? this.boundingRect.width - point.x : point.x;
      const y = scaleY < 0 ? this.boundingRect.height - point.y : point.y;
      ctx[i ? 'lineTo' : 'moveTo'](x, y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  isPointOnElement({x, y}) {
    const {ctx, id} = CCManager.get();
    this._render(ctx);
    const res = ctx.isPointInPath(x, y);
    CCManager.free(id);
    return res;
  }

}

export default Polygon;