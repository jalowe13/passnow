// Generate_Password.tsx
// Jacob Lowe

import React, { useState } from "react";
import { Input, InputNumber, Button, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { API, ENDPOINTS } from "./Api.ts";

interface GeneratePasswordProps {
  // handleButtonClick: (
  //   endpoint: string,
  //   data: { passwordLength?: string | number | null; charToggle?: boolean }
  // ) => void;
  items: { label: string }[];
  //responseData: string;
}

// Returning data from the server
interface Data {
  password: string;
}
const defaultData: Data = {
  password: "",
};

const GeneratePassword: React.FC<GeneratePasswordProps> = (
  {
    // handleButtonClick,
    //responseData,
  }
) => {
  const [data, setData] = useState<Data>(defaultData); // Data from the server
  const [value, setValue] = useState<string | number | null>("16"); // Default value for the input number
  const [nameValue, setNameValue] = useState<string>("");
  const [charToggle, setCharToggle] = useState<boolean>(false); // Default value for the toggle button
  const onCharToggleClick = (checked: boolean) => {
    setCharToggle(checked); // Set the toggle button to the opposite of what it currently is
  };

  const handleButtonClick = async (): Promise<void> => {
    const passwordLength =
      typeof value === "string" ? parseInt(value, 10) : value;
    try {
      const result = await API.fetch(ENDPOINTS.GENERATE_PASSWORD, {
        passwordLength,
        charToggle,
        // TODO: Name here!
      });
      alert(result);
      setData(result);
    } catch (error) {
      console.error(`Failed to fetch data`, error);
    }
  };

  return (
    <div>
      <h1>Generate Password</h1>
      <div>
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
          </Button>
          <div>
            <h2>Password</h2>
            <div>{data.password}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePassword;
