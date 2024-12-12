	<?= js('assets/scripts/main.min.js') ?>

	<? if($page->template() == 'gallery'): ?>
		<?= js('assets/scripts/gallery.min.js', true) ?>
	<? endif ?>

	<? if(c::get('debug') != 'true'): ?>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-38697886-1']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	<? endif ?>
</body>
</html>