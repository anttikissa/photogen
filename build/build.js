
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("matthewp-xhrerror/index.js", function(exports, require, module){
function XhrError(message, status) {
  Error.call(this);

  this.name = 'XhrError';
  this.message = message;
  this.status = status;
}

XhrError.prototype = Object.create(Error.prototype);

module.exports = XhrError;
});
require.register("kewah-for-in/index.js", function(exports, require, module){
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
});
require.register("yields-xhr/index.js", function(exports, require, module){

/**
 * XMLHttpRequest / ActiveXObject
 *
 * example:
 *
 *        var req = xhr();
 *
 * @return {Object}
 */

module.exports = function(){
  if (window.XMLHttpRequest) return new XMLHttpRequest();
  try{ return new ActiveXObject('msxml2.xmlhttp.6.0'); } catch(e){}
  try{ return new ActiveXObject('msxml2.xmlhttp.3.0'); } catch(e){}
  try{ return new ActiveXObject('msxml2.xmlhttp'); } catch(e){}
};

});
require.register("matthewp-xhr/index.js", function(exports, require, module){
var forIn = require('for-in'),
    xobj = require('xhr'),
    XhrError = require('xhrerror');

function noop() { }

function xhr(options, callback, errback) {
  var req = xobj();

  if(Object.prototype.toString.call(options) == '[object String]') {
    options = { url: options };
  }

  req.open(options.method || 'GET', options.url, true);

  if(options.credentials) {
    req.withCredentials = true;
  }

  forIn(options.headers || {}, function (value, key) {
    req.setRequestHeader(key, value);
  });
  
  req.onreadystatechange = function() {  
    if(req.readyState != 4) return;
    
    if([
      200, 
      304, 
      0
    ].indexOf(req.status) === -1) {
      (errback || noop)(new XhrError('Server responded with a status of ' + req.status, req.status));
    } else {
      (callback || noop)(req);
    }
  };

  req.send(options.data || void 0);
}

module.exports = xhr;

});
require.alias("matthewp-xhr/index.js", "my-app/deps/xhr/index.js");
require.alias("matthewp-xhr/index.js", "my-app/deps/xhr/index.js");
require.alias("matthewp-xhr/index.js", "xhr/index.js");
require.alias("matthewp-xhrerror/index.js", "matthewp-xhr/deps/xhrerror/index.js");
require.alias("matthewp-xhrerror/index.js", "matthewp-xhr/deps/xhrerror/index.js");
require.alias("yields-xhr/index.js", "matthewp-xhrerror/deps/xhr/index.js");

require.alias("matthewp-xhrerror/index.js", "matthewp-xhrerror/index.js");

require.alias("kewah-for-in/index.js", "matthewp-xhr/deps/for-in/index.js");

require.alias("yields-xhr/index.js", "matthewp-xhr/deps/xhr/index.js");

require.alias("matthewp-xhr/index.js", "matthewp-xhr/index.js");

