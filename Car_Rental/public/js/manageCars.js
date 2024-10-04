// DOM Elements
const carForm = document.getElementById('carForm');
const carBrand = document.getElementById('carBrand');
const carName = document.getElementById('carName');
const gearType = document.getElementById('gearType');
const seatCount = document.getElementById('seatCount');
const fuelType = document.getElementById('fuelType');
const mileage = document.getElementById('mileage');
const regNo = document.getElementById('regNo');
const dayPrice = document.getElementById('dayPrice');
const hourPrice = document.getElementById('hourPrice');
const addNewBrandInput = document.getElementById('addNewBrand');
const addNewCarNameInput = document.getElementById('addNewCarName');

// Options for dropdowns
const GearTypeDropdown = ["Auto", "Manual"];
const fuelTypeDropdown = ["Petrol", "Diesel", "Electric"];
const seatCountDropdown = Array.from({ length: 12 }, (_, i) => i + 1);

// Fetch car models from JSON server
async function fetchCarModels() {
    try {
        const response = await fetch('http://localhost:5000/newCars');
        if (!response.ok) throw new Error('Failed to fetch car models');
        return await response.json();
    } catch (err) {
        console.error('Error fetching car models', err);
        return [];
    }
}


// Populate car brands dropdown
async function populateCarBrands() {
    const carModels = await fetchCarModels();
    carBrand.innerHTML = '<option value="" disabled selected>Choose A Car Brand</option>';

    // Loop through each car object in the fetched array
    carModels.forEach(car => {
        const option = document.createElement('option');
        option.value = car.brand;  // Use the brand as the value
        option.textContent = car.brand;  // Display the brand name in the dropdown
        carBrand.appendChild(option);
    });
}



// Populate car names based on selected brand
carBrand.addEventListener('change', async function () {
    const selectedBrand = this.value;
    carName.innerHTML = '<option value="" disabled selected>Choose A Car Name</option>'; // Reset car names dropdown

    const carModels = await fetchCarModels();
    const brandData = carModels.find(car => car.brand === selectedBrand);

    if (brandData) {
        brandData.models.forEach(function (model) {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carName.appendChild(option);
        });
    }
});


// Add a new brand
async function addNewCar() {
    const newBrand = addNewBrandInput.value.trim();

    console.log("new brand", newBrand)
    if (newBrand) {
        const carModels = await fetchCarModels();

        // Check if the brand already exists
        const existingBrand = carModels.find(car => car.brand === newBrand);

        if (!existingBrand) {
            const response = await fetch('http://localhost:5000/newCars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand: newBrand, models: [] })
            });

            if (response.ok) {
                addNewBrandInput.value = ''; // Clear input

                // Dynamically update the car brand dropdown without reloading
                const option = document.createElement('option');
                option.value = newBrand;
                option.textContent = newBrand;
                carBrand.appendChild(option); // Add the new brand to the dropdown
            } else {
                alert('Failed to add the brand.');
            }
        } else {
            alert('Brand already exists.');
        }
    } else {
        alert('Brand name cannot be empty.');
    }
}



// Add a new car model to the selected brand
async function addNewModel() {
    const selectedBrand = carBrand.value;
    const newModel = addNewCarNameInput.value.trim();

    if (selectedBrand && newModel) {
        const carModels = await fetchCarModels();
        const brandData = carModels.find(car => car.brand === selectedBrand);

        if (brandData && !brandData.models.includes(newModel)) {
            const updatedModels = [...brandData.models, newModel];

            const response = await fetch(`http://localhost:5000/newCars/${brandData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ models: updatedModels })
            });

            if (response.ok) {
                alert(`Model '${newModel}' added successfully to brand '${selectedBrand}'.`);
                addNewCarNameInput.value = ''; // Clear input

                // Dynamically update the car name dropdown without reloading
                const option = document.createElement('option');
                option.value = newModel;
                option.textContent = newModel;
                carName.appendChild(option); // Add the new model to the dropdown
            } else {
                alert('Failed to add model.');
            }
        } else {
            alert('Model already exists or invalid brand.');
        }
    } else {
        alert('No brand selected or model input is empty.');
    }
}

// genarate a rendom id
function genarateId(sPoint, leng) {
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
    let startpoint = `${sPoint}-`;
    for (let i = 0; i <= leng; i++) {
        let rendomId = Math.floor(Math.random() * char.length);
        startpoint += char[rendomId];
    }
    return startpoint;
}


// Submit the car form
async function submitCarForm() {
    const imageInput = document.getElementById('logo-id'); // Image input field
    const file = imageInput.files[0]; // Get the image file

    if (!file) {
        alert('Please upload an image.');
        return;
    }

    // Convert image to Base64
    const base64Image = await getBase64(file);

    const carData = {
        id: genarateId("CAR", 16), // Assuming generateId is defined
        image: base64Image,        // Add the Base64 image string here
        brand: carBrand.value,
        name: carName.value,
        gearType: gearType.value,
        seatCount: seatCount.value,
        fuelType: fuelType.value,
        mileage: mileage.value,
        regNo: regNo.value,
        dayPrice: dayPrice.value,
        hourPrice: hourPrice.value
    };

    // Validate the form
    if (!Object.values(carData).every(value => value.trim() !== '' && value !== null)) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to add car.');
        }

        alert('Car added successfully!');
        carForm.reset(); // Reset the form after successful submission
    } catch (error) {
        console.error('Error submitting the form:', error);
        alert('There was an error adding the car. Please try again.');
    }
}

// Helper function to convert image to Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}


// Helper function to populate dropdowns
function populateDropdown(dropdown, options) {
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        dropdown.appendChild(option);
    });
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', async function () {
    populateCarBrands();

    // Populate dropdowns for gear types, seat counts, and fuel types
    populateDropdown(gearType, GearTypeDropdown);
    populateDropdown(fuelType, fuelTypeDropdown);
    populateDropdown(seatCount, seatCountDropdown);
});

document.getElementById('btnAddNewName').addEventListener('click', (e) => {
    e.preventDefault();
    addNewModel();
})
document.getElementById('btnAddNewBrand').addEventListener('click', (e) => {
    e.preventDefault();
    addNewCar();
})

// Event listener for form submission
carForm.addEventListener('submit', async function () { // Prevent default form submission
    await submitCarForm(); // Call submit function
    carForm.reset();

});

// Add Cars

// Car Table view
async function fetchCars() {
    try {
        const response = await fetch('http://localhost:5000/cars');
        if (!response.ok) {
            throw new Error('Failed to fetch car details');
        }
        const cars = await response.json();
        displayCarsInTable(cars);
    } catch (error) {
        console.error('Error fetching car Details: ', error);
    }

}


function displayCarsInTable(cars) {
    const tableBody = document.querySelector('#carTable tbody');
    tableBody.innerHTML = '';

    // loop the cars 
    cars.forEach((car, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${car.id}</td>
                    <td>${car.regNo}</td>
                    <td style="text-align: center;"><img src="${car.image}" alt="" style="width: 36px; height: 36px; border-radius: 10%; "></td>
                    <td>${car.brand}</td>
                    <td>${car.name}</td>
                    <td>${car.gearType}</td>
                    <td>${car.seatCount}</td>
                    <td>${car.fuelType}</td>
                    <td>${car.mileage}</td>
                    <td>${car.dayPrice}</td>
                    <td>${car.hourPrice}</td>
                    <td>
                        <button class="btn btn-outline-primary edit-btn" data-car-id="${car.id}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button> 
                        <button class="btn btn-outline-danger delete-btn" data-car-id="${car.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>

                    `;

        tableBody.appendChild(row);


    });

    // Add event listeners for Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            openCarEditModal(carId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const carId = event.target.closest('button').getAttribute('data-car-id');
            deleteCar(carId);
        });
    });

}

// Fnc to open edit modal for each car id

async function openCarEditModal(carId) {
    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`);
        if (!response.ok) throw new Error('Car Not Found');
        const car = await response.json();
        // Populate modal fields with the car data
        document.getElementById('editCarId').value = car.id;
        document.getElementById('editCarBrand').value = car.brand;
        document.getElementById('editCarName').value = car.name;
        document.getElementById('editCarRegNo').value = car.regNo;
        document.getElementById('editCarGearType').value = car.gearType;
        document.getElementById('editCarSeatCount').value = car.seatCount;
        document.getElementById('editCarFuelType').value = car.fuelType;
        document.getElementById('editCarMileage').value = car.mileage;
        document.getElementById('editCarDayPrice').value = car.dayPrice;
        document.getElementById('editCarHourPrice').value = car.hourPrice;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching car details for editing:', error);
        alert('Failed to load car details.');
    }

}


// Save changes to the car
document.getElementById('saveChangesBtn').addEventListener('click', async function () {
    const carId = document.getElementById('editCarId').value;
    const updatedCarData = {
        brand: document.getElementById('editCarBrand').value,
        name: document.getElementById('editCarName').value,
        regNo: document.getElementById('editCarRegNo').value,
        gearType: document.getElementById('editCarGearType').value,
        seatCount: document.getElementById('editCarSeatCount').value,
        fuelType: document.getElementById('editCarFuelType').value,
        mileage: document.getElementById('editCarMileage').value,
        dayPrice: document.getElementById('editCarDayPrice').value,
        hourPrice: document.getElementById('editCarHourPrice').value
    };

    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCarData)
        });
        if (!response.ok) throw new Error('Failed to save changes');

        // Close the modal after successful update
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCarModal'));
        modal.hide();

        // Refresh the car list to reflect changes
        fetchCars();
        alert('Car details updated successfully!');
    } catch (error) {
        console.error('Error saving car details:', error);
        alert('Failed to save changes.');
    }
});

async function deleteCar(carId) {
    try {
        const response = await fetch(`http://localhost:5000/cars/${carId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete car');
        }

        alert('Car deleted successfully');
        fetchCars(); // Refresh the car table
    } catch (error) {
        console.error('Error deleting car:', error);
        alert('There was an error deleting the car.');
    }
}



// Car Table view

document.addEventListener('DOMContentLoaded', () => {
    fetchCars();
})

