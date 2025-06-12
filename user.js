const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ full_name, phone, gender, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_image = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`;
    
    const { rows } = await db.query(
      'INSERT INTO users (full_name, phone, gender, password_hash, profile_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, phone, gender, hashedPassword, profile_image]
    );
    
    return rows[0];
  }

  static async findByPhone(phone) {
    const { rows } = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    return rows[0];
  }

  static async updateShareCount(userId) {
    const { rows } = await db.query(
      'UPDATE users SET shares = shares + 1, earnings = earnings + 100, balance = balance + 100 WHERE id = $1 RETURNING *',
      [userId]
    );
    return rows[0];
  }

  static async getWithdrawalData(userId) {
    const { rows } = await db.query('SELECT balance, earnings FROM users WHERE id = $1', [userId]);
    return rows[0];
  }
}

module.exports = User;
