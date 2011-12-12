<div class="span16">
	<div class="row">
		<div class="span16">
			<header class="page-header">
				<h2>Felxbox declaration</h2>
			</header>
		</div>
	</div>
	<div class="row">
		<div class="span-one-third">
			<div class="alert-message block-message info">
				<p>A flexbox item creates a new BFC. The margins of a flexbox item do not collapse with any other margin. Flexboxes "shrinkwrap" their contents by default (when their <code>width</code> or <code>height</code> properties are <code>auto</code>), similar to <code>tables</code> or <code>floats</code>.</p>
			</div>
		</div>
		<div class="span-two-thirds">
			<h3>HTML Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-html">&lt;div class=&quot;example&quot;&gt;
	&lt;button class=&quot;button1&quot;&gt;Button 1&lt;/button&gt;
	&lt;button class=&quot;button2&quot;&gt;Button 2&lt;/button&gt;
	&lt;button class=&quot;button3&quot;&gt;Button 3&lt;/button&gt;
	&lt;button class=&quot;button4&quot;&gt;Button 4&lt;/button&gt;
&lt;/div&gt;</code></pre>
			</div>
		</div>
		<div class="span8">
			<h3>CSS Code example</h3>
			<div class="code">
				<pre class="prettyprint"><code class="language-css">.example {
	display: flexbox; 
	grid-direction: tb;
}
.example button {
	margin: 0 auto;
}</code></pre>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="span16">
			<?php include 'includes/flexbox/example.php'; ?>
		</div>
	</div>
</div>