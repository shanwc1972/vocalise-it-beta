import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
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
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedClips {
          _id
          title
          description
          userId
          duration
          audioURL
          format
          date
        }
        clipCount
      }
    }
  }
`;

export const SAVE_CLIP = gql`
  mutation SaveClip($input: SavedClipInput!) {
    saveClip(input: $input) {
      _id
      username
      email
      savedClips {
        _id
        title
        description
        userId
        duration
        audioURL
        format
        date
      }      
      clipCount
    }
  }  
`;

export const REMOVE_CLIP = gql`
  mutation RemoveClip($clipId: ID!) {
    removeClip(clipId: $clipId) {
      _id
      username
      email
      savedClips {
        _id
        title
        description
        userId
        duration
        audioURL
        format
        date
      }      
      clipCount
    }
  }  
`;

export const SAVE_AUDIO = gql`
mutation SaveAudio($audioData: String!) {
  saveAudio(audioData: $audioData) {
    success
    message
    fileUrl
  }
}
`;