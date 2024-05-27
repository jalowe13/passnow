import './App.css';
import {HomeFilled, HddFilled, KeyOutlined, CopyOutlined} from '@ant-design/icons';

import {Button, Menu, MenuProps, Timeline} from 'antd';
import React, { useState } from 'react';
// Jacob Lowe

// Viewing Screens
enum View {
  Dashboard,
  Vault,
  GeneratePassword,
}

const App: React.FC = () =>{
  const [view, setView] = useState<View>(View.Dashboard); // ['dashboard', 'vault', 'generate-password'


  const handleClickMenu: MenuProps['onClick'] = (e) => {
    console.log(e.key)
    switch(e.key) {
      case 'sub1':
        setView(View.Dashboard);
        break;
      case 'sub2':
        setView(View.Vault);
        break;
      case 'sub3':
        setView(View.GeneratePassword);
        break;
    }
  }

  /*
    Generic function to handle button clicks and send a POST request to the server based on
    the endpoint passed in as a string parameter.
  */
  const handleButtonClick = (endpoint: string): void => {
    console.log('Button clicked with string', endpoint);
    fetch(`http://127.0.0.1:8080/api/${endpoint}`, { method: 'POST' });
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
    function randomNumRange(min : number, max: number) : number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function recentPassItem(item: {label : string}): JSX.Element {
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
          <Button onClick={() => handleButtonClick('button-clicked')}> Set Database to 1 </Button>
          <Button onClick={() => handleButtonClick('save')}> Save API Test </Button>
          <Button onClick={() => handleButtonClick('set')}>Set API Test </Button>
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
        view === View.Dashboard && dashboardContent() 
      }
      {
        view === View.Vault && VaultContent()
      }
      {
       view === View.GeneratePassword && GeneratePasswordContent()
      }
        </header>
    </div>
  );
}

export default App;
