/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2012 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package Css3-Finalize
 * @version 2.2 - 2012-02-09
 * @website https://github.com/codler/jQuery-Css3-Finalize
 *
 * == Description == 
 * With this plugin you can write CSS without the vendor prefixes.
 *
 * == Example Usage ==
 * $('style').cssFinalize(); // parse all style-tags
 */
(function ($) {
	// Prevent to read twice
	if ($.cssFinalize){
		return;
	}

	$.cssFinalizeSetup = {
		shim : true,
		node : 'style,link',
		checkMedia : true,
		append : true,
		callback : function() {}
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
		var div = document.createElement('div');
		
		options = $.extend({}, $.cssFinalizeSetup, options);
		
		// Check if browser support matchMedia
		options.checkMedia = !!(options.checkMedia && window.matchMedia);
		
		// PropertyRules
		var supportRules = [];

		// Get current vendor prefix
		var currentPrefix;
		if (window.getComputedStyle) {
			var styles = getComputedStyle(document.documentElement, null);

			if (styles.length) {
				for(var i = 0; i < styles.length ; i++) {
					if (styles[i].charAt(0) === '-') {
						var pos = styles[i].indexOf('-',1);
						supportRules.push(styles[i].substr(pos+1));

						currentPrefix = styles[i].substr(1, pos-1);
					}
				}
			} else {
				var deCamelCase = function(str) {
					return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
				}
				for(var i in styles) {
					var style = deCamelCase(i);
					if (style.indexOf('-o-') === 0) {
						supportRules.push(style.substr(3));
					}
				}
				currentPrefix = 'o';
			}
		} else {
			// No vendor prefix in ie 8
			if (!options.shim) {
				return true;
			}
			currentPrefix = 'ms';
		}

		if (currentPrefix == 'ms') {
			supportRules.push('transform');
			supportRules.push('transform-origin');
			
		}		
		supportRules.push('transition');
		supportRules.push('transition-property');
	
		function customRule(prefix, newAttr) {
			return function(attr) {
				return (currentPrefix == prefix) ? newAttr : false;
			};
		}
		

		var rules = {};
		// only for version 3.6 or lower
		if (parseInt($.browser.version.substr(0,1)) < 2) {
			rules = {
				// border-radius
				//'border-radius' 			: ['moz'],
				'border-top-left-radius'	: [customRule('moz', '-moz-border-radius-topleft')],
				'border-top-right-radius'	: [customRule('moz', '-moz-border-radius-topright')],
				'border-bottom-right-radius': [customRule('moz', '-moz-border-radius-bottomright')],
				'border-bottom-left-radius'	: [customRule('moz', '-moz-border-radius-bottomleft')]
			};
		}
		function cssCamelCase(css) {
			var s = $.camelCase(css);
			return (currentPrefix == 'ms') ? s[0].toLowerCase() + s.substr(1) : s;
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
		
		function ieSplit(str, separator) {
			var match = str.match(RegExp(separator, 'g'));
			var notmatch = str.replace(new RegExp(separator, 'g'), '[|]').split('[|]');
			var merge = [];
			for(i in notmatch) {
				merge.push(notmatch[i]);
				if (match && match[i]) {
					merge.push(match[i]);
				}
			}
			return merge;
		}
		
		function appendStyle(element, cssObj) {
			
			if (currentPrefix == 'ms' && $.browser.version <= 7) {
				var style = $('<style class="css-finalized" ' + ((element.attr('media') && element.attr('media').length > 0) ? 'media="'+element.attr('media')+'"' : '') + '/>');
				$('head:first').append(style);
				//element.after(style);
				style[0].styleSheet.cssText = $.cssFinalize.cssObjToText(cssObj);
			} else {
				element.after('<style class="css-finalized" ' + ((element.attr('media') && element.attr('media').length > 0) ? 'media="'+element.attr('media')+'"' : '') + '>' + $.cssFinalize.cssObjToText(cssObj) + '</style>');
			}
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
						} else if (selectorRules(block.selector) != block.selector) {
							cssFinalize.push({
											// Selector Rules
								'selector': selectorRules(block.selector),
								'attributes' : findNeededAttributes(block.attributes, true)
							});
						
						// @media
						} else if (!options.checkMedia || (options.checkMedia && 
							block.selector.indexOf('@media') === 0 && 
							matchMedia(block.selector.substr(7)).matches)) {
							
							cssFinalize.push({
								'selector': block.selector,
								'attributes' : addNeededAttributes(block.attributes)
							});
						}
					}
				});
				return cssFinalize;
			}

			element.addClass('css-finalize-read');
			if (cssFinalize.length > 0 && options.append) {
				appendStyle(element, cssFinalize);
			}
			if ($.isFunction(options.callback)) {
				options.callback.call(element, cssFinalize);
			}
		}
		
		function cssTextToObj(text) {
			var block;
			if (currentPrefix == 'ms' && $.browser.version <= 8) {
				block = ieSplit(text, '({[^{}]*})');
			} else {
				block = text.split(/({[^{}]*})/);
			}
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
			if (currentPrefix == 'ms' && $.browser.version <= 8) {
				attribute = ieSplit(text, '(:[^;]*;?)');
			} else {
				attribute = text.split(/(:[^;]*;?)/);
			}
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
			if (property in rules) {
				for (prefix in rules[property]) {
					if ($.isFunction(rules[property][prefix])) {
						var found = rules[property][prefix](property);
						if (found) {
							return found;
						}
					} else {
						if (currentPrefix == rules[property][prefix] || !currentPrefix) {
							return '-' + rules[property][prefix] + '-' + property;
						}
					}
				}
			}
			
			if ($.inArray(property, supportRules) > -1) {
				// Checks if the property exists in style
				if (!(cssCamelCase(property) in div.style) || property == 'mask') {
					// Checks if vendor prefix property exists in style
					// is this needed?
					if (cssCamelCase('-' + currentPrefix + '-' + property) in div.style) {
						return '-' + currentPrefix + '-' + property;
					} /*else if (property in rules) {
						for (prefix in rules[property]) {
							var found = rules[property][prefix](property);
							if (found) {
								return found;
							}
						}
					}*/
				}
			}
			
			return false;
		}
		
		function valuesRules(property, value, newProperty) {
			newProperty = newProperty || property;
			if (property == 'background-clip' || 
				property == 'background-origin') {
				// value can be padding-box/border-box/content-box
				div.style.cssText = newProperty + ':' + value;
				if (div.style[cssCamelCase(newProperty)] !== undefined && ''+div.style[cssCamelCase(newProperty)].indexOf(value) == -1) {
					return value.split('-')[0];
				}
			}
			
			if (property == 'transition' ||
				property == 'transition-property') {
				var keys = value.split(/\s?,\s?/);
				var newValue = [];
				for (var keyProperty in keys) {
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
				}
				
				return newValue.join(',');
			}
			
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// calc
				if (value.indexOf('calc') === 0) {
					return '-moz-' + value;
				}
				// element
				if (value.indexOf('element') === 0) {
					return '-moz-' + value;
				}
			}
			
			if (property == 'display') {
				if (value.indexOf('box') === 0 ||
					value.indexOf('flexbox') === 0 ||
					value.indexOf('inline-flexbox') === 0) {
					return '-' + currentPrefix + '-' + value;
				}
			}
			
			var da;
			// // TODO : more advanced background-image: linear-gradient()
			if (property == 'background' ||
				property == 'background-image') {
				if (value.indexOf('linear-gradient') === 0) {
					if (currentPrefix == 'webkit') {
						da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
						if (da.length == 2) {
							return '-webkit-gradient(linear, 0% 0%, 0% 100%, from(' + da[0] + '), to(' + da[1] + '))';
						}
						var middle = "";
						if (da.length >= 3) {
							var position = "0% 0%, 0% 100%";
							if(da[0] === "left"){
								position = "0% 0%, 100% 0%";
							}
							if(da.length > 3){
								var middleArray = da.slice(2, da.length -1);
								$.each(middleArray, function(i, item){
									var split = item.split(/ /);
									if(split.length === 2){
										middle += 'color-stop('+split[1]+', '+split[0]+'),';
									}
								});
							}
							return '-webkit-gradient(linear, '+position+', from(' + da[1] + '), '+middle+' to(' + da[da.length -1 ] + '))';
						}
					} 
					// Only for IE9 - border-radius + gradient bug
					// http://stackoverflow.com/questions/4692686/ie9-border-radius-and-background-gradient-bleeding
					 else if (currentPrefix == 'ms' && $.browser.version == 9) {
						da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
						if (da.length == 2) {
							var g = '<svg xmlns="http://www.w3.org/2000/svg" version="1.0"><defs><linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" style="stop-color: ' + da[0] + ';"/><stop offset="100%" style="stop-color: ' + da[1] + ';"/></linearGradient></defs><rect x="0" y="0" fill="url(#gradient)" width="100%" height="100%" /></svg>';
							return 'url(data:image/svg+xml,' + escape(g) + ')';
						}
					} 
					return '-' + currentPrefix + '-' + value;
				} else if (value.indexOf('radial-gradient') === 0) {
					return '-' + currentPrefix + '-' + value;
				}
			}
			
			return false;
		}
		
		function propertyValuesRules(property, value) {
			if (options.shim) {
				// Only apply for ie
				if (currentPrefix == 'ms') {
					// only for version 8 and lower
					if ($.browser.version <= 8) {
						// Opacity
						if (property.toUpperCase() == 'OPACITY' && !$.support.opacity && !isNaN(value)) {
							return {
								'filter' : 'alpha(opacity=' + value * 100 + ')',
								'zoom' : 1
							};
						}

						// background-color alpha color
						if (property.toUpperCase() === 'BACKGROUND-COLOR' && value.indexOf('rgba') === 0) {
							value = ac2ah(value);
							return {
								// Transparency + click bug
								// http://haslayout.net/css/No-Transparency-Click-Bug 
								'background' : 'url(#)',
								'filter' : "progid:DXImageTransform.Microsoft.gradient(startColorStr='" + value + "',EndColorStr='" + value + "')"
							};
						}
						// background-image gradient
						if ((property.toUpperCase() == 'BACKGROUND' || property.toUpperCase() === 'BACKGROUND-IMAGE') && value.indexOf('linear-gradient') === 0) {
							var da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
							if (da.length == 2) {
								return {
									'background' : 'url(#)',
									'filter' : "progid:DXImageTransform.Microsoft.gradient(startColorStr='" + da[0] + "',EndColorStr='" + da[1] + "')"
								};
							}
						}
					}
				}
			}
			return false;
		}
		
		function selectorRules(selector) {
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// ::selection
					selector = selector.replace('::selection', '::-moz-selection');
				
				// ::placeholder
				selector = selector.replace('::placeholder', ':-moz-placeholder');
				
				// @keyframes
				selector = selector.replace('@keyframes', '@-moz-keyframes');
			} else if(currentPrefix == 'webkit') {
				// @keyframes
				selector = selector.replace('@keyframes', '@-webkit-keyframes');
				
				// ::placeholder
				selector = selector.replace('::placeholder', '::-webkit-input-placeholder');
			}
			return selector;
		}
		
		/* Alpha + Color channels to Alpha + Hexadecimals */
		function ac2ah(c) {
			var da = c.replace(/^rgba\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
			var ha = [];
			var h;
			for (var i=0; i < da.length; i++) {
				if (i==3){ da[i] *= 255; } // alpha bit of the rgba!
				h = '0' + parseInt(da[i], 10).toString(16);
				ha.push( h.substr(h.length-2,2).toUpperCase() );
			}

			ha.splice(0, 0, ha.pop());
			return '#' + ha.join('');
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
				if (!options.checkMedia || ($this.attr('media') && $this.attr('media').length > 0 && matchMedia($this.attr('media')).matches) || !$this.attr('media')) {
					load(this.href, $this);
				}
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
					parseFinalize(element, data);
				});
			} catch(e){}
		}

		for (property in rules) {
			if ((newProperty = propertyRules(property)) !== false) {
				setCssHook(property, newProperty);
			}
		}
		
		for (property in supportRules) {
			if ((newProperty = propertyRules(supportRules[property])) !== false) {
				setCssHook(supportRules[property], newProperty);
			}
		}

		var valueRules = 'background background-image background-clip background-origin transition transition-property display'.split(' ');
		for (property in valueRules) {
			if ($.inArray(valueRules[property], supportRules) === -1) {
				setCssHook(valueRules[property], valueRules[property]);
			}
		}
		
		function setCssHook(property, newProperty) {
			newProperty = cssCamelCase(newProperty);
			$.cssHooks[cssCamelCase(property)] = {
				get: function( elem, computed, extra ) {
					return elem.style[newProperty];
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
	
	$.cssFinalize.cssObjToText = function(obj, prettyfy) {
		var text = '';
		prettyfy = prettyfy || false;
		$.each(obj, function(i, block) {
			text += block.selector + '{';
			if ($.isArray(block.attributes)) {
				if (prettyfy) text += '\r\n';
				text += $.cssFinalize.cssObjToText(block.attributes, prettyfy);
			} else {
				$.each(block.attributes, function(property, value) {
					if (prettyfy) text += '\r\n  ';
					text += property + ':' + value + ';';
				});
				if (prettyfy) text += '\r\n';
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

/*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas
* Copyright (c) 2011 Scott, Paul and Nicholas.
* Dual MIT/BSD license
*/
window.matchMedia = window.matchMedia || (function(doc, undefined){
  
  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');
  
  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.appendChild(div);
  
  return function(q){
    
    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';
    
    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;  
    docElem.removeChild(fakeBody);
    
    return { matches: bool, media: q };
  };
  
})(document);