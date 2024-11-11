const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    savedClips: [VoiceClip]!
    clipCount: Int
    isSubscribed: Boolean
  }

  type VoiceClip {
    _id: ID!
    title: String!
    description: String
    userId: ID!
    duration: Int!
    audioURL: String!
    format: String!
    date: String!
  }

  type SaveAudioResponse {
    success: Boolean!
    message: String
    fileUrl: String
  }

  type Checkout {
    sessionId: ID
  }

  input SavedClipInput {
    title: String!
    description: String
    userId: ID!
    duration: Int!
    audioURL: String!
    format: String!
    date: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    password: String
  }

  input UpdateClipInput {
    title: String
    description: String
    duration: Int
    audioUrl: String
    format: String
    date: String!
  }

  type Query {
    users: [User]!
    user(username: String!): User
    me: User
    getClips(username: String!): [VoiceClip]
    getSubscription: Checkout
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    removeClip(clipId: ID!): User
    saveClip(input: SavedClipInput!): User
    saveAudio(audioData: String!): SaveAudioResponse!
  }

  type Auth {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
