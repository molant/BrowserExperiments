<?php
/**
 * Header Template
 *
 * The header template is generally used on every page of your site. Nearly all other
 * templates call it somewhere near the top of the file. It is used mostly as an opening
 * wrapper, which is closed with the footer.php file. It also executes key functions needed
 * by the theme, child themes, and plugins. 
 *
 * @package Hybrid
 * @subpackage Template
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta http-equiv="Content-Type" content="<?php bloginfo( 'html_type' ); ?>; charset=<?php bloginfo( 'charset' ); ?>" />
<title><?php hybrid_document_title(); ?></title>

<link rel="stylesheet" href="http://<?php getenv('HTTP_HOST'); ?>/browserexperiments.css" type="text/css" media="all" />
<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="all" />
<script src="http://<?php getenv('HTTP_HOST'); ?>/Common/modernizr-2.0.js"></script>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<?php wp_head(); // wp_head ?>

</head>

<body class="<?php hybrid_body_class(); ?>">

<?php do_atomic( 'before_html' ); // hybrid_before_html ?>

<?php do_atomic( 'before_header' ); // hybrid_before_header ?>
<header>
	
		<a href="shims/">Shims &amp; Polyfills</a>
		<a href="widgets/">Widgets &amp; UI</a>
		<a href="sites/">Complete Experiences</a>
		<a href="http://github.com/molant/BrowserExperiments" class="git" title="Fork me on GitHub" target="_blank"></a>
		<?php //do_atomic( 'header' ); // hybrid_header ?>
</header>
<?php do_atomic( 'after_header' ); // hybrid_after_header ?>

<div id="container">

		<?php do_atomic( 'before_container' ); // hybrid_before_container ?>