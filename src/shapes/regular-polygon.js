import Polygon from './polygon';

const sin = Math.sin;
const cos = Math.cos;
const PI  = Math.PI;

const MAX_EDGE_NUMBER = 999;

const DEFAULT_ATTRIBUTES = {
  type: 'regular-polygon',
  centerX: 0,
  centerY: 0,
  edgeNumber: 3, // 最大值 999
  startAngle: 0, // 起始角度
  _startRadian: 0, // 起始角度(弧度表示)
  _centralAngle: 0, // 中心角，相邻的两个顶点与它的中心的连线的夹角
  _centralRadian: 0, // 中心角(弧度表示)
  radius: 0, // 半径
  points: null,
  lineWidth: 1,
  strokeStyle: '#000000',
  fillStyle: 'transparent',
  updateList: ['centerX', 'centerY', 'startAngle', 'edgeNumber', 'radius']
};

class RegularPolygon extends Polygon {
  constructor(options) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
  }

  update() {
    const edgeNumber = Math.min(Math.max(this.edgeNumber || 0, 3), MAX_EDGE_NUMBER);
    if (edgeNumber !== this.edgeNumber) {
      this.edgeNumber = edgeNumber;
    }

    if (!isNaN(this.startAngle)) {
      this._startRadian = this.startAngle * PI / 180;
    }
    this._centralAngle  = 360 / this.edgeNumber;
    this._centralRadian = this._centralAngle * PI / 180;

    const x0    = this.centerX;
    const y0    = this.centerY - this.radius;
    this.points = [];
    for (let i = 0; i < this.edgeNumber; i++) {
      const radian = this._startRadian + this._centralRadian * i;
      const x1     = this.centerX + (x0 - this.centerX) * cos(radian) - (y0 - this.centerY) * sin(radian);
      const y1     = this.centerY - (x0 - this.centerX) * sin(radian) + (y0 - this.centerY) * cos(radian);
      this.points.push({x: x1, y: y1});
    }
  }

}

export default RegularPolygon;