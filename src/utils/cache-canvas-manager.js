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

  get() {
    const target = this.collection.filter(data => data.status === STATUS.FREE)[0];
    if (target) {
      // clear canvas
      target.canvas.width  = 300;
      target.canvas.height = 150;
      target.ctx.clearRect(0, 0, 300, 150);
      // set status
      target.status = STATUS.BUSY;
      return {canvas: target.canvas, ctx: target.ctx, id: target.id};
    }
    this.add();
    return this.get();
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
 * const {id, canvas, ctx} = manager.get();
 * // do something
 * manager.free(id);
*/
const manager = new CacheCanvasManager();

export default manager;
