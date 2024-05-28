// Generate_Password.tsx
// Jacob Lowe

import React, { useState } from "react";
import { InputNumber, Button } from "antd";

interface GeneratePasswordProps {
  handleButtonClick: (endpoint: string, data: string | number | null) => void;
  items: { label: string }[];
}

const GeneratePassword: React.FC<GeneratePasswordProps> = ({
  handleButtonClick,
}) => {
  const [value, setValue] = useState<string | number | null>("99"); // Default value for the input number
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
          <Button
            type="primary"
            onClick={() => {
              handleButtonClick("generate-password", value);
            }}
          >
            Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePassword;
