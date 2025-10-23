import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Form } from 'react-router-dom'

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetais, setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    }
  )

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name: ')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      )
    }
  }

  const addlecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetais,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    )
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!image) {
        toast.error('1Thumbnail Not Selected')
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    e.preventDefault()
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])


  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Tiêu đề khóa học</p>
          <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Mô tả khóa học</p>
          <div ref={editorRef}></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Giá khóa học</p>
            <input onChange={e => setCoursePrice(e.target.value)} value={coursePrice} type='number' placeholder='0'
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Hình khóa học</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input type="file" name="" id="thumbnailImage" onChange={e => { setImage(e.target.files[0]) }} accept='image/*' hidden />
              <img src={image ? URL.createObjectURL(image) : ''} alt="" className='max-h-10' />
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Giảm giá %</p>
          <input onChange={e => setDiscount(e.target.value)} value={discount} type="number" name="" id=""
            placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
              <div className='flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon} width={14} alt="" className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`} />
                  <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Bài học</span>
                <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => handleChapter('remove', chapter.chapterId)} />
              </div>
              {!chapter.collapsed && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                      <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration}
                        mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? "Free Preview" : "Paid"}</span>
                      <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => handleLecture('remove', chapter.chapterId)} />
                    </div>
                  ))}
                  <div className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2' onClick={() => handleLecture('add', chapter.chapterId)}>+ Thêm bài học</div>
                </div>
              )}
            </div>
          ))}
          <div className='flex justify-center items-center bg-blue-100 p-2 rounded-lg 
          cursor-pointer' onClick={() => handleChapter('add')}> + Thêm chương </div>

          {showPopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
              <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
                <h2 className='text-lg font-semibold mb-4'>Thêm bài học</h2>

                <div className='mb-2'>
                  <p>
                    Tiêu đề bài học
                  </p>
                  <input type="text" name="" id=""
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetais.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetais, lectureTitle: e.target.value })}
                  />
                </div>

                <div className='mb-2'>
                  <p>
                    Thời gian (phút)
                  </p>
                  <input type="number" name="" id=""
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetais.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetais, lectureDuration: e.target.value })}
                  />
                </div>

                <div className='mb-2'>
                  <p>
                    URL bài học
                  </p>
                  <input type="text" name="" id=""
                    className='mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetais.lectureUrl}
                    onChange={(e) => setLectureDetails({ ...lectureDetais, lectureUrl: e.target.value })}
                  />
                </div>

                <div className='mb-2 flex gap-2 my-4'>
                  <p>
                    Miễn phí xem trước
                  </p>
                  <input type="checkbox" name="" id=""
                    className='mt-1 scale-125 '
                    value={lectureDetais.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetais, isPreviewFree: e.target.value })}
                  />
                </div>

                <button type='button' onClick={addlecture}
                  className='w-full bg-blue-400 text-white px-4 py-2 rounded'>Thêm</button>
                <img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt=""
                  className='absolute top-4 right-4 w-4 cursor-pointer' />

              </div>
            </div>
          )}
        </div>
        <button type='submit' className='bg-black text-white w-max py-2.5 px-8 rounded my-4'>Thêm mới</button>
      </form>
    </div>
  )
}

export default AddCourse
