import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query allusers{
      users {
        _id
        username
        email
        savedClips {
          _id
          title
          description
          userId
          duration
          audioUrl
          format
          date
        }
        clipCount
      }
    }
`;
      
export const QUERY_ME = gql`
  query Me{
    me {
      _id
      username
      email
      savedClips {
        _id
        title
        description
        userId
        duration
        audioUrl
        format
        date
      }
      clipCount
    }
  }  
`;

export const QUERY_USER = gql`
    query User($username: String!) {
      user(username: $username) {        
        _id
        username
        email
        savedClips {
          _id
          title
          description
          userId
          duration
          audioUrl
          format
          date
        }
        clipCount
      }
    }
  `;
  export const QUERY_GETCLIPS = gql`
  query getClips($username: String!) {
    getClips(username: $username) {
      _id
      title
      description
      userId
      duration
      audioUrl
      format
      date
    }
  }
  `;        