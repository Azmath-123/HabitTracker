const User = require('../models/user');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');  // Import the token generator
const errorHandler = require('../utils/errorHandler');    // Import error handler

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        errorHandler(error, res);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Use the token generator utility
        const token = generateToken(user._id);
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        errorHandler(error, res);
    }
};
