// Get today's date and time
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(today.getDate()).padStart(2, '0');
const hours = String(today.getHours()).padStart(2, '0');
const minutes = String(today.getMinutes()).padStart(2, '0');

// Format date and time for input fields
const currentDate = `${year}-${month}-${day}`;
const currentTime = `${hours}:${minutes}`;

// Set the values for the pickup date/time inputs
document.getElementById('pickupDate').value = currentDate;
document.getElementById('pickupTime').value = currentTime;

// Genarate Rendom Id 
function genarateId(sPoint, leng) {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
    let startpoint = `${sPoint}-`;
    for (let i = 0; i <= leng; i++) {
        let rendomId = Math.floor(Math.random() * char.length);
        startpoint += char[rendomId];
    }
    return startpoint;
}

// Form event listener
const dateInputForm = document.getElementById('dateInputForm');

// Ensure to prevent the default form submission
dateInputForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Properly prevent form from submitting

    // Getting value of rent and return
    const pickupLocation = document.getElementById('pickupLocation').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const returnDate = document.getElementById('returnDate').value;
    const returnTime = document.getElementById('returnTime').value;


    // Check if all fields are filled
    if (!pickupLocation || !pickupDate || !pickupTime || !returnDate || !returnTime) {
        alert("Please fill in the pickup and return details correctly.");
    } else {
        const pickupDetail = {
            id: genarateId("PUDT", 16),
            location: pickupLocation,
            pickDate: pickupDate,
            pickTime: pickupTime,
            returnDate: returnDate,
            returnTime: returnTime
        };

        // Fetch API to submit data to the JSON server
        fetch('http://localhost:5000/PickupDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pickupDetail)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Redirect to another page
                window.location.href = 'explore-cars.html';
            })
            .catch(error => {
                console.error("Error submitting data:", error);
                alert("There was an error submitting the rental details.");
            });
    }
});