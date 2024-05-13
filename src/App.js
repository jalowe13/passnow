import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import {Button} from 'antd';
// Jacob Lowe
function App() { 
  const [data, setData] = useState(null);

  const handleButtonClick = () => {
    fetch('http://127.0.0.1:8080/api/button-clicked', { method: 'POST' });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Password Manager
        </p>
        <Button onClick={handleButtonClick}> Click me </Button>
      </header>
    </div>
  );
}

export default App;
