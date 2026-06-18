const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cedula } = JSON.parse(event.body);
    
    if (!cedula) {
      return { statusCode: 400, body: JSON.stringify({ error: 'cedula es requerido' }) };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('usuarios');

    const resultado = await collection.deleteOne({ cedula });

    await client.close();

    if (resultado.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Usuario no encontrado' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Usuario eliminado exitosamente',
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
