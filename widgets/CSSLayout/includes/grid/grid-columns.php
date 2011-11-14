<div class="span16">
	<div class="row">
		<div class="span16">
			<header class="page-header">
				<h2>Grid columns</h2>
			</header>
		</div>
	</div>
	<div class="row">
		<div class="span-one-third">
			<div class="alert-message block-message info">
				Definition
			</div>
		</div>
		<div class="span-one-third">
			<h3>HTML Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-html">&lt;div class=&quot;example&quot;&gt;
    &lt;section class=&quot;block1&quot;&gt;&lt;/section&gt;
    &lt;section class=&quot;block2&quot;&gt;&lt;/section&gt;
    &lt;section class=&quot;block3&quot;&gt;&lt;/section&gt;
    &lt;section class=&quot;block4&quot;&gt;&lt;/section&gt;
&lt;/div&gt;</code></pre>
			</div>
		</div>
		<div class="span-one-third">
			<h3>CSS Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-css">.example {
	display: grid; 
	grid-columns: 150px 1fr;
	grid-rows: 50px 1fr 50px;
}
.example section {
	grid-column: start end;
	grid-row: start end;
}</code></pre>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="span16">
			<?php include 'includes/grid/example.php'; ?>
		</div>
	</div>
</div>