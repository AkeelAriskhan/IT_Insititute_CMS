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
    console.log(students);
    const student = students.find((student) => student.nic == nic);
            

    if(student){
        
        if( student.course != null  || student.ProficiencyLevels != null){
            document.getElementById('fee-management-message').textContent = student.fullName;
            document.getElementById('fee-management-message').style.color = "green";
            console.log(courses);

            courses.forEach(element => {
                if(element.coursename == student.course && element.proficiencyLevel == student.proficiencyLevels){
                    document.getElementById('total-course-fee').textContent = `${element.courseFee} Rs`;
                    document.getElementById('total-amount').textContent = `${element.courseFee} Rs`;
                    if(student.duration == "3"){
                        installmentAmount = element.courseFee / 3;
                        document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                    }else if(student.duration == "6"){
                            installmentAmount = element.courseFee / 6;
                            document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                    }
                    totalAmount = element.courseFee;
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
    const student = students.find((student) => student.nic == nic);
    console.log(student);
    const date = new Date()
    let paymentId = Number(Math.floor(Math.random()*1000000))

    if(paymentplan == "fullpayment"){

        if(student.fullpayment != 0 ){
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

        if(student.fullpayment != 0 ){
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
function Installment(student,nic){
    // Today Date 
    const today = new Date();

    const studentInstallment = InstallmentDetails.find((installment) => installment.nic == student.nic)

    if(studentInstallment){
        if(studentInstallment.paymentDue <= 0){
            document.getElementById('fee-management-message').style.color = "green";
            document.getElementById('fee-management-message').textContent = `${student.fullName} paid Full installment plan`;
        }else{
            const updatedata = {
                nic,
                installmentAmount:installmentAmount
            }
            UpdateInstallment(updatedata)
            document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`;
        }
        
    }else{
        let paymentDue = totalAmount - installmentAmount
        const InstallmentData = {
            nic,
            installmentAmount,
            installments:student.duration,
            paymentDue,
            paymentPaid:installmentAmount,
            totalAmount:totalAmount
        }
        AddInstallment(InstallmentData);
        document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`
    }
}



//Installment Payment Table
function installmentTable(){
    const table = document.getElementById('installment-body');
    table.innerHTML=""
    InstallmentDetails.forEach((installment) => {
        const student = students.find(s => s.nic == installment.nic)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${installment.nic}</td>
            <td>${student.fullName}</td>
            <td>${(installment.installmentAmount).toFixed(0)}/= </td>
            <td>${(installment.paymentPaid).toFixed(2)}/= </td>
            <td>${(installment.paymentDue).toFixed(2) < 0 ? 0: (installment.paymentDue).toFixed(2)}/= </td>
        `;
        table.appendChild(row);
    });
}
   

//Full Payment Table
function FullpaymentTable(){
    const table = document.getElementById('fullpayment-body');
    table.innerHTML = ""
    students.forEach((student) => {
        if(student.fullpayment != 0){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nic}</td>
                <td>${student.fullName}</td>
                <td>${student.fullpayment}/= </td>
                <td>${student.fullpayment}/= </td>
            `;
            table.appendChild(row);
        }
    });
}
  


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