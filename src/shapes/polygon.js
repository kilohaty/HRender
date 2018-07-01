import Element from './element';
import CCManager from '../utils/cache-canvas-manager';

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
};

class Polygon extends Element {
  constructor(options) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
  }

  render(ctx) {
    if (!this.points) return;
    ctx.save();
    ctx.translate(this.left || 0, this.top || 0);
    ctx.lineWidth   = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle   = this.fillStyle;
    ctx.beginPath();
    this.points.forEach((point, i) => ctx[i ? 'lineTo' : 'moveTo'](point.x, point.y));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  isPointOnElement({x, y}) {
    const {ctx, id} = CCManager.get();
    this.render(ctx);
    const res = ctx.isPointInPath(x, y);
    CCManager.free(id);
    return res;
  }
}

export default Polygon;