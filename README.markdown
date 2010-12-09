# CSS 3 Finalize

Some css3 attributes need to have a prefix in front (vendor prefix) in order to work in different browser. The plugin takes care of that and will automatically add the prefix so you don't need to write the vendor prefix. With this you will save time and the pain of rewriting same attribute many times.

For example the css3 attribute <code>box-sizing</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
<li><code>-o-</code> in Opera</li>
</ul>

## How to use

Simply add this code to your site

<code>
&lt;script src=&quot;https://github.com/codler/jQuery-Css3-Finalize/raw/master/static/jquery.css3finalize-latest.min.js&quot;&gt;&lt;/script&gt;
</code>

Alternative links

<code>http://bsy.se/jquery.css3finalize-latest.min.js</code> or <code>http://static.zencodez.net/js/jquery.css3finalize-latest.min.js</code>

Once the script is loaded it will search for style-tags and link-tags (within same domain) and parse them.

#### Manual loading
If you don't want the script to parse on loading and parse when you want you could set 

	<script> 
	// Disable autoload
	window.cssFinalize=false; 
	// Start parse
	jQuery(function() { $.cssFinalize('style, link'); });
	</script>

See which vendor prefix it looks for https://github.com/codler/jQuery-Css3-Finalize/wiki/Rules-supported
It do some more then checking for vendor prefix.

## Tests

This script has been tested in <code>IE 7</code>, <code>FF 3.6</code>, <code>Chrome 7</code>, <code>Safari 5</code>, <code>Opera 10.6</code> on windows and <code>FF 3.6</code> on mac

#### Some notes
* The script can only read link-tags where it source are from same domain. Except for local files in IE 7.
* Link-tags cannot be read on Chrome 7 on local files.

## cssHooks (jQuery 1.4.3+)

You can leave out the prefix when setting a style in Jquery css method.

Example

<code>$('a').css({'border' : '1px solid #000000', 'column-width' : 10});</code>

In normal case you would have needed to add a prefix

<code>$('a').css({'border' : '1px solid #000000', '-moz-column-width' : 10});</code>

## Feedback

I appreciate all feedback, thanks!