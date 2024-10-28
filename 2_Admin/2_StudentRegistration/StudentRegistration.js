const toggle = document.querySelector(".fa-bars");
const toggleClose = document.querySelector(".fa-xmark");
const sideNavebar = document.querySelector(".side-navebar");

toggle.addEventListener("click", function () {
  sideNavebar.style.right = "0";
});

toggleClose.addEventListener("click", function () {
  sideNavebar.style.right = "-60%";
});

// const students = JSON.parse(localStorage.getItem("students")) || []; // From Local Storage
let students = [];
const AddStudentURL = 'http://localhost:5209/api/Admin/Add-Student';
const DeleteStudentURL = 'http://localhost:5209/api/Admin/Delete-Students';

//Add Student in Database
async function AddStudent(studentData){
  //Create new Student
  await fetch(AddStudentURL,{
    method:"POST",
    body:studentData
  });
  GetAllStudents();
  StudentTable();
}


const GetAllStudentsURL = 'http://localhost:5209/api/Admin/get-All-Students';
async function GetAllStudents(){
  fetch(GetAllStudentsURL).then((response) => {
    return response.json();
  }).then((data) => {
    students = data;
    StudentTable();
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
  StudentTable();
};

  //Delete Student from Database
  async function DeleteStudent(StudentNic){ 
    //Delete Student
    await fetch(`${DeleteStudentURL}?nic=${StudentNic}`,{
      method:"DELETE"
    });
  
  };




//Password Encryption
function encryption(password) {
  return btoa(password);
}

// NIC validation function
function validateNic(nic) {
  const nicPattern1 = /^[0-9]{9}[Vv]$/; // 9 numbers and one letter (V or v) at the end
  const nicPattern2 = /^[0-9]{12}$/;    // 12 numbers only
  return nicPattern1.test(nic) || nicPattern2.test(nic);
}

// Phone number validation function
function validatePhone(phone) {
  const phonePattern = /^[0-9]{10}$/;   // 10 digit numbers only
  return phonePattern.test(phone);
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

//Form Submit Function
document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nicNumber = document.getElementById("nic").value.trim();
    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = encryption(document.getElementById("password").value);
    const fileinput = document.getElementById('profile').files;
    const registrationFee = 2500;

    // Validate NIC, phone, and password before proceeding
    if(!validateNic(nicNumber)) {
        document.getElementById("user-registration-message").style.color = "Red";
        document.getElementById("user-registration-message").textContent = "Invalid NIC format. Should be 9 numbers followed by a letter V or 12 numbers only.";
        return;
    }

    if(!validatePhone(phone)) {
        document.getElementById("user-registration-message").style.color = "Red";
        document.getElementById("user-registration-message").textContent = "Invalid phone number. Must be 10 digits long.";
        return;
    }

    if(validatePassword(document.getElementById('password').value.trim()) != true) {
      const error = validatePassword(document.getElementById('password').value.trim());
      if(error == "Password is valid!"){
          document.getElementById('password').style.border = "2px solid Green"
          document.getElementById("user-registration-message").style.color = "Green";
          document.getElementById("user-registration-message").textContent = error;
      }else{
          document.getElementById('password').style.border = "2px solid Red"
          document.getElementById("user-registration-message").style.color = "Red";
          document.getElementById("user-registration-message").textContent = error;
          return;
      }
  }
  
    const users = students.find((user) => user.nicNumber == nicNumber);

    if (users) {
      document.getElementById("user-registration-message").style.color = "Red";
      document.getElementById("user-registration-message").textContent =
        "User already exist";
    } else {
        const formdata = new FormData();
        formdata.append("nic",nicNumber);
        formdata.append("fullName",fullName);
        formdata.append("email",email);
        formdata.append("phoneNumber",phone);
        formdata.append("password",password);
        formdata.append("registrationFee",registrationFee);
        formdata.append("imageFile",fileinput[0]);
        AddStudent(formdata);

        // localStorage.setItem("students", JSON.stringify(students));
        StudentTable();
        document.getElementById("user-registration-message").style.color =
          "Green";
        document.getElementById("user-registration-message").textContent =
          "Successfuly Registrated";
        event.target.reset();
        document.getElementById('nic').style.border = "2px solid #190458"
        document.getElementById('password').style.border = "2px solid #190458"

      
    }
  });

//This is for find Student already Exists
document.getElementById("nic").addEventListener("keyup", () => {
  const nic = document.getElementById("nic").value;
  const student = students.find((student) => student.nic == nic);

  if (nic.length != 0) {
      if(!validateNic(nic)){
          document.getElementById('nic').style.border = "2px solid Red"
          document.getElementById("user-registration-message").style.color = "Red";
          document.getElementById("user-registration-message").textContent = "Invalid NIC format. Should be 9 numbers followed by a letter V or 12 numbers only.";
      }else{
          if(student){
              document.getElementById('user-registration-message').style.color = "Red";
              document.getElementById('user-registration-message').textContent = "Student Already Exists";
              document.getElementById('nic').style.border = "2px solid Red"
      
          }else{
              document.getElementById('user-registration-message').style.color = "Green";
              document.getElementById('user-registration-message').textContent = "New Student";
              document.getElementById('nic').style.border = "2px solid green"
          } 
      }
  }else{
      document.getElementById('nic').style.border = "none"
      document.getElementById('user-registration-message').textContent = ""
  }

});

document.getElementById('password').addEventListener("keyup" , () =>{
  const password = document.getElementById('password').value.trim();

  if (password.length != 0) {
      
      if(validatePassword(password) != true){
          const error = validatePassword(password);
          if(error == "Password is valid!"){
              document.getElementById('password').style.border = "2px solid Green"
              document.getElementById("user-registration-message").style.color = "Green";
              document.getElementById("user-registration-message").textContent = error;
          }else{
              document.getElementById('password').style.border = "2px solid Red"
              document.getElementById("user-registration-message").style.color = "Red";
              document.getElementById("user-registration-message").textContent = error;
          }
      }
      
      else{
          document.getElementById('user-registration-message').style.color = "Green";
          document.getElementById('user-registration-message').textContent = "Valid! password";
          document.getElementById('password').style.border = "2px solid Green"
      }
      
  }else{
      document.getElementById('password').style.border = "none"
      document.getElementById('user-registration-message').textContent = ""
  }

});


//Show Table
function StudentTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${student.nic}</td>
            <td>${student.fullName}</td>
            <td>${student.phoneNumber}</td>
            <td>${student.email}</td>
            
            <td><button class="update-btn tableBtn" onclick="UpdateStudent('${student.nic}')">Update</button><button class ="remove-btn tableBtn" onclick="removeStudentByNicNumber(event,'${student.nic}')" >Remove</button></td>
        `;
    tableBody.appendChild(row);
  });
}
StudentTable();

function UpdateStudent(nic) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popupbox").style.display = "block";

  const student = students.find((student) => student.nic == nic);

  document.getElementById("updatenic").value = student.nic;
  document.getElementById("updatenic").disabled = true;
  document.getElementById("newname").value = student.fullName;
  document.getElementById("newEmail").value = student.email;
  document.getElementById("newPhone").value = student.phoneNumber;
}
document.getElementById("update-student-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const nic = document.getElementById("updatenic").value;
    const NewName = document.getElementById("newname").value.trim();
    const NewEmail = document.getElementById("newEmail").value.trim();
    const NewPhone = document.getElementById("newPhone").value.trim();


    if(!validatePhone(NewPhone)) {
      document.getElementById("user-registration-message-3").style.color = "Red";
      document.getElementById("user-registration-message-3").textContent = "Invalid phone number. Must be 10 digits long.";
      return;
  }


    const studentUpdateData = {
      nic:nic,
      fullName:NewName,
      email:NewEmail,
      phoneNumber:NewPhone
    }
    UpdateStudentFetch(studentUpdateData);

    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupbox").style.display = "none";
    document.getElementById("user-registration-message-3").textContent = "";
    
  });

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popupbox").style.display = "none";
});

//Remove Student
function removeStudentByNicNumber(event, StudentNicToRemove) {
  const row = event.target.parentElement.parentElement;
  row.remove();
  let indexToRemove = students.findIndex(
    (obj) => obj.nic == StudentNicToRemove
  );

  if (indexToRemove != -1) {
    DeleteStudent(StudentNicToRemove)
    document.getElementById("user-registration-message-2").style.color =
      "Green";
    document.getElementById("user-registration-message-2").textContent =
      "Student Removed Successfully";
  } else {
    document.getElementById("user-registration-message-2").textContent =
      "Student not found";
  }

  setTimeout(() => {
    document.getElementById("user-registration-message-2").textContent = "";
  }, 2000);
}

//Logout function

function logout() {
  window.location.href = "../1_AdminLogin/AdminLogin.html";
}

const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", function () {
  logout();
});
