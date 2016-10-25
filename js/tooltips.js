function createTooltip(origin, e, content) {	// {x:x, y:y}, e, {rideId:, title:, date:, dist:, elev: athlete:, avatar:}

	console.log("Creating TT:", content.rideId);
	
	var el = document.createElement('div');
	el.classList.add('tooltip');
	
	// Activity name
	// Date
	// Distance
	// Athlete name(s)
	// Athlete avatar(s)		
	el.innerHTML = `
		<h6>${content.title}</h6>
		<img class='avatar' src='${content.avatar}'>
		<span class='date'>${content.date}</span>
		<span class='athlete'>${content.athlete}</span>
		<br>
		<span class='dist'>${content.dist}</span>
		<span class='elev'>${content.elev}</span>
		<a class="close" onclick='destroyTooltips();'>X</a>
	`;

	// Insert:
	$('body').append(el);
	
	// Position tooltip triangle point on click:
	el.style.left = origin.x - ($(el).width() / 2) + 'px';
	el.style.top = origin.y - $(el).height() - 10 + 'px';	

	// GMaps Infowindow:
	heatmap.infowindow = new google.maps.InfoWindow({
          content: el.innerHTML
    });
    heatmap.infowindow.open(map, new google.maps.LatLng(e.latLng));

}

function destroyTooltips() {
	var divs = document.getElementsByClassName('tooltip');
	[].forEach.call(divs, function(item) {
		item.parentNode.removeChild(item);
	});
	
	if (heatmap.infowindow) heatmap.infowindow.close;
}
