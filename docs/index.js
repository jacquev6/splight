(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* global Modernizr */
const $ = global.jQuery = require('jquery')
require('bootstrap')

const randomizeCanvas = require('./randomize_canvas.bc').randomize_canvas

$(function () {
  $('.sp-modern').removeClass('sp-loading')

  if (Modernizr.canvas) {
    $('canvas[data-sp-random-seed]').each(function () {
      const c = $(this)
      randomizeCanvas({
        canvas: this,
        seed: c.data('sp-random-seed'),
        width: c.attr('width'),
        height: c.attr('height')
      })
    })
  }
})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./randomize_canvas.bc":7,"bootstrap":2,"jquery":5}],2:[function(require,module,exports){
/*!
  * Bootstrap v4.1.1 (https://getbootstrap.com/)
  * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
  (factory((global.bootstrap = {}),global.jQuery,global.Popper));
}(this, (function (exports,$,Popper) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Util = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Private TransitionEnd Helpers
     * ------------------------------------------------------------------------
     */
    var TRANSITION_END = 'transitionend';
    var MAX_UID = 1000000;
    var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

    function toType(obj) {
      return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    }

    function getSpecialTransitionEndEvent() {
      return {
        bindType: TRANSITION_END,
        delegateType: TRANSITION_END,
        handle: function handle(event) {
          if ($$$1(event.target).is(this)) {
            return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
          }

          return undefined; // eslint-disable-line no-undefined
        }
      };
    }

    function transitionEndEmulator(duration) {
      var _this = this;

      var called = false;
      $$$1(this).one(Util.TRANSITION_END, function () {
        called = true;
      });
      setTimeout(function () {
        if (!called) {
          Util.triggerTransitionEnd(_this);
        }
      }, duration);
      return this;
    }

    function setTransitionEndSupport() {
      $$$1.fn.emulateTransitionEnd = transitionEndEmulator;
      $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
    /**
     * --------------------------------------------------------------------------
     * Public Util Api
     * --------------------------------------------------------------------------
     */


    var Util = {
      TRANSITION_END: 'bsTransitionEnd',
      getUID: function getUID(prefix) {
        do {
          // eslint-disable-next-line no-bitwise
          prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
        } while (document.getElementById(prefix));

        return prefix;
      },
      getSelectorFromElement: function getSelectorFromElement(element) {
        var selector = element.getAttribute('data-target');

        if (!selector || selector === '#') {
          selector = element.getAttribute('href') || '';
        }

        try {
          var $selector = $$$1(document).find(selector);
          return $selector.length > 0 ? selector : null;
        } catch (err) {
          return null;
        }
      },
      getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
        if (!element) {
          return 0;
        } // Get transition-duration of the element


        var transitionDuration = $$$1(element).css('transition-duration');
        var floatTransitionDuration = parseFloat(transitionDuration); // Return 0 if element or transition duration is not found

        if (!floatTransitionDuration) {
          return 0;
        } // If multiple durations are defined, take the first


        transitionDuration = transitionDuration.split(',')[0];
        return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;
      },
      reflow: function reflow(element) {
        return element.offsetHeight;
      },
      triggerTransitionEnd: function triggerTransitionEnd(element) {
        $$$1(element).trigger(TRANSITION_END);
      },
      // TODO: Remove in v5
      supportsTransitionEnd: function supportsTransitionEnd() {
        return Boolean(TRANSITION_END);
      },
      isElement: function isElement(obj) {
        return (obj[0] || obj).nodeType;
      },
      typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
        for (var property in configTypes) {
          if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
            var expectedTypes = configTypes[property];
            var value = config[property];
            var valueType = value && Util.isElement(value) ? 'element' : toType(value);

            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
            }
          }
        }
      }
    };
    setTransitionEndSupport();
    return Util;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Alert = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'alert';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.alert';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var Selector = {
      DISMISS: '[data-dismiss="alert"]'
    };
    var Event = {
      CLOSE: "close" + EVENT_KEY,
      CLOSED: "closed" + EVENT_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      ALERT: 'alert',
      FADE: 'fade',
      SHOW: 'show'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Alert =
    /*#__PURE__*/
    function () {
      function Alert(element) {
        this._element = element;
      } // Getters


      var _proto = Alert.prototype;

      // Public
      _proto.close = function close(element) {
        var rootElement = this._element;

        if (element) {
          rootElement = this._getRootElement(element);
        }

        var customEvent = this._triggerCloseEvent(rootElement);

        if (customEvent.isDefaultPrevented()) {
          return;
        }

        this._removeElement(rootElement);
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        this._element = null;
      }; // Private


      _proto._getRootElement = function _getRootElement(element) {
        var selector = Util.getSelectorFromElement(element);
        var parent = false;

        if (selector) {
          parent = $$$1(selector)[0];
        }

        if (!parent) {
          parent = $$$1(element).closest("." + ClassName.ALERT)[0];
        }

        return parent;
      };

      _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
        var closeEvent = $$$1.Event(Event.CLOSE);
        $$$1(element).trigger(closeEvent);
        return closeEvent;
      };

      _proto._removeElement = function _removeElement(element) {
        var _this = this;

        $$$1(element).removeClass(ClassName.SHOW);

        if (!$$$1(element).hasClass(ClassName.FADE)) {
          this._destroyElement(element);

          return;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(element);
        $$$1(element).one(Util.TRANSITION_END, function (event) {
          return _this._destroyElement(element, event);
        }).emulateTransitionEnd(transitionDuration);
      };

      _proto._destroyElement = function _destroyElement(element) {
        $$$1(element).detach().trigger(Event.CLOSED).remove();
      }; // Static


      Alert._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var $element = $$$1(this);
          var data = $element.data(DATA_KEY);

          if (!data) {
            data = new Alert(this);
            $element.data(DATA_KEY, data);
          }

          if (config === 'close') {
            data[config](this);
          }
        });
      };

      Alert._handleDismiss = function _handleDismiss(alertInstance) {
        return function (event) {
          if (event) {
            event.preventDefault();
          }

          alertInstance.close(this);
        };
      };

      _createClass(Alert, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return Alert;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Alert._jQueryInterface;
    $$$1.fn[NAME].Constructor = Alert;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Alert._jQueryInterface;
    };

    return Alert;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Button = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'button';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.button';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var ClassName = {
      ACTIVE: 'active',
      BUTTON: 'btn',
      FOCUS: 'focus'
    };
    var Selector = {
      DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
      DATA_TOGGLE: '[data-toggle="buttons"]',
      INPUT: 'input',
      ACTIVE: '.active',
      BUTTON: '.btn'
    };
    var Event = {
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
      FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY + DATA_API_KEY + " " + ("blur" + EVENT_KEY + DATA_API_KEY)
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Button =
    /*#__PURE__*/
    function () {
      function Button(element) {
        this._element = element;
      } // Getters


      var _proto = Button.prototype;

      // Public
      _proto.toggle = function toggle() {
        var triggerChangeEvent = true;
        var addAriaPressed = true;
        var rootElement = $$$1(this._element).closest(Selector.DATA_TOGGLE)[0];

        if (rootElement) {
          var input = $$$1(this._element).find(Selector.INPUT)[0];

          if (input) {
            if (input.type === 'radio') {
              if (input.checked && $$$1(this._element).hasClass(ClassName.ACTIVE)) {
                triggerChangeEvent = false;
              } else {
                var activeElement = $$$1(rootElement).find(Selector.ACTIVE)[0];

                if (activeElement) {
                  $$$1(activeElement).removeClass(ClassName.ACTIVE);
                }
              }
            }

            if (triggerChangeEvent) {
              if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
                return;
              }

              input.checked = !$$$1(this._element).hasClass(ClassName.ACTIVE);
              $$$1(input).trigger('change');
            }

            input.focus();
            addAriaPressed = false;
          }
        }

        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !$$$1(this._element).hasClass(ClassName.ACTIVE));
        }

        if (triggerChangeEvent) {
          $$$1(this._element).toggleClass(ClassName.ACTIVE);
        }
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        this._element = null;
      }; // Static


      Button._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          if (!data) {
            data = new Button(this);
            $$$1(this).data(DATA_KEY, data);
          }

          if (config === 'toggle') {
            data[config]();
          }
        });
      };

      _createClass(Button, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return Button;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      event.preventDefault();
      var button = event.target;

      if (!$$$1(button).hasClass(ClassName.BUTTON)) {
        button = $$$1(button).closest(Selector.BUTTON);
      }

      Button._jQueryInterface.call($$$1(button), 'toggle');
    }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      var button = $$$1(event.target).closest(Selector.BUTTON)[0];
      $$$1(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Button._jQueryInterface;
    $$$1.fn[NAME].Constructor = Button;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Button._jQueryInterface;
    };

    return Button;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Carousel = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'carousel';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.carousel';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

    var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

    var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

    var Default = {
      interval: 5000,
      keyboard: true,
      slide: false,
      pause: 'hover',
      wrap: true
    };
    var DefaultType = {
      interval: '(number|boolean)',
      keyboard: 'boolean',
      slide: '(boolean|string)',
      pause: '(string|boolean)',
      wrap: 'boolean'
    };
    var Direction = {
      NEXT: 'next',
      PREV: 'prev',
      LEFT: 'left',
      RIGHT: 'right'
    };
    var Event = {
      SLIDE: "slide" + EVENT_KEY,
      SLID: "slid" + EVENT_KEY,
      KEYDOWN: "keydown" + EVENT_KEY,
      MOUSEENTER: "mouseenter" + EVENT_KEY,
      MOUSELEAVE: "mouseleave" + EVENT_KEY,
      TOUCHEND: "touchend" + EVENT_KEY,
      LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      CAROUSEL: 'carousel',
      ACTIVE: 'active',
      SLIDE: 'slide',
      RIGHT: 'carousel-item-right',
      LEFT: 'carousel-item-left',
      NEXT: 'carousel-item-next',
      PREV: 'carousel-item-prev',
      ITEM: 'carousel-item'
    };
    var Selector = {
      ACTIVE: '.active',
      ACTIVE_ITEM: '.active.carousel-item',
      ITEM: '.carousel-item',
      NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
      INDICATORS: '.carousel-indicators',
      DATA_SLIDE: '[data-slide], [data-slide-to]',
      DATA_RIDE: '[data-ride="carousel"]'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Carousel =
    /*#__PURE__*/
    function () {
      function Carousel(element, config) {
        this._items = null;
        this._interval = null;
        this._activeElement = null;
        this._isPaused = false;
        this._isSliding = false;
        this.touchTimeout = null;
        this._config = this._getConfig(config);
        this._element = $$$1(element)[0];
        this._indicatorsElement = $$$1(this._element).find(Selector.INDICATORS)[0];

        this._addEventListeners();
      } // Getters


      var _proto = Carousel.prototype;

      // Public
      _proto.next = function next() {
        if (!this._isSliding) {
          this._slide(Direction.NEXT);
        }
      };

      _proto.nextWhenVisible = function nextWhenVisible() {
        // Don't call next when the page isn't visible
        // or the carousel or its parent isn't visible
        if (!document.hidden && $$$1(this._element).is(':visible') && $$$1(this._element).css('visibility') !== 'hidden') {
          this.next();
        }
      };

      _proto.prev = function prev() {
        if (!this._isSliding) {
          this._slide(Direction.PREV);
        }
      };

      _proto.pause = function pause(event) {
        if (!event) {
          this._isPaused = true;
        }

        if ($$$1(this._element).find(Selector.NEXT_PREV)[0]) {
          Util.triggerTransitionEnd(this._element);
          this.cycle(true);
        }

        clearInterval(this._interval);
        this._interval = null;
      };

      _proto.cycle = function cycle(event) {
        if (!event) {
          this._isPaused = false;
        }

        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }

        if (this._config.interval && !this._isPaused) {
          this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
        }
      };

      _proto.to = function to(index) {
        var _this = this;

        this._activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

        var activeIndex = this._getItemIndex(this._activeElement);

        if (index > this._items.length - 1 || index < 0) {
          return;
        }

        if (this._isSliding) {
          $$$1(this._element).one(Event.SLID, function () {
            return _this.to(index);
          });
          return;
        }

        if (activeIndex === index) {
          this.pause();
          this.cycle();
          return;
        }

        var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

        this._slide(direction, this._items[index]);
      };

      _proto.dispose = function dispose() {
        $$$1(this._element).off(EVENT_KEY);
        $$$1.removeData(this._element, DATA_KEY);
        this._items = null;
        this._config = null;
        this._element = null;
        this._interval = null;
        this._isPaused = null;
        this._isSliding = null;
        this._activeElement = null;
        this._indicatorsElement = null;
      }; // Private


      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default, config);
        Util.typeCheckConfig(NAME, config, DefaultType);
        return config;
      };

      _proto._addEventListeners = function _addEventListeners() {
        var _this2 = this;

        if (this._config.keyboard) {
          $$$1(this._element).on(Event.KEYDOWN, function (event) {
            return _this2._keydown(event);
          });
        }

        if (this._config.pause === 'hover') {
          $$$1(this._element).on(Event.MOUSEENTER, function (event) {
            return _this2.pause(event);
          }).on(Event.MOUSELEAVE, function (event) {
            return _this2.cycle(event);
          });

          if ('ontouchstart' in document.documentElement) {
            // If it's a touch-enabled device, mouseenter/leave are fired as
            // part of the mouse compatibility events on first tap - the carousel
            // would stop cycling until user tapped out of it;
            // here, we listen for touchend, explicitly pause the carousel
            // (as if it's the second time we tap on it, mouseenter compat event
            // is NOT fired) and after a timeout (to allow for mouse compatibility
            // events to fire) we explicitly restart cycling
            $$$1(this._element).on(Event.TOUCHEND, function () {
              _this2.pause();

              if (_this2.touchTimeout) {
                clearTimeout(_this2.touchTimeout);
              }

              _this2.touchTimeout = setTimeout(function (event) {
                return _this2.cycle(event);
              }, TOUCHEVENT_COMPAT_WAIT + _this2._config.interval);
            });
          }
        }
      };

      _proto._keydown = function _keydown(event) {
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }

        switch (event.which) {
          case ARROW_LEFT_KEYCODE:
            event.preventDefault();
            this.prev();
            break;

          case ARROW_RIGHT_KEYCODE:
            event.preventDefault();
            this.next();
            break;

          default:
        }
      };

      _proto._getItemIndex = function _getItemIndex(element) {
        this._items = $$$1.makeArray($$$1(element).parent().find(Selector.ITEM));
        return this._items.indexOf(element);
      };

      _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
        var isNextDirection = direction === Direction.NEXT;
        var isPrevDirection = direction === Direction.PREV;

        var activeIndex = this._getItemIndex(activeElement);

        var lastItemIndex = this._items.length - 1;
        var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

        if (isGoingToWrap && !this._config.wrap) {
          return activeElement;
        }

        var delta = direction === Direction.PREV ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this._items.length;
        return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
      };

      _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
        var targetIndex = this._getItemIndex(relatedTarget);

        var fromIndex = this._getItemIndex($$$1(this._element).find(Selector.ACTIVE_ITEM)[0]);

        var slideEvent = $$$1.Event(Event.SLIDE, {
          relatedTarget: relatedTarget,
          direction: eventDirectionName,
          from: fromIndex,
          to: targetIndex
        });
        $$$1(this._element).trigger(slideEvent);
        return slideEvent;
      };

      _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
        if (this._indicatorsElement) {
          $$$1(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

          var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

          if (nextIndicator) {
            $$$1(nextIndicator).addClass(ClassName.ACTIVE);
          }
        }
      };

      _proto._slide = function _slide(direction, element) {
        var _this3 = this;

        var activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

        var activeElementIndex = this._getItemIndex(activeElement);

        var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

        var nextElementIndex = this._getItemIndex(nextElement);

        var isCycling = Boolean(this._interval);
        var directionalClassName;
        var orderClassName;
        var eventDirectionName;

        if (direction === Direction.NEXT) {
          directionalClassName = ClassName.LEFT;
          orderClassName = ClassName.NEXT;
          eventDirectionName = Direction.LEFT;
        } else {
          directionalClassName = ClassName.RIGHT;
          orderClassName = ClassName.PREV;
          eventDirectionName = Direction.RIGHT;
        }

        if (nextElement && $$$1(nextElement).hasClass(ClassName.ACTIVE)) {
          this._isSliding = false;
          return;
        }

        var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

        if (slideEvent.isDefaultPrevented()) {
          return;
        }

        if (!activeElement || !nextElement) {
          // Some weirdness is happening, so we bail
          return;
        }

        this._isSliding = true;

        if (isCycling) {
          this.pause();
        }

        this._setActiveIndicatorElement(nextElement);

        var slidEvent = $$$1.Event(Event.SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });

        if ($$$1(this._element).hasClass(ClassName.SLIDE)) {
          $$$1(nextElement).addClass(orderClassName);
          Util.reflow(nextElement);
          $$$1(activeElement).addClass(directionalClassName);
          $$$1(nextElement).addClass(directionalClassName);
          var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
          $$$1(activeElement).one(Util.TRANSITION_END, function () {
            $$$1(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName.ACTIVE);
            $$$1(activeElement).removeClass(ClassName.ACTIVE + " " + orderClassName + " " + directionalClassName);
            _this3._isSliding = false;
            setTimeout(function () {
              return $$$1(_this3._element).trigger(slidEvent);
            }, 0);
          }).emulateTransitionEnd(transitionDuration);
        } else {
          $$$1(activeElement).removeClass(ClassName.ACTIVE);
          $$$1(nextElement).addClass(ClassName.ACTIVE);
          this._isSliding = false;
          $$$1(this._element).trigger(slidEvent);
        }

        if (isCycling) {
          this.cycle();
        }
      }; // Static


      Carousel._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = _objectSpread({}, Default, $$$1(this).data());

          if (typeof config === 'object') {
            _config = _objectSpread({}, _config, config);
          }

          var action = typeof config === 'string' ? config : _config.slide;

          if (!data) {
            data = new Carousel(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'number') {
            data.to(config);
          } else if (typeof action === 'string') {
            if (typeof data[action] === 'undefined') {
              throw new TypeError("No method named \"" + action + "\"");
            }

            data[action]();
          } else if (_config.interval) {
            data.pause();
            data.cycle();
          }
        });
      };

      Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
        var selector = Util.getSelectorFromElement(this);

        if (!selector) {
          return;
        }

        var target = $$$1(selector)[0];

        if (!target || !$$$1(target).hasClass(ClassName.CAROUSEL)) {
          return;
        }

        var config = _objectSpread({}, $$$1(target).data(), $$$1(this).data());

        var slideIndex = this.getAttribute('data-slide-to');

        if (slideIndex) {
          config.interval = false;
        }

        Carousel._jQueryInterface.call($$$1(target), config);

        if (slideIndex) {
          $$$1(target).data(DATA_KEY).to(slideIndex);
        }

        event.preventDefault();
      };

      _createClass(Carousel, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }]);

      return Carousel;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);
    $$$1(window).on(Event.LOAD_DATA_API, function () {
      $$$1(Selector.DATA_RIDE).each(function () {
        var $carousel = $$$1(this);

        Carousel._jQueryInterface.call($carousel, $carousel.data());
      });
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Carousel._jQueryInterface;
    $$$1.fn[NAME].Constructor = Carousel;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Carousel._jQueryInterface;
    };

    return Carousel;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Collapse = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'collapse';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.collapse';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var Default = {
      toggle: true,
      parent: ''
    };
    var DefaultType = {
      toggle: 'boolean',
      parent: '(string|element)'
    };
    var Event = {
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      SHOW: 'show',
      COLLAPSE: 'collapse',
      COLLAPSING: 'collapsing',
      COLLAPSED: 'collapsed'
    };
    var Dimension = {
      WIDTH: 'width',
      HEIGHT: 'height'
    };
    var Selector = {
      ACTIVES: '.show, .collapsing',
      DATA_TOGGLE: '[data-toggle="collapse"]'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Collapse =
    /*#__PURE__*/
    function () {
      function Collapse(element, config) {
        this._isTransitioning = false;
        this._element = element;
        this._config = this._getConfig(config);
        this._triggerArray = $$$1.makeArray($$$1("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
        var tabToggles = $$$1(Selector.DATA_TOGGLE);

        for (var i = 0; i < tabToggles.length; i++) {
          var elem = tabToggles[i];
          var selector = Util.getSelectorFromElement(elem);

          if (selector !== null && $$$1(selector).filter(element).length > 0) {
            this._selector = selector;

            this._triggerArray.push(elem);
          }
        }

        this._parent = this._config.parent ? this._getParent() : null;

        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._element, this._triggerArray);
        }

        if (this._config.toggle) {
          this.toggle();
        }
      } // Getters


      var _proto = Collapse.prototype;

      // Public
      _proto.toggle = function toggle() {
        if ($$$1(this._element).hasClass(ClassName.SHOW)) {
          this.hide();
        } else {
          this.show();
        }
      };

      _proto.show = function show() {
        var _this = this;

        if (this._isTransitioning || $$$1(this._element).hasClass(ClassName.SHOW)) {
          return;
        }

        var actives;
        var activesData;

        if (this._parent) {
          actives = $$$1.makeArray($$$1(this._parent).find(Selector.ACTIVES).filter("[data-parent=\"" + this._config.parent + "\"]"));

          if (actives.length === 0) {
            actives = null;
          }
        }

        if (actives) {
          activesData = $$$1(actives).not(this._selector).data(DATA_KEY);

          if (activesData && activesData._isTransitioning) {
            return;
          }
        }

        var startEvent = $$$1.Event(Event.SHOW);
        $$$1(this._element).trigger(startEvent);

        if (startEvent.isDefaultPrevented()) {
          return;
        }

        if (actives) {
          Collapse._jQueryInterface.call($$$1(actives).not(this._selector), 'hide');

          if (!activesData) {
            $$$1(actives).data(DATA_KEY, null);
          }
        }

        var dimension = this._getDimension();

        $$$1(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);
        this._element.style[dimension] = 0;

        if (this._triggerArray.length > 0) {
          $$$1(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
        }

        this.setTransitioning(true);

        var complete = function complete() {
          $$$1(_this._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);
          _this._element.style[dimension] = '';

          _this.setTransitioning(false);

          $$$1(_this._element).trigger(Event.SHOWN);
        };

        var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        var scrollSize = "scroll" + capitalizedDimension;
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        this._element.style[dimension] = this._element[scrollSize] + "px";
      };

      _proto.hide = function hide() {
        var _this2 = this;

        if (this._isTransitioning || !$$$1(this._element).hasClass(ClassName.SHOW)) {
          return;
        }

        var startEvent = $$$1.Event(Event.HIDE);
        $$$1(this._element).trigger(startEvent);

        if (startEvent.isDefaultPrevented()) {
          return;
        }

        var dimension = this._getDimension();

        this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
        Util.reflow(this._element);
        $$$1(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

        if (this._triggerArray.length > 0) {
          for (var i = 0; i < this._triggerArray.length; i++) {
            var trigger = this._triggerArray[i];
            var selector = Util.getSelectorFromElement(trigger);

            if (selector !== null) {
              var $elem = $$$1(selector);

              if (!$elem.hasClass(ClassName.SHOW)) {
                $$$1(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
              }
            }
          }
        }

        this.setTransitioning(true);

        var complete = function complete() {
          _this2.setTransitioning(false);

          $$$1(_this2._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
        };

        this._element.style[dimension] = '';
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      };

      _proto.setTransitioning = function setTransitioning(isTransitioning) {
        this._isTransitioning = isTransitioning;
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        this._config = null;
        this._parent = null;
        this._element = null;
        this._triggerArray = null;
        this._isTransitioning = null;
      }; // Private


      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default, config);
        config.toggle = Boolean(config.toggle); // Coerce string values

        Util.typeCheckConfig(NAME, config, DefaultType);
        return config;
      };

      _proto._getDimension = function _getDimension() {
        var hasWidth = $$$1(this._element).hasClass(Dimension.WIDTH);
        return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
      };

      _proto._getParent = function _getParent() {
        var _this3 = this;

        var parent = null;

        if (Util.isElement(this._config.parent)) {
          parent = this._config.parent; // It's a jQuery object

          if (typeof this._config.parent.jquery !== 'undefined') {
            parent = this._config.parent[0];
          }
        } else {
          parent = $$$1(this._config.parent)[0];
        }

        var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
        $$$1(parent).find(selector).each(function (i, element) {
          _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
        });
        return parent;
      };

      _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
        if (element) {
          var isOpen = $$$1(element).hasClass(ClassName.SHOW);

          if (triggerArray.length > 0) {
            $$$1(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
          }
        }
      }; // Static


      Collapse._getTargetFromElement = function _getTargetFromElement(element) {
        var selector = Util.getSelectorFromElement(element);
        return selector ? $$$1(selector)[0] : null;
      };

      Collapse._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var $this = $$$1(this);
          var data = $this.data(DATA_KEY);

          var _config = _objectSpread({}, Default, $this.data(), typeof config === 'object' && config ? config : {});

          if (!data && _config.toggle && /show|hide/.test(config)) {
            _config.toggle = false;
          }

          if (!data) {
            data = new Collapse(this, _config);
            $this.data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      _createClass(Collapse, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }]);

      return Collapse;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.currentTarget.tagName === 'A') {
        event.preventDefault();
      }

      var $trigger = $$$1(this);
      var selector = Util.getSelectorFromElement(this);
      $$$1(selector).each(function () {
        var $target = $$$1(this);
        var data = $target.data(DATA_KEY);
        var config = data ? 'toggle' : $trigger.data();

        Collapse._jQueryInterface.call($target, config);
      });
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Collapse._jQueryInterface;
    $$$1.fn[NAME].Constructor = Collapse;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Collapse._jQueryInterface;
    };

    return Collapse;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Dropdown = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'dropdown';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.dropdown';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

    var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

    var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

    var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

    var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

    var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

    var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
    var Event = {
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      CLICK: "click" + EVENT_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
      KEYDOWN_DATA_API: "keydown" + EVENT_KEY + DATA_API_KEY,
      KEYUP_DATA_API: "keyup" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      DISABLED: 'disabled',
      SHOW: 'show',
      DROPUP: 'dropup',
      DROPRIGHT: 'dropright',
      DROPLEFT: 'dropleft',
      MENURIGHT: 'dropdown-menu-right',
      MENULEFT: 'dropdown-menu-left',
      POSITION_STATIC: 'position-static'
    };
    var Selector = {
      DATA_TOGGLE: '[data-toggle="dropdown"]',
      FORM_CHILD: '.dropdown form',
      MENU: '.dropdown-menu',
      NAVBAR_NAV: '.navbar-nav',
      VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
    };
    var AttachmentMap = {
      TOP: 'top-start',
      TOPEND: 'top-end',
      BOTTOM: 'bottom-start',
      BOTTOMEND: 'bottom-end',
      RIGHT: 'right-start',
      RIGHTEND: 'right-end',
      LEFT: 'left-start',
      LEFTEND: 'left-end'
    };
    var Default = {
      offset: 0,
      flip: true,
      boundary: 'scrollParent',
      reference: 'toggle',
      display: 'dynamic'
    };
    var DefaultType = {
      offset: '(number|string|function)',
      flip: 'boolean',
      boundary: '(string|element)',
      reference: '(string|element)',
      display: 'string'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Dropdown =
    /*#__PURE__*/
    function () {
      function Dropdown(element, config) {
        this._element = element;
        this._popper = null;
        this._config = this._getConfig(config);
        this._menu = this._getMenuElement();
        this._inNavbar = this._detectNavbar();

        this._addEventListeners();
      } // Getters


      var _proto = Dropdown.prototype;

      // Public
      _proto.toggle = function toggle() {
        if (this._element.disabled || $$$1(this._element).hasClass(ClassName.DISABLED)) {
          return;
        }

        var parent = Dropdown._getParentFromElement(this._element);

        var isActive = $$$1(this._menu).hasClass(ClassName.SHOW);

        Dropdown._clearMenus();

        if (isActive) {
          return;
        }

        var relatedTarget = {
          relatedTarget: this._element
        };
        var showEvent = $$$1.Event(Event.SHOW, relatedTarget);
        $$$1(parent).trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
          return;
        } // Disable totally Popper.js for Dropdown in Navbar


        if (!this._inNavbar) {
          /**
           * Check for Popper dependency
           * Popper - https://popper.js.org
           */
          if (typeof Popper === 'undefined') {
            throw new TypeError('Bootstrap dropdown require Popper.js (https://popper.js.org)');
          }

          var referenceElement = this._element;

          if (this._config.reference === 'parent') {
            referenceElement = parent;
          } else if (Util.isElement(this._config.reference)) {
            referenceElement = this._config.reference; // Check if it's jQuery element

            if (typeof this._config.reference.jquery !== 'undefined') {
              referenceElement = this._config.reference[0];
            }
          } // If boundary is not `scrollParent`, then set position to `static`
          // to allow the menu to "escape" the scroll parent's boundaries
          // https://github.com/twbs/bootstrap/issues/24251


          if (this._config.boundary !== 'scrollParent') {
            $$$1(parent).addClass(ClassName.POSITION_STATIC);
          }

          this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
        } // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


        if ('ontouchstart' in document.documentElement && $$$1(parent).closest(Selector.NAVBAR_NAV).length === 0) {
          $$$1(document.body).children().on('mouseover', null, $$$1.noop);
        }

        this._element.focus();

        this._element.setAttribute('aria-expanded', true);

        $$$1(this._menu).toggleClass(ClassName.SHOW);
        $$$1(parent).toggleClass(ClassName.SHOW).trigger($$$1.Event(Event.SHOWN, relatedTarget));
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        $$$1(this._element).off(EVENT_KEY);
        this._element = null;
        this._menu = null;

        if (this._popper !== null) {
          this._popper.destroy();

          this._popper = null;
        }
      };

      _proto.update = function update() {
        this._inNavbar = this._detectNavbar();

        if (this._popper !== null) {
          this._popper.scheduleUpdate();
        }
      }; // Private


      _proto._addEventListeners = function _addEventListeners() {
        var _this = this;

        $$$1(this._element).on(Event.CLICK, function (event) {
          event.preventDefault();
          event.stopPropagation();

          _this.toggle();
        });
      };

      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, this.constructor.Default, $$$1(this._element).data(), config);
        Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
        return config;
      };

      _proto._getMenuElement = function _getMenuElement() {
        if (!this._menu) {
          var parent = Dropdown._getParentFromElement(this._element);

          this._menu = $$$1(parent).find(Selector.MENU)[0];
        }

        return this._menu;
      };

      _proto._getPlacement = function _getPlacement() {
        var $parentDropdown = $$$1(this._element).parent();
        var placement = AttachmentMap.BOTTOM; // Handle dropup

        if ($parentDropdown.hasClass(ClassName.DROPUP)) {
          placement = AttachmentMap.TOP;

          if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
            placement = AttachmentMap.TOPEND;
          }
        } else if ($parentDropdown.hasClass(ClassName.DROPRIGHT)) {
          placement = AttachmentMap.RIGHT;
        } else if ($parentDropdown.hasClass(ClassName.DROPLEFT)) {
          placement = AttachmentMap.LEFT;
        } else if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.BOTTOMEND;
        }

        return placement;
      };

      _proto._detectNavbar = function _detectNavbar() {
        return $$$1(this._element).closest('.navbar').length > 0;
      };

      _proto._getPopperConfig = function _getPopperConfig() {
        var _this2 = this;

        var offsetConf = {};

        if (typeof this._config.offset === 'function') {
          offsetConf.fn = function (data) {
            data.offsets = _objectSpread({}, data.offsets, _this2._config.offset(data.offsets) || {});
            return data;
          };
        } else {
          offsetConf.offset = this._config.offset;
        }

        var popperConfig = {
          placement: this._getPlacement(),
          modifiers: {
            offset: offsetConf,
            flip: {
              enabled: this._config.flip
            },
            preventOverflow: {
              boundariesElement: this._config.boundary
            }
          } // Disable Popper.js if we have a static display

        };

        if (this._config.display === 'static') {
          popperConfig.modifiers.applyStyle = {
            enabled: false
          };
        }

        return popperConfig;
      }; // Static


      Dropdown._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = typeof config === 'object' ? config : null;

          if (!data) {
            data = new Dropdown(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      Dropdown._clearMenus = function _clearMenus(event) {
        if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
          return;
        }

        var toggles = $$$1.makeArray($$$1(Selector.DATA_TOGGLE));

        for (var i = 0; i < toggles.length; i++) {
          var parent = Dropdown._getParentFromElement(toggles[i]);

          var context = $$$1(toggles[i]).data(DATA_KEY);
          var relatedTarget = {
            relatedTarget: toggles[i]
          };

          if (!context) {
            continue;
          }

          var dropdownMenu = context._menu;

          if (!$$$1(parent).hasClass(ClassName.SHOW)) {
            continue;
          }

          if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $$$1.contains(parent, event.target)) {
            continue;
          }

          var hideEvent = $$$1.Event(Event.HIDE, relatedTarget);
          $$$1(parent).trigger(hideEvent);

          if (hideEvent.isDefaultPrevented()) {
            continue;
          } // If this is a touch-enabled device we remove the extra
          // empty mouseover listeners we added for iOS support


          if ('ontouchstart' in document.documentElement) {
            $$$1(document.body).children().off('mouseover', null, $$$1.noop);
          }

          toggles[i].setAttribute('aria-expanded', 'false');
          $$$1(dropdownMenu).removeClass(ClassName.SHOW);
          $$$1(parent).removeClass(ClassName.SHOW).trigger($$$1.Event(Event.HIDDEN, relatedTarget));
        }
      };

      Dropdown._getParentFromElement = function _getParentFromElement(element) {
        var parent;
        var selector = Util.getSelectorFromElement(element);

        if (selector) {
          parent = $$$1(selector)[0];
        }

        return parent || element.parentNode;
      }; // eslint-disable-next-line complexity


      Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
        // If not input/textarea:
        //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
        // If input/textarea:
        //  - If space key => not a dropdown command
        //  - If key is other than escape
        //    - If key is not up or down => not a dropdown command
        //    - If trigger inside the menu => not a dropdown command
        if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $$$1(event.target).closest(Selector.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.disabled || $$$1(this).hasClass(ClassName.DISABLED)) {
          return;
        }

        var parent = Dropdown._getParentFromElement(this);

        var isActive = $$$1(parent).hasClass(ClassName.SHOW);

        if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
          if (event.which === ESCAPE_KEYCODE) {
            var toggle = $$$1(parent).find(Selector.DATA_TOGGLE)[0];
            $$$1(toggle).trigger('focus');
          }

          $$$1(this).trigger('click');
          return;
        }

        var items = $$$1(parent).find(Selector.VISIBLE_ITEMS).get();

        if (items.length === 0) {
          return;
        }

        var index = items.indexOf(event.target);

        if (event.which === ARROW_UP_KEYCODE && index > 0) {
          // Up
          index--;
        }

        if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
          // Down
          index++;
        }

        if (index < 0) {
          index = 0;
        }

        items[index].focus();
      };

      _createClass(Dropdown, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }, {
        key: "DefaultType",
        get: function get() {
          return DefaultType;
        }
      }]);

      return Dropdown;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API + " " + Event.KEYUP_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault();
      event.stopPropagation();

      Dropdown._jQueryInterface.call($$$1(this), 'toggle');
    }).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
      e.stopPropagation();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Dropdown._jQueryInterface;
    $$$1.fn[NAME].Constructor = Dropdown;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Dropdown._jQueryInterface;
    };

    return Dropdown;
  }($, Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Modal = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'modal';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.modal';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

    var Default = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true
    };
    var DefaultType = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      focus: 'boolean',
      show: 'boolean'
    };
    var Event = {
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      FOCUSIN: "focusin" + EVENT_KEY,
      RESIZE: "resize" + EVENT_KEY,
      CLICK_DISMISS: "click.dismiss" + EVENT_KEY,
      KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY,
      MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY,
      MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
      BACKDROP: 'modal-backdrop',
      OPEN: 'modal-open',
      FADE: 'fade',
      SHOW: 'show'
    };
    var Selector = {
      DIALOG: '.modal-dialog',
      DATA_TOGGLE: '[data-toggle="modal"]',
      DATA_DISMISS: '[data-dismiss="modal"]',
      FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
      STICKY_CONTENT: '.sticky-top',
      NAVBAR_TOGGLER: '.navbar-toggler'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Modal =
    /*#__PURE__*/
    function () {
      function Modal(element, config) {
        this._config = this._getConfig(config);
        this._element = element;
        this._dialog = $$$1(element).find(Selector.DIALOG)[0];
        this._backdrop = null;
        this._isShown = false;
        this._isBodyOverflowing = false;
        this._ignoreBackdropClick = false;
        this._scrollbarWidth = 0;
      } // Getters


      var _proto = Modal.prototype;

      // Public
      _proto.toggle = function toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      };

      _proto.show = function show(relatedTarget) {
        var _this = this;

        if (this._isTransitioning || this._isShown) {
          return;
        }

        if ($$$1(this._element).hasClass(ClassName.FADE)) {
          this._isTransitioning = true;
        }

        var showEvent = $$$1.Event(Event.SHOW, {
          relatedTarget: relatedTarget
        });
        $$$1(this._element).trigger(showEvent);

        if (this._isShown || showEvent.isDefaultPrevented()) {
          return;
        }

        this._isShown = true;

        this._checkScrollbar();

        this._setScrollbar();

        this._adjustDialog();

        $$$1(document.body).addClass(ClassName.OPEN);

        this._setEscapeEvent();

        this._setResizeEvent();

        $$$1(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
          return _this.hide(event);
        });
        $$$1(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
          $$$1(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
            if ($$$1(event.target).is(_this._element)) {
              _this._ignoreBackdropClick = true;
            }
          });
        });

        this._showBackdrop(function () {
          return _this._showElement(relatedTarget);
        });
      };

      _proto.hide = function hide(event) {
        var _this2 = this;

        if (event) {
          event.preventDefault();
        }

        if (this._isTransitioning || !this._isShown) {
          return;
        }

        var hideEvent = $$$1.Event(Event.HIDE);
        $$$1(this._element).trigger(hideEvent);

        if (!this._isShown || hideEvent.isDefaultPrevented()) {
          return;
        }

        this._isShown = false;
        var transition = $$$1(this._element).hasClass(ClassName.FADE);

        if (transition) {
          this._isTransitioning = true;
        }

        this._setEscapeEvent();

        this._setResizeEvent();

        $$$1(document).off(Event.FOCUSIN);
        $$$1(this._element).removeClass(ClassName.SHOW);
        $$$1(this._element).off(Event.CLICK_DISMISS);
        $$$1(this._dialog).off(Event.MOUSEDOWN_DISMISS);

        if (transition) {
          var transitionDuration = Util.getTransitionDurationFromElement(this._element);
          $$$1(this._element).one(Util.TRANSITION_END, function (event) {
            return _this2._hideModal(event);
          }).emulateTransitionEnd(transitionDuration);
        } else {
          this._hideModal();
        }
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        $$$1(window, document, this._element, this._backdrop).off(EVENT_KEY);
        this._config = null;
        this._element = null;
        this._dialog = null;
        this._backdrop = null;
        this._isShown = null;
        this._isBodyOverflowing = null;
        this._ignoreBackdropClick = null;
        this._scrollbarWidth = null;
      };

      _proto.handleUpdate = function handleUpdate() {
        this._adjustDialog();
      }; // Private


      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default, config);
        Util.typeCheckConfig(NAME, config, DefaultType);
        return config;
      };

      _proto._showElement = function _showElement(relatedTarget) {
        var _this3 = this;

        var transition = $$$1(this._element).hasClass(ClassName.FADE);

        if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
          // Don't move modal's DOM position
          document.body.appendChild(this._element);
        }

        this._element.style.display = 'block';

        this._element.removeAttribute('aria-hidden');

        this._element.scrollTop = 0;

        if (transition) {
          Util.reflow(this._element);
        }

        $$$1(this._element).addClass(ClassName.SHOW);

        if (this._config.focus) {
          this._enforceFocus();
        }

        var shownEvent = $$$1.Event(Event.SHOWN, {
          relatedTarget: relatedTarget
        });

        var transitionComplete = function transitionComplete() {
          if (_this3._config.focus) {
            _this3._element.focus();
          }

          _this3._isTransitioning = false;
          $$$1(_this3._element).trigger(shownEvent);
        };

        if (transition) {
          var transitionDuration = Util.getTransitionDurationFromElement(this._element);
          $$$1(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
        } else {
          transitionComplete();
        }
      };

      _proto._enforceFocus = function _enforceFocus() {
        var _this4 = this;

        $$$1(document).off(Event.FOCUSIN) // Guard against infinite focus loop
        .on(Event.FOCUSIN, function (event) {
          if (document !== event.target && _this4._element !== event.target && $$$1(_this4._element).has(event.target).length === 0) {
            _this4._element.focus();
          }
        });
      };

      _proto._setEscapeEvent = function _setEscapeEvent() {
        var _this5 = this;

        if (this._isShown && this._config.keyboard) {
          $$$1(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
            if (event.which === ESCAPE_KEYCODE) {
              event.preventDefault();

              _this5.hide();
            }
          });
        } else if (!this._isShown) {
          $$$1(this._element).off(Event.KEYDOWN_DISMISS);
        }
      };

      _proto._setResizeEvent = function _setResizeEvent() {
        var _this6 = this;

        if (this._isShown) {
          $$$1(window).on(Event.RESIZE, function (event) {
            return _this6.handleUpdate(event);
          });
        } else {
          $$$1(window).off(Event.RESIZE);
        }
      };

      _proto._hideModal = function _hideModal() {
        var _this7 = this;

        this._element.style.display = 'none';

        this._element.setAttribute('aria-hidden', true);

        this._isTransitioning = false;

        this._showBackdrop(function () {
          $$$1(document.body).removeClass(ClassName.OPEN);

          _this7._resetAdjustments();

          _this7._resetScrollbar();

          $$$1(_this7._element).trigger(Event.HIDDEN);
        });
      };

      _proto._removeBackdrop = function _removeBackdrop() {
        if (this._backdrop) {
          $$$1(this._backdrop).remove();
          this._backdrop = null;
        }
      };

      _proto._showBackdrop = function _showBackdrop(callback) {
        var _this8 = this;

        var animate = $$$1(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

        if (this._isShown && this._config.backdrop) {
          this._backdrop = document.createElement('div');
          this._backdrop.className = ClassName.BACKDROP;

          if (animate) {
            $$$1(this._backdrop).addClass(animate);
          }

          $$$1(this._backdrop).appendTo(document.body);
          $$$1(this._element).on(Event.CLICK_DISMISS, function (event) {
            if (_this8._ignoreBackdropClick) {
              _this8._ignoreBackdropClick = false;
              return;
            }

            if (event.target !== event.currentTarget) {
              return;
            }

            if (_this8._config.backdrop === 'static') {
              _this8._element.focus();
            } else {
              _this8.hide();
            }
          });

          if (animate) {
            Util.reflow(this._backdrop);
          }

          $$$1(this._backdrop).addClass(ClassName.SHOW);

          if (!callback) {
            return;
          }

          if (!animate) {
            callback();
            return;
          }

          var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
          $$$1(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
        } else if (!this._isShown && this._backdrop) {
          $$$1(this._backdrop).removeClass(ClassName.SHOW);

          var callbackRemove = function callbackRemove() {
            _this8._removeBackdrop();

            if (callback) {
              callback();
            }
          };

          if ($$$1(this._element).hasClass(ClassName.FADE)) {
            var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

            $$$1(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
          } else {
            callbackRemove();
          }
        } else if (callback) {
          callback();
        }
      }; // ----------------------------------------------------------------------
      // the following methods are used to handle overflowing modals
      // todo (fat): these should probably be refactored out of modal.js
      // ----------------------------------------------------------------------


      _proto._adjustDialog = function _adjustDialog() {
        var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

        if (!this._isBodyOverflowing && isModalOverflowing) {
          this._element.style.paddingLeft = this._scrollbarWidth + "px";
        }

        if (this._isBodyOverflowing && !isModalOverflowing) {
          this._element.style.paddingRight = this._scrollbarWidth + "px";
        }
      };

      _proto._resetAdjustments = function _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
      };

      _proto._checkScrollbar = function _checkScrollbar() {
        var rect = document.body.getBoundingClientRect();
        this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
        this._scrollbarWidth = this._getScrollbarWidth();
      };

      _proto._setScrollbar = function _setScrollbar() {
        var _this9 = this;

        if (this._isBodyOverflowing) {
          // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
          //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
          // Adjust fixed content padding
          $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
            var actualPadding = $$$1(element)[0].style.paddingRight;
            var calculatedPadding = $$$1(element).css('padding-right');
            $$$1(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
          }); // Adjust sticky content margin

          $$$1(Selector.STICKY_CONTENT).each(function (index, element) {
            var actualMargin = $$$1(element)[0].style.marginRight;
            var calculatedMargin = $$$1(element).css('margin-right');
            $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
          }); // Adjust navbar-toggler margin

          $$$1(Selector.NAVBAR_TOGGLER).each(function (index, element) {
            var actualMargin = $$$1(element)[0].style.marginRight;
            var calculatedMargin = $$$1(element).css('margin-right');
            $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + "px");
          }); // Adjust body padding

          var actualPadding = document.body.style.paddingRight;
          var calculatedPadding = $$$1(document.body).css('padding-right');
          $$$1(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
        }
      };

      _proto._resetScrollbar = function _resetScrollbar() {
        // Restore fixed content padding
        $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
          var padding = $$$1(element).data('padding-right');

          if (typeof padding !== 'undefined') {
            $$$1(element).css('padding-right', padding).removeData('padding-right');
          }
        }); // Restore sticky content and navbar-toggler margin

        $$$1(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
          var margin = $$$1(element).data('margin-right');

          if (typeof margin !== 'undefined') {
            $$$1(element).css('margin-right', margin).removeData('margin-right');
          }
        }); // Restore body padding

        var padding = $$$1(document.body).data('padding-right');

        if (typeof padding !== 'undefined') {
          $$$1(document.body).css('padding-right', padding).removeData('padding-right');
        }
      };

      _proto._getScrollbarWidth = function _getScrollbarWidth() {
        // thx d.walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      }; // Static


      Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = _objectSpread({}, Default, $$$1(this).data(), typeof config === 'object' && config ? config : {});

          if (!data) {
            data = new Modal(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config](relatedTarget);
          } else if (_config.show) {
            data.show(relatedTarget);
          }
        });
      };

      _createClass(Modal, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }]);

      return Modal;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      var _this10 = this;

      var target;
      var selector = Util.getSelectorFromElement(this);

      if (selector) {
        target = $$$1(selector)[0];
      }

      var config = $$$1(target).data(DATA_KEY) ? 'toggle' : _objectSpread({}, $$$1(target).data(), $$$1(this).data());

      if (this.tagName === 'A' || this.tagName === 'AREA') {
        event.preventDefault();
      }

      var $target = $$$1(target).one(Event.SHOW, function (showEvent) {
        if (showEvent.isDefaultPrevented()) {
          // Only register focus restorer if modal will actually get shown
          return;
        }

        $target.one(Event.HIDDEN, function () {
          if ($$$1(_this10).is(':visible')) {
            _this10.focus();
          }
        });
      });

      Modal._jQueryInterface.call($$$1(target), config, this);
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Modal._jQueryInterface;
    $$$1.fn[NAME].Constructor = Modal;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Modal._jQueryInterface;
    };

    return Modal;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tooltip = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'tooltip';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.tooltip';
    var EVENT_KEY = "." + DATA_KEY;
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var CLASS_PREFIX = 'bs-tooltip';
    var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
    var DefaultType = {
      animation: 'boolean',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string',
      delay: '(number|object)',
      html: 'boolean',
      selector: '(string|boolean)',
      placement: '(string|function)',
      offset: '(number|string)',
      container: '(string|element|boolean)',
      fallbackPlacement: '(string|array)',
      boundary: '(string|element)'
    };
    var AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: 'right',
      BOTTOM: 'bottom',
      LEFT: 'left'
    };
    var Default = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: 0,
      container: false,
      fallbackPlacement: 'flip',
      boundary: 'scrollParent'
    };
    var HoverState = {
      SHOW: 'show',
      OUT: 'out'
    };
    var Event = {
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      INSERTED: "inserted" + EVENT_KEY,
      CLICK: "click" + EVENT_KEY,
      FOCUSIN: "focusin" + EVENT_KEY,
      FOCUSOUT: "focusout" + EVENT_KEY,
      MOUSEENTER: "mouseenter" + EVENT_KEY,
      MOUSELEAVE: "mouseleave" + EVENT_KEY
    };
    var ClassName = {
      FADE: 'fade',
      SHOW: 'show'
    };
    var Selector = {
      TOOLTIP: '.tooltip',
      TOOLTIP_INNER: '.tooltip-inner',
      ARROW: '.arrow'
    };
    var Trigger = {
      HOVER: 'hover',
      FOCUS: 'focus',
      CLICK: 'click',
      MANUAL: 'manual'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Tooltip =
    /*#__PURE__*/
    function () {
      function Tooltip(element, config) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)');
        } // private


        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = '';
        this._activeTrigger = {};
        this._popper = null; // Protected

        this.element = element;
        this.config = this._getConfig(config);
        this.tip = null;

        this._setListeners();
      } // Getters


      var _proto = Tooltip.prototype;

      // Public
      _proto.enable = function enable() {
        this._isEnabled = true;
      };

      _proto.disable = function disable() {
        this._isEnabled = false;
      };

      _proto.toggleEnabled = function toggleEnabled() {
        this._isEnabled = !this._isEnabled;
      };

      _proto.toggle = function toggle(event) {
        if (!this._isEnabled) {
          return;
        }

        if (event) {
          var dataKey = this.constructor.DATA_KEY;
          var context = $$$1(event.currentTarget).data(dataKey);

          if (!context) {
            context = new this.constructor(event.currentTarget, this._getDelegateConfig());
            $$$1(event.currentTarget).data(dataKey, context);
          }

          context._activeTrigger.click = !context._activeTrigger.click;

          if (context._isWithActiveTrigger()) {
            context._enter(null, context);
          } else {
            context._leave(null, context);
          }
        } else {
          if ($$$1(this.getTipElement()).hasClass(ClassName.SHOW)) {
            this._leave(null, this);

            return;
          }

          this._enter(null, this);
        }
      };

      _proto.dispose = function dispose() {
        clearTimeout(this._timeout);
        $$$1.removeData(this.element, this.constructor.DATA_KEY);
        $$$1(this.element).off(this.constructor.EVENT_KEY);
        $$$1(this.element).closest('.modal').off('hide.bs.modal');

        if (this.tip) {
          $$$1(this.tip).remove();
        }

        this._isEnabled = null;
        this._timeout = null;
        this._hoverState = null;
        this._activeTrigger = null;

        if (this._popper !== null) {
          this._popper.destroy();
        }

        this._popper = null;
        this.element = null;
        this.config = null;
        this.tip = null;
      };

      _proto.show = function show() {
        var _this = this;

        if ($$$1(this.element).css('display') === 'none') {
          throw new Error('Please use show on visible elements');
        }

        var showEvent = $$$1.Event(this.constructor.Event.SHOW);

        if (this.isWithContent() && this._isEnabled) {
          $$$1(this.element).trigger(showEvent);
          var isInTheDom = $$$1.contains(this.element.ownerDocument.documentElement, this.element);

          if (showEvent.isDefaultPrevented() || !isInTheDom) {
            return;
          }

          var tip = this.getTipElement();
          var tipId = Util.getUID(this.constructor.NAME);
          tip.setAttribute('id', tipId);
          this.element.setAttribute('aria-describedby', tipId);
          this.setContent();

          if (this.config.animation) {
            $$$1(tip).addClass(ClassName.FADE);
          }

          var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

          var attachment = this._getAttachment(placement);

          this.addAttachmentClass(attachment);
          var container = this.config.container === false ? document.body : $$$1(this.config.container);
          $$$1(tip).data(this.constructor.DATA_KEY, this);

          if (!$$$1.contains(this.element.ownerDocument.documentElement, this.tip)) {
            $$$1(tip).appendTo(container);
          }

          $$$1(this.element).trigger(this.constructor.Event.INSERTED);
          this._popper = new Popper(this.element, tip, {
            placement: attachment,
            modifiers: {
              offset: {
                offset: this.config.offset
              },
              flip: {
                behavior: this.config.fallbackPlacement
              },
              arrow: {
                element: Selector.ARROW
              },
              preventOverflow: {
                boundariesElement: this.config.boundary
              }
            },
            onCreate: function onCreate(data) {
              if (data.originalPlacement !== data.placement) {
                _this._handlePopperPlacementChange(data);
              }
            },
            onUpdate: function onUpdate(data) {
              _this._handlePopperPlacementChange(data);
            }
          });
          $$$1(tip).addClass(ClassName.SHOW); // If this is a touch-enabled device we add extra
          // empty mouseover listeners to the body's immediate children;
          // only needed because of broken event delegation on iOS
          // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

          if ('ontouchstart' in document.documentElement) {
            $$$1(document.body).children().on('mouseover', null, $$$1.noop);
          }

          var complete = function complete() {
            if (_this.config.animation) {
              _this._fixTransition();
            }

            var prevHoverState = _this._hoverState;
            _this._hoverState = null;
            $$$1(_this.element).trigger(_this.constructor.Event.SHOWN);

            if (prevHoverState === HoverState.OUT) {
              _this._leave(null, _this);
            }
          };

          if ($$$1(this.tip).hasClass(ClassName.FADE)) {
            var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
            $$$1(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
          } else {
            complete();
          }
        }
      };

      _proto.hide = function hide(callback) {
        var _this2 = this;

        var tip = this.getTipElement();
        var hideEvent = $$$1.Event(this.constructor.Event.HIDE);

        var complete = function complete() {
          if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
            tip.parentNode.removeChild(tip);
          }

          _this2._cleanTipClass();

          _this2.element.removeAttribute('aria-describedby');

          $$$1(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

          if (_this2._popper !== null) {
            _this2._popper.destroy();
          }

          if (callback) {
            callback();
          }
        };

        $$$1(this.element).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          return;
        }

        $$$1(tip).removeClass(ClassName.SHOW); // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support

        if ('ontouchstart' in document.documentElement) {
          $$$1(document.body).children().off('mouseover', null, $$$1.noop);
        }

        this._activeTrigger[Trigger.CLICK] = false;
        this._activeTrigger[Trigger.FOCUS] = false;
        this._activeTrigger[Trigger.HOVER] = false;

        if ($$$1(this.tip).hasClass(ClassName.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(tip);
          $$$1(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }

        this._hoverState = '';
      };

      _proto.update = function update() {
        if (this._popper !== null) {
          this._popper.scheduleUpdate();
        }
      }; // Protected


      _proto.isWithContent = function isWithContent() {
        return Boolean(this.getTitle());
      };

      _proto.addAttachmentClass = function addAttachmentClass(attachment) {
        $$$1(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
      };

      _proto.getTipElement = function getTipElement() {
        this.tip = this.tip || $$$1(this.config.template)[0];
        return this.tip;
      };

      _proto.setContent = function setContent() {
        var $tip = $$$1(this.getTipElement());
        this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());
        $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
      };

      _proto.setElementContent = function setElementContent($element, content) {
        var html = this.config.html;

        if (typeof content === 'object' && (content.nodeType || content.jquery)) {
          // Content is a DOM node or a jQuery
          if (html) {
            if (!$$$1(content).parent().is($element)) {
              $element.empty().append(content);
            }
          } else {
            $element.text($$$1(content).text());
          }
        } else {
          $element[html ? 'html' : 'text'](content);
        }
      };

      _proto.getTitle = function getTitle() {
        var title = this.element.getAttribute('data-original-title');

        if (!title) {
          title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
        }

        return title;
      }; // Private


      _proto._getAttachment = function _getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
      };

      _proto._setListeners = function _setListeners() {
        var _this3 = this;

        var triggers = this.config.trigger.split(' ');
        triggers.forEach(function (trigger) {
          if (trigger === 'click') {
            $$$1(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, function (event) {
              return _this3.toggle(event);
            });
          } else if (trigger !== Trigger.MANUAL) {
            var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
            var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;
            $$$1(_this3.element).on(eventIn, _this3.config.selector, function (event) {
              return _this3._enter(event);
            }).on(eventOut, _this3.config.selector, function (event) {
              return _this3._leave(event);
            });
          }

          $$$1(_this3.element).closest('.modal').on('hide.bs.modal', function () {
            return _this3.hide();
          });
        });

        if (this.config.selector) {
          this.config = _objectSpread({}, this.config, {
            trigger: 'manual',
            selector: ''
          });
        } else {
          this._fixTitle();
        }
      };

      _proto._fixTitle = function _fixTitle() {
        var titleType = typeof this.element.getAttribute('data-original-title');

        if (this.element.getAttribute('title') || titleType !== 'string') {
          this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
          this.element.setAttribute('title', '');
        }
      };

      _proto._enter = function _enter(event, context) {
        var dataKey = this.constructor.DATA_KEY;
        context = context || $$$1(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $$$1(event.currentTarget).data(dataKey, context);
        }

        if (event) {
          context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
        }

        if ($$$1(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
          context._hoverState = HoverState.SHOW;
          return;
        }

        clearTimeout(context._timeout);
        context._hoverState = HoverState.SHOW;

        if (!context.config.delay || !context.config.delay.show) {
          context.show();
          return;
        }

        context._timeout = setTimeout(function () {
          if (context._hoverState === HoverState.SHOW) {
            context.show();
          }
        }, context.config.delay.show);
      };

      _proto._leave = function _leave(event, context) {
        var dataKey = this.constructor.DATA_KEY;
        context = context || $$$1(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $$$1(event.currentTarget).data(dataKey, context);
        }

        if (event) {
          context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
        }

        if (context._isWithActiveTrigger()) {
          return;
        }

        clearTimeout(context._timeout);
        context._hoverState = HoverState.OUT;

        if (!context.config.delay || !context.config.delay.hide) {
          context.hide();
          return;
        }

        context._timeout = setTimeout(function () {
          if (context._hoverState === HoverState.OUT) {
            context.hide();
          }
        }, context.config.delay.hide);
      };

      _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
        for (var trigger in this._activeTrigger) {
          if (this._activeTrigger[trigger]) {
            return true;
          }
        }

        return false;
      };

      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, this.constructor.Default, $$$1(this.element).data(), typeof config === 'object' && config ? config : {});

        if (typeof config.delay === 'number') {
          config.delay = {
            show: config.delay,
            hide: config.delay
          };
        }

        if (typeof config.title === 'number') {
          config.title = config.title.toString();
        }

        if (typeof config.content === 'number') {
          config.content = config.content.toString();
        }

        Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
        return config;
      };

      _proto._getDelegateConfig = function _getDelegateConfig() {
        var config = {};

        if (this.config) {
          for (var key in this.config) {
            if (this.constructor.Default[key] !== this.config[key]) {
              config[key] = this.config[key];
            }
          }
        }

        return config;
      };

      _proto._cleanTipClass = function _cleanTipClass() {
        var $tip = $$$1(this.getTipElement());
        var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

        if (tabClass !== null && tabClass.length > 0) {
          $tip.removeClass(tabClass.join(''));
        }
      };

      _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(data) {
        this._cleanTipClass();

        this.addAttachmentClass(this._getAttachment(data.placement));
      };

      _proto._fixTransition = function _fixTransition() {
        var tip = this.getTipElement();
        var initConfigAnimation = this.config.animation;

        if (tip.getAttribute('x-placement') !== null) {
          return;
        }

        $$$1(tip).removeClass(ClassName.FADE);
        this.config.animation = false;
        this.hide();
        this.show();
        this.config.animation = initConfigAnimation;
      }; // Static


      Tooltip._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = typeof config === 'object' && config;

          if (!data && /dispose|hide/.test(config)) {
            return;
          }

          if (!data) {
            data = new Tooltip(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      _createClass(Tooltip, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }, {
        key: "NAME",
        get: function get() {
          return NAME;
        }
      }, {
        key: "DATA_KEY",
        get: function get() {
          return DATA_KEY;
        }
      }, {
        key: "Event",
        get: function get() {
          return Event;
        }
      }, {
        key: "EVENT_KEY",
        get: function get() {
          return EVENT_KEY;
        }
      }, {
        key: "DefaultType",
        get: function get() {
          return DefaultType;
        }
      }]);

      return Tooltip;
    }();
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    $$$1.fn[NAME] = Tooltip._jQueryInterface;
    $$$1.fn[NAME].Constructor = Tooltip;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tooltip._jQueryInterface;
    };

    return Tooltip;
  }($, Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Popover = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'popover';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.popover';
    var EVENT_KEY = "." + DATA_KEY;
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var CLASS_PREFIX = 'bs-popover';
    var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');

    var Default = _objectSpread({}, Tooltip.Default, {
      placement: 'right',
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
    });

    var DefaultType = _objectSpread({}, Tooltip.DefaultType, {
      content: '(string|element|function)'
    });

    var ClassName = {
      FADE: 'fade',
      SHOW: 'show'
    };
    var Selector = {
      TITLE: '.popover-header',
      CONTENT: '.popover-body'
    };
    var Event = {
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      INSERTED: "inserted" + EVENT_KEY,
      CLICK: "click" + EVENT_KEY,
      FOCUSIN: "focusin" + EVENT_KEY,
      FOCUSOUT: "focusout" + EVENT_KEY,
      MOUSEENTER: "mouseenter" + EVENT_KEY,
      MOUSELEAVE: "mouseleave" + EVENT_KEY
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Popover =
    /*#__PURE__*/
    function (_Tooltip) {
      _inheritsLoose(Popover, _Tooltip);

      function Popover() {
        return _Tooltip.apply(this, arguments) || this;
      }

      var _proto = Popover.prototype;

      // Overrides
      _proto.isWithContent = function isWithContent() {
        return this.getTitle() || this._getContent();
      };

      _proto.addAttachmentClass = function addAttachmentClass(attachment) {
        $$$1(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
      };

      _proto.getTipElement = function getTipElement() {
        this.tip = this.tip || $$$1(this.config.template)[0];
        return this.tip;
      };

      _proto.setContent = function setContent() {
        var $tip = $$$1(this.getTipElement()); // We use append for html objects to maintain js events

        this.setElementContent($tip.find(Selector.TITLE), this.getTitle());

        var content = this._getContent();

        if (typeof content === 'function') {
          content = content.call(this.element);
        }

        this.setElementContent($tip.find(Selector.CONTENT), content);
        $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
      }; // Private


      _proto._getContent = function _getContent() {
        return this.element.getAttribute('data-content') || this.config.content;
      };

      _proto._cleanTipClass = function _cleanTipClass() {
        var $tip = $$$1(this.getTipElement());
        var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

        if (tabClass !== null && tabClass.length > 0) {
          $tip.removeClass(tabClass.join(''));
        }
      }; // Static


      Popover._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = typeof config === 'object' ? config : null;

          if (!data && /destroy|hide/.test(config)) {
            return;
          }

          if (!data) {
            data = new Popover(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      _createClass(Popover, null, [{
        key: "VERSION",
        // Getters
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }, {
        key: "NAME",
        get: function get() {
          return NAME;
        }
      }, {
        key: "DATA_KEY",
        get: function get() {
          return DATA_KEY;
        }
      }, {
        key: "Event",
        get: function get() {
          return Event;
        }
      }, {
        key: "EVENT_KEY",
        get: function get() {
          return EVENT_KEY;
        }
      }, {
        key: "DefaultType",
        get: function get() {
          return DefaultType;
        }
      }]);

      return Popover;
    }(Tooltip);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    $$$1.fn[NAME] = Popover._jQueryInterface;
    $$$1.fn[NAME].Constructor = Popover;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Popover._jQueryInterface;
    };

    return Popover;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var ScrollSpy = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'scrollspy';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.scrollspy';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var Default = {
      offset: 10,
      method: 'auto',
      target: ''
    };
    var DefaultType = {
      offset: 'number',
      method: 'string',
      target: '(string|element)'
    };
    var Event = {
      ACTIVATE: "activate" + EVENT_KEY,
      SCROLL: "scroll" + EVENT_KEY,
      LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      DROPDOWN_ITEM: 'dropdown-item',
      DROPDOWN_MENU: 'dropdown-menu',
      ACTIVE: 'active'
    };
    var Selector = {
      DATA_SPY: '[data-spy="scroll"]',
      ACTIVE: '.active',
      NAV_LIST_GROUP: '.nav, .list-group',
      NAV_LINKS: '.nav-link',
      NAV_ITEMS: '.nav-item',
      LIST_ITEMS: '.list-group-item',
      DROPDOWN: '.dropdown',
      DROPDOWN_ITEMS: '.dropdown-item',
      DROPDOWN_TOGGLE: '.dropdown-toggle'
    };
    var OffsetMethod = {
      OFFSET: 'offset',
      POSITION: 'position'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var ScrollSpy =
    /*#__PURE__*/
    function () {
      function ScrollSpy(element, config) {
        var _this = this;

        this._element = element;
        this._scrollElement = element.tagName === 'BODY' ? window : element;
        this._config = this._getConfig(config);
        this._selector = this._config.target + " " + Selector.NAV_LINKS + "," + (this._config.target + " " + Selector.LIST_ITEMS + ",") + (this._config.target + " " + Selector.DROPDOWN_ITEMS);
        this._offsets = [];
        this._targets = [];
        this._activeTarget = null;
        this._scrollHeight = 0;
        $$$1(this._scrollElement).on(Event.SCROLL, function (event) {
          return _this._process(event);
        });
        this.refresh();

        this._process();
      } // Getters


      var _proto = ScrollSpy.prototype;

      // Public
      _proto.refresh = function refresh() {
        var _this2 = this;

        var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
        var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
        var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
        this._offsets = [];
        this._targets = [];
        this._scrollHeight = this._getScrollHeight();
        var targets = $$$1.makeArray($$$1(this._selector));
        targets.map(function (element) {
          var target;
          var targetSelector = Util.getSelectorFromElement(element);

          if (targetSelector) {
            target = $$$1(targetSelector)[0];
          }

          if (target) {
            var targetBCR = target.getBoundingClientRect();

            if (targetBCR.width || targetBCR.height) {
              // TODO (fat): remove sketch reliance on jQuery position/offset
              return [$$$1(target)[offsetMethod]().top + offsetBase, targetSelector];
            }
          }

          return null;
        }).filter(function (item) {
          return item;
        }).sort(function (a, b) {
          return a[0] - b[0];
        }).forEach(function (item) {
          _this2._offsets.push(item[0]);

          _this2._targets.push(item[1]);
        });
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        $$$1(this._scrollElement).off(EVENT_KEY);
        this._element = null;
        this._scrollElement = null;
        this._config = null;
        this._selector = null;
        this._offsets = null;
        this._targets = null;
        this._activeTarget = null;
        this._scrollHeight = null;
      }; // Private


      _proto._getConfig = function _getConfig(config) {
        config = _objectSpread({}, Default, typeof config === 'object' && config ? config : {});

        if (typeof config.target !== 'string') {
          var id = $$$1(config.target).attr('id');

          if (!id) {
            id = Util.getUID(NAME);
            $$$1(config.target).attr('id', id);
          }

          config.target = "#" + id;
        }

        Util.typeCheckConfig(NAME, config, DefaultType);
        return config;
      };

      _proto._getScrollTop = function _getScrollTop() {
        return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
      };

      _proto._getScrollHeight = function _getScrollHeight() {
        return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      };

      _proto._getOffsetHeight = function _getOffsetHeight() {
        return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
      };

      _proto._process = function _process() {
        var scrollTop = this._getScrollTop() + this._config.offset;

        var scrollHeight = this._getScrollHeight();

        var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

        if (this._scrollHeight !== scrollHeight) {
          this.refresh();
        }

        if (scrollTop >= maxScroll) {
          var target = this._targets[this._targets.length - 1];

          if (this._activeTarget !== target) {
            this._activate(target);
          }

          return;
        }

        if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
          this._activeTarget = null;

          this._clear();

          return;
        }

        for (var i = this._offsets.length; i--;) {
          var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

          if (isActiveTarget) {
            this._activate(this._targets[i]);
          }
        }
      };

      _proto._activate = function _activate(target) {
        this._activeTarget = target;

        this._clear();

        var queries = this._selector.split(','); // eslint-disable-next-line arrow-body-style


        queries = queries.map(function (selector) {
          return selector + "[data-target=\"" + target + "\"]," + (selector + "[href=\"" + target + "\"]");
        });
        var $link = $$$1(queries.join(','));

        if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
          $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
          $link.addClass(ClassName.ACTIVE);
        } else {
          // Set triggered link as active
          $link.addClass(ClassName.ACTIVE); // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

          $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ", " + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE); // Handle special case when .nav-link is inside .nav-item

          $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);
        }

        $$$1(this._scrollElement).trigger(Event.ACTIVATE, {
          relatedTarget: target
        });
      };

      _proto._clear = function _clear() {
        $$$1(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
      }; // Static


      ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          var _config = typeof config === 'object' && config;

          if (!data) {
            data = new ScrollSpy(this, _config);
            $$$1(this).data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      _createClass(ScrollSpy, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "Default",
        get: function get() {
          return Default;
        }
      }]);

      return ScrollSpy;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(window).on(Event.LOAD_DATA_API, function () {
      var scrollSpys = $$$1.makeArray($$$1(Selector.DATA_SPY));

      for (var i = scrollSpys.length; i--;) {
        var $spy = $$$1(scrollSpys[i]);

        ScrollSpy._jQueryInterface.call($spy, $spy.data());
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = ScrollSpy._jQueryInterface;
    $$$1.fn[NAME].Constructor = ScrollSpy;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return ScrollSpy._jQueryInterface;
    };

    return ScrollSpy;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tab = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'tab';
    var VERSION = '4.1.1';
    var DATA_KEY = 'bs.tab';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var Event = {
      HIDE: "hide" + EVENT_KEY,
      HIDDEN: "hidden" + EVENT_KEY,
      SHOW: "show" + EVENT_KEY,
      SHOWN: "shown" + EVENT_KEY,
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
    };
    var ClassName = {
      DROPDOWN_MENU: 'dropdown-menu',
      ACTIVE: 'active',
      DISABLED: 'disabled',
      FADE: 'fade',
      SHOW: 'show'
    };
    var Selector = {
      DROPDOWN: '.dropdown',
      NAV_LIST_GROUP: '.nav, .list-group',
      ACTIVE: '.active',
      ACTIVE_UL: '> li > .active',
      DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
      DROPDOWN_TOGGLE: '.dropdown-toggle',
      DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Tab =
    /*#__PURE__*/
    function () {
      function Tab(element) {
        this._element = element;
      } // Getters


      var _proto = Tab.prototype;

      // Public
      _proto.show = function show() {
        var _this = this;

        if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $$$1(this._element).hasClass(ClassName.ACTIVE) || $$$1(this._element).hasClass(ClassName.DISABLED)) {
          return;
        }

        var target;
        var previous;
        var listElement = $$$1(this._element).closest(Selector.NAV_LIST_GROUP)[0];
        var selector = Util.getSelectorFromElement(this._element);

        if (listElement) {
          var itemSelector = listElement.nodeName === 'UL' ? Selector.ACTIVE_UL : Selector.ACTIVE;
          previous = $$$1.makeArray($$$1(listElement).find(itemSelector));
          previous = previous[previous.length - 1];
        }

        var hideEvent = $$$1.Event(Event.HIDE, {
          relatedTarget: this._element
        });
        var showEvent = $$$1.Event(Event.SHOW, {
          relatedTarget: previous
        });

        if (previous) {
          $$$1(previous).trigger(hideEvent);
        }

        $$$1(this._element).trigger(showEvent);

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
          return;
        }

        if (selector) {
          target = $$$1(selector)[0];
        }

        this._activate(this._element, listElement);

        var complete = function complete() {
          var hiddenEvent = $$$1.Event(Event.HIDDEN, {
            relatedTarget: _this._element
          });
          var shownEvent = $$$1.Event(Event.SHOWN, {
            relatedTarget: previous
          });
          $$$1(previous).trigger(hiddenEvent);
          $$$1(_this._element).trigger(shownEvent);
        };

        if (target) {
          this._activate(target, target.parentNode, complete);
        } else {
          complete();
        }
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        this._element = null;
      }; // Private


      _proto._activate = function _activate(element, container, callback) {
        var _this2 = this;

        var activeElements;

        if (container.nodeName === 'UL') {
          activeElements = $$$1(container).find(Selector.ACTIVE_UL);
        } else {
          activeElements = $$$1(container).children(Selector.ACTIVE);
        }

        var active = activeElements[0];
        var isTransitioning = callback && active && $$$1(active).hasClass(ClassName.FADE);

        var complete = function complete() {
          return _this2._transitionComplete(element, active, callback);
        };

        if (active && isTransitioning) {
          var transitionDuration = Util.getTransitionDurationFromElement(active);
          $$$1(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      };

      _proto._transitionComplete = function _transitionComplete(element, active, callback) {
        if (active) {
          $$$1(active).removeClass(ClassName.SHOW + " " + ClassName.ACTIVE);
          var dropdownChild = $$$1(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

          if (dropdownChild) {
            $$$1(dropdownChild).removeClass(ClassName.ACTIVE);
          }

          if (active.getAttribute('role') === 'tab') {
            active.setAttribute('aria-selected', false);
          }
        }

        $$$1(element).addClass(ClassName.ACTIVE);

        if (element.getAttribute('role') === 'tab') {
          element.setAttribute('aria-selected', true);
        }

        Util.reflow(element);
        $$$1(element).addClass(ClassName.SHOW);

        if (element.parentNode && $$$1(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {
          var dropdownElement = $$$1(element).closest(Selector.DROPDOWN)[0];

          if (dropdownElement) {
            $$$1(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
          }

          element.setAttribute('aria-expanded', true);
        }

        if (callback) {
          callback();
        }
      }; // Static


      Tab._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var $this = $$$1(this);
          var data = $this.data(DATA_KEY);

          if (!data) {
            data = new Tab(this);
            $this.data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError("No method named \"" + config + "\"");
            }

            data[config]();
          }
        });
      };

      _createClass(Tab, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return Tab;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault();

      Tab._jQueryInterface.call($$$1(this), 'show');
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Tab._jQueryInterface;
    $$$1.fn[NAME].Constructor = Tab;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tab._jQueryInterface;
    };

    return Tab;
  }($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.1.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function ($$$1) {
    if (typeof $$$1 === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $$$1.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })($);

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"jquery":5,"popper.js":6}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
module.exports={
  "O_RDONLY": 0,
  "O_WRONLY": 1,
  "O_RDWR": 2,
  "S_IFMT": 61440,
  "S_IFREG": 32768,
  "S_IFDIR": 16384,
  "S_IFCHR": 8192,
  "S_IFBLK": 24576,
  "S_IFIFO": 4096,
  "S_IFLNK": 40960,
  "S_IFSOCK": 49152,
  "O_CREAT": 512,
  "O_EXCL": 2048,
  "O_NOCTTY": 131072,
  "O_TRUNC": 1024,
  "O_APPEND": 8,
  "O_DIRECTORY": 1048576,
  "O_NOFOLLOW": 256,
  "O_SYNC": 128,
  "O_SYMLINK": 2097152,
  "O_NONBLOCK": 4,
  "S_IRWXU": 448,
  "S_IRUSR": 256,
  "S_IWUSR": 128,
  "S_IXUSR": 64,
  "S_IRWXG": 56,
  "S_IRGRP": 32,
  "S_IWGRP": 16,
  "S_IXGRP": 8,
  "S_IRWXO": 7,
  "S_IROTH": 4,
  "S_IWOTH": 2,
  "S_IXOTH": 1,
  "E2BIG": 7,
  "EACCES": 13,
  "EADDRINUSE": 48,
  "EADDRNOTAVAIL": 49,
  "EAFNOSUPPORT": 47,
  "EAGAIN": 35,
  "EALREADY": 37,
  "EBADF": 9,
  "EBADMSG": 94,
  "EBUSY": 16,
  "ECANCELED": 89,
  "ECHILD": 10,
  "ECONNABORTED": 53,
  "ECONNREFUSED": 61,
  "ECONNRESET": 54,
  "EDEADLK": 11,
  "EDESTADDRREQ": 39,
  "EDOM": 33,
  "EDQUOT": 69,
  "EEXIST": 17,
  "EFAULT": 14,
  "EFBIG": 27,
  "EHOSTUNREACH": 65,
  "EIDRM": 90,
  "EILSEQ": 92,
  "EINPROGRESS": 36,
  "EINTR": 4,
  "EINVAL": 22,
  "EIO": 5,
  "EISCONN": 56,
  "EISDIR": 21,
  "ELOOP": 62,
  "EMFILE": 24,
  "EMLINK": 31,
  "EMSGSIZE": 40,
  "EMULTIHOP": 95,
  "ENAMETOOLONG": 63,
  "ENETDOWN": 50,
  "ENETRESET": 52,
  "ENETUNREACH": 51,
  "ENFILE": 23,
  "ENOBUFS": 55,
  "ENODATA": 96,
  "ENODEV": 19,
  "ENOENT": 2,
  "ENOEXEC": 8,
  "ENOLCK": 77,
  "ENOLINK": 97,
  "ENOMEM": 12,
  "ENOMSG": 91,
  "ENOPROTOOPT": 42,
  "ENOSPC": 28,
  "ENOSR": 98,
  "ENOSTR": 99,
  "ENOSYS": 78,
  "ENOTCONN": 57,
  "ENOTDIR": 20,
  "ENOTEMPTY": 66,
  "ENOTSOCK": 38,
  "ENOTSUP": 45,
  "ENOTTY": 25,
  "ENXIO": 6,
  "EOPNOTSUPP": 102,
  "EOVERFLOW": 84,
  "EPERM": 1,
  "EPIPE": 32,
  "EPROTO": 100,
  "EPROTONOSUPPORT": 43,
  "EPROTOTYPE": 41,
  "ERANGE": 34,
  "EROFS": 30,
  "ESPIPE": 29,
  "ESRCH": 3,
  "ESTALE": 70,
  "ETIME": 101,
  "ETIMEDOUT": 60,
  "ETXTBSY": 26,
  "EWOULDBLOCK": 35,
  "EXDEV": 18,
  "SIGHUP": 1,
  "SIGINT": 2,
  "SIGQUIT": 3,
  "SIGILL": 4,
  "SIGTRAP": 5,
  "SIGABRT": 6,
  "SIGIOT": 6,
  "SIGBUS": 10,
  "SIGFPE": 8,
  "SIGKILL": 9,
  "SIGUSR1": 30,
  "SIGSEGV": 11,
  "SIGUSR2": 31,
  "SIGPIPE": 13,
  "SIGALRM": 14,
  "SIGTERM": 15,
  "SIGCHLD": 20,
  "SIGCONT": 19,
  "SIGSTOP": 17,
  "SIGTSTP": 18,
  "SIGTTIN": 21,
  "SIGTTOU": 22,
  "SIGURG": 16,
  "SIGXCPU": 24,
  "SIGXFSZ": 25,
  "SIGVTALRM": 26,
  "SIGPROF": 27,
  "SIGWINCH": 28,
  "SIGIO": 23,
  "SIGSYS": 12,
  "SSL_OP_ALL": 2147486719,
  "SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION": 262144,
  "SSL_OP_CIPHER_SERVER_PREFERENCE": 4194304,
  "SSL_OP_CISCO_ANYCONNECT": 32768,
  "SSL_OP_COOKIE_EXCHANGE": 8192,
  "SSL_OP_CRYPTOPRO_TLSEXT_BUG": 2147483648,
  "SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS": 2048,
  "SSL_OP_EPHEMERAL_RSA": 0,
  "SSL_OP_LEGACY_SERVER_CONNECT": 4,
  "SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER": 32,
  "SSL_OP_MICROSOFT_SESS_ID_BUG": 1,
  "SSL_OP_MSIE_SSLV2_RSA_PADDING": 0,
  "SSL_OP_NETSCAPE_CA_DN_BUG": 536870912,
  "SSL_OP_NETSCAPE_CHALLENGE_BUG": 2,
  "SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG": 1073741824,
  "SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG": 8,
  "SSL_OP_NO_COMPRESSION": 131072,
  "SSL_OP_NO_QUERY_MTU": 4096,
  "SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION": 65536,
  "SSL_OP_NO_SSLv2": 16777216,
  "SSL_OP_NO_SSLv3": 33554432,
  "SSL_OP_NO_TICKET": 16384,
  "SSL_OP_NO_TLSv1": 67108864,
  "SSL_OP_NO_TLSv1_1": 268435456,
  "SSL_OP_NO_TLSv1_2": 134217728,
  "SSL_OP_PKCS1_CHECK_1": 0,
  "SSL_OP_PKCS1_CHECK_2": 0,
  "SSL_OP_SINGLE_DH_USE": 1048576,
  "SSL_OP_SINGLE_ECDH_USE": 524288,
  "SSL_OP_SSLEAY_080_CLIENT_DH_BUG": 128,
  "SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG": 0,
  "SSL_OP_TLS_BLOCK_PADDING_BUG": 512,
  "SSL_OP_TLS_D5_BUG": 256,
  "SSL_OP_TLS_ROLLBACK_BUG": 8388608,
  "ENGINE_METHOD_DSA": 2,
  "ENGINE_METHOD_DH": 4,
  "ENGINE_METHOD_RAND": 8,
  "ENGINE_METHOD_ECDH": 16,
  "ENGINE_METHOD_ECDSA": 32,
  "ENGINE_METHOD_CIPHERS": 64,
  "ENGINE_METHOD_DIGESTS": 128,
  "ENGINE_METHOD_STORE": 256,
  "ENGINE_METHOD_PKEY_METHS": 512,
  "ENGINE_METHOD_PKEY_ASN1_METHS": 1024,
  "ENGINE_METHOD_ALL": 65535,
  "ENGINE_METHOD_NONE": 0,
  "DH_CHECK_P_NOT_SAFE_PRIME": 2,
  "DH_CHECK_P_NOT_PRIME": 1,
  "DH_UNABLE_TO_CHECK_GENERATOR": 4,
  "DH_NOT_SUITABLE_GENERATOR": 8,
  "NPN_ENABLED": 1,
  "RSA_PKCS1_PADDING": 1,
  "RSA_SSLV23_PADDING": 2,
  "RSA_NO_PADDING": 3,
  "RSA_PKCS1_OAEP_PADDING": 4,
  "RSA_X931_PADDING": 5,
  "RSA_PKCS1_PSS_PADDING": 6,
  "POINT_CONVERSION_COMPRESSED": 2,
  "POINT_CONVERSION_UNCOMPRESSED": 4,
  "POINT_CONVERSION_HYBRID": 6,
  "F_OK": 0,
  "R_OK": 4,
  "W_OK": 2,
  "X_OK": 1,
  "UV_UDP_REUSEADDR": 4
}

},{}],5:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],6:[function(require,module,exports){
(function (global){
/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.14.3
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Popper = factory());
}(this, (function () { 'use strict';

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && parent.nodeName === 'HTML') {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // Avoid blurry text by using full pixel integers.
  // For pixel-perfect positioning, top/bottom prefers rounded
  // values, while left/right prefers floored values.
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.round(popper.top),
    bottom: Math.round(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

return Popper;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
// Generated by js_of_ocaml 3.1.0
(function(ag){"use strict";var
lk=104,bE=254,lT="bevel",kT="source-out",lA='  "bar": FAILED: nope',gS="ab",mj="Invalid_argument",lS="-1",n=16777215,lj="@[",li="abs %s",e4=16777213,eY="greater_than %s %s",mG=0.5,eC="43",gI="jsError",lh=1020,mh="single success",mi="%ni",gR=512,l$="Zero",e8="[]",c$="max ",l_="End_of_file",gQ=-120,dN=120,l9="Failure",mv="destination-atop",eR=" not raised, but exception ",al=128,mu="List.tail",l8="NotANumber",eU="different ",mg="0l",U="0",J=248,lR=-43,lz="1_000",lg="Sys_blocked_io",lQ="fd ",e7="less_or_equal ",ly="wrong exception",mf="normal",bD=1023,mt="square",dd="min %s %s",ms="sub %s %s",ao="camlinternalFormat.ml",lf="sub ",gO="Division_by_zero",eQ=" + ",mF=">",eB="greater_or_equal %s %s",le="FAILED: expected exception %s not raised",lP="zero - %s",kS=-34,l7="Sys_error",e3="-3",ld="abs ",eI="%s <> %s",lx="destination-in",mr=32767,ex=1073741823,eA="%s <= %s",lw=": ",mq="xor",lc="%u",dc="%d",lb=110,eP="%s = %s",la="%S",mE="error",ew=" = ",lu="List.head",lv=57343,eX="less_or_equal %s %s",l6="None",b7="int_of_string",c9="bad",k$="@{",lt="0L",cj="1",mp="source-in",g4="e",k_=" : flags Open_rdonly and Open_wronly are not compatible",lN=16777209,lO="([^/]*)",gV="too bad",b5="-",lM="square ",kR='  "baz": OK',ls="%s - %s",eT="equal %s %s",eW="different %s %s",g0="sys_big_int_of_string",ad="foo",k9=" : file already exists",bC="b",gU=240,mo=2048,g3=" raised\n",eH="Foundations/IntRange.ml",ev="less_than ",kQ="0x",lr=16777204,lL="Out_of_memory",bP="min_max ",kP="\n",lK=101,eu="%s + %s",bO=32768,k8="Normal",lJ="index out of bounds",k7="source-over",gM=" raised (no backtrace)",ch=125,lp=" - ",lq=" : flags Open_text and Open_binary are not compatible",l5="%Li",e6="%s < %s",k6=16777212,eG=2147483647,eO="baz",j=255,me=224,eN=" < ",cE=65536,k5="group success",eM=" >= ",md=", characters ",da=250,bR=1024,k4="-%s",ck=-12,k2=-55,k3="ERROR: exception ",eL=1073741824,l4="lighter",g=246,gL=102,mc="destination-over",gT=-121,k1="Infinite",c8=-10,mD="infinity",mC="nope",l3="SubNormal",gZ=122,lo="0n",mb=0.0625,p="",db="min ",mn="Stack_overflow",gK="^",lI=16777214,eV=100,l2='"foo" (Successes: 2)',mm="Not_found",dL="Foo",gJ="; v=",l1="destination-out",mB=103,mA="custom failure",k0="Match_failure",mz=" (Successes: ",ln="negate %s",lH=1e9,l0="child",ae=", ",my="FAILED: expected exception %s not raised, but exception %s raised (no backtrace)",lZ="static/",af="broken invariants",gX=1e3,ml="n",ez="round",kZ="square %s",cF=".",ey="add %s %s",dK="+",A=65535,g2="int64_of_big_int",gY="; r=",dO="add ",eF="greater_or_equal ",kX="not equal failure",kY="%li",c_="Able",o="a",gP="10000000000000000000000000000000000000000",lY=252,dM=127,e2="false",kO="source-atop",eE="%s >= %s",lG="negate ",lX="zero - ",mx="substract zero ",kN="FAILED: expected exception %s not raised, but exception %s raised\n%s",kW=111,e1=" > ",eS="greater_than ",b6=" ",eK="%s > %s",lW="Undefined_recursive_module",lm="%f",c5="Identifiable",g1="-12",ci="bar",eJ="equal ",gW="nan",aJ=4294967296,kM="no exception",ll=192,lV=116,kL="stream.ml",ma='"foo" (Successes: 1, failures: 1, errors: 0)',e5="less_than %s %s",lC="substract zero %s",lD="2 ^ ",lE="%.12g",lF=56320,kV=" not raised",c7="FAILED: expected exception ",mk=32752,b8="/",mw="Assert_failure",lB=114,bQ="min_max %s %s",e0="15",lU="%i",eZ=" <> ",et=" <= ",eD="true",gN=-11,kU=-2147483648,c6="max %s %s";"use strict";function
dU(c,d,f,e){var
b=e;for(var
a=0;a<f;a++){c[d+a]+=b;if(c[d+a]<aJ){b=0;break}else{c[d+a]-=aJ;b=1}}return b}function
e9(c,d,g,h,i,e,f){var
b=f;for(var
a=0;a<e;a++){c[d+a]+=h[i+a]+b;if(c[d+a]<aJ)b=0;else{c[d+a]-=aJ;b=1}}return dU(c,d+e,g-e,b)}function
aK(c,e,d,f,b){for(var
a=0;a<b;a++)c[e+a]=d[f+a];return 0}function
Qe(c,d){var
g=c.length,h=d.length,f=g+h-1,b=new
Array(f);b[0]=0;var
a=1,e=1;for(;a<g;a++)b[a]=c[a];for(;a<f;a++,e++)b[a]=d[e];return b}function
Ra(a){var
c=[0];while(a!==0){var
d=a[1];for(var
b=1;b<d.length;b++)c.push(d[b]);a=a[2]}return c}function
g6(e,f,d){var
a=new
Array(d+1);a[0]=0;for(var
b=1,c=f+1;b<=d;b++,c++)a[b]=e[c];return a}function
Qg(){return 0}function
dW(d,e,c){var
b=new
Array(c);for(var
a=0;a<c;a++)b[a]=d[e+a];return b}function
hi(b,c,a){var
d=String.fromCharCode;if(c==0&&a<=4096&&a==b.length)return d.apply(null,b);var
e=p;for(;0<a;c+=bR,a-=bR)e+=d.apply(null,dW(b,c,Math.min(a,bR)));return e}function
dP(b){if(ag.Uint8Array)var
c=new(ag.Uint8Array)(b.l);else
var
c=new
Array(b.l);var
e=b.c,d=e.length,a=0;for(;a<d;a++)c[a]=e.charCodeAt(a);for(d=b.l;a<d;a++)c[a]=0;b.c=c;b.t=4;return c}function
bF(d,e,b,f,c){if(c==0)return 0;if(f==0&&(c>=b.l||b.t==2&&c>=b.c.length)){b.c=d.t==4?hi(d.c,e,c):e==0&&d.c.length==c?d.c:d.c.substr(e,c);b.t=b.c.length==b.l?0:2}else
if(b.t==2&&f==b.c.length){b.c+=d.t==4?hi(d.c,e,c):e==0&&d.c.length==c?d.c:d.c.substr(e,c);b.t=b.c.length==b.l?0:2}else{if(b.t!=4)dP(b);var
g=d.c,h=b.c;if(d.t==4)if(f<=e)for(var
a=0;a<c;a++)h[f+a]=g[e+a];else
for(var
a=c-1;a>=0;a--)h[f+a]=g[e+a];else{var
i=Math.min(c,g.length-e);for(var
a=0;a<i;a++)h[f+a]=g.charCodeAt(e+a);for(;a<c;a++)h[f+a]=0}}return 0}var
g7=bF;function
QP(b,a){throw[0,b,a]}function
di(b,a){if(a.repeat)return a.repeat(b);var
c=p,d=0;if(b==0)return c;for(;;){if(b&1)c+=a;b>>=1;if(b==0)return c;a+=a;d++;if(d==9)a.slice(0,1)}}function
cI(a){if(a.t==2)a.c+=di(a.l-a.c.length,"\0");else
a.c=hi(a.c,0,a.c.length);a.t=0}function
mR(a){if(a.length<24){for(var
b=0;b<a.length;b++)if(a.charCodeAt(b)>dM)return false;return true}else
return!/[^\x00-\x7f]/.test(a)}function
QZ(e){for(var
j=p,c=p,g,f,h,a,b=0,i=e.length;b<i;b++){f=e.charCodeAt(b);if(f<al){for(var
d=b+1;d<i&&(f=e.charCodeAt(d))<al;d++);if(d-b>gR){c.substr(0,1);j+=c;c=p;j+=e.slice(b,d)}else
c+=e.slice(b,d);if(d==i)break;b=d}a=1;if(++b<i&&((h=e.charCodeAt(b))&-64)==al){g=h+(f<<6);if(f<me){a=g-12416;if(a<al)a=1}else{a=2;if(++b<i&&((h=e.charCodeAt(b))&-64)==al){g=h+(g<<6);if(f<gU){a=g-925824;if(a<mo||a>=55295&&a<57344)a=2}else{a=3;if(++b<i&&((h=e.charCodeAt(b))&-64)==al&&f<245){a=h-63447168+(g<<6);if(a<cE||a>1114111)a=3}}}}}if(a<4){b-=a;c+="\ufffd"}else
if(a>A)c+=String.fromCharCode(55232+(a>>10),lF+(a&bD));else
c+=String.fromCharCode(a);if(c.length>bR){c.substr(0,1);j+=c;c=p}}return j+c}function
QX(a){switch(a.t){case
9:return a.c;default:cI(a);case
0:if(mR(a.c)){a.t=9;return a.c}a.t=8;case
8:return QZ(a.c)}}function
bj(c,a,b){this.t=c;this.c=a;this.l=b}bj.prototype.toString=function(){return QX(this)};function
a(a){return new
bj(0,a,a.length)}function
hh(c,b){QP(c,a(b))}var
W=[0];function
cK(a){hh(W.Invalid_argument,a)}function
fe(){cK(lJ)}function
Qh(a,b){switch(a.t&6){default:if(b>=a.c.length)return 0;case
0:return a.c.charCodeAt(b);case
4:return a.c[b]}}function
mJ(b,a){if(a>>>0>=b.l)fe();return Qh(b,a)}function
Qi(a,c,b){b&=j;if(a.t!=4){if(c==a.c.length){a.c+=String.fromCharCode(b);if(c+1==a.l)a.t=0;return 0}dP(a)}a.c[c]=b;return 0}function
cG(b,a,c){if(a>>>0>=b.l)fe();return Qi(b,a,c)}function
Q8(c,e){var
d=c.length,b=new
Array(d+1),a=0;for(;a<d;a++)b[a]=c[a];b[a]=e;return b}function
bG(b,a){if(b.fun)return bG(b.fun,a);var
c=b.length,d=a.length,e=c-d;if(e==0)return b.apply(null,a);else
if(e<0)return bG(b.apply(null,dW(a,0,c)),dW(a,c,d-c));else
return function(c){return bG(b,Q8(a,c))}}function
Qf(){cK(lJ)}function
br(a,b){if(b>>>0>=a.length-1)Qf();return a}function
Qj(a){if(isFinite(a)){if(Math.abs(a)>=2.22507385850720138e-308)return 0;if(a!=0)return 1;return 2}return isNaN(a)?4:3}function
g_(a,b){var
c=a[3]<<16,d=b[3]<<16;if(c>d)return 1;if(c<d)return-1;if(a[2]>b[2])return 1;if(a[2]<b[2])return-1;if(a[1]>b[1])return 1;if(a[1]<b[1])return-1;return 0}function
dg(a,b){if(a<b)return-1;if(a==b)return 0;return 1}function
m2(a,b){a.t&6&&cI(a);b.t&6&&cI(b);return a.c<b.c?-1:a.c>b.c?1:0}function
cH(a,b,h){var
d=[];for(;;){if(!(h&&a===b))if(a
instanceof
bj)if(b
instanceof
bj){if(a!==b){var
c=m2(a,b);if(c!=0)return c}}else
return 1;else
if(a
instanceof
Array&&a[0]===(a[0]|0)){var
e=a[0];if(e===bE)e=0;if(e===da){a=a[1];continue}else
if(b
instanceof
Array&&b[0]===(b[0]|0)){var
f=b[0];if(f===bE)f=0;if(f===da){b=b[1];continue}else
if(e!=f)return e<f?-1:1;else
switch(e){case
248:var
c=dg(a[2],b[2]);if(c!=0)return c;break;case
251:cK("equal: abstract value");case
255:var
c=g_(a,b);if(c!=0)return c;break;default:if(a.length!=b.length)return a.length<b.length?-1:1;if(a.length>1)d.push(a,b,1)}}else
return 1}else
if(b
instanceof
bj||b
instanceof
Array&&b[0]===(b[0]|0))return-1;else
if(typeof
a!="number"&&a&&a.compare)return a.compare(b,h);else
if(typeof
a=="function")cK("compare: functional value");else{if(a<b)return-1;if(a>b)return 1;if(a!=b){if(!h)return NaN;if(a==a)return 1;if(b==b)return-1}}if(d.length==0)return 0;var
g=d.pop();b=d.pop();a=d.pop();if(g+1<a.length)d.push(a,b,g+1);a=a[g];b=b[g]}}function
Qk(a,b){return cH(a,b,true)}function
Ql(){return[0]}function
aZ(a){if(a<0)cK("Bytes.create");return new
bj(a?2:9,p,a)}function
mZ(a){throw a}function
fd(){mZ(W.Division_by_zero)}function
dR(b,a){if(a==0)fd();return b/a|0}function
de(a,b){return+(cH(a,b,false)==0)}function
Qn(a,c,b,d){if(b>0)if(c==0&&(b>=a.l||a.t==2&&b>=a.c.length))if(d==0){a.c=p;a.t=2}else{a.c=di(b,String.fromCharCode(d));a.t=b==a.l?0:2}else{if(a.t!=4)dP(a);for(b+=c;c<b;c++)a.c[c]=d}return 0}var
Qm=Qn;function
Qo(a,b){if(a===b)return 0;if(a<b)return-1;if(a>b)return 1;if(a===a)return 1;if(b===b)return-1;return 0}function
bU(a){hh(W.Failure,a)}function
e_(a){if((a.t&6)!=0)cI(a);return a.c}function
mK(a){var
b;a=e_(a);b=+a;if(a.length>0&&b===b)return b;a=a.replace(/_/g,p);b=+a;if(a.length>0&&b===b||/^[+-]?nan$/i.test(a))return b;var
c=/^ *([+-]?)0x([0-9a-f]+)\.?([0-9a-f]*)p([+-]?[0-9]+)/i.exec(a);if(c){var
d=c[3].replace(/0+$/,p),f=parseInt(c[1]+c[2]+d,16),e=(c[4]|0)-4*d.length;b=f*Math.pow(2,e);return b}if(/^\+?inf(inity)?$/i.test(a))return Infinity;if(/^-inf(inity)?$/i.test(a))return-Infinity;bU("float_of_string")}function
hg(d){d=e_(d);var
e=d.length;if(e>31)cK("format_int: format too long");var
a={justify:dK,signstyle:b5,filler:b6,alternate:false,base:0,signedconv:false,width:0,uppercase:false,sign:1,prec:-1,conv:"f"};for(var
c=0;c<e;c++){var
b=d.charAt(c);switch(b){case"-":a.justify=b5;break;case"+":case" ":a.signstyle=b;break;case"0":a.filler=U;break;case"#":a.alternate=true;break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":a.width=0;while(b=d.charCodeAt(c)-48,b>=0&&b<=9){a.width=a.width*10+b;c++}c--;break;case".":a.prec=0;c++;while(b=d.charCodeAt(c)-48,b>=0&&b<=9){a.prec=a.prec*10+b;c++}c--;case"d":case"i":a.signedconv=true;case"u":a.base=10;break;case"x":a.base=16;break;case"X":a.base=16;a.uppercase=true;break;case"o":a.base=8;break;case"e":case"f":case"g":a.signedconv=true;a.conv=b;break;case"E":case"F":case"G":a.signedconv=true;a.uppercase=true;a.conv=b.toLowerCase();break}}return a}function
g8(b,f){if(b.uppercase)f=f.toUpperCase();var
e=f.length;if(b.signedconv&&(b.sign<0||b.signstyle!=b5))e++;if(b.alternate){if(b.base==8)e+=1;if(b.base==16)e+=2}var
c=p;if(b.justify==dK&&b.filler==b6)for(var
d=e;d<b.width;d++)c+=b6;if(b.signedconv)if(b.sign<0)c+=b5;else
if(b.signstyle!=b5)c+=b.signstyle;if(b.alternate&&b.base==8)c+=U;if(b.alternate&&b.base==16)c+=kQ;if(b.justify==dK&&b.filler==U)for(var
d=e;d<b.width;d++)c+=U;c+=f;if(b.justify==b5)for(var
d=e;d<b.width;d++)c+=b6;return a(c)}function
mL(i,c){var
a,e=hg(i),d=e.prec<0?6:e.prec;if(c<0||c==0&&1/c==-Infinity){e.sign=-1;c=-c}if(isNaN(c)){a=gW;e.filler=b6}else
if(!isFinite(c)){a="inf";e.filler=b6}else
switch(e.conv){case"e":var
a=c.toExponential(d),b=a.length;if(a.charAt(b-3)==g4)a=a.slice(0,b-1)+U+a.slice(b-1);break;case"f":a=c.toFixed(d);break;case"g":d=d?d:1;a=c.toExponential(d-1);var
h=a.indexOf(g4),g=+a.slice(h+1);if(g<-4||c>=1e+21||c.toFixed(0).length>d){var
b=h-1;while(a.charAt(b)==U)b--;if(a.charAt(b)==cF)b--;a=a.slice(0,b+1)+a.slice(h);b=a.length;if(a.charAt(b-3)==g4)a=a.slice(0,b-1)+U+a.slice(b-1);break}else{var
f=d;if(g<0){f-=g+1;a=c.toFixed(f)}else
while(a=c.toFixed(f),a.length>d+1)f--;if(f){var
b=a.length-1;while(a.charAt(b)==U)b--;if(a.charAt(b)==cF)b--;a=a.slice(0,b+1)}}break}return g8(e,a)}function
df(e,c){if(e_(e)==dc)return a(p+c);var
b=hg(e);if(c<0)if(b.signedconv){b.sign=-1;c=-c}else
c>>>=0;var
d=c.toString(b.base);if(b.prec>=0){b.filler=b6;var
f=b.prec-d.length;if(f>0)d=di(f,U)+d}return g8(b,d)}var
QM=0;function
H(){return QM++}var
Q7=Math.log2&&Math.log2(1.12355820928894744e+307)==lh;function
Q6(a){if(Q7)return Math.floor(Math.log2(a));var
b=0;if(a==0)return-Infinity;if(a>=1)while(a>=2){a/=2;b++}else
while(a<1){a*=2;b--}return b}function
Qp(a){if(a==0||!isFinite(a))return[0,a,0];var
c=a<0;if(c)a=-a;var
b=Q6(a)+1;a*=Math.pow(2,-b);if(a<mG){a*=2;b-=1}if(c)a=-a;return[0,a,b]}function
Qq(){return[0]}function
Qr(){return[0]}function
bs(a,b){return+(cH(a,b,false)>=0)}function
dS(a,b){return+(cH(a,b,false)>0)}function
Q0(e){for(var
f=p,b=f,a,h,c=0,g=e.length;c<g;c++){a=e.charCodeAt(c);if(a<al){for(var
d=c+1;d<g&&(a=e.charCodeAt(d))<al;d++);if(d-c>gR){b.substr(0,1);f+=b;b=p;f+=e.slice(c,d)}else
b+=e.slice(c,d);if(d==g)break;c=d}if(a<mo){b+=String.fromCharCode(ll|a>>6);b+=String.fromCharCode(al|a&63)}else
if(a<55296||a>=lv)b+=String.fromCharCode(me|a>>12,al|a>>6&63,al|a&63);else
if(a>=56319||c+1==g||(h=e.charCodeAt(c+1))<lF||h>lv)b+="\xef\xbf\xbd";else{c++;a=(a<<10)+h-56613888;b+=String.fromCharCode(gU|a>>18,al|a>>12&63,al|a>>6&63,al|a&63)}if(b.length>bR){b.substr(0,1);f+=b;b=p}}return f+b}function
bk(a){var
b=9;if(!mR(a))b=8,a=Q0(a);return new
bj(b,a,a.length)}function
Qs(a,c,k){if(!isFinite(a)){if(isNaN(a))return bk(gW);return bk(a>0?mD:"-infinity")}var
i=a==0&&1/a==-Infinity?1:a>=0?0:1;if(i)a=-a;var
d=0;if(a==0);else
if(a<1)while(a<1&&d>-1022){a*=2;d--}else
while(a>=2){a/=2;d++}var
j=d<0?p:dK,e=p;if(i)e=b5;else
switch(k){case
43:e=dK;break;case
32:e=b6;break;default:break}if(c>=0&&c<13){var
g=Math.pow(2,c*4);a=Math.round(a*g)/g}var
b=a.toString(16);if(c>=0){var
h=b.indexOf(cF);if(h<0)b+=cF+di(c,U);else{var
f=h+1+c;if(b.length<f)b+=di(f-b.length,U);else
b=b.substr(0,f)}}return bk(e+kQ+b+"p"+j+d.toString(10))}function
g9(a,b){var
c=a[1]+b[1],d=a[2]+b[2]+(c>>24),e=a[3]+b[3]+(d>>24);return[j,c&n,d&n,e&A]}function
mM(a,b){return[j,a[1]&b[1],a[2]&b[2],a[3]&b[3]]}function
bt(a){var
b=-a[1],c=-a[2]+(b>>24),d=-a[3]+(c>>24);return[j,b&n,c&n,d&A]}function
mX(d){var
c=d.length,b=new
Array(c);for(var
a=0;a<c;a++)b[a]=d[a];return b}function
hb(a,b){var
c=a[1]-b[1],d=a[2]-b[2]+(c>>24),e=a[3]-b[3]+(d>>24);return[j,c&n,d&n,e&A]}function
hd(a,b){if(a[3]>b[3])return 1;if(a[3]<b[3])return-1;if(a[2]>b[2])return 1;if(a[2]<b[2])return-1;if(a[1]>b[1])return 1;if(a[1]<b[1])return-1;return 0}function
mO(a){a[3]=a[3]<<1|a[2]>>23;a[2]=(a[2]<<1|a[1]>>23)&n;a[1]=a[1]<<1&n}function
Qv(a){a[1]=(a[1]>>>1|a[2]<<23)&n;a[2]=(a[2]>>>1|a[3]<<23)&n;a[3]=a[3]>>>1}function
fa(e,f){var
c=0,b=mX(e),a=mX(f),d=[j,0,0,0];while(hd(b,a)>0){c++;mO(a)}while(c>=0){c--;mO(d);if(hd(b,a)>=0){d[1]++;b=hb(b,a)}Qv(a)}return[0,d,b]}function
ha(a){return(a[3]|a[2]|a[1])==0}function
Qt(b,a){if(ha(a))fd();var
d=b[3]^a[3];if(b[3]&bO)b=bt(b);if(a[3]&bO)a=bt(a);var
c=fa(b,a)[1];if(d&bO)c=bt(c);return c}function
g$(a){var
c=(a[3]&mr)>>4;if(c==2047)return(a[1]|a[2]|a[3]&15)==0?a[3]&bO?-Infinity:Infinity:NaN;var
d=Math.pow(2,-24),b=(a[1]*d+a[2])*d+(a[3]&15);if(c>0){b+=16;b*=Math.pow(2,c-1027)}else
b*=Math.pow(2,-1026);if(a[3]&bO)b=-b;return b}function
cl(a){return[j,a&n,a>>24&n,a>>31&A]}function
e$(a){return a[1]|a[2]<<24}function
Qu(a){return a[3]<<16<0}function
mN(g,c){var
a=hg(g);if(a.signedconv&&Qu(c)){a.sign=-1;c=bt(c)}var
b=p,h=cl(a.base),f="0123456789abcdef";do{var
e=fa(c,h);c=e[1];b=f.charAt(e$(e[2]))+b}while(!ha(c));if(a.prec>=0){a.filler=b6;var
d=a.prec-b.length;if(d>0)b=di(d,U)+b}return g8(a,b)}function
Qw(a,b){if(ha(b))fd();var
d=a[3];if(a[3]&bO)a=bt(a);if(b[3]&bO)b=bt(b);var
c=fa(a,b)[2];if(d&bO)c=bt(c);return c}var
dT=Math.pow(2,-24);function
mP(a,b){var
c=a[1]*b[1],d=(c*dT|0)+a[2]*b[1]+a[1]*b[2],e=(d*dT|0)+a[3]*b[1]+a[2]*b[2]+a[1]*b[3];return[j,c&n,d&n,e&A]}function
Qx(a){if(a<0)a=Math.ceil(a);return[j,a&n,Math.floor(a*dT)&n,Math.floor(a*dT*dT)&A]}function
w(a){return a.l}function
aR(a,b){switch(a.t&6){default:if(b>=a.c.length)return 0;case
0:return a.c.charCodeAt(b);case
4:return a.c[b]}}function
he(a,b){return hd(a,b)<0}function
mY(c){var
a=0,d=w(c),b=10,e=d>0&&aR(c,0)==45?(a++,-1):1;if(a+1<d&&aR(c,a)==48)switch(aR(c,a+1)){case
120:case
88:b=16;a+=2;break;case
111:case
79:b=8;a+=2;break;case
98:case
66:b=2;a+=2;break}return[a,e,b]}function
fc(a){if(a>=48&&a<=57)return a-48;if(a>=65&&a<=90)return a-55;if(a>=97&&a<=gZ)return a-87;return-1}function
Qy(f){var
e=mY(f),d=e[0],i=e[1],g=e[2],h=cl(g),k=fa([j,n,268435455,A],h)[1],c=aR(f,d),a=fc(c);if(a<0||a>=g)bU(b7);var
b=cl(a);for(;;){d++;c=aR(f,d);if(c==95)continue;a=fc(c);if(a<0||a>=g)break;if(he(k,b))bU(b7);a=cl(a);b=g9(mP(h,b),a);if(he(b,a))bU(b7)}if(d!=w(f))bU(b7);if(e[2]==10&&he([j,0,0,bO],b))bU(b7);if(i<0)b=bt(b);return b}function
mQ(a,b){return[j,a[1]|b[1],a[2]|b[2],a[3]|b[3]]}function
Qz(b,a){a=a&63;if(a==0)return b;if(a<24)return[j,b[1]<<a&n,(b[2]<<a|b[1]>>24-a)&n,(b[3]<<a|b[2]>>24-a)&A];if(a<48)return[j,0,b[1]<<a-24&n,(b[2]<<a-24|b[1]>>48-a)&A];return[j,0,0,b[1]<<a-48&A]}function
QA(b,a){a=a&63;if(a==0)return b;var
d=b[3]<<16>>16;if(a<24)return[j,(b[1]>>a|b[2]<<24-a)&n,(b[2]>>a|d<<24-a)&n,b[3]<<16>>a>>>16];var
c=b[3]<<16>>31;if(a<48)return[j,(b[2]>>a-24|b[3]<<48-a)&n,b[3]<<16>>a-24>>16&n,c&A];return[j,b[3]<<16>>a-32&n,c&n,c&A]}function
hc(a){return(a[3]<<16)*Math.pow(2,32)+a[2]*Math.pow(2,24)+a[1]}function
fb(f){var
h=mY(f),c=h[0],i=h[1],d=h[2],g=w(f),j=-1>>>0,e=c<g?aR(f,c):0,b=fc(e);if(b<0||b>=d)bU(b7);var
a=b;for(c++;c<g;c++){e=aR(f,c);if(e==95)continue;b=fc(e);if(b<0||b>=d)break;a=d*a+b;if(a>j)bU(b7)}if(c!=g)bU(b7);a=i*a;if(d==10&&(a|0)!=a)bU(b7);return a|0}function
QB(){return typeof
module!=="undefined"&&module&&module.exports?module.exports:ag}function
QC(a){return dW(a,1,a.length-1)}function
Q9(c,e){var
d=c.length,b=new
Array(d+1);b[0]=e;for(var
a=1;a<=d;a++)b[a]=c[a-1];return b}function
QD(a){return Q9(a,0)}function
mS(b,a){a|=0;if(a>bD){a-=bD;b*=Math.pow(2,bD);if(a>bD){a-=bD;b*=Math.pow(2,bD)}}if(a<-bD){a+=bD;b*=Math.pow(2,-bD)}b*=Math.pow(2,a);return b}function
cL(a,b){return+(cH(a,b,false)<=0)}function
bl(a,b){return+(cH(a,b,false)<0)}function
Rb(a){var
a=a+1|0,b=new
Array(a);b[0]=bE;for(var
c=1;c<a;c++)b[c]=0;return b}function
mT(a,d){var
a=a+1|0,b=new
Array(a);b[0]=0;for(var
c=1;c<a;c++)b[c]=d;return b}function
m3(a){return new
bj(4,a,a.length)}var
QF=function(){function
m(a,b){return a+b|0}function
a(d,a,c,f,b,e){a=m(m(a,d),m(f,e));return m(a<<b|a>>>32-b,c)}function
g(c,b,d,e,h,f,g){return a(b&d|~b&e,c,b,h,f,g)}function
h(d,b,e,c,h,f,g){return a(b&c|e&~c,d,b,h,f,g)}function
i(c,b,d,e,h,f,g){return a(b^d^e,c,b,h,f,g)}function
k(c,b,d,e,h,f,g){return a(d^(b|~e),c,b,h,f,g)}function
l(f,o){var
e=o;f[e>>2]|=al<<8*(e&3);for(e=(e&~3)+8;(e&63)<60;e+=4)f[(e>>2)-1]=0;f[(e>>2)-1]=o<<3;f[e>>2]=o>>29&536870911;var
l=[1732584193,4023233417,2562383102,271733878];for(e=0;e<f.length;e+=16){var
a=l[0],b=l[1],c=l[2],d=l[3];a=g(a,b,c,d,f[e+0],7,3614090360);d=g(d,a,b,c,f[e+1],12,3905402710);c=g(c,d,a,b,f[e+2],17,606105819);b=g(b,c,d,a,f[e+3],22,3250441966);a=g(a,b,c,d,f[e+4],7,4118548399);d=g(d,a,b,c,f[e+5],12,1200080426);c=g(c,d,a,b,f[e+6],17,2821735955);b=g(b,c,d,a,f[e+7],22,4249261313);a=g(a,b,c,d,f[e+8],7,1770035416);d=g(d,a,b,c,f[e+9],12,2336552879);c=g(c,d,a,b,f[e+10],17,4294925233);b=g(b,c,d,a,f[e+11],22,2304563134);a=g(a,b,c,d,f[e+12],7,1804603682);d=g(d,a,b,c,f[e+13],12,4254626195);c=g(c,d,a,b,f[e+14],17,2792965006);b=g(b,c,d,a,f[e+15],22,1236535329);a=h(a,b,c,d,f[e+1],5,4129170786);d=h(d,a,b,c,f[e+6],9,3225465664);c=h(c,d,a,b,f[e+11],14,643717713);b=h(b,c,d,a,f[e+0],20,3921069994);a=h(a,b,c,d,f[e+5],5,3593408605);d=h(d,a,b,c,f[e+10],9,38016083);c=h(c,d,a,b,f[e+15],14,3634488961);b=h(b,c,d,a,f[e+4],20,3889429448);a=h(a,b,c,d,f[e+9],5,568446438);d=h(d,a,b,c,f[e+14],9,3275163606);c=h(c,d,a,b,f[e+3],14,4107603335);b=h(b,c,d,a,f[e+8],20,1163531501);a=h(a,b,c,d,f[e+13],5,2850285829);d=h(d,a,b,c,f[e+2],9,4243563512);c=h(c,d,a,b,f[e+7],14,1735328473);b=h(b,c,d,a,f[e+12],20,2368359562);a=i(a,b,c,d,f[e+5],4,4294588738);d=i(d,a,b,c,f[e+8],11,2272392833);c=i(c,d,a,b,f[e+11],16,1839030562);b=i(b,c,d,a,f[e+14],23,4259657740);a=i(a,b,c,d,f[e+1],4,2763975236);d=i(d,a,b,c,f[e+4],11,1272893353);c=i(c,d,a,b,f[e+7],16,4139469664);b=i(b,c,d,a,f[e+10],23,3200236656);a=i(a,b,c,d,f[e+13],4,681279174);d=i(d,a,b,c,f[e+0],11,3936430074);c=i(c,d,a,b,f[e+3],16,3572445317);b=i(b,c,d,a,f[e+6],23,76029189);a=i(a,b,c,d,f[e+9],4,3654602809);d=i(d,a,b,c,f[e+12],11,3873151461);c=i(c,d,a,b,f[e+15],16,530742520);b=i(b,c,d,a,f[e+2],23,3299628645);a=k(a,b,c,d,f[e+0],6,4096336452);d=k(d,a,b,c,f[e+7],10,1126891415);c=k(c,d,a,b,f[e+14],15,2878612391);b=k(b,c,d,a,f[e+5],21,4237533241);a=k(a,b,c,d,f[e+12],6,1700485571);d=k(d,a,b,c,f[e+3],10,2399980690);c=k(c,d,a,b,f[e+10],15,4293915773);b=k(b,c,d,a,f[e+1],21,2240044497);a=k(a,b,c,d,f[e+8],6,1873313359);d=k(d,a,b,c,f[e+15],10,4264355552);c=k(c,d,a,b,f[e+6],15,2734768916);b=k(b,c,d,a,f[e+13],21,1309151649);a=k(a,b,c,d,f[e+4],6,4149444226);d=k(d,a,b,c,f[e+11],10,3174756917);c=k(c,d,a,b,f[e+2],15,718787259);b=k(b,c,d,a,f[e+9],21,3951481745);l[0]=m(a,l[0]);l[1]=m(b,l[1]);l[2]=m(c,l[2]);l[3]=m(d,l[3])}var
p=new
Array(16);for(var
e=0;e<4;e++)for(var
n=0;n<4;n++)p[e*4+n]=l[e]>>8*n&j;return p}return function(h,g,f){var
e=[];switch(h.t&6){default:cI(h);case
0:var
d=h.c;for(var
a=0;a<f;a+=4){var
b=a+g;e[a>>2]=d.charCodeAt(b)|d.charCodeAt(b+1)<<8|d.charCodeAt(b+2)<<16|d.charCodeAt(b+3)<<24}for(;a<f;a++)e[a>>2]|=d.charCodeAt(a+g)<<8*(a&3);break;case
4:var
c=h.c;for(var
a=0;a<f;a+=4){var
b=a+g;e[a>>2]=c[b]|c[b+1]<<8|c[b+2]<<16|c[b+3]<<24}for(;a<f;a++)e[a>>2]|=c[a+g]<<8*(a&3)}return m3(l(e,f))}}();function
a0(a){return a.l}function
bu(a){hh(W.Sys_error,a)}var
bH=new
Array();function
hf(c){var
a=bH[c];if(!a.opened)bu("Cannot flush a closed channel");if(!a.buffer||a.buffer==p)return 0;if(a.fd&&W.fds[a.fd]&&W.fds[a.fd].output){var
b=W.fds[a.fd].output;switch(b.length){case
2:b(c,a.buffer);break;default:b(a.buffer)}}a.buffer=p;return 0}function
QK(a){var
c=a.refill(),b=w(c);if(b==0)a.refill=null;a.file.write(a.file.length(),c,0,b);return b}function
QG(d,f,e,b){var
a=bH[d],c=a.file.length()-a.offset;if(c==0&&a.refill!=null)c=QK(a);if(c<b)b=c;a.file.read(a.offset,f,e,b);a.offset+=b;return b}if(ag.process&&ag.process.cwd)var
dQ=ag.process.cwd().replace(/\\/g,b8);else
var
dQ="/static";if(dQ.slice(-1)!==b8)dQ+=b8;function
QE(a){a=a
instanceof
bj?a.toString():a;if(a.charCodeAt(0)!=47)a=dQ+a;var
d=a.split(b8),b=[];for(var
c=0;c<d.length;c++)switch(d[c]){case"..":if(b.length>1)b.pop();break;case".":break;case"":if(b.length==0)b.push(p);break;default:b.push(d[c]);break}b.orig=a;return b}function
QN(a){a=a
instanceof
bj?a.toString():a;bu(a+": No such file or directory")}function
O(b,a){if(a>>>0>=b.l)fe();return aR(b,a)}function
cJ(a){if(a<0)cK("String.create");return new
bj(a?2:9,p,a)}function
mH(){}function
aE(a){this.data=a}aE.prototype=new
mH();aE.prototype.truncate=function(a){var
b=this.data;this.data=cJ(a|0);bF(b,0,this.data,0,a)};aE.prototype.length=function(){return w(this.data)};aE.prototype.write=function(b,d,g,a){var
c=this.length();if(b+a>=c){var
e=cJ(b+a),f=this.data;this.data=e;bF(f,0,this.data,0,c)}bF(d,g,this.data,b,a);return 0};aE.prototype.read=function(c,a,d,b){var
e=this.length();bF(this.data,c,a,d,b);return 0};aE.prototype.read_one=function(a){return O(this.data,a)};aE.prototype.close=function(){};aE.prototype.constructor=aE;function
bq(b,a){this.content={};this.root=b;this.lookupFun=a}bq.prototype.nm=function(a){return this.root+a};bq.prototype.lookup=function(b){if(!this.content[b]&&this.lookupFun){var
c=this.lookupFun(a(this.root),a(b));if(c!=0)this.content[b]=new
aE(c[1])}};bq.prototype.exists=function(a){if(a==p)return 1;var
c=a+b8,d=new
RegExp(gK+c);for(var
b
in
this.content)if(b.match(d))return 1;this.lookup(a);return this.content[a]?1:0};bq.prototype.readdir=function(c){var
f=c==p?p:c+b8,g=new
RegExp(gK+f+lO),d={},b=[];for(var
e
in
this.content){var
a=e.match(g);if(a&&!d[a[1]]){d[a[1]]=true;b.push(a[1])}}return b};bq.prototype.is_dir=function(a){var
d=a==p?p:a+b8,e=new
RegExp(gK+d+lO),f=[];for(var
c
in
this.content){var
b=c.match(e);if(b)return 1}return 0};bq.prototype.unlink=function(a){var
b=this.content[a]?true:false;delete
this.content[a];return b};bq.prototype.open=function(a,b){if(b.rdonly&&b.wronly)bu(this.nm(a)+k_);if(b.text&&b.binary)bu(this.nm(a)+lq);this.lookup(a);if(this.content[a]){if(this.is_dir(a))bu(this.nm(a)+" : is a directory");if(b.create&&b.excl)bu(this.nm(a)+k9);var
c=this.content[a];if(b.truncate)c.truncate();return c}else
if(b.create){this.content[a]=new
aE(cJ(0));return this.content[a]}else
QN(this.nm(a))};bq.prototype.register=function(c,b){if(this.content[c])bu(this.nm(c)+k9);if(b
instanceof
bj)this.content[c]=new
aE(b);else
if(b
instanceof
Array)this.content[c]=new
aE(m3(b));else
if(b.toString){var
d=a(b.toString());this.content[c]=new
aE(d)}};bq.prototype.constructor=bq;function
mI(a){if(a.t!=4)dP(a);return a.c}function
X(a,c,b){b&=j;if(a.t!=4){if(c==a.c.length){a.c+=String.fromCharCode(b);if(c+1==a.l)a.t=0;return 0}dP(a)}a.c[c]=b;return 0}function
QT(b,a,c){if(a>>>0>=b.l)fe();return X(b,a,c)}var
g5=ag.Buffer;function
bT(a){this.fs=require("fs");this.fd=a}bT.prototype=new
mH();bT.prototype.truncate=function(a){this.fs.ftruncateSync(this.fd,a|0)};bT.prototype.length=function(){return this.fs.fstatSync(this.fd).size};bT.prototype.write=function(f,b,c,e){var
a=mI(b);if(!(a
instanceof
ag.Uint8Array))a=new(ag.Uint8Array)(a);var
d=new
g5(a);this.fs.writeSync(this.fd,d,c,e,f);return 0};bT.prototype.read=function(g,d,c,f){var
a=mI(d);if(!(a
instanceof
ag.Uint8Array))a=new(ag.Uint8Array)(a);var
e=new
g5(a);this.fs.readSync(this.fd,e,c,f,g);for(var
b=0;b<f;b++)QT(d,c+b,e[c+b]);return 0};bT.prototype.read_one=function(c){var
b=new(ag.Uint8Array)(1),a=new
g5(b);this.fs.readSync(this.fd,a,0,1,c);return a[0]};bT.prototype.close=function(){this.fs.closeSync(this.fd)};bT.prototype.constructor=bT;function
bS(a){this.fs=require("fs");this.root=a}bS.prototype.nm=function(a){return this.root+a};bS.prototype.exists=function(a){return this.fs.existsSync(this.nm(a))?1:0};bS.prototype.readdir=function(a){return this.fs.readdirSync(this.nm(a))};bS.prototype.is_dir=function(a){return this.fs.statSync(this.nm(a)).isDirectory()?1:0};bS.prototype.unlink=function(a){var
b=this.fs.existsSync(this.nm(a))?1:0;this.fs.unlinkSync(this.nm(a));return b};bS.prototype.open=function(f,c){var
a=require("constants"),b=0;for(var
e
in
c)switch(e){case"rdonly":b|=a.O_RDONLY;break;case"wronly":b|=a.O_WRONLY;break;case"append":b|=a.O_WRONLY|a.O_APPEND;break;case"create":b|=a.O_CREAT;break;case"truncate":b|=a.O_TRUNC;break;case"excl":b|=a.O_EXCL;break;case"binary":b|=a.O_BINARY;break;case"text":b|=a.O_TEXT;break;case"nonblock":b|=a.O_NONBLOCK;break}var
d=this.fs.openSync(this.nm(f),b);return new
bT(d)};bS.prototype.rename=function(b,a){this.fs.renameSync(this.nm(b),this.nm(a))};bS.prototype.constructor=bS;var
dh=dQ.match(/[^\/]*\//)[0],dV=[];if(typeof
module!=="undefined"&&module.exports&&typeof
require!=="undefined")dV.push({path:dh,device:new
bS(dh)});else
dV.push({path:dh,device:new
bq(dh)});dV.push({path:dh+lZ,device:new
bq(dh+lZ)});function
Q_(b){var
f=QE(b),b=f.join(b8),e=b+b8,c;for(var
d=0;d<dV.length;d++){var
a=dV[d];if(e.search(a.path)==0&&(!c||c.path.length<a.path.length))c={path:a.path,device:a.device,rest:b.substring(a.path.length,b.length)}}return c}function
m1(e,f){var
b=bH[e],d=a(f),c=w(d);b.file.write(b.offset,d,0,c);b.offset+=c;return 0}function
Q4(a){var
b=ag;if(b.process&&b.process.stdout&&b.process.stdout.write)b.process.stderr.write(a);else{if(a.charCodeAt(a.length-1)==10)a=a.substr(0,a.length-1);var
c=b.console;c&&c.error&&c.error(a)}}function
Q5(a){var
b=ag;if(b.process&&b.process.stdout&&b.process.stdout.write)b.process.stdout.write(a);else{if(a.charCodeAt(a.length-1)==10)a=a.substr(0,a.length-1);var
c=b.console;c&&c.log&&c.log(a)}}function
fg(c,e,d,a){if(W.fds===undefined)W.fds=new
Array();a=a?a:{};var
b={};b.file=d;b.offset=a.append?d.length():0;b.flags=a;b.output=e;W.fds[c]=b;if(!W.fd_last_idx||c>W.fd_last_idx)W.fd_last_idx=c;return c}function
Rc(c,b,g){var
a={};while(b){switch(b[1]){case
0:a.rdonly=1;break;case
1:a.wronly=1;break;case
2:a.append=1;break;case
3:a.create=1;break;case
4:a.truncate=1;break;case
5:a.excl=1;break;case
6:a.binary=1;break;case
7:a.text=1;break;case
8:a.nonblock=1;break}b=b[2]}if(a.rdonly&&a.wronly)bu(c.toString()+k_);if(a.text&&a.binary)bu(c.toString()+lq);var
d=Q_(c),e=d.device.open(d.rest,a),f=W.fd_last_idx?W.fd_last_idx:0;return fg(f+1,m1,e,a)}fg(0,m1,new
aE(cJ(0)));fg(1,Q5,new
aE(cJ(0)));fg(2,Q4,new
aE(cJ(0)));function
QH(c){var
b=W.fds[c];if(b.flags.wronly)bu(lQ+c+" is writeonly");var
a={file:b.file,offset:b.offset,fd:c,opened:true,out:false,refill:null};bH[a.fd]=a;return a.fd}function
mU(c){var
b=W.fds[c];if(b.flags.rdonly)bu(lQ+c+" is readonly");var
a={file:b.file,offset:b.offset,fd:c,opened:true,out:true,buffer:p};bH[a.fd]=a;return a.fd}function
QI(){var
b=0;for(var
a=0;a<bH.length;a++)if(bH[a]&&bH[a].opened&&bH[a].out)b=[0,bH[a].fd,b];return b}function
QJ(g,d,h,f){var
a=bH[g];if(!a.opened)bu("Cannot output to a closed channel");var
c;if(h==0&&w(d)==f)c=d;else{c=cJ(f);bF(d,h,c,0,f)}var
b=c.toString(),e=b.lastIndexOf("\n");if(e<0)a.buffer+=b;else{a.buffer+=b.substr(0,e+1);hf(g);a.buffer+=b.substr(e+1)}return 0}function
b9(b,a){if(a==0)fd();return b%a}if(!Math.imul)Math.imul=function(b,a){a|=0;return((b>>16)*a<<16)+(b&A)*a|0};var
aL=Math.imul;function
cM(a,b){return+(cH(a,b,false)!=0)}function
QL(b,a){b[0]=a;return 0}function
cN(a){return a
instanceof
Array?a[0]:a
instanceof
bj?lY:gX}function
QQ(){return 0}function
bv(c,b,a){W[c+1]=b;if(a)W[a]=b}var
mW={};function
QR(a,b){mW[e_(a)]=b;return 0}function
QS(a,b){if(a===b)return 1;a.t&6&&cI(a);b.t&6&&cI(b);return a.c==b.c?1:0}function
at(a,b){return 1-QS(a,b)}function
QU(){return eG/4|0}function
QV(){var
a=ag,f="a.out",b=[];if(a.process&&a.process.argv&&a.process.argv.length>1){var
c=a.process.argv;f=c[1];b=dW(c,2,c.length-2)}var
g=bk(f),e=[0,g];for(var
d=0;d<b.length;d++)e.push(bk(b[d]));return[0,g,e]}function
QW(){return[0,a("Unix"),32,0]}function
QO(){mZ(W.Not_found)}function
ff(c){var
a=ag,b=c.toString();if(a.process&&a.process.env&&a.process.env[b]!=undefined)return bk(a.process.env[b]);QO()}function
hj(a){var
b=1;while(a&&a.joo_tramp){a=a.joo_tramp.apply(null,a.joo_args);b++}return a}function
au(b,a){return{joo_tramp:b,joo_args:a}}function
QY(c,a){if(typeof
a==="function"){c.fun=a;return 0}if(a.fun){c.fun=a.fun;return 0}var
b=a.length;while(b--)c[b]=a[b];return 0}function
m0(a){return a}function
mV(a){return mW[a]}function
a1(a){if(a
instanceof
Array)return a;if(ag.RangeError&&a
instanceof
ag.RangeError&&a.message&&a.message.match(/maximum call stack/i))return m0(W.Stack_overflow);if(ag.InternalError&&a
instanceof
ag.InternalError&&a.message&&a.message.match(/too much recursion/i))return m0(W.Stack_overflow);if(a
instanceof
ag.Error&&mV(gI))return[0,mV(gI),a];return[0,W.Failure,bk(String(a))]}function
bV(c,d,b){for(var
a=b-1;a>=0;a--)if(c[d+a]!=0)return a+1;return 1}function
cO(b,d,h,c,e,i){var
f=bV(b,d,h),g=bV(c,e,i);if(f>g)return 1;if(f<g)return-1;for(var
a=h-1;a>=0;a--){if(b[d+a]>c[e+a])return 1;if(b[d+a]<c[e+a])return-1}return 0}function
aM(c){var
b=[-1,-1];for(var
a=2;a<c+2;a++)b[a]=-1;return b}function
fh(c,d,f,e){var
b=e==1?0:1;for(var
a=0;a<f;a++){c[d+a]-=b;if(c[d+a]>=0){b=0;break}else{c[d+a]+=aJ;b=1}}return b==1?0:1}function
m4(e,b,a){var
d=e*cE+(b>>>16),f=Math.floor(d/a)*cE,g=d%a*cE,c=g+(b&A);return[f+Math.floor(c/a),c%a]}function
hk(h,k,i,l,d,e,c,g,j){var
b=d[e+c-1];for(var
a=c-2;a>=0;a--){var
f=m4(b,d[e+a],g[j]);h[k+a]=f[0];b=f[1]}i[l]=b;return 0}function
m6(c,d){var
a=c[d],b=0;if(a&4294901760){b+=16;a>>>=16}if(a&65280){b+=8;a>>>=8}if(a&gU){b+=4;a>>>=4}if(a&12){b+=2;a>>>=2}if(a&2){b+=1;a>>>=1}if(a&1)b+=1;return 32-b}function
hn(b,d,i,c,e,f){if(f==0){c[e]=0;return 0}var
g=0;for(var
a=0;a<i;a++){var
h=b[d+a];b[d+a]=h<<f|g;if(b[d+a]<0)b[d+a]+=aJ;g=h>>>32-f}c[e]=g;if(c[e]<0)c[e]+=aJ;return 0}function
ho(b,d,i,c,e,f){if(f==0){c[e]=0;return 0}var
g=0;for(var
a=i-1;a>=0;a--){var
h=b[d+a];b[d+a]=h>>>f|g;if(b[d+a]<0)b[d+a]+=aJ;g=h<<32-f}c[e]=g;if(c[e]<0)c[e]+=aJ;return 0}function
dj(c,d,b){for(var
a=0;a<b;a++)c[d+a]=0;return 0}function
fi(c,d,g,h,i,e,k,l){var
b=0,f=k[l];for(var
a=0;a<e;a++){c[d+a]+=h[i+a]*(f&A)+b;var
j=h[i+a]*(f>>>16);b=Math.floor(j/cE);c[d+a]+=j%cE*cE;b+=Math.floor(c[d+a]/aJ);c[d+a]%=aJ}return e<g&&b?e9(c,d+e,g-e,[b],0,1,0):b}function
dX(c,d,g,h,i,e,f){var
b=f==1?0:1;for(var
a=0;a<e;a++){c[d+a]-=h[i+a]+b;if(c[d+a]>=0)b=0;else{c[d+a]+=aJ;b=1}}return fh(c,d+e,g-e,b==1?0:1)}function
Q1(b,c,j,e,f,a){if(a==1){hk(b,c+1,b,c,b,c,j,e,f);return 0}var
h=m6(e,f+a-1);hn(e,f,a,[0],0,h);hn(b,c,j,[0],0,h);var
k=e[f+a-1]+1,i=aM(a+1);for(var
d=j-1;d>=a;d--){var
g=k==aJ?b[c+d]:m4(b[c+d],b[c+d-1],k)[0];dj(i,0,a+1);fi(i,0,a+1,e,f,a,[g],0);dX(b,c+d-a,a+1,i,0,a+1,1);while(b[c+d]!=0||cO(b,c+d-a,a,e,f,a)>=0){g=g+1;dX(b,c+d-a,a+1,e,f,a,1)}b[c+d]=g}ho(b,c,a,[0],0,h);ho(e,f,a,[0],0,h);return 0}function
Q2(){return 0}function
m5(a,b){return a[b]<aJ/4}function
Q3(a,b){return a[b]==0}function
fj(f,i,c,g,j,d,h,k,e){var
b=0;for(var
a=0;a<e;a++)b+=fi(f,i+a,c-a,g,j,d,h,k+a);return b}function
fk(a,b){return a[b]}function
hl(a,b){return a[b]}function
aS(a,b,c){a[b]=c;if(a[b]<0)a[b]+=aJ;return 0}function
hm(a,b,c){a[b]=c;if(a[b]<0)a[b]+=aJ;return 0}function
m7(c,d,b,f,g,e){var
a=0;a+=e9(c,d,b,c,d,b,0);a+=fj(c,d,b,f,g,e,f,g,e);return a}function
d(a,b){return a.length==1?a(b):bG(a,[b])}function
b(a,b,c){return a.length==2?a(b,c):bG(a,[b,c])}function
h(a,b,c,d){return a.length==3?a(b,c,d):bG(a,[b,c,d])}function
B(a,b,c,d,e){return a.length==4?a(b,c,d,e):bG(a,[b,c,d,e])}function
G(a,b,c,d,e,f){return a.length==5?a(b,c,d,e,f):bG(a,[b,c,d,e,f])}function
N(a,b,c,d,e,f,g){return a.length==6?a(b,c,d,e,f,g):bG(a,[b,c,d,e,f,g])}function
V(a,b,c,d,e,f,g,h){return a.length==7?a(b,c,d,e,f,g,h):bG(a,[b,c,d,e,f,g,h])}function
kK(a,b,c,d,e,f,g,h,i){return a.length==8?a(b,c,d,e,f,g,h,i):bG(a,[b,c,d,e,f,g,h,i])}var
hW=[J,a(lL),-1],hw=[J,a(l7),-2],bW=[J,a(l9),-3],dk=[J,a(mj),-4],fl=[J,a(l_),-5],fI=[J,a(gO),-6],bY=[J,a(mm),-7],hY=[J,a(k0),-8],hX=[J,a(mn),-9],E=[J,a(mw),gN],hZ=[J,a(lW),ck],hJ=[j,0,0,bO],Qc=[4,0,0,0,0],fw=[0,[11,a('File "'),[2,0,[11,a('", line '),[4,0,0,0,[11,a(md),[4,0,0,0,[12,45,[4,0,0,0,[11,a(lw),[2,0,0]]]]]]]]]],a('File "%s", line %d, characters %d-%d: %s')],kt=[0,0],Qd=[12,41,0],ju=[0,[0,a(eC),43],[0,[0,a(g1),ck],0]],jv=[0,[0,a(eC),[j,43,0,0]],[0,[0,a(g1),[j,lr,n,A]],0]],jy=[0,[0,-3,a("-3.")],[0,[0,-0,a("-0.")],[0,[0,0,a("0.")],[0,[0,1,a("1.")],[0,[0,15,a("15.")],0]]]]],jz=[0,[0,a(U),0],[0,[0,a(cj),1],[0,[0,a("1.0"),1],[0,[0,a(lS),-1],[0,[0,a(lz),gX],0]]]]],jA=[0,[0,0,0],[0,[0,1,0],[0,[0,2,0],[0,[0,3,0],[0,[0,4,0],0]]]]],jL=[0,[0,0,a(e2)],[0,[0,1,a(eD)],0]],jN=[0,[0,-3,a(e3)],[0,[0,0,a(U)],[0,[0,0,a(U)],[0,[0,1,a(cj)],[0,[0,15,a(e0)],0]]]]],jO=[0,[0,a(U),0],[0,[0,a(cj),1],[0,[0,a(lS),-1],[0,[0,a(lz),gX],0]]]],jS=[0,[0,a(eC),43],[0,[0,a(g1),ck],0]],bA=[0,[0,0,1,0]],ar=[0,[0,0,1,[2,[0,0,3,0]]]],as=[0,[0,[2,[0,0,1,0]],3,0]],aX=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],I=[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],ay=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,[2,[0,0,7,0]]]]]],aB=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],aC=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],aD=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,0]]]],S=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,[2,[0,0,9,0]]]]]],Y=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Z=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],_=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],$=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],aa=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],ab=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],ac=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],a4=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]]]],a5=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,[2,[0,0,9,0]],11,0]]]]]],a6=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,[2,[0,0,7,0]]]],9,[0,[0,0,11,0]]]]]],a7=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,[2,[0,0,5,0]],7,0]],9,[0,[0,0,11,0]]]]]],a8=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],a9=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],a_=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],a$=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],ba=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],bb=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],bc=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],bd=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],be=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,[2,[0,0,7,0]]]]]],9,[0,[0,0,11,0]]]],bf=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],9,[0,[0,0,11,0]]]],bg=[0,[0,[2,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],bh=[0,[0,[2,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]];bv(11,hZ,lW);bv(10,E,mw);bv(9,[J,a(lg),c8],lg);bv(8,hX,mn);bv(7,hY,k0);bv(6,bY,mm);bv(5,fI,gO);bv(4,fl,l_);bv(3,dk,mj);bv(2,bW,l9);bv(1,hw,l7);bv(0,hW,lL);var
nl=a("input"),nk=a("output_substring"),ng=a(lE),nf=a(cF),nc=a(e2),nd=a(eD),ne=a("bool_of_string"),na=a(eD),nb=a(e2),m8=a("Pervasives.Exit"),m9=[j,0,0,mk],m_=[j,0,0,65520],m$=[j,1,0,mk],nt=a("List.for_all2"),nq=a("nth"),nr=a("List.nth"),np=a("tl"),no=a("hd"),nv=a("\\\\"),nw=a("\\'"),nx=a("\\b"),ny=a("\\t"),nz=a("\\n"),nA=a("\\r"),nu=a("Char.chr"),nD=a("String.blit / Bytes.blit_string"),nC=a("Bytes.blit"),nB=a("String.sub / Bytes.sub"),nG=a("String.contains_from / Bytes.contains_from"),nJ=a("Array.sub"),nS=a(dc),n5=a(dc),n2=[j,0,0,0],n0=[j,1,0,0],nY=[j,1,0,0],nV=[j,0,0,0],nW=[j,1,0,0],n3=[j,n,n,mr],oe=a(dc),oh=a("CamlinternalLazy.Undefined"),ok=[0,a(kL),53,12],ol=[0,0],om=[0,a(kL),82,12],oo=a("Buffer.add_substring/add_subbytes"),on=a("Buffer.add: cannot grow buffer"),ox=a("%c"),oy=a("%s"),oz=a(lU),oA=a(kY),oB=a(mi),oC=a(l5),oD=a(lm),oE=a("%B"),oF=a("%{"),oG=a("%}"),oH=a("%("),oI=a("%)"),oJ=a("%a"),oK=a("%t"),oL=a("%?"),oM=a("%r"),oN=a("%_r"),oO=[0,a(ao),846,23],oZ=[0,a(ao),810,21],oR=[0,a(ao),811,21],o0=[0,a(ao),814,21],oS=[0,a(ao),815,21],o1=[0,a(ao),818,19],oT=[0,a(ao),819,19],o2=[0,a(ao),822,22],oU=[0,a(ao),823,22],o3=[0,a(ao),827,30],oV=[0,a(ao),828,30],oX=[0,a(ao),832,26],oP=[0,a(ao),833,26],oY=[0,a(ao),842,28],oQ=[0,a(ao),843,28],oW=[0,a(ao),847,23],p6=a(lc),p4=[0,a(ao),1525,4],p5=a("Printf: bad conversion %["),p7=[0,a(ao),1593,39],p8=[0,a(ao),1616,31],p9=[0,a(ao),1617,31],p_=a("Printf: bad conversion %_"),p$=a(k$),qa=a(lj),qb=a(k$),qc=a(lj),p1=a(gW),p2=a(cF),pZ=a("neg_infinity"),p0=a(mD),pU=a(lE),pH=a("%nd"),pI=a("%+nd"),pJ=a("% nd"),pK=a(mi),pL=a("%+ni"),pM=a("% ni"),pN=a("%nx"),pO=a("%#nx"),pP=a("%nX"),pQ=a("%#nX"),pR=a("%no"),pS=a("%#no"),pT=a("%nu"),pu=a("%ld"),pv=a("%+ld"),pw=a("% ld"),px=a(kY),py=a("%+li"),pz=a("% li"),pA=a("%lx"),pB=a("%#lx"),pC=a("%lX"),pD=a("%#lX"),pE=a("%lo"),pF=a("%#lo"),pG=a("%lu"),ph=a("%Ld"),pi=a("%+Ld"),pj=a("% Ld"),pk=a(l5),pl=a("%+Li"),pm=a("% Li"),pn=a("%Lx"),po=a("%#Lx"),pp=a("%LX"),pq=a("%#LX"),pr=a("%Lo"),ps=a("%#Lo"),pt=a("%Lu"),o6=a(dc),o7=a("%+d"),o8=a("% d"),o9=a(lU),o_=a("%+i"),o$=a("% i"),pa=a("%x"),pb=a("%#x"),pc=a("%X"),pd=a("%#X"),pe=a("%o"),pf=a("%#o"),pg=a(lc),op=a("@]"),oq=a("@}"),or=a("@?"),os=a("@\n"),ot=a("@."),ou=a("@@"),ov=a("@%"),ow=a("@"),o4=a("CamlinternalFormat.Type_mismatch"),qg=a(p),qh=[0,[11,a(ae),[2,0,[2,0,0]]],a(", %s%s")],qA=[0,[2,0,[12,10,0]],a("%s\n")],qB=a("(Program not linked with -g, cannot print stack backtrace)\n"),qs=a("Raised at"),qt=a("Re-raised at"),qu=a("Raised by primitive operation at"),qv=a("Called from"),qw=a(" (inlined)"),qy=a(p),qx=[0,[2,0,[11,a(' file "'),[2,0,[12,34,[2,0,[11,a(", line "),[4,0,0,0,[11,a(md),[4,0,0,0,[12,45,Qc]]]]]]]]]],a('%s file "%s"%s, line %d, characters %d-%d')],qz=[0,[2,0,[11,a(" unknown location"),0]],a("%s unknown location")],qn=a("Out of memory"),qo=a("Stack overflow"),qp=a("Pattern matching failed"),qq=a("Assertion failed"),qr=a("Undefined recursive module"),qj=[0,[12,40,[2,0,[2,0,[12,41,0]]]],a("(%s%s)")],qk=a(p),ql=a(p),qm=[0,[12,40,[2,0,[12,41,0]]],a("(%s)")],qf=[0,[4,0,0,0,0],a(dc)],qd=[0,[3,0,0],a(la)],qe=a("_"),qC=a("x"),Qa=a("OCAMLRUNPARAM"),P_=a("CAMLRUNPARAM"),qD=a(p),qT=[3,0,3],qU=a(cF),qP=a(mF),qQ=a("</"),qM=a(mF),qN=a("<"),qK=a(kP),qE=a("Format.Empty_queue"),qJ=[0,a(p)],q2=a(b5),P9=a("TMPDIR"),P8=a("TEMP"),q4=a("Cygwin"),q5=a("Win32"),q_=a("Js.Error"),q$=a(gI),rl=a("invalid digit"),rk=a("number too long"),rh=a("nat_of_int"),rf=a("int_of_nat"),re=a("make_nat"),rO=[0,a("big_int.ml"),879,2],rN=[j,1,0,0],rM=a("shift_right_big_int"),rL=a("two_power_m1_big_int"),rK=a("shift_right_towards_zero_big_int"),rJ=a("shift_left_big_int"),rH=a("power_big_int_positive_int"),rG=a(g0),rF=a(g0),rE=a(g0),rD=a(b5),rC=a(g2),rB=[j,n,j,0],rw=[j,n,j,0],rx=[j,0,0,0],ry=a(g2),rz=[j,0,0,0],rA=a(g2),rt=[j,0,0,0],ru=[j,0,0,0],rv=[j,0,0,0],rr=a("int_of_big_int"),Mj=[0,a(kP)],LZ=[0,[11,a(c9),0],a(c9)],LD=[0,a("TestingTests.Tests.TestException0")],LE=[0,a("TestingTests.Tests.TestException0'")],LF=[0,[11,a("TestingTests.Tests.TestException1("),[3,0,[12,41,0]]],a("TestingTests.Tests.TestException1(%S)")],Lr=[0,[3,0,[12,32,[3,0,0]]],a("%S %S")],Lm=[0,0,0],KL=[0,a(ae)],KM=[0,[11,a("Broken binary heap invariants: "),[2,0,0]],a("Broken binary heap invariants: %s")],KK=a("IsMaxHeap"),I7=[0,[11,a(dO),[2,0,[12,32,[4,3,0,0,0]]]],a("add %s %i")],II=[0,[11,a("replace "),[2,0,[12,32,[4,3,0,0,0]]]],a("replace %s %i")],IH=[0,[11,a("try_get "),[2,0,[12,32,[4,3,0,0,0]]]],a("try_get %s %i")],F_=[0,[11,a("remove "),[2,0,[12,32,[4,3,0,0,0]]]],a("remove %s %i")],F8=[0,[11,a(af),0],a(af)],F7=[0,[11,a(af),0],a(af)],F0=[0,[11,a(af),0],a(af)],F1=[0,0,0],F3=[0,1,1],F4=[0,[11,a(af),0],a(af)],F5=[0,[11,a(af),0],a(af)],F6=[0,[11,a(af),0],a(af)],F2=[0,[11,a(af),0],a(af)],FZ=[0,[11,a(af),0],a(af)],FY=[0,[11,a(af),0],a(af)],FX=[0,[11,a(af),0],a(af)],FW=[0,[11,a(af),0],a(af)],FT=[0,0],FU=[0,1],FP=[0,a(ae)],FQ=[0,[11,a("Broken red-black tree invariants: "),[2,0,0]],a("Broken red-black tree invariants: %s")],FL=a("HasBlackRoot"),FM=a("IsRedBlack"),FN=a("IsBlackBalanced"),FO=a("IsBinarySearchTree"),FE=a("Empty"),FF=a("EmptyPlus"),FG=[0,[11,a("Black {l="),[2,0,[11,a(gJ),[2,0,[11,a(gY),[2,0,[12,ch,0]]]]]]],a("Black {l=%s; v=%s; r=%s}")],FH=[0,[11,a("BlackPlus {l="),[2,0,[11,a(gJ),[2,0,[11,a(gY),[2,0,[12,ch,0]]]]]]],a("BlackPlus {l=%s; v=%s; r=%s}")],FI=[0,[11,a("Red {l="),[2,0,[11,a(gJ),[2,0,[11,a(gY),[2,0,[12,ch,0]]]]]]],a("Red {l=%s; v=%s; r=%s}")],C5=[0,[11,a("Int.exponentiate: Negative exponent: "),[4,3,0,0,0]],a("Int.exponentiate: Negative exponent: %i")],y_=[0,[11,a(lD),[4,3,0,0,[11,a(" - 2 ^ "),[4,3,0,0,0]]]],a("2 ^ %i - 2 ^ %i")],y9=[0,[11,a(lD),[4,3,0,0,0]],a("2 ^ %i")],yj=[0,[11,a("BigInt.exponentiate: Negative exponent: "),[4,3,0,0,0]],a("BigInt.exponentiate: Negative exponent: %i")],ye=[0,[8,0,0,0,0],a(lm)],w_=[0,[2,0,[11,a(".exponentiate: Negative exponent: "),[4,3,0,0,0]]],a("%s.exponentiate: Negative exponent: %i")],w9=[0,[2,0,[2,0,0]],a("%s%s")],wW=a("Integer"),wT=[0,[11,a(ld),[2,0,0]],a(li)],wU=[0,[11,a(ld),[2,0,0]],a(li)],wP=a("to_float one"),wQ=a("to_int one"),wR=a("to_float zero"),wS=a("to_int zero"),wV=a("RealNumber"),wM=a(cj),wN=a(U),wO=a("Number"),wL=a(c_),wK=a(c_),wJ=a(c_),wI=a(c_),wH=a(c_),wG=a(c_),wF=a(c5),wE=a(c5),wD=a(c5),wC=a(c5),wB=a(c5),wA=a(c5),wv=[0,1,[0,6,[0,3,[0,-1,0]]]],ww=[0,2,[0,7,[0,4,[0,0,0]]]],ws=[0,1,[0,6,[0,3,[0,-1,0]]]],wt=[0,1,[0,7,[0,5,[0,2,0]]]],wp=[0,1,[0,6,[0,3,[0,-1,0]]]],wq=[0,43,[0,48,[0,j,[0,755,0]]]],wm=[0,1,[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]]],wn=[0,3,[0,15,[0,9,0]]],wj=[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]],wk=[0,3,[0,15,0]],wg=[0,2,[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]]],wh=[0,3,[0,9,0]],wd=[0,1,[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]]],we=[0,4,[0,16,[0,10,0]]],wa=[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]],wb=[0,4,[0,16,0]],v9=[0,2,[0,3,[0,4,[0,15,[0,9,[0,7,0]]]]]],v_=[0,4,[0,10,0]],v6=[0,1,[0,2,[0,0,[0,3,[0,4,0]]]]],v7=[0,1,[0,2,[0,4,[0,3,[0,6,[0,9,[0,4,[0,8,[0,12,[0,16,0]]]]]]]]]],v3=[0,1,[0,2,[0,0,[0,3,[0,4,0]]]]],v4=[0,1,[0,3,[0,6,[0,6,[0,12,[0,18,[0,8,[0,16,[0,24,[0,32,0]]]]]]]]]],v0=[0,1,[0,2,[0,0,[0,3,[0,4,0]]]]],v1=[0,43,[0,86,[0,88,[0,j,[0,258,[0,261,[0,1012,[0,1016,[0,lh,[0,bR,0]]]]]]]]]],v2=a("flat_map_acc"),v5=a("flat_map_i"),v8=a("flat_map"),v$=a("filter_map_acc"),wc=a("filter_map_i"),wf=a("filter_map"),wi=a("filter_acc"),wl=a("filter_i"),wo=a("filter"),wr=a("map_acc"),wu=a("map_i"),wx=a("map"),wy=a("FilterMapable.ToContainer"),vR=[0,[2,0,[11,a(lp),[2,0,0]]],a(ls)],vS=[0,[11,a(lf),[2,0,[12,32,[2,0,0]]]],a(ms)],vT=[0,[2,0,[11,a(lp),[2,0,0]]],a(ls)],vU=[0,[11,a(lf),[2,0,[12,32,[2,0,0]]]],a(ms)],vV=[0,[2,0,[11,a(eQ),[2,0,0]]],a(eu)],vW=[0,[2,0,[11,a(eQ),[2,0,0]]],a(eu)],vX=[0,[11,a(dO),[2,0,[12,32,[2,0,0]]]],a(ey)],vY=[0,[11,a(dO),[2,0,[12,32,[2,0,0]]]],a(ey)],vD=[0,[11,a(lM),[2,0,0]],a(kZ)],vE=[0,[11,a(lM),[2,0,0]],a(kZ)],vF=[0,[2,0,[11,a(eQ),[2,0,0]]],a(eu)],vG=[0,[2,0,[11,a(eQ),[2,0,0]]],a(eu)],vH=[0,[11,a(dO),[2,0,[12,32,[2,0,0]]]],a(ey)],vI=[0,[11,a(dO),[2,0,[12,32,[2,0,0]]]],a(ey)],vJ=[0,[11,a(lX),[2,0,0]],a(lP)],vK=[0,[11,a(lX),[2,0,0]],a(lP)],vL=[0,[11,a(mx),[2,0,0]],a(lC)],vM=[0,[11,a(mx),[2,0,0]],a(lC)],vN=[0,[12,45,[2,0,0]],a(k4)],vO=[0,[12,45,[2,0,0]],a(k4)],vP=[0,[11,a(lG),[2,0,0]],a(ln)],vQ=[0,[11,a(lG),[2,0,0]],a(ln)],vB=[0,[2,0,[11,a(" * "),[2,0,0]]],a("%s * %s")],vC=[0,[11,a("multiply "),[2,0,[12,32,[2,0,0]]]],a("multiply %s %s")],vz=[0,[2,0,[11,a(" / "),[2,0,0]]],a("%s / %s")],vA=[0,[11,a("divide "),[2,0,[12,32,[2,0,0]]]],a("divide %s %s")],vx=[0,[2,0,[11,a(" ** "),[21,1,0]]],a("%s ** %n")],vy=[0,[11,a("exponentiate "),[2,0,[12,32,[21,1,0]]]],a("exponentiate %s %n")],vZ=a("Ringoid"),vu=[0,[11,a("pred "),[2,0,0]],a("pred %s")],vv=[0,[11,a("succ "),[2,0,0]],a("succ %s")],vw=a("PredSucc"),vr=[0,[11,a("try_of_string "),[3,0,0]],a("try_of_string %S")],vs=[0,[11,a("of_string "),[3,0,0]],a("of_string %S")],vt=a("Parsable"),vp=[0,[11,a("to_string "),[2,0,0]],a("to_string %s")],vq=a("Displayable"),u4=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],u5=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],u6=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],u7=[0,[2,0,[11,a(e1),[2,0,0]]],a(eK)],u8=[0,[2,0,[11,a(eM),[2,0,0]]],a(eE)],u9=[0,[2,0,[11,a(et),[2,0,0]]],a(eA)],u_=[0,[2,0,[11,a(eN),[2,0,0]]],a(e6)],u$=[0,[11,a(eS),[2,0,[12,32,[2,0,0]]]],a(eY)],va=[0,[11,a(eF),[2,0,[12,32,[2,0,0]]]],a(eB)],vb=[0,[11,a(e7),[2,0,[12,32,[2,0,0]]]],a(eX)],vc=[0,[11,a(ev),[2,0,[12,32,[2,0,0]]]],a(e5)],vd=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],ve=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],vf=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],vg=[0,[2,0,[11,a(e1),[2,0,0]]],a(eK)],vh=[0,[2,0,[11,a(eM),[2,0,0]]],a(eE)],vi=[0,[2,0,[11,a(et),[2,0,0]]],a(eA)],vj=[0,[2,0,[11,a(eN),[2,0,0]]],a(e6)],vk=[0,[11,a(eS),[2,0,[12,32,[2,0,0]]]],a(eY)],vl=[0,[11,a(eF),[2,0,[12,32,[2,0,0]]]],a(eB)],vm=[0,[11,a(e7),[2,0,[12,32,[2,0,0]]]],a(eX)],vn=[0,[11,a(ev),[2,0,[12,32,[2,0,0]]]],a(e5)],uy=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uz=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uA=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uB=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uC=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],uD=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],uE=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],uF=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],uG=[0,[2,0,[11,a(e1),[2,0,0]]],a(eK)],uH=[0,[2,0,[11,a(eM),[2,0,0]]],a(eE)],uI=[0,[2,0,[11,a(et),[2,0,0]]],a(eA)],uJ=[0,[2,0,[11,a(eN),[2,0,0]]],a(e6)],uK=[0,[11,a(eS),[2,0,[12,32,[2,0,0]]]],a(eY)],uL=[0,[11,a(eF),[2,0,[12,32,[2,0,0]]]],a(eB)],uM=[0,[11,a(e7),[2,0,[12,32,[2,0,0]]]],a(eX)],uN=[0,[11,a(ev),[2,0,[12,32,[2,0,0]]]],a(e5)],uO=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uP=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uQ=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uR=[0,[11,a(bP),[2,0,[12,32,[2,0,0]]]],a(bQ)],uS=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],uT=[0,[11,a(c$),[2,0,[12,32,[2,0,0]]]],a(c6)],uU=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],uV=[0,[11,a(db),[2,0,[12,32,[2,0,0]]]],a(dd)],uW=[0,[2,0,[11,a(e1),[2,0,0]]],a(eK)],uX=[0,[2,0,[11,a(eM),[2,0,0]]],a(eE)],uY=[0,[2,0,[11,a(et),[2,0,0]]],a(eA)],uZ=[0,[2,0,[11,a(eN),[2,0,0]]],a(e6)],u0=[0,[11,a(eS),[2,0,[12,32,[2,0,0]]]],a(eY)],u1=[0,[11,a(eF),[2,0,[12,32,[2,0,0]]]],a(eB)],u2=[0,[11,a(e7),[2,0,[12,32,[2,0,0]]]],a(eX)],u3=[0,[11,a(ev),[2,0,[12,32,[2,0,0]]]],a(e5)],vo=a("Comparable"),ua=[0,[2,0,[11,a(eZ),[2,0,0]]],a(eI)],ub=[0,[2,0,[11,a(ew),[2,0,0]]],a(eP)],uc=[0,[11,a(eU),[2,0,[12,32,[2,0,0]]]],a(eW)],ud=[0,[11,a(eJ),[2,0,[12,32,[2,0,0]]]],a(eT)],ue=[0,[2,0,[11,a(eZ),[2,0,0]]],a(eI)],uf=[0,[2,0,[11,a(ew),[2,0,0]]],a(eP)],ug=[0,[11,a(eU),[2,0,[12,32,[2,0,0]]]],a(eW)],uh=[0,[11,a(eJ),[2,0,[12,32,[2,0,0]]]],a(eT)],t4=[0,[2,0,[11,a(eZ),[2,0,0]]],a(eI)],t5=[0,[2,0,[11,a(ew),[2,0,0]]],a(eP)],t6=[0,[11,a(eU),[2,0,[12,32,[2,0,0]]]],a(eW)],t7=[0,[11,a(eJ),[2,0,[12,32,[2,0,0]]]],a(eT)],t8=[0,[2,0,[11,a(eZ),[2,0,0]]],a(eI)],t9=[0,[2,0,[11,a(ew),[2,0,0]]],a(eP)],t_=[0,[11,a(eU),[2,0,[12,32,[2,0,0]]]],a(eW)],t$=[0,[11,a(eJ),[2,0,[12,32,[2,0,0]]]],a(eT)],ui=a("Equatable"),tY=[0,[11,a("repr "),[2,0,0]],a("repr %s")],tZ=a("Representable"),tM=[0,[11,a("Single {label="),[3,0,[11,a("; status="),[2,0,[12,ch,0]]]]],a("Single {label=%S; status=%s}")],tN=[0,[11,a("Group {name="),[3,0,[11,a("; children="),[2,0,[11,a("; counts="),[2,0,[12,ch,0]]]]]]],a("Group {name=%S; children=%s; counts=%s}")],tP=[0,[2,0,[3,0,[11,a(lw),[2,0,0]]]],a("%s%S: %s")],tQ=a("  "),tR=[0,[2,0,[3,0,[11,a(mz),[4,3,0,0,[12,41,0]]]]],a("%s%S (Successes: %i)")],tS=[0,[2,0,[3,0,[11,a(mz),[4,3,0,0,[11,a(", failures: "),[4,3,0,0,[11,a(", errors: "),[4,3,0,0,[12,41,0]]]]]]]]],a("%s%S (Successes: %i, failures: %i, errors: %i)")],tT=a(p),tL=[0,[11,a("{successes="),[4,3,0,0,[11,a("; failures="),[4,3,0,0,[11,a("; errors="),[4,3,0,0,[12,ch,0]]]]]]],a("{successes=%i; failures=%i; errors=%i}")],tI=[0,1,0,0],tJ=[0,0,1,0],tK=[0,0,0,1],tw=a("OK"),tx=[0,[11,a("FAILED: expected "),[2,0,[11,a(", but got "),[2,0,0]]]],a("FAILED: expected %s, but got %s")],ty=[0,[11,a(c7),[2,0,[11,a(kV),0]]],a(le)],tz=[0,[11,a(c7),[2,0,[11,a(kV),0]]],a(le)],tA=[0,[11,a(c7),[2,0,[11,a(eR),[2,0,[11,a(g3),[2,0,0]]]]]],a(kN)],tB=[0,[11,a(c7),[2,0,[11,a(eR),[2,0,[11,a(gM),0]]]]],a(my)],tC=[0,[11,a(c7),[2,0,[11,a(eR),[2,0,[11,a(g3),[2,0,0]]]]]],a(kN)],tD=[0,[11,a(c7),[2,0,[11,a(eR),[2,0,[11,a(gM),0]]]]],a(my)],tE=[0,[11,a("FAILED: "),[2,0,0]],a("FAILED: %s")],tF=[0,[11,a(k3),[2,0,[11,a(g3),[2,0,0]]]],a("ERROR: exception %s raised\n%s")],tG=[0,[11,a(k3),[2,0,[11,a(gM),0]]],a("ERROR: exception %s raised (no backtrace)")],tt=a("Success"),tu=[0,[11,a("Failure ("),[2,0,[12,41,0]]],a("Failure (%s)")],tv=[0,[11,a("Error ("),[2,0,[11,a(ae),[2,0,[12,41,0]]]]],a("Error (%s, %s)")],tn=[0,[11,a("NotEqual ("),[3,0,[11,a(ae),[3,0,[12,41,0]]]]],a("NotEqual (%S, %S)")],to=[0,[11,a("NoException "),[2,0,0]],a("NoException %s")],tp=[0,[11,a("NoExceptionNamed "),[3,0,0]],a("NoExceptionNamed %S")],tq=[0,[11,a("WrongException ("),[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[12,41,0]]]]]]],a("WrongException (%s, %s, %s)")],tr=[0,[11,a("WrongExceptionNamed ("),[3,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[12,41,0]]]]]]],a("WrongExceptionNamed (%S, %s, %s)")],ts=[0,[11,a("Custom "),[3,0,0]],a("Custom %S")],s5=[0,[12,40,[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,Qd]]]]]]]]]],a("(%s, %s, %s, %s, %s)")],s4=[0,[12,40,[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[12,41,0]]]]]]]]],a("(%s, %s, %s, %s)")],s3=[0,[12,40,[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[12,41,0]]]]]]],a("(%s, %s, %s)")],s2=[0,[12,40,[2,0,[11,a(ae),[2,0,[12,41,0]]]]],a("(%s, %s)")],s1=[0,a(eH),54,6],s0=[0,a(eH),48,6],sX=a(e8),sY=[0,[12,91,[4,3,0,0,[11,a(" to "),[4,3,0,0,[11,a(" step "),[4,3,0,0,[12,93,0]]]]]]],a("[%i to %i step %i]")],sZ=[0,[12,91,[4,3,0,0,[11,a(" down to "),[4,3,0,0,[11,a(" step -"),[4,3,0,0,[12,93,0]]]]]]],a("[%i down to %i step -%i]")],sV=[0,a(eH),25,4],sW=[0,a(eH),31,4],sQ=[0,[3,0,0],a(la)],sJ=a(k8),sK=a(l3),sL=a(l$),sM=a(k1),sN=a(l8),sp=[0,[11,a("{filename="),[3,0,[11,a("; line_number="),[21,1,[11,a("; start_char="),[21,1,[11,a("; end_char="),[21,1,[12,ch,0]]]]]]]]],a("{filename=%S; line_number=%n; start_char=%n; end_char=%n}")],sm=[0,[12,91,[2,0,[12,93,0]]],a("[%s]")],sn=[0,a("; ")],sk=[0,[2,0,[2,0,[2,0,0]]],a("%s%s%s")],sj=a(p),sl=a(p),sd=[0,[11,a(mu),0],a(mu)],sc=[0,[11,a(lu),0],a(lu)],r_=[0,[11,a("Some "),[2,0,0]],a("Some %s")],r$=a(l6),tH=[0,0,0,0],tU=a("General.Testing.TestFailure"),tW=a(".js"),tX=a("General.Testing.NoExceptionRaised"),wX=a(ad),wZ=a(ad),w0=a(ad),w1=a(ci),w2=a(ad),w4=a(gO),w$=a("Int32"),xa=a("l"),xl=[0,[0,-3,a("-3l")],[0,[0,0,a(mg)],[0,[0,0,a(mg)],[0,[0,1,a("1l")],[0,[0,15,a("15l")],0]]]]],xm=[0,[0,-3,a(e3)],[0,[0,0,a(U)],[0,[0,0,a(U)],[0,[0,1,a(cj)],[0,[0,15,a(e0)],0]]]]],xn=[0,[0,0,0],[0,[0,1,0],[0,[0,2,0],0]]],xo=[0,[0,0,1],[0,[0,1,-1],0]],xp=[0,[0,c8,[0,-5,[0,-1,[0,0,[0,1,[0,2,[0,5,0]]]]]]],0],xq=[0,[0,4,3,7],[0,[0,4,-2,2],[0,[0,5,-7,-2],0]]],xr=[0,[0,4,-4],[0,[0,-7,7],0]],xs=[0,[0,4,3,12],[0,[0,4,-3,ck],[0,[0,-4,-3,12],0]]],xt=[0,[0,5,2,2],[0,[0,4,2,2],[0,[0,4,3,1],[0,[0,4,4,1],[0,[0,4,5,0],0]]]]],xu=[0,[0,3,3,27],[0,[0,2,7,al],0]],xv=[0,[0,1,2],[0,[0,42,43],[0,[0,gT,gQ],0]]],xA=a("Int64"),xB=a("L"),xD=[0,[0,[j,e4,n,A],a("-3L")],[0,[0,[j,0,0,0],a(lt)],[0,[0,[j,0,0,0],a(lt)],[0,[0,[j,1,0,0],a("1L")],[0,[0,[j,15,0,0],a("15L")],0]]]]],xE=[0,[0,[j,e4,n,A],a(e3)],[0,[0,[j,0,0,0],a(U)],[0,[0,[j,0,0,0],a(U)],[0,[0,[j,1,0,0],a(cj)],[0,[0,[j,15,0,0],a(e0)],0]]]]],xF=[0,[0,[j,0,0,0],0],[0,[0,[j,1,0,0],0],[0,[0,[j,2,0,0],0],0]]],xG=[0,[0,[j,0,0,0],[j,1,0,0]],[0,[0,[j,1,0,0],[j,n,n,A]],0]],xH=[0,[0,[j,16777206,n,A],[0,[j,16777211,n,A],[0,[j,n,n,A],[0,[j,0,0,0],[0,[j,1,0,0],[0,[j,2,0,0],[0,[j,5,0,0],0]]]]]]],0],xI=[0,[0,[j,4,0,0],[j,3,0,0],[j,7,0,0]],[0,[0,[j,4,0,0],[j,lI,n,A],[j,2,0,0]],[0,[0,[j,5,0,0],[j,lN,n,A],[j,lI,n,A]],0]]],xJ=[0,[0,[j,4,0,0],[j,k6,n,A]],[0,[0,[j,lN,n,A],[j,7,0,0]],0]],xK=[0,[0,[j,4,0,0],[j,3,0,0],[j,12,0,0]],[0,[0,[j,4,0,0],[j,e4,n,A],[j,lr,n,A]],[0,[0,[j,k6,n,A],[j,e4,n,A],[j,12,0,0]],0]]],xL=[0,[0,[j,5,0,0],[j,2,0,0],[j,2,0,0]],[0,[0,[j,4,0,0],[j,2,0,0],[j,2,0,0]],[0,[0,[j,4,0,0],[j,3,0,0],[j,1,0,0]],[0,[0,[j,4,0,0],[j,4,0,0],[j,1,0,0]],[0,[0,[j,4,0,0],[j,5,0,0],[j,0,0,0]],0]]]]],xM=[0,[0,[j,3,0,0],3,[j,27,0,0]],[0,[0,[j,2,0,0],7,[j,al,0,0]],0]],xN=[0,[0,[j,1,0,0],[j,2,0,0]],[0,[0,[j,42,0,0],[j,43,0,0]],[0,[0,[j,16777095,n,A],[j,16777096,n,A]],0]]],xU=[0,2,0],xV=[0,1,0],xW=[0,0,0],xY=[0,1,-1],xZ=[0,0,1],x1=[0,[0,c8,[0,-5,[0,-1,[0,-0.2,[0,0,[0,0.7,[0,1,[0,2,[0,5,0]]]]]]]]],0],x2=[0,[0,4,3,7],[0,[0,4,-2,2],[0,[0,5,-7,-2],0]]],x3=[0,[0,4,-4],[0,[0,-7,7],0]],x4=[0,[0,4,3,12],[0,[0,4,-3,ck],[0,[0,-4,-3,12],0]]],x5=[0,[0,5,2,2.5],[0,[0,4,2,2],[0,[0,1,4,0.25],[0,[0,4,4,1],[0,[0,4,5,0.8],0]]]]],x6=[0,[0,3,3,27],[0,[0,2,7,al],[0,[0,mG,4,mb],[0,[0,2,-4,mb],0]]]],x7=[0,[0,0,a(k8)],[0,[0,1,a(l3)],[0,[0,2,a(l$)],[0,[0,3,a(k1)],[0,[0,4,a(l8)],0]]]]],x8=[0,[0,0,1],0],x9=[0,[0,0,[0,1,[0,2,[0,3,[0,4,0]]]]],0],yL=a(gP),yO=a("10000000000"),y2=a(gP),y3=a(gP),y5=a("10"),y8=a("100000"),y$=a("89884656743115795386465259539451236680898848947115328636715040578866337902750481566354238661203768010560056939935696678829394884407208311246423715319737062188883946712432742638151109800623047059726541476042502884419075341171231440736956555270413618581675255342293149119973622969239858152417678164812112068608"),za=a("6739986666787659948666753771754907668409286105635143120275902562304"),zb=a("3369993333393829974333376885877453834204643052817571560137951281152"),zc=a("1684996666696914987166688442938726917102321526408785780068975640576"),zd=a("842498333348457493583344221469363458551160763204392890034487820288"),ze=a("421249166674228746791672110734681729275580381602196445017243910144"),zf=a("210624583337114373395836055367340864637790190801098222508621955072"),zg=a("105312291668557186697918027683670432318895095400549111254310977536"),zh=a("52656145834278593348959013841835216159447547700274555627155488768"),zi=a("26328072917139296674479506920917608079723773850137277813577744384"),zj=a("13164036458569648337239753460458804039861886925068638906788872192"),zk=a("6582018229284824168619876730229402019930943462534319453394436096"),zl=a("3291009114642412084309938365114701009965471731267159726697218048"),zm=a("1645504557321206042154969182557350504982735865633579863348609024"),zn=a("822752278660603021077484591278675252491367932816789931674304512"),zo=a("411376139330301510538742295639337626245683966408394965837152256"),zp=a("205688069665150755269371147819668813122841983204197482918576128"),zq=a("102844034832575377634685573909834406561420991602098741459288064"),zr=a("51422017416287688817342786954917203280710495801049370729644032"),zs=a("25711008708143844408671393477458601640355247900524685364822016"),zt=a("12855504354071922204335696738729300820177623950262342682411008"),zu=a("6427752177035961102167848369364650410088811975131171341205504"),zv=a("3213876088517980551083924184682325205044405987565585670602752"),zw=a("1606938044258990275541962092341162602522202993782792835301376"),zx=a("803469022129495137770981046170581301261101496891396417650688"),zy=a("401734511064747568885490523085290650630550748445698208825344"),zz=a("200867255532373784442745261542645325315275374222849104412672"),zA=a("100433627766186892221372630771322662657637687111424552206336"),zB=a("50216813883093446110686315385661331328818843555712276103168"),zC=a("25108406941546723055343157692830665664409421777856138051584"),zD=a("12554203470773361527671578846415332832204710888928069025792"),zE=a("6277101735386680763835789423207666416102355444464034512896"),zF=a("3138550867693340381917894711603833208051177722232017256448"),zG=a("1569275433846670190958947355801916604025588861116008628224"),zH=a("784637716923335095479473677900958302012794430558004314112"),zI=a("392318858461667547739736838950479151006397215279002157056"),zJ=a("196159429230833773869868419475239575503198607639501078528"),zK=a("98079714615416886934934209737619787751599303819750539264"),zL=a("49039857307708443467467104868809893875799651909875269632"),zM=a("24519928653854221733733552434404946937899825954937634816"),zN=a("12259964326927110866866776217202473468949912977468817408"),zO=a("6129982163463555433433388108601236734474956488734408704"),zP=a("3064991081731777716716694054300618367237478244367204352"),zQ=a("1532495540865888858358347027150309183618739122183602176"),zR=a("766247770432944429179173513575154591809369561091801088"),zS=a("383123885216472214589586756787577295904684780545900544"),zT=a("191561942608236107294793378393788647952342390272950272"),zU=a("95780971304118053647396689196894323976171195136475136"),zV=a("47890485652059026823698344598447161988085597568237568"),zW=a("23945242826029513411849172299223580994042798784118784"),zX=a("11972621413014756705924586149611790497021399392059392"),zY=a("5986310706507378352962293074805895248510699696029696"),zZ=a("2993155353253689176481146537402947624255349848014848"),z0=a("1496577676626844588240573268701473812127674924007424"),z1=a("748288838313422294120286634350736906063837462003712"),z2=a("374144419156711147060143317175368453031918731001856"),z3=a("187072209578355573530071658587684226515959365500928"),z4=a("93536104789177786765035829293842113257979682750464"),z5=a("46768052394588893382517914646921056628989841375232"),z6=a("23384026197294446691258957323460528314494920687616"),z7=a("11692013098647223345629478661730264157247460343808"),z8=a("5846006549323611672814739330865132078623730171904"),z9=a("2923003274661805836407369665432566039311865085952"),z_=a("1461501637330902918203684832716283019655932542976"),z$=a("730750818665451459101842416358141509827966271488"),Aa=a("365375409332725729550921208179070754913983135744"),Ab=a("182687704666362864775460604089535377456991567872"),Ac=a("91343852333181432387730302044767688728495783936"),Ad=a("45671926166590716193865151022383844364247891968"),Ae=a("22835963083295358096932575511191922182123945984"),Af=a("11417981541647679048466287755595961091061972992"),Ag=a("5708990770823839524233143877797980545530986496"),Ah=a("2854495385411919762116571938898990272765493248"),Ai=a("1427247692705959881058285969449495136382746624"),Aj=a("713623846352979940529142984724747568191373312"),Ak=a("356811923176489970264571492362373784095686656"),Al=a("178405961588244985132285746181186892047843328"),Am=a("89202980794122492566142873090593446023921664"),An=a("44601490397061246283071436545296723011960832"),Ao=a("22300745198530623141535718272648361505980416"),Ap=a("11150372599265311570767859136324180752990208"),Aq=a("5575186299632655785383929568162090376495104"),Ar=a("2787593149816327892691964784081045188247552"),As=a("1393796574908163946345982392040522594123776"),At=a("696898287454081973172991196020261297061888"),Au=a("348449143727040986586495598010130648530944"),Av=a("174224571863520493293247799005065324265472"),Aw=a("87112285931760246646623899502532662132736"),Ax=a("43556142965880123323311949751266331066368"),Ay=a("21778071482940061661655974875633165533184"),Az=a("10889035741470030830827987437816582766592"),AA=a("5444517870735015415413993718908291383296"),AB=a("2722258935367507707706996859454145691648"),AC=a("1361129467683753853853498429727072845824"),AD=a("680564733841876926926749214863536422912"),AE=a("340282366920938463463374607431768211456"),AF=a("170141183460469231731687303715884105728"),AG=a("85070591730234615865843651857942052864"),AH=a("42535295865117307932921825928971026432"),AI=a("21267647932558653966460912964485513216"),AJ=a("10633823966279326983230456482242756608"),AK=a("5316911983139663491615228241121378304"),AL=a("2658455991569831745807614120560689152"),AM=a("1329227995784915872903807060280344576"),AN=a("664613997892457936451903530140172288"),AO=a("332306998946228968225951765070086144"),AP=a("166153499473114484112975882535043072"),AQ=a("83076749736557242056487941267521536"),AR=a("41538374868278621028243970633760768"),AS=a("20769187434139310514121985316880384"),AT=a("10384593717069655257060992658440192"),AU=a("5192296858534827628530496329220096"),AV=a("2596148429267413814265248164610048"),AW=a("1298074214633706907132624082305024"),AX=a("649037107316853453566312041152512"),AY=a("324518553658426726783156020576256"),AZ=a("162259276829213363391578010288128"),A0=a("81129638414606681695789005144064"),A1=a("40564819207303340847894502572032"),A2=a("20282409603651670423947251286016"),A3=a("10141204801825835211973625643008"),A4=a("5070602400912917605986812821504"),A5=a("2535301200456458802993406410752"),A6=a("1267650600228229401496703205376"),A7=a("633825300114114700748351602688"),A8=a("316912650057057350374175801344"),A9=a("158456325028528675187087900672"),A_=a("79228162514264337593543950336"),A$=a("39614081257132168796771975168"),Ba=a("19807040628566084398385987584"),Bb=a("9903520314283042199192993792"),Bc=a("4951760157141521099596496896"),Bd=a("2475880078570760549798248448"),Be=a("1237940039285380274899124224"),Bf=a("618970019642690137449562112"),Bg=a("309485009821345068724781056"),Bh=a("154742504910672534362390528"),Bi=a("77371252455336267181195264"),Bj=a("38685626227668133590597632"),Bk=a("19342813113834066795298816"),Bl=a("9671406556917033397649408"),Bm=a("4835703278458516698824704"),Bn=a("2417851639229258349412352"),Bo=a("1208925819614629174706176"),Bp=a("604462909807314587353088"),Bq=a("302231454903657293676544"),Br=a("151115727451828646838272"),Bs=a("75557863725914323419136"),Bt=a("37778931862957161709568"),Bu=a("18889465931478580854784"),Bv=a("9444732965739290427392"),Bw=a("4722366482869645213696"),Bx=a("2361183241434822606848"),By=a("1180591620717411303424"),Bz=a("590295810358705651712"),BA=a("295147905179352825856"),BB=a("147573952589676412928"),BC=a("73786976294838206464"),BD=a("36893488147419103232"),BE=a("18446744073709551616"),BF=a("9223372036854775808"),BG=a("4611686018427387904"),BH=a("2305843009213693952"),BI=a("1152921504606846976"),BJ=a("576460752303423488"),BK=a("288230376151711744"),BL=a("144115188075855872"),BM=a("72057594037927936"),BN=a("36028797018963968"),BO=a("18014398509481984"),BP=a("9007199254740992"),BQ=a("4503599627370496"),BR=a("2251799813685248"),BS=a("1125899906842624"),BT=a("562949953421312"),BU=a("281474976710656"),BV=a("140737488355328"),BW=a("70368744177664"),BX=a("35184372088832"),BY=a("17592186044416"),BZ=a("8796093022208"),B0=a("4398046511104"),B1=a("2199023255552"),B2=a("1099511627776"),B3=a("549755813888"),B4=a("274877906944"),B5=a("137438953472"),B6=a("68719476736"),B7=a("34359738368"),B8=a("17179869184"),B9=a("8589934592"),B_=a("4294967296"),B$=a("2147483648"),Ca=a("1073741824"),Cb=a("536870912"),Cc=a("268435456"),Cd=a("134217728"),Ce=a("67108864"),Cf=a("33554432"),Cg=a("16777216"),Ch=a("8388608"),Ci=a("4194304"),Cj=a("2097152"),Ck=a("1048576"),Cl=a("524288"),Cm=a("262144"),Cn=a("131072"),Co=a("65536"),Cp=a("32768"),Cq=a("16384"),Cr=a("8192"),Cs=a("4096"),Ct=a("2048"),Cu=a("1024"),Cv=a("512"),Cw=a("256"),Cx=a("128"),Cy=a("64"),Cz=a("32"),CA=a("16"),CB=a("8"),CC=a("4"),CD=a("2"),CE=a("39614081257132164398725464064"),CF=a("144115188075855856"),CG=a("72057594037927928"),CH=a("36028797018963964"),CI=a("18014398509481982"),CJ=a("9007199254740991"),CK=a("4503599627370495"),CL=a("2251799813685247"),CM=a("1125899906842623"),CN=a("7"),CO=a("3"),CP=a(cj),CQ=a(U),CV=[0,[0,a(e2),0],[0,[0,a(eD),1],0]],CW=[0,[0,1,0],[0,[0,0,0],0]],CX=[0,[0,1,0],0],CY=[0,[0,0,[0,1,0]],0],C6=[0,[0,0,0],[0,[0,1,0],[0,[0,2,0],0]]],C7=[0,[0,0,1],[0,[0,1,-1],0]],C8=[0,[0,c8,[0,-5,[0,-1,[0,0,[0,1,[0,2,[0,5,0]]]]]]],0],C9=[0,[0,4,3,7],[0,[0,4,-2,2],[0,[0,5,-7,-2],0]]],C_=[0,[0,4,-4],[0,[0,-7,7],0]],C$=[0,[0,4,3,12],[0,[0,4,-3,ck],[0,[0,-4,-3,12],0]]],Da=[0,[0,5,2,2],[0,[0,4,2,2],[0,[0,4,3,1],[0,[0,4,4,1],[0,[0,4,5,0],0]]]]],Db=[0,[0,3,3,27],[0,[0,2,7,al],0]],Dc=[0,[0,1,2],[0,[0,42,43],[0,[0,gT,gQ],0]]],Di=[0,[0,0,a(e8)],[0,[0,[0,1,0],a("[1]")],[0,[0,[0,1,[0,2,[0,3,0]]],a("[1; 2; 3]")],0]]],Dj=[0,[0,[0,1,0],0],[0,[0,[0,1,[0,2,[0,3,0]]],0],0]],Dk=[0,0,0],Dl=[0,[0,0,[0,1,0]],[0,[0,[0,1,0],[0,2,0]],[0,[0,[0,1,[0,1,[0,1,0]]],[0,1,[0,1,[0,2,0]]]],[0,[0,[0,1,[0,1,[0,1,0]]],[0,1,[0,1,[0,1,[0,1,0]]]]],0]]]],Ds=a(p),P7=a('Raised by primitive operation at file "Implementation/CallStack.ml", line 3, characters 15-49\nCalled from file "Implementation/CallStack.ml", line 4, characters 15-30\nCalled from file "Implementation/CallStack.ml", line 4, characters 15-30\nCalled from file "Implementation/CallStack.ml", line 7, characters 2-9\n'),Du=[0,[0,[0,a("Implementation/CallStack.ml"),3,15,49],a('{filename="Implementation/CallStack.ml"; line_number=3; start_char=15; end_char=49}')],0],DC=a("[3 to 23 step 4]"),DD=[0,4],DE=[0,3],DG=a("[0 down to -12 step -3]"),DH=[0,-3],DJ=a("[0 to 4 step 1]"),DL=a(e8),DN=a(e8),DP=[0,3],DQ=[0,5],DS=[0,3],DT=[0,5],DV=[0,3],DW=[0,5],DY=[0,1],DZ=[0,0],D2=[0,5],D4=[0,-1],D6=[0,0],D9=[0,2],Ea=[0,3],Eb=[0,5],Ed=[0,3],Ee=[0,5],El=a("NativeInt"),Em=a(ml),Ex=[0,[0,-3,a("-3n")],[0,[0,0,a(lo)],[0,[0,0,a(lo)],[0,[0,1,a("1n")],[0,[0,15,a("15n")],0]]]]],Ey=[0,[0,-3,a(e3)],[0,[0,0,a(U)],[0,[0,0,a(U)],[0,[0,1,a(cj)],[0,[0,15,a(e0)],0]]]]],Ez=[0,[0,0,0],[0,[0,1,0],[0,[0,2,0],0]]],EA=[0,[0,0,1],[0,[0,1,-1],0]],EB=[0,[0,c8,[0,-5,[0,-1,[0,0,[0,1,[0,2,[0,5,0]]]]]]],0],EC=[0,[0,4,3,7],[0,[0,4,-2,2],[0,[0,5,-7,-2],0]]],ED=[0,[0,4,-4],[0,[0,-7,7],0]],EE=[0,[0,4,3,12],[0,[0,4,-3,ck],[0,[0,-4,-3,12],0]]],EF=[0,[0,5,2,2],[0,[0,4,2,2],[0,[0,4,3,1],[0,[0,4,4,1],[0,[0,4,5,0],0]]]]],EG=[0,[0,3,3,27],[0,[0,2,7,al],0]],EH=[0,[0,1,2],[0,[0,42,43],[0,[0,gT,gQ],0]]],ES=[0,[0,0,a(l6)],[0,[0,[0,42],a("Some 42")],0]],ET=[0,[0,0,0],[0,[0,[0,42],0],0]],EU=[0,[0,0,[0,42]],[0,[0,[0,42],[0,43]],0]],EV=[0,[0,0,[0,[0,0],[0,[0,1],0]]],0],Fj=[0,[0,[0,1,a(o)],a('(1, "a")')],0],Fk=[0,[0,[0,1,a(o)],0],0],Fl=[0,[0,[0,1,a(o)],[0,1,a(bC)]],[0,[0,[0,1,a(o)],[0,2,a(o)]],0]],Fm=[0,[0,[0,0,a(o)],[0,[0,0,a(bC)],[0,[0,1,a(o)],0]]],0],Fn=[0,[0,[0,1,a(o),2],a('(1, "a", 2.)')],0],Fo=[0,[0,[0,1,a(o),2],0],0],Fp=[0,[0,[0,1,a(o),2],[0,1,a(o),3]],[0,[0,[0,1,a(o),2],[0,1,a(bC),2]],[0,[0,[0,1,a(o),2],[0,2,a(o),2]],0]]],Fq=[0,[0,[0,0,a(o),0],[0,[0,0,a(o),1],[0,[0,0,a(bC),0],[0,[0,1,a(o),0],0]]]],0],Fr=[0,[0,[0,1,a(o),2,3],a('(1, "a", 2., 3)')],0],Fs=[0,[0,[0,1,a(o),2,3],0],0],Ft=[0,[0,[0,1,a(o),2,3],[0,1,a(o),2,4]],[0,[0,[0,1,a(o),2,3],[0,1,a(o),3,3]],[0,[0,[0,1,a(o),2,3],[0,1,a(bC),2,3]],[0,[0,[0,1,a(o),2,3],[0,0,a(o),2,3]],0]]]],Fu=[0,[0,[0,1,a(o),2,3],[0,[0,1,a(o),2,4],[0,[0,1,a(o),3,3],[0,[0,1,a(bC),2,3],[0,[0,2,a(o),2,3],0]]]]],0],Fv=[0,[0,[0,1,a(o),2,3,4],a('(1, "a", 2., 3, 4)')],0],Fw=[0,[0,[0,1,a(o),2,3,4],0],0],Fx=[0,[0,[0,1,a(o),2,3,4],[0,1,a(o),2,3,5]],[0,[0,[0,1,a(o),2,3,4],[0,1,a(o),2,4,4]],[0,[0,[0,1,a(o),2,3,4],[0,1,a(o),3,3,4]],[0,[0,[0,1,a(o),2,3,4],[0,1,a(bC),2,3,4]],[0,[0,[0,1,a(o),2,3,4],[0,0,a(o),2,3,4]],0]]]]],Fy=[0,[0,[0,1,a(o),2,3,4],[0,[0,1,a(o),2,3,5],[0,[0,1,a(o),2,4,4],[0,[0,1,a(o),3,3,4],[0,[0,1,a(bC),2,3,4],[0,[0,2,a(o),2,3,4],0]]]]]],0],FJ=a("General.RedBlackTree.Invariants.BrokenInvariants"),F9=[0,1,[0,3,[0,5,[0,7,[0,9,0]]]]],F$=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Ga=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],Gb=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],Gc=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gd=[0,[0,[2,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Ge=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gf=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Gg=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],Gh=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],Gi=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gj=[0,[0,[2,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gk=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gl=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Gm=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],Gn=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],Go=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gp=[0,[0,[2,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gq=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gr=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Gs=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],Gt=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],Gu=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gv=[0,[0,[2,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gw=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Gx=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],Gy=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,11,0]]]],Gz=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],GA=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GB=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GC=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GD=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],GE=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,11,0]]]],GF=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],GG=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GH=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GI=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GJ=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],GK=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,11,0]]]],GL=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],GM=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GN=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GO=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],GP=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],GQ=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,11,0]]]],GR=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],9,[0,[0,0,11,0]]]],GS=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GT=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GU=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GV=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],GW=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],GX=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,9,[2,[0,0,11,0]]]]]],GY=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],GZ=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],G0=[0,[0,[0,[0,0,3,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],G1=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],G2=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],G3=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,9,[2,[0,0,11,0]]]]]],G4=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],G5=[0,[0,[0,[0,0,1,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],G6=[0,[0,[0,[0,0,3,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],G7=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],G8=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],G9=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,9,[2,[0,0,11,0]]]]]],G_=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],G$=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Ha=[0,[0,[0,[0,0,3,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hb=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Hc=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],11,0]]]],Hd=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,9,[2,[0,0,11,0]]]]]],He=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],Hf=[0,[0,[0,[0,0,1,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],Hg=[0,[0,[0,[0,0,3,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,11,0]]]]]],Hh=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Hi=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],Hj=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],9,[0,[0,0,11,0]]]]]],Hk=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hl=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hm=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Hn=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Ho=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],Hp=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],9,[0,[0,0,11,0]]]]]],Hq=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hr=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hs=[0,[0,[2,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],9,[0,[0,0,11,0]]]],Ht=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],Hu=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],Hv=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],9,[0,[0,0,11,0]]]]]],Hw=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hx=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],Hy=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,[2,[0,0,9,0]],11,0]]]],Hz=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],HA=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,11,0]]]]]],HB=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],9,[0,[0,0,11,0]]]]]],HC=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],HD=[0,[0,[0,[0,0,1,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,11,0]]]]]],HE=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,11,0]]]]]],HF=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],HG=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],9,0]]]],HH=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,0]]]],HI=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,0,9,0]]]],HJ=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],HK=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],HL=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],9,0]]]],HM=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,0]]]],HN=[0,[0,[0,[0,[2,[0,0,1,0]],5,0]],7,[0,[0,0,9,0]]]],HO=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],HP=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,0]]]],HQ=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,9,0]]]],HR=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,0]]]],HS=[0,[0,[0,[0,0,1,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],HT=[0,[0,[0,[0,0,3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],HU=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,0]]]],HV=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,9,0]]]],HW=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],7,[0,[0,0,9,0]]]],HX=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],HY=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],HZ=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],H0=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,9,0]]]],H1=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],7,[0,[0,0,9,0]]]],H2=[0,[0,[0,[0,0,1,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],H3=[0,[0,[0,[0,0,3,0]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],H4=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],H5=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,9,0]]]],H6=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],7,[0,[0,0,9,0]]]],H7=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],H8=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],H9=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],H_=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],9,0]]]],H$=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,[2,[0,0,9,0]]]]]],Ia=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Ib=[0,[0,[0,[0,0,3,[2,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],Ic=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],Id=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],9,0]]]],Ie=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,[2,[0,0,9,0]]]]]],If=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Ig=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Ih=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],Ii=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],Ij=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],Ik=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],Il=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],Im=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],In=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],Io=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],Ip=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],Iq=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],Ir=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],Is=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],It=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],Iu=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,7,0]]]],Iv=[0,[0,[0,[0,0,1,0]],5,[0,[0,0,7,0]]]],Iw=[0,[0,[0,[0,0,3,0]],5,[0,[0,0,7,0]]]],Ix=[0,[0,[2,[0,0,1,0]],3,0]],Iy=[0,[0,[2,[0,0,1,0]],5,0]],Iz=[0,[0,0,3,[2,[0,0,5,0]]]],IA=[0,[0,[2,[0,0,1,0]],3,0]],IB=[0,[0,[2,[0,0,1,0]],5,0]],IC=[0,[0,0,3,[2,[0,0,5,0]]]],ID=[0,[0,0,1,0]],IE=[0,[0,0,3,0]],IF=[0,[0,0,1,0]],IG=[0,[0,0,3,0]],IJ=[0,[0,[2,[0,0,1,0]],3,[2,[0,0,4,0]]]],IK=[0,[0,[2,[0,0,1,0]],3,0]],IL=[0,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],IM=[0,[0,[2,[0,0,1,0]],3,0]],IN=[0,[0,[0,[0,0,0,0]],1,[0,[0,0,3,0]]]],IO=[0,[0,[2,[0,0,-1,0]],3,0]],IP=[0,[0,[0,[0,0,1,0]],-2,[0,[0,0,3,0]]]],IQ=[0,[0,[2,[0,0,1,0]],-3,0]],IR=[0,[0,[2,[0,0,1,0]],3,[2,[0,0,-4,0]]]],IS=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,4,0]]]],IT=[0,[0,0,1,[2,[0,0,3,0]]]],IU=[0,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],IV=[0,[0,0,1,[2,[0,0,3,0]]]],IW=[0,[0,[2,[0,0,0,0]],1,[2,[0,0,3,0]]]],IX=[0,[0,0,-1,[2,[0,0,3,0]]]],IY=[0,[0,[0,[0,0,1,0]],-2,[0,[0,0,3,0]]]],IZ=[0,[0,0,1,[2,[0,0,-3,0]]]],I0=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,-4,0]]]],I1=[0,[0,0,1,[2,[0,0,2,0]]]],I2=[0,[0,0,1,0]],I3=[0,[0,[2,[0,0,0,0]],1,0]],I4=[0,[0,0,-1,0]],I5=[0,[0,0,1,[2,[0,0,-2,0]]]],I6=[0,[0,0,0,0]],I8=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,10,0]]]]]],I9=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,[2,[0,0,8,0]],9,0]]]],I_=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,5,[2,[0,0,6,0]]]]]],7,[0,[0,0,9,0]]]],I$=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,4,0]],5,0]]]],7,[0,[0,0,9,0]]]],Ja=[0,[0,[2,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],Jb=[0,[0,[2,[0,[0,[0,[2,[0,0,0,0]],1,0]],3,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],Jc=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,0,9,[2,[0,0,10,0]]]]]],Jd=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,5,0]]]],7,[0,[0,[2,[0,0,8,0]],9,0]]]],Je=[0,[0,[2,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,6,0]]]],7,[0,[0,0,9,0]]]],Jf=[0,[0,[2,[0,[0,[0,[2,[0,0,1,0]],3,0]],4,[0,[0,0,5,0]]]],7,[0,[0,0,9,0]]]],Jg=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,[2,[0,0,5,0]]]]]],7,[0,[0,0,9,0]]]],Jh=[0,[0,[2,[0,[0,[0,0,0,0]],1,[0,[0,0,3,[2,[0,0,5,0]]]]]],7,[0,[0,0,9,0]]]],Ji=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,10,0]]]]]],Jj=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[2,[0,[0,[0,0,7,0]],8,[0,[0,0,9,0]]]]]],Jk=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[2,[0,[0,[0,0,6,0]],7,[0,[0,0,9,0]]]]]],Jl=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,4,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Jm=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Jn=[0,[0,[2,[0,[0,[0,0,0,0]],1,[0,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Jo=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,10,0]]]]]],Jp=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[2,[0,[0,[0,0,7,0]],8,[0,[0,0,9,0]]]]]],Jq=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,6,0]],7,[2,[0,0,9,0]]]]]],Jr=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,4,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Js=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Jt=[0,[0,[2,[0,[0,[0,0,0,0]],1,[0,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],Ju=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,[2,[0,0,10,0]]]]]],Jv=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[2,[0,[0,[0,0,7,0]],8,[0,[0,0,9,0]]]]]],Jw=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[2,[0,[0,[0,0,6,0]],7,[0,[0,0,9,0]]]]]],Jx=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,4,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Jy=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],Jz=[0,[0,[0,[0,[2,[0,0,0,0]],1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,7,0]],9,0]]]],JA=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[2,[0,[0,[0,0,7,0]],9,[0,[0,0,10,0]]]]]],JB=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[2,[0,[0,[0,0,7,0]],8,[0,[0,0,9,0]]]]]],JC=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,6,0]],7,[2,[0,0,9,0]]]]]],JD=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,4,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],JE=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],JF=[0,[0,[0,[0,[2,[0,0,0,0]],1,[2,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]],JG=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,[2,[0,0,10,0]]]]]]]],JH=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,[2,[0,0,8,0]],9,0]]]]]],JI=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,[2,[0,0,6,0]]]],7,[0,[0,0,9,0]]]]]],JJ=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,[2,[0,0,4,0]],5,0]],7,[0,[0,0,9,0]]]]]],JK=[0,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],JL=[0,[0,[0,[0,[2,[0,0,0,0]],1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,9,0]]]]]],JM=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,[2,[0,0,5,0]],7,0]],9,[0,[0,0,10,0]]]]]],JN=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,[2,[0,0,5,0]],7,0]],8,[0,[0,0,9,0]]]]]],JO=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],6,[0,[0,0,7,[2,[0,0,9,0]]]]]]]],JP=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,4,0]],5,[0,[0,0,7,[2,[0,0,9,0]]]]]]]],JQ=[0,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[0,[0,[2,[0,0,5,0]],7,[2,[0,0,9,0]]]]]],JR=[0,[0,[0,[0,[2,[0,0,0,0]],1,0]],3,[0,[0,[2,[0,0,5,0]],7,[2,[0,0,9,0]]]]]],JS=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,7,[2,[0,0,8,0]]]]]],JT=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,[2,[0,0,6,0]],7,0]]]],JU=[0,[0,[0,[0,[2,[0,0,1,0]],3,[2,[0,0,4,0]]]],5,[0,[0,0,7,0]]]],JV=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],JW=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,0,7,[2,[0,0,8,0]]]]]],JX=[0,[0,[0,[0,0,1,[2,[0,0,3,0]]]],5,[0,[0,[2,[0,0,6,0]],7,0]]]],JY=[0,[0,[2,[0,[0,[0,0,1,0]],3,[0,[0,0,4,0]]]],5,[0,[0,0,7,0]]]],JZ=[0,[0,[2,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],5,[0,[0,0,7,0]]]],J0=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,5,0]],7,[2,[0,0,8,0]]]]]],J1=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],6,[0,[0,0,7,0]]]]]],J2=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,4,0]],5,[0,[0,0,7,0]]]]]],J3=[0,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[0,[0,[2,[0,0,5,0]],7,0]]]],J4=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],7,[0,[0,0,8,0]]]]]],J5=[0,[0,[0,[0,0,1,0]],3,[2,[0,[0,[0,0,5,0]],6,[0,[0,0,7,0]]]]]],J6=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,4,0]],5,[2,[0,0,7,0]]]]]],J7=[0,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[0,[0,0,5,[2,[0,0,7,0]]]]]],J8=[0,[0,[0,[0,[2,[0,0,0,0]],1,0]],3,[0,[0,0,5,[2,[0,0,7,0]]]]]],J9=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],5,[0,[0,0,6,0]]]],J_=[0,[0,[0,[0,[2,[0,0,1,0]],3,0]],4,[0,[0,0,5,0]]]],J$=[0,[0,[0,[0,0,1,0]],2,[0,[0,0,3,[2,[0,0,5,0]]]]]],Ka=[0,[0,[0,[0,0,0,0]],1,[0,[0,0,3,[2,[0,0,5,0]]]]]],Kb=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,5,[2,[0,0,6,0]]]]]],Kc=[0,[0,[0,[0,0,1,0]],3,[0,[0,[2,[0,0,4,0]],5,0]]]],Kd=[0,[0,[0,[0,0,1,[2,[0,0,2,0]]]],3,[0,[0,0,5,0]]]],Ke=[0,[0,[0,[0,[2,[0,0,0,0]],1,0]],3,[0,[0,0,5,0]]]],Kf=[0,[0,[2,[0,0,1,0]],3,[2,[0,0,4,0]]]],Kg=[0,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],Kh=[0,[0,[0,[0,0,0,0]],1,[0,[0,0,3,0]]]],Ki=[0,[0,[0,[0,0,1,0]],3,[0,[0,0,4,0]]]],Kj=[0,[0,[0,[0,0,1,0]],2,[0,[0,0,3,0]]]],Kk=[0,[0,[2,[0,0,0,0]],1,[2,[0,0,3,0]]]],Kl=[0,[0,0,1,[2,[0,0,2,0]]]],Km=[0,[0,[2,[0,0,0,0]],1,0]],Kn=[0,[0,0,0,0]],Ko=[0,2,0],Kp=[0,[0,[0,[0,0,0,0]],1,[2,[0,0,2,0]]]],Kq=[0,2,0],Kr=[0,[0,[2,[0,0,0,0]],1,[0,[0,0,2,0]]]],Ks=[0,3,0],Kt=[0,[0,[2,[0,0,0,0]],1,[2,[0,0,1,0]]]],Ku=[0,3,0],Kv=[0,[0,[2,[0,0,1,0]],1,[2,[0,0,2,0]]]],Kw=[0,[0,[2,[0,0,0,0]],1,[2,[0,0,2,0]]]],Kx=[0,0,[0,1,0]],Ky=[2,[0,0,0,[2,[0,0,1,0]]]],Kz=[0,0,[0,1,0]],KA=[2,[0,[2,[0,0,0,0]],1,0]],KB=[0,[0,[2,[0,0,0,0]],1,0]],KC=[0,0,0],KD=[2,[0,0,0,0]],KE=[0,0,[0,1,0]],KF=[1,[0,0,0,0]],KG=[0,[0,0,0,0]],KH=[0,0,[0,1,0]],KI=a("General.BinaryHeap.Invariants.BrokenInvariants"),KO=[0,3,[0,2,[0,1,0]]],KP=[0,4,[0,2,[0,3,[0,1,0]]]],KQ=[0,3,[0,2,[0,1,0]]],KR=[0,4,[0,3,[0,1,[0,2,0]]]],KS=[0,3,[0,1,[0,2,0]]],KT=[0,4,[0,3,[0,2,[0,1,0]]]],KU=[0,2,[0,1,0]],KV=[0,3,[0,1,[0,2,0]]],KW=[0,2,[0,1,0]],KX=[0,3,[0,2,[0,1,0]]],KY=[0,1,0],KZ=[0,2,[0,1,0]],K0=[0,1,0],K1=[0,1,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,0]]]]]]]],K2=[0,1,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,0]]]]]]]],K3=[0,1,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,0]]]]]]]],K4=[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,[0,0,[0,1,0]]]]]]]],K5=[0,2,[0,1,[0,0,0]]],K6=[0,2,[0,1,[0,0,0]]],K7=[0,2,[0,0,[0,1,0]]],K8=[0,2,[0,0,[0,1,0]]],K9=[0,2,[0,1,[0,0,0]]],K_=[0,1,[0,2,[0,0,0]]],K$=[0,2,[0,0,[0,1,0]]],La=[0,1,[0,0,[0,2,0]]],Lb=[0,2,[0,0,[0,1,0]]],Lc=[0,0,[0,2,[0,1,0]]],Ld=[0,2,[0,0,[0,1,0]]],Le=[0,0,[0,1,[0,2,0]]],Lf=[0,1,[0,0,0]],Lg=[0,1,[0,0,0]],Lh=[0,1,[0,0,0]],Li=[0,0,[0,1,0]],Lj=[0,0,0],Lk=[0,0,0],Ll=a("empty"),Ln=[0,[0,a(ad),a('"foo"')],[0,[0,a('bar"baz'),a('"bar\\"baz"')],0]],Lo=[0,[0,a(ad),0],0],Lp=[0,[0,a(ad),a(ci)],0],Lq=[0,[0,a("aaaa"),[0,a("aaaaa"),[0,a("aaaab"),[0,a(gS),[0,a(bC),0]]]]],0],Ls=[0,a(p),[0,a(gS),[0,a(p),[0,a("cd"),[0,a(p),0]]]]],Lt=[0,dN,0],Lu=a("xabxxcdx"),Lv=[0,a(gS),[0,a("de"),[0,a("gh"),[0,a("j"),0]]]],Lw=[0,99,[0,gL,0]],Lx=a("abcdefghfj"),LA=a("General.TestingTests.Tests.TestException0"),LB=a("General.TestingTests.Tests.TestException0'"),LC=a("General.TestingTests.Tests.TestException1"),LG=[0,[0,[1,[0,a(ci),[0,[0,[0,a(ad),0]],0],[0,1,2,3]]],a('Group {name="bar"; children=[Single {label="foo"; status=Success}]; counts={successes=1; failures=2; errors=3}}')],0],LH=a('Single {label="foo"; status=Error (TestingTests.Tests.TestException0, None)}'),LI=a(ad),LJ=[0,[0,[0,a(ad),[0,[5,a(c9)]]]],a('Single {label="foo"; status=Failure (Custom "bad")}')],LK=a('Single {label="foo"; status=Failure (WrongExceptionNamed ("Foo", TestingTests.Tests.TestException0\', None))}'),LL=a(dL),LM=a(ad),LN=a('Single {label="foo"; status=Failure (WrongException (TestingTests.Tests.TestException0, TestingTests.Tests.TestException0\', None))}'),LO=a(ad),LP=[0,[0,[0,a(ad),[0,[2,a(dL)]]]],a('Single {label="foo"; status=Failure (NoExceptionNamed "Foo")}')],LQ=a('Single {label="foo"; status=Failure (NoException TestingTests.Tests.TestException0)}'),LR=a(ad),LS=[0,[0,[0,a(ad),[0,[0,[0,a(o),a(bC)]]]]],a('Single {label="foo"; status=Failure (NotEqual ("a", "b"))}')],LT=[0,[0,[0,a(ad),0]],a('Single {label="foo"; status=Success}')],LW=a(mE),LX=a(mE),L0=a(mA),L1=[0,[0,a(mA),[0,[5,a(c9)]]]],L3=a(ly),L4=a(ly),L6=a(kM),L7=a(kM),L9=a(kX),L_=[0,[0,a(kX),[0,[0,[0,a("42"),a(eC)]]]]],Ma=a(l0),Mb=a(k5),Mc=[1,[0,a(k5),[0,[0,[0,a(l0),0]],0],[0,1,0,0]]],Me=a(mh),Mf=[0,[0,a(mh),0]],Mh=a(ml),Mi=[0,[11,a("ru"),[2,0,0]],a("ru%s")],Mk=[0,0,0,1],Ml=a(ci),Mm=a(ad),Mn=[0,a('"foo" (Successes: 0, failures: 0, errors: 1)'),[0,a('  "bar": ERROR: exception TestingTests.Tests.TestException0 raised (no backtrace)'),0]],Mo=[1,[0,a(ad),[0,[0,[0,a(ci),[0,[5,a(mC)]]]],[0,[0,[0,a(eO),0]],0]],[0,1,1,0]]],Mp=[0,a(ma),[0,a(lA),0]],Mq=[0,0],Mr=[1,[0,a(ad),[0,[0,[0,a(ci),[0,[5,a(mC)]]]],[0,[0,[0,a(eO),0]],0]],[0,1,1,0]]],Ms=[0,a(ma),[0,a(lA),[0,a(kR),0]]],Mt=[0,1],Mu=[1,[0,a(ad),[0,[0,[0,a(ci),0]],[0,[0,[0,a(eO),0]],0]],[0,2,0,0]]],Mv=[0,a(l2),0],Mw=[0,0],Mx=[1,[0,a(ad),[0,[0,[0,a(ci),0]],[0,[0,[0,a(eO),0]],0]],[0,2,0,0]]],My=[0,a(l2),[0,a('  "bar": OK'),[0,a(kR),0]]],Mz=[0,1],MA=a(c9),MB=a("bar 7"),ME=a('"bar 7": ERROR: exception TestingTests.Tests.TestException1("bad") raised\n'),P6=a('"bar 7": ERROR: exception TestingTests.Tests.TestException1("bad") raised\nRaised by primitive operation at file "Implementation/TestingTests.ml", line 2, characters 16-36\n'),MG=a("bar 6"),MH=[0,a('"bar 6": ERROR: exception TestingTests.Tests.TestException0 raised (no backtrace)'),0],MI=[0,[0,a("bar 5"),[0,[5,a(gV)]]]],MJ=[0,a('"bar 5": FAILED: too bad'),0],MK=a(gV),ML=a(dL),MM=a("bar 4'"),MP=a('"bar 4\'": FAILED: expected exception Foo not raised, but exception TestingTests.Tests.TestException1("too bad") raised\n'),P5=a('"bar 4\'": FAILED: expected exception Foo not raised, but exception TestingTests.Tests.TestException1("too bad") raised\nRaised by primitive operation at file "Implementation/TestingTests.ml", line 2, characters 16-36\n'),MR=a(gV),MS=a(c9),MT=a("bar 4"),MW=a('"bar 4": FAILED: expected exception TestingTests.Tests.TestException1("bad") not raised, but exception TestingTests.Tests.TestException1("too bad") raised\n'),P4=a('"bar 4": FAILED: expected exception TestingTests.Tests.TestException1("bad") not raised, but exception TestingTests.Tests.TestException1("too bad") raised\nRaised by primitive operation at file "Implementation/TestingTests.ml", line 2, characters 16-36\n'),MY=a(dL),MZ=a("bar 3'"),M0=[0,a("\"bar 3'\": FAILED: expected exception Foo not raised, but exception TestingTests.Tests.TestException0' raised (no backtrace)"),0],M1=a("bar 3"),M2=[0,a('"bar 3": FAILED: expected exception TestingTests.Tests.TestException0 not raised, but exception TestingTests.Tests.TestException0\' raised (no backtrace)'),0],M3=[0,[0,a("bar 2'"),[0,[2,a(dL)]]]],M4=[0,a('"bar 2\'": FAILED: expected exception Foo not raised'),0],M5=a("bar 2"),M6=[0,a('"bar 2": FAILED: expected exception TestingTests.Tests.TestException0 not raised'),0],M7=[0,[0,a("bar 1"),[0,[0,[0,a(o),a(bC)]]]]],M8=[0,a('"bar 1": FAILED: expected a, but got b'),0],M9=[0,[0,a(ad),0]],M_=[0,a('"foo": OK'),0],M$=[0,1],PP=a(mf),PT=a("italic"),PU=a("oblique"),PS=a("bold"),PQ=a(mf),PR=[0,[2,0,[12,32,[2,0,[12,32,[21,1,[11,a("px "),[2,0,0]]]]]]],a("%s %s %npx %s")],PL=[0,[11,a("rgba("),[2,0,[11,a(ae),[2,0,[11,a(ae),[2,0,[11,a(ae),[8,0,0,0,[12,41,0]]]]]]]]],a("rgba(%s, %s, %s, %f)")],Py=a("over"),PF=a("add"),PG=a(mv),PH=a(lx),PI=a(l1),PJ=a(mc),PK=a(l4),Pz=a(kO),PA=a(mp),PB=a(kT),PC=a(k7),PD=a(mq),PE=[0,[11,a("Unexpected globalCompositeOperation "),[3,0,0]],a("Unexpected globalCompositeOperation %S")],Pj=a("Unsupported operator CLEAR"),Pk=a("Unsupported operator SOURCE"),Pl=a(k7),Pm=a(mp),Pn=a(kT),Po=a(kO),Pp=a("Unsupported operator DEST"),Pq=a(mc),Pr=a(lx),Ps=a(l1),Pt=a(mv),Pu=a(mq),Pv=a(l4),Pw=a("Unsupported operator SATURATE"),Pe=a(lT),Pf=a(ez),Pa=a("miter"),Pb=a(ez),Pc=a(lT),O9=a(ez),O_=a(mt),O5=a("butt"),O6=a(ez),O7=a(mt),OT=[0,0,0],OD=[0,0,0,10,a("sans-serif")],OC=[0,[11,a("JsOfOCairo.Error("),[2,0,[12,41,0]]],a("JsOfOCairo.Error(%s)")],NO=a("INVALID_RESTORE"),NP=a("INVALID_POP_GROUP"),NQ=a("NO_CURRENT_POINT"),NR=a("INVALID_MATRIX"),NS=a("INVALID_STATUS"),NT=a("NULL_POINTER"),NU=a("INVALID_STRING"),NV=a("INVALID_PATH_DATA"),NW=a("READ_ERROR"),NX=a("WRITE_ERROR"),NY=a("SURFACE_FINISHED"),NZ=a("SURFACE_TYPE_MISMATCH"),N0=a("PATTERN_TYPE_MISMATCH"),N1=a("INVALID_CONTENT"),N2=a("INVALID_FORMAT"),N3=a("INVALID_VISUAL"),N4=a("FILE_NOT_FOUND"),N5=a("INVALID_DASH"),N6=a("INVALID_DSC_COMMENT"),N7=a("INVALID_INDEX"),N8=a("CLIP_NOT_REPRESENTABLE"),N9=a("TEMP_FILE_ERROR"),N_=a("INVALID_STRIDE"),N$=a("FONT_TYPE_MISMATCH"),Oa=a("USER_FONT_IMMUTABLE"),Ob=a("USER_FONT_ERROR"),Oc=a("NEGATIVE_COUNT"),Od=a("INVALID_CLUSTERS"),Oe=a("INVALID_SLANT"),Of=a("INVALID_WEIGHT"),Og=a("INVALID_SIZE"),Oh=a("USER_FONT_NOT_IMPLEMENTED"),Oi=a("DEVICE_TYPE_MISMATCH"),Oj=a("DEVICE_ERROR"),Ok=a("INVALID_MESH_CONSTRUCTION"),Ol=a("DEVICE_FINISHED"),Om=a("JBIG2_GLOBAL_MISSING"),Nd=a("cairo_restore() without matching cairo_save()"),Ne=a("no saved group to pop, i.e. cairo_pop_group() without matching cairo_push_group()"),Nf=a("no current point defined"),Ng=a("invalid matrix (not invertible)"),Nh=a("invalid value for an input cairo_status_t"),Ni=a("NULL pointer"),Nj=a("input string not valid UTF-8"),Nk=a("input path data not valid"),Nl=a("error while reading from input stream"),Nm=a("error while writing to output stream"),Nn=a("the target surface has been finished"),No=a("the surface type is not appropriate for the operation"),Np=a("the pattern type is not appropriate for the operation"),Nq=a("invalid value for an input cairo_content_t"),Nr=a("invalid value for an input cairo_format_t"),Ns=a("invalid value for an input Visual*"),Nt=a("file not found"),Nu=a("invalid value for a dash setting"),Nv=a("invalid value for a DSC comment"),Nw=a("invalid index passed to getter"),Nx=a("clip region not representable in desired format"),Ny=a("error creating or writing to a temporary file"),Nz=a("invalid value for stride"),NA=a("the font type is not appropriate for the operation"),NB=a("the user-font is immutable"),NC=a("error occurred in a user-font callback function"),ND=a("negative number used where it is not allowed"),NE=a("input clusters do not represent the accompanying text and glyph arrays"),NF=a("invalid value for an input cairo_font_slant_t"),NG=a("invalid value for an input cairo_font_weight_t"),NH=a("invalid value (typically too big) for the size of the input (surface, pattern, etc.)"),NI=a("user-font method not implemented"),NJ=a("the device type is not appropriate for the operation"),NK=a("an operation to the device caused an unspecified error"),NL=a("invalid operation during mesh pattern construction"),NM=a("the target device has been finished"),NN=a("CAIRO_MIME_TYPE_JBIG2_GLOBAL_ID used but no CAIRO_MIME_TYPE_JBIG2_GLOBAL data provided"),Nb=a("JsOfOCairo.Error"),On=a("JsOfOCairo.Unavailable"),Ot=[0,0,0,0,0,0],P3=a("randomize_canvas");function
P(a){if(typeof
a==="number")return 0;else
switch(a[0]){case
0:return[0,P(a[1])];case
1:return[1,P(a[1])];case
2:return[2,P(a[1])];case
3:return[3,P(a[1])];case
4:return[4,P(a[1])];case
5:return[5,P(a[1])];case
6:return[6,P(a[1])];case
7:return[7,P(a[1])];case
8:var
c=a[1];return[8,c,P(a[2])];case
9:var
b=a[1];return[9,b,b,P(a[3])];case
10:return[10,P(a[1])];case
11:return[11,P(a[1])];case
12:return[12,P(a[1])];case
13:return[13,P(a[1])];default:return[14,P(a[1])]}}function
aF(a,b){if(typeof
a==="number")return b;else
switch(a[0]){case
0:return[0,aF(a[1],b)];case
1:return[1,aF(a[1],b)];case
2:return[2,aF(a[1],b)];case
3:return[3,aF(a[1],b)];case
4:return[4,aF(a[1],b)];case
5:return[5,aF(a[1],b)];case
6:return[6,aF(a[1],b)];case
7:return[7,aF(a[1],b)];case
8:var
c=a[1];return[8,c,aF(a[2],b)];case
9:var
d=a[2],e=a[1];return[9,e,d,aF(a[3],b)];case
10:return[10,aF(a[1],b)];case
11:return[11,aF(a[1],b)];case
12:return[12,aF(a[1],b)];case
13:return[13,aF(a[1],b)];default:return[14,aF(a[1],b)]}}function
K(a,b){if(typeof
a==="number")return b;else
switch(a[0]){case
0:return[0,K(a[1],b)];case
1:return[1,K(a[1],b)];case
2:var
c=a[1];return[2,c,K(a[2],b)];case
3:var
d=a[1];return[3,d,K(a[2],b)];case
4:var
e=a[3],f=a[2],g=a[1];return[4,g,f,e,K(a[4],b)];case
5:var
h=a[3],i=a[2],j=a[1];return[5,j,i,h,K(a[4],b)];case
6:var
k=a[3],l=a[2],m=a[1];return[6,m,l,k,K(a[4],b)];case
7:var
n=a[3],o=a[2],p=a[1];return[7,p,o,n,K(a[4],b)];case
8:var
q=a[3],r=a[2],s=a[1];return[8,s,r,q,K(a[4],b)];case
9:var
t=a[1];return[9,t,K(a[2],b)];case
10:return[10,K(a[1],b)];case
11:var
u=a[1];return[11,u,K(a[2],b)];case
12:var
v=a[1];return[12,v,K(a[2],b)];case
13:var
w=a[2],x=a[1];return[13,x,w,K(a[3],b)];case
14:var
y=a[2],z=a[1];return[14,z,y,K(a[3],b)];case
15:return[15,K(a[1],b)];case
16:return[16,K(a[1],b)];case
17:var
A=a[1];return[17,A,K(a[2],b)];case
18:var
B=a[1];return[18,B,K(a[2],b)];case
19:return[19,K(a[1],b)];case
20:var
C=a[2],D=a[1];return[20,D,C,K(a[3],b)];case
21:var
E=a[1];return[21,E,K(a[2],b)];case
22:return[22,K(a[1],b)];case
23:var
F=a[1];return[23,F,K(a[2],b)];default:var
G=a[2],H=a[1];return[24,H,G,K(a[3],b)]}}function
ap(a){throw[0,bW,a]}function
ah(a){throw[0,dk,a]}var
hp=[J,m8,H(0)];function
bw(b,a){return cL(b,a)?b:a}function
bI(b,a){return bs(b,a)?b:a}function
bX(a){return 0<=a?a:-a|0}var
hr=g$(m9),hs=g$(m_),cP=g$(m$),hq=eG;function
bx(d,c){var
a=w(d),e=w(c),b=aZ(a+e|0);bF(d,0,b,0,a);bF(c,0,b,a,e);return b}function
cm(a){return a?na:nb}function
ht(a){return at(a,nc)?at(a,nd)?ah(ne):1:0}function
am(b){return a(p+b)}function
b_(e){var
b=mL(ng,e),a=0,d=w(b);for(;;){if(d<=a)return bx(b,nf);var
c=O(b,a),f=48<=c?58<=c?0:1:45===c?1:0;if(f){var
a=a+1|0;continue}return b}}function
hu(a,b){if(a){var
c=a[1];return[0,c,hu(a[2],b)]}return b}var
hv=QH(0),nh=mU(1),ni=mU(2);function
nj(b){function
a(b){var
a=b;for(;;){if(a){var
c=a[2],d=a[1];try{hf(d)}catch(a){a=a1(a);if(a[1]!==hw)throw a}var
a=c;continue}return 0}}return a(QI(0))}function
hx(d,c,b,a){if(0<=b)if(0<=a)if(!((a0(c)-a|0)<b))return QG(d,c,b,a);return ah(nl)}var
fm=[0,nj];function
nm(a){var
b=fm[1];fm[1]=function(c){d(a,0);return d(b,0)};return 0}function
nn(a){return d(fm[1],0)}function
hy(c){var
b=0,a=c;for(;;){if(a){var
b=b+1|0,a=a[2];continue}return b}}function
fn(b,a){if(a){var
c=a[2],e=d(b,a[1]);return[0,e,fn(b,c)]}return 0}function
fo(c,b){var
a=b;for(;;){if(a){var
e=a[2];d(c,a[1]);var
a=e;continue}return 0}}function
hz(d,a,c){if(a){var
e=a[1];return b(d,e,hz(d,a[2],c))}return c}function
ns(g,f,e){var
c=f,a=e;for(;;){if(c){if(a){var
h=a[2],i=c[2],d=b(g,c[1],a[1]);if(d){var
c=i,a=h;continue}return d}}else
if(!a)return 1;return ah(nt)}}function
bJ(a,c){var
b=aZ(a);Qm(b,0,a,c);return b}function
hA(a){var
b=a0(a),c=aZ(b);g7(a,0,c,0,b);return c}function
fp(a){return hA(a)}function
hB(c,b,a){if(0<=b)if(0<=a)if(!((a0(c)-a|0)<b)){var
d=aZ(a);g7(c,b,d,0,a);return d}return ah(nB)}function
hC(c,b,a){return hB(c,b,a)}function
hD(e,c,d,b,a){if(0<=a)if(0<=c)if(!((a0(e)-a|0)<c))if(0<=b)if(!((a0(d)-a|0)<b))return g7(e,c,d,b,a);return ah(nC)}function
aN(e,c,d,b,a){if(0<=a)if(0<=c)if(!((w(e)-a|0)<c))if(0<=b)if(!((a0(d)-a|0)<b))return bF(e,c,d,b,a);return ah(nD)}function
hE(b,a){return bJ(b,a)}function
hF(c,b,a){return hB(c,b,a)}function
nE(e,d,c,b){var
a=c;for(;;){if(d<=a)throw bY;if(aR(e,a)===b)return a;var
a=a+1|0;continue}}function
nF(b,a,d){var
c=w(b);if(0<=a)if(!(c<a))try{nE(b,c,a,d);var
e=1;return e}catch(a){a=a1(a);if(a===bY)return 0;throw a}return ah(nG)}function
nH(b,a){return nF(b,0,a)}var
hG=QW(0)[1],dl=(4*QU(0)|0)-1|0,nI=QV(0)[2];H(0);function
hH(c){var
a=c.length-1-1|0,b=0;for(;;){if(0<=a){var
d=[0,c[a+1],b],a=a-1|0,b=d;continue}return b}}function
hI(a){if(a){var
d=0,c=a,g=a[2],h=a[1];for(;;){if(c){var
d=d+1|0,c=c[2];continue}var
f=mT(d,h),e=1,b=g;for(;;){if(b){var
i=b[2];f[e+1]=b[1];var
e=e+1|0,b=i;continue}return f}}}return[0]}H(0);var
nK=0,nL=1;function
nM(a){return a+1|0}function
nN(a){return a-1|0}function
nO(a){return bs(a,0)?a:-a|0}var
nP=kU,nQ=eG;function
nR(a){return df(nS,a)}var
nT=dg;function
nU(b,a){return 0===dg(b,a)?1:0}function
nX(a){return g9(a,nY)}function
nZ(a){return hb(a,n0)}function
n1(a){return bs(a,n2)?a:bt(a)}function
n4(a){return mN(n5,a)}var
n6=g_;function
n7(b,a){return 0===g_(b,a)?1:0}var
n8=0,n9=1;function
n_(a){return a+1|0}function
n$(a){return a-1|0}function
oa(a){return bs(a,0)?a:-a|0}var
ob=kU,oc=eG;function
od(a){return df(oe,a)}var
of=dg;function
og(b,a){return 0===dg(b,a)?1:0}H(0);H(0);H(0);H(0);var
oi=[J,oh,H(0)];function
oj(a){throw oi}function
fq(a){var
c=a[1];a[1]=oj;try{var
b=d(c,0);a[1]=b;QL(a,da);return b}catch(b){b=a1(b);a[1]=function(a){throw b};throw b}}H(0);H(0);function
hK(a){a[3]=hx(a[1],a[2],0,a0(a[2]));a[4]=0;return 0}function
hL(h,n){var
a=n;for(;;){if(typeof
a!=="number")switch(a[0]){case
1:var
i=a[2],c=hL(h,a[1]);if(typeof
c==="number"){var
a=i;continue}else{if(0===c[0])return[0,c[1],[1,c[2],i]];throw[0,E,ok]}case
2:var
e=a[1],j=cN(e),o=da===j?e[1]:g===j?fq(e):e,a=o;continue;case
3:var
f=a[1],k=f[1];if(k){var
l=k[1];if(l){var
p=l[1];f[1]=0;return[0,p,a]}return 0}var
m=d(f[2],h);return m?[0,m[1],a]:(f[1]=ol,0);case
4:var
b=a[1];if(b[3]<=b[4])hK(b);if(0===b[3])return 0;var
q=aR(b[2],b[4]);b[4]=b[4]+1|0;return[0,q,a]}return a}}function
hM(a){for(;;){var
b=a[2];if(typeof
b==="number")return 0;else
switch(b[0]){case
0:return[0,b[1]];case
1:var
e=hL(a[1],a[2]);if(typeof
e==="number")return 0;else{if(0===e[0]){var
l=e[1];a[2]=e;return[0,l]}throw[0,E,om]}case
2:var
f=b[1],i=cN(f),m=da===i?f[1]:g===i?fq(f):f;a[2]=m;continue;case
3:var
h=b[1],j=h[1];if(j)return j[1];var
k=d(h[2],a[1]);h[1]=[0,k];return k;default:var
c=b[1];if(c[3]<=c[4])hK(c);return 0===c[3]?(a[2]=0,0):[0,aR(c[2],c[4])]}}}function
cn(a){return a?hM(a[1]):0}function
co(e){if(e){var
a=e[1];for(;;){var
b=a[2];if(typeof
b!=="number")switch(b[0]){case
0:var
f=b[2];a[1]=a[1]+1|0;a[2]=f;return 0;case
3:var
c=b[1];if(c[1]){a[1]=a[1]+1|0;c[1]=0;return 0}break;case
4:var
d=b[1];a[1]=a[1]+1|0;d[4]=d[4]+1|0;return 0}if(hM(a))continue;return 0}}return 0}function
b$(a){return[0,[0,0,[3,[0,0,a]]]]}function
hN(a){var
b=0;return[0,[0,0,hz(function(b,a){return[0,b,a]},a,b)]]}function
dY(a){var
b=1<=a?a:1,c=dl<b?dl:b,d=aZ(c);return[0,d,0,c,d]}function
hO(a){return hC(a[1],0,a[2])}function
fr(a,c){var
b=[0,a[3]];for(;;){if(b[1]<(a[2]+c|0)){b[1]=2*b[1]|0;continue}if(dl<b[1])if((a[2]+c|0)<=dl)b[1]=dl;else
ap(on);var
d=aZ(b[1]);hD(a[1],0,d,0,a[2]);a[1]=d;a[3]=b[1];return 0}}function
hP(a,c){var
b=a[2];if(a[3]<=b)fr(a,1);X(a[1],b,c);a[2]=b+1|0;return 0}function
bZ(a,c){var
b=w(c),d=a[2]+b|0;if(a[3]<d)fr(a,b);aN(c,0,a[1],a[2],b);a[2]=d;return 0}var
fs=-6;function
hQ(a){return[0,0,aZ(a)]}function
hR(a,g){var
b=a0(a[2]),c=a[1]+g|0,d=b<c?1:0;if(d){var
e=aZ(bI(b*2|0,c));hD(a[2],0,e,0,b);a[2]=e;var
f=0}else
var
f=d;return f}function
dm(a,b){hR(a,1);cG(a[2],a[1],b);a[1]=a[1]+1|0;return 0}function
av(a,c){var
b=w(c);hR(a,b);aN(c,0,a[2],a[1],b);a[1]=a[1]+b|0;return 0}function
hS(a){return hC(a[2],0,a[1])}function
hT(a){if(typeof
a==="number")switch(a){case
0:return op;case
1:return oq;case
2:return or;case
3:return os;case
4:return ot;case
5:return ou;default:return ov}else
switch(a[0]){case
0:return a[1];case
1:return a[1];default:return bx(ow,hE(1,a[1]))}}function
ft(b,c){var
a=c;for(;;)if(typeof
a==="number")return 0;else
switch(a[0]){case
0:var
d=a[1];av(b,ox);var
a=d;continue;case
1:var
e=a[1];av(b,oy);var
a=e;continue;case
2:var
f=a[1];av(b,oz);var
a=f;continue;case
3:var
g=a[1];av(b,oA);var
a=g;continue;case
4:var
h=a[1];av(b,oB);var
a=h;continue;case
5:var
i=a[1];av(b,oC);var
a=i;continue;case
6:var
j=a[1];av(b,oD);var
a=j;continue;case
7:var
k=a[1];av(b,oE);var
a=k;continue;case
8:var
l=a[2],m=a[1];av(b,oF);ft(b,m);av(b,oG);var
a=l;continue;case
9:var
n=a[3],o=a[1];av(b,oH);ft(b,o);av(b,oI);var
a=n;continue;case
10:var
p=a[1];av(b,oJ);var
a=p;continue;case
11:var
q=a[1];av(b,oK);var
a=q;continue;case
12:var
r=a[1];av(b,oL);var
a=r;continue;case
13:var
s=a[1];av(b,oM);var
a=s;continue;default:var
t=a[1];av(b,oN);var
a=t;continue}}function
ai(a){if(typeof
a==="number")return 0;else
switch(a[0]){case
0:return[0,ai(a[1])];case
1:return[1,ai(a[1])];case
2:return[2,ai(a[1])];case
3:return[3,ai(a[1])];case
4:return[4,ai(a[1])];case
5:return[5,ai(a[1])];case
6:return[6,ai(a[1])];case
7:return[7,ai(a[1])];case
8:var
b=a[1];return[8,b,ai(a[2])];case
9:var
c=a[2],d=a[1];return[9,c,d,ai(a[3])];case
10:return[10,ai(a[1])];case
11:return[11,ai(a[1])];case
12:return[12,ai(a[1])];case
13:return[13,ai(a[1])];default:return[14,ai(a[1])]}}function
aw(a){if(typeof
a==="number"){var
s=function(a){return 0},t=function(a){return 0},u=function(a){return 0};return[0,function(a){return 0},u,t,s]}else
switch(a[0]){case
0:var
b=aw(a[1]),v=b[4],w=b[3],x=b[2],y=b[1],z=function(a){d(x,0);return 0};return[0,function(a){d(y,0);return 0},z,w,v];case
1:var
c=aw(a[1]),A=c[4],B=c[3],C=c[2],D=c[1],E=function(a){d(C,0);return 0};return[0,function(a){d(D,0);return 0},E,B,A];case
2:var
e=aw(a[1]),F=e[4],G=e[3],H=e[2],I=e[1],J=function(a){d(H,0);return 0};return[0,function(a){d(I,0);return 0},J,G,F];case
3:var
f=aw(a[1]),K=f[4],L=f[3],M=f[2],N=f[1],O=function(a){d(M,0);return 0};return[0,function(a){d(N,0);return 0},O,L,K];case
4:var
g=aw(a[1]),P=g[4],Q=g[3],R=g[2],S=g[1],T=function(a){d(R,0);return 0};return[0,function(a){d(S,0);return 0},T,Q,P];case
5:var
h=aw(a[1]),U=h[4],V=h[3],W=h[2],X=h[1],Y=function(a){d(W,0);return 0};return[0,function(a){d(X,0);return 0},Y,V,U];case
6:var
i=aw(a[1]),Z=i[4],_=i[3],$=i[2],aa=i[1],ab=function(a){d($,0);return 0};return[0,function(a){d(aa,0);return 0},ab,_,Z];case
7:var
j=aw(a[1]),ac=j[4],ad=j[3],ae=j[2],af=j[1],ag=function(a){d(ae,0);return 0};return[0,function(a){d(af,0);return 0},ag,ad,ac];case
8:var
k=aw(a[2]),ah=k[4],aj=k[3],ak=k[2],al=k[1],am=function(a){d(ak,0);return 0};return[0,function(a){d(al,0);return 0},am,aj,ah];case
9:var
ao=a[2],ap=a[1],l=aw(a[3]),aq=l[4],ar=l[3],as=l[2],at=l[1],m=aw(an(ai(ap),ao)),au=m[4],av=m[3],ax=m[2],ay=m[1],az=function(a){d(au,0);d(aq,0);return 0},aA=function(a){d(ar,0);d(av,0);return 0},aB=function(a){d(ax,0);d(as,0);return 0};return[0,function(a){d(at,0);d(ay,0);return 0},aB,aA,az];case
10:var
n=aw(a[1]),aC=n[4],aD=n[3],aE=n[2],aF=n[1],aG=function(a){d(aE,0);return 0};return[0,function(a){d(aF,0);return 0},aG,aD,aC];case
11:var
o=aw(a[1]),aH=o[4],aI=o[3],aJ=o[2],aK=o[1],aL=function(a){d(aJ,0);return 0};return[0,function(a){d(aK,0);return 0},aL,aI,aH];case
12:var
p=aw(a[1]),aM=p[4],aN=p[3],aO=p[2],aP=p[1],aQ=function(a){d(aO,0);return 0};return[0,function(a){d(aP,0);return 0},aQ,aN,aM];case
13:var
q=aw(a[1]),aR=q[4],aS=q[3],aT=q[2],aU=q[1],aV=function(a){d(aR,0);return 0},aW=function(a){d(aS,0);return 0},aX=function(a){d(aT,0);return 0};return[0,function(a){d(aU,0);return 0},aX,aW,aV];default:var
r=aw(a[1]),aY=r[4],aZ=r[3],a0=r[2],a1=r[1],a2=function(a){d(aY,0);return 0},a3=function(a){d(aZ,0);return 0},a4=function(a){d(a0,0);return 0};return[0,function(a){d(a1,0);return 0},a4,a3,a2]}}function
an(c,b){if(typeof
c==="number")if(typeof
b==="number")return 0;else
switch(b[0]){case
10:var
a=0;break;case
11:var
a=1;break;case
12:var
a=2;break;case
13:var
a=3;break;case
14:var
a=4;break;case
8:var
a=5;break;case
9:var
a=6;break;default:throw[0,E,oO]}else
switch(c[0]){case
0:var
t=c[1];if(typeof
b==="number")var
e=1;else
switch(b[0]){case
0:return[0,an(t,b[1])];case
8:var
a=5,e=0;break;case
9:var
a=6,e=0;break;case
10:var
a=0,e=0;break;case
11:var
a=1,e=0;break;case
12:var
a=2,e=0;break;case
13:var
a=3,e=0;break;case
14:var
a=4,e=0;break;default:var
e=1}if(e)var
a=7;break;case
1:var
u=c[1];if(typeof
b==="number")var
f=1;else
switch(b[0]){case
1:return[1,an(u,b[1])];case
8:var
a=5,f=0;break;case
9:var
a=6,f=0;break;case
10:var
a=0,f=0;break;case
11:var
a=1,f=0;break;case
12:var
a=2,f=0;break;case
13:var
a=3,f=0;break;case
14:var
a=4,f=0;break;default:var
f=1}if(f)var
a=7;break;case
2:var
v=c[1];if(typeof
b==="number")var
g=1;else
switch(b[0]){case
2:return[2,an(v,b[1])];case
8:var
a=5,g=0;break;case
9:var
a=6,g=0;break;case
10:var
a=0,g=0;break;case
11:var
a=1,g=0;break;case
12:var
a=2,g=0;break;case
13:var
a=3,g=0;break;case
14:var
a=4,g=0;break;default:var
g=1}if(g)var
a=7;break;case
3:var
w=c[1];if(typeof
b==="number")var
h=1;else
switch(b[0]){case
3:return[3,an(w,b[1])];case
8:var
a=5,h=0;break;case
9:var
a=6,h=0;break;case
10:var
a=0,h=0;break;case
11:var
a=1,h=0;break;case
12:var
a=2,h=0;break;case
13:var
a=3,h=0;break;case
14:var
a=4,h=0;break;default:var
h=1}if(h)var
a=7;break;case
4:var
x=c[1];if(typeof
b==="number")var
i=1;else
switch(b[0]){case
4:return[4,an(x,b[1])];case
8:var
a=5,i=0;break;case
9:var
a=6,i=0;break;case
10:var
a=0,i=0;break;case
11:var
a=1,i=0;break;case
12:var
a=2,i=0;break;case
13:var
a=3,i=0;break;case
14:var
a=4,i=0;break;default:var
i=1}if(i)var
a=7;break;case
5:var
y=c[1];if(typeof
b==="number")var
j=1;else
switch(b[0]){case
5:return[5,an(y,b[1])];case
8:var
a=5,j=0;break;case
9:var
a=6,j=0;break;case
10:var
a=0,j=0;break;case
11:var
a=1,j=0;break;case
12:var
a=2,j=0;break;case
13:var
a=3,j=0;break;case
14:var
a=4,j=0;break;default:var
j=1}if(j)var
a=7;break;case
6:var
z=c[1];if(typeof
b==="number")var
k=1;else
switch(b[0]){case
6:return[6,an(z,b[1])];case
8:var
a=5,k=0;break;case
9:var
a=6,k=0;break;case
10:var
a=0,k=0;break;case
11:var
a=1,k=0;break;case
12:var
a=2,k=0;break;case
13:var
a=3,k=0;break;case
14:var
a=4,k=0;break;default:var
k=1}if(k)var
a=7;break;case
7:var
A=c[1];if(typeof
b==="number")var
l=1;else
switch(b[0]){case
7:return[7,an(A,b[1])];case
8:var
a=5,l=0;break;case
9:var
a=6,l=0;break;case
10:var
a=0,l=0;break;case
11:var
a=1,l=0;break;case
12:var
a=2,l=0;break;case
13:var
a=3,l=0;break;case
14:var
a=4,l=0;break;default:var
l=1}if(l)var
a=7;break;case
8:var
B=c[2],C=c[1];if(typeof
b==="number")var
n=1;else
switch(b[0]){case
8:var
D=b[1],F=an(B,b[2]);return[8,an(C,D),F];case
10:var
a=0,n=0;break;case
11:var
a=1,n=0;break;case
12:var
a=2,n=0;break;case
13:var
a=3,n=0;break;case
14:var
a=4,n=0;break;default:var
n=1}if(n)throw[0,E,oX];break;case
9:var
G=c[3],H=c[2],I=c[1];if(typeof
b==="number")var
m=1;else
switch(b[0]){case
8:var
a=5,m=0;break;case
9:var
J=b[3],K=b[2],L=b[1],s=aw(an(ai(H),L)),M=s[4];d(s[2],0);d(M,0);return[9,I,K,an(G,J)];case
10:var
a=0,m=0;break;case
11:var
a=1,m=0;break;case
12:var
a=2,m=0;break;case
13:var
a=3,m=0;break;case
14:var
a=4,m=0;break;default:var
m=1}if(m)throw[0,E,oY];break;case
10:var
N=c[1];if(typeof
b!=="number"&&10===b[0])return[10,an(N,b[1])];throw[0,E,oZ];case
11:var
O=c[1];if(typeof
b==="number")var
r=1;else
switch(b[0]){case
10:var
a=0,r=0;break;case
11:return[11,an(O,b[1])];default:var
r=1}if(r)throw[0,E,o0];break;case
12:var
P=c[1];if(typeof
b==="number")var
q=1;else
switch(b[0]){case
10:var
a=0,q=0;break;case
11:var
a=1,q=0;break;case
12:return[12,an(P,b[1])];default:var
q=1}if(q)throw[0,E,o1];break;case
13:var
Q=c[1];if(typeof
b==="number")var
p=1;else
switch(b[0]){case
10:var
a=0,p=0;break;case
11:var
a=1,p=0;break;case
12:var
a=2,p=0;break;case
13:return[13,an(Q,b[1])];default:var
p=1}if(p)throw[0,E,o2];break;default:var
R=c[1];if(typeof
b==="number")var
o=1;else
switch(b[0]){case
10:var
a=0,o=0;break;case
11:var
a=1,o=0;break;case
12:var
a=2,o=0;break;case
13:var
a=3,o=0;break;case
14:return[14,an(R,b[1])];default:var
o=1}if(o)throw[0,E,o3]}switch(a){case
0:throw[0,E,oR];case
1:throw[0,E,oS];case
2:throw[0,E,oT];case
3:throw[0,E,oU];case
4:throw[0,E,oV];case
5:throw[0,E,oP];case
6:throw[0,E,oQ];default:throw[0,E,oW]}}var
aq=[J,o4,H(0)];function
dZ(b,a){if(typeof
b==="number")return[0,0,a];else{if(0===b[0])return[0,[0,b[1],b[2]],a];if(typeof
a!=="number"&&2===a[0])return[0,[1,b[1]],a[1]];throw aq}}function
dn(e,b,d){var
a=dZ(e,d);if(typeof
b==="number"){if(0===b)return[0,a[1],0,a[2]];var
c=a[2];if(typeof
c!=="number"&&2===c[0])return[0,a[1],1,c[1]];throw aq}return[0,a[1],[0,b[1]],a[2]]}function
aT(d,c,b){var
a=F(c,b);return[0,[23,d,a[1]],a[2]]}function
F(b,a){if(typeof
b==="number")return[0,0,a];else
switch(b[0]){case
0:if(typeof
a!=="number"&&0===a[0]){var
s=F(b[1],a[1]);return[0,[0,s[1]],s[2]]}break;case
1:if(typeof
a!=="number"&&0===a[0]){var
t=F(b[1],a[1]);return[0,[1,t[1]],t[2]]}break;case
2:var
ac=b[2],u=dZ(b[1],a),e=u[2],ad=u[1];if(typeof
e!=="number"&&1===e[0]){var
v=F(ac,e[1]);return[0,[2,ad,v[1]],v[2]]}throw aq;case
3:var
ae=b[2],w=dZ(b[1],a),f=w[2],af=w[1];if(typeof
f!=="number"&&1===f[0]){var
x=F(ae,f[1]);return[0,[3,af,x[1]],x[2]]}throw aq;case
4:var
ag=b[4],ah=b[1],g=dn(b[2],b[3],a),h=g[3],ai=g[2],aj=g[1];if(typeof
h!=="number"&&2===h[0]){var
y=F(ag,h[1]);return[0,[4,ah,aj,ai,y[1]],y[2]]}throw aq;case
5:var
ak=b[4],al=b[1],i=dn(b[2],b[3],a),j=i[3],am=i[2],an=i[1];if(typeof
j!=="number"&&3===j[0]){var
z=F(ak,j[1]);return[0,[5,al,an,am,z[1]],z[2]]}throw aq;case
6:var
ao=b[4],ap=b[1],k=dn(b[2],b[3],a),l=k[3],ar=k[2],as=k[1];if(typeof
l!=="number"&&4===l[0]){var
A=F(ao,l[1]);return[0,[6,ap,as,ar,A[1]],A[2]]}throw aq;case
7:var
at=b[4],au=b[1],m=dn(b[2],b[3],a),n=m[3],av=m[2],aw=m[1];if(typeof
n!=="number"&&5===n[0]){var
B=F(at,n[1]);return[0,[7,au,aw,av,B[1]],B[2]]}throw aq;case
8:var
ax=b[4],ay=b[1],o=dn(b[2],b[3],a),p=o[3],az=o[2],aA=o[1];if(typeof
p!=="number"&&6===p[0]){var
C=F(ax,p[1]);return[0,[8,ay,aA,az,C[1]],C[2]]}throw aq;case
9:var
aB=b[2],D=dZ(b[1],a),q=D[2],aC=D[1];if(typeof
q!=="number"&&7===q[0]){var
E=F(aB,q[1]);return[0,[9,aC,E[1]],E[2]]}throw aq;case
10:var
G=F(b[1],a);return[0,[10,G[1]],G[2]];case
11:var
aD=b[1],H=F(b[2],a);return[0,[11,aD,H[1]],H[2]];case
12:var
aE=b[1],I=F(b[2],a);return[0,[12,aE,I[1]],I[2]];case
13:if(typeof
a!=="number"&&8===a[0]){var
J=a[1],aF=a[2],aG=b[3],aH=b[1];if(cM([0,b[2]],[0,J]))throw aq;var
K=F(aG,aF);return[0,[13,aH,J,K[1]],K[2]]}break;case
14:if(typeof
a!=="number"&&9===a[0]){var
L=a[1],aI=a[3],aJ=b[3],aK=b[2],aL=b[1],aM=[0,P(L)];if(cM([0,P(aK)],aM))throw aq;var
M=F(aJ,P(aI));return[0,[14,aL,L,M[1]],M[2]]}break;case
15:if(typeof
a!=="number"&&10===a[0]){var
N=F(b[1],a[1]);return[0,[15,N[1]],N[2]]}break;case
16:if(typeof
a!=="number"&&11===a[0]){var
O=F(b[1],a[1]);return[0,[16,O[1]],O[2]]}break;case
17:var
aN=b[1],Q=F(b[2],a);return[0,[17,aN,Q[1]],Q[2]];case
18:var
R=b[2],r=b[1];if(0===r[0]){var
V=r[1],aS=V[2],W=F(V[1],a),aU=W[1],X=F(R,W[2]);return[0,[18,[0,[0,aU,aS]],X[1]],X[2]]}var
Y=r[1],aV=Y[2],Z=F(Y[1],a),aW=Z[1],_=F(R,Z[2]);return[0,[18,[1,[0,aW,aV]],_[1]],_[2]];case
19:if(typeof
a!=="number"&&13===a[0]){var
S=F(b[1],a[1]);return[0,[19,S[1]],S[2]]}break;case
20:if(typeof
a!=="number"&&1===a[0]){var
aP=b[2],aQ=b[1],T=F(b[3],a[1]);return[0,[20,aQ,aP,T[1]],T[2]]}break;case
21:if(typeof
a!=="number"&&2===a[0]){var
aR=b[1],U=F(b[2],a[1]);return[0,[21,aR,U[1]],U[2]]}break;case
23:var
d=b[2],c=b[1];if(typeof
c==="number")switch(c){case
0:return aT(c,d,a);case
1:return aT(c,d,a);case
2:if(typeof
a!=="number"&&14===a[0]){var
$=F(d,a[1]);return[0,[23,2,$[1]],$[2]]}throw aq;default:return aT(c,d,a)}else
switch(c[0]){case
0:return aT(c,d,a);case
1:return aT(c,d,a);case
2:return aT(c,d,a);case
3:return aT(c,d,a);case
4:return aT(c,d,a);case
5:return aT(c,d,a);case
6:return aT(c,d,a);case
7:return aT(c,d,a);case
8:return aT([8,c[1],c[2]],d,a);case
9:var
aX=c[1],aa=aO(c[2],d,a),ab=aa[2];return[0,[23,[9,aX,aa[1]],ab[1]],ab[2]];case
10:return aT(c,d,a);default:return aT(c,d,a)}}throw aq}function
aO(b,c,a){if(typeof
b==="number")return[0,0,F(c,a)];else
switch(b[0]){case
0:if(typeof
a!=="number"&&0===a[0]){var
g=aO(b[1],c,a[1]);return[0,[0,g[1]],g[2]]}break;case
1:if(typeof
a!=="number"&&1===a[0]){var
h=aO(b[1],c,a[1]);return[0,[1,h[1]],h[2]]}break;case
2:if(typeof
a!=="number"&&2===a[0]){var
i=aO(b[1],c,a[1]);return[0,[2,i[1]],i[2]]}break;case
3:if(typeof
a!=="number"&&3===a[0]){var
j=aO(b[1],c,a[1]);return[0,[3,j[1]],j[2]]}break;case
4:if(typeof
a!=="number"&&4===a[0]){var
k=aO(b[1],c,a[1]);return[0,[4,k[1]],k[2]]}break;case
5:if(typeof
a!=="number"&&5===a[0]){var
l=aO(b[1],c,a[1]);return[0,[5,l[1]],l[2]]}break;case
6:if(typeof
a!=="number"&&6===a[0]){var
m=aO(b[1],c,a[1]);return[0,[6,m[1]],m[2]]}break;case
7:if(typeof
a!=="number"&&7===a[0]){var
n=aO(b[1],c,a[1]);return[0,[7,n[1]],n[2]]}break;case
8:if(typeof
a!=="number"&&8===a[0]){var
o=a[1],w=a[2],x=b[2];if(cM([0,b[1]],[0,o]))throw aq;var
p=aO(x,c,w);return[0,[8,o,p[1]],p[2]]}break;case
9:if(typeof
a!=="number"&&9===a[0]){var
e=a[2],f=a[1],y=a[3],z=b[3],A=b[2],B=b[1],C=[0,P(f)];if(cM([0,P(B)],C))throw aq;var
D=[0,P(e)];if(cM([0,P(A)],D))throw aq;var
q=aw(an(ai(f),e)),E=q[4];d(q[2],0);d(E,0);var
r=aO(P(z),c,y),G=r[2];return[0,[9,f,e,ai(r[1])],G]}break;case
10:if(typeof
a!=="number"&&10===a[0]){var
s=aO(b[1],c,a[1]);return[0,[10,s[1]],s[2]]}break;case
11:if(typeof
a!=="number"&&11===a[0]){var
t=aO(b[1],c,a[1]);return[0,[11,t[1]],t[2]]}break;case
13:if(typeof
a!=="number"&&13===a[0]){var
u=aO(b[1],c,a[1]);return[0,[13,u[1]],u[2]]}break;case
14:if(typeof
a!=="number"&&14===a[0]){var
v=aO(b[1],c,a[1]);return[0,[14,v[1]],v[2]]}break}throw aq}function
aU(k,i,a){var
b=w(a),j=0<=i?k:0,d=bX(i);if(d<=b)return a;var
l=2===j?48:32,c=bJ(d,l);switch(j){case
0:aN(a,0,c,0,b);break;case
1:aN(a,0,c,d-b|0,b);break;default:if(0<b){if(43===O(a,0))var
e=1;else
if(45===O(a,0))var
e=1;else
if(32===O(a,0))var
e=1;else
var
g=0,e=0;if(e){cG(c,0,O(a,0));aN(a,1,c,(d-b|0)+1|0,b-1|0);var
g=1}}else
var
g=0;if(!g){if(1<b)if(48===O(a,0)){if(dN===O(a,1))var
h=1;else
if(88===O(a,1))var
h=1;else
var
f=0,h=0;if(h){cG(c,1,O(a,1));aN(a,2,c,(d-b|0)+2|0,b-2|0);var
f=1}}else
var
f=0;else
var
f=0;if(!f)aN(a,0,c,d-b|0,b)}}return c}function
cQ(j,b){var
c=bX(j),a=w(b),d=O(b,0);if(58<=d)var
e=71<=d?5<(d-97|0)>>>0?1:0:65<=d?0:1;else{if(32===d)var
f=1;else
if(43<=d)switch(d+lR|0){case
5:if(a<(c+2|0))if(1<a){var
k=dN===O(b,1)?0:88===O(b,1)?0:1;if(!k){var
h=bJ(c+2|0,48);cG(h,1,O(b,1));aN(b,2,h,(c-a|0)+4|0,a-2|0);return h}}var
e=0,f=0;break;case
0:case
2:var
f=1;break;case
1:case
3:case
4:var
e=1,f=0;break;default:var
e=0,f=0}else
var
e=1,f=0;if(f){if(a<(c+1|0)){var
g=bJ(c+1|0,48);cG(g,0,d);aN(b,1,g,(c-a|0)+2|0,a-1|0);return g}var
e=1}}if(!e)if(a<c){var
i=bJ(c,48);aN(b,0,i,c-a|0,a);return i}return b}function
o5(d){var
j=0;for(;;){if(w(d)<=j)var
u=0;else{var
g=aR(d,j);if(32<=g){var
q=g+kS|0;if(58<q>>>0)if(93<=q)var
r=0,l=0;else
var
l=1;else
if(56<(q-1|0)>>>0)var
r=1,l=0;else
var
l=1;if(l){var
j=j+1|0;continue}}else
var
r=11<=g?13===g?1:0:8<=g?1:0;var
u=r?1:1}if(u){var
a=[0,0],s=a0(d)-1|0,y=0;if(!(s<0)){var
i=y;for(;;){var
f=aR(d,i);if(32<=f){var
o=f+kS|0;if(58<o>>>0)if(93<=o)var
m=0,n=0;else
var
n=1;else
if(56<(o-1|0)>>>0)var
m=1,n=0;else
var
n=1;if(n)var
p=1,m=2}else
var
m=11<=f?13===f?1:0:8<=f?1:0;switch(m){case
0:var
p=4;break;case
1:var
p=2;break}a[1]=a[1]+p|0;var
B=i+1|0;if(s!==i){var
i=B;continue}break}}if(a[1]===a0(d))var
k=hA(d);else{var
b=aZ(a[1]);a[1]=0;var
t=a0(d)-1|0,z=0;if(!(t<0)){var
h=z;for(;;){var
c=aR(d,h);if(35<=c)var
e=92===c?1:dM<=c?0:2;else
if(32<=c)var
e=34<=c?1:2;else
if(14<=c)var
e=0;else
switch(c){case
8:X(b,a[1],92);a[1]++;X(b,a[1],98);var
e=3;break;case
9:X(b,a[1],92);a[1]++;X(b,a[1],lV);var
e=3;break;case
10:X(b,a[1],92);a[1]++;X(b,a[1],lb);var
e=3;break;case
13:X(b,a[1],92);a[1]++;X(b,a[1],lB);var
e=3;break;default:var
e=0}switch(e){case
0:X(b,a[1],92);a[1]++;X(b,a[1],48+(c/eV|0)|0);a[1]++;X(b,a[1],48+((c/10|0)%10|0)|0);a[1]++;X(b,a[1],48+(c%10|0)|0);break;case
1:X(b,a[1],92);a[1]++;X(b,a[1],c);break;case
2:X(b,a[1],c);break}a[1]++;var
A=h+1|0;if(t!==h){var
h=A;continue}break}}var
k=b}}else
var
k=d;var
v=w(k),x=bJ(v+2|0,34);bF(k,0,x,1,v);return x}}function
pV(c,b){switch(c){case
0:var
a=o6;break;case
1:var
a=o7;break;case
2:var
a=o8;break;case
3:var
a=o9;break;case
4:var
a=o_;break;case
5:var
a=o$;break;case
6:var
a=pa;break;case
7:var
a=pb;break;case
8:var
a=pc;break;case
9:var
a=pd;break;case
10:var
a=pe;break;case
11:var
a=pf;break;default:var
a=pg}return df(a,b)}function
pW(c,b){switch(c){case
0:var
a=pu;break;case
1:var
a=pv;break;case
2:var
a=pw;break;case
3:var
a=px;break;case
4:var
a=py;break;case
5:var
a=pz;break;case
6:var
a=pA;break;case
7:var
a=pB;break;case
8:var
a=pC;break;case
9:var
a=pD;break;case
10:var
a=pE;break;case
11:var
a=pF;break;default:var
a=pG}return df(a,b)}function
pX(c,b){switch(c){case
0:var
a=pH;break;case
1:var
a=pI;break;case
2:var
a=pJ;break;case
3:var
a=pK;break;case
4:var
a=pL;break;case
5:var
a=pM;break;case
6:var
a=pN;break;case
7:var
a=pO;break;case
8:var
a=pP;break;case
9:var
a=pQ;break;case
10:var
a=pR;break;case
11:var
a=pS;break;default:var
a=pT}return df(a,b)}function
pY(c,b){switch(c){case
0:var
a=ph;break;case
1:var
a=pi;break;case
2:var
a=pj;break;case
3:var
a=pk;break;case
4:var
a=pl;break;case
5:var
a=pm;break;case
6:var
a=pn;break;case
7:var
a=po;break;case
8:var
a=pp;break;case
9:var
a=pq;break;case
10:var
a=pr;break;case
11:var
a=ps;break;default:var
a=pt}return mN(a,b)}function
b0(c,t,h){if(16<=c){if(17<=c)switch(c-17|0){case
2:var
k=0;break;case
0:case
3:var
m=43,k=1;break;default:var
m=32,k=1}else
var
k=0;if(!k)var
m=45;var
i=Qs(h,t,m);if(19<=c){var
l=a0(i);if(0===l)return i;var
q=aZ(l),r=l-1|0,y=0;if(!(r<0)){var
e=y;for(;;){var
g=aR(i,e);if(97<=g)if(gZ<g)var
o=0;else
var
s=g-32|0,o=1;else
var
o=0;if(!o)var
s=g;X(q,e,s);var
z=e+1|0;if(r!==e){var
e=z;continue}break}}return q}return i}if(15===c)var
u=pU;else{var
A=bX(t);switch(c){case
15:var
b=70;break;case
0:case
1:case
2:var
b=gL;break;case
3:case
4:case
5:var
b=lK;break;case
6:case
7:case
8:var
b=69;break;case
9:case
10:case
11:var
b=mB;break;case
12:case
13:case
14:var
b=71;break;case
16:case
17:case
18:var
b=lk;break;default:var
b=72}var
d=hQ(16);dm(d,37);switch(c){case
1:case
4:case
7:case
10:case
13:case
17:case
20:dm(d,43);break;case
2:case
5:case
8:case
11:case
14:case
18:case
21:dm(d,32);break}dm(d,46);av(d,a(p+A));dm(d,b);var
u=hS(d)}var
f=mL(u,h);if(15===c){var
v=Qj(h),B=w(f);if(3===v)return h<0?pZ:p0;if(4<=v)return p1;var
j=0;for(;;){if(j===B)var
x=0;else{var
n=O(f,j)-46|0,C=23<n>>>0?55===n?1:0:21<(n-1|0)>>>0?1:0;if(!C){var
j=j+1|0;continue}var
x=1}return x?f:bx(f,p2)}}return f}function
d0(h,g,f,e,i,d,c,a){if(typeof
i==="number"){if(typeof
d==="number")return 0===d?function(d){return x(h,g,[4,f,b(c,a,d)],e)}:function(i,d){return x(h,g,[4,f,cQ(i,b(c,a,d))],e)};var
m=d[1];return function(d){return x(h,g,[4,f,cQ(m,b(c,a,d))],e)}}else{if(0===i[0]){var
j=i[2],k=i[1];if(typeof
d==="number")return 0===d?function(d){return x(h,g,[4,f,aU(k,j,b(c,a,d))],e)}:function(i,d){return x(h,g,[4,f,aU(k,j,cQ(i,b(c,a,d)))],e)};var
n=d[1];return function(d){return x(h,g,[4,f,aU(k,j,cQ(n,b(c,a,d)))],e)}}var
l=i[1];if(typeof
d==="number")return 0===d?function(i,d){return x(h,g,[4,f,aU(l,i,b(c,a,d))],e)}:function(j,i,d){return x(h,g,[4,f,aU(l,j,cQ(i,b(c,a,d)))],e)};var
o=d[1];return function(i,d){return x(h,g,[4,f,aU(l,i,cQ(o,b(c,a,d)))],e)}}}function
fu(g,f,e,c,a,b){if(typeof
a==="number")return function(a){return x(g,f,[4,e,d(b,a)],c)};else{if(0===a[0]){var
h=a[2],i=a[1];return function(a){return x(g,f,[4,e,aU(i,h,d(b,a))],c)}}var
j=a[1];return function(h,a){return x(g,f,[4,e,aU(j,h,d(b,a))],c)}}}function
dJ(g,B,f,A,z){var
c=B,a=A,e=z;for(;;)if(typeof
e==="number")return b(c,f,a);else
switch(e[0]){case
0:var
C=e[1];return function(b){return x(c,f,[5,a,b],C)};case
1:var
G=e[1];return function(b){if(40<=b)if(92===b)var
e=nv,d=2;else
var
d=dM<=b?0:1;else
if(32<=b)if(39<=b)var
e=nw,d=2;else
var
d=1;else
if(14<=b)var
d=0;else
switch(b){case
8:var
e=nx,d=2;break;case
9:var
e=ny,d=2;break;case
10:var
e=nz,d=2;break;case
13:var
e=nA,d=2;break;default:var
d=0}switch(d){case
0:var
g=aZ(4);X(g,0,92);X(g,1,48+(b/eV|0)|0);X(g,2,48+((b/10|0)%10|0)|0);X(g,3,48+(b%10|0)|0);var
e=g;break;case
1:var
h=aZ(1);X(h,0,b);var
e=h;break}var
i=w(e),j=bJ(i+2|0,39);bF(e,0,j,1,i);return x(c,f,[4,a,j],G)};case
2:var
H=e[2],I=e[1];return fu(c,f,a,H,I,function(a){return a});case
3:return fu(c,f,a,e[2],e[1],o5);case
4:return d0(c,f,a,e[4],e[2],e[3],pV,e[1]);case
5:return d0(c,f,a,e[4],e[2],e[3],pW,e[1]);case
6:return d0(c,f,a,e[4],e[2],e[3],pX,e[1]);case
7:return d0(c,f,a,e[4],e[2],e[3],pY,e[1]);case
8:var
i=e[4],j=e[3],l=e[2],k=e[1];if(typeof
l==="number"){if(typeof
j==="number")return 0===j?function(b){return x(c,f,[4,a,b0(k,fs,b)],i)}:function(d,b){return x(c,f,[4,a,b0(k,d,b)],i)};var
aa=j[1];return function(b){return x(c,f,[4,a,b0(k,aa,b)],i)}}else{if(0===l[0]){var
o=l[2],p=l[1];if(typeof
j==="number")return 0===j?function(b){return x(c,f,[4,a,aU(p,o,b0(k,fs,b))],i)}:function(d,b){return x(c,f,[4,a,aU(p,o,b0(k,d,b))],i)};var
ab=j[1];return function(b){return x(c,f,[4,a,aU(p,o,b0(k,ab,b))],i)}}var
q=l[1];if(typeof
j==="number")return 0===j?function(d,b){return x(c,f,[4,a,aU(q,d,b0(k,fs,b))],i)}:function(e,d,b){return x(c,f,[4,a,aU(q,e,b0(k,d,b))],i)};var
ac=j[1];return function(d,b){return x(c,f,[4,a,aU(q,d,b0(k,ac,b))],i)}}case
9:return fu(c,f,a,e[2],e[1],cm);case
10:var
a=[7,a],e=e[1];continue;case
11:var
a=[2,a,e[1]],e=e[2];continue;case
12:var
a=[3,a,e[1]],e=e[2];continue;case
13:var
J=e[3],L=e[2],r=hQ(16);ft(r,L);var
y=hS(r);return function(b){return x(c,f,[4,a,y],J)};case
14:var
M=e[3],N=e[2];return function(d){var
e=d[1],b=F(e,P(ai(N)));if(typeof
b[2]==="number")return x(c,f,a,K(b[1],M));throw aq};case
15:var
O=e[1];return function(e,d){return x(c,f,[6,a,function(a){return b(e,a,d)}],O)};case
16:var
Q=e[1];return function(b){return x(c,f,[6,a,b],Q)};case
17:var
a=[0,a,e[1]],e=e[2];continue;case
18:var
n=e[1];if(0===n[0]){var
R=e[2],S=n[1][1],T=0,c=function(c,d,e){return function(b,a){return x(d,b,[1,c,[0,a]],e)}}(a,c,R),a=T,e=S;continue}var
U=e[2],V=n[1][1],W=0,c=function(c,d,e){return function(b,a){return x(d,b,[1,c,[1,a]],e)}}(a,c,U),a=W,e=V;continue;case
19:throw[0,E,p4];case
20:var
Y=e[3],Z=[8,a,p5];return function(a){return x(c,f,Z,Y)};case
21:var
_=e[2];return function(b){return x(c,f,[4,a,df(p6,b)],_)};case
22:var
$=e[1];return function(b){return x(c,f,[5,a,b],$)};case
23:var
h=e[2],m=e[1];if(typeof
m==="number")switch(m){case
0:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
1:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
2:throw[0,E,p7];default:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h])}else
switch(m[0]){case
0:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
1:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
2:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
3:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
4:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
5:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
6:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
7:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
8:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);case
9:var
v=m[2];return g<50?gH(g+1|0,c,f,a,v,h):au(gH,[0,c,f,a,v,h]);case
10:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h]);default:return g<50?D(g+1|0,c,f,a,h):au(D,[0,c,f,a,h])}default:var
s=e[3],t=e[1],u=d(e[2],0);return g<50?gG(g+1|0,c,f,a,s,t,u):au(gG,[0,c,f,a,s,t,u])}}function
gH(f,e,d,c,a,b){if(typeof
a==="number")return f<50?D(f+1|0,e,d,c,b):au(D,[0,e,d,c,b]);else
switch(a[0]){case
0:var
g=a[1];return function(a){return a2(e,d,c,g,b)};case
1:var
h=a[1];return function(a){return a2(e,d,c,h,b)};case
2:var
i=a[1];return function(a){return a2(e,d,c,i,b)};case
3:var
j=a[1];return function(a){return a2(e,d,c,j,b)};case
4:var
k=a[1];return function(a){return a2(e,d,c,k,b)};case
5:var
l=a[1];return function(a){return a2(e,d,c,l,b)};case
6:var
m=a[1];return function(a){return a2(e,d,c,m,b)};case
7:var
n=a[1];return function(a){return a2(e,d,c,n,b)};case
8:var
o=a[2];return function(a){return a2(e,d,c,o,b)};case
9:var
p=a[3],q=a[2],r=an(ai(a[1]),q);return function(a){return a2(e,d,c,aF(r,p),b)};case
10:var
s=a[1];return function(f,a){return a2(e,d,c,s,b)};case
11:var
t=a[1];return function(a){return a2(e,d,c,t,b)};case
12:var
u=a[1];return function(a){return a2(e,d,c,u,b)};case
13:throw[0,E,p8];default:throw[0,E,p9]}}function
D(e,c,b,f,a){var
d=[8,f,p_];return e<50?dJ(e+1|0,c,b,d,a):au(dJ,[0,c,b,d,a])}function
gG(i,c,b,g,a,f,e){if(f){var
j=f[1];return function(f){return p3(c,b,g,a,j,d(e,f))}}var
h=[4,g,e];return i<50?dJ(i+1|0,c,b,h,a):au(dJ,[0,c,b,h,a])}function
x(a,b,c,d){return hj(dJ(0,a,b,c,d))}function
a2(a,b,c,d,e){return hj(gH(0,a,b,c,d,e))}function
p3(a,b,c,d,e,f){return hj(gG(0,a,b,c,d,e,f))}function
ca(b,f){var
a=f;for(;;)if(typeof
a==="number")return 0;else
switch(a[0]){case
0:var
g=a[1],h=hT(a[2]);ca(b,g);return bZ(b,h);case
1:var
c=a[2],e=a[1];if(0===c[0]){var
i=c[1];ca(b,e);bZ(b,p$);var
a=i;continue}var
j=c[1];ca(b,e);bZ(b,qa);var
a=j;continue;case
6:var
m=a[2];ca(b,a[1]);return d(m,b);case
7:var
a=a[1];continue;case
8:var
n=a[2];ca(b,a[1]);return ah(n);case
2:case
4:var
k=a[2];ca(b,a[1]);return bZ(b,k);default:var
l=a[2];ca(b,a[1]);return hP(b,l)}}function
cb(b,f){var
a=f;for(;;)if(typeof
a==="number")return 0;else
switch(a[0]){case
0:var
g=a[1],h=hT(a[2]);cb(b,g);return bZ(b,h);case
1:var
c=a[2],e=a[1];if(0===c[0]){var
i=c[1];cb(b,e);bZ(b,qb);var
a=i;continue}var
j=c[1];cb(b,e);bZ(b,qc);var
a=j;continue;case
6:var
m=a[2];cb(b,a[1]);return bZ(b,d(m,0));case
7:var
a=a[1];continue;case
8:var
n=a[2];cb(b,a[1]);return ah(n);case
2:case
4:var
k=a[2];cb(b,a[1]);return bZ(b,k);default:var
l=a[2];cb(b,a[1]);return hP(b,l)}}function
hU(b,a){var
c=a[1];return x(function(e,c){var
a=dY(64);cb(a,c);return d(b,hO(a))},0,0,c)}function
aP(a){return hU(function(a){return a},a)}H(0);H(0);H(0);var
fv=[0,0];function
fx(c,b){var
a=c[b+1];return 1-(typeof
a==="number")?cN(a)===lY?d(aP(qd),a):cN(a)===253?b_(a):qe:d(aP(qf),a)}function
hV(c,a){if(c.length-1<=a)return qg;var
d=hV(c,a+1|0),e=fx(c,a);return b(aP(qh),e,d)}function
qi(a){var
c=a.length-1;if(2<c>>>0){var
e=hV(a,2),f=fx(a,1);return b(aP(qj),f,e)}switch(c){case
0:return qk;case
1:return ql;default:var
g=fx(a,1);return d(aP(qm),g)}}function
aG(a){function
b(k){var
b=k;for(;;){if(b){var
l=b[2],m=b[1];try{var
n=d(m,a),c=n}catch(a){var
c=0}if(c)return c[1];var
b=l;continue}if(a===hW)return qn;if(a===hX)return qo;if(a[1]===hY){var
e=a[2],h=e[3],o=e[2],p=e[1];return G(aP(fw),p,o,h,h+5|0,qp)}if(a[1]===E){var
f=a[2],i=f[3],q=f[2],r=f[1];return G(aP(fw),r,q,i,i+6|0,qq)}if(a[1]===hZ){var
g=a[2],j=g[3],s=g[2],t=g[1];return G(aP(fw),t,s,j,j+6|0,qr)}if(0===cN(a)){var
u=a[1][1];return bx(u,qi(a))}return a[1]}}return b(fv[1])}function
h0(a){return[0,Ql(a)]}function
cc(v){var
i=h0(v);if(i){var
f=i[1],g=dY(bR),h=f.length-1-1|0,s=0;if(!(h<0)){var
b=s;for(;;){var
a=br(f,b)[b+1],e=function(a){return function(b){return b?0===a?qs:qt:0===a?qu:qv}}(b);if(0===a[0])var
l=a[5],m=a[4],n=a[3],o=a[6]?qw:qy,p=a[2],q=e(a[1]),c=[0,N(aP(qx),q,p,o,n,m,l)];else
if(a[1])var
c=0;else
var
r=e(0),c=[0,d(aP(qz),r)];if(c){var
t=c[1],j=qA[1],k=0;d(x(function(b,a){ca(b,a);return 0},g,k,j),t)}var
u=b+1|0;if(h!==b){var
b=u;continue}break}}return hO(g)}return qB}function
cR(a){fv[1]=[0,a,fv[1]];return 0}function
fy(a){a[2]=(a[2]+1|0)%55|0;var
b=a[2],c=br(a[1],b)[b+1],d=(a[2]+24|0)%55|0,e=(br(a[1],d)[d+1]+(c^(c>>>25|0)&31)|0)&ex,f=a[2];br(a[1],f)[f+1]=e;return e}try{var
Qb=ff(Qa),h2=Qb}catch(a){a=a1(a);if(a!==bY)throw a;try{var
P$=ff(P_),h1=P$}catch(a){a=a1(a);if(a!==bY)throw a;var
h1=qD}var
h2=h1}nH(h2,82);function
h3(d,a){var
b=[0,d,0],c=a[1];return c?(a[1]=b,c[2]=b,0):(a[1]=b,a[2]=b,0)}var
fz=[J,qE,H(0)];function
h4(a){var
b=a[2];if(b){var
c=b[2],d=b[1];a[2]=c;if(0===c)a[1]=0;return d}throw fz}function
d1(a,b){a[13]=a[13]+b[3]|0;return h3(b,a[28])}var
h5=1000000010;function
fA(b,a){return h(b[17],a,0,w(a))}function
fB(a){return d(a[19],0)}function
cp(a,c,b){fB(a);a[11]=1;a[10]=bw(a[8],(a[6]-b|0)+c|0);a[9]=a[6]-a[10]|0;return d(a[21],a[10])}function
h6(b,a){return cp(b,0,a)}function
cS(a,b){a[9]=a[9]-b|0;return d(a[20],b)}function
qF(a){var
b=a[2];if(b){var
c=b[1],d=c[2],e=c[1],f=a[9]<d?1:0;if(f){if(0!==e)return 5<=e?0:h6(a,d);var
g=0}else
var
g=f;return g}return fB(a)}function
qG(a){var
b=h4(a[28]),c=b[1];a[12]=a[12]-b[3]|0;a[9]=a[9]+c|0;return 0}function
qH(a,g,b){if(typeof
b==="number")switch(b){case
0:var
k=a[3];if(k){var
l=k[1][1],m=function(b,a){if(a){var
c=a[1],d=a[2];return bl(b,c)?[0,b,a]:[0,c,m(b,d)]}return[0,b,0]};l[1]=m(a[6]-a[9]|0,l[1]);return 0}return 0;case
1:var
n=a[2];return n?(a[2]=n[2],0):0;case
2:var
o=a[3];return o?(a[3]=o[2],0):0;case
3:var
p=a[2];return p?h6(a,p[1][2]):fB(a);case
4:var
q=a[10]!==(a[6]-a[9]|0)?1:0;return q?qG(a):q;default:var
h=a[5];if(h){var
A=h[2];fA(a,d(a[25],h[1]));a[5]=A;return 0}return 0}else
switch(b[0]){case
0:var
B=b[1];a[9]=a[9]-g|0;fA(a,B);a[11]=0;return 0;case
1:var
c=b[2],f=b[1],r=a[2];if(r){var
s=r[1],e=s[2];switch(s[1]){case
0:return cS(a,f);case
1:return cp(a,c,e);case
2:return cp(a,c,e);case
3:return a[9]<g?cp(a,c,e):cS(a,f);case
4:return a[11]?cS(a,f):a[9]<g?cp(a,c,e):((a[6]-e|0)+c|0)<a[10]?cp(a,c,e):cS(a,f);default:return cS(a,f)}}return 0;case
2:var
i=a[6]-a[9]|0,t=a[3],C=b[2],D=b[1];if(t){var
u=t[1][1],E=function(d,c){var
a=c;for(;;){if(a){var
b=a[1],e=a[2];if(bs(b,d))return b;var
a=e;continue}throw bY}},v=u[1];if(v){var
F=v[1];try{var
G=E(i,u[1]),w=G}catch(a){a=a1(a);if(a!==bY)throw a;var
w=F}var
j=w}else
var
j=i;var
x=j-i|0;return 0<=x?cS(a,x+D|0):cp(a,j+C|0,a[6])}return 0;case
3:var
y=b[2],H=b[1];if(a[8]<(a[6]-a[9]|0))qF(a);var
I=a[9]-H|0,J=1===y?1:a[9]<g?y:5;a[2]=[0,[0,J,I],a[2]];return 0;case
4:a[3]=[0,b[1],a[3]];return 0;default:var
z=b[1];fA(a,d(a[24],z));a[5]=[0,z,a[5]];return 0}}function
qI(a){for(;;){var
d=a[28][2];if(d){var
b=d[1],c=b[1],e=c<0?1:0,g=b[3],h=b[2],i=e?(a[13]-a[12]|0)<a[9]?1:0:e,f=1-i;if(f){h4(a[28]);var
j=0<=c?c:h5;qH(a,j,h);a[12]=g+a[12]|0;continue}return f}throw fz}}function
h7(a){try{var
b=qI(a);return b}catch(a){a=a1(a);if(a===fz)return 0;throw a}}var
h8=[0,[0,-1,[0,-1,qJ,0]],0];function
h9(a){a[1]=h8;return 0}function
h_(a,c){var
d=a[1];if(d){var
e=d[1],b=e[2],f=b[1],g=d[2],h=b[2];if(e[1]<a[12])return h9(a);if(typeof
h!=="number")switch(h[0]){case
3:var
i=1-c,k=i?(b[1]=a[13]+f|0,a[1]=g,0):i;return k;case
1:case
2:var
j=c?(b[1]=a[13]+f|0,a[1]=g,0):c;return j}return 0}return 0}var
h$=hE(80,32);function
ia(b,d){var
a=d;for(;;){var
c=0<a?1:0;if(c){if(80<a){h(b[17],h$,0,80);var
a=a-80|0;continue}return h(b[17],h$,0,a)}return c}}function
qL(a){return bx(qN,bx(a,qM))}function
qO(a){return bx(qQ,bx(a,qP))}function
qR(a){return 0}function
qS(a){return 0}function
ib(e,d){function
f(a){return 0}function
g(a){return 0}var
b=[0,0,0],c=[0,-1,qT,0];function
i(a){return 0}h3(c,b);var
a=[0,[0,[0,1,c],h8],0,0,0,0,78,10,68,78,0,1,1,1,1,hq,qU,e,d,i,g,f,0,0,qL,qO,qR,qS,b];a[19]=function(b){return h(a[17],qK,0,1)};a[20]=function(b){return ia(a,b)};a[21]=function(b){return ia(a,b)};return a}function
ic(c){function
a(a){return hf(c)}return ib(function(d,a,b){if(0<=a)if(0<=b)if(!((w(d)-b|0)<a))return QJ(c,d,a,b);return ah(nk)},a)}function
qV(a){function
b(a){return 0}return ib(function(g,c,b){var
d=c<0?1:0;if(d)var
e=d;else
var
h=b<0?1:0,e=h||((w(g)-b|0)<c?1:0);if(e)ah(oo);var
f=a[2]+b|0;if(a[3]<f)fr(a,b);aN(g,c,a[1],a[2],b);a[2]=f;return 0},b)}var
qW=gR,qX=function(a){return dY(qW)}(0),q=ic(nh);ic(ni);qV(qX);nm(function(i){var
h=q[4];fo(function(f){if(q[23])d1(q,[0,0,5,0]);var
b=q[22];if(b){var
a=q[4];if(a){var
e=a[2];d(q[27],a[1]);q[4]=e;return 0}var
c=0}else
var
c=b;return c},h);for(;;){if(1<q[14]){if(1<q[14]){if(q[14]<q[15]){d1(q,[0,0,1,0]);h_(q,1);h_(q,0)}q[14]=q[14]-1|0}continue}q[13]=h5;h7(q);q[12]=1;q[13]=1;var
a=q[28];a[1]=0;a[2]=0;h9(q);q[2]=0;q[3]=0;q[4]=0;q[5]=0;q[10]=0;q[14]=0;q[9]=q[6];q[14]=q[14]+1|0;var
f=3,g=0;if(q[14]<q[15]){var
c=[0,-q[13]|0,[3,g,f],0];d1(q,c);q[1]=[0,[0,q[13],c],q[1]]}else
if(q[14]===q[15]){var
e=q[16],b=w(e);d1(q,[0,b,[0,e],b]);h7(q)}return d(q[18],0)}});var
qY=0,qZ=bR,q0=bR;function
q1(a){throw fl}(function(h,g,e){var
b=aZ(bR),a=[0,0],c=[0,0],f=[0,0];function
i(i){if(a[1]<c[1]){var
g=mJ(b,a[1]);a[1]++;return g}if(f[1])throw fl;c[1]=hx(e,b,0,q0);return 0===c[1]?(f[1]=1,d(h,e)):(a[1]=1,mJ(b,0))}return[0,0,qY,0,0,0,0,i,dY(qZ),g]}(q1,[1,q2,hv],hv));H(0);function
q3(b,a){var
c=cN(a)===J?a:a[1];return QR(b,c)}try{ff(P9)}catch(a){a=a1(a);if(a!==bY)throw a}try{ff(P8)}catch(a){a=a1(a);if(a!==bY)throw a}var
Q$=at(hG,q4)?at(hG,q5)?1:0:0,id=ag,q9=id.Array,ie=[J,q_,H(0)];q3(q$,[0,ie,{}]);(function(a){throw a});var
q6=undefined,q7=true,q8=false;cR(function(a){return a[1]===ie?[0,bk(a[2].toString())]:0});cR(function(a){return a
instanceof
q9?0:[0,bk(a.toString())]});function
ra(b,a){var
c=b.toString();return QB(0)[c]=a}H(0);var
rb="2d";id.HTMLElement===q6;function
ig(a){return 0===a?0:ig(a>>>1|0)+1|0}function
ih(a){return 0===a?0:0<a?1:-1}Q2(0);var
ii=eL,rc=ex,rd=-1073741823;function
dp(a){return a.length-1-1|0}function
az(a){if(0<=a){var
b=aM(a);dj(b,0,a);return b}return ah(re)}var
ij=az(2),ik=az(1),il=az(2);function
cd(d,c,a){var
b=aM(a);aK(b,0,d,c,a);return b}function
cq(b,a,c){var
d=bV(b,a,c);return 0===cO(az(1),0,1,b,a,d)?1:0}function
im(b,a,d){var
c=1===bV(b,a,d)?1:0,e=c?m5(b,a):c;return e}function
rg(a){return im(a,0,dp(a))?fk(a,0):ap(rf)}function
d2(a){if(0<=a){var
b=az(1);return 0===a?b:(aS(b,0,a),b)}return ah(rh)}var
io=az(2);aS(io,0,lH);var
ri=d2(lH);function
ip(f,e){if(im(f,e,1))return a(p+fk(f,e));aK(il,0,f,e,1);hk(ij,0,ik,0,il,0,2,ri,0);var
g=fk(ij,0),h=a(p+fk(ik,0)),b=w(h);if(10<=g){var
c=bJ(11,48);aN(a(p+g),0,c,0,2);aN(h,0,c,a0(c)-b|0,b);return fp(c)}var
d=bJ(10,48),i=48+g|0;if(0<=i)if(j<i)var
k=0;else
var
l=i,k=1;else
var
k=0;if(!k)var
l=ah(nu);cG(d,0,l);aN(h,0,d,a0(d)-b|0,b);return fp(d)}function
rj(e,d,l){var
b=bV(e,d,l);if(1===b)return ip(e,d);var
a=[0,b+1|0],c=aM(a[1]),f=az(a[1]),i=az(2);if(107374182<b)return ap(rk);var
j=10*b|0,k=bJ(j,48),g=[0,j];a[1]=a[1]-1|0;aK(c,0,e,d,b);aS(c,b,0);for(;;){if(cq(c,0,a[1]))return k;hk(f,0,i,0,c,0,a[1]+1|0,io,0);var
h=ip(i,0);aN(h,0,k,g[1]-w(h)|0,w(h));g[1]=g[1]-9|0;a[1]=bV(f,0,a[1]);aK(c,0,f,0,a[1]);aS(c,a[1],0);continue}}function
iq(d){var
b=rj(d,0,dp(d)),c=[0,0];try{var
e=w(b)-2|0,f=0;if(!(e<0)){var
a=f;for(;;){if(48!==O(b,a)){c[1]=a;throw hp}var
g=a+1|0;if(e!==a){var
a=g;continue}break}}}catch(a){a=a1(a);if(a!==hp)throw a}return hF(b,c[1],w(b)-c[1]|0)}var
b1=[0,0,az(1)],fC=[0,1,d2(1)];function
aj(a){var
b=dp(a[2]);return bV(a[2],0,b)}function
ir(a){var
c=dp(a[2]),b=bV(a[2],0,c);return(b*32|0)-m6(a[2],b-1|0)|0}function
fD(a){var
b=aj(a),c=cd(a[2],0,b);return[0,-a[1]|0,c]}function
rm(a){var
b=aj(a),c=cd(a[2],0,b),d=0===a[1]?0:1;return[0,d,c]}function
cT(a,b){if(0===a[1])if(0===b[1])return 0;if(a[1]<b[1])return-1;if(b[1]<a[1])return 1;if(1===a[1]){var
c=aj(b),d=b[2],e=aj(a);return cO(a[2],0,e,d,0,c)}var
f=aj(a),g=a[2],h=aj(b);return cO(b[2],0,h,g,0,f)}function
cr(b,a){return 0===cT(b,a)?1:0}function
fE(b,a){return cT(b,a)<=0?1:0}function
fF(b,a){return 0<=cT(b,a)?1:0}function
fG(b,a){return cT(b,a)<0?1:0}function
fH(b,a){return 0<cT(b,a)?1:0}function
rn(a){var
f=a[1];if(0===f)return[0,-1,d2(1)];if(1===f){var
c=aj(a),d=cd(a[2],0,c);fh(d,0,c,0);var
h=cq(d,0,c)?0:1;return[0,h,d]}var
e=aj(a),g=e+1|0,b=aM(g);aK(b,0,a[2],0,e);aS(b,e,0);dU(b,0,g,1);return[0,-1,b]}function
ro(a){var
f=a[1];if(-1===f){var
c=aj(a),d=cd(a[2],0,c);fh(d,0,c,0);var
h=cq(d,0,c)?0:-1;return[0,h,d]}if(0===f)return[0,1,d2(1)];var
e=aj(a),g=e+1|0,b=aM(g);aK(b,0,a[2],0,e);aS(b,e,0);dU(b,0,g,1);return[0,1,b]}function
d3(a,d){var
b=aj(a),c=aj(d);if(a[1]===d[1]){if(-1===cO(a[2],0,b,d[2],0,c)){var
e=aM(c+1|0);aK(e,0,d[2],0,c);aS(e,c,0);e9(e,0,c+1|0,a[2],0,b,0);var
g=e}else{var
f=aM(b+1|0);aK(f,0,a[2],0,b);aS(f,b,0);e9(f,0,b+1|0,d[2],0,c,0);var
g=f}return[0,a[1],g]}var
h=cO(a[2],0,b,d[2],0,c);if(0===h)return b1;if(1===h){var
i=cd(a[2],0,b);dX(i,0,b,d[2],0,c,1);return[0,a[1],i]}var
j=cd(d[2],0,c);dX(j,0,c,a[2],0,b,1);return[0,d[1],j]}function
y(b){var
a=aM(1);if(b===eL){aS(a,0,ex);dU(a,0,1,1)}else
aS(a,0,bX(b));return[0,ih(b),a]}function
d4(b,a){return d3(b,fD(a))}function
is(b,a){var
c=aj(b),d=aj(a),e=c+d|0,f=az(e);if(c<d)fj(f,0,e,a[2],0,d,b[2],0,c);else
fj(f,0,e,b[2],0,c,a[2],0,d);return[0,aL(b[1],a[1]),f]}function
it(c,b){if(0===b[1])throw fI;var
d=aj(c),a=aj(b),j=cO(c[2],0,d,b[2],0,a);if(-1===j){if(0<=c[1])return[0,y(0),c];if(0<=b[1]){var
m=d3(b,c);return[0,y(-1),m]}var
n=d4(c,b);return[0,y(1),n]}if(0===j)return[0,y(aL(c[1],b[1])),b1];var
i=-1===c[1]?1:0,g=i?bI((d-a|0)+1|0,1)+1|0:bI((d-a|0)+1|0,1),h=bI(d,a)+1|0,e=aM(g),f=aM(h);aK(f,0,c[2],0,d);dj(f,d,h-d|0);Q1(f,0,h,b[2],0,a);aK(e,0,f,a,h-a|0);var
k=1-cq(f,0,a);if(i)if(k){var
l=cd(b[2],0,a);dX(l,0,a,f,0,a,1);aS(e,g-1|0,0);dU(e,0,g,1);return[0,[0,-b[1]|0,e],[0,1,l]]}if(i)aS(e,g-1|0,0);var
o=cd(f,0,a),p=k?1:0,q=[0,p,o],r=cq(e,0,g)?0:aL(c[1],b[1]);return[0,[0,r,e],q]}function
iu(b,a){return it(b,a)[1]}function
iv(b,a){return it(b,a)[2]}var
rp=y(ii);function
rq(b){try{var
a=rg(b[2]),c=-1===b[1]?-a|0:a;return c}catch(a){a=a1(a);if(a[1]===bW)return cr(b,rp)?ii:ap(rr);throw a}}function
rs(a){if(de(a,rt))var
c=0,b=ru;else
if(dS(a,rv))var
c=1,b=a;else
var
c=-1,b=bt(a);var
d=aM(2);hm(d,0,e$(b));hm(d,1,e$(QA(b,32)));return[0,c,d]}function
iw(b){var
c=aj(b);if(1===c)var
a=mM(cl(hl(b[2],0)),rw);else
if(2===c)var
d=Qz(cl(hl(b[2],1)),32),a=mQ(mM(cl(hl(b[2],0)),rB),d);else
var
a=ap(rC);if(0<=b[1])return bs(a,rx)?a:ap(ry);if(!bs(a,rz))if(!de(a,hJ))return ap(rA);return bt(a)}function
d5(a){return-1===a[1]?bx(rD,iq(a[2])):iq(a[2])}function
dq(F,p,r,E,i){if(r<1)ap(rE);var
c=az(33),d=[0,0],j=[0,0];aS(c,0,i);for(;;){d[1]++;if(Q3(c,d[1])){fi(c,d[1],2,c,d[1]-1|0,1,c,0);continue}for(;;){if(j[1]<(d[1]-1|0))if(m5(c,j[1])){j[1]++;continue}var
y=j[1],g=1+dR(r,(d[1]-2|0)+1|0)|0,b=[0,1],k=[0,bw(2,g)],e=az(g),v=az(g),h=[0,0],q=(p+r|0)-1|0,l=[0,0];if(!(q<p)){var
f=p;for(;;){var
a=O(F,f),G=32<=a?93<=a?95===a?p<f?2:0:0:58<(a-33|0)>>>0?1:0:11<=a?13===a?1:0:9<=a?1:0;switch(G){case
0:if(48<=a)if(a<=(47+bw(i,10)|0))var
o=a-48|0,s=1;else
var
s=0;else
var
s=0;if(!s){if(65<=a)if(a<=((65+i|0)+gN|0))var
o=a+k2|0,t=1;else
var
t=0;else
var
t=0;if(!t){if(97<=a)if(a<=((97+i|0)+gN|0))var
o=a-87|0,u=1;else
var
u=0;else
var
u=0;if(!u)var
o=ap(rl)}}l[1]=aL(l[1],i)+o|0;h[1]++;break;case
1:break}var
z=h[1]===y?1:0,w=z||(f===q?1:0),A=w?1-(0===h[1]?1:0):w;if(A){aS(e,0,l[1]);var
x=g===b[1]?b[1]-1|0:b[1],B=1;if(!(x<1)){var
n=B;for(;;){aS(e,n,0);var
D=n+1|0;if(x!==n){var
n=D;continue}break}}fi(e,0,k[1],v,0,b[1],c,h[1]-1|0);aK(v,0,e,0,k[1]);b[1]=bV(e,0,k[1]);k[1]=bw(g,b[1]+1|0);l[1]=0;h[1]=0}var
C=f+1|0;if(q!==f){var
f=C;continue}break}}var
m=aM(b[1]);aK(m,0,e,0,b[1]);return cq(m,0,dp(m))?b1:[0,E,m]}}}function
fJ(c,b,a,e){if(a<1)ap(rF);if(2<=a){var
f=O(c,b),d=O(c,b+1|0);if(48===f){var
g=89<=d?98===d?3:kW===d?2:dN===d?1:0:66===d?3:79===d?2:88<=d?1:0;switch(g){case
0:break;case
1:return dq(c,b+2|0,a-2|0,e,16);case
2:return dq(c,b+2|0,a-2|0,e,8);default:return dq(c,b+2|0,a-2|0,e,2)}}return dq(c,b,a,e,10)}return dq(c,b,a,e,10)}function
cs(a){var
b=w(a),d=0;if(b<1)ap(rG);var
c=O(a,0)+lR|0;if(!(2<c>>>0))switch(c){case
0:return fJ(a,1,b-1|0,1);case
1:break;default:return fJ(a,1,b-1|0,-1)}return fJ(a,d,b,1)}function
rI(a){if(0===a[1])return b1;var
b=aj(a),c=2*b|0,d=az(c);m7(d,0,c,a[2],0,b);return[0,1,d]}function
ix(a,b){if(0<=b){if(0===b)return a;if(0===a[1])return a;var
d=aj(a),c=aM(d+(((b+32|0)-1|0)/32|0)|0),e=b/32|0;dj(c,0,e);aK(c,e,a[2],0,d);var
f=b%32|0;if(0<f)hn(c,e,d,c,e+d|0,f);return[0,a[1],c]}return ah(rJ)}function
iy(a,b){if(0<=b){if(0===b)return a;if(0===a[1])return a;var
f=aj(a),e=b/32|0,g=b%32|0;if(f<=e)return b1;var
c=f-e|0,d=aM(c);aK(d,0,a[2],e,c);if(0<g)ho(d,0,c,aM(1),0,g);return cq(d,0,c)?b1:[0,a[1],d]}return ah(rK)}function
rP(b){var
k=ir(b);if(63<k){var
a=k+k2|0;if(0<=a)if(0<=b[1])var
c=iy(b,a);else{if(0<=a)if(0===a)var
e=b1;else{var
f=a/32|0,g=f+1|0,d=az(g);hm(d,f,1<<(a%32|0));fh(d,0,g,0);var
e=[0,1,d]}else
var
e=ah(rL);var
c=iy(d4(b,e),a)}else
var
c=ah(rM);var
n=cr(b,ix(c,a)),h=ir(c),i=55<=h?1:0,l=i?h<=63?1:0:i;if(l){var
j=iw(c),m=n?j:mQ(j,rN);return mS(hc(m),a)}throw[0,E,rO]}return hc(iw(b))}y(rc);y(rd);var
v=de,ct=cM,aV=[0,de,cM];function
rQ(b,a){return br(b,a)[a+1]}function
fK(e,d,c){var
a=b(e,d,c);return 0===a?1:0<=a?2:0}function
z(b,a){return fK(Qk,b,a)}var
cU=bl,cV=cL,cW=bs,cX=dS;function
d6(a,d,c){var
b=bl(d,a);return b?dS(c,a):b}function
d7(a,d,c){var
b=cL(d,a);return b?bs(c,a):b}function
dr(b,a){return 0===z(b,a)?[0,b,a]:[0,a,b]}var
ds=bl,dt=cL,du=bs,dv=dS;function
cY(b,a){return hU(a,b)}function
r(a){return aP(a)}function
fL(a){var
b=cN(a);return da===b?a[1]:g===b?fq(a):a}function
bm(a){throw a}function
fM(a){return cY(a,function(a){return bm([0,dk,a])})}function
by(a){return cY(a,function(a){return bm([0,bW,a])})}function
iz(a){return Qg(0)?[0,Qr(0)]:0}function
dw(a){try{var
b=[0,fL(a)];return b}catch(a){return 0}}function
b2(a){return a}function
i(b,a){return d(a,b)}var
rR=0,iA=1;function
rS(a){return a|0}var
iB=fb;function
rT(a){return a}function
iC(a){return dw([g,function(b){return fb(a)}])}function
rU(b,a){return b+a|0}function
rV(b,a){return b-a|0}function
rW(a){return-a|0}function
iD(b,a){return aL(b,a)}var
rX=dR;function
iE(a){return aL(a,a)}var
rY=b9;function
rZ(a){return a-1|0}function
r0(a){return a+1|0}var
dx=aV[1],iF=aV[2];function
r1(a){return-a|0}function
r2(a){return a}function
r3(b,a){return b+a|0}function
r4(b,a){return b-a|0}function
r5(b,a){return aL(b,a)}var
r6=dR,r7=b9;function
r8(a){return dw([g,function(b){return ht(a)}])}var
cZ=aV[1],r9=aV[2];function
d8(c,a,d){if(c){if(a)return b(d,c[1],a[1])}else
if(!a)return 1;return 0}function
fN(c,a,d){if(c){var
e=c[1];return a?b(d,e,a[1]):2}return a?0:1}function
c0(a,b){if(a){var
c=d(b,a[1]);return d(r(r_),c)}return r$}function
dy(b,a){return b?[0,a]:0}function
sa(a,b){return a?a[1]:b}function
iG(a){return cY(a,function(b,a){return a?a[1]:bm([0,bW,b])})}function
d9(a,b){return a?[0,d(b,a[1])]:0}function
iH(a,c,b){return a?d(b,a[1]):c}function
fO(a){return a?1:0}function
iI(a){return a?0:1}function
iJ(a,b){return a?d(b,a[1]):0}var
sb=0;function
iK(a){var
b=iG(sc),c=a?[0,a[1]]:0;return i(c,b)}function
ak(c){var
b=0,a=c;for(;;){if(a){var
b=[0,a[1],b],a=a[2];continue}return b}}function
dz(d,c){var
b=c,a=d;for(;;){if(a){var
b=[0,a[1],b],a=a[2];continue}return b}}function
ax(b,a){return dz(ak(b),a)}function
bn(e,c){var
b=0,a=e;for(;;){if(a){var
f=a[2],b=[0,d(c,a[1]),b],a=f;continue}return ak(b)}}function
iL(h,g,f){var
d=h,c=0,a=g;for(;;){if(a){var
i=a[2],e=b(f,d,a[1]),d=e[1],c=[0,e[2],c],a=i;continue}return ak(c)}}function
se(a,c){return iL(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
aH(e,c){var
b=0,a=e;for(;;){if(a){var
f=a[2],b=dz(d(c,a[1]),b),a=f;continue}return ak(b)}}function
iM(h,g,f){var
d=h,c=0,a=g;for(;;){if(a){var
i=a[2],e=b(f,d,a[1]),j=e[1],d=j,c=dz(e[2],c),a=i;continue}return ak(c)}}function
sf(a,c){return iM(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
sg(f,e){var
b=0,a=f;for(;;){if(a){var
c=a[1],g=a[2],h=d(e,c)?[0,c,b]:b,b=h,a=g;continue}return ak(b)}}function
iN(i,h,g){var
d=i,c=0,a=h;for(;;){if(a){var
e=a[1],j=a[2],f=b(g,d,e),k=f[1],l=f[2]?[0,e,c]:c,d=k,c=l,a=j;continue}return ak(c)}}function
sh(a,c){return iN(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
d_(f,e){var
b=0,a=f;for(;;){if(a){var
g=a[2],c=d(e,a[1]),h=c?[0,c[1],b]:b,b=h,a=g;continue}return ak(b)}}function
iO(i,h,g){var
d=i,c=0,a=h;for(;;){if(a){var
j=a[2],e=b(g,d,a[1]),f=e[2],k=e[1],l=f?[0,f[1],c]:c,d=k,c=l,a=j;continue}return ak(c)}}function
si(a,c){return iO(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
c1(f,e,d){var
c=f,a=e;for(;;){if(a){var
g=a[2],c=b(d,c,a[1]),a=g;continue}return c}}function
d$(a,b){var
c=a?a[1]:sl;function
d(a){return sa(a,sj)}function
e(b,a){return h(r(sk),b,c,a)}return i(i(b,function(a){return a?[0,c1(a[1],a[2],e)]:0}),d)}function
c2(b,a){var
c=r(sm);function
d(a){return d$(sn,a)}return i(i(i(b,function(b){return bn(b,a)}),d),c)}function
fP(c,b,a){try{var
d=ns(a,c,b);return d}catch(a){a=a1(a);if(a[1]===dk)return 0;throw a}}function
fQ(a,b){if(a){var
c=a[1],d=fQ(a[2],b);return hu(fn(function(a){return[0,c,a]},b),d)}return 0}function
iP(a,c){var
b=a?a[1]:hq;return Qq(b)}function
so(a){var
b=a[4],c=a[3],d=a[2],e=a[1];return B(r(sp),e,d,c,b)}function
sq(g){var
d=h0(g);if(d){var
b=d[1],a=b.length-1-1|0;for(;;){if(-1===a)var
f=0;else{var
e=0===br(b,a)[a+1][0]?1:0;if(!e){var
a=a-1|0;continue}var
f=e}var
c=f?[0,b]:0;break}}else
var
c=0;return c?hH(c[1]):0}var
sr=0,iQ=1;function
ss(a){return a}var
iR=mK;function
st(a){return a|0}function
iS(a){return dw([g,function(b){return mK(a)}])}function
su(b,a){return b+a}function
sv(b,a){return b-a}function
sw(a){return-a}function
iT(b,a){return b*a}function
sx(b,a){return b/a}function
iU(a){return a*a}function
sy(a){return Math.abs(a)}function
sz(b,a){return b%a}var
sA=aV[1],sB=aV[2];function
sC(a){return-a}function
sD(a){return a}function
sE(b,a){return b+a}function
sF(b,a){return b-a}function
sG(b,a){return b*a}function
sH(b,a){return b/a}function
sI(b,a){return b%a}function
fR(a){switch(a){case
0:return sJ;case
1:return sK;case
2:return sL;case
3:return sM;default:return sN}}var
sO=aV[1],sP=aV[2];function
bK(b,a){b[1]=a;return 0}function
cu(a){return d(r(sQ),a)}var
sR=aV[1],sS=aV[2];function
iV(c){var
b=[0,0],d=w(c)-1|0;if(!(d<0)){var
a=d;for(;;){var
e=b[1];bK(b,[0,O(c,a),e]);var
f=a-1|0;if(0!==a){var
a=f;continue}break}}return b[1]}function
iW(c){var
b=0,a=c;for(;;){if(a){var
b=b+1|0,a=a[2];continue}var
d=aZ(b),e=function(b,a){return cG(d,b,a)};i(c,function(f){var
b=0,a=f;function
d(a,b){e(a,b);return a+1|0}for(;;){if(a){var
c=a[2],b=d(b,a[1]),a=c;continue}return 0}});return fp(d)}}function
sT(c,a){var
d=bs(w(c),w(a));if(d){var
e=w(a);return b(cZ,a,hF(c,w(c)-e|0,e))}return d}var
sU=0;function
L(g,f,d){var
a=g?g[1]:0,c=f?f[1]:1;if(cL(aL(d-a|0,c),0))return 0;if(dS(c,0)){var
h=(d-1|0)-b9((d-1|0)-a|0,c)|0;if(b(cZ,b9(h-a|0,c),0))return[0,[0,a,h,c]];throw[0,E,sV]}var
e=-c|0,i=(d+1|0)-b9((d+1|0)-a|0,e)|0;if(b(cZ,b9(a-i|0,e),0))return[1,[0,i,a,e]];throw[0,E,sW]}function
iX(a){if(typeof
a==="number")return sX;else{if(0===a[0]){var
b=a[1],d=b[3],e=b[2],f=b[1];return h(r(sY),f,e,d)}var
c=a[1],g=c[3],i=c[2],j=c[1];return h(r(sZ),i,j,g)}}function
fS(d){if(typeof
d==="number")return 0;else{if(0===d[0]){var
e=d[1],i=e[1],f=0,a=e[2],k=e[3];for(;;){if(bs(a,i)){if(b(cZ,a,i))return[0,a,f];var
f=[0,a,f],a=a-k|0;continue}throw[0,E,s0]}}var
g=d[1],j=g[2],h=0,c=g[1],l=g[3];for(;;){if(cL(c,j)){if(b(cZ,c,j))return[0,c,h];var
h=[0,c,h],c=c+l|0;continue}throw[0,E,s1]}}}function
fT(b,a){function
c(b){return bn(b,a)}return i(i(b,fS),c)}function
iY(a){return a[2]}function
fU(c,a,e,d){var
f=a[2],g=c[2];switch(b(e,c[1],a[1])){case
0:return 0;case
1:return b(d,g,f);default:return 2}}function
ea(c,a,f,e){var
g=a[2],h=c[2],d=b(f,c[1],a[1]);return d?b(e,h,g):d}function
c3(a,e,c){var
f=a[1],g=d(c,a[2]),h=d(e,f);return b(r(s2),h,g)}function
fV(c,a,f,e,d){var
g=a[3],h=a[2],i=c[3],j=c[2];switch(b(f,c[1],a[1])){case
0:return 0;case
1:switch(b(e,j,h)){case
0:return 0;case
1:return b(d,i,g);default:return 2}default:return 2}}function
fW(c,a,i,h,g){var
j=a[3],k=a[2],l=c[3],m=c[2],d=b(i,c[1],a[1]);if(d){var
e=b(h,m,k);if(e)return b(g,l,j);var
f=e}else
var
f=d;return f}function
fX(a,e,c,b){var
f=a[2],g=a[1],i=d(b,a[3]),j=d(c,f),k=d(e,g);return h(r(s3),k,j,i)}function
fY(c,a,g,f,e,d){var
h=a[4],i=a[3],j=a[2],k=c[4],l=c[3],m=c[2];switch(b(g,c[1],a[1])){case
0:return 0;case
1:switch(b(f,m,j)){case
0:return 0;case
1:switch(b(e,l,i)){case
0:return 0;case
1:return b(d,k,h);default:return 2}default:return 2}default:return 2}}function
fZ(c,a,k,j,i,h){var
l=a[4],m=a[3],n=a[2],o=c[4],p=c[3],q=c[2],e=b(k,c[1],a[1]);if(e){var
f=b(j,q,n);if(f){var
g=b(i,p,m);if(g)return b(h,o,l);var
d=g}else
var
d=f}else
var
d=e;return d}function
f0(a,f,e,c,b){var
g=a[3],h=a[2],i=a[1],j=d(b,a[4]),k=d(c,g),l=d(e,h),m=d(f,i);return B(r(s4),m,l,k,j)}function
f1(c,a,h,g,f,e,d){var
i=a[5],j=a[4],k=a[3],l=a[2],m=c[5],n=c[4],o=c[3],p=c[2];switch(b(h,c[1],a[1])){case
0:return 0;case
1:switch(b(g,p,l)){case
0:return 0;case
1:switch(b(f,o,k)){case
0:return 0;case
1:switch(b(e,n,j)){case
0:return 0;case
1:return b(d,m,i);default:return 2}default:return 2}default:return 2}default:return 2}}function
f2(c,a,m,l,k,j,i){var
n=a[5],o=a[4],p=a[3],q=a[2],r=c[5],s=c[4],t=c[3],u=c[2],e=b(m,c[1],a[1]);if(e){var
f=b(l,u,q);if(f){var
g=b(k,t,p);if(g){var
h=b(j,s,o);if(h)return b(i,r,n);var
d=h}else
var
d=g}else
var
d=f}else
var
d=e;return d}function
f3(a,g,f,e,c,b){var
h=a[4],i=a[3],j=a[2],k=a[1],l=d(b,a[5]),m=d(c,h),n=d(e,i),o=d(f,j),p=d(g,k);return G(r(s5),p,o,n,m,l)}function
s6(c){var
a=[0,0];for(;;){var
b=cn(c);if(b){var
d=b[1];co(c);bK(a,[0,d,a[1]]);continue}return ak(a[1])}}function
ce(a){function
b(b){co(a);return b}function
c(a){return d9(a,b)}return i(cn(a),c)}function
eb(a,b){function
c(c){co(a);return d(b,c)}function
e(a){return d9(a,c)}return i(cn(a),e)}function
s7(b,a){return b$(function(c){return eb(b,a)})}function
iZ(e,c,d){var
a=[0,e];return b$(function(e){return eb(c,function(e){var
c=b(d,a[1],e),f=c[2];bK(a,c[1]);return f})})}function
s8(a,c){return iZ(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
i0(a,e){function
b(g){function
c(c){co(a);return d(e,c)?[0,c]:b(0)}function
f(a){return iJ(a,c)}return i(cn(a),f)}return b(0)}function
s9(b,a){return b$(function(c){return i0(b,a)})}function
i1(e,c,d){var
a=[0,e];return b$(function(e){return i0(c,function(e){var
c=b(d,a[1],e),f=c[2];bK(a,c[1]);return f})})}function
s_(a,c){return i1(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
i2(a,e){function
b(g){function
c(f){co(a);var
c=d(e,f);return c?c:b(0)}function
f(a){return iJ(a,c)}return i(cn(a),f)}return b(0)}function
s$(b,a){return b$(function(c){return i2(b,a)})}function
i3(e,c,d){var
a=[0,e];return b$(function(e){return i2(c,function(e){var
c=b(d,a[1],e),f=c[2];bK(a,c[1]);return f})})}function
ta(a,c){return i3(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
tb(f,e){var
a=[0,0];return b$(function(g){for(;;){if(iI(a[1]))bK(a,eb(f,e));var
b=a[1];if(b){var
c=b[1],d=cn(c);if(d){co(c);return d}bK(a,0);continue}return 0}})}function
i4(d,h,g){var
c=[0,d],a=[0,0];return b$(function(i){for(;;){if(iI(a[1]))bK(a,eb(h,function(d){var
a=b(g,c[1],d),e=a[2];bK(c,a[1]);return e}));var
d=a[1];if(d){var
e=d[1],f=cn(e);if(f){co(e);return f}bK(a,0);continue}return 0}})}function
tc(a,c){return i4(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
td(e,c){var
a=0;for(;;){var
b=ce(e);if(b){var
a=[0,d(c,b[1]),a];continue}return ak(a)}}function
i5(h,g,f){var
c=h,a=0;for(;;){var
d=ce(g);if(d){var
e=b(f,c,d[1]),c=e[1],a=[0,e[2],a];continue}return ak(a)}}function
te(a,c){return i5(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
tf(f,e){var
a=0;for(;;){var
b=ce(f);if(b){var
c=b[1],g=d(e,c)?[0,c,a]:a,a=g;continue}return ak(a)}}function
i6(i,h,g){var
c=i,a=0;for(;;){var
d=ce(h);if(d){var
e=d[1],f=b(g,c,e),j=f[1],k=f[2]?[0,e,a]:a,c=j,a=k;continue}return ak(a)}}function
tg(a,c){return i6(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
th(f,e){var
a=0;for(;;){var
b=ce(f);if(b){var
c=d(e,b[1]),g=c?[0,c[1],a]:a,a=g;continue}return ak(a)}}function
i7(i,h,g){var
c=i,a=0;for(;;){var
d=ce(h);if(d){var
e=b(g,c,d[1]),f=e[2],j=e[1],k=f?[0,f[1],a]:a,c=j,a=k;continue}return ak(a)}}function
ti(a,c){return i7(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
tj(e,c){var
a=0;for(;;){var
b=ce(e);if(b){var
a=dz(d(c,b[1]),a);continue}return ak(a)}}function
i8(h,g,f){var
c=h,a=0;for(;;){var
d=ce(g);if(d){var
e=b(f,c,d[1]),i=e[1],c=i,a=dz(e[2],a);continue}return ak(a)}}function
tk(a,c){return i8(0,a,function(a,d){return[0,a+1|0,b(c,a,d)]})}function
tl(a){return 0}var
bo=aV[1],tm=aV[2];function
f4(f){if(0===f[0]){var
l=f[1],e=l[2],I=l[1];if(typeof
e==="number")var
g=tt;else
if(0===e[0]){var
a=e[1];switch(a[0]){case
0:var
k=a[1],m=k[2],n=k[1],c=b(r(tn),n,m);break;case
1:var
o=aG(a[1]),c=d(r(to),o);break;case
2:var
p=a[1],c=d(r(tp),p);break;case
3:var
q=a[2],s=a[1],t=c0(a[3],cc),u=aG(q),v=aG(s),c=h(r(tq),v,u,t);break;case
4:var
w=a[2],x=a[1],y=c0(a[3],cc),z=aG(w),c=h(r(tr),x,z,y);break;default:var
A=a[1],c=d(r(ts),A)}var
g=d(r(tu),c)}else
var
B=e[1],C=c0(e[2],cc),D=aG(B),g=b(r(tv),D,C);return b(r(tM),I,g)}var
i=f[1],j=i[3],J=i[2],K=i[1],E=j[3],F=j[2],G=j[1],H=h(r(tL),G,F,E),L=c2(J,f4);return h(r(tN),K,L,H)}var
dA=[J,tU,H(0)],tO=de;function
M(b,a){return[1,[0,b,a]]}function
C(b,a){return[0,[0,b,a]]}function
tV(a){return cY(a,M)}function
k(a){return cY(a,C)}var
ec=sT(rQ(nI,0),tW),i9=[J,tX,H(0)];function
f5(b,a){try{fL(a);var
c=bm(i9);return c}catch(a){a=a1(a);return a===i9?bm([0,dA,[1,b]]):de(a,b)?0:bm([0,dA,[3,b,a,iz(0)]])}}function
aA(e,g,c,a){var
f=1-b(g,c,a);if(f){var
h=d(e,a);return bm([0,dA,[0,[0,d(e,c),h]]])}return f}function
f6(c,b,a){return aA(c,v,b,a)}function
i_(b,a){return aA(cm,v,b,a)}function
Q(a){return i_(1,a)}function
R(a){return i_(0,a)}function
i$(b,a){return aA(cu,v,b,a)}function
f7(b,a){return aA(am,v,b,a)}function
f8(b,a){return aA(b_,v,b,a)}function
ja(d,c,b,a){function
e(a){return function(b){return d8(a,b,c)}}return aA(function(a){return c0(a,d)},e,b,a)}function
jb(d,c,b,a){function
e(a){return function(b){return fP(a,b,c)}}return aA(function(a){return c2(a,d)},e,b,a)}function
jc(b,a){return jb(cu,v,b,a)}function
aW(b,a){return jb(am,v,b,a)}function
f9(c,a){return[0,function(d){return b(c[1],d,a[1])}]}function
f_(c,b,a){return[0,function(d){return h(c[1],d,b[1],a[1])}]}function
f$(d,c,b,a){return[0,function(e){return B(d[1],e,c[1],b[1],a[1])}]}function
ga(e,d,c,b,a){return[0,function(f){return G(e[1],f,d[1],c[1],b[1],a[1])}]}function
gb(f,e,d,c,b,a){return[0,function(g){return N(f[1],g,e[1],d[1],c[1],b[1],a[1])}]}function
bp(e,a){function
c(a){var
c=a[2],f=a[1],h=[g,function(a){return i$(c,d(e[1],f))}];return b(k(tY),c,h)}function
f(a){return bn(a,c)}return[0,M(tZ,i(a[1],f))]}function
jd(b,a){var
c=[0,a[2]];return bp(f9(b,a[1]),c)}function
je(b,a){return[0,function(d,c){return h(b[1],d,c,a[1])}]}function
jf(c,b,a){return[0,function(e,d){return B(c[1],e,d,b[1],a[1])}]}function
jg(d,c,b,a){return[0,function(f,e){return G(d[1],f,e,c[1],b[1],a[1])}]}function
jh(e,d,c,b,a){return[0,function(g,f){return N(e[1],g,f,d[1],c[1],b[1],a[1])}]}function
ji(f,e,d,c,b,a){return[0,function(h,g){return V(f[1],h,g,e[1],d[1],c[1],b[1],a[1])}]}function
cv(a){function
c(d,c){return b(a[1],d,c)}return[0,c,function(d,c){return b(a[2],d,c)}]}function
jj(a){return[0,function(d,c){return 1-b(a[1],d,c)}]}function
jk(a){return[0,function(d,c,b){return 1-h(a[1],d,c,b)}]}function
t0(a){return[0,function(e,d,c,b){return 1-B(a[1],e,d,c,b)}]}function
t1(a){return[0,function(f,e,d,c,b){return 1-G(a[1],f,e,d,c,b)}]}function
t2(a){return[0,function(g,f,e,d,c,b){return 1-N(a[1],g,f,e,d,c,b)}]}function
t3(a){return[0,function(h,g,f,e,d,c,b){return 1-V(a[1],h,g,f,e,d,c,b)}]}function
b3(a,c){function
e(j){var
c=j[2],e=j[1],f=d(a[4],e),i=d(a[4],c),l=0,m=[g,function(d){return Q(b(a[3][2],c,e))}],n=[0,h(k(t4),i,f,m),l],o=[g,function(d){return R(b(a[3][1],c,e))}],p=[0,h(k(t5),i,f,o),n],q=[g,function(d){return Q(b(a[2],c,e))}],r=[0,h(k(t6),i,f,q),p],s=[g,function(d){return R(b(a[1],c,e))}],t=[0,h(k(t7),i,f,s),r],u=[g,function(d){return Q(b(a[3][2],e,c))}],v=[0,h(k(t8),f,i,u),t],w=[g,function(d){return R(b(a[3][1],e,c))}],x=[0,h(k(t9),f,i,w),v],y=[g,function(d){return Q(b(a[2],e,c))}],z=[0,h(k(t_),f,i,y),x],A=[g,function(d){return R(b(a[1],e,c))}];return[0,h(k(t$),f,i,A),z]}function
f(a){return aH(a,e)}var
j=i(c[2],f);function
l(c){function
e(j){var
c=j[2],e=j[1],f=d(a[4],e),i=d(a[4],c),l=0,m=[g,function(d){return R(b(a[3][2],c,e))}],n=[0,h(k(ua),i,f,m),l],o=[g,function(d){return Q(b(a[3][1],c,e))}],p=[0,h(k(ub),i,f,o),n],q=[g,function(d){return R(b(a[2],c,e))}],r=[0,h(k(uc),i,f,q),p],s=[g,function(d){return Q(b(a[1],c,e))}],t=[0,h(k(ud),i,f,s),r],u=[g,function(d){return R(b(a[3][2],e,c))}],v=[0,h(k(ue),f,i,u),t],w=[g,function(d){return Q(b(a[3][1],e,c))}],x=[0,h(k(uf),f,i,w),v],y=[g,function(d){return R(b(a[2],e,c))}],z=[0,h(k(ug),f,i,y),x],A=[g,function(d){return Q(b(a[1],e,c))}];return[0,h(k(uh),f,i,A),z]}function
f(a){return aH(a,e)}return i(fQ(c,c),f)}function
m(a){return aH(a,l)}return[0,M(ui,ax(i(c[1],m),j))]}function
jl(c,a){var
d=[0,a[1][1]],j=[0,a[2],a[3]],k=c[2],e=je([0,c[1]],d)[1],b=[0,e,function(b,a){return h(k,b,a,d[1])}],f=cv(b),g=b[1],i=b[2];return b3([0,g,i,f,f9([0,c[3]],[0,a[1][2]])[1]],j)}function
cw(a){function
c(d,c){return b(a[1],d,c)}function
d(d,c){return b(a[2],d,c)}function
e(d,c){return b(a[3],d,c)}return[0,c,d,e,function(d,c){return b(a[4],d,c)}]}function
uj(a){function
b(d,c,b){return 0===h(a[1],d,c,b)?1:0}function
c(d,c,b){return 2<=h(a[1],d,c,b)?0:1}function
d(d,c,b){return 2<=h(a[1],d,c,b)?1:0}return[0,b,c,d,function(d,c,b){return 0===h(a[1],d,c,b)?0:1}]}function
uk(a){function
b(e,d,c,b){return 0===B(a[1],e,d,c,b)?1:0}function
c(e,d,c,b){return 2<=B(a[1],e,d,c,b)?0:1}function
d(e,d,c,b){return 2<=B(a[1],e,d,c,b)?1:0}return[0,b,c,d,function(e,d,c,b){return 0===B(a[1],e,d,c,b)?0:1}]}function
ul(a){function
b(f,e,d,c,b){return 0===G(a[1],f,e,d,c,b)?1:0}function
c(f,e,d,c,b){return 2<=G(a[1],f,e,d,c,b)?0:1}function
d(f,e,d,c,b){return 2<=G(a[1],f,e,d,c,b)?1:0}return[0,b,c,d,function(f,e,d,c,b){return 0===G(a[1],f,e,d,c,b)?0:1}]}function
um(a){function
b(g,f,e,d,c,b){return 0===N(a[1],g,f,e,d,c,b)?1:0}function
c(g,f,e,d,c,b){return 2<=N(a[1],g,f,e,d,c,b)?0:1}function
d(g,f,e,d,c,b){return 2<=N(a[1],g,f,e,d,c,b)?1:0}return[0,b,c,d,function(g,f,e,d,c,b){return 0===N(a[1],g,f,e,d,c,b)?0:1}]}function
un(a){function
b(h,g,f,e,d,c,b){return 0===V(a[1],h,g,f,e,d,c,b)?1:0}function
c(h,g,f,e,d,c,b){return 2<=V(a[1],h,g,f,e,d,c,b)?0:1}function
d(h,g,f,e,d,c,b){return 2<=V(a[1],h,g,f,e,d,c,b)?1:0}return[0,b,c,d,function(h,g,f,e,d,c,b){return 0===V(a[1],h,g,f,e,d,c,b)?0:1}]}function
gc(a){function
c(c,f,e){var
d=b(a[1],f,c);return d?b(a[3],e,c):d}return[0,c,function(c,f,e){var
d=b(a[2],f,c);return d?b(a[4],e,c):d}]}function
uo(a){function
b(c,f,e,b){var
d=h(a[1],f,c,b);return d?h(a[3],e,c,b):d}return[0,b,function(c,f,e,b){var
d=h(a[2],f,c,b);return d?h(a[4],e,c,b):d}]}function
up(a){function
b(d,g,f,c,b){var
e=B(a[1],g,d,c,b);return e?B(a[3],f,d,c,b):e}return[0,b,function(d,g,f,c,b){var
e=B(a[2],g,d,c,b);return e?B(a[4],f,d,c,b):e}]}function
uq(a){function
b(e,h,g,d,c,b){var
f=G(a[1],h,e,d,c,b);return f?G(a[3],g,e,d,c,b):f}return[0,b,function(e,h,g,d,c,b){var
f=G(a[2],h,e,d,c,b);return f?G(a[4],g,e,d,c,b):f}]}function
ur(a){function
b(f,i,h,e,d,c,b){var
g=N(a[1],i,f,e,d,c,b);return g?N(a[3],h,f,e,d,c,b):g}return[0,b,function(f,i,h,e,d,c,b){var
g=N(a[2],i,f,e,d,c,b);return g?N(a[4],h,f,e,d,c,b):g}]}function
us(a){function
b(g,j,i,f,e,d,c,b){var
h=V(a[1],j,g,f,e,d,c,b);return h?V(a[3],i,g,f,e,d,c,b):h}return[0,b,function(g,j,i,f,e,d,c,b){var
h=V(a[2],j,g,f,e,d,c,b);return h?V(a[4],i,g,f,e,d,c,b):h}]}function
jm(a){function
c(d,c){return 0===b(a[1],d,c)?d:c}function
d(d,c){return 2<=b(a[1],d,c)?d:c}return[0,c,d,function(d,c){return 0===b(a[1],d,c)?[0,d,c]:[0,c,d]}]}function
ut(a){function
b(c,b,d){return 0===h(a[1],c,b,d)?c:b}function
c(c,b,d){return 2<=h(a[1],c,b,d)?c:b}return[0,b,c,function(c,b,d){return 0===h(a[1],c,b,d)?[0,c,b]:[0,b,c]}]}function
uu(a){function
b(c,b,e,d){return 0===B(a[1],c,b,e,d)?c:b}function
c(c,b,e,d){return 2<=B(a[1],c,b,e,d)?c:b}return[0,b,c,function(c,b,e,d){return 0===B(a[1],c,b,e,d)?[0,c,b]:[0,b,c]}]}function
uv(a){function
b(c,b,f,e,d){return 0===G(a[1],c,b,f,e,d)?c:b}function
c(c,b,f,e,d){return 2<=G(a[1],c,b,f,e,d)?c:b}return[0,b,c,function(c,b,f,e,d){return 0===G(a[1],c,b,f,e,d)?[0,c,b]:[0,b,c]}]}function
uw(a){function
b(c,b,g,f,e,d){return 0===N(a[1],c,b,g,f,e,d)?c:b}function
c(c,b,g,f,e,d){return 2<=N(a[1],c,b,g,f,e,d)?c:b}return[0,b,c,function(c,b,g,f,e,d){return 0===N(a[1],c,b,g,f,e,d)?[0,c,b]:[0,b,c]}]}function
ux(a){function
b(c,b,h,g,f,e,d){return 0===V(a[1],c,b,h,g,f,e,d)?c:b}function
c(c,b,h,g,f,e,d){return 2<=V(a[1],c,b,h,g,f,e,d)?c:b}return[0,b,c,function(c,b,h,g,f,e,d){return 0===V(a[1],c,b,h,g,f,e,d)?[0,c,b]:[0,b,c]}]}function
cf(a,c){var
e=a[13],f=a[13];function
m(a){return function(b){return ea(a,b,e,f)}}var
n=a[12],o=a[12];function
p(a){return c3(a,n,o)}function
l(a,b){return aA(p,m,a,b)}var
q=a[13],r=a[12];function
j(a,b){return aA(r,q,a,b)}function
s(c){function
e(m){var
c=m[2],e=m[1],f=d(a[12],e),i=d(a[12],c),n=0,o=[g,function(d){return l([0,c,c],b(a[10],c,e))}],p=[0,h(k(uy),i,f,o),n],q=[g,function(d){return l([0,e,e],b(a[10],c,e))}],r=[0,h(k(uz),i,f,q),p],s=[g,function(d){return l([0,c,e],b(a[10],c,e))}],t=[0,h(k(uA),i,f,s),r],u=[g,function(d){return l([0,e,c],b(a[10],c,e))}],v=[0,h(k(uB),i,f,u),t],w=[g,function(d){return j(c,b(a[9],c,e))}],x=[0,h(k(uC),i,f,w),v],y=[g,function(d){return j(e,b(a[9],c,e))}],z=[0,h(k(uD),i,f,y),x],A=[g,function(d){return j(c,b(a[8],c,e))}],B=[0,h(k(uE),i,f,A),z],C=[g,function(d){return j(e,b(a[8],c,e))}],D=[0,h(k(uF),i,f,C),B],E=[g,function(d){return R(b(a[11][3],c,e))}],F=[0,h(k(uG),i,f,E),D],G=[g,function(d){return Q(b(a[11][4],c,e))}],H=[0,h(k(uH),i,f,G),F],I=[g,function(d){return Q(b(a[11][2],c,e))}],J=[0,h(k(uI),i,f,I),H],K=[g,function(d){return R(b(a[11][1],c,e))}],L=[0,h(k(uJ),i,f,K),J],M=[g,function(d){return R(b(a[4],c,e))}],N=[0,h(k(uK),i,f,M),L],O=[g,function(d){return Q(b(a[5],c,e))}],P=[0,h(k(uL),i,f,O),N],S=[g,function(d){return Q(b(a[3],c,e))}],T=[0,h(k(uM),i,f,S),P],U=[g,function(d){return R(b(a[2],c,e))}],V=[0,h(k(uN),i,f,U),T],W=[g,function(d){return l([0,c,c],b(a[10],e,c))}],X=[0,h(k(uO),f,i,W),V],Y=[g,function(d){return l([0,e,e],b(a[10],e,c))}],Z=[0,h(k(uP),f,i,Y),X],_=[g,function(d){return l([0,c,e],b(a[10],e,c))}],$=[0,h(k(uQ),f,i,_),Z],aa=[g,function(d){return l([0,e,c],b(a[10],e,c))}],ab=[0,h(k(uR),f,i,aa),$],ac=[g,function(d){return j(c,b(a[9],e,c))}],ad=[0,h(k(uS),f,i,ac),ab],ae=[g,function(d){return j(e,b(a[9],e,c))}],af=[0,h(k(uT),f,i,ae),ad],ag=[g,function(d){return j(c,b(a[8],e,c))}],ah=[0,h(k(uU),f,i,ag),af],ai=[g,function(d){return j(e,b(a[8],e,c))}],aj=[0,h(k(uV),f,i,ai),ah],ak=[g,function(d){return R(b(a[11][3],e,c))}],al=[0,h(k(uW),f,i,ak),aj],am=[g,function(d){return Q(b(a[11][4],e,c))}],an=[0,h(k(uX),f,i,am),al],ao=[g,function(d){return Q(b(a[11][2],e,c))}],ap=[0,h(k(uY),f,i,ao),an],aq=[g,function(d){return R(b(a[11][1],e,c))}],ar=[0,h(k(uZ),f,i,aq),ap],as=[g,function(d){return R(b(a[4],e,c))}],at=[0,h(k(u0),f,i,as),ar],au=[g,function(d){return Q(b(a[5],e,c))}],av=[0,h(k(u1),f,i,au),at],aw=[g,function(d){return Q(b(a[3],e,c))}],ax=[0,h(k(u2),f,i,aw),av],ay=[g,function(d){return R(b(a[2],e,c))}];return[0,h(k(u3),f,i,ay),ax]}function
f(a){return aH(a,e)}return i(fQ(c,c),f)}function
t(a){return aH(a,s)}var
u=i(c[2],t);function
v(c){function
n(m,c){var
e=m[1],n=m[2],f=d(a[12],e),i=d(a[12],c),o=0,p=[g,function(d){return l([0,e,c],b(a[10],c,e))}],q=[0,h(k(u4),i,f,p),o],r=[g,function(d){return j(c,b(a[9],c,e))}],s=[0,h(k(u5),i,f,r),q],t=[g,function(d){return j(e,b(a[8],c,e))}],u=[0,h(k(u6),i,f,t),s],v=[g,function(d){return Q(b(a[11][3],c,e))}],w=[0,h(k(u7),i,f,v),u],x=[g,function(d){return Q(b(a[11][4],c,e))}],y=[0,h(k(u8),i,f,x),w],z=[g,function(d){return R(b(a[11][2],c,e))}],A=[0,h(k(u9),i,f,z),y],B=[g,function(d){return R(b(a[11][1],c,e))}],C=[0,h(k(u_),i,f,B),A],D=[g,function(d){return Q(b(a[4],c,e))}],E=[0,h(k(u$),i,f,D),C],F=[g,function(d){return Q(b(a[5],c,e))}],G=[0,h(k(va),i,f,F),E],H=[g,function(d){return R(b(a[3],c,e))}],I=[0,h(k(vb),i,f,H),G],J=[g,function(d){return R(b(a[2],c,e))}],K=[0,h(k(vc),i,f,J),I],L=[g,function(d){return l([0,e,c],b(a[10],e,c))}],M=[0,h(k(vd),f,i,L),K],N=[g,function(d){return j(c,b(a[9],e,c))}],O=[0,h(k(ve),f,i,N),M],P=[g,function(d){return j(e,b(a[8],e,c))}],S=[0,h(k(vf),f,i,P),O],T=[g,function(d){return R(b(a[11][3],e,c))}],U=[0,h(k(vg),f,i,T),S],V=[g,function(d){return R(b(a[11][4],e,c))}],W=[0,h(k(vh),f,i,V),U],X=[g,function(d){return Q(b(a[11][2],e,c))}],Y=[0,h(k(vi),f,i,X),W],Z=[g,function(d){return Q(b(a[11][1],e,c))}],_=[0,h(k(vj),f,i,Z),Y],$=[g,function(d){return R(b(a[4],e,c))}],aa=[0,h(k(vk),f,i,$),_],ab=[g,function(d){return R(b(a[5],e,c))}],ac=[0,h(k(vl),f,i,ab),aa],ad=[g,function(d){return Q(b(a[3],e,c))}],ae=[0,h(k(vm),f,i,ad),ac],af=[g,function(d){return Q(b(a[2],e,c))}];return[0,c,ax([0,h(k(vn),f,i,af),ae],n)]}var
e=iG(sd),f=c?[0,c[2]]:0,m=i(f,e);return i(c1([0,iK(c),0],m,n),iY)}function
w(a){return aH(a,v)}return[0,M(vo,ax(i(c[1],w),u))]}function
ed(e,a){function
c(a){var
c=a[2],f=a[1],h=[g,function(a){return i$(c,d(e[1],f))}];return b(k(vp),c,h)}function
f(a){return bn(a,c)}return[0,M(vq,i(a[1],f))]}function
cg(a,c){function
e(e){var
f=e[2],c=e[1],h=0,i=[g,function(e){var
b=d(a[1],c);return ja(a[4],a[3],[0,f],b)}],j=[0,b(k(vr),c,i),h],l=[g,function(e){var
b=d(a[2],c);return aA(a[4],a[3],f,b)}];return[0,b(k(vs),c,l),j]}function
f(a){return aH(a,e)}return[0,M(vt,i(c[1],f))]}function
jn(a){function
c(a){return a}function
e(b){return d(a[1],b)}function
f(d,c){return b(a[2],d,c)}function
g(d,c){return b(a[3],d,c)}function
h(d,c){return b(a[4],d,c)}function
i(d,c){return b(a[5],d,c)}return[0,c,e,f,g,h,i,function(d,c){return b(a[6],d,c)}]}function
gd(c){return[0,function(e,a){function
g(k,j,i){var
f=k,e=j,a=i;for(;;){if(bl(a,0)){var
l=c[1],m=function(a,b){return g(l,a,b)};return h(c[4],m,e,a)}if(b(dx,a,0))return f;if(b(dx,a,1))return b(c[3],e,f);if(b(dx,a%2|0,0)){var
e=d(c[2],e),a=a/2|0;continue}var
n=d(c[2],e),f=b(c[3],e,f),e=n,a=(a-1|0)/2|0;continue}}return g(c[1],e,a)}]}function
jo(a){return[0,[0,function(e,c,a){var
f=0,h=[0,C(v2,[g,function(k){var
f=a[2],g=d(c[12],42);function
h(c,b){var
d=aL(c,b+1|0),e=a[1];function
f(a){return c+aL(b,a+1|0)|0}function
g(a){return fT(a,f)}return[0,d,i(i(L(0,0,b),g),e)]}function
j(a){return b(g,a,h)}return aW(v1,i(i(i(v0,e[1]),j),f))}]),f],j=[0,C(v5,[g,function(j){var
d=a[2],f=c[11];function
g(c,b){var
d=a[1];function
e(a){return aL(b+c|0,a+1|0)}function
f(a){return fT(a,e)}return i(i(L(0,0,b),f),d)}function
h(a){return b(f,a,g)}return aW(v4,i(i(i(v3,e[1]),h),d))}]),h],k=[0,C(v8,[g,function(j){var
d=a[2],f=c[10];function
g(b){var
c=a[1];function
d(a){return aL(b,a+1|0)}function
e(a){return fT(a,d)}return i(i(L(0,0,b),e),c)}function
h(a){return b(f,a,g)}return aW(v7,i(i(i(v6,e[1]),h),d))}]),j],l=[0,C(v$,[g,function(k){var
f=a[2],g=d(c[9],42);function
h(c,a){var
d=b(bo,c%2|0,0),e=a+1|0,f=d?b(bo,a%3|0,0):d;return[0,c+a|0,dy(f,e)]}function
j(a){return b(g,a,h)}return aW(v_,i(i(i(v9,e[1]),j),f))}]),k],m=[0,C(wc,[g,function(j){var
d=a[2],f=c[8];function
g(d,a){var
c=b(bo,d%2|0,0),e=a+1|0,f=c?b(bo,a%3|0,0):c;return dy(f,e)}function
h(a){return b(f,a,g)}return aW(wb,i(i(i(wa,e[1]),h),d))}]),l],n=[0,C(wf,[g,function(j){var
d=a[2],f=c[7];function
g(a){return dy(b(bo,a%3|0,0),a+1|0)}function
h(a){return b(f,a,g)}return aW(we,i(i(i(wd,e[1]),h),d))}]),m],o=[0,C(wi,[g,function(k){var
f=a[2],g=d(c[6],42);function
h(c,a){var
d=b(bo,c%2|0,0),e=d?b(bo,a%3|0,0):d;return[0,c+a|0,e]}function
j(a){return b(g,a,h)}return aW(wh,i(i(i(wg,e[1]),j),f))}]),n],p=[0,C(wl,[g,function(j){var
d=a[2],f=c[5];function
g(d,c){var
a=b(bo,d%2|0,0);return a?b(bo,c%3|0,0):a}function
h(a){return b(f,a,g)}return aW(wk,i(i(i(wj,e[1]),h),d))}]),o],q=[0,C(wo,[g,function(j){var
d=a[2],f=c[4];function
g(a){return b(bo,a%3|0,0)}function
h(a){return b(f,a,g)}return aW(wn,i(i(i(wm,e[1]),h),d))}]),p],r=[0,C(wr,[g,function(k){var
f=a[2],g=d(c[3],42);function
h(b,a){return[0,aL(b,a),a+b|0]}function
j(a){return b(g,a,h)}return aW(wq,i(i(i(wp,e[1]),j),f))}]),q],s=[0,C(wu,[g,function(j){var
d=a[2],f=c[2];function
g(b,a){return b+a|0}function
h(a){return b(f,a,g)}return aW(wt,i(i(i(ws,e[1]),h),d))}]),r];return[0,M(wy,[0,C(wx,[g,function(j){var
d=a[2],f=c[1];function
g(a){return 1+a|0}function
h(a){return b(f,a,g)}return aW(ww,i(i(i(wv,e[1]),h),d))}]),s])]}]]}var
wz=jo([0]);function
jp(a){var
b=jo([0]),c=[0,a[14],a[13]],e=[0,a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12]];return[0,d(d(d(b[1][1],[0,a[14]]),e),c)[1]]}function
jq(b,a){var
c=[0,bp([0,b[4]],[0,a[3]])[1],0];return[0,M(wA,[0,b3(b,[0,a[1],a[2]])[1],c])]}function
jr(a,b){var
c=a[1],e=[0,cf([0,a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],[0,c[3],c[4],c[5],c[6]],a[4],a[2]],[0,b[3],b[4]])[1],0],d=a[1];return[0,M(wG,[0,jq([0,a[2],a[3],[0,d[1],d[2]],a[4]],[0,b[4],b[1],b[2]])[1],e])]}function
js(a,l){var
w=l[6],x=l[11],ad=l[1],ae=l[2],af=l[3],ag=l[4],ah=l[5],ai=l[7],aj=l[8],ak=l[9],al=ax(l[10],[0,[0,a[8],[0,a[9],0]],0]),am=a[3],an=a[7];function
y(a,b){return aA(an,am,a,b)}var
ao=0,ap=[0,C(wP,[g,function(b){return f8(1,d(a[32],a[9]))}]),ao],aq=[0,C(wQ,[g,function(b){return f7(1,d(a[31],a[9]))}]),ap],ar=[0,C(wR,[g,function(b){return f8(0,d(a[32],a[8]))}]),aq],as=[0,C(wS,[g,function(b){return f7(0,d(a[31],a[8]))}]),ar];function
at(f){var
c=f[2],e=f[1],h=b(a[23],e,a[8])?e:c,i=b(a[23],c,a[8])?c:e,j=0,l=[g,function(b){return y(i,d(a[29],c))}],m=d(a[7],c),n=[0,b(k(wT),m,l),j],o=[g,function(b){return y(h,d(a[29],e))}],p=d(a[7],e);return[0,b(k(wU),p,o),n]}var
au=ax(i(w,function(a){return aH(a,at)}),as),n=a[1],av=[0,cf([0,a[19],a[20],a[21],a[22],a[23],a[24],a[25],a[26],a[27],a[28],[0,n[10],n[11],n[12],n[13]],a[7],a[3]],[0,al,x])[1],0],z=a[18],A=a[17],B=a[15],t=a[13],o=a[12],p=a[11],q=a[10],f=a[9],e=a[8],j=a[7],u=a[6],v=a[3],m=a[1],r=m[6],s=m[5],D=m[4],aw=a[16],ay=a[14],az=a[5],aB=a[4],aC=a[2],aD=m[9],aE=m[8],aF=m[7],aG=m[2],aI=m[1],T=[0,d(u,wM),0],U=[0,d(z,1),T],V=[0,[0,f,[0,d(A,1),U]],0],W=[0,d(u,wN),0],X=[0,d(z,0),W],Y=ax(x,[0,[0,e,[0,d(A,0),X]],V]),Z=ax(ae,[0,[0,e,f],0]),E=ax(ah,[0,[0,e,e,e],[0,[0,f,e,f],0]]),F=ax(w,[0,[0,e,e],0]),G=ax(ai,[0,[0,e,e,e],[0,[0,f,e,e],0]]),H=ax(aj,[0,[0,e,f,e],[0,[0,f,f,f],0]]),_=0,I=ax(ak,[0,[0,e,0,f],[0,[0,e,1,e],[0,[0,e,7,e],[0,[0,f,0,f],[0,[0,f,1,f],[0,[0,f,7,f],0]]]]]]);function
c(a,b){return aA(j,v,a,b)}function
J(e){var
i=e[3],a=e[2],f=e[1],l=d(j,f),m=0,n=[g,function(d){return c(i,b(aD,f,a))}],o=[0,h(k(vx),l,a,n),m],p=[g,function(d){return c(i,b(aw,f,a))}];return[0,h(k(vy),l,a,p),o]}var
K=i(I,function(a){return aH(a,J)});function
L(a){var
i=a[3],e=a[2],f=a[1],l=d(j,f),m=d(j,e),n=0,o=[g,function(a){return c(i,b(aE,f,e))}],p=[0,h(k(vz),l,m,o),n],q=[g,function(a){return c(i,b(ay,f,e))}];return[0,h(k(vA),l,m,q),p]}var
N=ax(i(H,function(a){return aH(a,L)}),K);function
O(a){var
i=a[3],e=a[2],f=a[1],l=d(j,f),m=d(j,e),n=0,o=[g,function(a){return c(i,b(aF,f,e))}],p=[0,h(k(vB),l,m,o),n],q=[g,function(a){return c(i,b(t,f,e))}];return[0,h(k(vC),l,m,q),p]}var
P=ax(i(G,function(a){return aH(a,O)}),N);function
Q(m){var
a=m[2],f=m[1],i=d(j,f),l=d(j,a),n=0,u=[g,function(g){var
e=d(B,a);return c(d(q,b(t,f,a)),e)}],v=[0,b(k(vD),l,u),n],w=[g,function(g){var
e=d(B,f);return c(d(q,b(t,f,a)),e)}],x=[0,b(k(vE),i,w),v],y=[g,function(d){return c(e,b(s,a,f))}],z=[0,h(k(vF),l,i,y),x],A=[g,function(d){return c(e,b(s,f,a))}],C=[0,h(k(vG),i,l,A),z],E=[g,function(d){return c(e,b(p,a,f))}],F=[0,h(k(vH),l,i,E),C],G=[g,function(d){return c(e,b(p,f,a))}],H=[0,h(k(vI),i,l,G),F],I=[g,function(d){return c(f,b(r,e,a))}],J=[0,b(k(vJ),l,I),H],K=[g,function(d){return c(a,b(r,e,f))}],L=[0,b(k(vK),i,K),J],M=[g,function(d){return c(f,b(o,e,a))}],N=[0,b(k(vL),l,M),L],O=[g,function(d){return c(a,b(o,e,f))}],P=[0,b(k(vM),i,O),N],Q=[g,function(b){return c(f,d(D,a))}],R=[0,b(k(vN),l,Q),P],S=[g,function(b){return c(a,d(D,f))}],T=[0,b(k(vO),i,S),R],U=[g,function(b){return c(f,d(q,a))}],V=[0,b(k(vP),l,U),T],W=[g,function(b){return c(a,d(q,f))}];return[0,b(k(vQ),i,W),V]}var
R=ax(i(F,function(a){return aH(a,Q)}),P);function
S(n){var
a=n[3],e=n[2],f=n[1],i=d(j,f),l=d(j,e),m=d(j,a),q=0,t=[g,function(d){return c(e,b(r,a,f))}],u=[0,h(k(vR),m,i,t),q],v=[g,function(d){return c(e,b(o,a,f))}],w=[0,h(k(vS),m,i,v),u],x=[g,function(d){return c(f,b(r,a,e))}],y=[0,h(k(vT),m,l,x),w],z=[g,function(d){return c(f,b(o,a,e))}],A=[0,h(k(vU),m,l,z),y],B=[g,function(d){return c(a,b(s,e,f))}],C=[0,h(k(vV),l,i,B),A],D=[g,function(d){return c(a,b(s,f,e))}],E=[0,h(k(vW),i,l,D),C],F=[g,function(d){return c(a,b(p,e,f))}],G=[0,h(k(vX),l,i,F),E],H=[g,function(d){return c(a,b(p,f,e))}];return[0,h(k(vY),i,l,H),G]}var
$=[0,M(vZ,ax(i(E,function(a){return aH(a,S)}),R)),_],aa=[0,bp([0,j],[0,ag])[1],$],ab=[0,cg([0,az,u,v,j],[0,af])[1],aa],ac=[0,b3([0,v,aB,[0,aI,aG],j],[0,Y,Z])[1],ab];return[0,M(wV,ax([0,M(wO,[0,ed([0,aC],[0,ad])[1],ac]),av],au))]}function
dB(a,c){var
j=c[1],l=c[2],m=c[3],n=c[4],o=c[5],p=c[6],q=c[7],r=c[8],s=c[9],t=c[10],u=c[11],v=ax(c[12],[0,[0,a[8],a[9]],0]),e=a[7],h=a[3],w=0,x=a[34],y=a[33];function
f(f){var
a=f[2],c=f[1],i=d(e,c),j=d(e,a),l=0,m=[g,function(b){return aA(e,h,c,d(x,a))}],n=[0,b(k(vu),j,m),l],o=[g,function(b){return aA(e,h,a,d(y,c))}];return[0,b(k(vv),i,o),n]}var
z=[0,M(vw,i(v,function(a){return aH(a,f)})),w];return[0,M(wW,[0,js([0,a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17],a[18],a[19],a[20],a[21],a[22],a[23],a[24],a[25],a[26],a[27],a[28],a[29],a[30],a[31],a[32]],[0,j,l,m,n,o,p,q,r,s,t,u])[1],z])]}function
aQ(b,a){return br(b,a)[a+1]}function
ge(c,a,b){return br(c,a)[a+1]=b}H(0);var
jt=[0,[0,fI,w4],0],wY=[0,[0,[0,bW,wX],0],0],w3=[0,[0,[0,bW,w2],[0,bW,w1]],[0,[0,[0,bW,w0],[0,dk,wZ]],0]],w5=[0,jt],w6=[0,aG];(function(a){return ed(w6,a)}(w5));var
w7=[0,wY,w3,jt],w8=[0,v,ct,aV,aG];(function(a){return jq(w8,a)}(w7));function
gf(a){var
p=a[4],q=a[20],C=a[3],D=a[14],E=a[15],F=a[18],G=a[19],H=a[16],I=a[17];function
J(a){return dw([g,function(b){return d(q,a)}])}var
s=a[21];function
K(c){var
e=a[2],f=d(s,c);return b(r(w9),f,e)}var
t=a[5],u=a[6],v=a[7],f=a[8],w=a[9],x=a[10],L=a[13],M=a[11],N=a[12],O=a[22];function
e(a,b){return fK(O,a,b)}var
m=a[23];function
i(b,a){return 0===e(b,a)?1:0}function
j(b,a){return 2<=e(b,a)?0:1}function
k(b,a){return 2<=e(b,a)?1:0}function
l(b,a){return 0===e(b,a)?0:1}var
n=jm([0,e]),P=n[1],Q=n[2],R=n[3],y=jj([0,m])[1];function
o(a){return b(f,a,a)}var
z=gd([0,p,o,f,function(f,e,c){var
d=a[1];return b(fM(w_),d,c)}])[1],A=gc([0,i,j,k,l]),S=A[1],T=A[2],h=cw([0,i,j,k,l]),U=h[1],V=h[2],W=h[3],X=h[4],B=cv([0,m,y]),Y=B[1],Z=B[2],c=jn([0,t,u,v,f,w,z]);return[0,[0,Y,Z,c[1],c[2],c[3],c[4],c[5],c[6],c[7],U,V,W,X,x],s,m,y,J,q,K,C,p,t,u,v,f,w,o,z,H,F,e,i,j,k,l,S,T,P,Q,R,L,x,I,G,M,N,E,D]}var
xb=fb;function
xc(a){return a}function
xd(a){return a|0}function
xe(a){return a}function
xf(a){return a}var
xg=b9,xh=dR;function
xi(b,a){return aL(b,a)}function
xj(b,a){return b-a|0}function
xk(b,a){return b+a|0}var
t=gf([0,w$,xa,nK,nL,function(a){return-a|0},xk,xj,xi,xh,xg,nM,nN,nO,nQ,nP,xf,xe,xd,xc,xb,nR,nT,nU]),xw=[0,ju],xx=[0,t[5],t[6],t[3],t[7]];(function(a){return cg(xx,a)}(xw));var
xy=[0,xm,xo,ju,xl,xq,xr,xs,xt,xu,xp,xn,xv],xz=[0,t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15],t[16],t[17],t[18],t[19],t[20],t[21],t[22],t[23],t[24],t[25],t[26],t[27],t[28],t[29],t[30],t[31],t[32],t[33],t[34]];(function(a){return dB(xz,a)}(xy));var
s=gf([0,xA,xB,nV,nW,bt,g9,hb,mP,Qt,Qw,nX,nZ,n1,n3,hJ,cl,e$,Qx,hc,Qy,n4,n6,n7]),xC=s[18],xO=[0,jv],xP=[0,s[5],s[6],s[3],s[7]];(function(a){return cg(xP,a)}(xO));var
xQ=[0,xE,xG,jv,xD,xI,xJ,xK,xL,xM,xH,xF,xN],xR=[0,s[1],s[2],s[3],s[4],s[5],s[6],s[7],s[8],s[9],s[10],s[11],s[12],s[13],s[14],s[15],s[16],s[17],s[18],s[19],s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[30],s[31],s[32],s[33],s[34]];(function(a){return dB(xR,a)}(xQ));var
jw=gd([0,iQ,iU,iT,function(d,c,a){return b(d,1/c,-a|0)}])[1],jx=gc([0,cU,cV,cX,cW]),xS=jx[1],xT=jx[2],xX=[0,xW,[0,xV,[0,xU,[0,[0,hr,0],[0,[0,hs,0],0]]]]],x0=[0,xZ,[0,xY,[0,[0,cP,hr],[0,[0,cP,hs],[0,[0,cP,1],[0,[0,cP,0],[0,[0,cP,cP],0]]]]]]],x_=[0,x7],x$=[0,fR];(function(a){return bp(x$,a)}(x_));var
ya=[0,jA,x8],yb=[0,v,ct,[0,sO,sP],fR];(function(a){return b3(yb,a)}(ya));var
yc=[0,x9,jA],yd=[0,z,cU,cV,cX,cW,d6,d7,bw,bI,dr,[0,ds,dt,dv,du],fR,v];(function(a){return cf(yd,a)}(yc));function
cx(a,c){var
d=[g,function(b){return f8(c,Math.ceil(a))}];return b(k(ye),a,d)}cx(1,1);cx(0.99,1);cx(0.01,1);cx(0,0);cx(-0.1,0);cx(-0.99,0);cx(-1,-1);var
yf=[0,jz],yg=[0,iS,iR,v,b_];(function(a){return cg(yg,a)}(yf));var
yh=[0,jy,x0,jz,jy,x2,x3,x4,x5,x6,x1,xX],yi=[0,[0,sA,sB,sD,sC,sE,sF,sG,sH,jw,ds,dt,dv,du,sI],b_,v,ct,iS,iR,b_,sr,iQ,sw,su,sv,iT,sx,iU,jw,ss,b2,z,cU,cV,cX,cW,xS,xT,bw,bI,dr,sy,sz,st,b2];(function(a){return js(yi,a)}(yh));function
jB(a){function
b(a){return i(i(a,xC),rs)}var
c=Qp(a),d=c[2],e=c[1];return cL(d,58)?b(a):ix(b(mS(e,58)),d-58|0)}function
jC(a){return dw([g,function(b){return cs(a)}])}function
jD(f,b){if(bl(b,0))return d(fM(yj),b);var
j=ih(b);if(-1===j)return ah(rH);if(0===j)return fC;var
g=aj(f),c=aL(g,b),a=az(c),h=az(c),k=ig(bX(b))-2|0;aK(a,0,f[2],0,g);if(!(k<0)){var
i=k;for(;;){var
l=bV(a,0,c),e=bw(c,2*l|0);dj(h,0,e);m7(h,0,e,a,0,l);if(0<(b&1<<i)){var
m=bw(c,e+g|0);dj(a,0,m);fj(a,0,m,h,0,e,f[2],0,g)}else
aK(a,0,h,0,e);var
o=i-1|0;if(0!==i){var
i=o;continue}break}}var
n=0<=f[1]?f[1]:0===(b&1)?1:-1;return[0,n,a]}function
jE(a,b){return fK(cT,a,b)}var
jF=gc([0,fG,fE,fH,fF]),yk=jF[1],yl=jF[2],gg=jm([0,jE]),ym=gg[1],yn=gg[2],yo=gg[3],jG=jj([0,cr])[1],ee=cw([0,fG,fE,fH,fF]),yp=ee[1],yq=ee[2],yr=ee[3],ys=ee[4],jH=cv([0,cr,jG]),yt=jH[1],yu=jH[2],cy=jn([0,fD,d3,d4,is,iu,jD]),yv=cy[1],yw=cy[2],yx=cy[3],yy=cy[4],yz=cy[5],yA=cy[6],yB=cy[7],yC=y(-5),yD=[0,[0,y(-6),yC],0],yE=y(5),yF=[0,[0,y(4),yE],yD],yG=[0,[0,y(c8),0],0],yH=[0,[0,y(4),0],yG],yI=[0,b1,[0,fC,[0,y(5),0]]],yJ=[0,y(-1),yI],yK=[0,[0,y(-3),yJ],0],yM=cs(yL),yN=[0,[0,y(10),40,yM],0],yP=cs(yO),yQ=[0,[0,y(10),10,yP],yN],yR=y(5),yS=y(9),yT=[0,[0,y(45),yS,yR],0],yU=y(21),yV=y(3),yW=[0,[0,y(7),yV,yU],0],yX=y(12),yY=[0,[0,y(ck),yX],0],yZ=y(dM),y0=y(27),y1=[0,[0,y(eV),y0,yZ],0],y4=[0,[0,cs(y3),y2],0],jI=[0,[0,y(10),y5],y4],y6=y(11),y7=[0,[0,y(10),y6],0],jJ=[0,[0,y8,y(1e5)],0];function
jK(b,a){var
c=jB(a);return aA(d5,cr,cs(b),c)}function
c(a,c){var
d=[g,function(b){return jK(c,Math.pow(2,a))}];return b(k(y9),a,d)}function
a3(b,a,c){var
d=[g,function(d){return jK(c,Math.pow(2,b)-Math.pow(2,a))}];return h(k(y_),b,a,d)}c(bD,y$);c(222,za);c(221,zb);c(220,zc);c(219,zd);c(218,ze);c(217,zf);c(216,zg);c(215,zh);c(214,zi);c(213,zj);c(212,zk);c(211,zl);c(210,zm);c(209,zn);c(208,zo);c(207,zp);c(206,zq);c(205,zr);c(204,zs);c(203,zt);c(202,zu);c(201,zv);c(200,zw);c(199,zx);c(198,zy);c(197,zz);c(196,zA);c(195,zB);c(194,zC);c(193,zD);c(ll,zE);c(191,zF);c(190,zG);c(189,zH);c(188,zI);c(187,zJ);c(186,zK);c(185,zL);c(184,zM);c(183,zN);c(182,zO);c(181,zP);c(180,zQ);c(179,zR);c(178,zS);c(177,zT);c(176,zU);c(175,zV);c(174,zW);c(173,zX);c(172,zY);c(171,zZ);c(170,z0);c(169,z1);c(168,z2);c(167,z3);c(166,z4);c(165,z5);c(164,z6);c(163,z7);c(162,z8);c(161,z9);c(160,z_);c(159,z$);c(158,Aa);c(157,Ab);c(156,Ac);c(155,Ad);c(154,Ae);c(153,Af);c(152,Ag);c(151,Ah);c(150,Ai);c(149,Aj);c(148,Ak);c(147,Al);c(146,Am);c(145,An);c(144,Ao);c(143,Ap);c(142,Aq);c(141,Ar);c(140,As);c(139,At);c(138,Au);c(137,Av);c(136,Aw);c(135,Ax);c(134,Ay);c(133,Az);c(132,AA);c(131,AB);c(130,AC);c(129,AD);c(al,AE);c(dM,AF);c(126,AG);c(ch,AH);c(124,AI);c(123,AJ);c(gZ,AK);c(121,AL);c(dN,AM);c(119,AN);c(118,AO);c(117,AP);c(lV,AQ);c(115,AR);c(lB,AS);c(113,AT);c(112,AU);c(kW,AV);c(lb,AW);c(109,AX);c(108,AY);c(107,AZ);c(106,A0);c(105,A1);c(lk,A2);c(mB,A3);c(gL,A4);c(lK,A5);c(eV,A6);c(99,A7);c(98,A8);c(97,A9);c(96,A_);c(95,A$);c(94,Ba);c(93,Bb);c(92,Bc);c(91,Bd);c(90,Be);c(89,Bf);c(88,Bg);c(87,Bh);c(86,Bi);c(85,Bj);c(84,Bk);c(83,Bl);c(82,Bm);c(81,Bn);c(80,Bo);c(79,Bp);c(78,Bq);c(77,Br);c(76,Bs);c(75,Bt);c(74,Bu);c(73,Bv);c(72,Bw);c(71,Bx);c(70,By);c(69,Bz);c(68,BA);c(67,BB);c(66,BC);c(65,BD);c(64,BE);c(63,BF);c(62,BG);c(61,BH);c(60,BI);c(59,BJ);c(58,BK);c(57,BL);c(56,BM);c(55,BN);c(54,BO);c(53,BP);c(52,BQ);c(51,BR);c(50,BS);c(49,BT);c(48,BU);c(47,BV);c(46,BW);c(45,BX);c(44,BY);c(43,BZ);c(42,B0);c(41,B1);c(40,B2);c(39,B3);c(38,B4);c(37,B5);c(36,B6);c(35,B7);c(34,B8);c(33,B9);c(32,B_);c(31,B$);c(30,Ca);c(29,Cb);c(28,Cc);c(27,Cd);c(26,Ce);c(25,Cf);c(24,Cg);c(23,Ch);c(22,Ci);c(21,Cj);c(20,Ck);c(19,Cl);c(18,Cm);c(17,Cn);c(16,Co);c(15,Cp);c(14,Cq);c(13,Cr);c(12,Cs);c(11,Ct);c(10,Cu);c(9,Cv);c(8,Cw);c(7,Cx);c(6,Cy);c(5,Cz);c(4,CA);c(3,CB);c(2,CC);c(1,CD);a3(95,42,CE);a3(57,4,CF);a3(56,3,CG);a3(55,2,CH);a3(54,1,CI);a3(53,0,CJ);a3(52,0,CK);a3(51,0,CL);a3(50,0,CM);a3(3,0,CN);a3(2,0,CO);a3(1,0,CP);a3(0,0,CQ);var
CR=[0,jJ],CS=[0,jC,cs,cr,d5];(function(a){return cg(CS,a)}(CR));var
CT=[0,jI,y7,jJ,jI,y1,yY,yW,yT,yQ,yK,yH,yF],CU=[0,[0,yt,yu,yv,yw,yx,yy,yz,yA,yB,yp,yq,yr,ys,iv],d5,cr,jG,jC,cs,d5,b1,fC,fD,d3,d4,is,iu,rI,jD,y,jB,jE,fG,fE,fH,fF,yk,yl,ym,yn,yo,rm,iv,rq,rP,ro,rn];(function(a){return dB(CU,a)}(CT));var
CZ=[0,CV],C0=[0,r8,ht,v,cm];(function(a){return cg(C0,a)}(CZ));var
C1=[0,jL],C2=[0,cm];(function(a){return ed(C2,a)}(C1));var
C3=[0,CX,jL,CY,CW],C4=[0,[0,cZ,r9,ds,dt,dv,du],v,ct,cm,z,cU,cV,cX,cW,d6,d7,bw,bI,dr];(function(a){return jr(C4,a)}(C3));var
jM=gd([0,iA,iE,iD,function(c,b,a){return d(fM(C5),a)}])[1],Dd=[0,jO],De=[0,iC,iB,v,am];(function(a){return cg(De,a)}(Dd));var
Df=[0,jN,C7,jO,jN,C9,C_,C$,Da,Db,C8,C6,Dc],Dg=[0,[0,dx,iF,r2,r1,r3,r4,r5,r6,jM,ds,dt,dv,du,r7],am,v,ct,iC,iB,am,rR,iA,rW,rU,rV,iD,rX,iE,jM,b2,rS,z,cU,cV,cX,cW,d6,d7,bw,bI,dr,bX,rY,b2,rT,r0,rZ];(function(a){return dB(Dg,a)}(Df));var
Dh=jk([0,fP])[1];jp([0,bn,se,iL,sg,sh,iN,d_,si,iO,aH,sf,iM,b2,b2]);var
Dm=[0,[0,v,am],[0,[0,sb,Dk],Dj],Dl],Dn=[0,fP,Dh,c2];(function(a){return jl(Dn,a)}(Dm));var
Do=[0,[0,am],Di],Dp=[0,c2];(function(a){return jd(Dp,a)}(Do));function
jP(a){return 0===a?[0,[0,iP(0,0)],0]:[0,0,jP(a-1|0)]}function
Dq(a){return d_(a,b2)}var
jQ=i(i(jP(2),Dq),iK),Dr=0,Dt=ec?Ds:P7,jR=[0,[0,jQ,Dt],Dr],Dv=[0,Du];sq(jQ);var
Dw=[0,so];(function(a){return bp(Dw,a)}(Dv));var
Dx=[0,jR],Dy=[0,cc];(function(a){return bp(Dy,a)}(Dx));var
Dz=[0,jR],DA=[0,cc];(function(a){return ed(DA,a)}(Dz));function
DB(a){return a}var
DF=[0,[0,L(DE,DD,25),DC],0],DI=[0,[0,L(0,DH,-15),DG],DF],DK=[0,[0,L(0,0,5),DJ],DI],DM=[0,[0,L(0,0,-5),DL],DK],DO=[0,[0,L(0,0,0),DN],DM],DR=[0,L(DQ,DP,11),0],DU=[0,L(DT,DS,10),DR],DX=[0,[0,L(DW,DV,9),DU],0],D0=[0,L(DZ,DY,10),0],D1=[0,[0,L(0,0,10),D0],DX],D3=[0,L(D2,0,3),[0,sU,0]],D5=[0,L(0,D4,10),D3],D7=[0,L(0,D6,10),D5],D8=[0,L(0,0,-4),D7],D_=[0,L(0,D9,0),D8],D$=[0,[0,L(0,0,0),D_],D1],Ec=L(Eb,Ea,12),Ef=[0,[0,L(Ee,Ed,11),Ec],0],Eg=L(0,0,1),Eh=[0,D$,[0,[0,L(0,0,0),Eg],Ef]],Ei=[0,v,ct,aV,iX];(function(a){return b3(Ei,a)}(Eh));var
Ej=[0,DO],Ek=[0,iX];(function(a){return bp(Ek,a)}(Ej));var
En=fb;function
Eo(a){return a}function
Ep(a){return a|0}function
Eq(a){return a}function
Er(a){return a}var
Es=b9,Et=dR;function
Eu(b,a){return aL(b,a)}function
Ev(b,a){return b-a|0}function
Ew(b,a){return b+a|0}var
u=gf([0,El,Em,n8,n9,function(a){return-a|0},Ew,Ev,Eu,Et,Es,n_,n$,oa,oc,ob,Er,Eq,Ep,Eo,En,od,of,og]),EI=[0,jS],EJ=[0,u[5],u[6],u[3],u[7]];(function(a){return cg(EJ,a)}(EI));var
EK=[0,Ey,EA,jS,Ex,EC,ED,EE,EF,EG,EB,Ez,EH],EL=[0,u[1],u[2],u[3],u[4],u[5],u[6],u[7],u[8],u[9],u[10],u[11],u[12],u[13],u[14],u[15],u[16],u[17],u[18],u[19],u[20],u[21],u[22],u[23],u[24],u[25],u[26],u[27],u[28],u[29],u[30],u[31],u[32],u[33],u[34]];(function(a){return dB(EL,a)}(EK));var
EM=jk([0,d8])[1],ef=uj([0,fN]),jT=ef[1],jU=ef[2],jV=ef[3],jW=ef[4],gh=ut([0,fN]),EN=gh[1],EO=gh[2],EP=gh[3],jX=uo([0,jT,jU,jV,jW]),EQ=jX[1],ER=jX[2],EW=[0,[0,z,v,am],EU,ES,EV,ET];(function(b){var
c=b[1],a=c[1],v=0,s=[0,b[4],b[5]];function
l(c,b){return fN(c,b,a)}function
d(c,b){return h(jT,c,b,a)}function
e(c,b){return h(jU,c,b,a)}function
f(c,b){return h(jV,c,b,a)}function
g(c,b){return h(jW,c,b,a)}function
m(d,c,b){return B(EQ,d,c,b,a)}function
n(d,c,b){return B(ER,d,c,b,a)}function
o(c,b){return h(EN,c,b,a)}function
p(c,b){return h(EO,c,b,a)}function
q(c,b){return h(EP,c,b,a)}var
r=cw([0,d,e,f,g]),t=f9([0,c0],[0,c[3]])[1],w=[0,cf([0,l,d,e,f,g,m,n,o,p,q,r,t,je([0,d8],[0,c[2]])[1]],s)[1],v],i=b[1],j=[0,i[2],i[3]],k=[0,d8,EM,c0],x=b[2],y=b[5],u=[0,jd([0,k[3]],[0,[0,j[2]],b[3]])[1],0];return[0,M(wH,[0,M(wB,[0,jl(k,[0,j,y,x])[1],u]),w])]}(EW));var
eg=uk([0,fU]),jY=eg[1],jZ=eg[2],j0=eg[3],j1=eg[4],gi=uu([0,fU]),EX=gi[1],EY=gi[2],EZ=gi[3],E0=t0([0,ea])[1],j2=up([0,jY,jZ,j0,j1]),E1=j2[1],E2=j2[2],eh=ul([0,fV]),j3=eh[1],j4=eh[2],j5=eh[3],j6=eh[4],gj=uv([0,fV]),E3=gj[1],E4=gj[2],E5=gj[3],E6=t1([0,fW])[1],j7=uq([0,j3,j4,j5,j6]),E7=j7[1],E8=j7[2],ei=um([0,fY]),j8=ei[1],j9=ei[2],j_=ei[3],j$=ei[4],gk=uw([0,fY]),E9=gk[1],E_=gk[2],E$=gk[3],Fa=t2([0,fZ])[1],ka=ur([0,j8,j9,j_,j$]),Fb=ka[1],Fc=ka[2],ej=un([0,f1]),kb=ej[1],kc=ej[2],kd=ej[3],ke=ej[4],gl=ux([0,f1]),Fd=gl[1],Fe=gl[2],Ff=gl[3],Fg=t3([0,f2])[1],kf=us([0,kb,kc,kd,ke]),Fh=kf[1],Fi=kf[2],Fz=[0,[0,z,v,am],[0,z,v,cu],[0,z,v,b_],[0,z,v,am],[0,z,v,am],Fx,Fv,Fy,Fw];(function(a){var
h=a[5],i=a[4],j=a[3],k=a[2],l=a[1],b=h[1],c=i[1],d=j[1],e=k[1],f=l[1],X=0,T=[0,a[8],a[9]];function
L(g,a){return f1(g,a,f,e,d,c,b)}function
r(g,a){return V(kb,g,a,f,e,d,c,b)}function
s(g,a){return V(kc,g,a,f,e,d,c,b)}function
t(g,a){return V(kd,g,a,f,e,d,c,b)}function
u(g,a){return V(ke,g,a,f,e,d,c,b)}function
N(h,g,a){return kK(Fh,h,g,a,f,e,d,c,b)}function
O(h,g,a){return kK(Fi,h,g,a,f,e,d,c,b)}function
P(g,a){return V(Fd,g,a,f,e,d,c,b)}function
Q(g,a){return V(Fe,g,a,f,e,d,c,b)}function
R(g,a){return V(Ff,g,a,f,e,d,c,b)}var
S=cw([0,r,s,t,u]),U=gb([0,f3],[0,l[3]],[0,k[3]],[0,j[3]],[0,i[3]],[0,h[3]])[1],Y=[0,cf([0,L,r,s,t,u,N,O,P,Q,R,S,U,ji([0,f2],[0,l[2]],[0,k[2]],[0,j[2]],[0,i[2]],[0,h[2]])[1]],T)[1],X],v=a[5],w=v[3],x=a[4],y=x[3],z=a[3],A=z[3],B=a[2],C=B[3],D=a[1],E=D[3],Z=a[6],_=a[9],$=v[2],aa=x[2],ab=z[2],ac=B[2],ad=D[2],F=[0,a[7]],m=[0,$],n=[0,aa],o=[0,ab],p=[0,ac],q=[0,ad],W=[0,bp(gb([0,f3],[0,E],[0,C],[0,A],[0,y],[0,w]),F)[1],0],K=[0,_,Z],G=ji([0,f2],q,p,o,n,m)[1],g=[0,G,function(b,a){return V(Fg,b,a,q[1],p[1],o[1],n[1],m[1])}],H=cv(g),I=g[1],J=g[2];return[0,M(wL,[0,M(wF,[0,b3([0,I,J,H,gb([0,f3],[0,E],[0,C],[0,A],[0,y],[0,w])[1]],K)[1],W]),Y])]}(Fz));var
FA=[0,[0,z,v,am],[0,z,v,cu],[0,z,v,b_],[0,z,v,am],Ft,Fr,Fu,Fs];(function(a){var
g=a[4],h=a[3],i=a[2],j=a[1],b=g[1],c=h[1],d=i[1],e=j[1],S=0,P=[0,a[7],a[8]];function
G(f,a){return fY(f,a,e,d,c,b)}function
o(f,a){return N(j8,f,a,e,d,c,b)}function
p(f,a){return N(j9,f,a,e,d,c,b)}function
q(f,a){return N(j_,f,a,e,d,c,b)}function
r(f,a){return N(j$,f,a,e,d,c,b)}function
H(g,f,a){return V(Fb,g,f,a,e,d,c,b)}function
I(g,f,a){return V(Fc,g,f,a,e,d,c,b)}function
J(f,a){return N(E9,f,a,e,d,c,b)}function
K(f,a){return N(E_,f,a,e,d,c,b)}function
L(f,a){return N(E$,f,a,e,d,c,b)}var
O=cw([0,o,p,q,r]),Q=ga([0,f0],[0,j[3]],[0,i[3]],[0,h[3]],[0,g[3]])[1],T=[0,cf([0,G,o,p,q,r,H,I,J,K,L,O,Q,jh([0,fZ],[0,j[2]],[0,i[2]],[0,h[2]],[0,g[2]])[1]],P)[1],S],s=a[4],t=s[3],u=a[3],v=u[3],w=a[2],x=w[3],y=a[1],z=y[3],U=a[5],W=a[8],X=s[2],Y=u[2],Z=w[2],_=y[2],A=[0,a[6]],k=[0,X],l=[0,Y],m=[0,Z],n=[0,_],R=[0,bp(ga([0,f0],[0,z],[0,x],[0,v],[0,t]),A)[1],0],F=[0,W,U],B=jh([0,fZ],n,m,l,k)[1],f=[0,B,function(b,a){return N(Fa,b,a,n[1],m[1],l[1],k[1])}],C=cv(f),D=f[1],E=f[2];return[0,M(wK,[0,M(wE,[0,b3([0,D,E,C,ga([0,f0],[0,z],[0,x],[0,v],[0,t])[1]],F)[1],R]),T])]}(FA));var
FB=[0,[0,z,v,am],[0,z,v,cu],[0,z,v,b_],Fp,Fn,Fq,Fo];(function(a){var
f=a[3],g=a[2],h=a[1],b=f[1],c=g[1],d=h[1],O=0,J=[0,a[6],a[7]];function
B(e,a){return fV(e,a,d,c,b)}function
l(e,a){return G(j3,e,a,d,c,b)}function
m(e,a){return G(j4,e,a,d,c,b)}function
n(e,a){return G(j5,e,a,d,c,b)}function
o(e,a){return G(j6,e,a,d,c,b)}function
C(f,e,a){return N(E7,f,e,a,d,c,b)}function
D(f,e,a){return N(E8,f,e,a,d,c,b)}function
E(e,a){return G(E3,e,a,d,c,b)}function
F(e,a){return G(E4,e,a,d,c,b)}function
H(e,a){return G(E5,e,a,d,c,b)}var
I=cw([0,l,m,n,o]),K=f$([0,fX],[0,h[3]],[0,g[3]],[0,f[3]])[1],P=[0,cf([0,B,l,m,n,o,C,D,E,F,H,I,K,jg([0,fW],[0,h[2]],[0,g[2]],[0,f[2]])[1]],J)[1],O],p=a[3],q=p[3],r=a[2],s=r[3],t=a[1],u=t[3],Q=a[4],R=a[7],S=p[2],T=r[2],U=t[2],v=[0,a[5]],i=[0,S],j=[0,T],k=[0,U],L=[0,bp(f$([0,fX],[0,u],[0,s],[0,q]),v)[1],0],A=[0,R,Q],w=jg([0,fW],k,j,i)[1],e=[0,w,function(b,a){return G(E6,b,a,k[1],j[1],i[1])}],x=cv(e),y=e[1],z=e[2];return[0,M(wJ,[0,M(wD,[0,b3([0,y,z,x,f$([0,fX],[0,u],[0,s],[0,q])[1]],A)[1],L]),P])]}(FB));var
FC=[0,[0,z,v,am],[0,z,v,cu],Fl,Fj,Fm,Fk];(function(c){var
e=c[2],f=c[1],a=e[1],b=f[1],I=0,E=[0,c[5],c[6]];function
w(d,c){return fU(d,c,b,a)}function
i(d,c){return B(jY,d,c,b,a)}function
j(d,c){return B(jZ,d,c,b,a)}function
k(d,c){return B(j0,d,c,b,a)}function
l(d,c){return B(j1,d,c,b,a)}function
x(e,d,c){return G(E1,e,d,c,b,a)}function
y(e,d,c){return G(E2,e,d,c,b,a)}function
z(d,c){return B(EX,d,c,b,a)}function
A(d,c){return B(EY,d,c,b,a)}function
C(d,c){return B(EZ,d,c,b,a)}var
D=cw([0,i,j,k,l]),F=f_([0,c3],[0,f[3]],[0,e[3]])[1],J=[0,cf([0,w,i,j,k,l,x,y,z,A,C,D,F,jf([0,ea],[0,f[2]],[0,e[2]])[1]],E)[1],I],m=c[2],n=m[3],o=c[1],p=o[3],K=c[3],L=c[6],N=m[2],O=o[2],q=[0,c[4]],g=[0,N],h=[0,O],H=[0,bp(f_([0,c3],[0,p],[0,n]),q)[1],0],v=[0,L,K],r=jf([0,ea],h,g)[1],d=[0,r,function(b,a){return B(E0,b,a,h[1],g[1])}],s=cv(d),t=d[1],u=d[2];return[0,M(wI,[0,M(wC,[0,b3([0,t,u,s,f_([0,c3],[0,p],[0,n])[1]],v)[1],H]),J])]}(FC));function
FD(c){function
a(b){if(typeof
b==="number")return 0===b?FE:FF;else
switch(b[0]){case
0:var
e=b[1],i=e[2],j=e[1],k=a(e[3]),l=d(c,i),m=a(j);return h(r(FG),m,l,k);case
1:var
f=b[1],n=f[2],o=f[1],p=a(f[3]),q=d(c,n),s=a(o);return h(r(FH),s,q,p);default:var
g=b[1],t=g[2],u=g[1],v=a(g[3]),w=d(c,t),x=a(u);return h(r(FI),x,w,v)}}return a}var
gm=[J,FJ,H(0)];function
FK(a){switch(a){case
0:return FL;case
1:return FM;case
2:return FN;default:return FO}}cR(function(a){if(a[1]===gm){var
b=a[2],c=function(a){return d$(FP,a)},e=i(i(b,function(a){return bn(a,FK)}),c);return[0,d(r(FQ),e)]}return 0});function
FR(a){var
b=typeof
a==="number"?0===a?0:1:0===a[0]?0:1;return b?0:1}var
ek=function
b(a){return b.fun(a)};function
FS(a){function
g(m){var
a=m;for(;;){if(typeof
a==="number"){if(0===a)return 1;var
b=0}else
switch(a[0]){case
0:var
h=a[1],j=h[3],i=h[1],b=1;break;case
2:var
l=a[1],c=l[1];if(typeof
c==="number")var
e=1;else
if(2===c[0])var
b=0,e=0;else
var
e=1;if(e){var
d=l[3];if(typeof
d==="number")var
f=1;else
if(2===d[0])var
b=0,f=0;else
var
f=1;if(f)var
j=d,i=c,b=1}break;default:var
b=0}if(b){var
k=g(i);if(k){var
a=j;continue}return k}return 0}}return g(a)}function
gn(g,f){var
a=d(ek,g),c=d(ek,f);if(a)if(c){var
e=a[1];if(b(bo,e,c[1]))return[0,e]}return 0}QY(ek,function(a){if(typeof
a==="number")return 0===a?FT:FU;else
switch(a[0]){case
0:var
b=a[1],e=b[3],f=b[1],g=function(a){return 1+a|0},h=function(a){return d9(a,g)};return i(gn(f,e),h);case
1:var
c=a[1],j=c[3],k=c[1],l=function(a){return 2+a|0},m=function(a){return d9(a,l)};return i(gn(k,j),m);default:var
d=a[1];return gn(d[1],d[3])}});function
FV(a){return i(i(a,ek),fO)}function
kg(a,l){function
e(b){var
c=b[2];return dy(1-d(b[1],a),c)}function
f(a){return d_(a,e)}var
g=0,h=3,c=i([0,[0,FR,0],[0,[0,FS,1],[0,[0,FV,2],[0,[0,function(a){function
h(q,p,o){var
d=q,c=o;for(;;){if(typeof
c==="number")return 1;var
e=c[1],a=e[2],r=e[3],j=h(d,[0,a],e[1]);if(j){var
m=function(c){return function(a){return 2<=b(l,c,a)?1:0}}(a),g=i(d,function(b){return function(a){return iH(a,1,b)}}(m));if(g)var
n=function(c){return function(a){return 0===b(l,c,a)?1:0}}(a),f=i(p,function(b){return function(a){return iH(a,1,b)}}(n));else
var
f=g;if(f){var
d=[0,a],c=r;continue}var
k=f}else
var
k=j;return k}}return h(0,0,a)},h],g]]]],f);return c?bm([0,gm,c]):a}function
go(a){return typeof
a==="number"?0:0===a[0]?a:[0,a[1]]}function
dC(a){if(typeof
a!=="number")switch(a[0]){case
0:var
b=a[1],h=b[1];if(typeof
h!=="number"&&2===h[0]){var
c=h[1],f=c[1];if(typeof
f!=="number"&&2===f[0]){var
k=f[1];return[2,[0,[0,[0,k[1],k[2],k[3]]],c[2],[0,[0,c[3],b[2],b[3]]]]]}var
i=c[3];if(typeof
i!=="number"&&2===i[0]){var
j=i[1];return[2,[0,[0,[0,f,c[2],j[1]]],j[2],[0,[0,j[3],b[2],b[3]]]]]}}return a;case
1:var
d=a[1],l=d[1];if(typeof
l!=="number"&&2===l[0]){var
e=l[1],g=e[1];if(typeof
g!=="number"&&2===g[0]){var
o=g[1];return[0,[0,[0,[0,o[1],o[2],o[3]]],e[2],[0,[0,e[3],d[2],d[3]]]]]}var
m=e[3];if(typeof
m!=="number"&&2===m[0]){var
n=m[1];return[0,[0,[0,[0,g,e[2],n[1]]],n[2],[0,[0,n[3],d[2],d[3]]]]]}}return a}return by(FW)}function
dD(a){if(typeof
a!=="number")switch(a[0]){case
0:var
f=a[1],g=f[3],p=f[2],q=f[1];if(typeof
g!=="number"&&2===g[0]){var
b=g[1],d=b[1];if(typeof
d!=="number"&&2===d[0]){var
j=d[1];return[2,[0,[0,[0,q,p,j[1]]],j[2],[0,[0,j[3],b[2],b[3]]]]]}var
h=b[3];if(typeof
h!=="number"&&2===h[0]){var
i=h[1];return[2,[0,[0,[0,q,p,d]],b[2],[0,[0,i[1],i[2],i[3]]]]]}}return a;case
1:var
k=a[1],l=k[3],r=k[2],s=k[1];if(typeof
l!=="number"&&2===l[0]){var
c=l[1],e=c[1];if(typeof
e!=="number"&&2===e[0]){var
o=e[1];return[0,[0,[0,[0,s,r,o[1]]],o[2],[0,[0,o[3],c[2],c[3]]]]]}var
m=c[3];if(typeof
m!=="number"&&2===m[0]){var
n=m[1];return[0,[0,[0,[0,s,r,e]],c[2],[0,[0,n[1],n[2],n[3]]]]]}}return a}return by(FX)}function
el(b){if(typeof
b!=="number")switch(b[0]){case
0:var
c=b[1],d=c[1];if(typeof
d==="number")var
a=0;else
switch(d[0]){case
1:var
a=0;break;case
0:var
n=c[3];if(typeof
n==="number"){if(0!==n){var
f=d[1];return dC([1,[0,[2,[0,f[1],f[2],f[3]]],c[2],0]])}var
a=1}else
var
a=1;break;default:var
g=d[1],h=g[3];if(typeof
h==="number")var
e=1;else
if(0===h[0]){var
o=c[3];if(typeof
o==="number"){if(0!==o){var
i=h[1],q=g[2],r=g[1];return[0,[0,r,q,dC([0,[0,[2,[0,i[1],i[2],i[3]]],c[2],0]])]]}var
a=1,e=0}else
var
a=1,e=0}else
var
e=1;if(e)var
a=1}break;case
2:var
j=b[1],k=j[1];if(typeof
k==="number")var
m=0;else
if(0===k[0]){var
p=j[3];if(typeof
p==="number"){if(0!==p){var
l=k[1];return dC([0,[0,[2,[0,l[1],l[2],l[3]]],j[2],0]])}var
m=1}else
var
m=1}else
var
m=0;break}return b}function
em(a){if(typeof
a!=="number")switch(a[0]){case
0:var
c=a[1],k=c[1];if(typeof
k==="number")if(0!==k){var
b=c[3],l=c[2];if(typeof
b==="number")var
n=0;else
switch(b[0]){case
1:var
n=0;break;case
0:var
d=b[1];return dD([1,[0,0,l,[2,[0,d[1],d[2],d[3]]]]]);default:var
e=b[1],f=e[1];if(typeof
f!=="number"&&0===f[0]){var
g=f[1],o=e[3],p=e[2];return[0,[0,dD([0,[0,0,l,[2,[0,g[1],g[2],g[3]]]]]),p,o]]}var
n=1}}break;case
2:var
h=a[1],m=h[1];if(typeof
m==="number")if(0!==m){var
i=h[3];if(typeof
i!=="number"&&0===i[0]){var
j=i[1];return dD([0,[0,0,h[2],[2,[0,j[1],j[2],j[3]]]]])}}break}return a}var
gp=0;function
kh(e,j,d){function
c(a){if(typeof
a==="number"){if(0===a)return[0,1,[2,[0,0,d,0]]]}else
switch(a[0]){case
0:var
e=a[1],i=e[3],f=e[2],k=e[1];switch(b(j,d,f)){case
0:var
l=c(k),r=l[2];return l[1]?[0,1,dC([0,[0,r,f,i]])]:[0,0,a];case
1:return[0,0,a];default:var
m=c(i),s=m[2];return m[1]?[0,1,dD([0,[0,k,f,s]])]:[0,0,a]}case
2:var
g=a[1],n=g[3],h=g[2],o=g[1];switch(b(j,d,h)){case
0:var
p=c(o),t=p[2];return p[1]?[0,1,[2,[0,t,h,n]]]:[0,0,a];case
1:return[0,0,a];default:var
q=c(n),u=q[2];return q[1]?[0,1,[2,[0,o,h,u]]]:[0,0,a]}}return by(FY)}var
a=i(e,c),f=a[1];return[0,f,i(a[2],go)]}function
ki(a,c,f,e){return i(a,function(g){var
a=g;for(;;){if(typeof
a==="number"){if(0===a)return 0}else
if(1!==a[0]){var
c=a[1],d=c[2],h=c[3],i=c[1];switch(b(f,e,d)){case
0:var
a=i;continue;case
1:return[0,d];default:var
a=h;continue}}return by(F7)}})}function
kj(c,d,a,f){function
e(h,g){var
c=h,a=g;for(;;){if(typeof
a==="number"){if(0===a)return c}else
if(1!==a[0]){var
d=a[1],i=d[3],j=d[2],c=b(f,e(c,d[1]),j),a=i;continue}return by(F8)}}return i(c,function(b){return e(a,b)})}var
bL=FD(am);function
bz(b,a){var
c=bX(a);return z(bX(b),c)}function
kk(a,b){var
c=[g,function(c){return f7(b,kj(a,bz,0,function(a,b){return a+1|0}))}];return C(d(bL,a),c)}kk(S,5);kk(gp,0);function
kl(a,b){var
c=[g,function(c){return aW(b,i(kj(a,bz,0,function(a,b){return[0,b,a]}),ak))}];return C(d(bL,a),c)}kl(S,F9);kl(gp,0);function
km(b,l,j){var
a=[g,function(g){function
f(c){if(typeof
c!=="number")switch(c[0]){case
0:var
a=c[1],e=a[1];if(typeof
e==="number")if(0===e){var
d=a[3],i=a[2];if(typeof
d==="number"){if(1!==d)return[0,1,i]}else
if(2===d[0]){var
g=d[1];return[0,[0,[0,g[1],g[2],g[3]]],i]}}var
l=a[3],m=a[2],j=f(e),n=j[2];return[0,em([0,[0,j[1],m,l]]),n];case
2:var
b=c[1],h=b[1];if(typeof
h==="number")if(0===h)return[0,b[3],b[2]];var
o=b[3],p=b[2],k=f(h),q=k[2];return[0,em([2,[0,k[1],p,o]]),q]}return by(F0)}function
e(a){if(typeof
a==="number"){if(0===a)return F1}else
switch(a[0]){case
0:var
h=a[1],c=h[3],i=h[2],b=h[1];switch(bz(l,i)){case
0:var
m=e(b),s=m[2];return m[1]?[0,1,em([0,[0,s,i,c]])]:[0,0,a];case
1:if(typeof
c==="number"){if(0===c){if(typeof
b==="number"){if(0===b)return F3}else
if(2===b[0])return[0,1,[0,b[1]]];return by(F4)}}else
if(1!==c[0]){var
n=f(c);return[0,1,el([0,[0,b,n[2],n[1]]])]}return by(F5);default:var
o=e(c),t=o[2];return o[1]?[0,1,el([0,[0,b,i,t]])]:[0,0,a]}case
2:var
j=a[1],d=j[3],k=j[2],g=j[1];switch(bz(l,k)){case
0:var
p=e(g),u=p[2];return p[1]?[0,1,em([2,[0,u,k,d]])]:[0,0,a];case
1:if(typeof
d==="number"){if(0===d)return[0,1,g]}else
if(0===d[0]){var
q=f(d);return[0,1,el([2,[0,g,q[2],q[1]]])]}return by(F6);default:var
r=e(d),v=r[2];return r[1]?[0,1,el([2,[0,g,k,v]])]:[0,0,a]}}return by(F2)}var
a=i(b,e),c=a[1],d=[0,c,i(a[2],go)];return f6(function(a){return c3(a,cm,bL)},j,d)}],c=d(bL,b);return h(k(F_),c,l,a)}function
f(c,b,a){return km(c,b,[0,1,a])}function
e(a,b){return km(a,b,[0,0,a])}e(bh,12);f(bh,11,F$);e(bh,10);f(bh,9,Ga);e(bh,8);f(bh,7,Gb);e(bh,6);f(bh,5,Gc);e(bh,4);f(bh,3,Gd);e(bh,2);f(bh,1,Ge);e(bh,0);e(bg,12);f(bg,11,Gf);e(bg,10);f(bg,9,Gg);e(bg,8);f(bg,7,Gh);e(bg,6);f(bg,5,Gi);e(bg,4);f(bg,3,Gj);e(bg,2);f(bg,1,Gk);e(bg,0);e(bf,12);f(bf,11,Gl);e(bf,10);f(bf,9,Gm);e(bf,8);f(bf,7,Gn);e(bf,6);f(bf,5,Go);e(bf,4);f(bf,3,Gp);e(bf,2);f(bf,1,Gq);e(bf,0);e(be,12);f(be,11,Gr);e(be,10);f(be,9,Gs);e(be,8);f(be,7,Gt);e(be,6);f(be,5,Gu);e(be,4);f(be,3,Gv);e(be,2);f(be,1,Gw);e(be,0);e(bd,12);f(bd,11,Gx);e(bd,10);f(bd,9,Gy);e(bd,8);f(bd,7,Gz);e(bd,6);f(bd,5,GA);e(bd,4);f(bd,3,GB);e(bd,2);f(bd,1,GC);e(bd,0);e(bc,12);f(bc,11,GD);e(bc,10);f(bc,9,GE);e(bc,8);f(bc,7,GF);e(bc,6);f(bc,5,GG);e(bc,4);f(bc,3,GH);e(bc,2);f(bc,1,GI);e(bc,0);e(bb,12);f(bb,11,GJ);e(bb,10);f(bb,9,GK);e(bb,8);f(bb,7,GL);e(bb,6);f(bb,5,GM);e(bb,4);f(bb,3,GN);e(bb,2);f(bb,1,GO);e(bb,0);e(ba,12);f(ba,11,GP);e(ba,10);f(ba,9,GQ);e(ba,8);f(ba,7,GR);e(ba,6);f(ba,5,GS);e(ba,4);f(ba,3,GT);e(ba,2);f(ba,1,GU);e(ba,0);e(a$,12);f(a$,11,GV);e(a$,10);f(a$,9,GW);e(a$,8);f(a$,7,GX);e(a$,6);f(a$,5,GY);e(a$,4);f(a$,3,GZ);e(a$,2);f(a$,1,G0);e(a$,0);e(a_,12);f(a_,11,G1);e(a_,10);f(a_,9,G2);e(a_,8);f(a_,7,G3);e(a_,6);f(a_,5,G4);e(a_,4);f(a_,3,G5);e(a_,2);f(a_,1,G6);e(a_,0);e(a9,12);f(a9,11,G7);e(a9,10);f(a9,9,G8);e(a9,8);f(a9,7,G9);e(a9,6);f(a9,5,G_);e(a9,4);f(a9,3,G$);e(a9,2);f(a9,1,Ha);e(a9,0);e(a8,12);f(a8,11,Hb);e(a8,10);f(a8,9,Hc);e(a8,8);f(a8,7,Hd);e(a8,6);f(a8,5,He);e(a8,4);f(a8,3,Hf);e(a8,2);f(a8,1,Hg);e(a8,0);e(a7,12);f(a7,11,Hh);e(a7,10);f(a7,9,Hi);e(a7,8);f(a7,7,Hj);e(a7,6);f(a7,5,Hk);e(a7,4);f(a7,3,Hl);e(a7,2);f(a7,1,Hm);e(a7,0);e(a6,12);f(a6,11,Hn);e(a6,10);f(a6,9,Ho);e(a6,8);f(a6,7,Hp);e(a6,6);f(a6,5,Hq);e(a6,4);f(a6,3,Hr);e(a6,2);f(a6,1,Hs);e(a6,0);e(a5,12);f(a5,11,Ht);e(a5,10);f(a5,9,Hu);e(a5,8);f(a5,7,Hv);e(a5,6);f(a5,5,Hw);e(a5,4);f(a5,3,Hx);e(a5,2);f(a5,1,Hy);e(a5,0);e(a4,12);f(a4,11,Hz);e(a4,10);f(a4,9,HA);e(a4,8);f(a4,7,HB);e(a4,6);f(a4,5,HC);e(a4,4);f(a4,3,HD);e(a4,2);f(a4,1,HE);e(a4,0);e(ac,10);f(ac,9,HF);e(ac,8);f(ac,7,HG);e(ac,6);f(ac,5,HH);e(ac,4);f(ac,3,HI);e(ac,2);f(ac,1,HJ);e(ac,0);e(ab,10);f(ab,9,HK);e(ab,8);f(ab,7,HL);e(ab,6);f(ab,5,HM);e(ab,4);f(ab,3,HN);e(ab,2);f(ab,1,HO);e(ab,0);e(aa,10);f(aa,9,HP);e(aa,8);f(aa,7,HQ);e(aa,6);f(aa,5,HR);e(aa,4);f(aa,3,HS);e(aa,2);f(aa,1,HT);e(aa,0);e($,10);f($,9,HU);e($,8);f($,7,HV);e($,6);f($,5,HW);e($,4);f($,3,HX);e($,2);f($,1,HY);e($,0);e(_,10);f(_,9,HZ);e(_,8);f(_,7,H0);e(_,6);f(_,5,H1);e(_,4);f(_,3,H2);e(_,2);f(_,1,H3);e(_,0);e(Z,10);f(Z,9,H4);e(Z,8);f(Z,7,H5);e(Z,6);f(Z,5,H6);e(Z,4);f(Z,3,H7);e(Z,2);f(Z,1,H8);e(Z,0);e(Y,10);f(Y,9,H9);e(Y,8);f(Y,7,H_);e(Y,6);f(Y,5,H$);e(Y,4);f(Y,3,Ia);e(Y,2);f(Y,1,Ib);e(Y,0);e(S,10);f(S,9,Ic);e(S,8);f(S,7,Id);e(S,6);f(S,5,Ie);e(S,4);f(S,3,If);e(S,2);f(S,1,Ig);e(S,0);e(aD,8);f(aD,7,Ih);e(aD,6);f(aD,5,Ii);e(aD,4);f(aD,3,Ij);e(aD,2);f(aD,1,Ik);e(aD,0);e(aC,8);f(aC,7,Il);e(aC,6);f(aC,5,Im);e(aC,4);f(aC,3,In);e(aC,2);f(aC,1,Io);e(aC,0);e(aB,8);f(aB,7,Ip);e(aB,6);f(aB,5,Iq);e(aB,4);f(aB,3,Ir);e(aB,2);f(aB,1,Is);e(aB,0);e(ay,8);f(ay,7,It);e(ay,6);f(ay,5,Iu);e(ay,4);f(ay,3,Iv);e(ay,2);f(ay,1,Iw);e(ay,0);e(I,6);f(I,5,Ix);e(I,4);f(I,3,Iy);e(I,2);f(I,1,Iz);e(I,0);e(aX,6);f(aX,5,IA);e(aX,4);f(aX,3,IB);e(aX,2);f(aX,1,IC);e(aX,0);e(as,4);f(as,3,ID);e(as,2);f(as,1,IE);e(as,0);e(ar,4);f(ar,3,IF);e(ar,2);f(ar,1,IG);e(ar,0);e(bA,2);f(bA,1,0);e(bA,0);e(0,0);function
kn(b,a,c){var
e=[g,function(d){return ja(am,v,c,ki(b,bz,bz,a))}],f=d(bL,b);return h(k(IH),f,a,e)}function
c4(b,a){return kn(b,a,[0,bX(a)])}function
cz(b,a){return kn(b,a,0)}cz(I,6);c4(I,5);cz(I,4);c4(I,3);cz(I,2);c4(I,1);cz(I,0);c4(I,-1);cz(I,-2);c4(I,-3);cz(I,-4);c4(I,-5);cz(I,-6);function
T(c,a,e){var
b=[g,function(d){function
b(c){if(typeof
c==="number"){if(0===c)return[2,[0,0,a,0]]}else
switch(c[0]){case
0:var
d=c[1],e=d[3],f=d[2],g=d[1];switch(bz(a,f)){case
0:return dC([0,[0,b(g),f,e]]);case
1:return[0,[0,g,a,e]];default:return dD([0,[0,g,f,b(e)]])}case
2:var
h=c[1],i=h[3],j=h[2],k=h[1];switch(bz(a,j)){case
0:return[2,[0,b(k),j,i]];case
1:return[2,[0,k,a,i]];default:return[2,[0,k,j,b(i)]]}}return by(FZ)}return f6(bL,e,i(i(c,b),go))}],f=d(bL,c);return h(k(II),f,a,b)}T(as,4,IJ);T(as,3,IK);T(as,2,IL);T(as,1,IM);T(as,0,IN);T(as,-1,IO);T(as,-2,IP);T(as,-3,IQ);T(as,-4,IR);T(ar,4,IS);T(ar,3,IT);T(ar,2,IU);T(ar,1,IV);T(ar,0,IW);T(ar,-1,IX);T(ar,-2,IY);T(ar,-3,IZ);T(ar,-4,I0);T(bA,2,I1);T(bA,1,I2);T(bA,0,I3);T(bA,-1,I4);T(bA,-2,I5);T(0,0,I6);function
ko(b,a,c){var
e=[g,function(e){var
d=kh(b,bz,a);return f6(function(a){return c3(a,cm,bL)},c,d)}],f=d(bL,b);return h(k(I7),f,a,e)}function
l(c,b,a){return ko(c,b,[0,1,a])}function
m(a,b){return ko(a,b,[0,0,a])}l(ac,10,I8);m(ac,9);l(ac,8,I9);m(ac,7);l(ac,6,I_);m(ac,5);l(ac,4,I$);m(ac,3);l(ac,2,Ja);m(ac,1);l(ac,0,Jb);l(ab,10,Jc);m(ab,9);l(ab,8,Jd);m(ab,7);l(ab,6,Je);m(ab,5);l(ab,4,Jf);m(ab,3);l(ab,2,Jg);m(ab,1);l(ab,0,Jh);l(aa,10,Ji);m(aa,9);l(aa,8,Jj);m(aa,7);l(aa,6,Jk);m(aa,5);l(aa,4,Jl);m(aa,3);l(aa,2,Jm);m(aa,1);l(aa,0,Jn);l($,10,Jo);m($,9);l($,8,Jp);m($,7);l($,6,Jq);m($,5);l($,4,Jr);m($,3);l($,2,Js);m($,1);l($,0,Jt);l(_,10,Ju);m(_,9);l(_,8,Jv);m(_,7);l(_,6,Jw);m(_,5);l(_,4,Jx);m(_,3);l(_,2,Jy);m(_,1);l(_,0,Jz);l(Z,10,JA);m(Z,9);l(Z,8,JB);m(Z,7);l(Z,6,JC);m(Z,5);l(Z,4,JD);m(Z,3);l(Z,2,JE);m(Z,1);l(Z,0,JF);l(Y,10,JG);m(Y,9);l(Y,8,JH);m(Y,7);l(Y,6,JI);m(Y,5);l(Y,4,JJ);m(Y,3);l(Y,2,JK);m(Y,1);l(Y,0,JL);l(S,10,JM);m(S,9);l(S,8,JN);m(S,7);l(S,6,JO);m(S,5);l(S,4,JP);m(S,3);l(S,2,JQ);m(S,1);l(S,0,JR);l(aD,8,JS);m(aD,7);l(aD,6,JT);m(aD,5);l(aD,4,JU);m(aD,3);l(aD,2,JV);m(aD,1);l(aC,8,JW);m(aC,7);l(aC,6,JX);m(aC,5);l(aC,4,JY);m(aC,3);l(aC,2,JZ);m(aC,1);l(aB,8,J0);m(aB,7);l(aB,6,J1);m(aB,5);l(aB,4,J2);m(aB,3);l(aB,2,J3);m(aB,1);l(ay,8,J4);m(ay,7);l(ay,6,J5);m(ay,5);l(ay,4,J6);m(ay,3);l(ay,2,J7);m(ay,1);l(ay,0,J8);l(I,6,J9);m(I,5);l(I,4,J_);m(I,3);l(I,2,J$);m(I,1);l(I,0,Ka);l(aX,6,Kb);m(aX,5);l(aX,4,Kc);m(aX,3);l(aX,2,Kd);m(aX,1);l(aX,0,Ke);l(as,4,Kf);m(as,3);l(as,2,Kg);m(as,1);l(as,0,Kh);l(ar,4,Ki);m(ar,3);l(ar,2,Kj);m(ar,1);l(ar,0,Kk);l(bA,2,Kl);m(bA,1);l(bA,0,Km);l(0,0,Kn);function
bi(a,b){var
c=b?[g,function(c){return f5([0,gm,b],[g,function(b){return kg(a,bz)}])}]:[g,function(b){return i(kg(a,bz),tl)}];return C(d(bL,a),c)}bi(Kp,Ko);bi(Kr,Kq);bi(Kt,Ks);bi(Kv,Ku);bi(Kw,0);bi(Ky,Kx);bi(KA,Kz);bi(KB,0);bi(KD,KC);bi(KF,KE);bi(KG,0);bi(1,KH);bi(0,0);var
kp=[0];function
kq(a){return(a-1|0)/2|0}var
kr=[J,KI,H(0)];function
KJ(a){return KK}cR(function(a){if(a[1]===kr){var
b=a[2],c=function(a){return d$(KL,a)},e=i(i(b,function(a){return bn(a,KJ)}),c);return[0,d(r(KM),e)]}return 0});function
en(a,e){function
f(b){var
c=b[2];return dy(1-d(b[1],a),c)}function
g(a){return d_(a,f)}var
h=0,j=0,c=i([0,[0,function(a){function
g(c){var
d=aQ(a,kq(c));return 2<=b(e,aQ(a,c),d)?0:1}function
c(b){function
a(f){var
a=f;function
e(a){return 1-g(a)}for(;;){if(a){var
b=a[1],d=a[2];if(!e(b)){var
a=d;continue}var
c=[0,b]}else
var
c=0;return 1-i(c,fO)}}return i(i(b,fS),a)}return i(L(0,0,a.length-1),c)},j],h],g);return c?bm([0,kr,c]):a}function
gq(a,c,b){var
d=aQ(a,c);ge(a,c,aQ(a,b));return ge(a,b,d)}function
gr(e,a,c,b){var
f=a?a[1]:kp;return C(e,[g,function(a){return aW(b,hH(c1(f,c,function(b,a){return d(a,b)})))}])}function
KN(d){function
a(a){return en(a,z)}function
c(g){var
e=g.length-1-1|0;if(b(bo,e,0))return kp;var
k=aQ(g,e),i=0;if(0<=0)if(0<=e)if((g.length-1-e|0)<i)var
h=0;else
var
a=g6(g,i,e),h=1;else
var
h=0;else
var
h=0;if(!h)var
a=ah(nJ);ge(a,0,k);var
c=0;for(;;){var
f=(2*c|0)+2|0,d=(2*c|0)+1|0;if(bl(f,e)){var
l=aQ(a,d),m=z(aQ(a,c),l),n=aQ(a,f),o=z(aQ(a,c),n),r=0===m?0:0===o?0:1;if(!r){var
p=aQ(a,f),j=2<=z(aQ(a,d),p)?d:f;gq(a,c,j);var
c=j;continue}}else
if(bl(d,e)){var
q=aQ(a,d);if(0===z(aQ(a,c),q)){gq(a,c,d);var
c=d;continue}}return a}}return i(i(i(d,function(a){return en(a,z)}),c),a)}function
cA(a,b){var
c=c2(a,am);return gr(c,[0,hI(a)],[0,KN,0],b)}cA(KP,KO);cA(KR,KQ);cA(KT,KS);cA(KV,KU);cA(KX,KW);cA(KZ,KY);cA(K0,0);function
bB(a,b){var
c=c2(a,am);return gr(c,0,bn(a,function(i){return function(j){var
e=en(j,z),c=[0,i],g=e.length-1;if(0===g)var
f=c.length-1,a=0===f?[0]:g6(c,0,f);else
var
a=0===c.length-1?g6(e,0,g):Qe(e,c);var
b=a.length-1-1|0;for(;;){if(0!==b){var
d=kq(b),h=aQ(a,d);if(2<=z(aQ(a,b),h)){gq(a,b,d);var
b=d;continue}}return en(a,z)}}}),b)}bB(K2,K1);bB(K4,K3);bB(K6,K5);bB(K8,K7);bB(K_,K9);bB(La,K$);bB(Lc,Lb);bB(Le,Ld);bB(Lg,Lf);bB(Li,Lh);bB(Lk,Lj);gr(Ll,0,0,0);d(d(d(wz[1][1],[0,hN]),[0,td,te,i5,tf,tg,i6,th,ti,i7,tj,tk,i8]),[0,b2,b2]);jp([0,s7,s8,iZ,s9,s_,i1,s$,ta,i3,tb,tc,i4,s6,hN]);function
ks(c,b,l){var
a=[g,function(k){function
d(b,a){return i(kh(b,z,a),iY)}var
e=i(b,function(a){return c1(gp,a,d)});function
f(b,a){var
c=b[2],d=b[1];return i(ki(e,z,z,a),fO)?[0,[0,c,d],0]:[0,d,[0,a,c]]}var
a=i(c,function(b){function
a(a){return c1(Lm,a,f)}return i(i(b,iV),a)}),g=a[2],h=a[1];function
j(a){return bn(a,iW)}return jc(l,i(i(i([0,g,h],function(a){return bn(a,ak)}),j),ak))}],d=iW(b);return h(k(Lr),c,d,a)}ks(Lu,Lt,Ls);ks(Lx,Lw,Lv);var
Ly=[0,Lp,Ln,Lq,Lo],Lz=[0,[0,sR,sS,ds,dt,dv,du],v,ct,cu,z,cU,cV,cX,cW,d6,d7,bw,bI,dr];(function(a){return jr(Lz,a)}(Ly));var
gs=iP(0,0),aY=[J,LA,H(0)],cB=[J,LB,H(0)],dE=[J,LC,H(0)];cR(function(a){if(a===aY)return LD;if(a===cB)return LE;if(a[1]===dE){var
b=a[2];return[0,d(r(LF),b)]}return 0});var
LU=[0,[0,LT,[0,LS,[0,[0,[0,[0,LR,[0,[1,aY]]]],LQ],[0,LP,[0,[0,[0,[0,LO,[0,[3,aY,cB,0]]]],LN],[0,[0,[0,[0,LM,[0,[4,LL,cB,0]]]],LK],[0,LJ,[0,[0,[0,[0,LI,[1,aY,0]]],LH],LG]]]]]]]]];function
cC(d,a){var
b=0===a[0]?a[1][1]:a[1][1];return C(b,[g,function(e){var
b=kt?kt[1]:1;QQ(b);function
c(a){if(0===a[0]){var
d=a[1],b=d[1],g=d[2];try{fL(g);var
h=[0,[0,b,0]];return h}catch(a){a=a1(a);return a[1]===dA?[0,[0,b,[0,a[2]]]]:[0,[0,b,[1,a,iz(0)]]]}}var
e=a[1],j=e[1],f=bn(e[2],c);function
k(c,b){if(0===b[0])var
d=b[1][2],e=typeof
d==="number"?tI:0===d[0]?tJ:tK,a=e;else
var
a=b[1][3];return[0,c[1]+a[1]|0,c[2]+a[2]|0,c[3]+a[3]|0]}return[1,[0,j,f,i(f,function(a){return c1(tH,a,k)})]]}return aA(f4,tO,d,c(a))}])}var
LV=0,LY=[0,cC([0,[0,LX,[1,aY,0]]],C(LW,[g,function(a){return bm(aY)}])),LV],L2=[0,cC(L1,C(L0,[g,function(a){return cY(LZ,function(a){return bm([0,dA,[5,a]])})}])),LY],L5=[0,cC([0,[0,L4,[0,[3,aY,cB,0]]]],C(L3,[g,function(a){return f5(aY,[g,function(a){return bm(cB)}])}])),L2],L8=[0,cC([0,[0,L7,[0,[1,aY]]]],C(L6,[g,function(a){return f5(aY,0)}])),L5],L$=[0,cC(L_,C(L9,[g,function(a){return aA(am,v,42,43)}])),L8],Md=[0,cC(Mc,M(Mb,[0,C(Ma,0),0])),L$],Mg=[0,cC(Mf,C(Me,0)),Md];b(tV(Mi),Mh,Mg);function
aI(c,a,e){var
D=c?c[1]:0,f=[g,function(c){function
x(f,g){if(0===g[0]){var
y=g[1],e=y[2],U=y[1];if(!D)if(!b(tm,e,0))return 0;var
V=0;if(typeof
e==="number")var
c=tw;else
if(0===e[0]){var
a=e[1];switch(a[0]){case
0:var
n=a[1],C=n[2],E=n[1],c=b(r(tx),E,C);break;case
1:var
F=aG(a[1]),c=d(r(ty),F);break;case
2:var
H=a[1],c=d(r(tz),H);break;case
3:var
o=a[3],p=a[2],q=a[1];if(o)var
I=cc(o[1]),J=aG(p),K=aG(q),c=h(r(tA),K,J,I);else
var
L=aG(p),M=aG(q),c=b(r(tB),M,L);break;case
4:var
s=a[3],t=a[2],u=a[1];if(s)var
N=cc(s[1]),O=aG(t),c=h(r(tC),u,O,N);else
var
P=aG(t),c=b(r(tD),u,P);break;default:var
Q=a[1],c=d(r(tE),Q)}}else{var
v=e[2],w=e[1];if(v)var
R=cc(v[1]),S=aG(w),c=b(r(tF),S,R);else
var
T=aG(w),c=d(r(tG),T)}return[0,h(r(tP),f,U,c),V]}var
j=g[1],k=j[3],l=k[3],m=k[2],z=k[1],A=j[1],W=j[2],X=bx(f,tQ);function
Y(a){return x(X,a)}var
Z=i(W,function(a){return aH(a,Y)}),B=b(dx,m+l|0,0)?h(r(tR),f,A,z):G(r(tS),f,A,z,m,l);if(!D)if(!b(iF,m+l|0,0))return[0,B,0];return[0,B,Z]}return jc(a,i(e,function(a){return i(a,function(a){return x(tT,a)})}))}];return C(i(a,function(a){return d$(Mj,a)}),f)}aI(0,Mn,[1,[0,Mm,[0,[0,[0,Ml,[1,aY,0]]],0],Mk]]);aI(Mq,Mp,Mo);aI(Mt,Ms,Mr);aI(Mw,Mv,Mu);aI(Mz,My,Mx);var
MC=[0,[0,MB,[1,[0,dE,MA],[0,gs]]]],MD=0,MF=ec?ME:P6;aI(0,[0,MF,MD],MC);aI(0,MH,[0,[0,MG,[1,aY,0]]]);aI(0,MJ,MI);var
MN=[0,[0,MM,[0,[4,ML,[0,dE,MK],[0,gs]]]]],MO=0,MQ=ec?MP:P5;aI(0,[0,MQ,MO],MN);var
MU=[0,[0,MT,[0,[3,[0,dE,MS],[0,dE,MR],[0,gs]]]]],MV=0,MX=ec?MW:P4;aI(0,[0,MX,MV],MU);aI(0,M0,[0,[0,MZ,[0,[4,MY,cB,0]]]]);aI(0,M2,[0,[0,M1,[0,[3,aY,cB,0]]]]);aI(0,M4,M3);aI(0,M6,[0,[0,M5,[0,[1,aY]]]]);aI(0,M8,M7);aI(M$,M_,M9);var
Na=[0,f4];(function(a){return bp(Na,a)}(LU));var
bM=[J,Nb,H(0)];function
Nc(a){switch(a){case
0:return Nd;case
1:return Ne;case
2:return Nf;case
3:return Ng;case
4:return Nh;case
5:return Ni;case
6:return Nj;case
7:return Nk;case
8:return Nl;case
9:return Nm;case
10:return Nn;case
11:return No;case
12:return Np;case
13:return Nq;case
14:return Nr;case
15:return Ns;case
16:return Nt;case
17:return Nu;case
18:return Nv;case
19:return Nw;case
20:return Nx;case
21:return Ny;case
22:return Nz;case
23:return NA;case
24:return NB;case
25:return NC;case
26:return ND;case
27:return NE;case
28:return NF;case
29:return NG;case
30:return NH;case
31:return NI;case
32:return NJ;case
33:return NK;case
34:return NL;case
35:return NM;default:return NN}}var
Oo=[J,On,H(0)];function
gt(a){return[bE,1,0,0,1,0,0]}function
gu(b,a){return[bE,1,0,0,1,b,a]}function
gv(b,a){return[bE,b,0,0,a,0,0]}function
gw(a){return[bE,Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]}function
eo(b){var
c=b[1],d=b[2],e=b[3],f=b[4],g=b[5],h=b[6],a=c*f-e*d;if(a==0)throw[0,bM,3];return[bE,f/a,-d/a,-e/a,c/a,(e*h-f*g)/a,(d*g-c*h)/a]}function
dF(a){var
b=a[1],c=a[2],d=a[3],e=a[4],l=a[5],m=a[6];return function(a){var
f=a[1],g=a[2],h=a[3],i=a[4],j=a[5],k=a[6];return[bE,b*f+d*g,c*f+e*g,b*h+d*i,c*h+e*i,b*j+d*k+l,c*j+e*k+m]}}function
cD(a){var
c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6];return function(b,a){return[0,c*b+e*a+g,d*b+f*a+h]}}function
gx(a){var
c=a[1],d=a[2],e=a[3],f=a[4];return function(b,a){return[0,c*b+e*a,d*b+f*a]}}function
ep(b,a){var
c=a[2],d=a[3],e=a[4],f=a[5],g=a[6];b[1]=a[1];b[3]=d;b[2]=c;b[4]=e;b[5]=f;b[6]=g;return 0}function
Op(a,c,b){var
e=gv(c,b);return ep(a,d(dF(a),e))}function
Oq(a,c,b){var
e=gu(c,b);return ep(a,d(dF(a),e))}function
Or(a,b){var
c=gw(b);return ep(a,d(dF(a),c))}function
Os(a){return ep(a,eo(a))}var
gy=0;function
gz(b,c){var
a=[0,hy(b),c];function
e(b){if(b){var
c=b[1],d=Qo(a[2][1],c[2][1]),h=b[2],f=c[1],g=a[1],i=0===d?dg(g,f):d;return-1===i?[0,a,b]:[0,c,e(h)]}return[0,a,0]}return e(b)}function
gA(a){return fn(function(a){return a[2]},a)}gA(gz(gy,Ot));function
gB(d,c,b,a){return[0,[0,[0,d,c,b,a]]]}function
gC(c,b,a){return gB(c,b,a,1)}function
Ou(b){var
a=b[1];if(typeof
a!=="number"&&0===a[0])return a[1];throw[0,bM,12]}function
Ov(d,c,b,a){return[0,[1,[0,[0,d,c,b,a],gy]]]}function
Ow(b){var
a=b[1];if(typeof
a!=="number"&&1===a[0])return a[1][1];throw[0,bM,12]}function
Ox(f,e,d,c,b,a){return[0,[2,[0,[0,f,e,d,c,b,a],gy]]]}function
Oy(b){var
a=b[1];if(typeof
a!=="number"&&2===a[0])return a[1][1];throw[0,bM,12]}function
ku(a,c,j,i,h,g){var
k=c?c[1]:0,d=[0,k,j,i,h,g],b=a[1];if(typeof
b==="number")return 0;else
switch(b[0]){case
0:a[1]=0;return 0;case
1:var
e=b[1],l=gz(e[2],d);a[1]=[1,[0,e[1],l]];return 0;default:var
f=b[1],m=gz(f[2],d);a[1]=[2,[0,f[1],m]];return 0}}function
Oz(e,d,c,b,a){return ku(e,d,c,b,a,1)}function
OA(b){var
a=b[1];if(typeof
a!=="number"&&0!==a[0])return hy(a[1][2]);throw[0,bM,12]}function
OB(h,e){var
d=h[1];if(typeof
d!=="number"&&0!==d[0]){var
i=d[1][2];if(0<=e){var
a=i,b=e;for(;;){if(a){var
f=a[2],g=a[1];if(0!==b){var
a=f,b=b-1|0;continue}var
c=g}else
var
c=ap(nq);break}}else
var
c=ah(nr);return c[2]}throw[0,bM,12]}cR(function(b){if(b[1]===bM){switch(b[2]){case
0:var
a=NO;break;case
1:var
a=NP;break;case
2:var
a=NQ;break;case
3:var
a=NR;break;case
4:var
a=NS;break;case
5:var
a=NT;break;case
6:var
a=NU;break;case
7:var
a=NV;break;case
8:var
a=NW;break;case
9:var
a=NX;break;case
10:var
a=NY;break;case
11:var
a=NZ;break;case
12:var
a=N0;break;case
13:var
a=N1;break;case
14:var
a=N2;break;case
15:var
a=N3;break;case
16:var
a=N4;break;case
17:var
a=N5;break;case
18:var
a=N6;break;case
19:var
a=N7;break;case
20:var
a=N8;break;case
21:var
a=N9;break;case
22:var
a=N_;break;case
23:var
a=N$;break;case
24:var
a=Oa;break;case
25:var
a=Ob;break;case
26:var
a=Oc;break;case
27:var
a=Od;break;case
28:var
a=Oe;break;case
29:var
a=Of;break;case
30:var
a=Og;break;case
31:var
a=Oh;break;case
32:var
a=Oi;break;case
33:var
a=Oj;break;case
34:var
a=Ok;break;case
35:var
a=Ol;break;default:var
a=Om}return[0,d(aP(OC),a)]}return 0});function
b4(b){var
a=b[2];return a?a[1]:ap(no)}function
eq(a,c){var
b=a[2],d=b?b[2]:ap(np);a[2]=[0,c,d];return 0}function
bN(a){return b4(a)[1]}function
er(a){return b4(a)[2]}function
kv(a){return b4(a)[4]}function
gD(d,c){var
g=c[2],h=c[1],i=bN(d),e=d[1],a=0===e[1]?1:0,f=a?(e[1]=[0,b(cD(i),h,g)],0):a;return f}function
kw(b){var
a=b[1];a[2]=a[1];return 0}function
kx(d){var
g=bN(d),a=d[1][2];if(a){var
c=a[1],e=c[2],f=c[1];return[0,b(cD(eo(g)),f,e)]}return 0}function
dG(c,a){var
d=a[2],e=a[1],f=bN(c),g=c[1];g[2]=[0,b(cD(f),e,d)];return 0}function
ky(b){b[1].save();var
a=b[2],c=a[2];a[2]=[0,b4(a),c];return 0}function
kz(c){c[1].restore();var
d=c[2],a=d[2];if(a){var
b=a[2];if(b){d[2]=b;return 0}}throw[0,bM,0]}function
gE(c,a){c[1].setTransform(a[1],a[2],a[3],a[4],a[5],a[6]);var
d=c[2],b=b4(d);return eq(d,[0,a,b[2],b[3],b[4]])}function
OE(a){return bN(a[2])}function
es(a,b){return gE(a,d(dF(bN(a[2])),b))}function
OF(c,b,a){return es(c,gv(b,a))}function
OG(c,b,a){return es(c,gu(b,a))}function
OH(b,a){return es(b,gw(a))}function
kA(a){return gE(a,gt(0))}function
OI(d,c,a){return b(cD(eo(bN(d[2]))),c,a)}function
OJ(d,c,a){return b(gx(eo(bN(d[2]))),c,a)}function
OK(d,c,a){return b(cD(bN(d[2])),c,a)}function
OL(d,c,a){return b(gx(bN(d[2])),c,a)}function
dH(e,d,c){var
a=kx(e[2]);if(a){var
b=a[1];return[0,b[1]+d,b[2]+c]}throw[0,bM,2]}function
kB(a,d,c){a[1].moveTo(d,c);var
e=a[2],f=bN(e),g=e[1];g[1]=[0,b(cD(f),d,c)];return kw(a[2])}function
OM(a,d,c){var
b=dH(a,d,c);return kB(a,b[1],b[2])}function
kC(c,b,a){c[1].lineTo(b,a);gD(c[2],[0,b,a]);return dG(c[2],[0,b,a])}function
ON(a,d,c){var
b=dH(a,d,c);return kC(a,b[1],b[2])}function
kD(a,e,d,g,f,c,b){a[1].bezierCurveTo(e,d,g,f,c,b);gD(a[2],[0,e,d]);return dG(a[2],[0,c,b])}function
OO(a,j,i,h,g,f,e){var
b=dH(a,j,i),k=b[2],l=b[1],c=dH(a,h,g),m=c[2],n=c[1],d=dH(a,f,e);return kD(a,l,k,n,m,d[1],d[2])}function
OP(c,b,a,e,d){dG(c[2],[0,b,a]);return c[1].rect(b,a,e,d)}function
kE(g,f,e,d,a,c,b){f[1].arc(e,d,a,c,b,g);gD(f[2],[0,e+a*Math.cos(c),d+a*Math.sin(c)]);return dG(f[2],[0,e+a*Math.cos(b),d+a*Math.sin(b)])}function
OQ(a,b,c,d,e,f){return kE(q8,a,b,c,d,e,f)}function
OR(a,b,c,d,e,f){return kE(q7,a,b,c,d,e,f)}function
OS(c){var
a=kx(c[2]);if(a){var
b=a[1];return[0,b[1],b[2]]}return OT}function
OU(a){a[1].beginPath();a[2][1][1]=0;a[2][1][2]=0;return 0}var
dI=[0,OS,OU,function(a){a[1].closePath();return kw(a[2])}];function
kF(a){return a[1].stroke()}function
OV(a){kF(a);return d(dI[2],a)}function
kG(a){return 0===kv(a[2])?a[1].fill():a[1].fill("evenodd")}function
OW(a){kG(a);return d(dI[2],a)}function
kH(a){return a[1].clip()}function
OX(a){kH(a);return d(dI[2],a)}function
OY(b,a){var
c=b?b[1]:1;ky(a);a[1].globalAlpha=c;kA(a);a[1].fillRect(0,0,a[1].canvas.width,a[1].canvas.height);return kz(a)}function
kI(b,a){return b[1].lineWidth=a}function
OZ(a){return a[1].lineWidth}function
O0(d,a,c){var
e=a?a[1]:0,b=d[1];b.lineDashOffset=e;return b.setLineDash(QC(c))}function
O1(b){var
a=b[1],c=a.lineDashOffset;return[0,QD(a.getLineDash()),c]}function
O2(d,c){var
b=d[2],a=b4(b);return eq(b,[0,a[1],a[2],a[3],c])}function
O3(a){return kv(a[2])}function
O4(c,b){switch(b){case
0:var
a=O5;break;case
1:var
a=O6;break;default:var
a=O7}return c[1].lineCap=a.toString()}function
O8(b){var
a=bk(b[1].lineCap);return at(a,O9)?at(a,O_)?0:2:1}function
O$(c,b){switch(b){case
0:var
a=Pa;break;case
1:var
a=Pb;break;default:var
a=Pc}return c[1].lineJoin=a.toString()}function
Pd(b){var
a=bk(b[1].lineJoin);return at(a,Pe)?at(a,Pf)?0:1:2}function
Pg(b,a){return b[1].miterLimit=a}function
Ph(a){return a[1].miterLimit}function
Pi(c,b){switch(b){case
0:var
a=ap(Pj);break;case
1:var
a=ap(Pk);break;case
2:var
a=Pl;break;case
3:var
a=Pm;break;case
4:var
a=Pn;break;case
5:var
a=Po;break;case
6:var
a=ap(Pp);break;case
7:var
a=Pq;break;case
8:var
a=Pr;break;case
9:var
a=Ps;break;case
10:var
a=Pt;break;case
11:var
a=Pu;break;case
12:var
a=Pv;break;default:var
a=ap(Pw)}return c[1].globalCompositeOperation=a.toString()}function
Px(c){var
a=bk(c[1].globalCompositeOperation),b=m2(a,Py);if(0<=b){if(!(0<b))return 2;if(!at(a,Pz))return 5;if(!at(a,PA))return 3;if(!at(a,PB))return 4;if(!at(a,PC))return 2;if(!at(a,PD))return 11}else{if(!at(a,PF))return 12;if(!at(a,PG))return 10;if(!at(a,PH))return 8;if(!at(a,PI))return 9;if(!at(a,PJ))return 7;if(!at(a,PK))return 12}return ap(d(aP(PE),a))}function
gF(b,r){function
h(b){return a(p+(j*b|0))}function
i(d,c,b,a){var
e=h(b),f=h(c),g=h(d);return B(aP(PL),g,f,e,a).toString()}var
c=r[1],m=b[2],g=b4(m);eq(m,[0,g[1],g[2],c,g[4]]);if(typeof
c==="number")return 0;else
switch(c[0]){case
0:var
e=c[1],n=i(e[1],e[2],e[3],e[4]);b[1].fillStyle=n;return b[1].strokeStyle=n;case
1:var
o=c[1],f=o[1],s=o[2],k=b[1].createLinearGradient(f[1],f[2],f[3],f[4]),t=gA(s);fo(function(a){var
b=a[1];return k.addColorStop(b,i(a[2],a[3],a[4],a[5]))},t);b[1].fillStyle=k;return b[1].strokeStyle=k;default:var
q=c[1],d=q[1],u=q[2],l=b[1].createRadialGradient(d[1],d[2],d[3],d[4],d[5],d[6]),v=gA(u);fo(function(a){var
b=a[1];return l.addColorStop(b,i(a[2],a[3],a[4],a[5]))},v);b[1].fillStyle=l;return b[1].strokeStyle=l}}function
PM(a){return[0,b4(a[2])[3]]}function
PN(d,c,b,a){return gF(d,gC(c,b,a))}function
PO(e,d,c,b,a){return gF(e,gB(d,c,b,a))}function
kJ(d,a){var
e=d[2],f=a[4],g=a[3],h=a[2],i=a[1],b=b4(e);eq(e,[0,b[1],a,b[3],b[4]]);switch(i){case
0:var
c=PP;break;case
1:var
c=PT;break;default:var
c=PU}var
j=0===h?PQ:PS,k=B(aP(PR),c,j,g|0,f).toString();return d[1].font=k}function
PV(c,b,a,d){var
e=b?b[1]:0,f=a?a[1]:0;return kJ(c,[0,e,f,er(c[2])[3],d])}function
PW(b,c){var
a=er(b[2]);return kJ(b,[0,a[1],a[2],c,a[4]])}function
PX(a,b){var
c=d(dI[1],a),e=c[2],f=c[1],g=[0,f+a[1].measureText(b.toString()).width,e];dG(a[2],g);return a[1].fillText(b.toString(),f,e)}function
PY(b){var
a=er(b[2])[3];return[bE,a,a/4,0,2*a,0]}function
PZ(a,c){var
d=er(a[2])[3],b=a[1].measureText(c.toString()).width;return[bE,0,0,b,d,b,0]}var
P0=[0,Oz,ku,OA,OB,gC,gB,Ou,Ov,Ow,Ox,Oy],P1=[0,gt,gu,gv,gw,Oq,Op,Or,Os,dF,gx,cD],P2=function(c){var
j=c[13],e=c[1],g=c[2],k=c[3],l=c[4],m=c[5],n=c[6],o=c[7],q=c[8],r=c[9],s=c[10],t=c[11],u=c[12],v=c[14],x=c[15],y=c[16],z=c[17],A=c[18],C=c[19],D=c[20],E=c[21],F=c[22],G=c[23],H=c[24],I=c[25],J=c[26],K=c[27],M=c[28],N=c[29],P=c[30],Q=c[31],R=c[32],S=c[33],T=c[34],U=c[35],V=c[36],W=c[37],X=c[38],Y=c[39],Z=c[40],_=c[41],$=c[42],aa=c[43],ab=c[44],ac=c[45],ad=c[46],ae=c[47],af=c[48],ag=c[49],ah=c[50],ai=c[51],aj=c[52],ak=c[53],al=c[54],am=c[55],an=c[56],ao=c[57],ap=c[58],f=[0,e,g,k,l,m,n,o,q,r,s,t,u,j,v,x,y,z,A,C,D,E,F,G,H,I,J,K,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,_,$,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,function(l,k,i,h){var
a=h*i,b=3*k/3.14159265358979312,c=a*(1-Math.abs(b%2-1));if(bl(b,1))var
f=a,e=c,d=0;else
if(bl(b,2))var
f=c,e=a,d=0;else
if(bl(b,3))var
f=0,e=a,d=c;else
if(bl(b,4))var
f=0,e=c,d=a;else
if(bl(b,5))var
f=c,e=0,d=a;else
var
f=a,e=0,d=c;var
g=h-a;return B(j,l,f+g,e+g,d+g)}];return[0,f,function(j,K,y,x){function
M(a){return bn(a,DB)}var
z=i(i(i(K,iV),M),hI),e=[0,mT(55,0),0],q=0===z.length-1?[0,0]:z,r=q.length-1,g=0;for(;;){br(e[1],g)[g+1]=g;var
J=g+1|0;if(54!==g){var
g=J;continue}var
n=[0,qC],s=54+bI(55,r)|0,F=0;if(!(s<0)){var
k=F;for(;;){var
l=k%55|0,t=b9(k,r),G=br(q,t)[t+1],o=bx(n[1],a(p+G));n[1]=QF(o,0,w(o));var
m=n[1],A=O(m,3)<<24,C=O(m,2)<<16,D=O(m,1)<<8,E=((O(m,0)+D|0)+C|0)+A|0,H=(br(e[1],l)[l+1]^E)&ex;br(e[1],l)[l+1]=H;var
I=k+1|0;if(s!==k){var
k=I;continue}break}}e[2]=0;var
c=function(a,c){var
b=fy(e);return a+(b/eL+fy(e))/eL*(c-a)},N=c(0,1),P=c(0,1),Q=c(0,6.28318530717958623);B(f[59],j,Q,P,N);b(f[35],0,j);var
R=function(m){var
a=c(0,1),b=c(0,1),e=c(0,1);B(f[13],j,e,b,a);var
g=c(0,x),i=c(0,y);h(f[43],j,i,g);var
k=c(0,x),l=c(0,y);h(f[42],j,l,k);return d(f[36],j)},S=function(b){function
a(c){var
a=c;for(;;){if(a){var
b=a[2];R(a[1]);var
a=b;continue}return 0}}return i(i(b,fS),a)};for(;;){var
u=fy(e),v=u%10|0;if(1073741814<(u-v|0))continue;return i(L(0,0,10+v|0),S)}}}]}([0,bM,Nc,Oo,P1,PV,PW,PX,PY,PZ,P0,ky,kz,PN,PO,gF,PM,O4,O8,O$,Pd,kI,OZ,Pg,Ph,O0,O1,Pi,Px,O2,O3,OX,kH,OW,kG,OY,OV,kF,dI,OQ,OR,kD,kC,kB,OP,OO,ON,OM,OG,OF,OH,es,gE,OE,kA,OK,OL,OI,OJ]);ra(P3,function(a){var
d=a.canvas.getContext(rb),c=gC(0,0,0)[1],b=[0,d,[0,[0,0,0],[0,[0,gt(0),OD,c,0],0]]];kI(b,2);return B(P2[2],b,bk(a.seed),a.width,a.height)});nn(0);return}(function(){return this}()));

},{"constants":4,"fs":3}]},{},[1]);
