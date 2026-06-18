const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Solo permitir método GET
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Conectar a MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('usuarios');

    // Obtener todos los usuarios
    const usuarios = await collection.find({}).sort({ fechaIngreso: -1 }).toArray();

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ usuarios })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
