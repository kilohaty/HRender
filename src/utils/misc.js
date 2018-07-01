export default {
  // 获取id
  getId(len = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length  = charset.length;
    let id        = '';
    for (let i = 0; i < len; i++) {
      id += charset.charAt(Math.floor(Math.random() * length));
    }
    return id;
  },

  clone(obj) {
    return typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj;
  },

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image       = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload      = resolve.bind(null, image);
      image.onerror     = reject;
      image.src         = src;
    });
  },

}