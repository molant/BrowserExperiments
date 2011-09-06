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
                    <?php
                        echo "<h1>".get_the_title()."</h1>";
                        echo "<p>".get_the_title()."</p>";
                    ?>

					<div class="big-container">
                        <div class="posts-container">
                            <?php 
                                $post_array = get_posts(); 
                                
                                foreach($post_array as $post){
                                    $tags = wp_get_post_tags($post->ID, array( 'fields' => 'names' ));
                                    $url = get_permalink($post->ID);
                                    //echo "<div class=\"post-container\"><img src=\"".get_the_post_thumbnail($post->ID)."\"/>";
                                    echo "<div class=\"post-container\">";
                                    echo "<a href=\"".$url."\">";
                                    echo "<img src=\"".get_the_post_thumbnail($post->ID)."\" onerror=\"this.src='../images/blank-placeholder.png';\"/>";
                                    echo "</a>";
                                    echo "<h2><a href=\"".$url."\">";
                                    echo $post->post_title;
                                    echo "</h2></a>";
                                    echo "<p><b>Tags:</b> ".implode(", ",$tags)."</p></div>";
                                }
                            ?>                            
                        </div>
                        <div class="categories-container">
                            <h1>Categories</h1>
                            <?php 
                                $tags = wp_tag_cloud(array('format'=>'array', 'taxonomy' => 'post_tag'));
                                //http://localhost:39746/learn/?tag=deep-zoom
                                foreach($tags as $tag){
                                    $strippedTag = strip_tags($tag);
                                    $query = new WP_Query( 'tag='.$strippedTag );                                    
                                    echo "<p><a href=\"?tag=".$strippedTag."\">".$strippedTag." <span class=\"count\">(".$query->found_posts.")</span></a></p>";
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