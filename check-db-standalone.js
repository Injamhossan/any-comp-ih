const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'injam33',
  host: 'localhost',
  port: 5432,
  database: 'anycompdb',
});

console.log('Attempting to connect to database...');

client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Database time:', res.rows[0].now);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
