const express = require('express'),
    router = express.Router();

const userRoutes = require('./users/users');
const authenticationRoutes = require('./auth/authentication');
const multipleChoiceRoutes = require('./questions/multipleChoice');
const reportRoutes = require('./reports/reports');
const shortText = require('./questions/shortText');
const longText = require('./questions/longText');
const numeric = require('./questions/numeric');
const selectionBox = require('./questions/selectionBox');
const basicRoutes = require('./basics');

router.use(userRoutes);
router.use(authenticationRoutes);
router.use(multipleChoiceRoutes);
//router.use(reportRoutes);
router.use(shortText);
router.use(longText);
router.use(numeric);
router.use(selectionBox);
router.use(basicRoutes);

module.exports = router;
