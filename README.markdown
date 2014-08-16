# CSS 3 Finalize

With this plugin you can write CSS without the vendor prefixes. The plugin takes care of it and will automatically add vendor prefixes. This will save time and the pain of rewriting same attribute many times.

For example the css3 attribute <code>transform</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
</ul>

## How to use

Simply add this line of code to your site

	<script src="https://cdnjs.cloudflare.com/ajax/libs/css3finalize/4.0.0/jquery.css3finalize.min.js"></script>

Once the script is loaded it will search for style-tags and link-tags (within same domain) and parse them.

#### Manual loading
If you don't want the script to automatically load and parse then you could set this code

	<script> 
	// Disable autoload
	window.cssFinalize=false; 
	// DOM is ready
	jQuery(function($) { 
		// Start parse
		$('style, link').cssFinalize();
	});
	</script>

## Options

	// Which node CSS3 Finalize should read and add vendor prefixes
	node : 'style,link',
	// If it should add the vendor prefixes
	append : true,
	// This will be called for each nodes after vendor prefixes have been appended
	callback : function(css) {}

## Tests

This script has been tested in <code>IE 10-11</code>, <code>FF</code>, <code>Webkit</code>

<http://jsfiddle.net/Q96Gc/>

#### Some notes
* The script can only read link-tags where it source are from same domain.
* Link-tags cannot be read on webkit and Opera on local files.

## cssHooks

You can leave out the prefix when setting a style in jQuery css method.

Example

<code>$('a').css({'width' : 'calc(100% - 80px)', 'column-width' : 10});</code>

In normal case you would have needed to add a prefix

<code>$('a').css({'width' : '-webkit-calc(100% - 80px)', '-moz-column-width' : 10});</code>

## LESS

Example using <code>less.js</code> post processing together with this script

	less = {
		postProcessor: function(css) {
			var processedCSS = css;
			if ($.cssFinalize) {
				$('<textarea>').val(css).cssFinalize({
					'append' : false,
					'callback': function(css) {
						processedCSS += $.cssFinalize.cssObjToText(css);
					}
				});
			}
			return processedCSS;
		}
	};

## Feedback

I appreciate all feedback, thanks! If you would like to donate you can send to this Bitcoin address <code>1FCT3xhLBRD1MUxnS1ppcLrbH9SCeZpu6D</code>

## Change log ##

2014-08-16 - **v4.0.1**

* Fix detect property flex in IE10 ([codler](https://github.com/codler) [#25](https://github.com/codler/jQuery-Css3-Finalize/issues/25))

2014-05-24 - **v4.0.0**

Version 4 have been updated to support IE10+ and other modern browsers.
CSS Flex fallback support

([codler](https://github.com/codler))

2013-03-29 - **v3.4.0**

* Fix for jQuery 2.0b2 ([codler](https://github.com/codler))

2013-02-23 - **v3.3**

* Fix for jQuery 1.9 ([codler](https://github.com/codler) [#22](https://github.com/codler/jQuery-Css3-Finalize/issues/22))

2012-11-30 - **v3.2**

* Fix detect shorthand properties in webkit. ([codler](https://github.com/codler) [#20](https://github.com/codler/jQuery-Css3-Finalize/issues/20))
* Fix flex for IE10 ([codler](https://github.com/codler))

2012-09-06 - **v3.1**

* Remove prefixing flex in cssHooks. ([codler](https://github.com/codler) [#18](https://github.com/codler/jQuery-Css3-Finalize/issues/18))

2012-08-21 - **v3.0**

The time has come to drop support for older browser. 

Version 3 have been updated to support IE9+ and latest version of Firefox, Chrome, Safari and Opera since they have auto update.

The minified version is alot smaller now.

Fixes old bugs

([codler](https://github.com/codler))

2012-08-19 - **v2.5**

* Allow Array.prototype Augmenting ([mkantor](https://github.com/mkantor) [#16](https://github.com/codler/jQuery-Css3-Finalize/pull/16))

2012-05-07 - **v2.4**
* Replaced string indexing with call to .charAt() for IE7 compatibility. ([mkantor](https://github.com/mkantor) [#14](https://github.com/codler/jQuery-Css3-Finalize/pull/14))

2012-02-14 - **v2.3**

* Fix issue #12, prefix border-radius in FF3.6 and safari 4. ([codler](https://github.com/codler) [#12](https://github.com/codler/jQuery-Css3-Finalize/issues/12))

2012-02-09 - **v2.2**

* Fix valueRules in CSSHooks. ([codler](https://github.com/codler))

**... See commit log ...**

2011-08-08 - **v1.45**

* Opacity shim only on <=IE8. ([codler](https://github.com/codler))
* Fix for a IE transparency/click bug. ([r3gis3r](https://github.com/r3gis3r) [#8](https://github.com/codler/jQuery-Css3-Finalize/pull/8))

**... See commit log ...**

2010-10-26 - **v1.0**

* First commit. ([codler](https://github.com/codler))