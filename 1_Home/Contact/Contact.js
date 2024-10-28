const ContactUsURL = 'http://localhost:5209/api/ContactUs/Add-ContactUs-Details';

async function AddContactUs(ContactUsDetails){
    await fetch((ContactUsURL),{
        method:'POST',
        headers:{
           "Content-Type": "application/json"
        },
        body:JSON.stringify(ContactUsDetails)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


document.getElementById("contactus").addEventListener("submit",()=>{
    event.preventDefault();

    const name = document.getElementById('fname').value;
    const email = document.getElementById('lname').value;
    const message = document.getElementById('subject').value;
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

