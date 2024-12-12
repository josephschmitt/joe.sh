$(document).ready(function() {
    var w_width = 520;
    var w_height = 350;

	//Twitter & ADN popups
	$('#twitter, #adn').click(function(e) {
		e.preventDefault();
        var popup_options = 'menubar=no,toolbar=no,width='+w_width+',height='+w_height+',left=' + (window.screenX + $('body').width()/2 - w_width/2) + ', top='+(window.screenY + 80);
		window.open(e.target.getAttribute('href'), '', popup_options);
	});
});