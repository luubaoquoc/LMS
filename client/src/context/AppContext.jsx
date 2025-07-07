import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate()

  const [allCourses, setAllCourese] = useState([])
  const [isEducator, setIsEducator] = useState([true])
  const [enrolledCourses, setEnrolledCourses] = useState([])

  //fetch All Courses
  const fetchAllCoureses = async () => {
    setAllCourese(dummyCourses)
  }

  //function to calculate average rating of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating
    })
    return totalRating / course.courseRatings.length
  }

  //function to calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  //function to calculate Course duration
  const CalculateCourseDuration = (course) => {
    let time = 0

    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })

  }

  //function calculate to No of lectures in Course 
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    });
    return totalLectures
  }

  //fetch user enrolled Course
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses)
  }


  useEffect(() => {
    fetchAllCoureses()
    fetchUserEnrolledCourses()
  }, [])

  const value = {
    currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime,
    CalculateCourseDuration, calculateNoOfLectures, enrolledCourses
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}