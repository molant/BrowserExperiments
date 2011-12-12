<div class="span16">
	<header class="page-header">
		<h2>Column count</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>This property describes the number of columns of a multicol element.</p>
		<dl>
			<dt>auto</dt>
			<dd>means that the number of columns will be determined by other properties (e.g., <code>column-count</code>, if it has a non-auto value).</dd>
			<dt>&lt;length&gt;</dt>
			<dd>describes the optimal number of columns into which the content of the element will be flowed. Values must be greater than 0. If both <code>column-width</code> and <code>column-count</code> have non-auto values, the integer value describes the maximum number of columns.</dd>
		</dt>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	column-count: 3;
}</code></pre>
	</div>
</div>
<div class="span16">
	<?php include 'includes/columns/example.php'; ?>
</div>