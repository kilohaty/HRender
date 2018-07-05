import Event from '../utils/event';
import Utils from '../utils/misc';
import EVENT_TYPES from '../utils/event-types';

function createCanvas({width = '300', height = '150'}) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
  return canvas;
}

class Stage {
  constructor(options = {}) {
    this.initialize(options);
  }

  initialize({domSelector, width, height, openEventListener}) {
    const container = document.querySelector(domSelector);
    if (!container) {
      console.error(`can\'t find target element. [selector:${domSelector}]`);
      return;
    }

    // 画布容器
    this.container                = container;
    this.container.style.width    = width + 'px';
    this.container.style.height   = height + 'px';
    this.container.style.position = 'relative';

    this.width  = width;
    this.height = height;

    // 画布canvas
    const canvas = createCanvas({width, height});
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    container.appendChild(canvas);

    // 缓存canvas
    const cacheCanvas = createCanvas({width, height});
    this.cacheCanvas  = cacheCanvas;
    this.cacheCtx     = cacheCanvas.getContext('2d');

    if (openEventListener) {
      this.openEventListener();
    }

    requestAnimationFrame(this.loopAnim.bind(this));
  }

  /**
   * 添加元素至舞台
   */
  add() {
    this.elements.push(...arguments);
    return this;
  }

  /**
   * 移除元素至舞台
   */
  remove(elementId) {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].id === elementId) {
        this.elements.splice(i, 1);
        break;
      }
    }
  }

  loopAnim() {
    this.renderElements();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  /**
   * 绘制
   */
  renderElements() {
    if (!this.elements.some(el => el.visible && el.shouldRender())) {
      return;
    }
    this.cacheCtx.clearRect(0, 0, this.width, this.height);
    this.elements.forEach(el => {
      el.visible && el.render(this.cacheCtx);
    });
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.cacheCanvas, 0, 0);
  }

  /**
   * 开启事件监听
   * 事件类型：
   */
  openEventListener() {
    if (!this.bus) {
      this.bus = new Event(Utils.getId());
      this.container.addEventListener('mouseenter', this._onMouseEnter.bind(this));
      this.container.addEventListener('mousemove', this._onMouseMove.bind(this));
      this.container.addEventListener('mouseleave', this._onMouseLeave.bind(this));
      this.container.addEventListener('mousedown', this._onMouseDown.bind(this));
      this.container.addEventListener('mouseup', this._onMouseUp.bind(this));
      this.container.addEventListener('click', this._onClick.bind(this));
      this.container.addEventListener('contextmenu', this._onContextMenu.bind(this));
    }
  }

  getElementById(id) {
    return this.elements.filter(ele => ele.id === id)[0];
  }

  getElementByPoint({offsetX, offsetY}) {
    let result = null;
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i];
      if (element.isPointOnElement({x: offsetX, y: offsetY})) {
        result = element;
        break;
      }
    }
    return result;
  }
}

/**
 * 事件
 */
Object.assign(Stage.prototype, {

  __lastMouseEnterShapeId: null,

  _onMouseEnter(e) {
    this.bus.emit(EVENT_TYPES.STAGE_MOUSE_ENTER, {e: e});
  },

  _onMouseMove(e) {
    this.bus.emit(EVENT_TYPES.STAGE_MOUSE_MOVE, {e: e});

    const ele = this.getElementByPoint(e);
    if (ele) {
      if (!this.__lastMouseEnterShapeId) {
        this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_ENTER, {e: e, target: ele});
      } else {
        if (this.__lastMouseEnterShapeId !== ele.id) {
          const lastEle = this.getElementById(this.__lastMouseEnterShapeId);
          this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_LEAVE, {e: e, target: lastEle});
          this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_ENTER, {e: e, target: ele});
        } else {
          this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_MOVE, {e: e, target: ele});
        }
      }
      this.__lastMouseEnterShapeId = ele.id;
    } else {
      if (this.__lastMouseEnterShapeId) {
        const lastEle = this.getElementById(this.__lastMouseEnterShapeId);
        this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_LEAVE, {e: e, target: lastEle});
      }
      this.__lastMouseEnterShapeId = null;
    }
  },

  _onMouseLeave(e) {
    this.bus.emit(EVENT_TYPES.STAGE_MOUSE_LEAVE, {e: e});
  },

  _onMouseDown(e) {
    if (e.button === 2) return;

    this.bus.emit(EVENT_TYPES.STAGE_MOUSE_DOWN, {e: e});

    const ele = this.getElementByPoint(e);
    if (ele) {
      this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_DOWN, {e: e, target: ele});
    }
  },

  _onMouseUp(e) {
    if (e.button === 2) return;

    this.bus.emit(EVENT_TYPES.STAGE_MOUSE_UP, {e: e});

    const ele = this.getElementByPoint(e);
    if (ele) {
      this.bus.emit(EVENT_TYPES.ELEMENT_MOUSE_UP, {e: e, target: ele});
    }
  },

  _onClick(e) {
    if (e.button === 2) return;
    this.bus.emit(EVENT_TYPES.STAGE_CLICK, {e: e});

    const ele = this.getElementByPoint(e);
    if (ele) {
      this.bus.emit(EVENT_TYPES.ELEMENT_CLICK, {e: e, target: ele});
    }
  },

  _onContextMenu(e) {
    this.bus.emit(EVENT_TYPES.STAGE_CONTEXT_MENU, {e: e});
  },

});

Object.assign(Stage.prototype, {

  /**
   * 舞台容器
   * @HTMLElement
   */
  container: null,

  /**
   * 舞台宽度
   * @Number
   */
  width: 0,

  /**
   * 舞台高度
   * @Number
   */
  height: 0,

  /**
   * canvas
   * @HTMLCanvasElement
   */
  canvas: null,

  /**
   * canvas 2d context
   * @CanvasRenderingContext2D
   */
  ctx: null,

  /**
   * 缓存 canvas
   * @HTMLCanvasElement
   */
  cacheCanvas: null,

  /**
   * cache canvas 2d context
   * @CanvasRenderingContext2D
   */
  cacheCtx: null,

  /**
   * 舞台上的元素集合
   * @Array
   */
  elements: [],

  /**
   * 事件总线
   */
  bus: null,

});

export default Stage;