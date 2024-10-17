const students  = JSON.parse(localStorage.getItem('students')) 

function encryption(password){
    return btoa(password)
}

document.getElementById('login-form').addEventListener('submit' , (event)=>{
    event.preventDefault();

    const nicNumber = document.getElementById("nic-input").value;
    const password = encryption(document.getElementById("password-input").value);

    const student = students.find(s => s.nicNumber == nicNumber && s.password == password)
    if(student){
        if(student.course == null){
            window.location.href = "../2_CourseSelection/CourseSelection.html"
            sessionStorage.setItem('nic' , JSON.stringify(nicNumber))
         }else{
             window.location.href = "../3_Dashboard/StudentDashboard.html"
            sessionStorage.setItem('nic' , JSON.stringify(nicNumber))
         }
    }else{
        document.getElementById('login-message').textContent = "Invalid Nic Number or Password"
    }


    event.target.reset();
})