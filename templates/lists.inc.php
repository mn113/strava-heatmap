<?php
?>
<div id="buttons">
	<button type="button" id="friends-btn" class="button-primary">Friends</button>
	<button type="button" id="clubs-btn">Clubs</button>
	<form name="club-selector">
		<select name="clubs"><!-- Ajax-filled -->
		</select>
		<p style="display:none">You are not in any clubs :(</p>
	</form>
</div>

<h5>Activities</h5>

<div id="rides">
	<a class="reload"></a>
	<ul class="friends-rides"><!-- Ajax-filled --></ul>
	<ul class="club-rides" data-clubid=""><!-- Ajax-filled --></ul>
	<!-- more ul.club-rides to be loaded here -->
</div>

<?php
// end of lists.inc.php
