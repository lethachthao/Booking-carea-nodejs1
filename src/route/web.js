import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";


let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    router.get('/thao', homeController.getThaoPage)

    router.get('/crud', homeController.getCRUD)

    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD);

    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.hanldeLogin);
    router.get('/api/get-all-users', userController.hanldeGetAllUsers);
    router.post('/api/create-new-user', userController.hanldeCreateNewUser)
    router.put('/api/edit-user', userController.hanldeEditUser)
    router.delete('/api/delete-user', userController.hanldeDeleteUser)

    router.get('/api/allcode', userController.getAllCode);

    return app.use("/", router)

}

module.exports = initWebRoutes;