<header class="page-header">
	<h1>Flexible Box Layout Module <small>W3C Working Draft, 22 March 2011 <a href="http://www.w3.org/TR/css3-flexbox/" target="_blank">[W3C]</a></small></h1>
</header>
<div class="alert-message error">
	<p>There are a lot of TODOs in the Working Draft. Specs not stabilizes. Incompatible in all browsers.</p>
</div>
<header class="page-header">
	<h2>Compatibility</h2>
</header>
<table class="zebra-striped">
	<thead>
		<tr>
			<th>CSS property</th>
			<th class="explorer_10">Explorer 10</th>
			<th class="explorer_9">Explorer 9</th>
			<th class="chrome">Chrome</th>
			<th class="firefox">Firefox</th>
			<th class="safari">Safari</th>
			<th class="opera">Opera</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>display: flexbox / inline-flexbox</td>
			<td><span class="label warning" title="Correct, but not standar way">-ms-box</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>flex-align</td>
			<td><span class="label warning" title="Correct, but not standar way">-ms-box</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>

		</tr>
		<tr>
			<td>flex-direction</td>
			<td><span class="label warning" title="Correct, but not standar way">-ms-box</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>flex-order</td>
			<td><span class="label warning" title="Correct, but not standar way">-ms-box</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>flex-pack</td>
			<td><span class="label warning" title="Correct, but not standar way">-ms-box</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
	</tbody>
</table>
<div class="alert-message block-message warning">
	<p><strong>Internet Explorer 10</strong> implements something similar with <code>display: -ms-box</code> in place of <code>display: flexbox</code> and properties like <code>-ms-box-*</code> instead of <code>flex-*</code>. You can see the example in <a href="http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_flex.htm" target="_blank">Internet Explorer Test Drive Hands On: CSS3 Flexible Box Layout</a></p>
</div>
<ul class="tabs" data-tabs="tabs" >
	<li class="active"><a href="#flexbox-declaration">Declaration</a></li>
</ul>
<div class="tab-content">
	<article class="active row" id="flexbox-declaration">
		<?php include 'includes/flexbox/flexbox-declaration.php'; ?>
	</article>
</div>