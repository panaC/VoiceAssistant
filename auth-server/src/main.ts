import { NAME_SERVER } from './../../opds-server/src/constants';
import { PORT_SERVER, PROTOCOL_SERVER, DOMAIN_SERVER } from './constants';

import express = require('express');
import { randomBytes } from 'crypto';

export const app = express();
app.set('PORT', PORT_SERVER);
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send(NAME_SERVER);
});

app.get('/auth', (req, res) => {
  let query: string = '';
  for (const key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      query += `${key.toString()}=${req.query[key]}&`;
    }
  }
  res.render('pages/login', { urlToSubmit: `${PROTOCOL_SERVER}://${DOMAIN_SERVER}:${PORT_SERVER}/auth?${query}`});
});

app.post('/auth', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  const token = randomBytes(64).toString('hex');
  if (req.query.redirect_uri && req.query.state) {
    res.redirect(`${req.query.redirect_uri}access_token=${token}&token_type=bearer&state=${req.query.state}`);
  }
  res.send('logged');
});

app.listen(app.get('PORT'), () => {
  // tslint:disable-next-line:no-console
  console.log('Listen on port', app.get('PORT'));
});
