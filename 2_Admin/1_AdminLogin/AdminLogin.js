const adminUserName = "Admin";
const adminPassword = "wma123";


document.getElementById('login-form').addEventListener('submit' , (event)=>{
    event.preventDefault();
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password").value;

    if(username === adminUserName && password === adminPassword){
        window.location.href ="../2_StudentRegistration/StudentRegistration.html";
        
    }else{
        alert("Incorrect username or password");
    }
    event.target.reset();
    
})
