<div class="span16">
	<header class="page-header">
		<h2>Column breaks</h2>
	</header>
</div>
<div class="span16">
	<div class="alert-message block-message info">
		<p>When content is laid out in multiple columns, the user agent must determine where column breaks are placed. The problem of breaking content into columns is similar to breaking content into pages.</p>
		<p>Three new properties are introduced to allow column breaks to be described in the same properties as page breaks: <code>break-before</code>, <code>break-after</code>, and <code>break-inside</code>. These properties take the same values as <code>page-break-before</code>, <code>page-break-after</code>, and <code>page-break-inside</code> <a href="http://www.w3.org/TR/2010/WD-CSS2-20101207/page.html#page-breaks">[Page Breaks - CSS21]</a>. In addition, some new keyword values are added <a href="http://www.w3.org/TR/css3-multicol/#column-breaks">[Column breaks - CSS3]</a>.</p>
	</div>
</div>
<div class="span16">
	<?php
	$breaks = array(
		'before' => array(
			'auto' => 'Neither force nor forbid a page/column break before the generated box.',
			'always' => 'Always force a page break before the generated box.',
			'avoid' => 'Avoid a page/column break before the generated box.',
			'left' => 'Force one or two page breaks before the generated box so that the next page is formatted as a left page.',
			'right' => 'Force one or two page breaks before the generated box so that the next page is formatted as a right page.',
			'page' => 'Always force a page break before the generated box.',
			'column' => 'Always force a column break before the generated box.',
			'avoid-page' => 'Avoid a page break before the generated box.',
			'avoid-column' => 'Avoid a column break before the generated box.'
		),
		'after' => array(
			'auto' => 'Neither force nor forbid a page/column break after the generated box.',
			'always' => 'Always force a page break after the generated box.',
			'avoid' => 'Avoid a page/column break after the generated box.',
			'left' => 'Force one or two page breaks after the generated box so that the next page is formatted as a left page.',
			'right' => 'Force one or two page breaks after the generated box so that the next page is formatted as a right page.',
			'page' => 'Always force a page break after the generated box.',
			'column' => 'Always force a column break after the generated box.',
			'avoid-page' => 'Avoid a page break after the generated box.',
			'avoid-column' => 'Avoid a column break after the generated box.'
		),
		'inside' => array(
			'auto' => 'Neither force nor forbid a page/column break inside the generated box.',
			'avoid' => 'Avoid a page/column break inside the generated box.',
			'avoid-page' => 'Avoid a page break inside the generated box.',
			'avoid-column' => 'Avoid a column break inside the generated box.'
		)
	);
	$explorer_9 = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	$explorer_10 = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	$chrome = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'right'        => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'right'        => '<span class="label warning" title="Corect, but prefix is needed">-webkit</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	$firefox = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	$safari = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	$opera = array(
		'before' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'after' => array(
			'auto'         => '<span class="label">Default</span>',
			'always'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'left'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'right'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'page'         => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'column'       => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		),
		'inside' => array(
			'auto'         => '<span class="label">Default</span>',
			'avoid'        => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-page'   => '<span class="label important" title="Not correct, neither with prefix">KO</span>',
			'avoid-column' => '<span class="label important" title="Not correct, neither with prefix">KO</span>'
		)
	);
	?>
	<ul class="tabs" data-tabs="tabs">
	<?php foreach($breaks as $break => $values) { ?>
		<li<?= ($break == 'before' ? ' class="active"' : ''); ?>><a href="#column-break-<?= $break ?>"><?= $break ?></a></li>
	<?php } ?>
	</ul>
	<div class="tab-content">
		<?php foreach($breaks as $break => $values) { ?>
		<div id="column-break-<?= $break ?>"<?= ($break == 'before' ? ' class="active"' : ''); ?>>
			<ul class="pills" data-tabs="pills">
			<?php foreach($values as $value => $desc) { ?>
				<li<?= ($value == 'auto' ? ' class="active"' : ''); ?>><a href="#column-break-<?= $break ?>-<?= $value ?>"><?= $value ?></a></li>
			<?php } ?>
			</ul>
			<div class="pill-content">
			<?php foreach($values as $value => $desc) { ?>
				<article id="column-break-<?= $break ?>-<?= $value ?>"<?= ($value == 'auto' ? ' class="active"' : ''); ?>>
					<header class="page-header">
						<h1><?= $value; ?> <small><?= $desc; ?></small></h1>
					</header>
					<div class="row">
						<div class="span-one-third">
							<h3>Code example</h3>
							<div class="code">
								<pre class="prettyprint"><code class="language-css">.example .page-header {
    column-break-<?= $break ?>: <?= $value ?>;
}</code></pre>
							</div>
						</div>
						<div class="span-two-thirds">
							<h3>Compatibility</h3>
							<table class="zebra-striped">
								<thead>
									<tr>
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
										<td><?= $explorer_10[$break][$value]; ?></td>
										<td><?= $explorer_9[$break][$value]; ?></td>
										<td><?= $chrome[$break][$value]; ?></td>
										<td><?= $firefox[$break][$value]; ?></td>
										<td><?= $safari[$break][$value]; ?></td>
										<td><?= $opera[$break][$value]; ?></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<style>
					#column-break-<?= $break ?>-<?= $value ?> .example .page-header {
						-webkit-column-break-<?= $break ?>: <?= $value ?>;
						   -moz-column-break-<?= $break ?>: <?= $value ?>;
						        column-break-<?= $break ?>: <?= $value ?>;
					}
					</style>
					<?php include 'includes/columns/example.php'; ?>
				</article>
			<?php } ?>
			</div>
		</div>
		<?php } ?>
	</div>
</div>