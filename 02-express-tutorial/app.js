const express = require('express');

const app = express();

const people = require('./routes/people');
const auth = require('./routes/auth');

// Static Assets
app.use(express.static('./methods-public'))

//Parse form data
app.use(express.urlencoded({extended: false}))

//Parse JSON
app.use(express.json())

//Routes
app.use('/api/people', people)
app.use('/login', auth)

app.listen(5000, () => {
    console.log('Server started on port 5000.....');
});