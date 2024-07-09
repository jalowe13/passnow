// Generate_Password.tsx
// Jacob Lowe

import React, { useRef, useState } from "react";
import {
  Input,
  InputNumber,
  Button,
  Switch,
  FloatButton,
  notification,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { API, ENDPOINTS } from "./Api.ts";
import { addPassword } from "./Vault.tsx";
import PasswordImportMenu from "./PasswordImportMenu.tsx";

// Returning data from the server
export interface Data {
  name: string;
  password: string;
}

const GeneratePassword: React.FC = () => {
  const [value, setValue] = useState<string | number | null>("16"); // Default value for the input number
  const [nameValue, setNameValue] = useState<string>("");
  const [charToggle, setCharToggle] = useState<boolean>(false); // Default value for the toggle button
  const [api, contextHolder] = notification.useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  type NotificationType = "success" | "info" | "warning" | "error";

  const openNotificationWithIcon = (type: NotificationType) => {
    let message = "";
    let description = "";
    switch (type) {
      case "success":
        message = "Success";
        description = "Password submitted";
        break;
      case "error":
        message = "Error";
        description = "Please provide a valid name";
        break;
      default:
        throw new Error(`Unhandled notification type: ${type}`);
    }
    api[type]({
      message: message,
      description: description,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
    console.log("File uploading!");
    setModalOpen(true);
  };

  const handleSubmitOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(false);
    }, 3000);
  };
  const onCharToggleClick = (checked: boolean) => {
    setCharToggle(checked); // Set the toggle button to the opposite of what it currently is
  };

  const handleButtonClick = async (): Promise<void> => {
    const passwordLength =
      typeof value === "string" ? parseInt(value, 10) : value;
    try {
      const result = await API.fetch(ENDPOINTS.GENERATE_PASSWORD, {
        method: "POST",
        body: {
          password_length: passwordLength,
          char_inc: charToggle,
          nameValue: nameValue,
        },
      });
      addPassword(result);
      openNotificationWithIcon("success");
    } catch (error) {
      if (!nameValue) {
        console.error(`No name value`, error);
        openNotificationWithIcon("error");
      }
      console.error(`Failed to fetch data`, error);
    }
  };

  return (
    <div>
      <>{contextHolder}</>
      <Modal
        title="Please select the passwords you would like to import"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmitOk}
          >
            Submit
          </Button>,
        ]}
      >
        <PasswordImportMenu file={file} />
      </Modal>
      <div>
        <h1>Generate Password</h1>
        <div> Website Name </div>
        <div>
          <>
            <Input
              size="large"
              placeholder="Google"
              prefix={<SearchOutlined />}
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
            />
          </>
        </div>
        <div> Password Length</div>
        <InputNumber
          min={1}
          max={50}
          defaultValue={16}
          value={value}
          onChange={setValue}
        />
        <Button
          type="primary"
          onClick={() => {
            setValue(16);
          }}
        >
          Reset
        </Button>
        <div>
          <div>Character Types</div>
          <div>Include Special Characters</div>
          <Switch checked={charToggle} onClick={onCharToggleClick} />
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              handleButtonClick();
            }}
          >
            Generate Password
          </Button>{" "}
          <FloatButton
            tooltip={<div>Upload CSV</div>}
            onClick={() => fileInputRef.current!.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".csv"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePassword;
