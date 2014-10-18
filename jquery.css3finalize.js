/*! CSS.supports() Polyfill
* https://gist.github.com/codler/03a0995195aa2859465f
* Copyright (c) 2014 Han Lin Yap http://yap.nu; MIT license */
if (!('CSS' in window)) {
	window.CSS = {};
}
 
if (!('supports' in window.CSS)) {
	window.CSS._cacheSupports = {};
	window.CSS.supports = function(propertyName, value) {
		var key = [propertyName, value].toString();
		if (key in window.CSS._cacheSupports) {
			return window.CSS._cacheSupports[key];
		}
 
		function cssSupports(propertyName, value) {
			var style = document.createElement('div').style;
 
			// 1 argument
			if (typeof value == 'undefined') {
				function mergeOdd(propertyName, reg) {
					var arr = propertyName.split(reg);
 
					if (arr.length > 1) {
						return arr.map(function(value, index, arr) {
							return (index % 2 == 0) ? value + arr[index+1] : '';
						}).filter(Boolean);
					}
				}
 
				// The regex will do this '( a:b ) or ( c:d )' => ["( a:b ", ")", "(", " c:d )"]
				var arrOr = mergeOdd(propertyName, /([)])\s*or\s*([(])/gi);
				if (arrOr) {
					return arrOr.some(function(supportsCondition) { return window.CSS.supports(supportsCondition); });
				}
				var arrAnd = mergeOdd(propertyName, /([)])\s*and\s*([(])/gi);
				if (arrAnd) {
					return arrAnd.every(function(supportsCondition) { return window.CSS.supports(supportsCondition); });
				}
 
				// Remove the first and last parentheses
				style.cssText = propertyName.replace('(','').replace(/[)]$/, '');
			// 2 arguments
			} else {
				style.cssText = propertyName + ':' + value;
			}
 
			return !!style.length;
		}
 
		return window.CSS._cacheSupports[key] = cssSupports(propertyName, value);
	};
}
/*! CSS3 Finalize - v4.1.0 - 2014-10-18 - Automatically add vendor prefixes. 
* https://github.com/codler/jQuery-Css3-Finalize
* Copyright (c) 2014 Han Lin Yap http://yap.nu; MIT license */
(function ($) {
	'use strict';

	// Prevent to read twice
	if ($.cssFinalize) {
		return;
	}

	$.cssFinalizeSetup = {
		// Which node CSS3 Finalize should read and add vendor prefixes
		node : 'style,link',
		// If it should add the vendor prefixes
		append : true,
		// This will be called for each nodes after vendor prefixes have been appended
		callback : function(css) {}
	};

	$.fn.cssFinalize = function(options) {
		if (!options || typeof options != 'object') {
			options = {};
		}
		options.node = this;
		$.cssFinalize(options);
		return this;
	};
	
	$.cssFinalize = function(options) {
		if (document.documentMode && document.documentMode <= 9) {
			return true;
		}

		var div = document.createElement('div');
		div.style.cssText = 'background-image:linear-gradient(#9f9, white);';

		options = $.extend({}, $.cssFinalizeSetup, options);
		
		var deCamelCase = function(str) {
			return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
		}
		
		// PropertyRules
		var supportRules = [];

		// Get current vendor prefix
		var currentPrefix;
		var styles = window.getComputedStyle(document.documentElement, null);

		for(var i = 0; i < styles.length ; i++) {
			if (styles[i].charAt(0) === '-') {
				var pos = styles[i].indexOf('-',1);
				supportRules.push(styles[i].substr(pos+1));

				currentPrefix = styles[i].substr(1, pos-1);
			}
		}

		// IE10 do have flex but the code above didnt detect it so I added manually
		if (currentPrefix == 'ms' && supportRules.indexOf('flex') === -1) {
			supportRules.push('flex');
		} else if (currentPrefix == 'webkit') {
			for (var i in div.style) {
				if (i.indexOf('webkit') === 0) {
					var style = deCamelCase(i);
					if ($.inArray(style.substr(7), supportRules) === -1) {
						supportRules.push(style.substr(7));
					}
				}
			}
		}
		
		function cssCamelCase(css) {
			var s = $.camelCase(css);
			return (currentPrefix == 'ms') ? s.charAt(0).toLowerCase() + s.substr(1) : s;
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
		
		function appendStyle(element, cssObj) {
			element.after('<style class="css-finalized" ' + ((element.attr('media') && element.attr('media').length > 0) ? 'media="'+element.attr('media')+'"' : '') + '>' + $.cssFinalize.cssObjToText(cssObj) + '</style>');
		}
		
		function parseFinalize(element, cssText) {
			cssText = cleanCss(cssText);
			if ($.trim(cssText) === '') {
				return;
			}
			
			var objCss = cssTextToObj(cssText);
			
			var cssFinalize = [];
			cssFinalize = addNeededAttributes(objCss);
			function addNeededAttributes(objCss) {
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
						} else if (supportsRule(block.selector)) {
							cssFinalize = cssFinalize.concat(findNeededAttributes(block.attributes, true));
						} else if (selectorRules(block.selector) != block.selector) {
							cssFinalize.push({
											// Selector Rules
								'selector': selectorRules(block.selector),
								'attributes' : findNeededAttributes(block.attributes, true)
							});
						
						// Recursive
						} else if ((neededAttributes = addNeededAttributes(block.attributes)) && neededAttributes.length > 0) {
							cssFinalize.push({
								'selector': block.selector,
								'attributes' : neededAttributes
							});
						}
					}
				});
				return cssFinalize;
			}

			// Mark as read
			element.addClass('css-finalize-read');
			
			// Append the prefixes
			if (cssFinalize.length > 0 && options.append) {
				appendStyle(element, cssFinalize);
			}
			
			// Callback to user
			if ($.isFunction(options.callback)) {
				options.callback.call(element, cssFinalize);
			}
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
				if (i % 2 === 0) {
					var selector = $.trim(block[i]);
					if (recusiveBlock) {
						if (selector.indexOf('}') != -1) {
							selector = selector.substr(1);
							block[i] = selector;
							
							ttt = block.splice(tt, i - tt);
							ttt.shift();
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
						if (selector !== "") {
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
		
		function cssTextAttributeToObj(text) {
			// Data URI fix
			var attribute;
			text = text.replace( /url\(([^)]+)\)/g, function(url){
				return url.replace( /;/g, '[cssFinalize]' );
			});
			attribute = text.split(/(:[^;]*;?)/);
				
			attribute.pop();
			var objAttribute = {};
			$.map(attribute, function(n, i) {
				if (i % 2 == 1) {
					objAttribute[$.trim(attribute[i-1])] = $.trim(n.substr(1).replace(';', '').replace( /url\(([^)]+)\)/g, function(url){
						return url.replace( /\[cssFinalize\]/g, ';' );
					}));
				}
			});
			return objAttribute;
		}
		
		function findNeededAttributes(attributes, returnAll) {
			// attributes is an array only if it is recursive blocks. skip those attributes.
			if ($.isArray(attributes)) {
				if (returnAll) {
					return $.map(attributes, function (n, i) {
						return {
							'selector' : n.selector, 
							'attributes' : findNeededAttributes(n.attributes, returnAll)
						}
					});
				} else {
					return {};
				}
			}
			var newAttributes = {};
			$.each(attributes, function(property, value) {
				var isset = false;
				// Property Rules
				var newProperty = propertyRules(property);
				if (newProperty) {
					isset = true;
					newAttributes[newProperty] = value;
				}
				
				// Value Rules
				var newValue = valuesRules(property, value, newProperty);
				if (newValue) {
					isset = true;
					newAttributes[(newProperty) ? newProperty : property] = newValue;
				}
				
				// PropertyValue Rules
				var newPropertyValue = propertyValuesRules(property, value);
				if (newPropertyValue) {
					isset = true;
					$.each(newPropertyValue, function(key, value) {
						if (key == 'filter' && newAttributes[key]) {
							newAttributes[key] += ' ' + value;
						} else {
							newAttributes[key] = value;
						}
					});
				}
				
				if (returnAll && !isset) {
					newAttributes[property] = value;
				}
			});
			
			return newAttributes;
		}
		
		function propertyRules(property) {
			if ($.inArray(property, supportRules) > -1) {
				// Checks if the property exists in style
				if (!(cssCamelCase(property) in div.style)) {
					// Checks if vendor prefix property exists in style
					if (cssCamelCase('-' + currentPrefix + '-' + property) in div.style) {
						return '-' + currentPrefix + '-' + property;
					}
				}
			}
			return false;
		}
		
		function valuesRules(property, value, newProperty) {
			newProperty = newProperty || property;
			
			if (property == 'transition' ||
				property == 'transition-property') {
				var keys = value.split(/\s?,\s?/);
				var newValue = [];
				$.each(keys, function(keyProperty) {
					var v, t;
					if (property == 'transition') {
						v = keys[keyProperty].split(' ')[0];
					} else {
						v = keys[keyProperty];
					}
					if ((t = propertyRules(v)) !== false) {
						newValue.push(t + keys[keyProperty].substr(v.length));
					} else {
						newValue.push(keys[keyProperty]);
					}
				});
				
				return newValue.join(',');
			}
			
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// element - CSS4
				if (value.indexOf('element') === 0) {
					return '-moz-' + value;
				}
			}
			
			if (property == 'display') {
				if (!('flexBasis' in div.style)) {
					// Only for IE10
					if (currentPrefix == 'ms') {
						if (value.indexOf('flex') === 0) {
							return '-ms-flexbox';
						} else if (value.indexOf('inline-flex') === 0) {
							return '-ms-inline-flexbox';
						}
					}
				
					if (value.indexOf('flex') === 0 ||
						value.indexOf('inline-flex') === 0) {
						return '-' + currentPrefix + '-' + value;
					}
				}

				if (value.indexOf('grid') === 0 ||
					value.indexOf('inline-grid') === 0) {
					return '-' + currentPrefix + '-' + value;
				}
			}
			
			return false;
		}
		
		// return { property : value }
		function propertyValuesRules(property, value) {
			// Flex for IE10
			if (currentPrefix == 'ms' && !('flexBasis' in div.style)) {
				if (property == 'justify-content' ||
					property == 'align-content' ||
					property == 'align-items' ||
					property == 'align-self') {
					var newValue = value;

					if (value == 'space-between') {
						newValue = 'justify';
					} else if (value == 'space-around') {
						newValue = 'distribute';
					} else if (value == 'flex-start') {
						newValue = 'start';
					} else if (value == 'flex-end') {
						newValue = 'end';
					}

					if (property == 'justify-content') {
						return {
							'-ms-flex-pack': newValue
						};
					} else if (property == 'align-content') {
						return {
							'-ms-flex-line-pack': newValue
						};
					} else if (property == 'align-items') {
						return {
							'-ms-flex-align': newValue
						};
					} else if (property == 'align-self') {
						return {
							'-ms-flex-item-align': newValue
						};
					}
				}

				if (property == 'order') {
					return {
						'-ms-flex-order': value
					}
				}

				if (property == 'flex-wrap') {
					var newValue = value;

					if (value == 'nowrap') {
						newValue = 'none';
					}

					return {
						'-ms-flex-wrap': newValue
					}
				}

			}

			return false;
		}
		
		function selectorRules(selector) {
			switch (currentPrefix) {
				case 'moz' :
					// ::selection
					selector = selector.replace('::selection', '::-moz-selection');
					
					// :input-placeholder
					selector = selector.replace(':input-placeholder', '::-moz-placeholder');
				break;
				case 'webkit' :
					// @keyframes
					selector = selector.replace('@keyframes', '@-webkit-keyframes');
					
					// :input-placeholder
					selector = selector.replace(':input-placeholder', '::-webkit-input-placeholder');
				break;
				case 'ms' :
					// :input-placeholder
					selector = selector.replace(':input-placeholder', ':-ms-input-placeholder');
					
					// @viewport
					selector = selector.replace('@viewport', '@-ms-viewport');
				break;
			}
			return selector;
		}

		function supportsRule(selector) {
			// Only polyfill @support if CSS.supports() are polyfilled 
			if (!!window.CSS._cacheSupports) {
				if (selector.indexOf('@supports') == 0) {
					return CSS.supports(selector.substring('@supports'.length));
				}
			}
		}
		
		if (!(options.node instanceof jQuery)) {
			options.node = $(options.node);
		}
		
		options.node.each(function(index, element) {
			var $this = $(this);
			if ($this.hasClass('css-finalize-read') || $this.hasClass('css-finalized')) {
				return true;
			}
			// link-tags
			if (this.tagName == 'LINK' && $this.attr('rel') == 'stylesheet') {
				load(this.href, $this);
			} else if(this.tagName == 'TEXTAREA') {
				parseFinalize($this, $this.val());
			} else {
				parseFinalize($this, $this.html());
			}
		});
		
		function load(url, element) {
			var loc = document.location,
				protocol = loc.protocol || "http:";
			var parts = /^(\w+:)\/\/([^\/?#:]+)(?::(\d+))?/.exec( url.toLowerCase() );
			var crossDomain = !!( parts &&
				( parts[ 1 ] != protocol || parts[ 2 ] != loc.hostname ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( loc.port || ( protocol === "http:" ? 80 : 443 ) ) )
			);

			if (crossDomain) {
				return;
			}
			try {
				$('<div />').load(url, function(data) {
					if (data) {
						parseFinalize(element, data);
					}
				});
			} catch(e){}
		}

		var valueRules = 'background background-image transition transition-property'.split(' ');
		$.each(valueRules, function(property) {
			if ($.inArray(valueRules[property], supportRules) === -1) {
				setCssHook(valueRules[property], valueRules[property]);
			}
		});
		
		function setCssHook(property, newProperty) {
			newProperty = cssCamelCase(newProperty);
			$.cssHooks[cssCamelCase(property)] = {
				get: function( elem, computed, extra ) {
					if (!computed) {
						return elem.style[newProperty];
					}
				},
				set: function( elem, value ) {
					var newValue = valuesRules(property, value, newProperty);
					try {
						elem.style[newProperty] = (newValue) ? newValue : value;
					} catch (e) {}

					var newPropertyValue = propertyValuesRules(property, value)
					if (newPropertyValue) {
						$.each(newPropertyValue, function(key, value) {
							try {
								if (key == 'filter' && elem.style[key]) {
									elem.style[key] += ' ' + value;
								} else {
									elem.style[key] = value;
								}
							} catch (e) {}
						});
					}
				}
			};
		}
		
	};
	
	$.cssFinalize.cssObjToText = function(obj, prettyfy, indentLevel) {
		var text = '';
		prettyfy = prettyfy || false;
		indentLevel = indentLevel || 1; 
		$.each(obj, function(i, block) {
			if (prettyfy) text += Array(indentLevel).join('  ');
			text += block.selector + '{';
			if ($.isArray(block.attributes)) {
				if (prettyfy) text += '\r\n' + Array(indentLevel).join('  ');
				text += $.cssFinalize.cssObjToText(block.attributes, prettyfy, indentLevel+1);
			} else {
				$.each(block.attributes, function(property, value) {
					if (prettyfy) text += '\r\n' + Array(indentLevel + 1).join('  ');
					text += property + ':' + value + ';';
				});
				if (prettyfy) text += '\r\n' + Array(indentLevel).join('  ');
			}
			text += '}';
			if (prettyfy) text += '\r\n';
		});
		return text;
	}
	
	$(function() {
		// Let user decide to parse on load or not.
		if (window.cssFinalize!==false) {
			$.cssFinalize();
		}
	});
})(jQuery);