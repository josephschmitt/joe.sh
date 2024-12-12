if ($('.media ul').children().length > 1) {
	$('.media').isotope({
		// options
		itemSelector : 'li',
		layoutMode : 'masonryHorizontal',
		containerStyle: {
			position: 'absolute'
		},
		resizesContainer: false
	});
}