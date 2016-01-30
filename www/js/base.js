/**
 * Log something, if possible.
 */
function log() {
    if (console && console.log) {
        console.log.apply(console, Array.prototype.slice.call(arguments));
    }
}

/**
 * Class extender for Object.create -use
 *
 * @param cls
 * @param extension
 * @returns {cls}
 */
function extend(cls, extension) {
    var object = Object.create(cls);

    // Copy properties
    for (var key in extension) {
        if (extension.hasOwnProperty(key) || object[key] === "undefined") {
            object[key] = extension[key];
        }
    }

    object.super = function _super() {
        return cls;
    };

    return object;
}

/**
 * Base "class" that implements .create -method and calls .initialize()
 * of the child classes after creating the object.
 */
var Class = extend(Object, {
    create: function () {
        var _this = Object.create(this);
        if (_this.initialize) {
            var args = Array.prototype.slice.apply(arguments);
            _this.initialize.apply(_this, args);
        }
        return _this;
    }
});

/**
 * Rate limit a function call, but execute all calls
 *
 * @param {Function} fn Function to wrap
 * @param {Number} wait Milliseconds between executions
 * @returns {Function} Rate-limited wrapper to fn
 */
function throttle(fn, wait) {
    var _queue = [];
    var _running = false;

    function _call(scope, args) {
        _running = true;
        fn.apply(scope, args);

        setTimeout(function () {
            if (_queue.length) {
                var next = _queue.shift();
                _call(next.scope, next.args);
            } else {
                _running = false;
            }
        }, wait);
    }

    return function () {
        var args = Array.prototype.slice.call(arguments);
        var _this = this;

        if (_running) {
            _queue.push({scope: _this, args: args});
        } else {
            _call(_this, args);
        }
    };
}

/**
 * http://stackoverflow.com/a/7228322
 * @param min
 * @param max
 * @returns {number}
 */
function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function append(oldList, newList) {
    var i, count;

    var result = [];
    for (i = 0, count = oldList.length; i < count; i += 1) {
        result.push(oldList[i]);
    }
    for (i = 0, count = newList.length; i < count; i += 1) {
        result.push(newList[i]);
    }

    return result;
}

/**
 * Return a random array entry
 * @param choices
 * @returns {*}
 */
function choose(choices) {
    var index = randBetween(0, choices.length-1);

    return choices[index];
}

/**
 * Pick a random item from a list of choices, where each choice is an
 * object with rarity and result -properties
 * @param choices
 */
function pick(choices) {
    var i, count, item, chance;

    var random = Math.random();

    // Figure out the sum of 1/rarity
    var rarityTotal = 0;
    for (i = 0, count = choices.length; i < count; i += 1) {
        item = choices[i];
        item.fraction = 1 / choices[i].rarity;
        rarityTotal += item.fraction;
    }

    // Find the random choice taking into account rarity
    var sum = 0;
    for (i = 0, count = choices.length; i < count; i += 1) {
        item = choices[i];

        // The chance of this item being selected, 0-1
        chance = item.fraction / rarityTotal;

        sum += chance;
        if (random < sum) {
            return item.result;
        }
    }

    // Shouldn't happen, but maybe in some rare cases?
    return item.result;
}

/**
 * Replace a tag in the text with a value
 *
 * @param text
 * @param tag
 * @param value
 * @returns {String}
 */
function replaceTag(text, tag, value) {
    return text.replace("{" + tag + "}", value)
}

/**
 * Convenient string templating, e.g. T("Hello, {name}", {name: "World"})
 *
 * @param template
 * @param params
 * @returns {String}
 */
function T(template, params) {
    if (template === null || template === undefined) {
        return undefined;
    }

    var result = template;

    for (var key in params) {
        result = replaceTag(result, key, params[key]);
    }

    return result;
}

/**
 * http://stackoverflow.com/a/30810322
 * @param text
 */
function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}
