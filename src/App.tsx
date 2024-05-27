import "./App.css";
import { HomeFilled, HddFilled, KeyOutlined } from "@ant-design/icons";

import { Menu, MenuProps } from "antd";
import React, { useState } from "react";
import Dashboard from "./Dashboard.tsx";
import Vault from "./Vault.tsx";
import GeneratePassword from "./GeneratePassword.tsx";
// Jacob Lowe

// Viewing Screens
enum View {
  Dashboard,
  Vault,
  GeneratePassword,
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard); // ['dashboard', 'vault', 'generate-password'

  const handleClickMenu: MenuProps["onClick"] = (e) => {
    console.log(e.key);
    switch (e.key) {
      case "sub1":
        setView(View.Dashboard);
        break;
      case "sub2":
        setView(View.Vault);
        break;
      case "sub3":
        setView(View.GeneratePassword);
        break;
    }
  };

  /*
    Generic function to handle button clicks and send a POST request to the server based on
    the endpoint passed in as a string parameter.
  */
  const handleButtonClick = (endpoint: string): void => {
    console.log("Button clicked with string", endpoint);
    fetch(`http://127.0.0.1:8080/api/${endpoint}`, { method: "POST" });
  };

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Dashboard",
      icon: <HomeFilled />,
    },
    {
      key: "sub2",
      label: "Vault",
      icon: <HddFilled />,
    },
    {
      key: "sub3",
      label: "Generate Password",
      icon: <KeyOutlined />,
    },
  ];

  const dashboard_items = [
    { label: "Dice" },
    { label: "Codewars" },
    { label: "AMD" },
    { label: "Paypal" },
  ];
  return (
    <div className="App">
      <Menu
        defaultSelectedKeys={["sub1"]}
        defaultOpenKeys={["sub1"]}
        mode="vertical"
        items={items}
        theme="dark"
        onClick={(e) => handleClickMenu(e)}
      />
      <header className="App-header">
        {view === View.Dashboard && (
          <Dashboard
            handleButtonClick={handleButtonClick}
            items={dashboard_items}
          />
        )}
        {view === View.Vault && (
          <Vault
            handleButtonClick={handleButtonClick}
            items={dashboard_items}
          />
        )}
        {view === View.GeneratePassword && (
          <GeneratePassword
            handleButtonClick={handleButtonClick}
            items={dashboard_items}
          />
        )}
      </header>
    </div>
  );
};

export default App;
