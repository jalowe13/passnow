import './App.css';
import {HomeFilled, HddFilled} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Button, Menu} from 'antd';
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
      icon: <HddFilled />,
    },
    {
      key: 'sub2',
      label: 'Vault',
      icon: <HomeFilled />,
    },
    {
      key: 'sub3',
      label: 'Generate Password',
      icon: <HomeFilled />,
    }
  ];
  
  // Dashboard content
  function dashboardContent() {
    return (
        <div>
          Dashboard
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
    style={{ width: 200 }}
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
        <Button onClick={handleButtonClick}> Click me </Button>
        </header>
    </div>
  );
}

export default App;
