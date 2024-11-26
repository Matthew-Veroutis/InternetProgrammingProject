// this adds an event listener so when the document loads this updates the hours based on the hours json file
document.addEventListener('DOMContentLoaded', function() {
    //this fethces the json file data
    fetch("hours.json")
        // converts the response to json to ensure that it is json
        .then(response => response.json())
        //then with the data you do the follwing
        .then(data => {
            //gets the ul elemnt by the id hoursList
            const hoursList = document.getElementById("hoursList");
            //empties the inner hmtl so we can add the new hours
            hoursList.innerHTML = '';
            //for each item in the hours do the following
            data.hours.forEach(item => {
                //creates a new list item
                const li = document.createElement('li');
                // if the item is the small not on the botton it fomats it diffrently
                if (item.note) {
                    li.textContent = item.note;
                    li.style.textAlign = 'center'; 
                    li.style.fontStyle = 'italic'; 
                } else {
                    // creaate two divs to put the day and the hours 
                    const dayElement = document.createElement('div');
                    const timeElement = document.createElement('div');
                    
                    dayElement.textContent = item.day;
                    timeElement.textContent = item.hours;
                    
                    //makes day go to left and time go to the right of the div 
                    dayElement.style.cssFloat = 'left';
                    timeElement.style.cssFloat = 'right';
                    
                    // adds the two elents the the li item
                    li.appendChild(dayElement);
                    li.appendChild(timeElement);
                    
                    // puts space in between each li item
                    const clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    li.appendChild(clearDiv);
                }

                
                //apends the li item to the hourslist ul 
                hoursList.appendChild(li);
            });
        })
});

//when the document is loaded get the weather from teh api 
document.addEventListener('DOMContentLoaded', () => {
    // the link of the weather api
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Pointe-Claire&appid=0e92e3d5382b25a3fd5bcf8a7be07e7e&units=metric`;

    // Create the XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // open it in asycronou mode and it uses GET and the weather url
    xhr.open("GET", weatherUrl, true);

    // when xhr loads do the following
    xhr.onload = () => {
        //if the status is good(200) do the following
        if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);

            // get the weather information and puts it into constants
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;

            // the display string which has the current tempeartur in pointe clare where the resturnat is
            const weatherInfo = `Current Weather in Pointe-Claire is ${temperature}°C`;

            // the venu status
            let venueStatus = "";

            // if statements determines the venue status based on temperature
            if (temperature < 20) {
                //the venu is closed
                venueStatus = "The outdoor venue is unfortunatly closed due to cold weather.";
            } else {
                // the venu is opened
                venueStatus = "The outdoor venue is open today due to the beautiful weather.";
            }

            // get the weather section
            const weatherSection = document.querySelector('.weather');

            //creates a paragraph element which will have have the weather info 
            const weatherElement = document.createElement('p');
            weatherElement.textContent = weatherInfo;
            weatherSection.appendChild(weatherElement);

            //creates another paragraph element which will have have the venu status
            const venueStatusElement = document.createElement('p');
            venueStatusElement.textContent = venueStatus;
            weatherSection.appendChild(venueStatusElement);
        }
    };

    // sends the request so it works
    xhr.send();
});

//allows the form to toggle so the elemments so you can disable the text areas so you cant input anything
function toggleForm(disabled) {
    document.querySelectorAll('.order-form input, .order-form textarea, .place-order').forEach(element => {
        element.disabled = disabled;
    });
}

//when the place order button is clicked do this
document.querySelector('.place-order').addEventListener('click', function () {
    //gets the value from all of the boxes
    const customerName = document.querySelector('.customer-name').value;
    const phoneNumber = document.querySelector('.phone-number').value;
    const address = document.querySelector('.address').value;
    const foodDetails = document.querySelector('.food-details').value;
    const quantity = document.querySelector('.quantity').value;

    //if a feild is empty warn the user 
    if (!customerName || !phoneNumber || !address || !foodDetails || !quantity) {
        alert('Please fill in all fields before placing the order.');
        return;
    }

    //if the quantity is not a number or less than 0 or more than 100 it warns the user that the input is invalid 
    if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
        alert('Quantity must be a valid positive number and order must be 100 or less quantity.');
        return;
    }

    //gets the current tiem and calculates the delivery time based on 30 mins from now 
    const currentTime = new Date();
    const deliveryTime = new Date(currentTime.getTime() + 30 * 60000);
    const formattedTime = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // this puts the infromation onto the order summary form 
    document.querySelector('.order-summary-details').value = `Name: ${customerName}\nPhone: ${phoneNumber}\nAddress: ${address}\nQuantity: ${quantity}`;
    document.querySelector('.summary-food-details').value = foodDetails;
    document.querySelector('.delivery-time').value = formattedTime;

    //saves the order data onto a cookie so it saves the data so even when it reloads the data is maintained
    const orderData = `${customerName}|${phoneNumber}|${address}|${foodDetails}|${quantity}|${formattedTime}`;
    document.cookie = `orderDetails=${orderData}`;

    // it clears the from and makes the order from disabled since you already have a pending order
    clearForm();
    toggleForm(true);

    //alert the user that the order was successfully placed 
    alert('Order placed successfully!');
});

//clears the order details form 
function clearForm() {
    document.querySelectorAll('.order-details input, .order-details textarea').forEach(element => {
        element.value = '';
    });
}

// when the confirmed recived button was clicked 
document.querySelector('.confirm-received').addEventListener('click', function () {
    // clears all the infromation on the order summary form
    document.querySelector('.order-summary-details').value = '';
    document.querySelector('.summary-food-details').value = '';
    document.querySelector('.delivery-time').value = '';

    //it also gets rid of the cookie so when you reload it it dose not place the previous recived order
    document.cookie = "orderDetails=OrderRecivedStatus";

    // enables the order from so you can submit another prder
    toggleForm(false);

    //allerts the user that the order was confrimed as recived and thanks them 
    alert('Order confirmed as received. Thank you!');
});

//when the window loads put the cookie on the summary form 
window.onload = function () {

    // makes gets the cooke as a astring and cuts at white space at the end and begining
    const orderCookie = document.cookie.trim();


    //if the order cookie exists and the cookie starts with "orderDetails=" do the follwoing 
    if (orderCookie.startsWith("orderDetails=")) {
        // first splits the the data based on "=" into and array and then is olny takes whats to the right of the equals and splits it base on "|"
        //and assigns that value to the order dedails as an array
        const orderDetails = orderCookie.split('=')[1].split('|');
        
        //if the order is recived it dose not put any data on the summary form and returns 
        if (orderDetails[0] == "OrderRecivedStatus") {
            return;
        }

        // puts the values back to the summary form
        document.querySelector('.order-summary-details').value = `Name: ${orderDetails[0]}\nPhone: ${orderDetails[1]}\nAddress: ${orderDetails[2]}\nQuantity: ${orderDetails[4]}`;
        document.querySelector('.summary-food-details').value = orderDetails[3];
        document.querySelector('.delivery-time').value = orderDetails[5];
        
        //disables the order form since your already have a pedning order
        toggleForm(true);
    }
};


// when you click on the image it puts the name and price on the order form 
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

