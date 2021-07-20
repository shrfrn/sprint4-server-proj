const reviewService = require('./review.service.js')
// const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service.js')


async function getReviews(req, res) {

    try {
        const filterBy = {
            toyId: req.query?.toyId || '',
            userId: (req.query?.userId) ? req.session.user._id : '',
        }
        const reviews = await reviewService.query(filterBy)
        res.send(reviews)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}
async function addReview(req, res) {
    
    try {
        const review = req.body
        review.userId = req.session.user._id

        const savedReview = await reviewService.add(review)
        res.send(savedReview)
        // socketService.broadcast({type: 'toy-updated', data: review, to:savedToy._id})
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

module.exports = {
    getReviews,
    addReview,
}
// async function deleteToy(req, res) {
//     // if(!req.session.user) res.status(401).send({ err: 'Please login' })
//     // if(req.session.user.isAdmin === 'false') res.status(403).send({ err: 'not admin' })
//     try {
//         await toyService.remove(req.params.id)
//         res.send({ msg: 'Deleted successfully' })
//     } catch (err) {
//         logger.error('Failed to delete toy', err)
//         res.status(500).send({ err: 'Failed to delete toy' })
//     }
// }

// async function updateToy(req, res) {
//     // if(!req.session.user) res.status(401).send({ err: 'Please login' })
//     // if(req.session.user.isAdmin === 'false') res.status(403).send({ err: 'not admin' })
//     try {
//         const toy = req.body
//         const savedToy = await toyService.update(toy)
//         res.send(savedToy)
//         // socketService.broadcast({type: 'toy-updated', data: review, to:savedToy._id})
//     } catch (err) {
//         logger.error('Failed to update toy', err)
//         res.status(500).send({ err: 'Failed to update toy' })
//     }
// }

// async function addToy(req, res) {
//     try {
//         const toy = req.body
//         const savedToy = await toyService.add(toy)
//         res.send(savedToy)
//         // socketService.broadcast({type: 'toy-updated', data: review, to:savedToy._id})
//     } catch (err) {
//         logger.error('Failed to update toy', err)
//         res.status(500).send({ err: 'Failed to update toy' })
//     }
// }

// async function getToy(req, res) {
//     try {
//         const toy = await toyService.getById(req.params.id)
//         res.send(toy)
//     } catch (err) {
//         logger.error('Failed to get toy', err)
//         res.status(500).send({ err: 'Failed to get toy' })
//     }
// }
