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
			<td>columns</td>
			<td><span class="label important" title="incorrect evaluation of the pseudo-algorithm">athm</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label important" title="incorrect evaluation of the pseudo-algorithm">athm</span></td>
		</tr>
		<tr>
			<td>column-width</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-count</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-gap</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-rule</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-rule-width</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-rule-style</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-rule-color</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-moz</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-span</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label warning" title="Corect, but prefix is needed">-webkit</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
		<tr>
			<td>column-fill</td>
			<td><span class="label success" title="Correct">OK</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label important" title="Not correct, neither with prefix">KO</span></td>
			<td><span class="label success" title="Correct">OK</span></td>
		</tr>
	</tbody>
</table>
<div class="alert-message block-message warning">
	<p>Both <strong>Internet Explorer 10</strong> and <strong>Opera</strong> implement everything right, but not correctly evaluate the <a href="http://www.w3.org/TR/css3-multicol/#pseudo-algorithm" target="_blank">pseudo-algorithm</a>.</p>
</div>