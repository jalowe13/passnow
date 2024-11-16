// Dashboard.tsx
// Jacob Lowe
import React, { useState, useEffect } from "react";
import { API, ENDPOINTS } from "./Api.ts";
import { Button, Timeline } from "antd";
import { CopyOutlined } from "@ant-design/icons";

//type MenuItem = Required<MenuProps>['items'][number];
interface DashboardProps {
  items: { label: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const [passwordCount, setPasswordCount] = useState<string>("");

  useEffect(() => {
    const fetchPasswordAmount = async () => {
      const amount = await passwordAmount(ENDPOINTS.FETCH_PASSWORD_AMOUNT);
      setPasswordCount(amount);
    };
    fetchPasswordAmount();
  }, []);

  const passwordAmount = async (
    endpoint: string,
    response?: any
  ): Promise<string> => {
    const data = await API.fetch(endpoint, response);
    const stringData = data.toString();
    return stringData;
  };
  const handleButtonClick = (endpoint: string, data?: any): void => {
    API.fetch(endpoint, data);
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
        You have {passwordCount} passwords
        <Button type="primary" icon={<CopyOutlined />}></Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hi!</h1>
      <div>You have {passwordCount} passwords stored in your vault</div>
      <div>
        <div>
          {/*Recently used Passwords8*/}
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
