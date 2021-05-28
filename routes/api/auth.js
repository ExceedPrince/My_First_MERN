const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
// send name, email, and password to db
router.post(
	'/',
	[
		// setting express validation for email and password
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please is required').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() }); // bad request
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (!user) {
				// if user exists
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// comparing plain text password with password from db
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			const payload = {
				user: {
					id: user.id // mongoose uses id, not _id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: '5 days' },
				(err, token) => {
					if (err) throw err;
					// return jsonwebtoken because in frontend when user registers, they can be logged in right away
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;