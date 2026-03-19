const app = require('./src/app');
const connectDB = require('./src/config/db');
const initCronJobs = require('./src/utils/cronJobs');

// Connect Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
