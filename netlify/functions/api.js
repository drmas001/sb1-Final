import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;

  try {
    if (path === '/patients' && method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM patients');
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
    }

    if (path === '/patients' && method === 'POST') {
      const { name, mrn, age, gender, diagnosis, admissionDate, specialty, assignedDoctor } = JSON.parse(event.body);
      const [result] = await pool.query(
        'INSERT INTO patients (name, mrn, age, gender, diagnosis, admissionDate, specialty, assignedDoctor, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, mrn, age, gender, diagnosis, admissionDate, specialty, assignedDoctor, 'Active']
      );
      const newPatient = { id: result.insertId, ...JSON.parse(event.body), status: 'Active' };
      return {
        statusCode: 201,
        body: JSON.stringify(newPatient),
      };
    }

    // Add more API routes here...

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};