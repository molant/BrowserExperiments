<div class="span16">
	<header class="page-header">
		<h2>Column rule style</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>The <code>column-rule-style</code> property sets the style of the rule between columns of an element. The <code>&lt;border-style&gt;</code> values are defined in <a href="http://www.w3.org/TR/2010/WD-CSS2-20101207/box.html#value-def-border-style">[Border style - CSS21]</a> and the values are interpreted as in the the collapsing border model.</p>
		<p><span class="label notice">Note</span> The <code>none</code> value forces the computed value of <code>column-rule-width</code> to be ‘0’.</p>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	column-count: 3;
	column-gap: 20px;
	column-rule: 2px solid #333;
	column-rule-style: dashed;
}</code></pre>
	</div>
</div>
<div class="span16">
	<?php include 'includes/columns/example.php'; ?>
</div>