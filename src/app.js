require('dotenv').config();

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.net', // SMTP host
    port: 587, // SMTP port
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }

});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/contact.html'));
})

app.post('/contact/send', (req, res) => {
    const {firstname, lastname, email, phone, letter, terms} = req.body;
    console.log('Post Executed')
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID,
        subject: `New Message from ${firstname} ${lastname}`,
        html: `
        <p><strong>Name:</strong> ${firstname}</p>
        <p><strong>Name:</strong> ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${letter}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error){
            console.log(error);
            res.status(500).send('Error sending email');

        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('We got your request');
        }
    });
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});