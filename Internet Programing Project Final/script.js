document.addEventListener('DOMContentLoaded', function() {
    fetch("hours.json")
        .then(response => response.json())
        .then(data => {
            const hoursList = document.getElementById("hoursList");
            hoursList.innerHTML = '';
            data.hours.forEach(item => {
                const li = document.createElement('li');
                if (item.note) {
                    li.textContent = item.note;
                    li.style.textAlign = 'center'; 
                    li.style.fontStyle = 'italic'; 
                } else {
                    const dayElement = document.createElement('div');
                    const timeElement = document.createElement('div');
                    
                    dayElement.textContent = item.day;
                    timeElement.textContent = item.hours;
                    
                    // Apply float to day and time
                    dayElement.style.cssFloat = 'left';
                    timeElement.style.cssFloat = 'right';
                    
                    
                    li.appendChild(dayElement);
                    li.appendChild(timeElement);
                    
                    // Clear the float after each list item
                    const clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    li.appendChild(clearDiv);
                }

                

                hoursList.appendChild(li);
            });
        })
});


document.addEventListener('DOMContentLoaded', () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Pointe-Claire&appid=0e92e3d5382b25a3fd5bcf8a7be07e7e&units=metric`;

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Configure it: GET-request for the weather API URL
    xhr.open("GET", weatherUrl, true);

    // Define the onload function
    xhr.onload = () => {
        if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);

            // Extract weather information
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;

            // Create a display string
            const weatherInfo = `Current Weather in Pointe-Claire is ${temperature}°C`;

            let venueStatus = "";

            // Use if statements to determine the venue status based on temperature
            if (temperature < 20) {
                venueStatus = "The outdoor venue is unfortunatly closed due to cold weather.";
            } else {
                venueStatus = "The outdoor venue is open today due to the beautiful weather.";
            }

            // Append weather info to the MapAndHours section
            const weatherSection = document.querySelector('.weather');

            const weatherElement = document.createElement('p');
            weatherElement.textContent = weatherInfo;
            weatherSection.appendChild(weatherElement);

            const venueStatusElement = document.createElement('p');
            venueStatusElement.textContent = venueStatus;
            weatherSection.appendChild(venueStatusElement);
        }
    };

    // Send the request
    xhr.send();
});

function toggleForm(disabled) {
    document.querySelectorAll('.order-form input, .order-form textarea, .place-order').forEach(element => {
        element.disabled = disabled;
    });
}

document.querySelector('.place-order').addEventListener('click', function () {
    const customerName = document.querySelector('.customer-name').value;
    const phoneNumber = document.querySelector('.phone-number').value;
    const address = document.querySelector('.address').value;
    const foodDetails = document.querySelector('.food-details').value;
    const quantity = document.querySelector('.quantity').value;

    if (!customerName || !phoneNumber || !address || !foodDetails || !quantity) {
        alert('Please fill in all fields before placing the order.');
        return;
    }

    if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
        alert('Quantity must be a valid positive number and order must be 100 or less quantity.');
        return;
    }

    const currentTime = new Date();
    const deliveryTime = new Date(currentTime.getTime() + 30 * 60000);
    const formattedTime = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Fill order summary
    document.querySelector('.order-summary-details').value = `Name: ${customerName}\nPhone: ${phoneNumber}\nAddress: ${address}\nQuantity: ${quantity}`;
    document.querySelector('.summary-food-details').value = foodDetails;
    document.querySelector('.delivery-time').value = formattedTime;

    const orderData = `${customerName}|${phoneNumber}|${address}|${foodDetails}|${quantity}|${formattedTime}`;
    document.cookie = `orderDetails=${orderData}`;

    // Clear order form and disable it
    clearForm();
    toggleForm(true);

    alert('Order placed successfully!');
});

function clearForm() {
    document.querySelectorAll('.order-details input, .order-details textarea').forEach(element => {
        element.value = '';
    });
}

// Handle "Confirm Received" button click
document.querySelector('.confirm-received').addEventListener('click', function () {
    // Clear the order summary
    document.querySelector('.order-summary-details').value = '';
    document.querySelector('.summary-food-details').value = '';
    document.querySelector('.delivery-time').value = '';

    document.cookie = "orderDetails=OrderRecivedStatus";

    // Enable form
    toggleForm(false);

    alert('Order confirmed as received. Thank you!');
});

window.onload = function () {
    const cookies = document.cookie.split(';');
    const orderCookie = cookies.find(cookie => cookie.trim().startsWith('orderDetails='));

    if (orderCookie) {
        const orderDetails = orderCookie.split('=')[1].split('|');
        
        if (orderDetails[0] == "OrderRecivedStatus") {
            return;
        }
        // Assign the values back to the form
        document.querySelector('.order-summary-details').value = `Name: ${orderDetails[0]}\nPhone: ${orderDetails[1]}\nAddress: ${orderDetails[2]}\nQuantity: ${orderDetails[4]}`;
        document.querySelector('.summary-food-details').value = orderDetails[3];
        document.querySelector('.delivery-time').value = orderDetails[5];
        
        toggleForm(true);
    }
};

document.getElementById('filet-mignon').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Filet Mignon - $40';
});

document.getElementById('lobster-tails').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Lobster Tails - $50';
});

document.getElementById('lamb-chops').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Lamb Chops - $35';
});

document.getElementById('cheese-burger').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Cheese Burger - $25';
});

document.getElementById('salmon').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Salmon - $28';
});

document.getElementById('duck-legs').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Duck Legs - $32';
});

document.getElementById('spaghetti').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Spaghetti - $24';
});

document.getElementById('salad').addEventListener('click', function () {
    document.querySelector('.food-details').value = 'Salad - $22';
});

