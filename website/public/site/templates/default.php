<? snippet('head') ?>

<? snippet('article.header', array(
	'hero' => $page->files()->find('hero.jpg'),
	'gallery' => null
)) ?>

<section class="column content">
	<? snippet('article') ?>
</section>

<? snippet('footer') ?>
<? snippet('foot') ?>