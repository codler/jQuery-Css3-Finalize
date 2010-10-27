/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2010 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package Css3-Finalize
 * @version 1.2 - 2010-10-27
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
		
		if ($.browser.safari || $.browser.webkit) {
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
			
			'box-align'		 : ['moz', 'webkit'],
			'box-direction'	 : ['moz', 'webkit'],
			'box-flex'		 : ['moz', 'webkit'],
			'box-flex-group' : ['moz', 'webkit'],
			'box-lines'		 : ['moz', 'webkit'],
			'box-ordinal-group' : ['moz', 'webkit'],
			'box-orient'	 : ['moz', 'webkit'],
			'box-pack'		 : ['moz', 'webkit'],
			'box-shadow'	 : ['moz', 'webkit'],
			'box-sizing'	 : ['moz', 'webkit'],
			'column-count'	 : ['moz', 'webkit'],
			'column-gap'	 : ['moz', 'webkit'],
			'column-rule'	 : ['moz', 'webkit'],
			'column-rule-color'	 : ['moz', 'webkit'],
			'column-rule-style'	 : ['moz', 'webkit'],
			'column-rule-width'	 : ['moz', 'webkit'],
			'column-width'	 : ['moz', 'webkit'],
			'tab-size'		 : ['moz', 'o'],
			'text-overflow'	 : ['o'],
			'transform'		 : ['moz', 'webkit', 'o'],
			'transform-origin'	 : ['moz', 'webkit', 'o'],
			'transition'	 : ['moz', 'webkit', 'o'],
			'transition-delay' : ['moz', 'webkit', 'o'],
			'transition-duration' : ['moz', 'webkit', 'o'],
			'transition-property' : ['moz', 'webkit', 'o'],
			'transition-timing-function' : ['moz', 'webkit', 'o']
		}
	
		function cssObjToText(obj) {
			var text = '';
			$.each(obj, function(i, v) {
				text += v.selector + '{';
				$.each(v.block, function(k, v2) {
					text += k + ':' + v2 + ';';
				});
				text += '}';
			});
			return text;
		}
		
		function cleanCss(css) {
			// strip multiline comment
			css = css.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g, '');
			
			// remove newline
			css = css.replace(/\n/g, '');
			
			return css;
		}
		
		function parseFinalize(element, css) {
			css = cleanCss(css);
			
			// block
			var block = css.split('{');
			if (block[0] != "") {
				var objCss = [{'selector': $.trim(block.shift())}] 
			} else {
				var objCss = [];
				block.shift();
			}
			$.map(block, function (n, i) {
					var t = n.split('}');
					
					tt = t[0].split(':');
					
					var b = {};
					//console.log(tt);
					var property, next;
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
					
					objCss[i].block = b;
					
					
					
					
					if (t[1]) {
						objCss[i+1] = {'selector': $.trim(t[1])}
					}
				
			});
			
			// Last step
			var cssFinalize = [];
			$.each(objCss, function (i, v) {
				var newblock = {};
				
				$.each(v.block, function(k, v2) {
				
					if (k in rules) {
						for (prefix in rules[k]) {
							if ($.isFunction(rules[k][prefix])) {
								newblock[rules[k][prefix](k)] = v2;
							} else {
								if (currentPrefix == rules[k][prefix] || !currentPrefix) {
									newblock['-' + rules[k][prefix] + '-' + k] = v2;
								}
							}
						}
					}
					
					// Only apply for firefox
					if (currentPrefix == 'moz') {
						// calc
						if (v2.indexOf('calc') == 0) {
							newblock[k] = '-moz-' + v2;
						}
						
						// only for version 3.6 or lower
						if (parseInt($.browser.version.substr(0,1)) < 4) {
							// background-clip
							if (v2 == 'padding-box' && k == 'background-clip') {
								newblock[k] = 'padding';
							// background-clip
							} else if (v2 == 'border-box' && k == 'background-clip') {
								newblock[k] = 'border';
							// background-clip
							} else if (v2 == 'content-box' && k == 'background-clip') {
								newblock[k] = 'content';
							// background-origin
							} else if (v2 == 'padding-box' && k == 'background-origin') {
								newblock[k] = 'padding';
							// background-origin
							} else if (v2 == 'border-box' && k == 'background-origin') {
								newblock[k] = 'border';
							// background-origin
							} else if (v2 == 'content-box' && k == 'background-origin') {
								newblock[k] = 'content';
							}
						}
					}
					
					
					// TODO : Match background-image: linear-gradient()
				});
			
				if (!$.isEmptyObject(newblock)) {
					cssFinalize.push({
						'selector': v.selector,
						'block' : newblock
					});
				}
			});
			
			appendStyle(element, cssFinalize);
		}
	
	
		if (!(node instanceof jQuery)) {
			node = $(node);
		}
		
		node.each(function(index, element) {
			var $this = $(this);
			if ($this.hasClass('css-finalize-read')) {
				return true;
			}
			// link-tags for firefox
			if (this.tagName == 'LINK' && $.browser.mozilla) {
				$('<div />').load(this.href, function(data) {
					parseFinalize($this, data);
				});
			} else {
				parseFinalize($this, $this.html());
			}
		});
		
		function appendStyle(element, cssObj) {
			element.after('<style class="css-finalized">' + cssObjToText(cssObj) + '</style>').addClass('css-finalize-read');
		}
	}
	
	$.cssFinalize('style, link');

})(jQuery);