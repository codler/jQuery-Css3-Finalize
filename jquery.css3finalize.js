/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2010 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package Css3-Finalize
 * @version 1.15 - 2010-12-01
 * @website https://github.com/codler/jQuery-Css3-Finalize
 *
 * == Description == 
 * Some css3 attributes needs to have a prefix in front 
 * in order to work in different browser. The plugin takes 
 * care of that so you only need to write without the prefix.
 *
 * == Example Usage ==
 * // This will look for all style-tags and parse them.
 * $.cssFinalize('style');
 */
(function ($) {

	$.cssFinalize = function(node, config) {
		var currentPrefix = false;
		if (!config) {
			config = {};
		}
		
		if ($.browser.webkit || $.browser.safari) {
			currentPrefix = 'webkit';
		} else if ($.browser.mozilla) {
			currentPrefix = 'moz'
		} else if ($.browser.msie) {
			// No vendor prefix in ie 7
			if (parseInt($.browser.version.substr(0,1)) <= 7 && !config.shim) {	
				return true;
			}
			currentPrefix = 'ms';
		} else if ($.browser.opera) {
			currentPrefix = 'o';
		}
	
		function customRule(newAttr) {
			return function(attr) {
				return newAttr;
			}
		}
		
		var rules = {
			'animation'				 : ['webkit'],
			'animation-delay'		 : ['webkit'],
			'animation-direction'	 : ['webkit'],
			'animation-duration'	 : ['webkit'],
			'animation-iteration-count' : ['webkit'],
			'animation-name'		 : ['webkit'],
			'animation-timing-function' : ['webkit'],
			
			'backface-visibility' : ['webkit'],
		
			// moz is comment out because the rule lies on "valueRule"
			'background-clip'		 : [/*'moz',*/ 'webkit', 'khtml'],
			'background-origin'		 : [/*'moz',*/ 'webkit', 'khtml'],
			'background-size'		 : ['moz', 'webkit', 'khtml'],
			
			// border image
			'border-image'				: ['moz', 'webkit'],
			'border-top-image'			: ['moz', 'webkit'],
			'border-right-image'		: ['moz', 'webkit'],
			'border-bottom-image'		: ['moz', 'webkit'],
			'border-left-image'			: ['moz', 'webkit'],
			'border-corner-image'		: ['moz', 'webkit'],
			'border-top-left-image'		: ['moz', 'webkit'],
			'border-top-right-image'	: ['moz', 'webkit'],
			'border-bottom-left-image'	: ['moz', 'webkit'],
			'border-bottom-right-image'	: ['moz', 'webkit'],
			
			// border-radius
			'border-radius' 			: ['moz'],
			'border-top-left-radius'	: [customRule('-moz-border-radius-topleft')],
			'border-top-right-radius'	: [customRule('-moz-border-radius-topright')],
			'border-bottom-right-radius': [customRule('-moz-border-radius-bottomright')],
			'border-bottom-left-radius'	: [customRule('-moz-border-radius-bottomleft')],
			
			'box-align'			 : ['moz', 'webkit'],
			'box-direction'		 : ['moz', 'webkit'],
			'box-flex'			 : ['moz', 'webkit'],
			'box-flex-group'	 : ['moz', 'webkit'],
			'box-lines'			 : ['moz', 'webkit'],
			'box-ordinal-group'	 : ['moz', 'webkit'],
			'box-orient'		 : ['moz', 'webkit'],
			'box-pack'			 : ['moz', 'webkit'],
			'box-shadow'		 : ['moz', 'webkit'],
			'box-sizing'		 : ['moz', 'webkit'],
			'column-count'		 : ['moz', 'webkit'],
			'column-gap'		 : ['moz', 'webkit'],
			'column-rule'		 : ['moz', 'webkit'],
			'column-rule-color'	 : ['moz', 'webkit'],
			'column-rule-style'	 : ['moz', 'webkit'],
			'column-rule-width'	 : ['moz', 'webkit'],
			'column-width'		 : ['moz', 'webkit'],
			'columns'			 : ['webkit'],
			'marquee'			 : ['webkit'],
			'marquee-direction'	 : ['webkit'],
			'marquee-speed'		 : ['webkit'],
			'marquee-style'		 : ['webkit'],
			'perspective'		 : ['webkit'],
			'perspective-origin' : ['webkit'],
			'tab-size'			 : ['moz', 'o'],
			'text-overflow'		 : ['o'],
			'text-size-adjust'	 : ['webkit', 'ms'],
			'transform'			 : ['moz', 'webkit', 'o', 'ms'],
			'transform-origin'	 : ['moz', 'webkit', 'o', 'ms'],
			'transform-style'	 : ['webkit'],
			'transition'		 : ['moz', 'webkit', 'o'],
			'transition-delay'	 : ['moz', 'webkit', 'o'],
			'transition-duration' : ['moz', 'webkit', 'o'],
			'transition-property' : ['moz', 'webkit', 'o'],
			'transition-timing-function' : ['moz', 'webkit', 'o'],
			'user-modify'		 : ['moz', 'webkit', 'khtml'],
			'user-select'		 : ['moz', 'webkit', 'khtml']
		}
	
		function cssObjToText(obj) {
			var text = '';
			$.each(obj, function(i, block) {
				text += block.selector + '{';
				if ($.isArray(block.attributes)) {
					text += cssObjToText(block.attributes);
				} else {
					$.each(block.attributes, function(property, value) {
						text += property + ':' + value + ';';
					});
				}
				text += '}';
			});
			return text;
		}
		
		function cssTextAttributeToObj(text) {
			var attribute = text.split(/(:[^;]*;?)/);
			attribute.pop();
			var objAttribute = {};
			$.map(attribute, function(n, i) {
				if (i % 2 == 1) {
					objAttribute[$.trim(attribute[i-1])] = $.trim(n.substr(1).replace(';', ''));
				}
			});
			return objAttribute;
		}
		
		function cssTextToObj(text) {
			var block = text.split(/({[^{}]*})/);
			// fixes recursive block at end
			if (block[block.length-1].indexOf('}') == -1) {
				block.pop();
			}
			var objCss = [];
			var recusiveBlock = false;
			var t;
			var tt = 0;
			var ttt;
			var i = 0;
			while(i < block.length) {
				if (i % 2 == 0) {
					var selector = $.trim(block[i]);
					if (recusiveBlock) {
						if (selector.indexOf('}') != -1) {
							selector = selector.substr(1);
							block[i] = selector;
							
							ttt = block.splice(tt, i - tt);
							ttt.shift()
							ttt.unshift(t[1]);
							objCss[objCss.length-1].attributes = cssTextToObj(ttt.join(''));
							recusiveBlock = false;
							i = tt;
							continue;
						}
					} else {
						
						if (selector.indexOf('{') != -1) {
							t = selector.split('{');
							selector = $.trim(t[0]);
							recusiveBlock = true;
							tt = i;
						}
						if (selector != "") {
							objCss.push({'selector': selector});
						}
					}
				} else {
					if (!recusiveBlock) {
						objCss[objCss.length-1].attributes = cssTextAttributeToObj(block[i].substr(1, block[i].length-2));
					}
				}
				i++;
			}
			return objCss;
		}
		
		function cleanCss(css) {
			// strip multiline comment
			css = css.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g, '');
			
			// remove newline
			css = css.replace(/\n/g, '');
			css = css.replace(/\r/g, '');
			
			// remove @import - Future TODO read if css was imported and parse it.
			css = css.replace(/\@import[^;]*;/g, '');
			
			return css;
		}
		
		function findNeededAttributes(attributes) {
			// attributes is an array only if it is recursive blocks. skip those attributes.
			if ($.isArray(attributes)) return {};
			var newAttributes = {};
			$.each(attributes, function(property, value) {
				// Property Rules
				var newProperty = propertyRules(property);
				if (newProperty) {
					newAttributes[newProperty] = value;
				}
				
				// Value Rules
				var newValue = valuesRules(property, value);
				if (newValue) {
					newAttributes[property] = newValue;
				}
			});
			
			return newAttributes;
		}
		
		function propertyRules(property) {
			if (property in rules) {
				for (prefix in rules[property]) {
					if ($.isFunction(rules[property][prefix])) {
						return rules[property][prefix](property);
					} else {
						if (currentPrefix == rules[property][prefix] || !currentPrefix) {
							return '-' + rules[property][prefix] + '-' + property;
						}
					}
				}
			}
			
			return false;
		}
		
		function valuesRules(property, value) {
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// calc
				if (value.indexOf('calc') == 0) {
					return '-moz-' + value;
				}
				
				// only for version 3.6 or lower
				if (parseInt($.browser.version.substr(0,1)) < 4) {
					// background-clip or background-origin
					if (property == 'background-clip' || 
						property == 'background-origin') {
						if (value == 'padding-box') {
							return 'padding';
						} else if (value == 'border-box') {
							return 'border';
						} else if (value == 'content-box') {
							return 'content';
						}							
					}
				}
			}
			
			if (config.shim) {
				// Only apply for ie
				if (currentPrefix == 'ms') {
					// only for version 7 or lower
					if (parseInt($.browser.version.substr(0,1)) <= 7) {
						if (property.toUpperCase() == 'DISPLAY' && value == 'inline-block') {
							return 'inline';
						}
					}
				}
			}
			
			// TODO : Match background-image: linear-gradient()
			
			
			return false;
		}
		
		function selectorRules(selector) {
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// ::selection
				//if (selector.indexOf('::selection') != -1) {
					selector = selector.replace('::selection', '::-moz-selection');
				//}
			} else if(currentPrefix == 'webkit') {
				selector = selector.replace('@keyframes', '@-webkit-keyframes');
			}
			return selector;
		}
		
		function parseFinalize(element, cssText) {
			cssText = cleanCss(cssText);
			if ($.trim(cssText) == '') return;
			var objCss = cssTextToObj(cssText);
			var cssFinalize = [];
			// Look for needed attributes and add to cssFinalize
			$.each(objCss, function (i, block) {
				if (block.attributes) {
					var neededAttributes = findNeededAttributes(block.attributes);
					if (!$.isEmptyObject(neededAttributes)) {
						cssFinalize.push({
										// Selector Rules
							'selector': selectorRules(block.selector),
							'attributes' : neededAttributes
						});
					} else if (selectorRules(block.selector) != block.selector) {
						cssFinalize.push({
										// Selector Rules
							'selector': selectorRules(block.selector),
							'attributes' : block.attributes
						});
					}
				}
			});

			element.addClass('css-finalize-read');
			if (cssFinalize.length > 0) {
				appendStyle(element, cssFinalize);
			}
		}
	
	
		if (!(node instanceof jQuery)) {
			node = $(node);
		}
		
		node.each(function(index, element) {
			var $this = $(this);
			if ($this.hasClass('css-finalize-read') || $this.hasClass('css-finalized')) {
				return true;
			}
			// link-tags
			if (this.tagName == 'LINK' && $this.attr('rel') == 'stylesheet') {
				try {
					$('<div />').load(this.href, function(data) {
						parseFinalize($this, data);
					});
				} catch(e){}
			} else {
				parseFinalize($this, $this.html());
			}
		});
		
		function appendStyle(element, cssObj) {
			element.after('<style class="css-finalized">' + cssObjToText(cssObj) + '</style>');
		}
		
		// Experimental - css hooks - require jquery 1.4.3+
		//if ($().jquery.replace(/\./g, '') >= 143) {
		if ($.cssHooks) {
			for (property in rules) {
				//if ($.inArray(currentPrefix, rules[property])!== -1) {
				if ((newProperty = propertyRules(property)) !== false) {
					setCssHook(property, newProperty);
				}
			}
		}
		
		function setCssHook(property, newProperty) {
			$.cssHooks[$.camelCase(property)] = {
				get: function( elem, computed, extra ) {
					return elem.style[$.camelCase(newProperty)];
				},
				set: function( elem, value ) {
					elem.style[$.camelCase(newProperty)] = value;
				}
			}
		}
	}
	$(function() {
		// Let user decide to parse on load or not.
		if (window.cssFinalize!==false) {
			$.cssFinalize('style, link');
		}
	});
})(jQuery);



/* Cross-Browser Split 1.0.1
(c) Steven Levithan <stevenlevithan.com>; MIT License
An ECMA-compliant, uniform cross-browser split method */

var cbSplit;

// avoid running twice, which would break `cbSplit._nativeSplit`'s reference to the native `split`
if (!cbSplit) {

cbSplit = function (str, separator, limit) {
    // if `separator` is not a regex, use the native `split`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
        return cbSplit._nativeSplit.call(str, separator, limit);
    }

    var output = [],
        lastLastIndex = 0,
        flags = (separator.ignoreCase ? "i" : "") +
                (separator.multiline  ? "m" : "") +
                (separator.sticky     ? "y" : ""),
        separator = RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
        separator2, match, lastIndex, lastLength;

    str = str + ""; // type conversion
    if (!cbSplit._compliantExecNpcg) {
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
    }

    /* behavior for `limit`: if it's...
    - `undefined`: no limit.
    - `NaN` or zero: return an empty array.
    - a positive number: use `Math.floor(limit)`.
    - a negative number: no limit.
    - other: type-convert, then use the above rules. */
    if (limit === undefined || +limit < 0) {
        limit = Infinity;
    } else {
        limit = Math.floor(+limit);
        if (!limit) {
            return [];
        }
    }

    while (match = separator.exec(str)) {
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

        if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));

            // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
            if (!cbSplit._compliantExecNpcg && match.length > 1) {
                match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined) {
                            match[i] = undefined;
                        }
                    }
                });
            }

            if (match.length > 1 && match.index < str.length) {
                Array.prototype.push.apply(output, match.slice(1));
            }

            lastLength = match[0].length;
            lastLastIndex = lastIndex;

            if (output.length >= limit) {
                break;
            }
        }

        if (separator.lastIndex === match.index) {
            separator.lastIndex++; // avoid an infinite loop
        }
    }

    if (lastLastIndex === str.length) {
        if (lastLength || !separator.test("")) {
            output.push("");
        }
    } else {
        output.push(str.slice(lastLastIndex));
    }

    return output.length > limit ? output.slice(0, limit) : output;
};

cbSplit._compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
cbSplit._nativeSplit = String.prototype.split;

} // end `if (!cbSplit)`

// for convenience...
String.prototype.split = function (separator, limit) {
    return cbSplit(this, separator, limit);
};