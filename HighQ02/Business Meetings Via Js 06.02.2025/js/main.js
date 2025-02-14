// const video = document.getElementById('video');
// const screen = document.getElementById('screen');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// let localStream;
// let screenStream;
// let isCameraOn = false;
// let isMicrophoneOn = true;
// let peerConnection;

// const socket = io('http://localhost:3000'); // Подключение к серверу сигнализации

// // Конфигурация ICE-серверов (STUN-сервер Google)
// const configuration = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
// };

// // Получение доступа к камере
// async function startCamera() {
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicrophoneOn });
//         video.srcObject = localStream;
//         isCameraOn = true;
//         createPeerConnection();
//     } catch (err) {
//         console.error('Error accessing camera:', err);
//     }
// }

// // Остановка камеры
// function stopCamera() {
//     if (localStream) {
//         localStream.getTracks().forEach(track => track.stop());
//         video.srcObject = null;
//         isCameraOn = false;
//     }
// }

// // Переключение камеры
// function toggleCamera() {
//     if (isCameraOn) {
//         stopCamera();
//     } else {
//         startCamera();
//     }
// }

// // Переключение микрофона
// function toggleMicrophone() {
//     if (localStream) {
//         const audioTracks = localStream.getAudioTracks();
//         audioTracks.forEach(track => track.enabled = !track.enabled);
//         isMicrophoneOn = !isMicrophoneOn;
//     }
// }

// // Запуск демонстрации экрана
// async function startScreenShare() {
//     try {
//         screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//         screen.srcObject = screenStream;
//         screen.style.visibility = 'visible';
//     } catch (err) {
//         console.error('Error accessing screen:', err);
//     }
// }

// // Создание скриншота
// function takeScreenshot() {
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png');
//     link.download = 'screenshot.png';
//     link.click();
// }

// // Создание RTCPeerConnection
// function createPeerConnection() {
//     peerConnection = new RTCPeerConnection(configuration);

//     // Добавление локального потока в соединение
//     localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//     // Обработка удаленного потока
//     peerConnection.ontrack = event => {
//         const remoteVideo = document.createElement('video');
//         remoteVideo.autoplay = true;
//         remoteVideo.srcObject = event.streams[0];
//         document.body.appendChild(remoteVideo);
//     };

//     // Обмен ICE-кандидатами
//     peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//             socket.emit('signal', { type: 'candidate', candidate: event.candidate });
//         }
//     };

//     // Создание предложения (offer) и отправка его на сервер
//     peerConnection.createOffer()
//         .then(offer => peerConnection.setLocalDescription(offer))
//         .then(() => {
//             socket.emit('signal', { type: 'offer', offer: peerConnection.localDescription });
//         })
//         .catch(err => console.error('Error creating offer:', err));
// }

// // Обработка сигнальных данных от сервера
// socket.on('signal', async data => {
//     if (!peerConnection) createPeerConnection();

//     if (data.type === 'offer') {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         socket.emit('signal', { type: 'answer', answer });
//     } else if (data.type === 'answer') {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
//     } else if (data.type === 'candidate') {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//     }
// });




// // Middleware для статических файлов
// app.use(express.static(path.join(__dirname, 'templates')));
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/js', express.static(path.join(__dirname, 'js')));
// app.use('/styles', express.static(path.join(__dirname, 'styles')));

// let yakor = document.querySelectorAll('btn')
// yakor.addEventListener('click', function(){
//     document.location.href='http://main.html#contact'
// })