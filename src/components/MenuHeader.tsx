import React from "react";
import { HomeFilled, HddFilled, KeyOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useView, View } from "../App.tsx";

const MenuHeader: React.FC = () => {
  // States
  const { setView } = useView();
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

  // Default selected Menu Key
  return (
    <div className="App">
      <Menu
        defaultSelectedKeys={["sub3"]}
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
