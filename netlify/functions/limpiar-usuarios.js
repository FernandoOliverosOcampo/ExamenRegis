const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Solo permitir método DELETE
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Conectar a MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('usuarios');

    // Eliminar todos los usuarios
    const resultado = await collection.deleteMany({});

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Usuarios eliminados exitosamente',
        eliminados: resultado.deletedCount 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
