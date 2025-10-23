import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Học mọi thứ, mọi lúc, mọi nơi</h1>
      <p className='text-gray-500 sm:text-sm'>Học tập dễ dàng - bất cứ khi nào bạn muốn, ở bất cứ đâu bạn ở.
        Nâng cao kỹ năng của bạn với những khóa học được thiết kế cho tương lai.
      </p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Bắt đầu ngay</button>
        <button className='flex items-center gap-2'>Tìm hiểu thêm <img src={assets.arrow_icon} alt="arrow_icon" /></button>
      </div>
    </div>
  )
}

export default CallToAction
