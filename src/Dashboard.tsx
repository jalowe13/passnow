// Dashboard.tsx
// Jacob Lowe
import React from "react";
import { Button, Timeline } from "antd";
import { CopyOutlined } from "@ant-design/icons";

//type MenuItem = Required<MenuProps>['items'][number];

interface DashboardProps {
  handleButtonClick: (endpoint: string) => void;
  items: { label: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ handleButtonClick, items }) => {
  // ...
  function randomNumRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function recentPassItem(item: { label: string }): JSX.Element {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <span>{item.label}</span>
        <Button type="primary" icon={<CopyOutlined />}></Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hi!</h1>
      <div>
        You have {randomNumRange(10, 100)} passwords stored in your vault
      </div>
      <div>
        <div>
          Recently used Passwords
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Timeline
              style={{ display: "inline", color: "black", marginTop: "20px" }}
            >
              {items.map((item) => recentPassItem(item))}
            </Timeline>
          </div>
        </div>
        <Button onClick={() => handleButtonClick("button-clicked")}>
          {" "}
          Set Database to 1{" "}
        </Button>
        <Button onClick={() => handleButtonClick("save")}>
          {" "}
          Save API Test{" "}
        </Button>
        <Button onClick={() => handleButtonClick("set")}>Set API Test </Button>
      </div>
    </div>
  );
};

export default Dashboard;
