<?php
?>
<div id="options">
	<a name="options"><span>&rtrif;</span> Map options</a>
	<form name="map-options">
		<input type="checkbox" name="exclude-self" checked><label for="exclude-self">Exclude self?</label>
		<br>
		
		<label>Include:</label>
		<input type="checkbox" name="include-rides" checked><label for="exclude-self" checked>rides? </label>
		<input type="checkbox" name="include-runs"><label for="exclude-self">runs? </label>
		<input type="checkbox" name="include-others"><label for="exclude-self">other activities?</label>
		<br>
		
		<label for="date-range">Show activities from last</label>
		<input type="text" name="date-range" size="1" value="1"><label>weeks</label>
		<br>
		
		<label for="geo-range">Show only activities within</label>
		<input type="text" name="geo-range" size="3" value="100"><label>km of me</label>

		<label for="distance">Show distances</label>
		<input type="text" name="min-distance" size="3" value="2"><label>km to</label>
		<input type="text" name="max-distance" size="3" value="200"><label>km</label>
	</form>
</div>

<script type="text/javascript">
	// Options form behaviour:
	$('#options a[name=options]').click(function() {
		var form = $('form[name=map-options]');

		if ($(form).hasClass("open")) {
			$(form).removeClass("open");
			$(this).children('span').html("&rtrif;");	// icon ▸ (closed)
		}
		else {
			$(form).addClass("open");
			$(this).children('span').html("&dtrif;");	// icon ▾ (open)
		}
	});
</script>

<?php
// end of form.inc.php