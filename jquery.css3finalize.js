/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2011 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package Css3-Finalize
 * @version 1.32 - 2011-02-18
 * @website https://github.com/codler/jQuery-Css3-Finalize
 *
 * == Description == 
 * Some css3 attributes needs to have a prefix in front 
 * in order to work in different browser. The plugin takes 
 * care of that so you only need to write without the prefix.
 *
 * == Example Usage ==
 * // This will look for all style-tags and parse them.
 * $('style').cssFinalize();
 */
(function ($) {
	// Backward compatible for jquery 1.4.2 and less
	if (!$.camelCase) {
		$.camelCase = function( string ) {
			return string.replace( /-([a-z])/ig, function( all, letter ) {
				return letter.toUpperCase();
			});
		}
	}

	$.cssFinalizeSetup = {
		shim : true,
		node : 'style,link',
		checkMedia : true
	}

	$.fn.cssFinalize = function(options) {
		if (!options || typeof options != 'object') {
			options = {};
		}
		options.node = this;
		$.cssFinalize(options);
		return this;
	}
	
	$.cssFinalize = function(options) {
		var div = document.createElement('div');
		
		// Backward compatible for css3finalize 1.24 and less
		if (typeof options == 'string') {
			newoptions = arguments[1] || {};
			newoptions.node = options;
			options = newoptions;
		}
		
		options = $.extend({}, $.cssFinalizeSetup, options);
		
		// Get current vendor prefix
		var currentPrefix = false;
		if ($.browser.webkit || $.browser.safari) {
			currentPrefix = 'webkit';
		} else if ($.browser.mozilla) {
			currentPrefix = 'moz'
		} else if ($.browser.msie) {
			// No vendor prefix in ie 7
			if ($.browser.version <= 7 && !options.shim) {
				return true;
			}
			currentPrefix = 'ms';
		} else if ($.browser.opera) {
			currentPrefix = 'o';
		}
	
		function customRule(prefix, newAttr) {
			return function(attr) {
				return (currentPrefix == prefix) ? newAttr : false;
			}
		}
		// PropertyRules
			// Animation
		var supportRules = 'animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function';
		
			supportRules += ' appearance backface-visibility';
			
			// Background
			supportRules += ' background-clip background-composite background-origin background-size';
			
			// Border - corner/image/radius
			supportRules += ' border-corner-image border-image border-top-image border-right-image border-bottom-image border-left-image border-top-left-image border-top-right-image border-bottom-left-image border-bottom-right-image border-radius';
			
			// Box
			supportRules += ' box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack box-reflect box-shadow box-sizing';
						
			// Column
			supportRules += ' column-count column-gap column-rule column-rule-color column-rule-style column-rule-width column-width columns';
			
			supportRules += ' dashboard-region line-break';
			
			// Marquee
			supportRules += ' marquee marquee-direction marquee-increment marquee-repetition marquee-speed marquee-style';
			
			// Mask
			supportRules += ' mask mask-attachment mask-box-image mask-clip mask-composite mask-image mask-origin mask-position mask-position-x mask-position-y mask-repeat mask-size';
			
			supportRules += ' nbsp-mode';
			
			// Perspective
			supportRules += ' perspective perspective-origin';
			
			supportRules += ' tab-size tap-highlight-color text-fill-color text-overflow text-security text-size-adjust';
			
			// Text-stroke
			supportRules += ' text-stroke text-stroke-color text-stroke-width';
			
			supportRules += ' touch-callout';
			
			// Transform
			supportRules += ' transform transform-origin transform-origin-x transform-origin-y transform-origin-z transform-style';
			
			// Transition
			supportRules += ' transition transition-delay transition-duration transition-property transition-timing-function';
			
			supportRules += ' user-drag user-modify user-select';
			
			supportRules = supportRules.split(' ');
		
		var rules = {
			/*
			'animation'				 : ['webkit'],
			'animation-delay'		 : ['webkit'],
			'animation-direction'	 : ['webkit'],
			'animation-duration'	 : ['webkit'],
			'animation-iteration-count' : ['webkit'],
			'animation-name'		 : ['webkit'],
			'animation-timing-function' : ['webkit'],

			'backface-visibility' : ['webkit'],

			'background-clip'		 : ['webkit', 'khtml'],
			'background-origin'		 : ['webkit', 'khtml'],
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
			'border-bottom-right-image'	: ['moz', 'webkit'], */
			
			// border-radius
			//'border-radius' 			: ['moz'],
			'border-top-left-radius'	: [customRule('moz', '-moz-border-radius-topleft')],
			'border-top-right-radius'	: [customRule('moz', '-moz-border-radius-topright')],
			'border-bottom-right-radius': [customRule('moz', '-moz-border-radius-bottomright')],
			'border-bottom-left-radius'	: [customRule('moz', '-moz-border-radius-bottomleft')]
			
			/*'box-align'			 : ['moz', 'webkit'],
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
			'user-select'		 : ['moz', 'webkit', 'khtml']*/
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
				if (match != null && match[i] != undefined) {
					merge.push(match[i]);
				}
			}
			return merge;
		}
		
		// Future TODO: make custom callback for user
		function appendStyle(element, cssObj) {
			if (currentPrefix == 'ms' && $.browser.version <= 7) {
				var style = $('<style class="css-finalized" />');
				$('head:first').append(style);
				//element.after(style);
				style[0].styleSheet.cssText = cssObjToText(cssObj)
			} else {
				element.after('<style class="css-finalized">' + cssObjToText(cssObj) + '</style>');
			}
		}
		
		function parseFinalize(element, cssText) {
			cssText = cleanCss(cssText);
			if ($.trim(cssText) == '') return;
			
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
								'attributes' : block.attributes
							});
						
						// @media
						} else if (options.checkMedia && 
							block.selector.indexOf('@media') == 0 && 
							media.matchMedium(block.selector.substr(7))) {
							
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
			if (cssFinalize.length > 0) {
				appendStyle(element, cssFinalize);
			}
		}
		
		function cssTextToObj(text) {
			if (currentPrefix == 'ms' && $.browser.version <= 8) {
				var block = ieSplit(text, '({[^{}]*})');
			} else {
				var block = text.split(/({[^{}]*})/);
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
		
		function cssTextAttributeToObj(text) {
			// Data URI fix
			text = text.replace( /url\(([^)]+)\)/g, function(url){
				return url.replace( /;/g, '[cssFinalize]' );
			});
			if (currentPrefix == 'ms' && $.browser.version <= 8) {
				var attribute = ieSplit(text, '(:[^;]*;?)');
			} else {
				var attribute = text.split(/(:[^;]*;?)/);
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
				var newValue = valuesRules(property, value, newProperty);
				if (newValue) {
					newAttributes[(newProperty) ? newProperty : property] = newValue;
				}
				
				// PropertyValue Rules
				var newPropertyValue = propertyValuesRules(property, value);
				if (newPropertyValue) {
					newAttributes[newPropertyValue.property] = newPropertyValue.value;
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
				if (!($.camelCase(property) in div.style) || property == 'mask') {
					// Checks if vendor prefix property exists in style
					// is this needed?
					if ($.camelCase('-' + currentPrefix + '-' + property) in div.style) {
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
				if (div.style[$.camelCase(newProperty)] !== undefined && ''+div.style[$.camelCase(newProperty)].indexOf(value) == -1) {
					return value.split('-')[0];
				}
			}
			
			// Only apply for firefox
			if (currentPrefix == 'moz') {
				// calc
				if (value.indexOf('calc') == 0) {
					return '-moz-' + value;
				}
			}
			
			/* if (options.shim) {
				// Only apply for ie
				if (currentPrefix == 'ms') {
					// only for version 7 or lower
					if ($.browser.version <= 7) {
						if (property.toUpperCase() == 'DISPLAY' && value == 'inline-block') {
							return 'inline';
						}
					}
				}
			} */
			
			// // TODO : more advanced background-image: linear-gradient()
			if (property == 'background-image' && value.indexOf('linear-gradient') == 0) {
				if (currentPrefix == 'moz') {
					return '-moz-' + value;
				} else if (currentPrefix == 'webkit') {
					var da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
					if (da.length == 2) {
						return '-webkit-gradient(linear, 0% 0%, 0% 100%, from(' + da[0] + '), to(' + da[1] + '))';
					}					
				} else if (currentPrefix == 'o') {
					var da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
					if (da.length == 2) {
						var g = '<svg xmlns="http://www.w3.org/2000/svg" version="1.0"><defs><linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" style="stop-color: ' + da[0] + ';"/><stop offset="100%" style="stop-color: ' + da[1] + ';"/></linearGradient></defs><rect x="0" y="0" fill="url(#gradient)" width="100%" height="100%" /></svg>';
						return 'url(data:image/svg+xml,' + escape(g) + ')';
					}
				}
			}
			
			return false;
		}
		
		function propertyValuesRules(property, value) {
			if (options.shim) {
				// Only apply for ie
				if (currentPrefix == 'ms') {
					// only for version 8 or lower
					if ($.browser.version <= 8) {
						// background-color alpha color
						if (property.toUpperCase() == 'BACKGROUND-COLOR' && value.indexOf('rgba') == 0) {
							value = ac2ah(value);
							return {
								'property' 	: 'filter',
								'value'		: "progid:DXImageTransform.Microsoft.gradient(startColorStr='" + value + "',EndColorStr='" + value + "')"
							};
						}
						// background-image gradient
						if (property.toUpperCase() == 'BACKGROUND-IMAGE' && value.indexOf('linear-gradient') == 0) {
							var da = value.replace(/^linear-gradient\s?\(\s?(.*?)\s?\)$/, '$1').split(/,\s?/);
							if (da.length == 2) {
								return {
									'property' 	: 'filter',
									'value'		: "progid:DXImageTransform.Microsoft.gradient(startColorStr='" + da[0] + "',EndColorStr='" + da[1] + "')"
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
				//if (selector.indexOf('::selection') != -1) {
					selector = selector.replace('::selection', '::-moz-selection');
				//}
				
				// ::placeholder
				selector = selector.replace('::placeholder', ':-moz-placeholder');
				
			} else if(currentPrefix == 'webkit') {
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
				if (!options.checkMedia || ($this.attr('media').length > 0 && media.matchMedium($this.attr('media'))) || $this.attr('media').length == 0) {
					load(this.href, $this);
				}
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

			if (crossDomain) return;
			try {
				$('<div />').load(url, function(data) {
					parseFinalize(element, data);
				});
			} catch(e){}
		}
		
		// Css hooks - require jquery 1.4.3+
		//if ($().jquery.replace(/\./g, '') >= 143) {
		if ($.cssHooks) {
			for (property in rules) {
				//if ($.inArray(currentPrefix, rules[property])!== -1) {
				if ((newProperty = propertyRules(property)) !== false) {
					setCssHook(property, newProperty);
				}
			}
			
			for (property in supportRules) {
				if ((newProperty = propertyRules(supportRules[property])) !== false) {
					setCssHook(supportRules[property], newProperty);
				}
			}
		}
		
		function setCssHook(property, newProperty) {
			newProperty = $.camelCase(newProperty);
			if (currentPrefix == 'ms' && 
				$.browser.version <= 8) {
				newProperty = newProperty.charAt(0).toLowerCase() + newProperty.substr(1)
			}
			$.cssHooks[$.camelCase(property)] = {
				get: function( elem, computed, extra ) {
					return elem.style[newProperty];
				},
				set: function( elem, value ) {
					elem.style[newProperty] = value;
				}
			}
		}
		
	}
	$(function() {
		// Let user decide to parse on load or not.
		if (window.cssFinalize!==false) {
			$.cssFinalize();
		}
	});
})(jQuery);

/*
 * media.matchMedium()- test whether a CSS media type or media query applies
 * primary author: Scott Jehl
 * Copyright (c) 2010 Filament Group, Inc
 * MIT license
 
 * adapted by Paul Irish to use the matchMedium API
 *    http://www.w3.org/TR/cssom-view/#media
 * Doesn't implement media.type as there's no way for crossbrowser property
 *    getters. instead of media.type == 'tv' just use media.matchMedium('tv')
 
 * Developed as a feature of the EnhanceJS Framework (enhancejs.googlecode.com)
 * thx to: 
   - phpied.com/dynamic-script-and-style-elements-in-ie for inner css text trick 
   - @paul_irish for fakeBody trick 
*/
if ( !(window.media && media.matchMedium) ){
  
  window.media = window.media || {};
  media.matchMedium = (function(doc,undefined){
    
    var cache = {},
        docElem = doc.documentElement,
        fakeBody = doc.createElement('body'), 
        testDiv = doc.createElement('div');
    
    testDiv.setAttribute('id','ejs-qtest'); 
    fakeBody.appendChild(testDiv);
    
    return function(q){
      if (cache[q] === undefined) {
        var styleBlock = doc.createElement('style');
        styleBlock.type = 'text/css';
        var cssrule = '@media '+q+' { #ejs-qtest { position: absolute; } }';
        if (styleBlock.styleSheet){ 
            styleBlock.styleSheet.cssText = cssrule;
        } 
        else {
            styleBlock.appendChild(doc.createTextNode(cssrule));
        }      
        docElem.insertBefore(fakeBody, docElem.firstChild);
        docElem.insertBefore(styleBlock, docElem.firstChild);
        cache[q] = ((window.getComputedStyle ? window.getComputedStyle(testDiv,null) : testDiv.currentStyle)['position'] == 'absolute');
        docElem.removeChild(fakeBody);
        docElem.removeChild(styleBlock);
      }
      return cache[q];
    };
    
  })(document);

}