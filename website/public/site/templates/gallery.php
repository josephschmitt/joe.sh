<? snippet('head') ?>
<?= css('assets/styles/gallery.css') ?>

<? snippet('article.header', array(
    'hero' => null,
    'gallery' => $page->images()
)) ?>

<section class="column content">
    <? snippet('article') ?>
</section>

<? snippet('footer') ?>
<? snippet('foot') ?>