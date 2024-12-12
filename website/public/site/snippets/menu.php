<ul>
	<? $rPages = c::get('debug') == true ? $pages->visible() : $pages->visible()->filterBy('status', 'Published') ?>
	<? foreach($rPages->flip() as $page): ?>
		<li>
			<a class="<?= $page->status() == 'Draft' ? 'draft' : '' ?>" href="<?= $page->url() ?>"><?= $page->title ?></a>
			<? if ($page->subtitle()): ?>
				<em><?= markdown($page->subtitle()) ?></em>
			<? endif ?>
			<em></em>
		</li>
	<? endforeach ?>
</ul>
