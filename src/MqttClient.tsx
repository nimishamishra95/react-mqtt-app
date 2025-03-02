import React, { useEffect, useState } from "react";
import mqtt, { MqttClient as MQTTClientType } from "mqtt";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for MQTT messages
interface MqttMessage {
  timestamp: string;
  value: number;
}

// Define type for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// MQTT Broker Settings
const MQTT_BROKER = "wss://broker.hivemq.com:8884/mqtt"; // WebSocket Port
const TOPICS = [
  "time_series/data",
  "time_series/data_stream_2",
  "time_series/data_stream_3",
];

const MqttClient: React.FC = () => {
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [chartData1, setChartData1] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Stream 1 - Data",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  });
  const [chartData2, setChartData2] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Stream 2 - Data",
        data: [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  });
  const [chartData3, setChartData3] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Stream 3 - Data",
        data: [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Connect to MQTT broker
    const client: MQTTClientType = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      TOPICS.forEach((topic) => client.subscribe(topic));
    });

    client.on("message", (topic, message) => {
      try {
        const data: MqttMessage = JSON.parse(message.toString());
        console.log(`Received from ${topic}:`, data);

        // Update messages state
        setMessages((prev) => [...prev, data]);

        // Update chart data for each stream
        if (topic === "time_series/data") {
          setChartData1((prevChartData) => {
            const newLabel = data.timestamp;
            const newData = data.value;
            return {
              labels: [...prevChartData.labels, newLabel],
              datasets: [
                {
                  ...prevChartData.datasets[0],
                  data: [...prevChartData.datasets[0].data, newData],
                },
              ],
            };
          });
        } else if (topic === "time_series/data_stream_2") {
          setChartData2((prevChartData) => {
            const newLabel = data.timestamp;
            const newData = data.value;
            return {
              labels: [...prevChartData.labels, newLabel],
              datasets: [
                {
                  ...prevChartData.datasets[0],
                  data: [...prevChartData.datasets[0].data, newData],
                },
              ],
            };
          });
        } else if (topic === "time_series/data_stream_3") {
          setChartData3((prevChartData) => {
            const newLabel = data.timestamp;
            const newData = data.value;
            return {
              labels: [...prevChartData.labels, newLabel],
              datasets: [
                {
                  ...prevChartData.datasets[0],
                  data: [...prevChartData.datasets[0].data, newData],
                },
              ],
            };
          });
        }
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h2>Graphs</h2>

      {/* Render Line Chart for Stream 1 */}
      <h3>Real-time Data Stream 1</h3>
      <Line data={chartData1} />

      {/* Render Line Chart for Stream 2 */}
      <h3>Real-time Data Stream 2</h3>
      <Line data={chartData2} />

      {/* Render Line Chart for Stream 3 */}
      <h3>Real-time Data Stream 3</h3>
      <Line data={chartData3} />

      <h2>Sensor Readings</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.timestamp}</strong>: {msg.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MqttClient;
