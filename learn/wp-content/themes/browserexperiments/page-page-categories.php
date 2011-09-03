<?php
/**
 * Template Name: Page Categories
 *
 * The Sitemap template is a page template that creates and HTML-based sitemap of your
 * site, listing nearly every page of your site. It lists your feeds, pages, archives, and posts.
 *
 * @package Hybrid
 * @subpackage Template
 * @link http://themehybrid.com/themes/hybrid/page-templates/sitemap
 * @deprecated 0.9.0 This template will eventually be moved to the Hybrid page templates pack.
 */

get_header(); // Loads the header.php template. ?>

	<div id="content" class="hfeed content">

		<?php //do_atomic( 'before_content' ); // hybrid_before_content ?>

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<div id="post-<?php the_ID(); ?>" class="<?php hybrid_entry_class(); ?>">

				<?php //do_atomic( 'before_entry' ); // hybrid_before_entry ?>

				<div class="entry-content">

					<div class="big-container">
                        <div class="posts-container">
                            <?php 
                                $post_array = get_posts(); 
                                
                                foreach($post_array as $post){
                                    $tags = wp_get_post_tags($post->ID, array( 'fields' => 'names' ));                                    
                                    //echo "<div class=\"post-container\"><img src=\"".get_the_post_thumbnail($post->ID)."\"/>";
                                    echo "<div class=\"post-container\"><img src=\"http://localhost:39746/learn/wp-content/uploads/2011/09/blank-placeholder.png\"/>";                                    
                                    echo "<h2>".$post->post_title."</h2>";
                                    echo "Tags: ".implode(", ",$tags)."</div>";
                                }
                            ?>                            
                        </div>
                        <div class="categories-container">
                            <h1>Categories</h1>
                            <?php 
                                $tags = wp_tag_cloud(array('format'=>'array', 'taxonomy' => 'post_tag'));
                                foreach($tags as $tag){
                                    echo $tag." (".$tag->count.")";
                                    echo "<br/>";
                                }
                            ?>
                        </div>
                        
                    </div>	


					<?php //wp_link_pages( array( 'before' => '<p class="page-links pages">' . __( 'Pages:', hybrid_get_textdomain() ), 'after' => '</p>' ) ); ?>

				</div><!-- .entry-content -->

				<?php //do_atomic( 'after_entry' ); // hybrid_after_entry ?>

			</div><!-- .hentry -->

			<?php do_atomic( 'after_singular' ); // hybrid_after_singular ?>		

			<?php endwhile; ?>

		<?php else: ?>

			<?php get_template_part( 'loop-error' ); // Loads the loop-error.php template. ?>

		<?php endif; ?>

		<?php do_atomic( 'after_content' ); // hybrid_after_content ?>

	</div><!-- .content .hfeed -->

<?php get_footer(); // Loads the footer.php template. ?>