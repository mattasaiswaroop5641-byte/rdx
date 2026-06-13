const db = require('./index');

exports.getOrders = async (req, res) => {
    try {
        const query = `
            SELECT o.id, u.email as user, o.amount_paid as amount, o.payment_status as status 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 10
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.json([]); // Fallback to empty if DB table isn't created yet
    }
};

exports.getTickets = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM tickets ORDER BY created_at DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
};

exports.getLogs = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT code, discount_percentage as discount FROM coupons ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
};

exports.createCoupon = async (req, res) => {
    const { code, discount } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO coupons (code, discount_percentage) VALUES ($1, $2) RETURNING code, discount_percentage as discount',
            [code, discount]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create coupon in DB' });
    }
};

exports.getChartData = async (req, res) => {
    res.json({ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], data: [15000, 22000, 18000, 29000, 35000, 42000, 56000] });
};