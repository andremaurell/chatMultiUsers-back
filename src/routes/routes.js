const { userMiddleware } = require('../utils/userMiddleware')
const { app, server, io, pool } = require('../../index')

const router = require('express').Router()



router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const { user } = req;

    try {
        if (user) {
            if (user.password === password) {
                res.status(200).send({ username: user.username, id: user.id })
            } else {
                res.status(401).send({ message: 'Senha incorreta' })
            }
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const existingUser = req.user;

    if (existingUser) {
        return res.status(400).send({ message: 'Usuário já existe' })
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        )

        const newUser = result.rows[0]

        res.status(201).send({newUser})
    } catch (error) {
        console.log(error)
    }
});

router.get('/messages:', async (req, res) => {

    io.on('connection', async (socket) => {
        socket.on('message', text => {
            io.emit('receive_message', {
              text,
              authorId: socket.id,
              author: socket.data.username
            })
            console.log('aiai')
          })
    })
})

module.exports = router