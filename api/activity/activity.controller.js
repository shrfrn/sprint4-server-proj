const userService = require('../user/user.service.js')
const boardService = require('../board/board.service.js')

const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

async function addActivity(req, res) {

    const activity = req.body
    
    activity.id = _makeId(10)
    activity.createdAt = Date.now()
    
    const { user } = req.session
    if(user) activity.byUserId = user._id

    try {
        // Create array with userId's of board members

        let users = []
        const board = await boardService.getById(activity.boardId)
        users = board.members.map(member => ObjectId(member._id))

        // Register the activity in the board and in the relevant users

        const prmBoards = boardService.addActivity(activity)
        const prmUsers = userService.addActivity(users, activity)

        await Promise.all([prmUsers, prmBoards])
        res.json(activity)

    } catch (err) {
        logger.error('cannot add activity', err)
        throw err
    }
}

async function removeActivities(req, res ){

    const { user } = req.session
    const { activity } = req.body

    const users = await userService.removeActivities(user._id, activity)
}

// Private functions 

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

module.exports = {
    addActivity,
    removeActivities,
}