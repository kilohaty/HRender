import Element from './element';
import Utils from '../utils/misc';

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
 *    "src": 'https://kilohaty.com/example_stand.png', // 资源路径
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
  status: null,
  defaultStatus: null,
  statusData: {},
  lastFrameTime: 0,
  frameIndex: 0,
  updateList: ['statusData', 'status']
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
    if (['statusData', 'status'].indexOf(attr) !== -1) {
      this._updateStatus();
    }
  }

  async _updateStatus() {
    try {
      const data         = this.statusData[this.status];
      this.lastFrameTime = 0;
      this.frameIndex    = 0;
      data.loopedCount   = 0;
      if (!data.imageSource) {
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
    if (!data.imageSource) return;

    const frameData = data[this.frameIndex];
    if (!frameData) return;

    const now = Date.now();
    let left  = this.left;
    let top   = this.top;
    if (this.flipX) left = -(this.left + data.width);
    if (this.flipY) top = -(this.top + data.height);
    ctx.save();
    ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
    ctx.drawImage(
      data.imageSource,
      frameData.left,
      frameData.top,
      data.width,
      data.height,
      left,
      top,
      data.width,
      data.height);
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
    const data   = this.statusData[status] || {};
    if (!data) return false;

    const left   = this.left;
    const right  = this.left + data.width;
    const top    = this.top;
    const bottom = this.top + data.height;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  isAnimationEnd() {
    const data = this.statusData[this.status] || {};
    return !data || data.loopCount && data.loopedCount >= data.loopCount;
  }

  shouldRender() {
    return this.attributeChanged || !this.isAnimationEnd();
  }

}

export default Sprite;