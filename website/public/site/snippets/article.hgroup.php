<?
	$columnClass = !$hero ? 'class="column"' : '';
?>

<hgroup <?= $columnClass ?>>
	<h1>
		<? if($page->link()): ?>
	    	&#8677; <a href="<?= $page->link(); ?>"><?= html($page->title()) ?></a>
	    <? else: ?>
	    	<?= kirbytext($page->title()) ?>
	    <? endif ?>
	</h1>

    <? if ($page->subtitle()): ?>
	    <h2>
	    	<?= kirbytext($page->subtitle()) ?>
	    </h2>
	<? endif ?>
</hgroup>

<? if ($hero): ?>
	<?
		$credit = $hero->credit();
		// $attribution = $hero->attribution();
		// if ($attribution && $attribution != '') {
		// 	$credit = $credit . ', ' . $attribution;
		// }
	?>

	<? if ($credit && $credit != ''): ?>
        <?= kirbytext($credit) ?>
    <? endif ?>
<? endif ?>