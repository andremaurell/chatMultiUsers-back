import { pool } from '../../index.js'

const userMiddleware = async (req, res, next) => {
    try {
        const { username } = req.body;
        console.log('Username:', username);

        if (!username) {
            return res.status(400).send({ error: 'Username is required.' });
        }

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            req.user = result.rows[0];
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return next(error); 
    }

    next();
};

export { userMiddleware }
