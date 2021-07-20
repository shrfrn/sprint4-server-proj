const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getBoard, getBoards, deleteBoard, addBoard, updateBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoards)
router.get('/:id', getBoard)

router.post('/', addBoard)
router.put('/:id',  updateBoard)
router.delete('/:id', deleteBoard)
// router.post('/',  requireAuth, addBoard)
// router.put('/:id',  requireAuth, updateBoard)
// router.delete('/:id',  requireAuth, deleteBoard)

// router.post('/:id/review', addReview)
// router.post('/:id/review',  requireAuth, addReview)

module.exports = router