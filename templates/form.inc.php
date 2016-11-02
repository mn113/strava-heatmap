<?php
?>
<div id="options">
	<a name="options"><span>&rtrif;</span> Map options</a>
	<form id="map-options">
		<p id="type-filter">
			<label>Include:</label>
			<input type="checkbox" name="includeRides" checked><label for="includeRides" checked>rides? </label>
			<input type="checkbox" name="includeRuns"><label for="includeRuns">runs? </label>
			<input type="checkbox" name="includeOthers"><label for="includeOthers">other activities?</label>
		</p>

		<p id="self-filter">
			<input type="checkbox" name="excludeSelf"><label for="excludeSelf">Exclude self?</label>
		</p>

		<p id="date-filter">
			<label for="dateRange">Show activities from last</label>
			<input type="number" name="dateRange" size="1" value="7" min="1" max="14" step="1"><label>days</label>
		</p>

		<p id="distance-filter">
			<label for="minDistance">Minimum distance:</label>
			<input type="number" name="minDistance" size="3" value="2" min="0" max="499" step="1"><label>km</label>
			<br>
			<label for="maxDistance">Maximum distance:</label>
			<input type="number" name="maxDistance" size="3" value="200" min="1" max="500" step="1"><label>km</label>
		</p>
	</form>
</div>

<?php
// end of form.inc.php
