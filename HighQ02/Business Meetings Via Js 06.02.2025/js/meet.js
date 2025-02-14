let localStream;
let peers = {};
const socket = new WebSocket('ws://localhost:3000');
let userData = {};

// Обработка формы
document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Сбор данных из формы
    userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
    };

    // Сохранение данных в JSON
    saveUserData(userData);

    // Скрываем форму и показываем видео
    document.getElementById('formContainer').style.display = 'none';
    document.querySelector('.video-container').style.display = 'block';

    // Подключаем камеру
    startVideo();
});

// Функция для сохранения данных в JSON
async function saveUserData(data) {
    try {
        const response = await fetch('http://localhost:3000/save-user-data/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        // Если ответ не OK, выбрасываем ошибку
        if (!response.ok) {
            throw new Error(result.error || "Unknown error occurred");
        }

        console.log("Data saved successfully:", result);

    } catch (error) {
        // Обрабатываем ошибку "Email already registered"
        if (error.message === "Email already registered") {
            console.warn("User already registered. Proceeding with login instead.");
            // Продолжаем выполнение, как будто регистрация прошла успешно
        } else {
            console.error("Error saving data:", error);
            alert(error.message); // Выводим ошибку пользователю
            return; // Прекращаем выполнение, если ошибка другая
        }
    }

    // ✅ Дождаться, пока камера включится
    await startVideo();

    // ✅ Только после успешного получения камеры запускаем WebRTC
    initWebRTC();
}

// Функция для подключения камеры
function startVideo() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            const localVideo = document.getElementById('localVideo');
            localVideo.srcObject = stream;
            localVideo.play();
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

// Инициализация WebRTC
function initWebRTC() {
    socket.onmessage = async (event) => {
        try {
            let data;

            // 🔍 Проверяем, является ли `event.data` объектом Blob
            if (event.data instanceof Blob) {
                const text = await event.data.text(); // Читаем Blob как текст
                data = JSON.parse(text); // Преобразуем в JSON
            } else {
                data = JSON.parse(event.data);
            }

            if (data.type === 'offer') {
                const peer = new SimplePeer({ initiator: false, trickle: false });
                peer.on('signal', (signalData) => {
                    socket.send(JSON.stringify({ ...signalData, type: 'answer', email: userData.email }));
                });
                peer.on('stream', (stream) => {
                    addRemoteVideo(stream, data.email);
                });
                peer.signal(data);
                peers[data.email] = peer;
            } else if (data.type === 'answer') {
                const peer = peers[data.email];
                if (peer) {
                    peer.signal(data);
                }
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    // Создаем peer для текущего пользователя
    const peer = new SimplePeer({ initiator: true, trickle: false });
    peer.on('signal', data => {
        socket.send(JSON.stringify({ ...data, type: 'offer', email: userData.email }));
    });
    peer.on('stream', stream => {
        addRemoteVideo(stream, userData.email);
    });
    peer.addStream(localStream);
    peers[userData.email] = peer;
}

// Добавление видео другого пользователя
function addRemoteVideo(stream, email) {
    const remoteVideos = document.getElementById('remoteVideos');

    // Проверяем, существует ли уже блок для этого пользователя
    let videoBlock = document.getElementById(`remote-${email}`);
    if (!videoBlock) {
        videoBlock = document.createElement('div');
        videoBlock.className = 'remoteVideo';
        videoBlock.id = `remote-${email}`;
        remoteVideos.appendChild(videoBlock);
    }

    // Создаем элемент video
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;

    // Очищаем блок и добавляем видео
    videoBlock.innerHTML = '';
    videoBlock.appendChild(video);
}

// Переключение камеры
function toggleCamera() {
    if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        if (videoTracks.length > 0) {
            videoTracks.forEach(track => track.enabled = !track.enabled);
        }
    } else {
        console.error('Local stream is not available.');
    }
}

// Переключение микрофона
function toggleMicrophone() {
    if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        if (audioTracks.length > 0) {
            audioTracks.forEach(track => track.enabled = !track.enabled);
        }
    } else {
        console.error('Local stream is not available.');
    }
}

// Функция для создания скриншота
function takeScreenshot() {
    const canvas = document.createElement('canvas');
    const video = document.getElementById('localVideo');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'screenshot.png';
    link.click();
}

// Функция для трансляции экрана
async function startScreenShare() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenVideo = document.createElement('video');
        screenVideo.srcObject = screenStream;
        screenVideo.autoplay = true;

        // Добавляем видео экрана в контейнер
        const screenContainer = document.createElement('div');
        screenContainer.className = 'remoteVideo';
        screenContainer.appendChild(screenVideo);
        document.getElementById('remoteVideos').appendChild(screenContainer);
    } catch (error) {
        console.error('Error accessing screen:', error);
    }
}