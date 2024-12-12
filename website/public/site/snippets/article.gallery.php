<? if($gallery): ?> 
	<div class="media">
	    <ul>
	        <? foreach($gallery as $image): ?>
	            <?
	                $ratio = $image->width()/$image->height();
	                if ($ratio >= 1.3) {
	                    $imgClass = 'land';
	                }
	                else if ($ratio <= .77) {
	                    $imgClass = 'port';
	                }
	                else {
	                    $imgClass = 'sq';
	                }
	            ?>

	            <li style="background-image: url(<?= $image->url() ?>)" class="<?= $imgClass ?>"></li>
	        <? endforeach ?>
	    </ul>
	</div>
<? endif ?>