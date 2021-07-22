
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
    addActivity,
    removeActivities,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('users')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('users')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // pick only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            imgUrl: user.imgUrl
        }
        const collection = await dbService.getCollection('users')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        user.createdAt = Date.now()

        const collection = await dbService.getCollection('users')
        const {insertedId} = await collection.insertOne(user)
        user._id = insertedId // need ObjectId() here?
        return user
        
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}


async function addActivity(users, activity){

    try {
        const userColection = await dbService.getCollection('users')
        await userColection.updateMany({ '_id': { $in: users } }, { $push: {activities: activity} })
        return activity
    } catch (err) {
        logger.error('cannot add activity to user', err)
        throw err
    }
}
async function removeActivities(userId, activity){

    let criteria = {}

    if(activity.id) criteria.id = activity.id
    if(activity.taskId) criteria.taskId = activity.taskId
    if(activity.groupId) criteria.groupId = activity.groupId
    if(activity.boardId) criteria.boardId = activity.boardId
    if(activity.type) criteria.type = activity.type

    try {
        await dbService.getCollection('users')                     // destructuring
        await users.update({ '_id': ObjectId(userId) }, { $pull: { activities: criteria }}) //updateOne() ?
    } catch (err) {
        logger.error('cannot add activity to user', err)
        throw err
    }
}

function _buildCriteria(filterBy = {}) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}