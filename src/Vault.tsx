// Vault.tsx
// Jacob Lowe

import React, { useState, useEffect, useCallback } from "react";
import { Data } from "./GeneratePassword.tsx";
import { Avatar, Button, ConfigProvider, Checkbox, theme, List } from "antd";
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
    (entry) => entry.name === data.name,
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
  const [currPage, setCurrPage] = useState<number>(0);
  const [blurCheckbox, setBlurCheckbox] = useState<boolean>(true);

  const handleClickFetchDB = useCallback(
    async (page: number): Promise<boolean> => {
      try {
        const elementamt: number = 8;
        const idx_s: number = page * elementamt;
        const idx_e: number = idx_s + 8;
        const result = await API.fetch(ENDPOINTS.FETCH_SLICE, {
          method: "POST",
          body: {
            start_idx: idx_s,
            end_idx: idx_e,
          },
        });
        console.log(result);
        setPasswordList([]);
        result.forEach((data: PasswordEntry) => {
          //const date = data[1]; // TODO: Date for future use in sorting on page
          const name: string = data[2];
          const password: string = data[3];
          const valid = addPassword({ name, password });
          console.log("Name:" + name);
          if (valid) {
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
          } else {
            console.log("Not valid!");
          }
        });
        return true;
      } catch (error) {
        console.error(`Failed to fetch data`, error);
        console.log("Returning false");
        return false;
      }
    },
    [],
  );
  useEffect(() => {
    // Load from accessible list when component mounts
    if (passwordList.length === 0 && currPage === 0) {
      // Fetch data if not already loaded
      handleClickFetchDB(0);
    }
  }, [currPage, passwordList, handleClickFetchDB]);

  const handleClickNextPage = (): void => {
    console.log(passwordList);
    const nextPage = currPage + 1;
    console.log("Fetch forward for " + nextPage);

    handleClickFetchDB(nextPage)
      .then((result) => {
        if (result) {
          console.log("Next Page");
          setCurrPage(nextPage);
        } else {
          console.log("Current Page");
          handleClickFetchDB(currPage);
        }
      })
      .catch((error) => {
        console.error("Error fetching next page:", error);
      });
  };

  const handleClickPrevPage = (): void => {
    if (currPage - 1 < 0) {
      return;
    }
    const prevPage = currPage - 1;
    console.log("Fetch back for " + prevPage);
    handleClickFetchDB(prevPage);
    setCurrPage(currPage - 1);
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
      if (result.ok) {
        console.log("Deleted successfully");
      }
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
        <h3> All Database Passwords</h3>
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
                  description={
                    blurCheckbox ? (
                      <div className="blurred-text">{item.password}</div>
                    ) : (
                      <div>{item.password}</div>
                    )
                  }
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
          <Button type="primary" onClick={handleClickPrevPage}>
            Prev page
          </Button>
          <Button type="primary" onClick={handleClickNextPage}>
            Next page
          </Button>
          <div className="display-blurred-subtext">
            Blurred Text:
            <Checkbox
              checked={blurCheckbox}
              onChange={(e) => setBlurCheckbox(e.target.checked)}
            ></Checkbox>
            <p>Page: {currPage + 1}</p>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Vault;
