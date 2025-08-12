import { gql } from '@apollo/client';

const getStationQuery = gql`
query getStations {
  getStations {
    items{
      _id
      name
      slug
      title
      website
      bitrate
      stream
      tags
      # disabled
      dateAdded
      dateUpdated
    }
    # count
  }
}
`;

export default getStationQuery;
