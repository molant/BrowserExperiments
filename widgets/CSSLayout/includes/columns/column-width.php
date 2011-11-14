<div class="span16">
	<header class="page-header">
		<h2>Column width</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>This property describes the width of columns in multicol elements.</p>
		<dl>
			<dt>auto</dt>
			<dd>means that the column width will be determined by other properties (e.g., <code>column-count</code>, if it has a non-auto value).</dd>
			<dt>&lt;length&gt;</dt>
			<dd>describes the optimal column width. The actual column width may be wider (to fill the available space), or narrower (only if the available space is smaller than the specified column width). Specified values must be greater than 0.</dd>
		</dt>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	column-width: 100px;
}</code></pre>
	</div>
</div>
<div class="span16">
	<?php include 'includes/columns/example.php'; ?>
</div>