let id = 1; // 约定id为正整数

const DEFAULT_ATTRIBUTES = {
  type: 'element',
  originX: 'left',
  originY: 'top',
  left: 0,
  top: 0,
  flipX: false,
  flipY: false,
  visible: true,
  cache: false,
  updateList: []
};

/**
 * 根元素，被其他shape继承
 */
class Element {
  constructor(options = {}) {
    const opts = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    this._init(opts);
  }

  _init(opts) {
    // 设置初始值
    this.$id = id++;
    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          get: function () {
            return this['$' + key];
          },
          set: function (value) {
            this['$' + key] = value;
            if (this.$updateList.indexOf(key) !== -1) {
              this.update();
            }
          }
        });
      }
    }
    this.set(opts);
  }

  set(opts) {
    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        this['$' + key] = opts[key];
      }
    }
    this.update();
    return this;
  }

  get id() {
    return this.$id;
  }

  set id(id) {}

  update() {}

  render(ctx) {}

  isPointOnElement({x, y, ctx}) {
    return false;
  }
}

export default Element;