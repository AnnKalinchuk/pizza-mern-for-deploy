const jwt = require('jsonwebtoken');///удалить?
const bcrypt = require('bcryptjs')
const config = require('config') ///удалить?
const {validationResult} = require('express-validator')
const User = require('../models/User')
const Role = require('../models/Role');
const generateAccessToken = require('../utils/generateAccessToken');


const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        console.log(e)
    }
}

const login = async (req, res) => {
    
    try {
        /* const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Uncorrect data',
                errors
            })
        } */
        console.log('login')
        const {email, password} = req.body
        const user = await User.findOne({email})
        console.log('user', user)

        if (!user) {
            return res.status(404).json({message: "User is not found"})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({message: "Invalid login or password"})
        }

        const token = generateAccessToken(user._id, user.roles)

        //const token = jwt.sign({_id: user._id}, config.get("jwtSecret"), {expiresIn: "30d"})

        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
                name: user.name
            }
        })
    } catch (e) {
        res.status(500).json({
            message: `Failed to login, e - ${e}`
        })
    }
}

const register = async (req, res) => {
    try {
        /* const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Uncorrect request', 
                errors
            })
        } */

        const {email, password, name} = req.body
        const candidate = await User.findOne({email})

        if(candidate) {
            return res.status(400).json({
                message: `User with email ${email} already exist`
            })
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const userRole = await Role.findOne({value: "USER"})
        //const user = new User({email, password: hashPassword, name, roles:[userRole.value]})
        const user = new User({email, password: hashPassword, name, roles:[userRole.value, "ADMIN"]})

        await user.save()

        const token = generateAccessToken(user._id, user.roles) //проверка

        return res.status(201).json({
            message: 'User was created', 
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
                name: user.name
            },
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Failed to register'
        })
    }
}

module.exports = {
    login,
    register,
    getUsers
}