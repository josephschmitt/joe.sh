<?php
	$columnClass = !$hero ? 'class="column"' : '';
?>

<hgroup <?= $columnClass ?>>
	<h1>
		<?php if($page->link()): ?>
	    	&#8677; <a href="<?= $page->link(); ?>"><?= html($page->title()) ?></a>
	    <?php else: ?>
	    	<?= kirbytext($page->title()) ?>
	    <?php endif ?>
	</h1>

    <?php if ($page->subtitle()): ?>
	    <h2>
	    	<?= kirbytext($page->subtitle()) ?>
	    </h2>
	<?php endif ?>
</hgroup>

<?php if ($hero): ?>
	<?php
		$credit = $hero->credit();
		// $attribution = $hero->attribution();
		// if ($attribution && $attribution != '') {
		// 	$credit = $credit . ', ' . $attribution;
		// }
	?>

	<?php if ($credit && $credit != ''): ?>
        <?= kirbytext($credit) ?>
    <?php endif ?>
<?php endif ?>