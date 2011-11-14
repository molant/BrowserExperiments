<div class="span16">
	<header class="page-header">
		<h2>Column rule width</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>This property sets the width of the rule between columns. The <code>&lt;border-width&gt;</code> values are defined in <a href="http://www.w3.org/TR/CSS21/box.html#value-def-border-width">[Border width - CSS21]</a>.</p>
		<p><span class="label notice">Note</span> Negative values are not allowed.</p>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	column-count: 3;
	column-gap: 20px;
	column-rule: 2px solid #333;
	column-rule-width: 5px;
}</code></pre>
	</div>
</div>
<div class="span16">
<?php include 'includes/columns/example.php'; ?>
</div>