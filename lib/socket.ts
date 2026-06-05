// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { ENV_CONFIG } from "@/config/env";

// let stompClient: Client | null = null;
// let onNotificationReceived: ((data: any) => void) | null = null;

// export const initSocket = (userId: number) => {
//   if (stompClient?.active) return;

//   stompClient = new Client({
//     webSocketFactory: () => new SockJS(`${ENV_CONFIG.APP_URL_BASE}/ws?userId=${userId}`),
//     reconnectDelay: 5000,
//     connectHeaders: {
//       userId: userId.toString(),
//     },

//     onConnect: () => {
//       console.log("✅ Socket connected successfully");

//       stompClient?.subscribe("/user/queue/notifications", (message) => {
//         try {
//           const data = JSON.parse(message.body);
//           console.log("🔔 New Notification:", data);

//           // Gọi callback nếu có
//           onNotificationReceived?.(data);
//         } catch (err) {
//           console.error("Error parsing notification:", err);
//         }
//       });
//     },

//     onStompError: (frame) => {
//       console.error("STOMP Error:", frame);
//     },
//     onWebSocketError: (err) => {
//       console.error("WebSocket Error:", err);
//     },
//   });

//   stompClient.activate();
// };

// export const disconnectSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//   }
// };

// // Đăng ký callback để Header nhận thông báo
// export const setNotificationListener = (callback: (data: any) => void) => {
//   onNotificationReceived = callback;
// };

// src/lib/socket.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ENV_CONFIG } from "@/config/env";

let stompClient: Client | null = null;
let listeners: Array<(data: any) => void> = [];

// Khởi tạo Socket (chỉ gọi 1 lần)
export const initSocket = (userId: number) => {
  if (stompClient?.active) {
    console.log("Socket already active");
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${ENV_CONFIG.APP_URL_BASE}/ws?userId=${userId}`),

    reconnectDelay: 5000,

    connectHeaders: {
      userId: userId.toString(),
    },

    onConnect: () => {
      console.log("✅ Socket connected successfully");

      stompClient?.subscribe("/user/queue/notifications", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("🔔 New Notification received:", data);

          // Gọi tất cả listeners
          listeners.forEach((callback) => {
            try {
              callback(data);
            } catch (err) {
              console.error("Error in notification listener:", err);
            }
          });
        } catch (err) {
          console.error("Error parsing notification message:", err);
        }
      });
    },

    onStompError: (frame) => {
      console.error("STOMP Error:", frame);
    },

    onWebSocketError: (err) => {
      console.error("WebSocket Error:", err);
    },

    onDisconnect: () => {
      console.log("Socket disconnected");
    },
  });

  stompClient.activate();
};

// Ngắt kết nối
export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
  listeners = []; // Xóa hết listeners khi disconnect
};

// ====================== HỖ TRỢ NHIỀU LISTENER ======================

// Đăng ký listener (có thể gọi ở nhiều component)
export const addNotificationListener = (callback: (data: any) => void) => {
  if (typeof callback !== "function") return () => {};

  listeners.push(callback);

  // Trả về hàm unsubscribe
  return () => {
    removeNotificationListener(callback);
  };
};

// Xóa một listener cụ thể
export const removeNotificationListener = (callback: (data: any) => void) => {
  listeners = listeners.filter((listener) => listener !== callback);
};

// Xóa tất cả listeners (nếu cần)
export const clearAllListeners = () => {
  listeners = [];
};

// Kiểm tra socket hiện tại
export const getSocket = () => stompClient;

export const isSocketConnected = () => stompClient?.active || false;
