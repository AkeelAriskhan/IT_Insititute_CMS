let courses = [];

const GetAllCoursesURL = 'http://localhost:5209/api/Admin/Get-All-course';
//Fetch Students Data from Database
async function GetAllCourses(){
    fetch(GetAllCoursesURL).then((response) => {
        return response.json();
    }).then((data) => {
        courses = data;
        CourseTable();
    })
};
GetAllCourses()

const AddCourseURL = 'http://localhost:5209/api/Admin/Add-Course';
//Add Courses in Database
async function AddCourse(CourseData){
    // Create new student
    await fetch(AddCourseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CourseData)
    });
    GetAllCourses();
    CourseTable();
};

const UpdateCourseURL = 'http://localhost:5209/api/Admin/update-Course';
async function UpdateCourseFee(CourseId , NewFee){
    // Update Course
    await fetch(`${UpdateCourseURL}?Id=${CourseId}&Totalfee=${NewFee}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
    });
    GetAllCourses();
    CourseTable();
};


const DeleteCourseURL = 'http://localhost:5209/api/Admin/Delete-Course';
// Delete Course From Database
async function DeleteCourse(CourseId){
    // Delete Course
    await fetch(`${DeleteCourseURL}/${CourseId}`, {
        method: "DELETE"
    });
};

//Site Navbar

const toggle = document.querySelector(".fa-bars")
const toggleClose = document.querySelector(".fa-xmark")
const sideNavebar = document.querySelector(".side-navebar")

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0"
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%"
})



//Form Submit Function
document.getElementById("course-offerings-form").addEventListener('submit',(event) =>{
    event.preventDefault();

    const courseName = document.getElementById("course-name").value;
    const level = document.getElementById("proficiency-level").value;
    const totalFee = Number(document.getElementById("course-fee").value);
    let courseID = Number(Math.floor(Math.random()*1000000))

    const course = courses.find(c => c.coursename.toLowerCase() == courseName.toLowerCase() && c.proficiencyLevel == level)
    console.log(course)
    if(course){
        course.courseFee = totalFee
        UpdateCourseFee(course.courseid, course.courseFee)

        document.getElementById('course-offerings-message').innerHTML = "Update Fee Successfully"
        CourseTable();
    }else{
       const coursedata = {
        courseid: courseID,
        coursename: courseName,
        proficiencyLevel: level,
        courseFee: totalFee
       }
       AddCourse(coursedata)
        console.log("course Added")
    }

    // localStorage.setItem('courses',JSON.stringify(courses));
    event.target.reset()
});



//Show Table
function CourseTable(){
    const table = document.getElementById('table-body');
    table.innerHTML = ""
    courses.forEach((course) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.coursename}</td>
            <td>${course.proficiencyLevel}</td>
            <td>${course.courseFee}/= </td>
            <td><button class ="action-btn btn2" onclick="removeCourseById(event,${course.courseid})" >Remove</button></td>
        `;
        table.appendChild(row);
    });
}
CourseTable();   


//Remove Course
function removeCourseById(event,courseIdToRemove) {
    const row = event.target.parentElement.parentElement;
    row.remove();

    
    let indexToRemove = courses.findIndex(obj => obj.courseid === courseIdToRemove);

    if (indexToRemove !== -1) {
        DeleteCourse(courseIdToRemove) 
        document.getElementById('course-offerings-message-2').style.color = "Green";
        document.getElementById('course-offerings-message-2').textContent = "Course Removed Successfully";
    } else {
        document.getElementById('course-offerings-message-2').textContent = "Course not found in local storage";
    }

    setTimeout(()=>{
        document.getElementById('course-offerings-message-2').textContent = "";
        }, 2000);
}


//Logout function

function logout() {
    window.location.href="../1_AdminLogin/AdminLogin.html";
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
  logout();
});