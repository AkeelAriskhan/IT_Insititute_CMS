const toggle = document.querySelector(".fa-bars")
const toggleClose = document.querySelector(".fa-xmark")
const sideNavebar = document.querySelector(".side-navebar")

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0"
})
toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%"
})


// Retrive Data From Local Storage

let totalAmount = 0;
let installmentAmount = 0;


let students = [];
let InstallmentDetails = [];
let courses = [];


const GetAllStudentsURL = 'http://localhost:5209/api/Admin/get-All-Students';
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;

        FullpaymentTable(); 

        const GetAllCoursesURL = 'http://localhost:5209/api/Admin/Get-All-course';
        //Fetch Students Data from Database
        async function GetAllCourses(){
            fetch(GetAllCoursesURL).then((response) => {
                return response.json();
            }).then((data) => {
                courses = data;
    
            })
        };
        GetAllCourses()
        
    })
};

GetAllStudents();


const GetAllInstallmentsURL = 'http://localhost:5209/api/Payment/getinstalmentdetails';
async function GetAllInstallments(){
    fetch(GetAllInstallmentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        InstallmentDetails = data;
        installmentTable();   
    })
};

GetAllInstallments()

const AddFullPaymentURL = 'http://localhost:5209/api/Payment/full-payment';
//Add FullPayment data in Database
async function AddFullPayment(FullPaymentData){
    await fetch(AddFullPaymentURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(FullPaymentData)
    });
    GetAllStudents();
    FullpaymentTable();
};

const UpdateInstallmentURL = 'http://localhost:5209/api/Payment/instalment-update';
//Update Installments
async function UpdateInstallment(updatedata){
    await fetch(UpdateInstallmentURL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(updatedata)
    });
    GetAllInstallments();
    installmentTable(); 
}

const AddInstallmentURL = 'http://localhost:5209/api/Payment/installment';
//Add Installment
async function AddInstallment(InstallmentData){
    await fetch(AddInstallmentURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(InstallmentData)
    });
    GetAllInstallments();
    installmentTable();
};

document.getElementById('nic').addEventListener("keyup" , () =>{
    const nic = document.getElementById('nic').value;
    const student = students.find((student) => student.nicNumber == nic);
            

    if(student){
        
        if( student.course != null  || student.ProficiencyLevels != null){
            document.getElementById('fee-management-message').textContent = student.fullName;
            document.getElementById('fee-management-message').style.color = "green";

            courses.forEach(element => {
                if(element.courseName == student.course && element.level == student.ProficiencyLevels){
                    document.getElementById('total-course-fee').textContent = `${element.totalFee} Rs`;
                    document.getElementById('total-amount').textContent = `${element.totalFee} Rs`;
                    if(student.duration == "3"){
                        installmentAmount = element.totalFee / 3;
                        document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                    }else if(student.duration == "6"){
                            installmentAmount = element.totalFee / 6;
                            document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                    }
                    totalAmount = element.totalFee;
                }
            });

        }else{
            document.getElementById('fee-management-message').textContent = `${student.fullName} didnt select any course`;
            document.getElementById('total-course-fee').textContent = `0 Rs`;
            document.getElementById('total-amount').textContent = `0 Rs`;
            document.getElementById('installment-amount').textContent = `0 Rs`;
        }

    }else{
        document.getElementById('fee-management-message').textContent = "Student not found";
        document.getElementById('fee-management-message').style.color = "red";
    }

});


//Form Submit Function
document.getElementById('fee-management-form').addEventListener('submit' ,(event) =>{
    event.preventDefault();


    const paymentplan = document.getElementById('payment-plan').value;
    const nic = document.getElementById('nic').value;
    const student = students.find((student) => student.nicNumber == nic);
    const date = new Date()
    let paymentId = Number(Math.floor(Math.random()*1000000))

    if(paymentplan == "fullpayment"){

        if(student.fullpayment != null || student.installment != null){
            document.getElementById('fee-management-message').textContent = "Student already paid payment";
        }
        else{
            const FullPaymentData = {
                nic,
                fullpaymentamount:totalAmount
            }
            AddFullPayment(FullPaymentData)
            document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Full Payment`;
        }  

    }
    else if(paymentplan == "installment"){

        if(student.fullpayment != null ){
            document.getElementById('fee-management-message').textContent = "Student already paid Full payment";
        }
        else{
            Installment(student,nic);
        }

    }else{
        document.getElementById('fee-management-message').textContent = "Please select the payment Plan";
    }

    setTimeout(()=>{
        document.getElementById('fee-management-message').textContent = "";
        }, 3000);
    
    document.getElementById('total-course-fee').textContent = `0 Rs`;
    document.getElementById('total-amount').textContent = `0 Rs`;
    document.getElementById('installment-amount').textContent = `0 Rs`;
    
    localStorage.setItem('students',JSON.stringify(students));
    localStorage.setItem('installmentDetails',JSON.stringify(InstallmentDetails));

    event.target.reset();

});




//Installment Calculation
function Installment(student,paymentplan,nic,date,paymentId){
    // Today Date 
    const today = new Date();

    student.installment = installmentAmount;

    const studentInstallment = InstallmentDetails.find((installment) => installment.nicNumber == student.nicNumber)

    if(studentInstallment){
        if(studentInstallment.installment.paymentDue <= 0){
            document.getElementById('fee-management-message').style.color = "green";
            document.getElementById('fee-management-message').textContent = `${student.fullName} paid Full installment plan`;
        }else{
            studentInstallment.installment.paymentDue -= installmentAmount;
            studentInstallment.installment.paymentPaid += installmentAmount;
            installmentTable(); 
            document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`;
        }
        
    }else{
        let paymentDue = totalAmount - installmentAmount
        InstallmentDetails.push({nicNumber:student.nicNumber , installment:{totalAmount , installmentAmount , paymentPaid:installmentAmount , paymentDue ,installments:student.duration ,paymentDate:today}})
        document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`
        installmentTable(); 
    }
}



//Installment Payment Table
function installmentTable(){
    const table = document.getElementById('installment-body');
    table.innerHTML=""
    InstallmentDetails.forEach((installment) => {
        const student = students.find(s => s.nicNumber == installment.nicNumber)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${installment.nicNumber}</td>
            <td>${student.fullName}</td>
            <td>${installment.installment.installmentAmount}/= </td>
            <td>${installment.installment.paymentPaid}/= </td>
            <td>${installment.installment.paymentDue}/= </td>
        `;
        table.appendChild(row);
    });
}
installmentTable();      

//Full Payment Table
function FullpaymentTable(){
    const table = document.getElementById('fullpayment-body');
    table.innerHTML = ""
    students.forEach((student) => {
        if(student.fullpayment != null){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nicNumber}</td>
                <td>${student.fullName}</td>
                <td>${student.fullpayment}/= </td>
                <td>${student.fullpayment}/= </td>
            `;
            table.appendChild(row);
        }
    });
}
FullpaymentTable();   


document.getElementById("installment-btn").addEventListener('click',() =>{
    document.querySelector("#table-1").style.display = "block"
    document.querySelector("#table-2").style.display = "none"
})
document.getElementById("full-payment-btn").addEventListener('click',() =>{
    document.querySelector("#table-1").style.display = "none"
    document.querySelector("#table-2").style.display = "block"
})


//Logout function

function logout() {
    window.location.href="../1_AdminLogin/AdminLogin.html";
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
  logout();
});