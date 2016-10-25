<?php
?>
<div id="options">
	<button type="button" id="friends-btn" class="button-primary">Friends</button>
	<button type="button" id="clubs-btn">Clubs</button>
	
	<form name="club-selector" style="display:none">
		<label for="clubs">Your Clubs:</label>
		<select name="clubs">
			<option value="10360">Road.cc</option>
		</select>
		<p style="display:none">You are not in any clubs :(</p>
	</form>
	
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
	</form>
</div>

<script type="text/javascript">
	// Tab-like behaviour for main buttons:
	$('#friends-btn').click(function() {
		$('#club_rides').hide();
		$('#friends_rides').show();
		$('form[name=club-selector]').hide();
		$('#clubs-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});
	$('#clubs-btn').click(function() {
		$('#friends_rides').hide();
		$('#club_rides').show();
		$('form[name=club-selector]').show();
		$('#friends-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});	
</script>

<?php
// end of form.inc.php