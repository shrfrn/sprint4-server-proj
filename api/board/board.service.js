const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    addActivity,
};

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    // const sort = (filterBy.sortBy === 'name') ? { txt: 1 } : { price: 1 }
    try {
        // TODO: Implement board types:
        // public - accessible to all,
        // private - created by loggedInUser,
        // shared - created by others and shared with loggedInUser.
        // Retrieve board list accordindly.

        const collection = await dbService.getCollection('boards');
        var boards = await collection.find().toArray();
        // var boards = await collection.find(criteria).sort(sort).toArray()
        boards = boards.map((board) => {
            delete board.groups;
            return board;
        });
        return boards;
    } catch (err) {
        logger.error('cannot find boards', err);
        throw err;
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('boards');
        const board = await collection.findOne({ _id: ObjectId(boardId) });
        return board;
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err);
        throw err;
    }
}

async function remove(boardId) {
    // TODO: only board creator can remove it.
    // TODO: delete by flagging board as deleted. (?)
    try {
        const collection = await dbService.getCollection('boards');
        await collection.deleteOne({ _id: ObjectId(boardId) });
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err);
        throw err;
    }
}

async function update(board) {
    try {
        board._id = ObjectId(board._id);
        const collection = await dbService.getCollection('boards');
        await collection.updateOne({ _id: board._id }, { $set: board });
        return board;
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err);
        throw err;
    }
}

async function add(board) {
    try {
        board.createdAt = Date.now();

        const collection = await dbService.getCollection('boards');
        const { insertedId } = await collection.insertOne(board);
        console.log('insertedId', insertedId);
        board._id = insertedId; // need ObjectId() here?
        return board;
    } catch (err) {
        logger.error('cannot insert board', err);
        throw err;
    }
}

async function addActivity(activity) {
    const boardId = activity.boardId;
    // delete activity.boardId

    try {
        const boards = await dbService.getCollection('boards');
        await boards.updateOne({ _id: ObjectId(boardId) }, { $push: { activities: activity } });
        return activity;
    } catch (err) {
        logger.error('cannot add activity to board', err);
        throw err;
    }
}

// Private functions

function _buildCriteria(filterBy) {
    const criteria = {};

    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' };
        criteria.name = txtCriteria;
    }
    if (filterBy.inStock !== 'all') {
        criteria.inStock = filterBy.inStock === 'in-stock' ? 'true' : 'false';
    }
    if (filterBy.boardType !== 'all') {
        criteria.type = filterBy.boardType;
    }
    return criteria;
}
