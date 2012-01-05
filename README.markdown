# CSS 3 Finalize

With this plugin you can write CSS without the vendor prefixes. The plugin takes care of it and will automatically add vendor prefixes. This will save time and the pain of rewriting same attribute many times.

For example the css3 attribute <code>transform</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
<li><code>-o-</code> in Opera</li>
</ul>

In additional besides adding vendor prefix, it can also do some more. Eg. it add support for alpha color (rgba) in background-color in IE7-8.
See more <https://github.com/codler/jQuery-Css3-Finalize/wiki/Rules-supported>

## How to use

Simply add this line of code to your site for latest version

	<script src="http://static.zencodez.net/js/jquery.css3finalize-latest.min.js"></script>

or for version 2.1

	<script src="http://cdnjs.cloudflare.com/ajax/libs/css3finalize/2.1/jquery.css3finalize.min.js"></script>

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

	node : 'style, link' // Elements to parse css text.
	
	shim : true // Enables support of rgba in ie7-8 and more, read Rules-supported section.
	
	callback : function() {} // Calls after each node.

## Tests

This script has been tested in <code>IE 8-9</code>, <code>FF</code>, <code>Chrome</code>, <code>Safari 5</code>, <code>Opera</code> on windows

<http://jsfiddle.net/kuUTU/>

#### Some notes
* The script can only read link-tags where it source are from same domain.
* Link-tags cannot be read on webkit and Opera on local files.
* It seems IE8 strips out attributes on invalid value on known property in style-tag.

## cssHooks

You can leave out the prefix when setting a style in Jquery css method.

Example

<code>$('a').css({'border' : '1px solid #000000', 'column-width' : 10});</code>

In normal case you would have needed to add a prefix

<code>$('a').css({'border' : '1px solid #000000', '-moz-column-width' : 10});</code>

## Feedback

I appreciate all feedback, thanks! If you would like to donate you can send to this Bitcoin address <code>1FCT3xhLBRD1MUxnS1ppcLrbH9SCeZpu6D</code>