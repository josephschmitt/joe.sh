<? $month = $page->date('M'); ?>
<? $day = $page->date('d'); ?>
<? $year = $page->date('Y'); ?>

<? if ($month && $day && $year): ?>
	<a class="timestamp" href="<?= $page->tinyurl(); ?>">
		<span class="month"><?= $month ?></span>
		<span class="day"><?= $day ?></span>
		<span class="year"><?= $year ?></span>
	</a>
<? endif ?>