/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax */

var rides = {
    all: [],    // Main ride store for the whole app

    filter: {  // default values:
        excludeSelf: false,
        includeRides: true,
        includeRuns: false,
        includeOthers: false,
        dateRange: 7,  // days
        geoRange: 100,
        minDistance: 2,
        maxDistance: 200
    },

    arrayifyTypes: function() {
        var types = [];
        if (rides.filter.includeRides) { types.push('rides'); }
        if (rides.filter.includeRuns) { types.push('runs'); }
        if (rides.filter.includeOthers) { types.push('others'); }
        return types;
    },

    applyFilter: function() {
        // Chain all our filter functions based on the filter object's values:
        var filt1 = rides.filterSelf(rides.all);
        var filt2 = rides.filterByType(filt1);
        var filt3 = rides.filterByDateRange(filt2);
        var filt4 = rides.filterByDistance(filt3);
        return filt4;
    },

    filterSelf: function(collection) {
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            // Athlete id filtering only needed if excluding self:
            return (!rides.filter.excludeSelf || ride.athlete.id !== me.id);
        });
        console.log(filtered.length, 'matches on self');
        return filtered;
    },

    filterByType: function(collection) {
        var types = rides.arrayifyTypes();
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            return (
                (ride.type === 'Ride' && types.indexOf('rides') !== -1) ||
                (ride.type === 'Run' && types.indexOf('runs') !== -1) ||
                (ride.type !== 'Ride' && ride.type !== 'Run' && types.indexOf('others') !== -1)
            );
        });
        console.log(filtered.length, 'matches by type');
        return filtered;
    },

    filterByDateRange: function(collection) {
        // Compute start date:
        var days = rides.filter.dateRange;
        var beginTime = new Date().getTime() - (days * 24 * 60 * 60 * 1000); // X days ago

        // Do filtering:
        var filtered = collection.filter(function(ride) {
            var activityTime = new Date(ride.start_date_local).getTime();
            return (activityTime > beginTime);
        });
        console.log(filtered.length, 'matches by date');
        return filtered;
    },

    filterByDistance: function(collection) {
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            // Between min and max please:
            return (ride.distance / 1000 > rides.filter.minDistance) &&
                    (ride.distance / 1000 < rides.filter.maxDistance);
        });
        console.log(filtered.length, 'matches by distance');
        return filtered;
    }
    /*
    function filterByGeoRange(radius = 100, origin = [51.5,0]) {	// NO IDEA
        // Do filtering:
        filtered = [];
        foreach (this.data as activity) {

        }
        return filtered;
    }
    */
};
