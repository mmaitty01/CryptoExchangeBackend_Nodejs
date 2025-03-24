// cryptoExchangeBackend.js
const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');


const app = express();
app.use(bodyParser.json());

// Initialize Oracle SQL pool
const dbConfig = {
  user: 'hrcrypto', //your_oracle_db_username
  password: 'hr', //your_oracle_db_password
  connectString: 'localhost:1521/orclpdb', //your_oracle_db_connection_string
};

// Create a pool
let pool;
async function initDbPool() {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log('Database pool initialized');
  } catch (err) {
    console.error('Error initializing database pool:', err);
    process.exit(1);
  }
}

// Database Models
const User = {
    async createAccount({ username, email, password, fiat_balance}) {
      // ตรวจสอบว่า username, email, password, fiat_balance ไม่เป็น NULL
      if (!username || !email || !password || fiat_balance === undefined || fiat_balance === null) {
        throw new Error('All fields are required (username, email, password, fiat_balance)');
      }
  
      const sql = `INSERT INTO users (username, email, password, fiat_balance) VALUES (:username, :email, :password, :fiat_balance)`;
      let connection;
      try {
        connection = await pool.getConnection();
        await connection.execute(sql, { username, email, password, fiat_balance });
        await connection.commit();
      } finally {
        if (connection) await connection.close();
      }
    },
  
    async findById(userId) {
      const sql = `SELECT * FROM users WHERE id = :userId`;
      let connection;
      try {
        connection = await pool.getConnection();
        const result = await connection.execute(sql, { userId });
        return result.rows;
      } finally {
        if (connection) await connection.close();
      }
    },
  };

const Wallet = {
  async createWallet({ userId, currency, balance }) {
    const sql = `INSERT INTO wallets (user_id, currency, balance) VALUES (:userId, :currency, :balance)`;
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(sql, { userId, currency, balance });
      await connection.commit();
    } finally {
      if (connection) await connection.close();
    }
  },
};

const Transaction = {
  async logTransaction({ senderId, recipientId, currency, amount, type }) {
    const sql = `INSERT INTO transactions (sender_id, recipient_id, currency, amount, type) VALUES (:senderId, :recipientId, :currency, :amount, :type)`;
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(sql, { senderId, recipientId, currency, amount, type });
      await connection.commit();
    } finally {
      if (connection) await connection.close();
    }
  },
};

// Controllers
app.post('/register', async (req, res) => {
  try {
    const {username, email, password, fiat_balance} = req.body;
    await User.createAccount({ username, email, password, fiat_balance});
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/wallets', async (req, res) => {
  try {
    const { userId, currency, balance } = req.body;
    await Wallet.createWallet({ userId, currency, balance });
    res.status(201).send('Wallet created successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/transfer', async (req, res) => {
  try {
    const { senderId, recipientId, currency, amount } = req.body;

    // Log transaction
    await Transaction.logTransaction({ senderId, recipientId, currency, amount, type: 'transfer' });
    res.status(200).send('Transfer successful');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Seed Data Function
const seedData = [
  {
    username: 'testuser11',
    email: 'test11@example.com',
    password: 'hashed_password',
    fiat_balance: 1000.0
  },
  {
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'hashed_password_2',
    fiat_balance: 2000.0
  }
];

async function seedDatabase(pool) {
  const sql = `
    INSERT INTO users (username, email, password, fiat_balance) 
    VALUES (:username, :email, :password, :fiat_balance)
  `;

  try {
    const connection = await pool.getConnection();

    for (const user of seedData) {
      await connection.execute(sql, {
        username: user.username,
        email: user.email,
        password: user.password,
        fiat_balance: user.fiat_balance
      });
    }

    await connection.commit();
    console.log('Data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = { seedDatabase };

// Start Server
app.get('/', (req, res) => {
  res.send('Welcome to the Cryptocurrency Exchange Backend API!');
});

app.listen(3000, async () => {
  await initDbPool();
  await seedDatabase(pool);  // เรียกใช้ฟังก์ชัน seedData
  console.log('Server is running on http://localhost:3000');
});
