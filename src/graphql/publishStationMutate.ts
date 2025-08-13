import { gql } from '@apollo/client';

const publishStationMutate = gql`
mutation publishStationMutate(
  $uuid: String!
  $slug: String!
  $title: String!
  $stream: String!
  $description: String!
  $website: String!
  $tags: [String!]!
) {
  publishStation(
    uuid: $uuid
    slug: $slug
    title: $title
    stream: $stream
    description: $description
    website: $website
    tags: $tags
  ) {
    _id
    uuid
    name
    slug
    title
    website
    bitrate
    stream
    tags
    dateAdded
    dateUpdated
    disabled
  }
}
`;

export default publishStationMutate;
