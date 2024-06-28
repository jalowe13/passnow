import React from "react";
import { View, useView } from "../App.tsx";
import Dashboard from "../Dashboard.tsx";
import Vault from "../Vault.tsx";
import GeneratePassword from "../GeneratePassword.tsx";

const ContentView: React.FC = () => {
  const { view } = useView();
  const dashboard_items = [
    { label: "Dice" },
    { label: "Codewars" },
    { label: "AMD" },
    { label: "Paypal" },
  ];
  return (
    <div>
      <header className="App-header">
        {view === View.Dashboard && <Dashboard items={dashboard_items} />}
        {view === View.Vault && <Vault items={dashboard_items} />}
        {view === View.GeneratePassword && <GeneratePassword />}
      </header>
    </div>
  );
};

export default ContentView;
