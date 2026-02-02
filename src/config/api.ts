export const API_ROUTES = {
  CONFIG: '/api/config',
  MESSAGES: '/api/messages',
  MESSAGES_STREAM: '/api/messages/stream',
  SEND_MESSAGE: '/api/send-message',
  RECEIVE_MESSAGE: '/api/receive-message',
  USERS: (userId: string) => `/api/users/${userId}`,
};
