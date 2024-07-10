const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'IS.html'));
});

let passwordAttemptsRemaining = 3;
let privateKeyAttemptsRemaining = 3;
const blockedDuration = 10;
let isPasswordBlocked = false;
let isPrivateKeyBlocked = false;

const validPasswords = {
    "Jahnavi": "jahnavimr100@gmail.com",
    "Prithvi": "prithvijaiprakash@gmail.com",
    "Jeevitha": "jeevitha18032003@gmail.com",
    "SowjanyaBhat": "sowjanyab509@gmail.com",
    "Tejashwini": "tejashwini77949@gmail.com",
    "ShreeHarshini": "harshini9939@gmail.com"
};

const validDevicePath = Object.values(validPasswords);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('checkDevicePath', (devicePath) => {
        if (validDevicePath.includes(devicePath)) {
            socket.emit('devicePathValid');
            console.log('Valid Email-id.');
        } else {
            passwordAttemptsRemaining--;
            if (passwordAttemptsRemaining <= 0) {
                isPasswordBlocked = true;
                socket.emit('devicePathBlocked', blockedDuration);
                setTimeout(() => {
                    isPasswordBlocked = false;
                    passwordAttemptsRemaining = 3;
                    socket.emit('devicePathUnblocked');
                }, blockedDuration * 1000);
            } else {
                socket.emit('devicePathInvalid', passwordAttemptsRemaining);
            }
        }
    });

    socket.on('checkPassword', (alphanumericName, devicePath) => {
        if (validPasswords.hasOwnProperty(alphanumericName) && validPasswords[alphanumericName] === devicePath) {
            const privateKey = generatePrivateKey();
            socket.emit('passwordValid', privateKey);
            console.log('Password is valid.');
        } else {
            passwordAttemptsRemaining--;
            if (passwordAttemptsRemaining <= 0) {
                isPasswordBlocked = true;
                socket.emit('passwordBlocked', blockedDuration);
                setTimeout(() => {
                    isPasswordBlocked = false;
                    passwordAttemptsRemaining = 3;
                    socket.emit('passwordUnblocked');
                }, blockedDuration * 1000);
            } else {
                socket.emit('passwordInvalid', passwordAttemptsRemaining);
            }
        }
    });

    socket.on('checkPrivateKey', (userInput, privateKey) => {
        if (userInput === privateKey) {
            socket.emit('privateKeyValid', "Secret_image.png");
            console.log('Private key is valid.');
            console.log('Success: Secret image displayed.');
        } else {
            privateKeyAttemptsRemaining--;
            if (privateKeyAttemptsRemaining <= 0) {
                isPrivateKeyBlocked = true;
                socket.emit('privateKeyBlocked', blockedDuration);
                setTimeout(() => {
                    isPrivateKeyBlocked = false;
                    privateKeyAttemptsRemaining = 3;
                    socket.emit('privateKeyUnblocked');
                }, blockedDuration * 1000);
            } else {
                socket.emit('privateKeyInvalid', privateKeyAttemptsRemaining);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

function generatePrivateKey() {
    const keyLength = 20;
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let privateKey = "";

    for (let i = 0; i < keyLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        privateKey += characters.charAt(randomIndex);
    }

    return privateKey;
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
