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
    return client.query('SELECT id, title FROM specialists LIMIT 5');
  })
  .then(res => {
    console.log('Specialists:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
