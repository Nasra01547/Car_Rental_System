// // Car card view
// async function fetchCars() {
//     try {
//         const response = await fetch('http://localhost:5000/cars');
//         if (!response.ok) {
//             throw new Error('Failed to fetch car details');
//         }
//         const cars = await response.json();
//         displayCarsInCard(cars);
//     } catch (error) {
//         console.error('Error fetching car Details: ', error);
//     }

// }

async function fetchAndDisplayCars() {
    try {
        const response = await fetch('http://localhost:5000/cars');
        if (!response.ok) throw new Error('Failed to fetch car details');

        const cars = await response.json();
        const showCarCard = document.getElementById('showCarCard');
        showCarCard.innerHTML = ''; // Clear existing cards

        // Loop through each car and create the card HTML
        cars.forEach(car => {
            // Create card HTML
            const cardHTML = `
                <div class="col">
                    <div class="card car-card">
                    <div class="col-12">
                        <img src="${car.image}" class="card-img-top" alt="${car.name}">
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">${car.name}</h5>
                                <span class="dashed-border">${car.year}</span>
                            </div>
                            <div class="container mt-4">
                                <div class="row text-center car-info-section">
                                    <div class="col-6 d-flex justify-content-start align-items-center">
                                        <i class="fas fa-user car-info-icon"></i>
                                        <span>${car.seatCount} People</span>
                                    </div>
                                    <div class="col-6 d-flex justify-content-start align-items-center">
                                        <i class="fas fa-gas-pump"></i>
                                        <span>${car.fuelType}</span>
                                    </div>
                                </div>
                                <div class="row text-center car-info-section mt-2">
                                    <div class="col-6 d-flex justify-content-start align-items-center">
                                        <i class="fas fa-tachometer-alt car-info-icon"></i>
                                        <span>${car.mileage} km/l</span>
                                    </div>
                                    <div class="col-6 d-flex justify-content-start align-items-center">
                                        <i class="fas fa-cogs"></i>
                                        <span>${car.gearType}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <h6>Rs.${car.dayPrice} / Day</h6>
                                <h6>Rs.${car.hourPrice} / hour</h6>
                                <div>
                                    <button class="btn btn-light rounded-circle border me-2">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                    <button class="btn btn-primary">Rent now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append the card HTML to the container
            showCarCard.innerHTML += cardHTML; // Append card HTML
        });
    } catch (error) {
        console.error('Error fetching car details:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayCars);
