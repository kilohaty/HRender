import ferryboat from 'ferryboat.js';
import Easing from './easing';

function noop() {
  return false;
}

class Animator {
  constructor(options) {
    this.options = options;
    return this;
  }

  config(options) {
    this.options = options;
    return this;
  }

  animate(attrs = {}, options = {}) {
    options              = Object.assign({}, this.options, options);
    const onComplete     = options.onComplete || noop;
    const onNodeComplete = options.onNodeComplete || noop;

    if (!this.ferryboat) {
      this.ferryboat = new ferryboat({
        onSuccess: ({taskIndex}) => {
          onNodeComplete(attrs, taskIndex);
        },
        onFail: ({error, current, total, taskIndex}) => {
          console.error('[ferryboat error]:', error, current, total, taskIndex);
        },
        onComplete: () => {
          onComplete(attrs);
        }
      });
    }

    this.ferryboat.add({
      fn: this.doAnimate.bind(this, attrs, options)
    });

    return this;
  }

  doAnimate(attrs = {}, options = {}) {
    return new Promise((resolve) => {
      const duration = +options.duration || 1000;
      const easing   = options.easing || Easing.Linear;
      const onChange = options.onChange || noop;

      for (let attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          const target   = attrs[attr];
          target.current = target.from;
        }
      }

      let startTime = Date.now();
      let endTime   = Date.now();

      (function anim() {
        endTime     = Date.now();
        const isEnd = endTime - startTime >= duration;

        for (let attr in attrs) {
          if (attrs.hasOwnProperty(attr)) {
            const t     = attrs[attr];
            let current = easing(endTime - startTime, t.from, t.to, duration);
            if (isEnd) current = t.to; // 修正误差
            t.increment = current - (t.current || 0);
            t.current   = current;
          }
        }

        onChange(attrs);

        if (isEnd) {
          resolve();
          return;
        }
        requestAnimationFrame(anim.bind(this));
      }).call(this);
    });
  }
}

Object.assign(Animator.prototype, {
  options: null,
  onChange: noop,
  onComplete: noop,
  ferryboat: null,
  fragments: null,
});

export default Animator;