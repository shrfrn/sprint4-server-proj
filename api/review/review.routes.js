const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getReviews, addReview} = require('./review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getReviews)
router.post('/', requireAuth, addReview)

module.exports = router