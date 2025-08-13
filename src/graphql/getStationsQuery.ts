import { gql } from '@apollo/client';

const getStationQuery = gql`
query getStations {
  getStations {
    items{
      _id
      name
      slug
      uuid,
      title
      website
      bitrate
      stream
      tags
      dateAdded
      dateUpdated
    }
    # count
  }
}
`;

export default getStationQuery;
