/*global heatmap, renderer, ui, Zepto, , me, rides */

var filters = {};

function filter_self(exclude_self = true) {		// WORKS
    if (!exclude_self) {
        // No filtering needed if not excluding self
        return rides;
    }
    // Do filtering:
    var filtered = [];
    for (var i = 0; i < rides.length; i++) {
        var ride = rides[i];

        if (ride.athlete.id !== me.id) {
            filtered.push(ride);
        }
    }
    return filtered;
}

function filter_by_type(types = ['ride']) {		//
    // Do filtering:
    var filtered = [];
    rides.forEach(function(el) {
        if (
            (el.activity.type === 'Ride' && types.indexOf('ride') !== -1) ||
            (el.activity.type === 'Run' && types.indexOf('run') !== -1) ||
            (types.indexOf('other') !== -1)
        ) {
            filtered.push(el);
        }
    });
    return filtered;
}

function filter_by_date_range(days = 7) {		//
    // Sanitize:
    if (!days.isInteger() || days > 30 || days < 1) {
        days = 7;
    }
    // Compute start date:
    var beginTime = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000)); // X days ago

    // Do filtering:
    var filtered = [];
    rides.forEach(function(el) {
        var activityTime = new Date(el.activity.start_date_local).getTime();
        console.log(activityTime);
        if (activityTime > beginTime) {
            filtered.push(el);
        }
    });
    return filtered;
}
/*
function filter_by_geo_range(radius = 100, origin = [51.5,0]) {	// NO IDEA
    // Do filtering:
    filtered = [];
    foreach (this.data as activity) {

    }
    return filtered;
}
*/
