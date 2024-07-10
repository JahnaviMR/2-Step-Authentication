const socket = io('http://127.0.0.1:5500/IS.html');

document.getElementById('submitDevicePathBtn').addEventListener('click', function() {
    const devicePath = document.getElementById('devicePathInput').value.trim();
    socket.emit('checkDevicePath', devicePath);
});

document.getElementById('submitPasswordBtn').addEventListener('click', function() {
    const alphanumericName = document.getElementById('passwordInput').value.trim();
    const devicePath = document.getElementById('devicePathInput').value.trim();
    socket.emit('checkPassword', alphanumericName, devicePath);
});

document.getElementById('submitPrivateKeyBtn').addEventListener('click', function() {
    const userInput = document.getElementById('privateKeyInput').value.trim();
    const privateKey = document.getElementById('privateKeyDisplay').textContent.trim();
    socket.emit('checkPrivateKey', userInput, privateKey);
});

socket.on('devicePathValid', () => {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.password-container').style.display = 'block';
});

socket.on('devicePathInvalid', (attemptsRemaining) => {
    alert("This device cannot access the secret image.");
    document.getElementById("device-path-timerContainer").innerHTML = "Invalid device path. " + attemptsRemaining + " attempts remaining.";
});

socket.on('devicePathBlocked', (blockedDuration) => {
    displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "device-path-timerContainer");
});

socket.on('devicePathUnblocked', () => {
    document.getElementById("device-path-timerContainer").innerHTML = "";
    alert("Access Unblocked for Device Path. You can try again.");
});

socket.on('passwordValid', (privateKey) => {
    document.querySelector('.password-container').style.display = 'none';
    document.querySelector('.private-key-container').style.display = 'block';
    document.getElementById('privateKeyDisplay').textContent = privateKey;
});

socket.on('passwordInvalid', (attemptsRemaining) => {
    document.getElementById("password-timerContainer").innerHTML = "Invalid password. " + attemptsRemaining + " attempts remaining.";
});

socket.on('passwordBlocked', (blockedDuration) => {
    displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "password-timerContainer");
});

socket.on('passwordUnblocked', () => {
    document.getElementById("password-timerContainer").innerHTML = "";
    alert("Access Unblocked for Password. You can try again.");
});

socket.on('privateKeyValid', (imagePath) => {
    const imageWindow = window.open(imagePath);
    if (!imageWindow || imageWindow.closed || typeof imageWindow.closed == 'undefined') {
        alert("Please allow pop-ups to view the secret image.");
    }
});

socket.on('privateKeyInvalid', (attemptsRemaining) => {
    document.getElementById("private-key-timerContainer").innerHTML = "Invalid private key. " + attemptsRemaining + " attempts remaining.";
});

socket.on('privateKeyBlocked', (blockedDuration) => {
    displayTimer("Access Blocked. Remaining time: ", blockedDuration, " seconds", "private-key-timerContainer");
});

socket.on('privateKeyUnblocked', () => {
    document.getElementById("private-key-timerContainer").innerHTML = "";
    alert("Access Unblocked for Private Key. You can try again.");
});

function displayTimer(prefix, time, suffix, containerId) {
    const timerContainer = document.getElementById(containerId);
    timerContainer.innerHTML = prefix + time + suffix;
}
