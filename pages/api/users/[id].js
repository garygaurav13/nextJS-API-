// pages/api/users/[id].js
import { getConnection } from '../../../lib/db';

export default async function handler(req, res) {
    const connection = await getConnection();
    const { id } = req.query;

    try {
        if (req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(rows[0]);
        }
        else if (req.method === 'PUT') {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const [result] = await connection.execute(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ id, name, email });
        }
        else if (req.method === 'DELETE') {
            const [result] = await connection.execute(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(204).end();
        }
        else {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
}