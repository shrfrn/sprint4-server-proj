const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
    createInitData,
}

function createInitData(){
    const initUser = {
        fullname: 'Paul Anderson',
        username: 'paul',
        password: 'paul',
    }
    try {
        initUser = userService.add(initUser)
    } catch (err) {
        logger.error('cannot create init Data', err)
        throw err
    }
    delete initUser.password
}
const gBoards = [
    {
        title: 'My first board',
        description: 'This is very awesome!',
        isFavorite: false,
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        columns: ['status', 'date', 'delegates', 'tags'],
        groups: [
            {
                id: 'g101',
                title: 'Views',
                tasks: [
                    {
                        id: 't101',
                        title: 'Board list',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u103',
                                    fullname: 'Sharon Macaron',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                                {
                                    _id: 'u104',
                                    fullname: 'Eden Maran',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                            tags: ['UI', 'DB'],
                        },
                    },
                    {
                        id: 't102',
                        title: 'Board details',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u103',
                                    fullname: 'Sharon Macaron',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: ['front-end'],
                        },
                    },
                    {
                        id: 't103',
                        title: 'Chat / Activities',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u103',
                                    fullname: 'Sharon Macaron',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                                {
                                    _id: 'u104',
                                    fullname: 'Eden Maran',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Stuck', color: '#e8697d' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                ],
                style: {
                    color: '#232323',
                },
            },
            {
                id: 'g201',
                title: 'Components',
                tasks: [
                    {
                        id: 't201',
                        title: 'Board preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u104',
                                    fullname: 'Eden Maran',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                    {
                        id: 't202',
                        title: 'group list',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: ['UI'],
                        },
                    },
                    {
                        id: 't203',
                        title: 'group preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                    {
                        id: 't204',
                        title: 'task preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Stuck', color: '#e8697d' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                ],
                style: {
                    color: '#232323',
                },
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Avior Hagibor',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u102',
                fullname: 'Rachel Bekarov',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: 'u103',
                fullname: 'Sharon Macaron',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u104',
                fullname: 'Eden Maran',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u105',
                fullname: 'Muki Bartiki',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: 'u106',
                fullname: 'Shimi halimi',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
        ],
        statuses: [
            { id: 's001', txt: 'Done', color: '#33d391' },
            { id: 's002', txt: 'In progress', color: '#fdbc64' },
            { id: 's003', txt: 'Stuck', color: '#e8697d' },
            { id: 's000', txt: '', color: '#c4c4c4' }, // unspecified - default
        ],
        tags: ['front-end', 'back-end', 'UI', 'DB'],
        styles: {},
        activities: [],
    },
]