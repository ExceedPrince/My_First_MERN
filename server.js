const express = require('express');
const connectDB = require('./config/db');

//Connect Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Can the frontend do GET request
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	// Pass to next layer of middleware
	next();
});
//Can post from frontend
const cors = require('cors');
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200
}
app.use(cors(corsOptions));

//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));