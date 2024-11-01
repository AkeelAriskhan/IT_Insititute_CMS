
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "none" || sidebar.style.display === "") {
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
}

function signOut() {
    // Placeholder for sign-out logic
    alert("You have been signed out.");
    // Redirect to the sign-in page or perform other actions
    window.location.href = "../1_StudentLogin/StudentLogin.html";
}


const nic = JSON.parse(sessionStorage.getItem("nic"))

let students = [];
let installments = [];
let Notifications = [];
let courses=[];

const GetAllStudentsURL = 'http://localhost:5209/api/Admin/get-All-Students';
const GetNotificationURL = 'http://localhost:5209/api/Notification/Get-All-Notifications';



const GetAllInstallmentsURL = 'http://localhost:5209/api/Payment/getinstalmentdetails';
async function GetAllInstallments(){
    fetch(GetAllInstallmentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        installments = data;
        // installmentTable();   
    })
};

const GetAllCoursesURL = 'http://localhost:5209/api/Admin/Get-All-course';
//Fetch Students Data from Database
async function GetAllCourses(){
    fetch(GetAllCoursesURL).then((response) => {
        return response.json();
    }).then((data) => {
        courses = data;
        // CourseTable();
    })
};
GetAllCourses()




async function GetNotifications(){
    fetch(GetNotificationURL).then((response) => {
        return response.json();
    }).then((data) => {
        Notifications = data;})
}
GetNotifications()
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;

        
        ProfilePicLoading();
        DetailsUpdateFormAutoFill();
        NotificationsTable()

        const GetAllInstallmentsURL = 'http://localhost:5209/api/Payment/getinstalmentdetails';
        async function GetAllInstallments(){
            fetch(GetAllInstallmentsURL).then((response) => {
                return response.json();
            }).then((data) => {
                installments = data;
                PaymentShow();
                ReminderNotification();
            })
        };
        GetAllInstallments()
    })
};

GetAllStudents();

const UpdateStudentURL = 'http://localhost:5209/api/Admin/Update-Student';
//Update Student Contact details
async function UpdateStudentFetch(studentUpdateData){
  //update Student
  await fetch(`${UpdateStudentURL}`,{
    method: "PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(studentUpdateData)
  });
  GetAllStudents();
};

const UpdatePasswordURL = 'http://localhost:5209/api/student/password-Update';
async function UpdatePassword(password,nic){ 
  //Delete Student
  await fetch(`${UpdatePasswordURL}?password=${password}&nic=${nic}`,{
    method:"PUT"
  });

};


function ProfilePicLoading(){
    const student = students.find(s => s.nic == nic);
    const imagePath = student.imagePath
    const imageFullPath = `http://localhost:5209${imagePath}`.trim();

    const ProfilePicContainer = document.getElementById('profilepic-container');
    ProfilePicContainer.innerHTML = `
        <img src="${imageFullPath}" alt="${student.fullName}"  id="profile-picture" class="profile-picture">
    `;
    
}


function PaymentShow(){
    const student = students.find(s => s.nic == nic);
    console.log(student)
    const installment = installments.find(i => i.nic == nic);
    if(student){
        document.getElementById("courseName").textContent = student.course
        document.getElementById("greeting").textContent = `Hey ${student.fullName}`
        document.getElementById("proficiencyLevels").textContent = student.ProficiencyLevels
        

        if(student.fullpayment != 0 || installment != null){
            document.getElementById("status").textContent = `Active`
            document.getElementById("status").style.color = "Green"
        }else{
            document.getElementById("status").textContent = `Inactive`
            document.getElementById("status").style.color = "Red"
        }


        if(student.fullpayment != 0){
            document.getElementById("p1").textContent = `Course Fee   : ${student.fullpayment}`
            document.getElementById("p2").textContent = `Payment Plan : Full Payment`
            document.getElementById("p3").textContent = `Full Payment Done`
            document.getElementById("p4").textContent = `Payment Date : ${new Date(student.paymentDate).toDateString()}`
        }else if(installment){
            document.getElementById("p1").textContent = `Course Fee   : ${installment.totalAmount}`
            document.getElementById("p2").textContent = `Payment Plan : Installment`
            document.getElementById("p3").textContent = `Payment Paid : ${(installment.paymentPaid).toFixed(0)}`
            document.getElementById("p4").textContent = `Payment Due : ${installment.paymentDue.toFixed(0)}`
            document.getElementById("p5").textContent = `Payment Date : ${new Date(installment.paymentDate).toDateString()}`
        }else{
            document.getElementById("p1").textContent = `Payment Pending .....`
        }
    }
}
    



// Profile page
// Personal Information Update and View
function DetailsUpdateFormAutoFill(){
    const student = students.find(s => s.nic == nic);

    if(student){
        document.getElementById("nic").value = student.nic
        document.getElementById("fullname").value = student.fullName
        document.getElementById("email").value = student.email
        document.getElementById("phone").value = student.phoneNumber
    }

    document.getElementById('update-button').addEventListener("click",()=>{
        document.getElementById("fullname").disabled = false
        document.getElementById("email").disabled = false
        document.getElementById("phone").disabled = false

        document.getElementById('update-button').style.display = 'none'
        document.getElementById('save-button').style.display = 'block'
        document.getElementById('Cancel-button').style.display = 'block'
    })
}


document.getElementById('save-button').addEventListener('click' , ()=>{
    const student = students.find(s => s.nic == nic);
    const fullName = document.getElementById("fullname").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value

    const studentUpdateData = {
        nic:student.nic,
        fullName:fullName,
        email:email,
        phoneNumber:phone
      }
      UpdateStudentFetch(studentUpdateData);

    document.getElementById("fullname").disabled = true
    document.getElementById("email").disabled = true
    document.getElementById("phone").disabled = true

    document.getElementById('update-button').style.display = 'block'
    document.getElementById('save-button').style.display = 'none'
    document.getElementById('Cancel-button').style.display = 'none'
})

document.getElementById('Cancel-button').addEventListener('click',()=>{
    document.getElementById("fullname").disabled = true
    document.getElementById("email").disabled = true
    document.getElementById("phone").disabled = true

    document.getElementById('update-button').style.display = 'block'
    document.getElementById('save-button').style.display = 'none'
    document.getElementById('Cancel-button').style.display = 'none'
})

document.getElementById('remove-notification').addEventListener('click' , (event)=>{
    event.target.parentElement.remove()
    document.getElementById('circle').style.visibility = "hidden"
 })
 

 function ReminderNotification(){
    const student = students.find(s => s.nic == nic);
    const installment = installments.find(i => i.nic == nic);
    if(student){
       if(installment){
           const installment = installments.find(i => i.nic == nic);
           const today = new Date();
           const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);

           if(endOfMonth.getDate() - today.getDate() <= 4){
                document.getElementById('reminder').style.display = "flex"
                document.getElementById('message').innerText = `You have to pay your installment of ${(installment.installmentAmount).toFixed(0)}/= this month.`
           }else{
               document.getElementById('reminder').style.display = "none"
           }
       }else{
           document.getElementById('reminder').style.display = "none"
       }
    }
 }

function Encryption(password){
    return btoa(password)
}

function validatePassword(password) {
    // Define the rules
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    // Check password length
    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }
  
    // Check for uppercase letters
    if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
    }
  
    // Check for lowercase letters
    if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
    }
  
    // Check for numbers
    if (!hasNumbers) {
        return "Password must contain at least one number.";
    }
  
    // Check for special characters
    if (!hasSpecialChars) {
        return "Password must contain at least one special character.";
    }
  
    return "Password is valid!";
  
  }

  const student = students.find(s => s.nicNumber == nic);

document.getElementById('password-form').addEventListener("submit" , (event)=>{
    event.preventDefault();
    const oldPassword = Encryption(document.getElementById('oldPassword').value);
    const newPassword = Encryption(document.getElementById('newPassword').value);
    const confirmPassword = Encryption(document.getElementById('confirmPassword').value);

    if(validatePassword(document.getElementById('newPassword').value.trim()) != true) {
        const error = validatePassword(document.getElementById('newPassword').value.trim());
        if(error != "Password is valid!"){
            alert(error);
            return;
        }
        console.log("hello")
    }

    const student = students.find(s => s.nic == nic);
    console.log(student)

    if(student){
        console.log("Hello")
        if(student.password == oldPassword){
            if(newPassword == confirmPassword){
                UpdatePassword(newPassword,nic)
                alert('Password Changed Successfully')
                event.target.reset()
            }else{
                alert('Password does not match')
            }
        }else{
            alert("Old Password is incorrect")
        }
    }
})


document.getElementById('home').addEventListener('click',()=>{
    document.getElementById('my-course').style.display = "block"
    document.getElementById('profile-information').style.display = "none"
    document.getElementById('payment-info').style.display = "none"
    document.getElementById('password-change').style.display = "none"
    document.getElementById('notification-container').style.display = "none"
    document.getElementById('course-container').style.display = "inline-block"
})
document.getElementById('profile-btn').addEventListener('click',()=>{
    document.getElementById('my-course').style.display = "none"
    document.getElementById('profile-information').style.display = "inline-block"
    document.getElementById('payment-info').style.display = "none"
    document.getElementById('password-change').style.display = "none"
    document.getElementById('notification-container').style.display = "none"
    document.getElementById('course-container').style.display = "none"

})
document.getElementById('payment').addEventListener('click',()=>{
    document.getElementById('my-course').style.display = "none"
    document.getElementById('profile-information').style.display = "none"
    document.getElementById('payment-info').style.display = "inline-block"
    document.getElementById('password-change').style.display = "none"
    document.getElementById('notification-container').style.display = "none"
    document.getElementById('course-container').style.display = "none"
})
document.getElementById('setting').addEventListener('click',()=>{
    document.getElementById('my-course').style.display = "none"
    document.getElementById('profile-information').style.display = "none"
    document.getElementById('payment-info').style.display = "none"
    document.getElementById('password-change').style.display = "inline-block"
    document.getElementById('notification-container').style.display = "none"
    document.getElementById('course-container').style.display = "none"
})
document.getElementById('notification').addEventListener('click',()=>{
    document.getElementById('my-course').style.display = "none"
    document.getElementById('profile-information').style.display = "none"
    document.getElementById('payment-info').style.display = "none"
    document.getElementById('password-change').style.display = "none"
    document.getElementById('notification-container').style.display = "block"
    document.getElementById('course-container').style.display = "none"
    NotificationsTable();
})

function NotificationsTable(){
    const student = students.find(s => s.nic == nic);
    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.innerHTML = ""
    console.log(Notifications)
    Notifications.forEach(N => {
        console.log(N)
        if(N.nic == nic && N.isDeleted != true){
            if(N.type == "Course"){
                console.log(courses);
                const course = courses.find(c => c.courseid == N.sourceId)
                console.log(course);
                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">"Available!! We have a new, <strong>${course.coursename}  ${course.proficiencyLevel}</strong> course ready for you! it's a great chance to learn new skills and improve your knowledge. starting on <strong>${new Date(N.date).toDateString()}</strong></p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }else if(N.type == "FullPayment"){
                const fullpayment = FUllpaymentDetails.find(f => f.id == N.sourceId);
                const courseEnroll = courseEnrollData.find(ce => ce.fullPaymentId == fullpayment.id)
                const course = courses.find(c => c.id == courseEnroll.courseId)
                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">"Dear <strong>${student.fullName}</strong>, we are pleased to inform you that your full payment <strong>${student.fullPayment} Rs</strong> for <strong>${course.courseName} ${course.level} </strong>has been successfully received as of <strong>${new Date(N.date).toDateString()}</strong>. Thank you for your prompt payment!"</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }else if(N.type == "Installment"){
                const installment = installments.find(i => i.Nic == N.sourceId)
                const courseEnroll = courseEnrollData.find(ce => ce.installmentId == installment.id)
                const course = courses.find(c => c.id == courseEnroll.courseId)
                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">We are pleased to inform you that your installment payment <strong>${installment.installmentAmount} Rs</strong> for <strong>${course.courseName}
                    ${course.level}</strong> has been successfully received as of <strong>${new Date(N.date).toDateString()}</strong>. Thank you for your timely payment!</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }else if(N.type == "Reminder"){
                const courseEnroll = courseEnrollData.find(ce => ce.id == student.courseEnrollId)
                const course = courses.find(c => c.id == courseEnroll.courseId)

                const today = new Date();
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);

                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">"Hello <strong>${student.fullName}</strong>, this is a friendly reminder that your next installment payment for <strong> ${course.courseName} ${course.level}</strong> is due on<strong> ${new Date(endOfMonth).toDateString()}</strong>. Please ensure that your payment is made on time to continue enjoying the course.</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }
                
        }
    })
}