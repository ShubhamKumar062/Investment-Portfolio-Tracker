const express = require("express");
const { registerUser, loginUser, getUserData, isAuth, addAsset, getAssetDetails } = require("../controllers/userControllers");
const authUser = require("../middlewares/authUsers");

const userRouter = express.Router();

userRouter.post("/signup", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/is-auth", isAuth)
userRouter.get("/get-user", authUser, getUserData)
userRouter.post("/addasset", authUser, addAsset)
userRouter.get("/getassets", authUser, getAssetDetails)







module.exports = userRouter;