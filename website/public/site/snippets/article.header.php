<?
	$theme = $page->theme() && $page->theme() != 'default' ? $page->theme() : '';

	//Hero
    $headerBackground = $hero && $hero->url() ? 'background-image: url(' . $hero->url() . ');' : '';
    $headerAlign = $hero && $hero->align() ? 'background-position: ' . $hero->align(). ';' : '';
    $headerFilter = $hero && $hero->filter() ? '-webkit-filter: '. $hero->filter(). '; -moz-filter: '. $hero->filter(). '; -ms-filter: '. $hero->filter(). '; filter: '. $hero->filter() : '';
	$headerStyle = $hero ? 'style="'. $headerBackground. ' '. $headerAlign .' '. $headerFilter. '"' : '';

	$headerClass = $theme . ' ' . ($hero || $gallery ? 'hero': '') . ' ' . ($gallery ? 'gallery' : '');
?>

<header class="<?= $headerClass ?>" <?= $headerStyle ?>>
	<? snippet('logo') ?>
	
	<? 
		snippet('article.hgroup', array(
			'hero' => $hero,
			'gallery' => $gallery
		));
	?>

    <? 
    	snippet('article.gallery', array(
    		'gallery' => $gallery
    	));
    ?>
</header>