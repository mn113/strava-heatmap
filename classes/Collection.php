<?php
	
class StravaCollection {
	
	public $data;

	public function __construct($data) {
		$this->data = $data;
	}

	public function filter_self($exclude_self = true) {		// WORKS
		if (!$exclude_self) {
			// No filtering needed if not excluding self
			return $this->data;
		}
		// Do filtering:
		$filtered = [];
		global $me;
		foreach ($this->data as $activity) {
			if ($activity->athlete->id !== $me->id) {
				$filtered[] = $activity;				
			}
		}
		return $filtered;
	}

	public function filter_by_type($types = ['ride']) {		// WORKS
		// Do filtering:
		$filtered = [];
		foreach ($this->data as $activity) {
			PC::debug($activity->type, 'activity');
			if (
				($activity->type == 'Ride' && in_array('ride', $types)) ||
				($activity->type == 'Run' && in_array('run', $types)) ||
				(in_array('other', $types))
			) {
				$filtered[] = $activity;
			}
		}
		return $filtered;
	}

	public function filter_by_date_range($days = 7) {		// WORKS
		// Sanitize:
		if (!is_int($days) || $days > 30 || $days < 1) {
			$days = 7;
		}
		// Compute start date:
		$beginning = strtotime('-'.$days.'days');
		PC::debug($beginning, 'beginning');

		// Do filtering:
		$filtered = [];
		foreach ($this->data as $activity) {
			PC::debug(strtotime($activity->start_date_local), 'activity date');			
			if (strtotime($activity->start_date_local) > $beginning) {
				$filtered[] = $activity;
			}
		}		
		return $filtered;
	}

	public function filter_by_geo_range($radius = 100, $origin = [51.5,0]) {	// NO IDEA
		// Do filtering:
		$filtered = [];
		foreach ($this->data as $activity) {
			
		}		
		return $filtered;
	}

}
