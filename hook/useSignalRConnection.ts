import { useState, useCallback, useEffect, useRef } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr"; // Import SignalR

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

interface UseSignalRConnectionResult {
  isConnected: boolean;
  error: string | null;
  connect: (onLoadAssignedOrder: () => void) => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useSignalRConnection(): UseSignalRConnectionResult {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  const connect = useCallback(async (onLoadAssignedOrder: () => void) => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/notifications`, {
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection.on("LOAD_ASSIGNED_ORDER", () => {
      console.log("Received LOAD_ASSIGNED_ORDER event");
      onLoadAssignedOrder(); // Gọi hàm callback được truyền vào
    });

    connection.onclose(() => {
      setIsConnected(false);
      setError("Connection closed");
    });

    connection.onreconnecting(() => {
      setIsConnected(false);
      setError("Attempting to reconnect...");
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      setError(null);
    });

    try {
      await connection.start();
      console.log("SignalR Connection established");
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("SignalR connection error:", err);
      setError("Failed to connect to SignalR");
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
        setError(null);
      } catch (err) {
        console.error("Error disconnecting:", err);
        setError("Failed to disconnect");
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
  };
}
