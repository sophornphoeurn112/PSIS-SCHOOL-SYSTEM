import appConfig from '../config/appConfig';

const apiClient = async (path, options = {}) => {
  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

export default apiClient;
