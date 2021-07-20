
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    // getByBoardname,
    remove,
    update,
    add,
    // addReview,
}

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    // const sort = (filterBy.sortBy === 'name') ? { txt: 1 } : { price: 1 }
    try {
        
        // TODO: Implement board types: 
        // public - accessible to all,
        // private - created by loggedInUser, 
        // shared - created by others and shared with loggedInUser.
        // Retrieve board list accordindly.
        
        const collection = await dbService.getCollection('boards')
        var boards = await collection.find().toArray()
        // var boards = await collection.find(criteria).sort(sort).toArray()
        boards = boards.map(board => {
            delete board.groups
            return board
        })
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        const board = await collection.findOne({ '_id': ObjectId(boardId) })

        // board.givenReviews = await reviewService.query({ byBoardId: ObjectId(board._id) })
        // board.givenReviews = board.givenReviews.map(review => {
        //     delete review.byBoard
        //     return review
        // })

        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}
// async function getByBoardname(boardname) {
//     try {
//         const collection = await dbService.getCollection('boards')
//         const board = await collection.findOne({ boardname })
//         return board
//     } catch (err) {
//         logger.error(`while finding board ${boardname}`, err)
//         throw err
//     }
// }

async function remove(boardId) {
    
    // TODO: only board creator can remove it.
    // TODO: delete by flagging board as deleted. (?)
    try {
        const collection = await dbService.getCollection('boards')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function update(board) {
    try {
        // peek only updatable fields!
        // const boardToSave = JSON.parse(JSON.stringify(board))
        // console.log('boardToSave', board); // use ObjectId() ?
        console.log('after DB\n', board.groups[0].tasks);
        const collection = await dbService.getCollection('boards')
        board._id = ObjectId(board._id)
        const res = await collection.updateOne({ '_id': board._id }, { $set: board })
        return board;
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(board) {
    try {
        board.createdAt = Date.now()

        const collection = await dbService.getCollection('boards')
        const {insertedId} = await collection.insertOne(board)
        console.log('insertedId', insertedId);
        board._id = insertedId // need ObjectId() here?
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

// async function addReview(boardId, review) {
//     try {
//         const collection = await dbService.getCollection('boards')
//         review.id = _makeId()
//         review.createdAt = Date.now()
//         await collection.updateOne({ '_id': ObjectId(boardId) }, { $push: {reviews: review} })
//         return review
//     } catch (err) {
//         logger.error('cannot insert board', err)
//         throw err
//     }
// }

// Private functions 

function _buildCriteria(filterBy) {

    const criteria = {}
    
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.name = txtCriteria
    }
    if(filterBy.inStock !== 'all'){
        criteria.inStock = filterBy.inStock === 'in-stock' ? 'true' : 'false'
    }
    if(filterBy.boardType !== 'all'){
        criteria.type = filterBy.boardType
    }
    return criteria
}

// function _makeId(length = 5) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for(let i=0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }

