const appConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  env: process.env.REACT_APP_ENV || 'development',
};

export default appConfig;
