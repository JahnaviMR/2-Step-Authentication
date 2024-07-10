document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:4000');


    socket.on('devicePathValid', () => {
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.password-container').style.display = 'block';
    });

    socket.on('devicePathInvalid', (attemptsRemaining) => {
        alert("This device cannot access the secret image.");
        document.getElementById("device-path-timerContainer").innerHTML = "Invalid Email-id. " + attemptsRemaining + " attempts remaining.";
    });

    socket.on('devicePathBlocked', (blockedDuration) => {
        alert("Device path access blocked for a duration.");
        displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "device-path-timerContainer");
    });

    socket.on('devicePathUnblocked', () => {
        alert("Device path access unblocked.");
        document.getElementById("device-path-timerContainer").innerHTML = "";
    });

    socket.on('passwordValid', (privateKey) => {
        document.querySelector('.password-container').style.display = 'none';
        document.querySelector('.private-key-container').style.display = 'block';
        document.getElementById('privateKeyDisplay').textContent = `Private key: ${privateKey}`;
    });

    socket.on('passwordInvalid', (attemptsRemaining) => {
        alert("Invalid password. " + attemptsRemaining + " attempts remaining.");
        document.getElementById("password-timerContainer").innerHTML = "Invalid password. " + attemptsRemaining + " attempts remaining.";
    });

    socket.on('passwordBlocked', (blockedDuration) => {
        alert("Password access blocked for a duration.");
        displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "password-timerContainer");
    });

    socket.on('passwordUnblocked', () => {
        alert("Password access unblocked.");
        document.getElementById("password-timerContainer").innerHTML = "";
    });

    const secretImagePath = "http://localhost:4000/public/Secret_image.png";


    socket.on('privateKeyValid', (secretImagePath) => {
        // Open the secret image in a new window or display it in your UI
        const imageWindow = window.open(secretImagePath);
        if (!imageWindow || imageWindow.closed || typeof imageWindow.closed === 'undefined') {
            alert('Popup blocked. Please allow popups for this website.');
        }
    });
    

    socket.on('privateKeyInvalid', (attemptsRemaining) => {
        alert("Invalid private key. " + attemptsRemaining + " attempts remaining.");
        document.getElementById("private-key-timerContainer").innerHTML = "Invalid private key. " + attemptsRemaining + " attempts remaining.";
    });

    socket.on('privateKeyBlocked', (blockedDuration) => {
        alert("Private key access blocked for a duration.");
        displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "private-key-timerContainer");
    });

    socket.on('privateKeyUnblocked', () => {
        alert("Private key access unblocked.");
        document.getElementById("private-key-timerContainer").innerHTML = "";
    });

    document.getElementById('submitDevicePathBtn').addEventListener('click', () => {
        const devicePath = document.getElementById('devicePathInput').value;
        socket.emit('checkDevicePath', devicePath);
    });

    document.getElementById('submitPasswordBtn').addEventListener('click', () => {
        const alphanumericName = document.getElementById('passwordInput').value;
        const devicePath = document.getElementById('devicePathInput').value;
        socket.emit('checkPassword', alphanumericName, devicePath);
    });

    document.getElementById('submitPrivateKeyBtn').addEventListener('click', () => {
        const userInput = document.getElementById('privateKeyInput').value;
        const privateKey = document.getElementById('privateKeyDisplay').textContent.replace('Private key: ', '');
        socket.emit('checkPrivateKey', userInput, privateKey);
    });

    function displayTimer(prefix, duration, suffix, containerId) {
        let timeRemaining = duration;
        const timerContainer = document.getElementById(containerId);
        timerContainer.innerHTML = `${prefix} ${timeRemaining} ${suffix}`;

        const interval = setInterval(() => {
            timeRemaining--;
            timerContainer.innerHTML = `${prefix} ${timeRemaining} ${suffix}`;
            if (timeRemaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }
});
