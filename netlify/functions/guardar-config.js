const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fechaCierre } = JSON.parse(event.body);
    
    // Validar que venga la fecha
    if (!fechaCierre) {
      return { statusCode: 400, body: JSON.stringify({ error: 'fechaCierre es requerido' }) };
    }

    // Conectar a MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('configuracion');

    // Guardar o actualizar la configuración
    await collection.updateOne(
      { tipo: 'fecha_cierre' },
      { $set: { valor: fechaCierre, updatedAt: new Date() } },
      { upsert: true }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Configuración guardada exitosamente' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
