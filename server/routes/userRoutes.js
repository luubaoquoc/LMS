import express from 'express'
import { getUserData, purchaseCourse, userEnrolleredCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolleredCourses)
userRouter.post('/purchase', purchaseCourse)

export default userRouter