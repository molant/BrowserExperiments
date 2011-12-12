<div class="span16">
	<header class="page-header">
		<h2>Column fill</h2>
	</header>
</div>
<div class="span-two-thirds">
	<div class="alert-message block-message info">
		<p>There are two strategies for filling columns: columns can either be balanced, or not. If columns are balanced, UAs should minimize the variation in column length. Otherwise, columns are filled sequentially and some columns may end up partially filled, or with no content at all. In any case, the user agent should try to honor the <code>widows</code> and ‘orphans’ properties.</p>
		<p>The values are:</p>
		<dl>
			<dt>balance <span class="label">Default</span></dt>
			<dd>Balance content equally between columns, if possible.</dd>
			<dt>auto</dt>
			<dd>Fills columns sequentially.</dd>
		<p><span class="label notice">Note</span></p>
		<ul>
			<li>In continuous media, this property will only be consulted if the length of columns has been constrained. Otherwise, columns will automatically be balanced.</li>
			<li>In continous media, this property does not have any effect in overflow columns (see below).</li>
			<li>In paged media, this property will only have effect on the last page the multicol element appears on.</li>
		</ul>
	</div>
</div>
<div class="span-one-third">
	<h3>Code example</h3>
	<div class="code">
		<pre class="prettyprint"><code class="language-css">.example {
	columns: 3;
	column-fill: balance;
	overflow:hidden;
	height: 600px;
}</code></pre>
	</div>
</div>
<div class="span16">
	<?php include 'includes/columns/example.php'; ?>
</div>