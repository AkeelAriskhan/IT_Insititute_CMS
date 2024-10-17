
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

const students = JSON.parse(localStorage.getItem('students')) ||[]
const installments = JSON.parse(localStorage.getItem('installmentDetails')) ||[]
const nic = JSON.parse(sessionStorage.getItem("nic"))

// Home Page
document.addEventListener("DOMContentLoaded" ,() =>{
    const student = students.find(s => s.nicNumber == nic);
    const installment = installments.find(i => i.nicNumber == nic);
    if(student){
        document.getElementById("courseName").textContent = student.course
        document.getElementById("greeting").textContent = `Hey ${student.fullName}`
        document.getElementById("proficiencyLevels").textContent = student.ProficiencyLevels
        

        if(student.fullpayment != null || student.installment != null){
            document.getElementById("status").textContent = `Active`
            document.getElementById("status").style.color = "Green"
        }else{
            document.getElementById("status").textContent = `Inactive`
            document.getElementById("status").style.color = "Red"
        }


        if(student.fullpayment != null){
            document.getElementById("p1").textContent = `Course Fee   : ${student.fullpayment}`
            document.getElementById("p2").textContent = `Payment Plan : Full Payment`
            document.getElementById("p3").textContent = `Full Payment Done`
            document.getElementById("p4").textContent = `Payment Date : ${new Date(student.paymentDate).toDateString()}`
        }else if(student.installment != null){
            document.getElementById("p1").textContent = `Course Fee   : ${installment.installment.totalAmount}`
            document.getElementById("p2").textContent = `Payment Plan : Installment`
            document.getElementById("p3").textContent = `Payment Paid : ${installment.installment.paymentPaid}`
            document.getElementById("p4").textContent = `Payment Due : ${installment.installment.paymentDue}`
            document.getElementById("p5").textContent = `Payment Date : ${new Date(installment.installment.paymentDate).toDateString()}`
        }else{
            document.getElementById("p1").textContent = `Payment Pending .....`
        }
    }


})

// Profile page
// Personal Information Update and View
document.addEventListener("DOMContentLoaded" ,() =>{
    const student = students.find(s => s.nicNumber == nic);

    if(student){
        document.getElementById("nic").value = student.nicNumber
        document.getElementById("fullname").value = student.fullName
        document.getElementById("email").value = student.email
        document.getElementById("phone").value = student.phone
    }

    document.getElementById('update-button').addEventListener("click",()=>{
        document.getElementById("fullname").disabled = false
        document.getElementById("email").disabled = false
        document.getElementById("phone").disabled = false

        document.getElementById('update-button').style.display = 'none'
        document.getElementById('save-button').style.display = 'block'
        document.getElementById('Cancel-button').style.display = 'block'
    })

    document.getElementById('save-button').addEventListener('click' , ()=>{
        const fullName = document.getElementById("fullname").value
        const email = document.getElementById("email").value
        const phone = document.getElementById("phone").value

        student.fullName = fullName
        student.email = email
        student.phone = phone

        document.getElementById("fullname").disabled = true
        document.getElementById("email").disabled = true
        document.getElementById("phone").disabled = true

        document.getElementById('update-button').style.display = 'block'
        document.getElementById('save-button').style.display = 'none'
        document.getElementById('Cancel-button').style.display = 'none'


        localStorage.setItem('students' ,JSON.stringify(students))
    })

    document.getElementById('Cancel-button').addEventListener('click',()=>{
        document.getElementById("fullname").disabled = true
        document.getElementById("email").disabled = true
        document.getElementById("phone").disabled = true

        document.getElementById('update-button').style.display = 'block'
        document.getElementById('save-button').style.display = 'none'
        document.getElementById('Cancel-button').style.display = 'none'
    })
});


document.getElementById('remove-notification').addEventListener('click' , (event)=>{
    event.target.parentElement.remove()
    document.getElementById('circle').style.visibility = "hidden"
 })
 
document.addEventListener('DOMContentLoaded',()=>{
 
     const student = students.find(s => s.nicNumber == nic);
 
     if(student.installment != null){
         const installment = installments.find(i => i.nicNumber == nic);
         const today = new Date();
         const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);
         console.log(endOfMonth.getDate() - today.getDate())
         if(endOfMonth.getDate() - today.getDate() <= 5){
              document.getElementById('reminder').style.display = "flex"
              document.getElementById('message').innerText = `You have to pay your installment of ${installment.installment.installmentAmount}/= this month.`
         }else{
             document.getElementById('reminder').style.display = "none"
 
         }
     }else{
         document.getElementById('reminder').style.display = "none"
     }
});
 


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

document.getElementById('update-password').addEventListener('click' , ()=>{
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

    if(student){
        console.log("Hello")
        if(student.password == oldPassword){
            if(newPassword == confirmPassword){
                student.password = newPassword
                localStorage.setItem('students',JSON.stringify(students))
                alert('Password Changed Successfully')
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
})