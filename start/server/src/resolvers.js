module.exports = {
  Query: {
    launches: (_, __, { dataSources }) =>
      dataSources.launchAPI.getAllLaunches(),
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  }
};

  //NOTES
  //Template for resolver:
  // fieldname:  (parent, args, context, info) => data

  //IMPORTANT NOTE: Right now when I type queries in the playground, all of
  // the values are null. Make sure you eventually start to see values
