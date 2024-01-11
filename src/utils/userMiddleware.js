const { pool } = require('../../index')

const userMiddleware = async (req, res, next) => {
    try {
        const { username } = req.body;
        const verifyTable = await pool.query('SELECT * from users')
        if (verifyTable.rows.length === 0) {
            await pool.query(
                'CREATE TABLE users (id VARCHAR(20) PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)'
            )
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

module.exports = { userMiddleware }
