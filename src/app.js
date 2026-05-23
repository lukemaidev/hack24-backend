const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const goalProfileRoutes = require('./routes/goalProfileRoutes');
const goalCategoryRoutes = require('./routes/goalCategoryRoutes');
const platformConnectionRoutes = require('./routes/platformConnectionRoutes');
const feedSubmissionRoutes = require('./routes/feedSubmissionRoutes');
const feedItemRoutes = require('./routes/feedItemRoutes');
const weeklyHealthScoreRoutes = require('./routes/weeklyHealthScoreRoutes');
const feedCategoryBreakdownRoutes = require('./routes/feedCategoryBreakdownRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const mentorGoalMappingRoutes = require('./routes/mentorGoalMappingRoutes');
const userMentorPrescriptionRoutes = require('./routes/userMentorPrescriptionRoutes');
const prescribedMentorRoutes = require('./routes/prescribedMentorRoutes');
const portalDailyRefreshRoutes = require('./routes/portalDailyRefreshRoutes');
const portalTileRoutes = require('./routes/portalTileRoutes');
const portalTileInteractionRoutes = require('./routes/portalTileInteractionRoutes');
const alignedScrollSessionRoutes = require('./routes/alignedScrollSessionRoutes');
const alignedScrollItemRoutes = require('./routes/alignedScrollItemRoutes');
const auditHistorySnapshotRoutes = require('./routes/auditHistorySnapshotRoutes');
const userMilestoneRoutes = require('./routes/userMilestoneRoutes');
const shareableScoreCardRoutes = require('./routes/shareableScoreCardRoutes');
const monthlyReflectionRoutes = require('./routes/monthlyReflectionRoutes');
const blockedGoalCategoryRoutes = require('./routes/blockedGoalCategoryRoutes');
const goalProfileFlagRoutes = require('./routes/goalProfileFlagRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', userRoutes);
app.use('/api/goal-profiles', goalProfileRoutes);
app.use('/api/goal-categories', goalCategoryRoutes);
app.use('/api/platform-connections', platformConnectionRoutes);
app.use('/api/feed-submissions', feedSubmissionRoutes);
app.use('/api/feed-items', feedItemRoutes);
app.use('/api/weekly-health-scores', weeklyHealthScoreRoutes);
app.use('/api/feed-category-breakdowns', feedCategoryBreakdownRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentor-goal-mappings', mentorGoalMappingRoutes);
app.use('/api/user-mentor-prescriptions', userMentorPrescriptionRoutes);
app.use('/api/prescribed-mentors', prescribedMentorRoutes);
app.use('/api/portal-daily-refreshes', portalDailyRefreshRoutes);
app.use('/api/portal-tiles', portalTileRoutes);
app.use('/api/portal-tile-interactions', portalTileInteractionRoutes);
app.use('/api/aligned-scroll-sessions', alignedScrollSessionRoutes);
app.use('/api/aligned-scroll-items', alignedScrollItemRoutes);
app.use('/api/audit-history-snapshots', auditHistorySnapshotRoutes);
app.use('/api/user-milestones', userMilestoneRoutes);
app.use('/api/shareable-score-cards', shareableScoreCardRoutes);
app.use('/api/monthly-reflections', monthlyReflectionRoutes);
app.use('/api/blocked-goal-categories', blockedGoalCategoryRoutes);
app.use('/api/goal-profile-flags', goalProfileFlagRoutes);

app.use(errorHandler);

module.exports = app;
