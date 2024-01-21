import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function App() {
  // TODO need to figure data structure of msgHistory
  const [msgHistory, setMsgHistory] = useState([
    { name: 'me1', msg: 'who' },
    { name: 'me2', msg: 'who2' },
  ]);
  const [userMsg, setUserMsg] = useState({
    name: '',
    msg: '',
  });

  const sendMessage = (e) => {
    console.log(`client ${userMsg.name}: ${userMsg.msg}`);
    // socket.emit('send_message', { user: userMsg.user, message: userMsg });
  };

  // refresh whenever socket event happens
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log('from server', data.message);
      setMsgHistory([...msgHistory, data.message]);
    });
  }, [socket]);

  return (
    <>
      <h1>app</h1>
      <input
        type="text"
        placeholder="username here.."
        onChange={(e) => {
          setUserMsg({ ...userMsg, name: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Message here..."
        onChange={(e) => {
          setUserMsg({ ...userMsg, msg: e.target.value });
        }}
      />
      <button
        onClick={(e) => {
          sendMessage(e);
        }}
      >
        Send Message
      </button>

      <h2>Messages below:</h2>
      <div>
        {msgHistory.map((user, index) => (
          <div key={user.user + index}>{`${user.name}: ${user.msg}`}</div>
        ))}
      </div>
    </>
  );
}

export default App;
