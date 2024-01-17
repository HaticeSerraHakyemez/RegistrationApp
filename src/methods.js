const express = require('express')
const router = express.Router()
const Students = require('./studentRecords')
const Courses = require('./courseRecords')
const CourseLists = require('./courseListRecords')

router.get('/students/', async (req, res) => {
    const student = await Students.find()
    if(Students.length===0){
      res.json("No students in database.")
      return
    }
    res.json(student)
})

router.get('/courses/', async (req, res) => {
    const course = await Courses.find()
    if(course.length===0){
      res.json("No courses in database.")
      return
    }
    res.json(course)
})

router.get('/students/:id', async (req, res) => {
  try{
    res.json(await Students.findById(req.params.id))
  }
   catch(error){
    res.json("Invalid id.")
   }
})

router.get('/courses/:id', async (req, res) => {
  try{
    res.json(await Courses.findById(req.params.id))
  }
  catch(error){
    res.json("Invalid id.")
   }
})

router.post('/students/', async (req, res) => {
  try{
    const student = new Students({
      name: req.body.name,
      title: req.body.title
    })
     await student.save()
     res.json("Student created.")
  }
  catch(error){
    res.json("Check your inputs.")
  }
})

router.post('/courses/', async (req, res) => {
  try{
    const course = new Courses({
      name: req.body.name,
      credits: req.body.credits,
      code: req.body.code
    })
     await course.save()
     res.json("Course created.")
  }
  catch(error){
    res.json("Check your inputs.")
  }
})

router.delete('/students/:id', async (req, res) => {
  try{
    await Students.findById(req.params.id).remove()
    await CourseLists.find({student:req.params.id}).remove()
    res.json("Student deleted.")
  }
    catch(error){
      res.json("Check your inputs.")
    }
})

router.delete('/courses/:id', async (req, res) => {
  try{
    await Courses.findById(req.params.id).remove()
    await CourseLists.find({course:req.params.id}).remove()
    res.json("Course deleted.")
  }
  catch(error){
    res.json("Check your inputs.")
  }
})

router.patch('/students/:id', async (req, res) => {
  try{
    let student=await Students.findById(req.params.id)
    res.student=student
    if (req.body.name != null) {
      res.student.name=req.body.name
    }
    if (req.body.title != null) {
      res.student.title.name=req.body.title
    }
    await res.student.save()
    res.json("Student updated.")
  }
    catch(error){
      res.json("Check your inputs.")
    }
  })

router.patch('/courses/:id', async (req, res) => {
  try{
    let course=await Courses.findById(req.params.id)
    res.course=course
    if (req.body.name != null) {
        res.course.name=req.body.name
    }
    if (req.body.credits != null) {
        res.course.credits.name=req.body.credits
    }
    if (req.body.code != null) {
        res.course.code.name=req.body.code
    }
    await res.course.save()
    res.json("Course updated.")
  }
    catch(error){
      res.json("Check your inputs.")
    }
})

router.get('/courseLists/:id/:type', async (req, res) => {
  try{
    const studentCourses=[]
    if(req.params.type==="current"){
      const courses = await CourseLists.find({ $and : [{student:req.params.id} , {grade : { $exists : false } } ] } )
        for(let i = 0;i < courses.length;i++){
            studentCourses[i]=await Courses.findById(courses[i].course)
        }
    }
    else if(req.params.type==="completed"){
      const courses = await CourseLists.find({ $and : [{student:req.params.id} , {grade : { $exists : true } } ] })
      for(let i = 0;i < courses.length;i++){
        let temp= {"grade":courses[i].grade, "course":(await Courses.findById(courses[i].course))}
        studentCourses[i]= temp
      }
    }
    res.json(studentCourses)
  }
  catch(error){
    res.json("Check your inputs.")
  }
})

router.get('/courseLists/:id/current/studentCount', async (req, res) => {
  try{
    const courses = await CourseLists.find({ $and : [{course:req.params.id} , {grade : { $exists : false } } ] } )
    res.json("There are "+courses.length+" number of students currently taking "+(await Courses.findById(req.params.id)).code+".")
  }
  catch(error){
    res.json("Check your inputs.")
  }
})

router.get('/courseLists/:id/course/gradeAverage', async (req, res) => {
  try{
    const courses = await CourseLists.find({ $and : [{course:req.params.id} , {grade : { $exists : true } } ] } )
    let total=0
    for(let i = 0;i < courses.length;i++){
      total+=courses[i].grade
    }
    if(courses.length===0){
      res.json("No one has taken the course before.")
      return
    }
    res.json("Grade average of "+(await Courses.findById(req.params.id)).code+" is "+total/courses.length+".")
  }

  catch(error){
    res.json("Check your inputs.")
  }
})

router.get('/courseLists/:id/student/totalCredits', async (req, res) => {
  try{
    const courses = await CourseLists.find({ $and : [{student:req.params.id} , {grade : { $exists : false } } ] } )
    let total=0
    for(let i = 0;i < courses.length;i++){
      total+=(await Courses.findById(courses[i].course)).credits
    }
    res.json((await Students.findById(req.params.id)).name+" is taking "+total+" credits this semester.")
    
  }
 
  catch(error){
    res.json("Check your inputs.")
  }
})

router.get('/courseLists/:id/student/gradeAverage', async (req, res) => {
  try{
    const courses = await CourseLists.find({ $and : [{student:req.params.id} , {grade : { $exists : true } } ] } )
    let sum=0
    let totalCredit=0
    for(let i = 0;i < courses.length;i++){
      let cred=(await Courses.findById(courses[i].course)).credits
      sum+=(courses[i].grade)*cred
      totalCredit+=cred
    }
    if(totalCredit===0){
      res.json("Student hasn't completed any courses yet.")
      return
    }
      res.json("Grade average of "+(await Students.findById(req.params.id)).name+" is "+Number(sum/totalCredit).toFixed(2)+".")
  }

    catch(error){
      res.json("Check your inputs.")
    }
})

router.post('/courseLists/', async (req, res) => {
  try{
    const courses = await CourseLists.find({ $and : [{student:req.params.id} , {grade : { $exists : false } } ] } )
    let total=0
    for(let i = 0;i < courses.length;i++){
      total+=(await Courses.findById(courses[i].course)).credits
    }
    if(total+(await Courses.findById(req.body.course)).credits>25){
      res.json("Credit limit is 25!!")
      return
    }
    const studentCourse = new CourseLists({
      student: req.body.student,
      course: req.body.course
    })
     await studentCourse.save()
     res.json("Student is taking the course.")
  }
   catch(error){
    res.json("Check your inputs.")
  }
})

router.patch('/courseLists/:id', async (req, res) => {
    try{
    await CourseLists.update({_id:req.params.id},{$set:{"grade":req.body.grade}},{upsert:false,multi:true})
    res.json("Student completed the course.")
  }
  catch(error){
    res.json("Check the grade.")
  }
})

module.exports = router