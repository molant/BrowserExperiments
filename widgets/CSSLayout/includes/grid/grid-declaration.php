<div class="span16">
	<div class="row">
		<div class="span16">
			<header class="page-header">
				<h2>Grid declaration</h2>
			</header>
		</div>
	</div>
	<div class="row">
		<div class="span-one-third">
			<div class="alert-message block-message info">
				<p>A Grid element is declared by setting the <code>display</code> property.</p>
				<p>The values are:</p>
				<dl>
					<dt>grid</dt>
					<dd>A value of grid causes an element to display as a block-level Grid element.</dd>
					<dt>inline-grid</dt>
					<dd>A value of inline-grid causes an element to display as an inline-level Grid element.</dd>
				</dl>
			</div>
		</div>
		<div class="span-one-third">
			<h3>HTML Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-html">&lt;div class=&quot;example&quot;&gt;
   &lt;header&gt;&lt;/header&gt;
   &lt;aside&gt;&lt;/aside&gt;
   &lt;section&gt;&lt;/section&gt;
   &lt;footer&gt;&lt;/footer&gt;
&lt;/div&gt;</code></pre>
			</div>
		</div>
		<div class="span-one-third">
			<h3>CSS Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-css">.example {
   display: grid; 
   grid-columns: 300px 1fr;
   grid-rows: 100px 1fr 50px;
}
.example header {
   grid-column: 1;
   grid-row: 1;
   grid-column-span:2;
}
.example aside {
   grid-column: 1;
   grid-row: 2;
}
.example section {
   grid-column: 2;
   grid-row: 2;
}
.example header {
   grid-column: 1;
   grid-row: 3;
   grid-column-span:2;
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