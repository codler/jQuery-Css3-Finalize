# CSS 3 Finalize

Some css3 attributes need to have a prefix in front (vendor prefix) in order to work in different browser. The plugin takes care of that and will automatically add the prefix so you don't need to write the vendor prefix. With this you will save time and the pain of rewriting same attribute many times.

For example the css3 attribute <code>transform</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
<li><code>-o-</code> in Opera</li>
</ul>

See which vendor prefix CSS3 Finalize supports <https://github.com/codler/jQuery-Css3-Finalize/wiki/Rules-supported>

It also do some more then checking for vendor prefix. Eg. it add support for alpha color (rgba) in background-color in IE7-8.

## How to use

Simply add this line of code to your site for latest version

	<script src="http://static.zencodez.net/js/jquery.css3finalize-latest.min.js"></script>

or for version 1.43

	<script src="http://ajax.cdnjs.com/ajax/libs/css3finalize/1.43/jquery.css3finalize.min.js"></script>

Once the script is loaded it will search for style-tags and link-tags (within same domain) and parse them.

#### Manual loading
If you don't want the script to automatically load and parse then you could set this code

	<script> 
	// Disable autoload
	window.cssFinalize=false; 
	// DOM is ready
	jQuery(function($) { 
		// Start parse
		$.cssFinalize('style, link');
	});
	</script>

## Options

	node : 'style, link' // Elements to parse css text.
	
	shim : true // Enables support of rgba in ie7-8 and more, read Rules-supported section.

## Tests

This script has been tested in <code>IE 8-9</code>, <code>FF 4</code>, <code>Chrome stable-dev</code>, <code>Safari 5</code>, <code>Opera</code> on windows

<http://jsfiddle.net/AqsXb/>

#### Some notes
* The script can only read link-tags where it source are from same domain.
* Link-tags cannot be read on webkit and Opera on local files.
* It seems IE8 strips out attributes on invalid value on known property in style-tag.

## cssHooks (jQuery 1.4.3+)

You can leave out the prefix when setting a style in Jquery css method.

Example

<code>$('a').css({'border' : '1px solid #000000', 'column-width' : 10});</code>

In normal case you would have needed to add a prefix

<code>$('a').css({'border' : '1px solid #000000', '-moz-column-width' : 10});</code>

## Feedback

I appreciate all feedback, thanks!