const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

client
  .connect()
  .then(() => {
    console.log('Connected successfully');
    return client.end();
  })
  .catch((err) => {
    console.error('Connection error', err.message);
    process.exit(1);
  });

//   node test-db-connection.js
