<?php
?>
<div id="buttons">
	<button type="button" id="friends-btn" class="button-primary">Friends</button>
	<button type="button" id="clubs-btn">Clubs</button>
	<form name="club-selector">
		<select name="clubs">
			<?php
			//foreach ($clubs as $club) {
			//	echo '<option value="'.$club->id.'">'.$club->name.'</option>';
			//}
			?>
		</select>
		<p style="display:none">You are not in any clubs :(</p>
	</form>
</div>	

<h5>Activities</h5>

<div id="rides">
	<ul id="friends_rides">
		<?php
		// Get friends' rides: 	// RUN THIS ONE IMMEDIATELY - IF USER CONNECTED
		$friend_rides = $api->get("activities/following", ['per_page' => 20, 'page' => 1]);
		echo print_list_items($friend_rides);
		
		?>
	</ul>
	<ul class="club_rides" data-clubid="">
		<?php
		// GOING TO EXCISE THIS - LOADING WILL BE BY AJAX ONLY
		// Get club rides:		// RUN THIS ONE VIA AJAX
//		$club_rides = $api->get("clubs/".$clubs[0]->id."/activities", ['per_page' => 30, 'page' => 1]);
//		echo print_list_items($club_rides);
		?>
	</ul>
	<!-- more ul.club_rides to be loaded here -->
</div>
	
<?php
// end of lists.inc.php