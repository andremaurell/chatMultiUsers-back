import { userMiddleware } from '../utils/userMiddleware.js'
import { app, server, io, pool } from '../../index.js'
import { v4 as uuidv4 } from 'uuid';

import express from 'express';
const router = express.Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    try {
        if (user.rows.length > 0) {
            if (user.rows[0].password === password && user.rows[0].username !== '' && user.rows[0].password !== '') {
                res.status(200).send({ id: user.rows[0].user_id, username: user.rows[0].username })
            } else {
                res.status(401).send({ message: 'Senha incorreta' })
            }
        }
        else {
            res.status(401).send({ message: 'Usuário não existe' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log(username, password)

    console.log(existingUser.rows)

    if (existingUser.rows.length > 0) {
        return res.status(400).send({ message: 'Usuário já existe' })
    }

    const userId = uuidv4().replace(/-/g, '').substring(0, 18);


    try {
        const result = await pool.query(
            'INSERT INTO users (user_id, username, password) VALUES ($1, $2, $3) RETURNING *',
            [userId, username, password]
        )

        const newUser = result.rows[0]
        console.log(newUser)

        res.status(201).send({newUser})
    } catch (error) {
        console.log(error)
    }
});

router.get('/messages', async (req, res) => {
    res.status(200).json({ success: true });            
})

export default router;