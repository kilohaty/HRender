let id = 1; // 约定id为正整数

const DEFAULT_ATTRIBUTES = {
  type: 'element',
  originX: 'left',
  originY: 'top',
  left: 0,
  top: 0,
  flipX: false,
  flipY: false,
  angle: 0,
  visible: true,
  attributeChanged: true,
  updateList: ['left', 'top', 'flipX', 'flipY', 'angle', 'visible']
};

/**
 * 根元素，被其他shape继承
 */
class Element {
  constructor(options = {}) {
    const opts      = Object.assign({}, DEFAULT_ATTRIBUTES, options);
    opts.updateList = Array.from(new Set(DEFAULT_ATTRIBUTES.updateList.concat(options.updateList)));
    this._init(opts);
  }

  _init(opts) {
    this.$id = id++;
    this._initAttributes(opts);

    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          get: function () {
            return this['$' + key];
          },
          set: function (value) {
            if (value === this['$' + key]) return;

            this['$' + key] = value;
            if (this.$updateList && this.$updateList.indexOf(key) !== -1) {
              this.update(key);
              this.$attributeChanged = true;
            }
          }
        });
      }
    }

    this.set(opts);
  }

  _initAttributes(opts) {
    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        this['$' + key] = opts[key];
      }
    }
  }

  set(opts) {
    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        this['$' + key] = opts[key];
        this.update(key);
      }
    }
    this.$attributeChanged = true;
    return this;
  }

  get id() {
    return this.$id;
  }

  set id(id) {
  }

  update() {
  }

  render(ctx) {
    this.$attributeChanged = false;
    this._render(ctx);
  }

  _render(ctx) {
  }

  shouldRender() {
    return this.attributeChanged;
  }

  isPointOnElement({x, y, ctx}) {
    return false;
  }

}

export default Element;