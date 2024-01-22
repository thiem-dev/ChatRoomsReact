import { useState, useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function App() {
  const [msgHistory, setMsgHistory] = useState([
    { name: 'me1', msg: 'who', room: 1 },
    { name: 'me2', msg: 'who2', room: 1 },
  ]);
  const [userMsg, setUserMsg] = useState({
    name: '',
    msg: '',
    room: null,
  });

  const nameRef = useRef();
  const msgRef = useRef();
  const roomRef = useRef();

  const joinRoom = () => {
    if (userMsg.room) {
      socket.emit('join_room', userMsg);
    }
  };

  //send message to all
  const sendMessageAll = () => {
    socket.emit('send_message_all', userMsg);
    setMsgHistory((prevMsgHistory) => [...prevMsgHistory, userMsg]);
    clearInputs();
  };

  // send message to room
  const sendRoomMessage = () => {
    socket.emit('send_rm_message', userMsg);
    setMsgHistory((prevMsgHistory) => [...prevMsgHistory, userMsg]);
    clearInputs();
  };

  const clearInputs = () => {
    msgRef.current.value = '';
  };

  // refresh whenever socket event happens
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMsgHistory((prevMsgHistory) => [...prevMsgHistory, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      //unsubscribe when component unmounts - when message received - prevents duplicate messages
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  return (
    <>
      <h1>Welcome to the chatapp</h1>
      <div>
        <input
          type="text"
          placeholder="room number"
          ref={roomRef}
          onChange={(e) => {
            setUserMsg({ ...userMsg, room: e.target.value });
          }}
        />
        <button
          onClick={() => {
            joinRoom();
          }}
        >
          Join Room
        </button>
      </div>

      <div>
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
      </div>

      <div>
        <button
          onClick={() => {
            sendRoomMessage();
          }}
        >
          Send Message to Room
        </button>

        <button
          onClick={() => {
            sendMessageAll();
          }}
        >
          Send Message to all
        </button>
      </div>

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
