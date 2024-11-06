const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    console.error("GraphQL Error:", err);
    return err;
  },
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post('/save-audio', (req, res) => {
    console.log('Attempting to save audio');
    const audioData = req.body.audioData;  // base64 encoded audio data
    const buffer = Buffer.from(audioData, 'base64');
    const filePath = path.join(__dirname, 'output.mp3');

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Error saving audio:', err);
            return res.status(500).send('Error saving audio file');
        }
        res.send('Audio file saved');
    });
  });
  
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } 

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();