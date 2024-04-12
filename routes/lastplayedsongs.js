const express = require('express');
var router = express.Router();

const client = require('../db/cassandra');

//Endpoint GET "/?user_id=:user_id&song_id=:song_id"
router.get('/', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Construir la consulta a partir de los parámetros de la URL. Los parámetros son opcionales
    let query = 'SELECT * FROM music.last_played_songs_by_user';
    let params = [];
    if (req.query.user_id && req.query.song_id) {
        query += ' WHERE user_id = ? AND song_id = ?';
        params = [req.query.user_id, req.query.song_id];
    } else if (req.query.user_id) {
        query += ' WHERE user_id = ?';
        params = [req.query.user_id];
    } else if (req.query.song_id) {
        query += ' WHERE song_id = ?';
        params = [req.query.song_id];
    }

    // Ejecuta una consulta a Cassandra para obtener las canciones escuchadas por un usuario
    const songs = await client.execute(query, params);

    // Responde con un JSON que contiene la canción obtenida
    res.status(200).json({result: 'OK', data: songs.rows});
}
);

//Endpoint POST "/"
router.post('/', async function(req, res, next) {
    // Se conecta a Cassandra
    client.connect()

    // Ejecuta una consulta a Cassandra para insertar una canción escuchada por un usuario. La fecha se obtiene del timestamp actual
    const song = await client.execute('INSERT INTO music.last_played_songs_by_user (user_id, user_name, song_id, song_name, artist_name, cover_url, played_at) VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()))', [req.body.user_id, req.body.user_name, req.body.song_id, req.body.song_name, req.body.artist_name, req.body.cover_url]);

    // Responde con un JSON que contiene la canción insertada
    res.status(200).json({result: 'OK', data: song.rows});
}
);

module.exports = router;