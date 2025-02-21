    // pages/api/users/index.js
import { getConnection } from '../../../lib/db';

export default async function handler(req, res) {
    const connection = await getConnection();

    try {
        if (req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM users');
            res.status(200).json(rows);
        } 
        else if (req.method === 'POST') {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const [result] = await connection.execute(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email]
            );
            res.status(201).json({ id: result.insertId, name, email });
        } 
        else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
}