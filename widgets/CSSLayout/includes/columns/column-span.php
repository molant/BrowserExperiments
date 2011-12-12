<div class="span16">
	<header class="page-header">
		<h2>Column span</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>The <code>column-span</code> property makes it possible for an element to span across several columns.</p>
		<p>This property describes how many columns an element spans across. Values are:</p>
		<dl>
			<dt>none <span class="label">Default</span></dt>
			<dd>The element does not span multiple columns.</dd>
			<dt>all</dt>
			<dd>The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appears. The element establishes a new block formatting context.</dd>
		<p><span class="label notice">Note</span> 	An element that spans more than one column is called a <strong>spanning element</strong>.</p>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	columns: 3;
}
.example .page-header {
	column-span: all;
}</code></pre>
	</div>
</div>
<div class="span16">
	<?php include 'includes/columns/example.php'; ?>
</div>