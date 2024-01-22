import { useState, useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function App() {
  const [msgHistory, setMsgHistory] = useState([
    { name: 'me1', msg: 'who' },
    { name: 'me2', msg: 'who2' },
  ]);
  const [userMsg, setUserMsg] = useState({
    name: '',
    msg: '',
  });

  const nameRef = useRef();
  const msgRef = useRef();

  const sendMessage = (e) => {
    console.log(`client ${userMsg.name}: ${userMsg.msg}`);
    socket.emit('send_message', { user: userMsg.user, message: userMsg });
    setMsgHistory((prevMsgHistory) => [...prevMsgHistory, userMsg]);
    clearInputs();
  };

  const clearInputs = () => {
    msgRef.current.value = '';
  };

  // refresh whenever socket event happens
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMsgHistory((prevMsgHistory) => [...prevMsgHistory, data.message]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      //unsubscribe when component unmounts - when message received - prevents duplicate messages
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  return (
    <>
      <h1>app</h1>
      <input
        type="text"
        placeholder="username here.."
        ref={nameRef}
        onChange={(e) => {
          setUserMsg({ ...userMsg, name: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Message here..."
        ref={msgRef}
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
          <div key={user.name + index}>{`${user.name}: ${user.msg}`}</div>
        ))}
      </div>
    </>
  );
}

export default App;
