// Generate_Password.tsx
// Jacob Lowe

import React, { useState } from "react";
import { InputNumber, Button, Switch } from "antd";

interface GeneratePasswordProps {
  handleButtonClick: (
    endpoint: string,
    data: { passwordLength?: string | number | null; charToggle?: boolean }
  ) => void;
  items: { label: string }[];
  responseData: string;
}

const GeneratePassword: React.FC<GeneratePasswordProps> = ({
  handleButtonClick,
  responseData,
}) => {
  const [value, setValue] = useState<string | number | null>("16"); // Default value for the input number
  const [charToggle, setCharToggle] = useState<boolean>(false); // Default value for the toggle button
  const onCharToggleClick = (checked: boolean) => {
    setCharToggle(checked); // Set the toggle button to the opposite of what it currently is
  };

  return (
    <div>
      <h1>Generate Password</h1>
      <div>
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
              const passwordLength =
                typeof value === "string" ? parseInt(value, 10) : value;
              handleButtonClick("generate-password", {
                passwordLength,
                charToggle: charToggle,
              });
            }}
          >
            Generate Password
          </Button>
          <div>
            <h2>Password</h2>
            <div>{responseData}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePassword;
