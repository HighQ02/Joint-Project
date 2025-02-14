const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const dataFilePath = path.join(__dirname, 'data.json');

// Middleware для обработки JSON
app.use(express.json());

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'templates')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Маршрут для сохранения данных
app.post('/save-user-data', (req, res) => {
    const userData = req.body;

    // Проверка наличия обязательных полей
    if (!userData.firstName || !userData.lastName || !userData.email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Чтение существующих данных
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let jsonData = [];
        if (data) {
            jsonData = JSON.parse(data);
        }

        // Проверка, существует ли email
        const emailExists = jsonData.some(user => user.email === userData.email);
        if (emailExists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Добавление новых данных
        jsonData.push(userData);

        // Запись обновленных данных в файл
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error writing file');
            }

            console.log('Data saved:', userData);
            res.status(200).json({ message: 'Data saved successfully', user: userData });
        });
    });
});

// WebSocket для обмена сигналами
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Пересылаем сообщение всем клиентам, кроме отправителя
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// Запуск сервера
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});