const boardService = require('./board.service');
const socketService = require('../../services/socket.service');
const logger = require('../../services/logger.service');

async function getBoard(req, res) {
    try {
        const board = await boardService.getById(req.params.id);
        setTimeout(() => {
            res.send(board);
        }, 700);
    } catch (err) {
        logger.error('Failed to get board', err);
        res.status(500).send({ err: 'Failed to get board' });
    }
}

async function getBoards(req, res) {
    console.log('in get boards');
    try {
        const filterBy = req.query.filterBy ? JSON.parse(req.query?.filterBy) : {};
        const boards = await boardService.query(filterBy);
        res.send(boards);
    } catch (err) {
        logger.error('Failed to get boards', err);
        res.status(500).send({ err: 'Failed to get boards' });
    }
}

async function deleteBoard(req, res) {
    // if(!req.session.user) res.status(401).send({ err: 'Please login' })
    // if(req.session.user.isAdmin === 'false') res.status(403).send({ err: 'not admin' })
    try {
        await boardService.remove(req.params.id);
        res.send({ msg: 'Deleted successfully' });
    } catch (err) {
        logger.error('Failed to delete board', err);
        res.status(500).send({ err: 'Failed to delete board' });
    }
}

async function updateBoard(req, res) {
    // if(!req.session.user) res.status(401).send({ err: 'Please login' })
    // if(req.session.user.isAdmin === 'false') res.status(403).send({ err: 'not admin' })
    try {
        const board = req.body;
        console.log('--req.body--\n', req.body);
        const savedBoard = await boardService.update(board);
        res.send(savedBoard);
        // socketService.broadcast({type: 'toy-updated', data: review, to:savedToy._id})
    } catch (err) {
        logger.error('Failed to update board', err);
        res.status(500).send({ err: 'Failed to update board' });
    }
}

async function addBoard(req, res) {
    try {
        const board = req.body;
        console.log('--req.body--\n', req.body);
        board.createdBy = req.session.user;
        const savedBoard = await boardService.add(board);
        res.send(savedBoard);
        // socketService.broadcast({type: 'toy-updated', data: review, to:savedToy._id})
    } catch (err) {
        logger.error('Failed to update board', err);
        res.status(500).send({ err: 'Failed to update board' });
    }
}

module.exports = {
    getBoard,
    getBoards,
    deleteBoard,
    addBoard,
    updateBoard,
};
