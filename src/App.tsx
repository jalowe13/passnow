import './App.css';
import {HomeFilled, HddFilled, KeyOutlined, CopyOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Button, Menu, Timeline} from 'antd';
import React from 'react';
// Jacob Lowe
function App() {
  const [isDashboard, setIsDashboard] = React.useState(true);
  const [isVault, setIsVault] = React.useState(false);
  const [isGeneratePassword, setIsGeneratePassword] = React.useState(false);


  const handleClickMenu = (e) => {
    console.log(e.key)
    switch(e.key) {
      case 'sub1':
        setIsDashboard(true);
        setIsVault(false);
        setIsGeneratePassword(false);
        break;
      case 'sub2':
        setIsDashboard(false);
        setIsVault(true);
        setIsGeneratePassword(false);
        break;
      case 'sub3':
        setIsDashboard(false);
        setIsVault(false);
        setIsGeneratePassword(true);
        break;
    }
  }

  
  const handleButtonClick = () => {
    fetch('http://127.0.0.1:8080/api/button-clicked', { method: 'POST' });
  };

  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      key: 'sub1',
      label: 'Dashboard',
      icon: <HomeFilled />,
    },
    {
      key: 'sub2',
      label: 'Vault',
      icon: <HddFilled />,
    },
    {
      key: 'sub3',
      label: 'Generate Password',
      icon: <KeyOutlined />,
    }
  ];
  
  // Dashboard content
  function dashboardContent() {

    const items = [{ label: 'Dice' }, {label: 'Codewars'}, {label: 'AMD'}, {label: 'Paypal'}];
    function randomNumRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function recentPassItem(item: {label : string}) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white'}}>
          <span>{item.label}</span>
          <Button type='primary' icon={<CopyOutlined/>}></Button>
        </div>
      );
    } 

    return (
      <div>
        <h1>
          Hi!
        </h1>
        <div>
          You have {randomNumRange(10,100)} passwords stored in your vault
        </div>
        <div>
          <div>
            Recently used Passwords
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Timeline style={{ display: 'inline', color: 'black', marginTop: '20px' }}>
                {items.map(item => recentPassItem(item))}
              </Timeline>
            </div>
          </div>
          <Button onClick={handleButtonClick}> Set Database to 1 </Button>
        </div>
      </div>
    );
  }

  function VaultContent() {
    return (
        <div>Vault</div>
    );
  }
  function GeneratePasswordContent() {
    return (
        <div>Generate Password</div>
    );
  }

  return (
    <div className="App">    
    <Menu
    defaultSelectedKeys={['sub1']}
    defaultOpenKeys={['sub1']}
    mode="vertical"
    items={items}
    theme='dark'
    onClick={(e) => handleClickMenu(e)}
    />
    <header className="App-header">
      {
        isDashboard && dashboardContent() 
      }
      {
        isVault && VaultContent()
      }
      {
        isGeneratePassword && GeneratePasswordContent()
      }
        </header>
    </div>
  );
}

export default App;
