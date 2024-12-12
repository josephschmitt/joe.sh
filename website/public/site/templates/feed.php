<?php 
	$articles = $pages->visible()->filterBy('status', 'Published');

	snippet('feed', array(
		'link'  => url(''),
		'items' => $articles,
		'descriptionField'  => 'text', 
		'descriptionLength' => false
	));
?>