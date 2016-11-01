<?php
?>
<div id="options">
	<a name="options"><span>&rtrif;</span> Map options</a>
	<form id="map-options">
		<p>
			<input type="checkbox" name="excludeSelf"><label for="excludeSelf">Exclude self?</label>
		</p>

		<p id="type-filter">
			<label>Include:</label>
			<input type="checkbox" name="includeRides" checked><label for="includeRides" checked>rides? </label>
			<input type="checkbox" name="includeRuns"><label for="includeRuns">runs? </label>
			<input type="checkbox" name="includeOthers"><label for="includeOthers">other activities?</label>
		</p>

		<p id="date-filter">
			<label for="dateRange">Show activities from last</label>
			<input type="text" name="dateRange" size="1" value="7"><label>days</label>
		</p>

		<p id="distance-filter">
			<label for="distance">Show distances</label>
			<input type="text" name="minDistance" size="3" value="2"><label>km to</label>
			<input type="text" name="maxDistance" size="3" value="200"><label>km</label>
		</p>
	</form>
</div>

<?php
// end of form.inc.php
