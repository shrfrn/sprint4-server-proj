
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    add,
}

async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy)
    console.log("🚀 ~ file: review.service.js ~ line 14 ~ query ~ criteria", criteria)

    try {
        const collection = await dbService.getCollection('reviews')
        var reviews = await collection.aggregate([
        {
            $match: criteria
        },
        {
            $lookup:
            {
                localField: 'toyId',
                from: 'toys',
                foreignField: '_id',
                as: 'toy'
            }
        },
        {
            $unwind: '$toy'
        },
        {
            $lookup:
            {
                localField: 'userId',
                from: 'users',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        }
        ]).toArray()
        reviews = reviews.map(review => {

            review.toy = { _id: review.toy._id, name: review.toy.name }
            review.user = { _id: review.user._id, fullname: review.user.fullname }

            delete review.toyId
            delete review.userId

            return review
        })
        return reviews
        
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }
}


async function add(review) {
    try {
        const collection = await dbService.getCollection('reviews')

        review.userId = ObjectId(review.userId)
        review.toyId = ObjectId(review.toyId)
        review.createdAt = Date.now()

        await collection.insertOne(review)
        console.log('review inserted', review);
        return review
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

// Private functions 

function _buildCriteria(filterBy) {

    const criteria = {}
    
    if (filterBy.toyId) {
        criteria.toyId = ObjectId(filterBy.toyId)
    }
    if (filterBy.userId) {
        criteria.userId = ObjectId(filterBy.userId)
    }
    return criteria
}

// async function remove(toyId) {
    
//     try {
//         const collection = await dbService.getCollection('toys')
//         await collection.deleteOne({ '_id': ObjectId(toyId) })
//     } catch (err) {
//         logger.error(`cannot remove toy ${toyId}`, err)
//         throw err
//     }
// }

// async function update(toy) {
//     try {
//         // peek only updatable fields!
//         const toyToSave = {
//             _id: ObjectId(toy._id),
//             name: toy.name,
//             price: toy.price,
//             type: toy.type,
//             inStock: toy.inStock,
//             // fullname: toy.fullname,
//             // score: toy.score
//         }
//         console.log('toyToSave', toyToSave);
//         const collection = await dbService.getCollection('toys')
//         await collection.updateOne({ '_id': toyToSave._id }, { $set: toyToSave })
//         return toyToSave;
//     } catch (err) {
//         logger.error(`cannot update toy ${toy._id}`, err)
//         throw err
//     }
// }

// async function add(toy) {
//     try {
//         // pick only updatable fields!
//         const toyToAdd = {
//             name: toy.name,
//             price: toy.price,
//             type: toy.type,
//             inStock: toy.inStock,
//             createdAt: Date.now(),
//         }
//         const collection = await dbService.getCollection('toys')
//         const {insertedId} = await collection.insertOne(toyToAdd)
//         console.log('insertedId', insertedId);
//         toyToAdd._id = insertedId
//         return toyToAdd
//     } catch (err) {
//         logger.error('cannot insert toy', err)
//         throw err
//     }
// }

