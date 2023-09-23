import db from "../models/index";
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e)
        }

    })
}

let hanhdlUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExit = await checkUserEmail(email);
            if (isExit) {

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);  
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";

                        delete user.password;
                        userData.user = user
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }

                // resolve();
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email của bạn không tồn tại trong hệ thống. Vui lòng thử email khác`;
            }
            resolve(userData);

        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};


let getAllUsers = (userId) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let users = '';
            if(userId == 'ALL'){
                users = db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }

                })
            }if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) =>{
    return new Promise( async(resolve, reject) =>{
        try {
            //Check email toonf tai
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                  errCode: 1,
                  errMessage: "email đã có trong hệ thống",
                });
            }else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                  email: data.email,
                  password: hashPasswordFromBcrypt,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  address: data.address,
                  phonenumber: data.phonenumber,
                  gender: data.gender === "1" ? true : false,
                  roleId: data.roleId,
                });
                resolve({
                  errCode: "0",
                  message: "ok",
                });
            }
            
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) =>{
    return new Promise( async(resolve, reject) =>{
        let user = await db.User.findOne({
            where: {id: userId}
        })
        if(!user){
            resolve({
                errCode: 2,
                errMessage: `Người dùng không tồn tại`
            })
        }

        
        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            message: 'Đã xóa người dùng thành công'
        })
    })

}


let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                await user.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                });

                resolve({
                    errCode: 0,
                    message: 'Update người dùng thành công'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy người dùng'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
        if(!typeInput){
            resolve({
                errCode: 1,
                errMessage: 'missing required parameters!'
            })
        }else{
             let res = {};
             let allcode = await db.Allcode.findAll({
               where: { type: typeInput },
             });
             res.errCode = 0;
             res.data = allcode;
              resolve(res);

        }
     
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  hanhdlUserLogin: hanhdlUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
};
