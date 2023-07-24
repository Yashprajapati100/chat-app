const {user,chat} = require('../../data/models/index')
const promise = require('bluebird')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

class User {
    async signup(body,file) {
        try {
            const checkemail = await user.findAll({ 
                where:{email: body.email}
            })
            if (checkemail.length != 0) {
                throw 'USER_WITH_EMAIL_ALREADY_EXISTS'
            }
            else {

                const insertdata = {
                    name: body.name,
                    email: body.email,
                    image:file.filename,
                    password: body.password
                }
                const userdata = await user.create(insertdata)
                return 'registed successfully'

            }
        }
        catch (error) {
            return promise.reject(error)
        }
    }

    async login(body) {
        try {
            const userdata = await user.findOne({ 
                where:{email: body.email }})
            if (userdata != null) {
                const compare = await bcrypt.compare(body.password, userdata.password)
                if (compare) {
                    
                    return userdata
                }
                else {
                    throw "INVALID_PASSWORD"
                }
            }
            else {
                throw "INVALID_EMAIL"
            }
        }
        catch (error) {
            return promise.reject(error)
        }
    }

    async dashboard(session) {
        try {
            const token=jwt.verify(session.token, 'practice')
            const userdata = await user.findAll({
                where:{
                    id:{[Op.not]:token.user.id}
                }
            })
            return userdata
        }
        catch (error) {
            return promise.reject(error)
        }
    }

    // async savechat(body) {
    //     try {
    //         const insertdata = {
    //             name: body.name,
    //             email: body.email,
    //             image:file.filename,
    //             password: body.password
    //         }
    //         const userdata = await chat.create(insertdata)
    //         return 'registed successfully'
            
    //     }
    //     catch (error) {
    //         return promise.reject(error)
    //     }
    // }

    // async editprofile(headers, body, file) {
    //     try {
    //         let token = headers.authorization;
    //         const userdetails = await jwt.verify(token, 'practice')
    //         const checkphone = await user.find({ $and: [{ phone: body.phone }, { _id: { $ne: userdetails.user._id } }] })
    //         // const checkphone = await user.find({ phone: body.phone })

    //         console.log(checkphone)
    //         if (checkphone.length != 0) {
    //             throw "PHONE_EXISTS"
    //         }
    //         else {

    //             const updateuser = {
    //                 name: body.name,
    //                 phone: body.phone,
    //                 profile_image: file.filename
    //             }
    //             console.log(updateuser)
    //             const update = await user.updateOne({ _id: userdetails.user._id }, updateuser);
    //             return update
    //         }
    //     }
    //     catch (error) {
    //         return promise.reject(error)
    //     }
    // }

    // async changepassword(headers,body){
    //     try{
    //         let token = headers.authorization;
    //         const userdetails = await jwt.verify(token, 'practice')
    //         const compare=await bcrypt.compare(body.oldpassword,userdetails.user.password)
    //         if(compare){
    //             const passwordupdate=user.update({password:body.newpassword},{
    //                 where:{
    //                     id:userdetails.user.id
    //                 }
    //             })
    //             return passwordupdate
    //         }
    //         else{
    //             throw "INVALID_PASSWORD"
    //         }
    //     }
    //     catch(error){
    //         return promise.reject(error)
    //     }
    // }
}
module.exports = new User