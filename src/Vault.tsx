// Vault.tsx
// Jacob Lowe

import React from "react";
import { Data } from "./GeneratePassword.tsx";
import { Avatar, Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface VaultProps {
  items: { label: string }[];
}

type PasswordEntry = {
  name: string;
  password: string;
};

// Initially Empty list of PasswordEntry type
// TODO: This must be a state in order to be changed without page reload
const passwordList: PasswordEntry[] = [];

export function addPassword(data: Data): boolean {
  // Validation check
  if (!data.name || !data.password) {
    return false; // Invalid data
  }
  // Index of the entry in the password entrys if it exists
  const idx = passwordList.findIndex((entry) => entry.name === data.name);
  if (idx !== -1) {
    // Update
    passwordList[idx].password = data.password;
  } else {
    // Push
    passwordList.push({ name: data.name, password: data.password });
  }
  return true;
}

function removePassword(name: string): boolean {
  // Validation check
  if (!name) {
    return false;
  }
  // Index of the entry if it exists in the list
  const idx = passwordList.findIndex((entry) => entry.name === name);
  if (idx !== -1) {
    passwordList.splice(idx, 1);
    return true;
  }
  console.error(`Entry not found ${name}`, 404);
  return false;
}

const Vault: React.FC<VaultProps> = () => {
  const handleClick =
    (itemPass: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault(); // Prevent navigation
      navigator.clipboard
        .writeText(itemPass)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };
  const handleClickDelete = {};
  return (
    <div>
      <h1> All Passwords</h1>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={passwordList}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={`https://logo.clearbit.com/${item.name}.com`} />
                }
                title={
                  <a href="#" onClick={handleClick(item.password)}>
                    {item.name}
                  </a>
                }
                description={item.password}
              />
              <Button
                type="primary"
                danger={true}
                icon={<DeleteOutlined />}
                onClick={() => removePassword(item.name)}
              ></Button>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Vault;
