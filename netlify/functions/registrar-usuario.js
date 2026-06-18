const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Solo permitir método POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cedula } = JSON.parse(event.body);
    
    // Validar que venga la cédula
    if (!cedula) {
      return { statusCode: 400, body: JSON.stringify({ error: 'cedula es requerido' }) };
    }

    // Conectar a MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('examen');
    const collection = db.collection('usuarios');

    // Verificar si el usuario ya existe
    const existe = await collection.findOne({ cedula });
    if (existe) {
      await client.close();
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'El usuario ya ha ingresado al examen' })
      };
    }

    // Registrar el usuario
    await collection.insertOne({
      cedula,
      estado: 'INGRESANDO',
      fechaIngreso: new Date(),
      ip: event.headers['client-ip'] || 'desconocida'
    });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Usuario registrado exitosamente' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
