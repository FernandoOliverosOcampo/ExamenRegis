const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cedula, nombre, respuestas, nota, fecha } = JSON.parse(event.body);
    
    if (!cedula || !nombre || !respuestas || nota === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Datos incompletos' }) };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('resultados');

    await collection.insertOne({
      cedula,
      nombre,
      respuestas,
      nota,
      fecha: fecha || new Date()
    });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Resultado guardado exitosamente' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
