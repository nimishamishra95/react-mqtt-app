import React from "react";
import MqttClient from "./MqttClient";

const App: React.FC = () => {
  return (
    <div>
      <h1>React MQTT Dashboard</h1>
      <MqttClient />
    </div>
  );
};

export default App;
