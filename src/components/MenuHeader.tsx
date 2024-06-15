import React, { useState, useCallback } from "react";
import { HomeFilled, HddFilled, KeyOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useView, View } from "../App.tsx";

const MenuHeader: React.FC = () => {
  // States
  const { view, setView } = useView();
  const [responseData, setResponseData] = useState<string>(""); // Response data from the server
  const [data, setData] = useState<any>(null); // Data from the server
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
    // endpoint: string - the endpoint to send the POST request to
    // data: any - optional data to send to the server
  */
  // Button click event handler
  const handleButtonClick = useCallback(
    async (apiFunction: () => Promise<any>) => {
      console.log(`Button clicked!`);
      try {
        const data = await apiFunction();
        console.log("Api data:", data);
        setData(data); // Set the data state
        return data;
      } catch (error) {
        console.error(`Failed to fetch data`, error);
      }
    },
    [] // The array is the dependency list for the callback that holds all variables it depends on
  );

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

  return (
    <div className="App">
      <Menu
        defaultSelectedKeys={["sub1"]}
        defaultOpenKeys={["sub1"]}
        mode="horizontal"
        items={items}
        theme="dark"
        onClick={handleClickMenu}
      />
    </div>
  );
};

export default MenuHeader;
