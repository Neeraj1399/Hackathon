const axios = require('axios');

const test = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/health');
    console.log('Health:', res.data);
    
    // Try to hit a route that might be 404
    try {
      const res2 = await axios.get('http://localhost:5000/api/hackathons/stats/overview');
      console.log('Stats:', res2.status);
    } catch (err) {
      console.log('Stats Error:', err.response?.status, err.response?.data);
    }
  } catch (err) {
    console.log('Error connecting to backend:', err.message);
  }
};

test();
