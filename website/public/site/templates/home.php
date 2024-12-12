<? snippet('head') ?>

<header>
	<? snippet('logo') ?>
</header>
<section id="home" class="column">
	<hgroup>
		<h1 title="...but I don't work at a button factory"><?= markdown($page->greeting()) ?></h1>
		<h3><?= markdown($page->subtitle()) ?></h3>
	</hgroup>

	<nav>
		<? snippet('menu') ?>
	</nav>
</section>

<? snippet('footer') ?>
<? snippet('foot') ?>