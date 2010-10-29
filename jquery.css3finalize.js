/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2010 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package Css3-Finalize
 * @version 1.6 - 2010-10-29
 * @website http://github.com/codler/jQuery-Css3-Finalize
 *
 * == Description == 
 * Some css3 attributes needs to have a prefix infront
 * inorder to work in diffrent browser. The plugin takes
 * care of that so you only need to write without the prefix.
 *
 * == Example Usage ==
 * // This will look for all style-tags and parse them.
 * $.cssFinalize('style');
 */
(function ($) {

	$.cssFinalize = function(node) {
		var currentPrefix = false;
		
		if ($.browser.webkit || $.browser.safari) {
			currentPrefix = 'webkit';
		} else if ($.browser.mozilla) {
			currentPrefix = 'moz'
		} else if ($.browser.msie) {
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
			'border-radius' 			: ['moz', 'webkit'],
			'border-top-left-radius'	: [customRule('-moz-border-radius-topleft'), 'webkit'],
			'border-top-right-radius'	: [customRule('-moz-border-radius-topright'), 'webkit'],
			'border-bottom-right-radius': [customRule('-moz-border-radius-bottomright'), 'webkit'],
			'border-bottom-left-radius'	: [customRule('-moz-border-radius-bottomleft'), 'webkit'],
			
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
			'tab-size'			 : ['moz', 'o'],
			'text-overflow'		 : ['o'],
			'text-size-adjust'	 : ['webkit', 'ms'],
			'transform'			 : ['moz', 'webkit', 'o', 'ms'],
			'transform-origin'	 : ['moz', 'webkit', 'o', 'ms'],
			'transition'		 : ['moz', 'webkit', 'o'],
			'transition-delay'	 : ['moz', 'webkit', 'o'],
			'transition-duration' : ['moz', 'webkit', 'o'],
			'transition-property' : ['moz', 'webkit', 'o'],
			'transition-timing-function' : ['moz', 'webkit', 'o']
		}
	
		function cssObjToText(obj) {
			var text = '';
			$.each(obj, function(i, block) {
				text += block.selector + '{';
				$.each(block.attributes, function(property, value) {
					text += property + ':' + value + ';';
				});
				text += '}';
			});
			return text;
		}
		
		function cssTextToObj(text) {
			// block
			var block = text.split('{');
			if (block[0] != "") {
				var objCss = [{'selector': $.trim(block.shift())}] 
			} else {
				var objCss = [];
				block.shift();
			}
			//console.log("-----------------------------------------");
			//console.log(block);
			$.map(block, function (n, i) {
					//console.log("--------------------");
					var t = n.split('}');
					if (t[0] == "") {
						if (t[1]) {
							objCss[i+1] = {'selector': $.trim(t[1])};
						}
						return true;
					}
					//console.log([t]);
					var tt = t[0].split(':');
					
					var b = {};
					var property, next=false;
					
					while(tt.length > 0) {
						if (!next) {
							property = $.trim(tt.shift());
							b[property] = '';
						} else {
							b[property] += ':';
							next = false;
						}
					
						b[property] += (function() {
							
							var a = tt.shift().split(';');							
							if ($.trim(a[1]))
								tt.unshift($.trim(a[1]));
							else
								next = true;
							
							return $.trim(a[0]);
						})();
					}
					objCss[i].attributes = b;
					
					
					
					
					if (t[1]) {
						objCss[i+1] = {'selector': $.trim(t[1])};
					}
				
			});
			return objCss;
		}
		
		function cleanCss(css) {
			// strip multiline comment
			css = css.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g, '');
			
			// remove newline
			css = css.replace(/\n/g, '');
			css = css.replace(/\r/g, '');
			
			return css;
		}
		
		function findNeededAttributes(attributes) {
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
			}
			return selector;
		}
		
		function parseFinalize(element, cssText) {
			cssText = cleanCss(cssText);
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
			if ($this.hasClass('css-finalize-read')) {
				return true;
			}
			//console.log(this.href);
			// // link-tags for firefox, chrome
			if (this.tagName == 'LINK') {
				$('<div />').load(this.href, function(data) {
					parseFinalize($this, data);
				});
			} else {
				parseFinalize($this, $this.html());
			}
		});
		
		function appendStyle(element, cssObj) {
			element.after('<style class="css-finalized">' + cssObjToText(cssObj) + '</style>');
		}
	}
	
	$.cssFinalize('style, link');

})(jQuery);