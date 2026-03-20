const http = require('http');

const test = (path) => {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
};

const run = async () => {
  const health = await test('/api/health');
  console.log('Health:', health);
  
  const stats = await test('/api/hackathons/stats/overview');
  console.log('Stats:', stats);
};

run();
