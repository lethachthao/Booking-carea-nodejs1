import userService from '../services/userService'

let hanldeLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Điền mật khẩu và password'
        })
    }

    let userData = await userService.hanhdlUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let hanldeGetAllUsers = async(req, res) =>{
    let id = req.query.id;//All, id

    if(!id){
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing required parmeters',
            users:[]
        })
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let hanldeCreateNewUser = async (req, res) =>{
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let hanldeDeleteUser = async(req, res) =>{
    if(!req.body.id){
        return res.status(200).json({
            errCode:1,
            errMessage: "id không tồn tại"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let hanldeEditUser = async(req, res) =>{
    let data = req.body;
    let message = await userService.updateUserData(req.body);
    return res.status(200).json(message)
}

let getAllCode = async (req, res)=>{
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all code error', e)
        return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
        })
    }
}

module.exports = {
  hanldeLogin: hanldeLogin,
  hanldeGetAllUsers: hanldeGetAllUsers,
  hanldeCreateNewUser: hanldeCreateNewUser,
  hanldeEditUser: hanldeEditUser,
  hanldeDeleteUser: hanldeDeleteUser,
  getAllCode: getAllCode,
};