
GET 'clubs/:id'
//GET 'clubs/:id/members'
GET 'clubs/:id/activities'	// up to 200 latest club activities

GET 'athlete'				// authenticated user - i.e. me
GET 'athlete/activities'	// rides for authenticated user only
GET 'athletes/:id/stats'	// stats for authenticated user only

//GET 'athletes/:id'

//GET 'activities/:id'
GET 'activities/following'			// activity feed
GET 'activities/:id/related'		// for group rides?

//GET 'activities/:id/streams/:types'	// the ride data?
