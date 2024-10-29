const errorHandler = (error, res) => {
    console.error(error);  // For logging errors in the console
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
};

module.exports = errorHandler;
