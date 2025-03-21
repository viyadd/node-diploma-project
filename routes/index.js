const express = require('express');

const router = express.Router({ mergeParams: true });

router.use('/', require('./auth'));
router.use('/users', require('./users'));
router.use('/states', require('./states'))
router.use('/projects', require('./projects'))
router.use('/tasks', require('./tasks'))
router.use('/spent-times', require('./spentTimes'))
router.use('/analytics', require('./analytics'))

module.exports = router;
