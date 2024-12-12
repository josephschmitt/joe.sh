<? 

// find the open/active page on the first level
$open  = $pages->findOpen();
$items = ($open) ? $open->children()->visible() : false; 

?>
<? if($items && $items->count()): ?>
<nav class="submenu">
  <ul>
    <? foreach($items AS $item): ?>
    <li><a<? echo ($item->isOpen()) ? ' class="active"' : '' ?> href="<? echo $item->url() ?>"><? echo html($item->title()) ?></a></li>
    <? endforeach ?>            
  </ul>
</nav>
<? endif ?>
