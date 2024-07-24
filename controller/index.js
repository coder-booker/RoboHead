const express = require('express');
const cors = require('cors');
// const phoneLocalhost1 = require('../constant/ip').phoneLocalhost1;

const app = express();
app.use(cors());


// 活跃的客户端
const clients = [];

// 让face订阅
app.get('/subscribe', (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
      clients.splice(clients.indexOf(res), 1);
      console.log('close'+clients.length);
      res.end();
    });
  } catch (err) {
    console.error(`Subscribe ERROR: ${err}`);
    res.status(500).send('error');
  }
});
app.post('/faceError', (req, res) => {
  console.log('faceError');
});


// 处理control-panel发送的face消息并转发给face
app.post('/setFace', (req, res) => {
  try {
    const face = req.query.data;
    console.log('setFace', face);

    const data = JSON.stringify({face: face});
    clients.forEach(client => {
      client.write(`data: ${data}\n\n`);
    });

    res.send(face);

  } catch (err) {
    console.error(`setFace ERROR: ${err}`);
    res.status(500).send('error');  // 试试用响应码响应错误，记得前端要处理
  }
});
// 处理control-panel发送的move消息并转发给face
app.post('/setMove', (req, res) => {
  try {
    const move = req.query.data;
    console.log('setMove:', move);

    const data = JSON.stringify({move: move});

    clients.forEach(client => {
      client.write(`data: ${data}\n\n`);
    });

    res.send(move);

  } catch (err) {
    console.error(`setFace ERROR: ${err}`);
    res.status(500).send('error');  // 试试用响应码响应错误，记得前端要处理
  }
});


app.listen(11451, () => {
  console.log('Server is running on port 11451');
})