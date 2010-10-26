/**
 * @author Han Lin Yap < http://zencodez.net/ >
 * @copyright 2010 zencodez.net
 * @license http://creativecommons.org/licenses/by-sa/3.0/
 * @package ingrediens.se
 * @version 1.0 - 2010-10-26
 * 
 * Example Usage
 * // This will look for all style-tags and parse them.
 * $.cssStandard('style');
 *
 */
(function ($) {
	$.cssStandard = function(node) {
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
	
	
		if (!(node instanceof jQuery)) {
			node = $(node);
		}
		
		node.each(function(index, element) {
			var css = $(this).html();
			// strip multiline comment
			css = css.replace(/\/\*((?:[^\*]|\*[^\/])*)\*\//g, '');
			
			// remove newline
			css = css.replace(/\n/g, '');
			
			// block
			var block = css.split('{');
			var objCss = [{'selector': $.trim(block.shift())}];
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
					// border-radius
					if (k == 'border-radius') {
						newblock['-moz-border-radius'] = v2;
						newblock['-webkit-border-radius'] = v2;
					// box-shadow
					} else if (k == 'box-shadow') {
						newblock['-moz-box-shadow'] = v2;
						newblock['-webkit-box-shadow'] = v2;
					// transform
					} else if (k == 'transform') {
						newblock['-moz-transform'] = v2;
						newblock['-o-transform'] = v2;
						newblock['-webkit-transform'] = v2;
					// transition
					} else if (k == 'transition') {
						newblock['-moz-transition'] = v2;
						newblock['-o-transition'] = v2;
						newblock['-webkit-transition'] = v2;
					// box-sizing
					} else if (k == 'box-sizing') {
						newblock['-moz-box-sizing'] = v2;
						newblock['-webkit-box-sizing'] = v2;
					// border-image
					} else if (k == 'border-image') {
						newblock['-moz-border-image'] = v2;
						newblock['-webkit-border-image'] = v2;
					// box-orient
					} else if (k == 'box-orient') {
						newblock['-moz-box-orient'] = v2;
						newblock['-webkit-box-orient'] = v2;
					// box-flex
					} else if (k == 'box-flex') {
						newblock['-moz-box-flex'] = v2;
						newblock['-webkit-box-flex'] = v2;
					// column-width
					} else if (k == 'column-width') {
						newblock['-moz-column-width'] = v2;
						newblock['-webkit-column-width'] = v2;
					// column-gap
					} else if (k == 'column-gap') {
						newblock['-moz-column-gap'] = v2;
						newblock['-webkit-column-gap'] = v2;
					// column-rule
					} else if (k == 'column-rule') {
						newblock['-moz-column-rule'] = v2;
						newblock['-webkit-column-rule'] = v2;
					}
					
					
					// calc
					if (v2.indexOf('calc') == 0) {
						newblock[k] = '-moz-' + v2;
					}
				});
			
				if (!$.isEmptyObject(newblock)) {
					cssFinalize.push({
						'selector': v.selector,
						'block' : newblock
					});
				}
			});
			if (cssFinalize.length>0) {
				$(this).after('<style class="css-finalized">' + cssObjToText(cssFinalize) + '</style>').addClass('css-finalize-read');
			}
		});
	}
	
	$.cssStandard('style');

})(jQuery);