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
    const collection = db.collection('configuracion');

    // Obtener la configuración de fechas del examen
    const config = await collection.findOne({ tipo: 'fechas_examen' });

    await client.close();

    // Si no hay configuración, retornar valores por defecto
    const fechaInicio = config ? config.fechaInicio : '2026-06-01T00:00:00';
    const fechaFin = config ? config.fechaFin : '2026-06-17T19:59:59';

    return {
      statusCode: 200,
      body: JSON.stringify({ fechaInicio, fechaFin })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
