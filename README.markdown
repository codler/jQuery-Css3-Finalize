# CSS 3 Finalize

With this plugin you can write CSS without the vendor prefixes. The plugin takes care of it and will automatically add vendor prefixes. This will save time and the pain of rewriting same attribute many times.

For example the css3 attribute <code>transform</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
<li><code>-o-</code> in Opera</li>
</ul>

In additional besides adding vendor prefix, it have also partial support for linear-gradient in IE9.

## How to use

Simply add this line of code to your site for latest version

	<script src="http://static.zencodez.net/js/jquery.css3finalize-v3.x.min.js"></script>

or for version 3.0

	<script src="https://cdnjs.cloudflare.com/ajax/libs/css3finalize/3.1/jquery.css3finalize.min.js"></script>

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

This script has been tested in <code>IE 9</code>, <code>FF</code>, <code>Chrome</code>, <code>Safari</code>, <code>Opera</code> on windows

<http://jsfiddle.net/UmquE/>

#### Some notes
* The script can only read link-tags where it source are from same domain.
* Link-tags cannot be read on webkit and Opera on local files.

## cssHooks

You can leave out the prefix when setting a style in jQuery css method.

Example

<code>$('a').css({'width' : 'calc(100% - 80px)', 'column-width' : 10});</code>

In normal case you would have needed to add a prefix

<code>$('a').css({'width' : '-webkit-calc(100% - 80px)', '-moz-column-width' : 10});</code>

## Feedback

I appreciate all feedback, thanks! If you would like to donate you can send to this Bitcoin address <code>1FCT3xhLBRD1MUxnS1ppcLrbH9SCeZpu6D</code>

## Change log ##

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