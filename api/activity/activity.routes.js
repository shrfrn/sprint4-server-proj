const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { addActivity, removeActivities } = require('./activity.controller')

const router = express.Router()

router.post('/add', addActivity)
router.put('/remove', requireAuth, removeActivities)

module.exports = router