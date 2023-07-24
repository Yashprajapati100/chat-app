const { chat, sequelize } = require('../../data/models/index')
const User = require('../services/userservice');
const ResponseController = require('../controllers/ResponseController')
const jwt = require('jsonwebtoken');
const { Op, QueryTypes } = require('sequelize');


class UserController {
    async signup(req, res) {
        try {
            res.render('register')
        }
        catch (error) {
            console.log(error)
        }
    }
    async customsignup(req, res) {
        try {
            const message = await User.signup(req.body, req.file)
            res.render('login', { message: message })
        }
        catch (error) {
            console.log(error)
        }
    }
    async login(req, res) {
        try {
            console.log(req.session)
            res.render('login')
        }
        catch (error) {
            console.log(error)
        }
    }
    async customlogin(req, res) {
        try {
            const userdetails = await User.login(req.body)
            let token = await jwt.sign({ user: userdetails }, 'practice', { expiresIn: '30d' });
            req.session.token = token
            res.redirect('/dashboard')
        }
        catch (error) {
            console.log(error)
            res.render('login', { message: error })
        }
    }
    async logout(req, res) {
        try {
            await req.session.destroy()
            res.redirect('/login')
        }
        catch (error) {

        }
    }
    async dashboard(req, res) {
        try {
            const userdata = await User.dashboard(req.session)
            const token = jwt.verify(req.session.token, 'practice')
            const recentChat = await sequelize.query(`SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at
            FROM chats m
            JOIN (
                SELECT MAX(created_at) AS max_timestamp, 
                    CASE 
                        WHEN sender_id = ${token.user.id} THEN receiver_id
                        ELSE sender_id
                    END AS other_user_id
                FROM chats
                WHERE sender_id = ${token.user.id} OR receiver_id = ${token.user.id}
                GROUP BY other_user_id
            ) sub
            ON (
                (m.sender_id = ${token.user.id} AND m.receiver_id = sub.other_user_id)
                OR (m.sender_id = sub.other_user_id AND m.receiver_id = ${token.user.id})
            )
            AND m.created_at = sub.max_timestamp;`, { type: QueryTypes.SELECT })

            res.render('dashboard', { user: token.user, users: userdata, recentchat: recentChat })
        }
        catch (error) {
            console.log(error)
        }
    }

    async saveChat(req, res) {
        try {
            console.log('Body data', req.file)

            if (!req.body.id) {
               
                    const insertdata = {
                        sender_id: req.body.sender_id,
                        receiver_id: req.body.receiver_id,
                        message: req.body.message,
                        message_type: 0
                    }
                    var chats = await chat.create(insertdata)

            }
            const receivers = chat.findOne({
                where: {
                    id: chats.id
                },
                include: ['receiver']
            })
            res.status(200).send({ success: true, msg: 'Chat inserted!', data: chats, receiverdetails: receivers.receiver })
        }
        catch {

        }
    }

    async deleteChat(req, res) {
        try {
            await chat.destroy({
                where: {
                    id: req.body.id
                }
            })
            res.status(200).send({ success: true })
        }
        catch (error) {
            res.status(200).send({ success: false, msg: error.message })
        }
    }

    async recentChat(req, res) {
        try {
            // const recentChat=await chat.findAll({
            //     as:'c1',
            //     where: {
            //         [Op.and]: {
            //             sender_id: 1,
            //             id:{include: [
            //                 [
            //                     // Note the wrapping parentheses in the call below!
            //                     chat.sequelize.literal(`(
            //                         SELECT MAX(id) FROM chats  WHERE receiver_id in(c1.receiver_id) ORDER BY  created_at ASC
            //                     )`),
            //                 ]
            //             ]}
            //         }

            //     }
            // })
            const recentChat = await sequelize.query(`SELECT * from chats as c1 WHERE sender_id=1  AND id=(SELECT MAX(id) FROM chats  WHERE receiver_id in(c1.receiver_id) ORDER BY  created_at ASC) ORDER by created_at DESC;`, { type: QueryTypes.SELECT })
            console.log(recentChat)
            res.status(200).send({ success: true })
        }
        catch (error) {
            res.status(200).send({ success: false, msg: error.message })
        }
    }

    async updateChat(req, res) {
        try {
            console.log('Body data', req.body)
            let id = req.body.id
            if (req.body.id) {
                var updatedata = {
                    message: req.body.message,
                }
                let chats = await chat.update(updatedata, {
                    where: {
                        id: req.body.id,
                    }
                })
            }
            res.status(200).send({ success: true, msg: 'Chat updated!', data: { updatedata, id } })
        }
        catch {

        }
    }
}
module.exports = new UserController