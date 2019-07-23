import { LaunchTile } from "../components";
import { LAUNCH_TILE_DATA } from './launches';

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches($after: after) {
            cursor
            hasMore
            launches {
                ...LaunchTile
            }
        }
    }
    ${LAUNCH_TILE_DATA}
`;

export const GET_LAUNCH_DETAILS = gql`
    query LaunchDetails($launchId: ID!) {
        launch(id: $launchId) {
            site
            rocket {
                type
            }
            ...LaunchTile
        }
    }
${LAUNCH_TILE_DATA}`;

export const LAUNCH_TILE_DATA = gql`
    fragment LaunchTile on Launch {
        id
        isBooked
        rocket {
            id
            name
        }
        mission {
            name
            missionPatch
        }
    }
`;

export default function Launches() {
    return (
        <Query query={GET_LAUNCHES}>
            {({ data, loading, error, fetchMore }) => {
                if (loading) return <Loading/>;
                if (error) return <p>ERROR</p>;

                return (
                    <Fragment>
                        <Header/>
                        {data.launches && 
                            data.launches.launches &&
                            data.launches.launches.map(launch => (
                                <LaunchTile
                                    key={launch.id}
                                    launch={launch}
                                />
                            ))}
                        {data.launches &&
                            data.launches.hasMore && (
                                <Button
                                    onClick={() => 
                                        fetchMore({
                                            variables: {
                                                after: data.launches.cursor,
                                            },
                                            updateQuery: (prev, { fetchMoreResults, ...rest}) => {
                                                if(fetchMoreResults) return prev;
                                                return {
                                                    ...fetchMoreResults,
                                                    launches: {
                                                        ...fetchMoreResults.launches,
                                                        launches: [
                                                            ...prev.launches.launches,
                                                            ...fetchMoreResults.launches.launches,
                                                        ],
                                                    },
                                                };
                                            },
                                        })
                                    }
                                >
                                    Load More
                                </Button>
                            )

                        }
                    </Fragment>
                );
            }}
        </Query>
    )
};

//NOTE: Go over the contents of the Load More Button with daddy\
//NOTE: Go over what fragments are with daddy