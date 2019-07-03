const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const { resolvers } = require('./resolvers');

const launchAPI = require('./datasources/launch');
const userAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new launchAPI(),
        userAPI: new userAPI({ store }),
    }), 
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
});

//QESTION:
//What is typeDefs again?
