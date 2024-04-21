const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');
const postControllers = require("../controllers/postControllers");
const bulletinControllers = require("../controllers/bulletinControllers");
const {Authenticate} = require('../middlewares/authenticator');
const {validateSetUserData} = require("../middlewares/handlerInputData/handlerUserData");
const {validateUpdateAuthData} = require("../middlewares/handlerInputData/handlerAuthData");
const {validateSetPostData} = require("../middlewares/handlerInputData/handlerPostData");

const express = require('express');
const processFormData = require("../middlewares/formData");
const userRouter = express.Router();
const {
    isActive,
    checkPostExists,
    checkQueryParameters,
    checkBulletinExists,
    checkEntityExists,
    checkAccountExists
} = require('../middlewares/generalMiddlewares');

userRouter.post("/", express.urlencoded({extended: true}), validateSetUserData, checkAccountExists, userControllers.setUser);

userRouter.use([
    Authenticate,
    checkEntityExists,
    isActive
]);

userRouter.get("/", userControllers.getUser);
userRouter.delete("/", userControllers.deleteUser);
userRouter.put("/", express.urlencoded({extended: true}), userControllers.updateUser);

userRouter.get("/auth", authControllers.getAuth);
userRouter.put("/auth", express.urlencoded({extended: true}), validateUpdateAuthData, authControllers.updateAuth);

userRouter.delete('/networks', userControllers.deleteSocialMedia);

userRouter.post("/rescuer", userControllers.makeRescuer);

userRouter.post("/posts", processFormData, validateSetPostData, postControllers.setPost);
userRouter.get("/posts/:pet_id", checkPostExists, postControllers.getPost);
userRouter.put("/posts/:pet_id", checkPostExists, processFormData, postControllers.updatePost);
userRouter.delete("/posts/:pet_id", checkPostExists, postControllers.deletePost);

userRouter.get("/posts", postControllers.getPosts);
userRouter.get("/posts/filter/gender", checkQueryParameters, postControllers.getFilterPostGender);
userRouter.get("/posts/filter/breed", checkQueryParameters, postControllers.getFilterPostBreed);
userRouter.get("/posts/filter/size", checkQueryParameters, postControllers.getFilterPostSize);
userRouter.get("/posts/filter/owner", checkQueryParameters, postControllers.getFilterPostOwner);
userRouter.get("/posts/filter/found", checkQueryParameters, postControllers.getFilterPostFound);
userRouter.get("/posts/filter/specie", checkQueryParameters, postControllers.getFilterPostSpecie);
userRouter.get("/posts/filter/date", postControllers.getFilterPostLostDate);
userRouter.get("/posts/filter/year", postControllers.getFilterPostYear);

userRouter.post("/posts/gallery/:pet_id", checkPostExists, processFormData, postControllers.addGallery);
userRouter.delete("/posts/gallery/:pet_id", checkPostExists, postControllers.delPartialGallery);
userRouter.post("/posts/comment/:pet_id", checkPostExists, express.text(), postControllers.insertComment);

userRouter.post("/bulletins", processFormData, bulletinControllers.setBulletin);
userRouter.get("/bulletins", bulletinControllers.getBulletins);
userRouter.get("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.getBulletin);
userRouter.delete("/bulletins/:bulletin_id", checkBulletinExists, bulletinControllers.deleteBulletin);

userRouter.put("/bulletins/:bulletin_id", checkBulletinExists, processFormData, bulletinControllers.updateBulletin);
userRouter.delete("/bulletins/gallery/:bulletin_id", checkBulletinExists, bulletinControllers.delPartialGallery);

module.exports = {userRouter};
