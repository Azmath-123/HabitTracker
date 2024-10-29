const express = require('express');
const router = express.Router();
const { createHabit, updateHabit, deleteHabit, getHabits } = require('../controllers/habitController');
const authMiddleware = require('../middlewares/authMiddleware'); // Add authentication middleware here

router.post('/', authMiddleware, createHabit);
router.put('/:habitId', authMiddleware, updateHabit);
router.delete('/:habitId', authMiddleware, deleteHabit);
router.get('/', authMiddleware, getHabits);
module.exports = router;
