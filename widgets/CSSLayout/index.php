<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>CSS Layout</title>
	<meta name="description" content="">
	<meta name="author" content="Jorge del Casar">

	<!--[if lt IE 9]>
	  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<link href="./css/bootstrap.min.css" rel="stylesheet">
	<link href="./css/prettify.css" rel="stylesheet">
	<link href="./css/main.css" rel="stylesheet">
</head>

<body>

	<div class="topbar" data-scrollspy="scrollspy">
		<div class="fill">
			<div class="container">
				<a class="brand" href="#">CSS Layout</a>
				<ul class="nav">
					<li><a href="#columns">Columns</a></li>
					<li><a href="#grid">Grid</a></li>
					<li><a href="#flexbox">Flexbox</a></li>
				</ul>
			</div>
		</div>
	</div>
	
	<!-- Main hero unit for a primary marketing message or call to action -->
	<div class="jumbotron masthead">
		<div class="inner">
			<div class="container">
				<h1>CSS Layout</h1>
				<p class="lead">Test the CSS3 layout options like multi-columns, grid or flexbox.</p>
				<p>Test using <strong>Internet Explorer 10</strong>, <strong>Internet Explorer 9</strong>, <strong>Google Chrome 15</strong>, <strong>Frirefox 8</strong>, <strong>Safari 5</strong> and <strong>Opera 11</strong>.</p>
			</div>
		</div>
	</div>
	<div class="quickstart">
		<div class="container">
			<div class="row">
				<div class="span-one-third">
					<h2>Multi-column</h2>
					<p class="lead">The main benefit of using CSS-based columns is flexibility; content can flow from one column to another, and the number of columns can vary depending on the size of the viewport.</p>
					<p><a class="btn" href="#columns">View datails &raquo;</a></p>
				</div>
				<div class="span-one-third">
					<h2>Grid</h2>
					<p class="lead">As websites evolved from simple documents into complex, interactive applications, tools for document lay out, e.g. floats, were not necessarily well suited for application lay out.</p>
					<p><a class="btn" href="#grid">View details &raquo;</a></p>
				</div>
				<div class="span-one-third">
					<h2>Flexbox</h2>
					<p class="lead">Similar to other layout modes such as table layout, a flexbox acts like a block when placed into other layout modes. Inline flexboxes can also be declared, which act like inline-blocks.</p>
					<p><a class="btn" href="#flexbox">View datails &raquo;</a></p>
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		<section id="columns">
			<?php include 'includes/columns.php'; ?>
		</section>
		<section id="grid">
			<?php include 'includes/grid.php'; ?>
		</section>
		<section id="flexbox">
			<?php include 'includes/flexbox.php'; ?>
		</section>
		
		<footer>
			<p>&copy; Company 2011</p>
		</footer>
	</div> <!-- /container -->
	<script src="js/libs/jquery.min.js"></script>
	<script src="js/libs/prettify/prettify.js"></script>
	<script src="js/libs/prettify/lang-css.js"></script>
	<script src="js/libs/bootstrap/bootstrap-twipsy.js"></script>
	<script src="js/libs/bootstrap/bootstrap-tabs.js"></script>
	<script src="js/libs/bootstrap/bootstrap-popover.js"></script>
	<script src="js/libs/bootstrap/bootstrap-scrollspy.js"></script>
	
	<script src="js/main.js"></script>
</body>
</html>
