<?php
?>
<div id="tabs">
	<button type="button" id="friends-btn" class="button-primary">Friends</button>
	<button type="button" id="clubs-btn">Clubs</button>
	
	<form name="club-selector" style="display:none">
		<select name="clubs">
			<option value="10360">Road.cc</option>
		</select>
		<p style="display:none">You are not in any clubs :(</p>
	</form>
</div>

<h5>Activities</h5>

<div id="rides">
	<ul id="friends_rides">
		<?php
		// Get friends' rides:
		$friend_rides = $api->get("activities/following", ['per_page' => 10, 'page' => 1]);
		print_list_items($friend_rides);
		?>
	</ul>	
	<ul id="club_rides" style="display:none">
		<?php
		// Get club rides:
		$club_rides = $api->get("clubs/$club/activities", ['per_page' => 20, 'page' => 1]);
		print_list_items($club_rides);
		?>
	</ul>
</div>

<script type="text/javascript">
	// Tab-like behaviour for main buttons:
	$('#friends-btn').click(function() {
		$("#tabs").removeClass('clubs').addClass('friends');		
//		$('#club_rides').hide();
//		$('#friends_rides').show();
//		$('form[name=club-selector]').hide();
		$('#clubs-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});
	$('#clubs-btn').click(function() {
		$("#tabs").removeClass('friends').addClass('clubs');		
//		$('#friends_rides').hide();
//		$('#club_rides').show();
//		$('form[name=club-selector]').show();
		$('#friends-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});	
</script>
	
<?php
// end of lists.inc.php