const express = require('express');
var router = express.Router();

const client = require('../db/cassandra');

// Endpoint GET "/"
router.get('/', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para obtener todos los usuarios
    const users = await client.execute('SELECT * FROM music.users');

    // Responde con un JSON que contiene los usuarios obtenidos
    res.status(200).json({result: 'OK', data: users.rows});
}
);

// Endpoint GET "/:id"
router.get('/:id', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para obtener un usuario por su ID
    const user = await client.execute('SELECT * FROM music.users WHERE id = ?', [req.params.id]);

    // Responde con un JSON que contiene el usuario obtenido
    res.status(200).json({result: 'OK', data: user.rows});
} 
);

// Endpoint POST "/"
router.post('/', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para insertar un usuario
    const user = await client.execute('INSERT INTO music.users (id, name, email) VALUES (?, ?, ?)', [req.body.id, req.body.name, req.body.email]);

    // Responde con un JSON que contiene el usuario insertado
    res.status(200).json({result: 'OK', data: user.rows});
}
);

// Endpoint PUT "/:id"
router.put('/:id', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para actualizar un usuario por su ID
    const user = await client.execute('UPDATE music.users SET name = ?, email = ? WHERE id = ?', [req.body.name, req.body.email, req.params.id]);

    // Responde con un JSON que contiene el usuario actualizado
    res.status(200).json({result: 'OK', data: user.rows});
}
);

// Endpoint DELETE "/:id"
router.delete('/:id', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para eliminar un usuario por su ID
    const user = await client.execute('DELETE FROM music.users WHERE id = ?', [req.params.id]);

    // Responde con un JSON que contiene el usuario eliminado
    res.status(200).json({result: 'OK', data: user.rows});
}
);

module.exports = router;