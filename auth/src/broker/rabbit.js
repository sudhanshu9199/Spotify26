import amqp from "amqplib";
import config from "../config/config.js";

let channel, connection;

export async function connect() {
  try {
    // Append heartbeat to prevent idle connection drops (ECONNRESET) on CloudAMQP
    const uri = config.RABBITMQ_URI.includes('?') ? config.RABBITMQ_URI : `${config.RABBITMQ_URI}?heartbeat=60`;
    connection = await amqp.connect(uri);
    channel = await connection.createChannel();

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
      setTimeout(connect, 5000); // Production: auto-reconnect on error
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Reconnecting...");
      setTimeout(connect, 5000); // Production: auto-reconnect on close
    });

    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ, retrying...", err.message);
    setTimeout(connect, 5000);
  }
}

export async function publishToQueue(queueName, data) {
  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log("Message sent to queue", queueName);
}
