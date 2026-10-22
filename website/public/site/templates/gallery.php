<?php snippet('head') ?>
<?= css('assets/styles/gallery.css') ?>

<?php snippet('article.header', array(
    'hero' => null,
    'gallery' => $page->images()
)) ?>

<section class="column content">
    <?php snippet('article') ?>
</section>

<?php snippet('footer') ?>
<?php snippet('foot') ?>