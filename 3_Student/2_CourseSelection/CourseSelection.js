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

function DuplicateCourseRemove(){
    // Remove Duplicates courses from Database
    for (let i = 0; i < courses.length; i++) {

        for (let k = 0; k < 1; k++) {
            let course = courses[i].coursename;

            if (!uniqueCourses.includes(course)) {
                uniqueCourses.push(course);
            }
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

// Auto fill NIC in input field
if (nicNumber) {
    document.getElementById("nic").value = nicNumber
}

function StudentNameShow() {
    const student = students.find(s => s.nic == nicNumber);
    if (student) {
        document.getElementById('message').style.color = "green";
        document.getElementById('message').textContent = `${student.fullName}`;
    }
}

//disabled nic input 
document.getElementById("nic").disabled = true

//submit form
document.getElementById("course-form").addEventListener('submit', (event) => {
    event.preventDefault()

    //Get form values
    const nicNumber = document.getElementById("nic").value;
    const course = document.getElementById("select-course").value;
    const ProficiencyLevels = document.getElementById("proficiency-levels").value;
    const duration = document.getElementById("select-duration").value;

    //Find the Student 
    const student = students.find(s => s.nic == nicNumber);
    console.log(student)


    if (student) {
        if (course != "" && ProficiencyLevels != "" && duration != "") {
            const data={
                course:course,
                proficiencyLevels:ProficiencyLevels,
                duration:duration
            }
            StudentCourseEnrollAdd(nicNumber,data)
            document.getElementById('message').style.color = "green"
            document.getElementById('message').textContent = "Course Successfuly selected"

            sessionStorage.setItem('nic', JSON.stringify(nicNumber))
            
            setTimeout(()=>{
                window.location.href = "../3_Dashboard/StudentDashboard.html"
            }, 500);
        } else {
            document.getElementById('message').style.color = "red";
            document.getElementById('message').textContent = `Please Choose the field`;
        }
    }
})

