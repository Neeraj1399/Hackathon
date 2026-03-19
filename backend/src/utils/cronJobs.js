const cron = require('node-cron');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const { 
  sendHackathonStartEmail, 
  sendDeadlineAlertEmail, 
  sendThankYouEmail 
} = require('./emailService');

const initCronJobs = () => {
  // Check every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running automated hackathon notification checks...');
    const now = new Date();

    try {
      // 1. Start Emails
      const startingHackathons = await Hackathon.find({
        startDate: { $lte: now },
        isStartEmailSent: false,
        isActive: true
      });

      for (const hack of startingHackathons) {
        const participants = await User.find({ role: 'participant' });
        for (const user of participants) {
          await sendHackathonStartEmail(user.email, hack.title);
        }
        hack.isStartEmailSent = true;
        await hack.save();
        console.log(`Start emails sent for: ${hack.title}`);
      }

      // 2. Deadline Alerts (24 hours before)
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const deadlineHackathons = await Hackathon.find({
        submissionDeadline: { $lte: oneDayFromNow, $gt: now },
        isDeadlineAlertSent: false,
        isActive: true
      });

      for (const hack of deadlineHackathons) {
        const participants = await User.find({ role: 'participant' });
        for (const user of participants) {
          await sendDeadlineAlertEmail(user.email, hack.title, 24);
        }
        hack.isDeadlineAlertSent = true;
        await hack.save();
        console.log(`Deadline alerts sent for: ${hack.title}`);
      }

      // 3. End Emails (Thank you)
      const endedHackathons = await Hackathon.find({
        endDate: { $lte: now },
        isEndEmailSent: false
      });

      for (const hack of endedHackathons) {
        // Send to Participants (those who submitted)
        const Submission = require('../models/Submission');
        const submissions = await Submission.find({ hackathonId: hack._id }).populate('userId', 'email');
        
        for (const sub of submissions) {
          if (sub.userId && sub.userId.email) {
            await sendThankYouEmail(sub.userId.email, hack.title, 'Participant');
          }
        }

        // Send to Judges
        const judges = await User.find({ _id: { $in: hack.judges } });
        for (const user of judges) {
          await sendThankYouEmail(user.email, hack.title, 'Judge');
        }
        
        hack.isEndEmailSent = true;
        hack.isActive = false; // Auto-deactivate ended tracks
        await hack.save();
        console.log(`End/Thank-you emails sent for: ${hack.title}`);
      }

    } catch (err) {
      console.error('Error in cron jobs:', err);
    }
  });
};

module.exports = initCronJobs;
