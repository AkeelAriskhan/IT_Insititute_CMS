const nicNumber = JSON.parse(sessionStorage.getItem('nic'));

let students = [];
const GetAllStudentsURL = 'http://localhost:5209/api/Admin/get-All-Students';
//Fetch Students Data from Database
async function GetAllStudents() {
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;
        StudentNameShow();
    })
};
GetAllStudents()

let courses = [];
const GetAllCoursesURL = 'http://localhost:5209/api/Admin/Get-All-course';
//Fetch Students Data from Database
async function GetAllCourses() {
    fetch(GetAllCoursesURL).then((response) => {
        return response.json();
    }).then((data) => {
        courses = data;
        DuplicateCourseRemove();

    })
};
GetAllCourses();

const StudentCourseEnrollADDURL = 'http://localhost:5209/api/student/course-selection?nic=';
async function StudentCourseEnrollAdd(Nic,data){
    await fetch(`${StudentCourseEnrollADDURL}${Nic}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

let uniqueCourses = [];

for (let i = 0; i < courses.length; i++) {

    for (let k = 0; k < 1; k++) {
        let course = courses[i].courseName;
        
        if (!uniqueCourses.includes(course)) {
            uniqueCourses.push(course);
        }
    }
    CourseDropDown();

}
function CourseDropDown() {
    uniqueCourses.forEach(C => {
        const courseDropDown = document.createElement("option")
        courseDropDown.value = C
        courseDropDown.textContent = C
        document.getElementById("select-course").appendChild(courseDropDown)
    })
}


document.addEventListener("DOMContentLoaded",()=>{
    uniqueCourses.forEach(C => {
        const courseDropDown = document.createElement("option")
        courseDropDown.value = C
        courseDropDown.textContent = C
        document.getElementById("select-course").appendChild(courseDropDown)
    })

    // Auto fill NIC in input field
    if(nicNumber){
        document.getElementById("nic").value = nicNumber
    }

    const student = students.find(s => s.nicNumber == nicNumber);        
    if(student){
        document.getElementById('message').style.color = "green";
        document.getElementById('message').textContent = `${student.fullName}`;
    }
    //disabled nic input 
    document.getElementById("nic").disabled = true
});


//submit form
document.getElementById("course-form").addEventListener('submit',(event)=>{
    event.preventDefault()

    //Get form values
    const nicNumber = document.getElementById("nic").value; 
    const course = document.getElementById("select-course").value; 
    const ProficiencyLevels = document.getElementById("proficiency-levels").value; 
    const duration = document.getElementById("select-duration").value; 

    //Find the Student 
    const student = students.find(s => s.nicNumber == nicNumber);


    if(student){
        if(course != "" && ProficiencyLevels != "" && duration != ""){
            student.course = course;
            student.ProficiencyLevels = ProficiencyLevels;
            student.duration = duration;
            localStorage.setItem('students',JSON.stringify(students))
            document.getElementById('message').style.color = "green"
            document.getElementById('message').textContent = "Course Successfuly selected"

            window.location.href = "../3_Dashboard/StudentDashboard.html"
            sessionStorage.setItem('nic' , JSON.stringify(nicNumber))
        }else{
            document.getElementById('message').style.color = "red";
            document.getElementById('message').textContent = `Please Choose the field`;
        }
    }
})

