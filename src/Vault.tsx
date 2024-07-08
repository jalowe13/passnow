// Vault.tsx
// Jacob Lowe

import React, { useState, useEffect } from "react";
import { Data } from "./GeneratePassword.tsx";
import { Avatar, Button, ConfigProvider, theme, List } from "antd";
import { API, ENDPOINTS } from "./Api.ts";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";

interface VaultProps {
  items: { label: string }[];
}

type PasswordEntry = {
  name: string;
  password: string;
};

// This list is accessible outside of the Vault and is updated from the
// Password Generator
let passwordListAccessible: PasswordEntry[] = [];

export function addPassword(data: Data): boolean {
  // Validation check
  if (!data.name || !data.password) {
    return false; // Invalid data
  }
  // Index of the entry in the password entrys if it exists
  const idx = passwordListAccessible.findIndex(
    (entry) => entry.name === data.name
  );
  if (idx !== -1) {
    // Update
    passwordListAccessible[idx].password = data.password;
  } else {
    // Push
    passwordListAccessible.push({ name: data.name, password: data.password });
  }
  return true;
}

const Vault: React.FC<VaultProps> = () => {
  // This list is the private list that handles deletion and needs the
  // state handled on removal whereas add does not because its not on the
  // same screen
  const [passwordList, setPasswordList] = useState<PasswordEntry[]>([]);
  useEffect(() => {
    // Load from accessible list when component mounts
    setPasswordList([...passwordListAccessible]);
    handleClickFetchDB(); // First time fetch
  }, []);

  const handleClickFetchDB = async (): Promise<void> => {
    try {
      const result = await API.fetch(ENDPOINTS.ALL_PASSWORDS, {});
      console.log(result);
      result.forEach((data) => {
        //const date = data[1]; // TODO: Date for future use in sorting on page
        const name: string = data[2];
        const password: string = data[3];
        const valid = addPassword({ name, password });
        if (valid) {
          console.log(`Added ${name}`);
          setPasswordList((prevList) => {
            const index = prevList.findIndex((entry) => entry.name === name);
            if (index !== -1) {
              // Update existing entry
              const newList = [...prevList];
              newList[index].password = password;
              return newList;
            } else {
              // Add new entry
              return [...prevList, { name, password }];
            }
          });
        }
      });
    } catch (error) {
      console.error(`Failed to fetch data`, error);
    }
  };

  const handleClickDeleteDB = async (name: string): Promise<void> => {
    console.log("Handle click");
    try {
      const result = await API.fetch(ENDPOINTS.DELETE_PASSWORD, {
        method: "DELETE",
        body: {
          nameValue: name,
        },
      });
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };
  function removePassword(name: string): boolean {
    // Validation check
    if (!name) {
      return false;
    }
    // Index of the entry if it exists in the list
    const idx = passwordList.findIndex((entry) => entry.name === name);
    if (idx !== -1) {
      // Create a new array without the removed item
      const newPasswordList = passwordList.filter((_, index) => index !== idx);
      // Update the state with the new array
      setPasswordList(newPasswordList);

      // Update in the database
      console.log("NAME:" + name);
      handleClickDeleteDB(name);

      // Update the accessible list
      passwordListAccessible = [...newPasswordList];
      return true;
    }
    console.error(`Entry not found ${name}`, 404);
    return false;
  }
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Optional: Show a success message
        console.log("Copied");
      })
      .catch((err) => {
        // Optional: Show an error message
        console.error("Failed to copy: ", err);
      });
  };

  const DIM_WHITE: string = "#D9D9D9";
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        components: {
          List: {
            // Targeting the List.Item specifically
            itemPadding: "16px",
            colorSplit: DIM_WHITE,
            colorBorder: DIM_WHITE,
            colorText: DIM_WHITE, // White text for better contrast
            colorTextDescription: DIM_WHITE,
          },
        },
      }}
    >
      <div>
        <h1> All Passwords</h1>
        <div>
          <List
            itemLayout="horizontal"
            bordered={true}
            size="large"
            dataSource={passwordList}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://logo.clearbit.com/${item.name}.com`}
                    />
                  }
                  title={item.name}
                  description={item.password}
                />
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(item.password)}
                ></Button>
                <Button
                  type="primary"
                  danger={true}
                  icon={<DeleteOutlined />}
                  onClick={() => removePassword(item.name)}
                ></Button>
              </List.Item>
            )}
          />
          <Button
            type="primary"
            onClick={() => {
              handleClickFetchDB();
            }}
          >
            Fetch Data
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Vault;
