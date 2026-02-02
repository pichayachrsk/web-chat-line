export const API_ROUTES = {
  CONFIG: '/api/config',
  MESSAGES: '/api/messages',
  SEND_MESSAGE: '/api/send-message',
  USERS: (userId: string) => `/api/users/${userId}`,
};
