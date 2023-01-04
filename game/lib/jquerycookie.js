//  Jquery cookie
//  Write by Trac Quang Hoa, 2018

/**
 * Coookie constructor
 * @param {string} name Cookie name (required)
 * @param {string} value Cookie value (required)
 * @param {Date | number} expires optional-If expires is a date then it will be treated as expire data of the cookie.
 *                    If expires is a number then it is the time in second that the cookie will be expired after that.
 * @param {string} path Path that cookie belongs to (optional)
 * @param {string} domain optional
 * @param {string} secure optional
 */
function Cookie(name, value, expires, path, domain, secure) {
    this.name = name;
    this.value = value;
    this.expires = expires;
    this.path = path;
    this.domain = domain;
    this.secure = secure;
}

Cookie.prototype.toString = function () {
    var cookieStr = this.name + '=' + encodeURIComponent(this.value) + ';';

    if (this.path) {
        cookieStr += (' path=' + this.path + ';');
    }

    if (this.expires) {
        var expireDate;

        if (this.expires instanceof Date) {
            expireDate = this.expires;
        } else {
            expireDate = new Date(new Date().getTime() + this.expires * 1000);
        }

        cookieStr += (' expires=' + expireDate.toUTCString() + ';');
    }

    if (this.domain) {
        cookieStr += (' domain=' + this.domain + ';');
    }

    if (this.secure) {
        cookieStr += ' secure;';
    }

    return cookieStr;
};

(function ($) {

    $.cookie = {

        /**
         * Add a new cookie.
         * If cookie parameter is a Cookie object then other parameters will be ingored,
         * otherwise cookie parameter will be treated as cookie name.
         * @param {Cookie | string} cookie required
         * @param {string} value required if cookie is the cookie's name
         * @param {Date | number} expires optional
         * @param {string} path optional
         * @param {string} domain optional
         * @param {boolean} secure optional
         */
        add: function (cookie, value, expires, path, domain, secure) {
            var cookieObj;
            if (cookie instanceof Cookie) {
                cookieObj = cookie;
            } else {
                cookieObj = new Cookie(cookie, value, expires, path, domain, secure);
            }

            document.cookie = cookieObj.toString();
        },

        /**
         * Delete a cookie.
         * If cookie parameter is a Cookie object then other parameters will be ingored,
         * otherwise cookie parameter will be treated as cookie name.
         * @param {Cookie | string} cookie Cookie object or cookie name (required)
         * @param {string} path Path that cookie belongs to (optional)
         * @param {string} domain optional
         * @param {boolean} secure optional
         */
        del: function (cookie, path, domain, secure) {
            var cookieObj;
            if (cookie instanceof Cookie) {
                cookieObj = $.extend({ expires: new Date(0) }, cookie);
            } else {
                cookieObj = new Cookie(cookie, '', new Date(0), path, domain, secure);
            }

            document.cookie = cookieObj.toString();
        },

        /**
         * If name is passed then the function will get cookie by cookie name
         * else it will get all cookies in an array
         * @param {string} name Cookie name (optional)
         */
        get: function (name) {

            // Get cookie by name
            if (name) {
                var c;
                if (document.cookie.length > 0) {
                    for (c of document.cookie.split(';')) {
                        var nv = c.split('=');
                        if (nv[0].trim() === name) {
                            return decodeURIComponent(nv[1]);
                        }
                    }
                }

                return null;
            } else {
                // Get all cookies
                var cookies = [], c;
                if (document.cookie.length > 0) {
                    for (c of document.cookie.split(';')) {
                        var cookie = {}, nv = c.split('=');
                        cookie[nv[0].trim()] = decodeURIComponent(nv[1]);
                        cookies.push(cookie);
                    }
                }

                return cookies;
            }
        },

        /**
         * Check if a cookie exists
         * @param {string} name Cookie name (required)
         */
        exist: function (name) {
            var c, items = document.cookie.split(';');
            for (c of items) {
                var nv = c.split('=');
                if (nv[0].trim() === name) {
                    return true;
                }
            }

            return false;
        }
    }
})(jQuery);