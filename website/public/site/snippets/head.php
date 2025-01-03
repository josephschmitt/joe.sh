<!DOCTYPE html>
<html lang="en">
<head>
	<title><?= html($page->title()) ?><?= !$pages->active()->isHomePage() ? ' — ' . html($site->title()) : '' ?></title>
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<meta charset="utf-8" />
	<meta name="description" content="<?= $pages->active()->isHomePage() ? html($site->description()) : excerpt($page->title(), 256). '. ' . excerpt($page->subtitle(), 256). ' — ' . html($site->title()) ?>" />
	<meta name="keywords" content="<?= html($site->keywords()) ?>" />
	<meta name="robots" content="index, follow" />
	
	<link rel="shortcut icon" href="assets/images/favicon.ico">
	<link rel="alternate" type="application/rss+xml" href="<?php echo url('feed') ?>" title="RSS Feed" />
	<link rel="me" href="https://hachyderm.io/@josephschmitt">
	<link rel="me" href="https://mastodon.cloud/@joe">

	<?= css('assets/styles/styles.css') ?>

	<? if($page->template() == 'default'): ?>
		<? if($page->code()): ?>
		  <?= css('assets/styles/themes/tomorrow.css') ?>
		<? endif ?>
	<? endif ?>
</head>
<body>
