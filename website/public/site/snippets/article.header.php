<?php
	$theme = $page->theme() && $page->theme() != 'default' ? $page->theme() : '';

	//Hero
    $headerBackground = $hero && $hero->url() ? 'background-image: url(' . $hero->url() . ');' : '';
    $headerAlign = $hero && $hero->align() ? 'background-position: ' . $hero->align(). ';' : '';
    $headerFilter = $hero && $hero->filter() ? '-webkit-filter: '. $hero->filter(). '; -moz-filter: '. $hero->filter(). '; -ms-filter: '. $hero->filter(). '; filter: '. $hero->filter() : '';
	$headerStyle = $hero ? 'style="'. $headerBackground. ' '. $headerAlign .' '. $headerFilter. '"' : '';

	$headerClass = $theme . ' ' . ($hero || $gallery ? 'hero': '') . ' ' . ($gallery ? 'gallery' : '');
?>

<header class="<?= $headerClass ?>" <?= $headerStyle ?>>
	<?php snippet('logo') ?>
	
	<?php 
		snippet('article.hgroup', array(
			'hero' => $hero,
			'gallery' => $gallery
		));
	?>

    <?php 
    	snippet('article.gallery', array(
    		'gallery' => $gallery
    	));
    ?>
</header>