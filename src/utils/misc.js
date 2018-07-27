import CCManager from './cache-canvas-manager';

const PI  = Math.PI;
const sin = Math.sin;
const cos = Math.cos;

export default {
  // 获取id
  getId(len = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length  = charset.length;
    let id        = '';
    for (let i = 0; i < len; i++) {
      id += charset.charAt(Math.floor(Math.random() * length));
    }
    return id;
  },

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image       = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload      = resolve.bind(null, image);
      image.onerror     = reject;
      image.src         = src;
    });
  },

  degreesToRadians(degrees) {
    return degrees * PI / 180;
  },

  radiansToDegrees(radians) {
    return radians * 180 / PI;
  },

  rotatePoint(origin, degrees, point) {
    const x1      = point.x;
    const y1      = point.y;
    const x2      = origin.x;
    const y2      = origin.y;
    const radians = this.degreesToRadians(degrees);

    const x = (x1 - x2) * cos(radians) - (y1 - y2) * sin(radians) + x2;
    const y = (x1 - x2) * sin(radians) + (y1 - y2) * cos(radians) + y2;

    return {x: x, y: y};
  },

  isPointInPath(points, {x, y}) {
    const {ctx, id} = CCManager.get();
    points.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y));
    const res = ctx.isPointInPath(x, y);
    CCManager.free(id);
    return res;
  },

  isPointOnRect(rect, {x, y}) {
    const left   = rect.left;
    const right  = rect.left + rect.width;
    const top    = rect.top;
    const bottom = rect.top + rect.height;

    if (rect.angle) {
      const points = [
        {x: left, y: top},
        {x: right, y: top},
        {x: right, y: bottom},
        {x: left, y: bottom},
      ].map(p => this.rotatePoint({x: left, y: top}, rect.angle, p));
      return this.isPointInPath(points, {x: x, y: y});
    }

    return x >= left && x <= right && y >= top && y <= bottom;
  }

}