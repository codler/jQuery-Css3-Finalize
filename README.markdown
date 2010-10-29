# CSS 3 Finalize

Some css3 attributes needs to have a prefix infront inorder to work in diffrent browser. The plugin takes care of that so you only need to write without the prefix.

For example the css3 attribute <code>box-sizing</code> need to have the prefix 
<ul>
<li><code>-moz-</code> in Firefox</li>
<li><code>-ms-</code> in Internet explorer</li>
<li><code>-webkit-</code> in Chrome, Safari</li>
<li><code>-o-</code> in Opera</li>
</ul>
If you write without the prefix it won't work in those browser, you need the write each of them. Here is where this jquery plugin comes in. You only need to write it without the prefix and the plugin will automatical add the prefix. With this you will save time and the pain of rewriting same attribute many times.

## How to use

Simply add this code to your site

<code>
&lt;script src=&quot;http://github.com/codler/jQuery-Css3-Finalize/raw/master/static/jquery.css3finalize-latest.min.js&quot;&gt;&lt;/script&gt;
</code>

Once the script is loaded it will search for style-tags and parse them.

## Tests

This script have been tested on <code>IE 7</code>, <code>FF 3.6</code>, <code>Chrome 7</code>, <code>Safari 5</code>, <code>Opera 10.6</code>

Some notes:
- The script can only read link-tags where it source are from same domain. Execpt for IE 7.
- Link-tags can not be read on Chrome 7 on local files.