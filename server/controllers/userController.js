import User from "../models/User.js"
import { Purchase } from "../models/Puschase.js";
import Course from "../models/Course.js";
import Stripe from "stripe";


export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth()
    const user = await User.findById(userId)

    if (!user) {
      return res.json({ success: false, message: 'User Not Found' })
    }

    res.json({ success: true, user })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

//User Enrolled Courses with Lecture Links
export const userEnrolleredCourses = async (req, res) => {
  try {
    const { userId } = req.auth()
    const userData = await User.findById(userId).populate('enrolledCourses')
    res.json({ success: true, enrollCourses: userData.enrolledCourses })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

//Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const { origin } = req.headers
    const { userId } = req.auth()
    const userData = await User.findById(userId)
    const courseData = await Course.findById(courseId)

    if (!userData || !courseData) {
      return res.json({ success: false, message: 'Data Not Found' })
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),

    }

    const newPurchase = await Purchase.create(purchaseData)

    //Stripe Gateway initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

    const currency = process.env.CURRENCY.toLowerCase()

    // Createing line items to for Stripe
    const line_items = [{
      price_data: {
        currency,
        product_data: {
          name: courseData.courseTitle
        },
        unit_amount: Math.floor(newPurchase.amount) * 100
      },
      quantity: 1
    }]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString()
      }
    })

    res.json({ success: true, session_url: session.url })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}