<?php snippet('head') ?>

<?php snippet('article.header', array(
	'hero' => $page->files()->find('hero.jpg'),
	'gallery' => null
)) ?>

<section class="column content">
	<?php snippet('article') ?>
</section>

<?php snippet('footer') ?>
<?php snippet('foot') ?>