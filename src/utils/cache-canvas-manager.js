import Utils from './misc';

const STATUS = {
  FREE: 0,
  BUSY: 1
};

class CacheCanvasManager {
  constructor() {
  }
}

Object.assign(CacheCanvasManager.prototype, {
  collection: [],

  get(width = 1, height = 1) {
    const target = this.collection.filter(data => data.status === STATUS.FREE)[0];
    if (target) {
      target.canvas.width  = width;
      target.canvas.height = height;
      target.status        = STATUS.BUSY;
      return {canvas: target.canvas, ctx: target.ctx, id: target.id};
    }
    this.add();
    return this.get(width, height);
  },

  add() {
    const canvas = document.createElement('canvas');
    const id     = Utils.getId();
    const ctx    = canvas.getContext('2d');
    this.collection.push({id: id, canvas: canvas, ctx: ctx, status: STATUS.FREE});
  },

  free(id) {
    for (let i = 0; i < this.collection.length; i++) {
      if (this.collection[i].id === id) {
        this.collection[i].status = STATUS.FREE;
        break;
      }
    }
  }

});

/*
 * Usage:
 *
 * const {id, canvas, ctx} = manager.get(80, 50);
 * // do something
 * manager.free(id);
*/
const manager = new CacheCanvasManager();

export default manager;
