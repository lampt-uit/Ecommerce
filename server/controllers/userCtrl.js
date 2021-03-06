const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body;

			const user = await Users.findOne({ email });
			if (user)
				return res.status(400).json({ msg: 'The email already exists.' });

			if (password.length < 6) {
				return res
					.status(400)
					.json({ msg: 'Password is least 6 character long.' });
			}

			//Password Encryption
			const hashPassword = await bcrypt.hash(password, 10);
			const newUser = new Users({
				name,
				email,
				password: hashPassword
			});

			//Save MongoDB
			await newUser.save();

			//Then create jsonwebtoken to authentication
			const accesstoken = createAccessToken({ id: newUser._id });
			const refreshtoken = createRefreshToken({ id: newUser._id });

			res.cookie('refreshtoken', refreshtoken, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000 //7day
			});

			res.json({ accesstoken });
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const user = await Users.findOne({ email });

			if (!user)
				return res.status(400).json({ msg: "User doesn't not exist." });

			//Compare password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) res.status(400).json({ msg: 'Incorrect password.' });

			//If login success, create a access token and refresh token
			const accesstoken = createAccessToken({ id: user._id });
			const refreshtoken = createRefreshToken({ id: user._id });

			res.cookie('refreshtoken', refreshtoken, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000 //7day
			});

			res.json({ accesstoken });
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
			return res.json({ msg: 'Logged Out' });
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	},
	refreshToken: (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken;
			if (!rf_token)
				return res.status(400).json({ msg: 'Please Login or Register' });

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err)
					return res.status(400).json({ msg: 'Please Login or Register' });
				const accesstoken = createAccessToken({ id: user.id });
				res.json({ accesstoken });
			});
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	},
	getUser: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select('-password');
			if (!user) return res.status(400).json({ msg: "User doesn't exist." });
			res.json(user);
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	},
	addCart: async (req, res) => {
		// console.log(req.body);
		try {
			const user = await Users.findById(req.user.id);

			if (!user)
				return res.status(400).json({ msg: "User doesn't not exists " });

			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					cart: req.body.cart
				}
			);

			return res.json({ msg: 'Added to cart' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	history: async (req, res) => {
		try {
			const history = await Payments.find({ user_id: req.user.id });
			res.json(history);
		} catch (error) {
			return res.status(500).json({ msg: error.msg });
		}
	}
};

//Create token
const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
};
const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
