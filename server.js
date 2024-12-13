const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');  // Thư viện mã hóa mật khẩu
const User = require('./models/user');  // Tệp mô hình người dùng
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Kết nối tới MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Route cho đăng ký người dùng
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email này đã được sử dụng!' });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi đăng ký: ' + error.message });
  }
});

// Route đăng nhập
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ error: 'Người dùng không tồn tại!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Mật khẩu không chính xác!' });
    }

    res.status(200).json({ message: 'Đăng nhập thành công!' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi đăng nhập: ' + error.message });
  }
});

app.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // giả sử bạn có cơ chế xác thực và lưu user ID trong req.user

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'Người dùng không tồn tại!' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không chính xác!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi đổi mật khẩu: ' + error.message });
  }
});

// Khởi chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
