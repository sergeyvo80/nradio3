import { gql } from '@apollo/client';

export const GET_STATIONS_QUERY = gql`
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
