// Vault.tsx
// Jacob Lowe

import React from "react";

interface VaultProps {
  handleButtonClick: (endpoint: string) => void;
  items: { label: string }[];
}

const Vault: React.FC<VaultProps> = () => {
  return <div>Testing</div>;
};

export default Vault;
