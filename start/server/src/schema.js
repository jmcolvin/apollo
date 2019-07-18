const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query {
        launches(
            pageSize: Int
            after: String
        ): LaunchConnection!
        launch(id: ID!): Launch
        me: User
    }
    
    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type LaunchConnection { # add this below the Query type as an additional type.
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }

    type Launch {
        id: ID!
        site: String!
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]
    }

    type Mission {
        name: String
        missionPatch(mission: String, size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    } 

    type Mutation {
        #if false, booking trips failed, -- check errors
        bookTrips(launchIds: [ID]!): TripUpdateResponse!

        #if false, cancellation failed -- check errors
        cancelTrip(launch: ID!): TripUpdateResponse!

        login(email: String): String #login token
    }

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
    `;

module.exports = typeDefs;


//QUESTIONS:
//"caching"? (used to descibe apollo data source class)
//

//"resolver"?

//enum? is a scalar type that allows you to do 2 things:
//  1) validating that any argument of this type is one of the allowed values
//  2) communicate through the type system that a field will always 
//     be one of a finite set of values

//primitive type? Contains a pure simple value 
//(ex: ID, String, Boolean, Int, etc.)

//NOTES:
//the exclamation mark (!) means that the field is non-nullable

//Mutation type- is an entry point into our graph for modifying data

//Main theme of gql: queries and mutations

//Keep an eye on which fields are non-nullable 
//and which ones aren't. Try to find out why
