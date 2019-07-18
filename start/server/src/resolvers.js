const { paginateResults } = require('./utils');

module.exports = {
  Query: {

    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
     me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
  },

  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({ 
        launchIds,
      });

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
          ? 'trips booked successfully'
          : `the following launches could not be booked: ${launchIds.filter(
            id => !results.includes(id),
          )}`,
        launches,
      }
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const results = await dataSources.userAPI.cancelTrip({ launchId });

      if(!result)
        return {
          success: false,
          message: 'failed to cancel trip',
        };
      
      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      };
    },
  },

  Mission: {
    //make sure the default size is 'large' in case user
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },
//make sure the lowercase D in launchId does not throw an undefined error!
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id}),
  },

  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};

  //NOTES
  //Template for resolver:
  // fieldname:  (parent, args, context, info) => data

  //IMPORTANT NOTE: Right now when I type queries in the playground, all of
  // the values are null. Make sure you eventually start to see values

  //QUIESTTIONS
  //how do you know when to use curly braces for the async functions? 
  //  (ex: 'trips' and 'isBooked')
  // difference between using parenthases or curly braces when calling return?