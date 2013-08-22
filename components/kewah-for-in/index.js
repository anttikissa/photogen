var has = Object.prototype.hasOwnProperty;

/**
 * Iterates an object.
 * If the iterator return false, it breaks the loop.
 *
 * @param {Object} obj
 * @param {Function} fn   Iterator
 * @param {Object} ctx    [Optional] Context
 * @return {Object}
 */
module.exports = function forIn(obj, fn, ctx) {
  var key;

  if (!ctx) {
    for (key in obj) {
      if (has.call(obj, key)) {
        if (false === fn(obj[key], key, obj)) {
          return obj;
        }
      }
    }
  } else {
    for (key in obj) {
      if (has.call(obj, key)) {
        if (false === fn.call(ctx, obj[key], key, obj)) {
          return obj;
        }
      }
    }
  }

  return obj;
};