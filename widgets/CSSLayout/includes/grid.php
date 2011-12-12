<header class="page-header">
	<h1>CSS Grid Layout <small>W3C Candidate Recommendation 12 April 2011 <a href="http://www.w3.org/TR/css3-grid-layout/" target="_blank">[W3C]</a></small></h1>
</header>
<div class="alert-message error">
	<p>There are a lot of TODOs in the Working Draft. Specs not stabilizes. Incompatible in most browsers.</p>
</div>
<header class="page-header">
	<h2>Compatibility</h2>
</header>
<table class="zebra-striped">
	<thead>
		<tr>
			<th>CSS property</th>
			<th class="explorer10">Explorer 10</th>
			<th class="explorer9">Explorer 9</th>
			<th class="chrome">Chrome</th>
			<th class="firefox">Firefox</th>
			<th class="safari">Safari</th>
			<th class="opera">Opera</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>display: grid / inline-grid</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-columns</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-rows</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-row-span / grid-column-span</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-row-sizing / grid-column-sizing</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-row-align / grid-column-align</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-cell</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-template</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-flow</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
		<tr>
			<td>grid-layer</td>
			<td><span class="label warning" title="Corect, but prefix is needed">-ms</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
		</tr>
	</tbody>
</table>
<ul class="tabs" data-tabs="tabs" >
	<li class="active"><a href="#grid-declaration">Declaration</a></li>
	<li><a href="#grid-columns">Columns</a></li>
</ul>
<div class="tab-content">
	<article class="active row" id="grid-declaration">
		<?php include 'includes/grid/grid-declaration.php'; ?>
	</article>
	<article class="row" id="grid-columns">
		<?php include 'includes/grid/grid-columns.php'; ?>
	</article>
</div>