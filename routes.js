window.HashRegexRouter = new function () {
  var self = this
  var routes = _([])

  self.match = function (route) {
    if (typeof route === 'Array') {
      _(route).each(function (r) {
        self.match(r)
      })
    } else {
      routes.push(route)
    }

    return self
  }

  self.start = function () {
    var handler

    handler = function () {
      var route_not_yet_found, hash

      route_not_yet_found = true
      hash = window.location.hash

      routes.each(function (route) {
        var matches, callback_arguments
        if (route_not_yet_found) {
          matches = hash.match(route.regex)
          if (matches) {
            callback_arguments = _(matches).rest()
            if ('before' in route) {
              route.before()
            }
            if ('around' in route) {
              route.around(route.callback, _(matches).rest())
            } else {
              route.callback.apply(route.callback, _(matches).rest())
            }
            if ('after' in route) {
              route.after()
            }
            route_not_yet_found = false;
          }
        }
      })
    }
    jQuery(document).ready(function () {
      jQuery(window).hashchange(handler)
    })
    handler();
  }
}
