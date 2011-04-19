window.HashRegexRouter = (function () {
  var Singleton = function () {
    this.routes = _([]);
  };
  Singleton.prototype.match = function (route_or_array) {
    if (typeof route_or_array === 'Array') {
      _(route_or_array).each(function (r) {
        this.match(r);
      });
    } else {
      this.routes.push(route_or_array);
    }

    return this;
  };
  Singleton.prototype.hash_change_handler = function () {
    var route_not_yet_found, hash;

    route_not_yet_found = true;
    hash = window.location.hash;

    this.routes.each(function (route) {
      var matches, callback_arguments;
      if (route_not_yet_found) {
        matches = hash.match(route.regex);
        if (matches) {
          callback_arguments = _(matches).rest();
          runnable_callback = function () {
            var args = typeof arguments[0] === 'undefined' ? callback_arguments : arguments[0];
            return route.callback.apply(route.callback, args);
          };
          if ('before' in route) {
            route.before();
          }
          if ('around' in route) {
            route.around(route.callback, callback_arguments, runnable_callback);
          } else {
            route.callback.apply(route.callback, callback_arguments);
          }
          if ('after' in route) {
            route.after();
          }
          route_not_yet_found = false;
        }
      }
    });
  };
  Singleton.prototype.start = function () {
    var self;
    self = this;

    jQuery(document).ready(function () {
      jQuery(window).hashchange(function () {
        self.hash_change_handler();
      });
    });
    this.hash_change_handler();
  };

  return new Singleton();
})();
