import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const messagingPlatformDefs : DocumentNode = gql`#graphql
input InputMessagingPlatform{
  name: String
  slug: String
}

type MessagingPlatform{
  id:Int
  name: String
  slug: String
  level: Int
}


type MessagingPlatformEdge {
  node: MessagingPlatform
  cursor: String
}

type MessagingPlatformList {
  message: String
  data: [MessagingPlatformEdge]
  page_info: PageInfo
}

extend type Query{
  messagingPlatforms(first: Int, last: Int, after: String, before: String): MessagingPlatformList
}
`;
