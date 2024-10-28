document.getElementById("admin-btn").addEventListener("click",()=>{
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const today = new Date();
    let id = Number(Math.floor(Math.random()*1000000))

    const ContactUsDetails = {
        id,
        name,
        email,
        message,
        submitDate:today
    }

    AddContactUs(ContactUsDetails)
    event.target.reset();
});

