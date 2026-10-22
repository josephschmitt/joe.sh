<?php $month = $page->date('M'); ?>
<?php $day = $page->date('d'); ?>
<?php $year = $page->date('Y'); ?>

<?php if ($month && $day && $year): ?>
	<a class="timestamp" href="<?= $page->tinyurl(); ?>">
		<span class="month"><?= $month ?></span>
		<span class="day"><?= $day ?></span>
		<span class="year"><?= $year ?></span>
	</a>
<?php endif ?>