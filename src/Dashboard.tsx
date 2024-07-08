// Dashboard.tsx
// Jacob Lowe
import React from "react";
import { API, ENDPOINTS } from "./Api.ts";
import { Button, Timeline } from "antd";
import { CopyOutlined } from "@ant-design/icons";

//type MenuItem = Required<MenuProps>['items'][number];

interface DashboardProps {
  items: { label: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  function randomNumRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const handleButtonClick = (endpoint: string, data?: any): void => {
    console.log("Call the API with the endpoint: ", endpoint);
    API.fetch(endpoint);
  };

  /*
    Returns specific JSX for each item in the 'items' array
    This is useful for the recent passwords display section
  */
  function recentPassItem(item: { label: string }): JSX.Element {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
        }}
        onClick={() => handleButtonClick(ENDPOINTS.HEALTH)}
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
      </div>
    </div>
  );
};

export default Dashboard;
