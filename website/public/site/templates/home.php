<?php snippet('head') ?>

<header>
	<?php snippet('logo') ?>
</header>
<section id="home" class="column">
	<hgroup>
		<h1 title="...but I don't work at a button factory"><?= markdown($page->greeting()) ?></h1>
		<h3><?= markdown($page->subtitle()) ?></h3>
	</hgroup>

	<nav>
		<?php snippet('menu') ?>
	</nav>
</section>

<?php snippet('footer') ?>
<?php snippet('foot') ?>