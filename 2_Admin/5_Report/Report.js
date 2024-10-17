// Side NaveBar
const toggle = document.querySelector(".fa-bars");
const toggleClose = document.querySelector(".fa-xmark");
const sideNavebar = document.querySelector(".side-navebar");

toggle.addEventListener("click", function () {
  sideNavebar.style.right = "0";
});

toggleClose.addEventListener("click", function () {
  sideNavebar.style.right = "-50%";
});

//Data retrive from localstorage
const students = JSON.parse(localStorage.getItem("students"));
const courses = JSON.parse(localStorage.getItem("courses"));
const installments = JSON.parse(localStorage.getItem("installmentDetails"));

document.getElementById("report-generate-btn").addEventListener("click", () => {
  const nic = document.getElementById("search-by-nic").value;
  StudentReport(nic);
});

function StudentReport(nic) {
  const student = students.find((student) => student.nicNumber == nic);
  const installment = installments.find(
    (installment) => installment.nicNumber == nic
  );

  if (student) {
    if (student.fullpayment != null) {
      ShowFullPaymentStudentDetails(student);
    } else if (student.course == null) {
      StudentWhoDidntSelectACourse(student);
    } else if (student.installment != null) {
      ShowInstallmentStudentDetails(student, installment);
    }
  } else {
    alert("Student not found");
  }
}

function ShowFullPaymentStudentDetails(student) {
  const StudentDetails = document.getElementById("student-details-table");
  StudentDetails.innerHTML = "";

  const row = document.createElement("tr");
  row.innerHTML = `
          <td>${student.nicNumber}</td>
          <td>${student.fullName}</td>
          <td>${student.phone}</td>
          <td>${student.email}</td>
      `;
  StudentDetails.append(row);

  const courseDetails = document.getElementById("Course-details-table");
  courseDetails.innerHTML = "";

  const row2 = document.createElement("tr");
  row2.innerHTML = `
        <td>${student.course}</td>
        <td>${student.ProficiencyLevels}</td>
        <td>${student.duration} / Months</td>
    `;
  courseDetails.append(row2);

  const paymentDetails = document.getElementById("full-Payment-details-table");
  paymentDetails.innerHTML = "";

  const row3 = document.createElement("tr");
  row3.innerHTML = `
        <td>${student.fullpayment}</td>
        <td>Full Payment</td>
        <td>${student.fullpayment}</td>
    `;
  paymentDetails.append(row3);

  document.getElementById("row2").style.display = "none";
  document.getElementById("row1").style.display = "inline-block";
}

function StudentWhoDidntSelectACourse(student) {
  const StudentDetails = document.getElementById("student-details-table");
  StudentDetails.innerHTML = "";
  document.getElementById("Course-details-table").innerHTML = "";
  document.getElementById("full-Payment-details-table").innerHTML = "";

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${student.nicNumber}</td>
        <td>${student.fullName}</td>
        <td>${student.phone}</td>
        <td>${student.email}</td>
    `;
  StudentDetails.append(row);
}

function ShowInstallmentStudentDetails(student, installment) {
  const StudentDetails = document.getElementById("student-details-table");
  StudentDetails.innerHTML = "";

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${student.nicNumber}</td>
        <td>${student.fullName}</td>
        <td>${student.phone}</td>
        <td>${student.email}</td>
    `;
  StudentDetails.append(row);

  const courseDetails = document.getElementById("Course-details-table");
  courseDetails.innerHTML = "";

  const row2 = document.createElement("tr");
  row2.innerHTML = `
      <td>${student.course}</td>
      <td>${student.ProficiencyLevels}</td>
      <td>${student.duration} / Months</td>
  `;
  courseDetails.append(row2);

  const paymentDetails = document.getElementById(
    "installment-Payment-details-table"
  );
  paymentDetails.innerHTML = "";

  const row3 = document.createElement("tr");
  row3.innerHTML = `
      <td>${installment.installment.totalAmount}</td>
      <td>Installment</td>
      <td>${student.duration}</td>
      <td>${student.installment}</td>
      <td>${installment.installment.paymentPaid}</td>
      <td>${installment.installment.paymentDue}</td>
      <td>${new Date(installment.installment.paymentDate).toDateString()}</td>
  `;
  paymentDetails.append(row3);

  document.getElementById("row2").style.display = "inline-block";
  document.getElementById("row1").style.display = "none";
}

// Course Enrollment
// Course Enrollment
// Course Enrollment
// Course Enrollment

document.addEventListener('DOMContentLoaded',()=>{
    const table = document.getElementById('course-enrollment-table');
        courses.forEach((course) => {
            let courseEnrollment = 0;
            students.forEach((student) => {

                if(student.course == course.courseName && student.ProficiencyLevels == course.level ){
                        courseEnrollment ++;
                }

            })

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.courseID}</td>
                <td>${course.courseName}</td>
                <td>${course.level}</td>
                <td>${courseEnrollment}</td>
            `;
            table.appendChild(row);
        });

});

//Financial Report
//Financial Report
//Financial Report
//Financial Report

document.addEventListener('DOMContentLoaded',()=>{

    let initialAmount = 0;
    let fullPayment = 0;
    let paidInstallment = 0;
    let outStandingAmount = 0;

    students.forEach((student) => {
        initialAmount += student.registrationFee;
        if(student.fullpayment != null){
            fullPayment += student.fullpayment;
        }
    })
    installments.forEach((installment) =>{
        paidInstallment += installment.installment.paymentPaid
        outStandingAmount += installment.installment.paymentDue
    })

    const financialReport = document.getElementById("financial-report-table");
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${initialAmount}/=</td>
            <td>${fullPayment + paidInstallment}/=</td>
            <td>${fullPayment + paidInstallment + initialAmount}/=</td>
            <td>${outStandingAmount}/=</td>
        `;
    financialReport.append(row);


});

// nave link function

document.getElementById('student-details-btn').addEventListener('click',()=>{
    document.getElementById('student-details-report').style.display = "block"
    document.getElementById('course-enrollment').style.display = "none"
    document.getElementById('financial-report').style.display = "none"
})
document.getElementById('course-enrollment-btn').addEventListener('click',()=>{
    document.getElementById('student-details-report').style.display = "none"
    document.getElementById('course-enrollment').style.display = "block"
    document.getElementById('financial-report').style.display = "none"
})
document.getElementById('financial-btn').addEventListener('click',()=>{
    document.getElementById('student-details-report').style.display = "none"
    document.getElementById('course-enrollment').style.display = "none"
    document.getElementById('financial-report').style.display = "block"
})

// Logout function

function logout() {
  window.location.href = "../1_AdminLogin/AdminLogin.html";
}

const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", function () {
  logout();
});
