const toggle = document.querySelector(".fa-bars")
const toggleClose = document.querySelector(".fa-xmark")
const sideNavebar = document.querySelector(".side-navebar")

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0"
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%"
})

const courses = JSON.parse(localStorage.getItem('courses')) || [] ;

//Form Submit Function
document.getElementById("course-offerings-form").addEventListener('submit',(event) =>{
    event.preventDefault();

    const courseName = document.getElementById("course-name").value;
    const level = document.getElementById("proficiency-level").value;
    const totalFee = Number(document.getElementById("course-fee").value);
    let courseID = Number(Math.floor(Math.random()*1000000))

    const course = courses.find(c=>c.courseName == courseName && c.level == level)
    if(course){
        course.totalFee = totalFee
        document.getElementById('course-offerings-message').innerHTML = "Update Fee Successfully"
        CourseTable();
    }else{
        courses.push({courseID,courseName,level,totalFee})
        document.getElementById('course-offerings-message').innerHTML = "Added New Course"
        CourseTable();
    }

    localStorage.setItem('courses',JSON.stringify(courses));
    event.target.reset()
});



//Show Table
function CourseTable(){
    const table = document.getElementById('table-body');
    table.innerHTML = ""
    courses.forEach((course) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseName}</td>
            <td>${course.level}</td>
            <td>${course.totalFee}/= </td>
            <td><button class ="action-btn btn2" onclick="removeCourseById(event,${course.courseID})" >Remove</button></td>
        `;
        table.appendChild(row);
    });
}
CourseTable();   


//Remove Course
function removeCourseById(event,courseIdToRemove) {
    const row = event.target.parentElement.parentElement;
    row.remove();

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    let indexToRemove = courses.findIndex(obj => obj.courseID === courseIdToRemove);

    if (indexToRemove !== -1) {
        courses.splice(indexToRemove, 1); 
        localStorage.setItem('courses', JSON.stringify(courses));
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