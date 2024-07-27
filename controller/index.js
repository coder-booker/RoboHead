const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());


const IDENTITY = 'BACK';

// 活跃的客户端
const clients = {
  face: {
    ok: false, 
    client: null
  }, 
  faceMonitor: {
    ok: false, 
    client: null
  }
};


// 让face订阅
app.get('/face/subscribe', (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(": connected\n\n");
    clients.face.ok = true;
    clients.face.client = res;
    console.log(`${IDENTITY}: \nFace connected`);

    req.on('close', () => {
      clients.face.ok = false;
      clients.face.client.end();
      
      console.log(`${IDENTITY}: \nFace disconnected`);
    });
  } catch (err) {
    clients.face.ok = false;

    // Back报错
    console.error(`${IDENTITY}: \nFace Subscribe Error: ${err}`);

    // 传输报错给monitor
    if ( clients.faceMonitor.ok ) {
      clients.faceMonitor.client.write(`event: faceErrorEvent\n`);
      clients.faceMonitor.client.write(`data: ${err}\n\n`);
    }
    
    // 响应错误给face
    clients.face.client.status(500).send(err);  // send也会end
  }
});

// 让face订阅
app.get('/faceMonitor/subscribe', (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(": connected\n\n");
    clients.faceMonitor.ok = true;
    clients.faceMonitor.client = res;
    console.log(`${IDENTITY}: \nFaceMonitor connected`);

    req.on('close', () => {
      clients.faceMonitor.ok = false;
      clients.faceMonitor.client.end();
      console.log(`${IDENTITY}: \nFaceMonitor disconnected`);
    });
  } catch (err) {
    clients.faceMonitor.ok = false;
    // 响应错误给face
    clients.faceMonitor.client.status(500).send(err);  // send也会end
    // Back报错
    console.error(`${IDENTITY}: \nFaceMonitor Subscribe Error: ${err}`);
  }
});

// 处理control-panel发送的face消息并转发给face
app.post('/setFace', (req, res) => {
  try {
    const face = req.query.data;
    console.log(`${IDENTITY}: \nsetFace ${face}\n`);
    
    const data = JSON.stringify({face: face});
    for ( let client in clients ) {
      if ( clients[client].ok ) {
        clients[client].client.write(`data: ${data}\n\n`);
      }
    }
    // res.header("Access-Control-Allow-Origin", "*");
    res.send(face); // 响应成功

  } catch (err) {
    console.error(`${IDENTITY}: \nsetFace ERROR: ${err}`);
    res.status(500).send("setFace ERROR");  // 试试用响应码响应错误，记得前端要处理
  }
});
// 处理control-panel发送的move消息并转发给face
app.post('/setMove', (req, res) => {
  try {
    const move = req.query.data;
    console.log(`${IDENTITY}: \nsetMove ${move}\n`);

    const data = JSON.stringify({move: move});

    // 转发给face和faceMonitor
    for ( let client in clients ) {
      if ( clients[client].ok ) {
        clients[client].client.write(`data: ${data}\n\n`);
      }
    }
    res.send(move);

  } catch (err) {
    console.error(`${IDENTITY}: \nsetMove ERROR: ${err}`);
    res.status(500).send('setMove ERROR');  // 试试用响应码响应错误，记得前端要处理
  }
});


app.listen(11450, () => {
  console.log('Server is running on port 11450');
})