import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CoursesCard from './CoursesCard';

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext);
  return (
    <div className='py-16 md:px-40 px-9'>
      <h2 className='text-3xl font-medium text-gray-800'>Học hỏi từ những người giỏi nhất</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Khám phá các khóa học hàng đầu của chúng tôi trên nhiều danh mục khác nhau. Từ lập trình và thiết kế đến
        kinh doanh và sức khỏe, các khóa học của chúng tôi được thiết kế để mang lại kết quả.
      </p>

      <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0, 4).map((course, index) => <CoursesCard key={index} course={course} />)}
      </div>

      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}
        className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded' > Xem tất cả khóa học </Link>
    </div>
  )
}

export default CoursesSection
