export const API_BASE = import.meta.env.VITE_API_URL ||
                        'http://localhost:5000';

export const API_ENDPOINTS = {
  chat: `${API_BASE}/api/slm/chat`,
  profile: `${API_BASE}/api/profile`,
  analyze: `${API_BASE}/api/slm/analyze`,
  liveRates: `${API_BASE}/api/rates/live`,
  health: `${API_BASE}/api/health`,
  chatHistory: `${API_BASE}/api/chat/history`,
  chatMessage: `${API_BASE}/api/chat/message`,
  login: `${API_BASE}/api/auth/login`,
  signup: `${API_BASE}/api/auth/signup`,
};

export default API_BASE;
