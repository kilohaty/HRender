import Element from './element';
import Utils from '../utils/misc';

const abs = Math.abs;

/**
 *
 * 使用示例:
 *
 * ====== Spirit Image Data ======
 *
 * statusData: {
 *  // [状态: stand]
 *  stand: {
 *    "0": {
 *      "left": 0,
 *      "top": 0,
 *    },
 *    "length": 1, // 总帧数
 *    "width": 180, // 每一帧图像区域宽度
 *    "height": 126, // 每一帧图像区域高度
 *    "frameDelay": 100, // 帧延迟
 *    "src": 'https://kilohaty.com/example_stand.png', // 资源路径，可选，覆盖Sprite的src属性
 *    "loopCount": null, // 播放次数, 无限循环设置空值即可
 *  },
 *
 *  // [状态: attack]
 *   attack: {
 *    "0": {
 *      "left": 0,
 *      "top": 0,
 *    },
 *    "1": {
 *      "left": 180,
 *      "top": 0,
 *    },
 *    "2": {
 *      "left": 360,
 *      "top": 0,
 *    },
 *    "length": 3,
 *     "width": 180,
 *     "height": 126,
 *     "frameDelay": 150,
 *     "src": 'https://kilohaty.com/example_move.png',
 *     "loopCount": 1,
 *   }
 * }
 */

const DEFAULT_ATTRIBUTES = {
  type: 'spirit',
  src: '',
  imageSource: null,
  status: null,
  defaultStatus: null,
  statusData: {},
  lastFrameTime: 0,
  frameIndex: 0,
  updateList: ['src', 'statusData', 'status']
};

class Sprite extends Element {
  constructor(options = {}) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    super(opts);
    this._initStatusData();
  }

  _initStatusData() {
    for (let status in this.statusData) {
      if (this.statusData.hasOwnProperty(status)) {
        this.statusData[status].loopedCount = 0;
      }
    }
  }

  async update(attr) {
    if (attr === 'src') {
      this._updateSrc();
    } else if (['statusData', 'status'].indexOf(attr) !== -1) {
      this._updateStatus();
    }
  }

  async _updateSrc() {
    try {
      if (this.src) {
        this.imageSource = await Utils.loadImage(this.src);
      } else {
        this.imageSource = null;
      }
      this.attributeChanged = true;
    } catch (err) {
      console.error(err);
    }
  }

  async _updateStatus() {
    try {
      const data = this.statusData[this.status];
      if (!data) {
        this.status = this.defaultStatus;
        console.error('Status error');
        return;
      }

      this.lastFrameTime = 0;
      this.frameIndex    = 0;
      this.width         = data.width * abs(this.scaleX);
      this.height        = data.height * abs(this.scaleY);
      data.loopedCount   = 0;
      if (data.src && !data.imageSource) {
        data.imageSource      = await Utils.loadImage(data.src);
        this.attributeChanged = true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  _render(ctx) {
    const status = this.status;
    const data   = this.statusData[status] || {};

    const imageSource = data.imageSource || this.imageSource;
    if (!imageSource) return;

    const frameData = data[this.frameIndex];
    if (!frameData) return;

    const now    = Date.now();
    const scaleX = this.flipX ? -this.scaleX : this.scaleX;
    const scaleY = this.flipY ? -this.scaleY : this.scaleY;
    const left   = scaleX < 0 ? this.width / scaleX : 0;
    const top    = scaleY < 0 ? this.height / scaleY : 0;
    const width  = abs(this.width / scaleX);
    const height = abs(this.height / scaleY);

    ctx.save();
    ctx.translate(this.left, this.top);
    if (this.angle) {
      ctx.rotate(this.angle / 180 * Math.PI);
    }
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(
      imageSource,
      frameData.left,
      frameData.top,
      width,
      height,
      left,
      top,
      width,
      height);
    ctx.restore();
    // calc frameIndex and loopCount
    if (now - this.lastFrameTime >= data.frameDelay) {
      this.frameIndex++;
      this.lastFrameTime = now;
      if (this.frameIndex >= data.length) {
        this.frameIndex = 0;
        data.loopedCount++;
        if (data.loopCount && data.loopedCount >= data.loopCount) {
          this.status = this.defaultStatus;
        }
      }
    }
  }

  isPointOnElement({x, y}) {
    const status = this.status;
    const data   = this.statusData[status];
    if (!data) return false;

    return Utils.isPointOnRect(
      {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        angle: this.angle,
      },
      {x, y});
  }

  isAnimationEnd() {
    const data = this.statusData[this.status];
    return !data || data.loopCount && data.loopedCount >= data.loopCount;
  }

  shouldRender() {
    return this.attributeChanged || !this.isAnimationEnd();
  }

}

export default Sprite;