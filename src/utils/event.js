const emptyFunction = function () {};

function Evt(id) {
  this.id   = id || Date.now();
  this.list = {};
}

Evt.prototype.on = function (type, fn, onlyOnce) {
  if (!this.list[type]) {
    this.list[type] = [];
  }

  this.list[type].push({
    fn: fn,
    onlyOnce: !!onlyOnce
  });

  return this;
};

Evt.prototype.one = function (type, fn) {
  this.on(type, fn, true);
  return this;
};

Evt.prototype.off = function (type) {
  for (let i in this.list) {
    if (this.list.hasOwnProperty(i)) {
      if (type === i) {
        this.list[type].length = 0;
        break;
      }
    }
  }
  return this;
};

Evt.prototype.emit = function () {
  const type       = Array.prototype.shift.call(arguments);
  const eventLists = this.list[type];

  if (!eventLists || !eventLists.length) {
    return emptyFunction;
  }

  for (let i = 0; i < eventLists.length; i++) {
    const fnInfo   = eventLists[i];
    const fn       = fnInfo.fn;
    const onlyOnce = fnInfo.onlyOnce;

    fn.apply(this, arguments);
    if (onlyOnce) {
      eventLists.splice(i, 1);
    }
  }
};

export default Evt;
