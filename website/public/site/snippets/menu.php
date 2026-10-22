<ul>
	<?php $rPages = c::get('debug') == true ? $pages->visible() : $pages->visible()->filterBy('status', 'Published') ?>
	<?php foreach($rPages->flip() as $page): ?>
		<li>
			<a class="<?= $page->status() == 'Draft' ? 'draft' : '' ?>" href="<?= $page->url() ?>"><?= $page->title ?></a>
			<?php if ($page->subtitle()): ?>
				<em><?= markdown($page->subtitle()) ?></em>
			<?php endif ?>
			<em></em>
		</li>
	<?php endforeach ?>
</ul>
