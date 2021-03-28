//Import lib
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
//If you want to use import of ES6  => set : "type":"module" in package.json

//Init App
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
	fileUpload({
		useTempFiles: true
	})
);

//Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));

//Connect MongoDB
const URL = process.env.MONGODB_URL;
mongoose.connect(
	URL,
	{
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) throw err;
		console.log('Connected to MongoDB');
	}
);

//Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port : ${PORT}`);
});
