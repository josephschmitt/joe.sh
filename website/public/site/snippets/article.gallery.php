<?php if($gallery): ?> 
	<div class="media">
	    <ul>
	        <?php foreach($gallery as $image): ?>
	            <?php
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
	        <?php endforeach ?>
	    </ul>
	</div>
<?php endif ?>