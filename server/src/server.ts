import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  console.log('Listagem');

  res.json([
    'Diego',
    'Daniel',
    'Santos',
    'Cleiton'
  ]);
});

app.listen(3333);