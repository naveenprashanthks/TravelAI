// Hotel data array - simulates fetched data from a backend
const hotelData = [
    {
        id: 1,
        name: "Sunset Beach Resort",
        location: "Bali",
        description: "Luxury beachfront resort with stunning ocean views and private villas.",
        price: 20750, // 250 USD * 83 = 20750 INR
        currency: "₹",
        rating: 4.8,
        reviews: 320,
        image: "images/hotel1.jpg",
        amenities: ["Pool", "Spa", "Free WiFi", "Restaurant", "Beach Access"]
    },
    {
        id: 2,
        name: "Mountain View Lodge",
        location: "Swiss Alps",
        description: "Cozy mountain retreat with panoramic views of the Alps and ski-in/ski-out access.",
        price: 14940, // 180 USD * 83 = 14940 INR
        currency: "₹",
        rating: 4.6,
        reviews: 215,
        image: "images/hotel2.jpg",
        amenities: ["Fireplace", "Sauna", "Free WiFi", "Restaurant", "Ski Storage"]
    },
    {
        id: 3,
        name: "City Center Suites",
        location: "New York",
        description: "Modern suites in the heart of Manhattan, walking distance to major attractions.",
        price: 26560, // 320 USD * 83 = 26560 INR
        currency: "₹",
        rating: 4.5,
        reviews: 412,
        image: "images/hotel3.jpg",
        amenities: ["Gym", "Room Service", "Free WiFi", "Business Center", "Rooftop Bar"]
    },
    {
        id: 4,
        name: "Desert Oasis Resort",
        location: "Dubai",
        description: "Luxury desert resort with private pools and stunning dune views.",
        price: 34860, // 420 USD * 83 = 34860 INR
        currency: "₹",
        rating: 4.9,
        reviews: 178,
        image: "images/hotel4.jpg",
        amenities: ["Private Pool", "Spa", "Free WiFi", "Restaurant", "Desert Tours"]
    },
    {
        id: 5,
        name: "Tropical Paradise Hotel",
        location: "Maldives",
        description: "Overwater bungalows with direct access to crystal clear waters and coral reefs.",
        price: 45650, // 550 USD * 83 = 45650 INR
        currency: "₹",
        rating: 4.9,
        reviews: 230,
        image: "images/hotel5.jpg",
        amenities: ["Overwater Bungalow", "Spa", "Free WiFi", "Restaurant", "Snorkeling"]
    },
    {
        id: 6,
        name: "Historic Grand Hotel",
        location: "Paris",
        description: "Elegant hotel in a historic building with views of the Eiffel Tower.",
        price: 23240, // 280 USD * 83 = 23240 INR
        currency: "₹",
        rating: 4.7,
        reviews: 345,
        image: "images/hotel6.jpg",
        amenities: ["Room Service", "Spa", "Free WiFi", "Restaurant", "Concierge"]
    },
    {
        id: 7,
        name: "Riverside Inn",
        location: "London",
        description: "Charming hotel on the banks of the Thames with traditional English décor.",
        price: 17430, // 210 USD * 83 = 17430 INR
        currency: "₹",
        rating: 4.4,
        reviews: 189,
        image: "images/hotel7.jpg",
        amenities: ["Bar", "Free Breakfast", "Free WiFi", "Restaurant", "River Views"]
    },
    {
        id: 8,
        name: "Cherry Blossom Resort",
        location: "Tokyo",
        description: "Modern resort with traditional Japanese elements and a peaceful garden.",
        price: 19920, // 240 USD * 83 = 19920 INR
        currency: "₹",
        rating: 4.6,
        reviews: 267,
        image: "images/hotel8.jpg",
        amenities: ["Hot Springs", "Garden", "Free WiFi", "Restaurant", "Tea Ceremony"]
    }
];

// DOM elements
const searchForm = document.getElementById('hotel-search-form');
const resultsContainer = document.getElementById('hotel-results');
const noResultsMessage = document.getElementById('no-results');
const loadingIndicator = document.getElementById('loader');

// Event listener for form submission
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    searchHotels();
});

// Function to search/filter hotels
function searchHotels() {
    // Show loading indicator
    showLoading(true);
    
    // Get form values
    const destination = document.getElementById('location').value.toLowerCase();
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = parseInt(document.getElementById('guests').value);
    
    // Simulate API delay
    setTimeout(() => {
        // Filter hotels based on search criteria
        const filteredHotels = hotelData.filter(hotel => {
            // Filter by destination (if provided)
            if (destination && !hotel.location.toLowerCase().includes(destination)) {
                return false;
            }
            
            // Additional filters could be added here (e.g., price range, availability for dates, etc.)
            
            return true;
        });
        
        // Display results
        displayHotels(filteredHotels);
        showLoading(false);
    }, 1000); // Simulate 1 second delay for API call
}

// Function to display hotel results
function displayHotels(hotels) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (hotels.length === 0) {
        // Show no results message
        noResultsMessage.style.display = 'block';
    } else {
        // Hide no results message
        noResultsMessage.style.display = 'none';
        
        // Create and append hotel cards
        hotels.forEach(hotel => {
            const hotelCard = createHotelCard(hotel);
            resultsContainer.appendChild(hotelCard);
        });
    }
}

// Function to create a hotel card element
function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    
    // Generate HTML for rating stars
    let starsHTML = '';
    const fullStars = Math.floor(hotel.rating);
    const hasHalfStar = hotel.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    // Generate HTML for amenities
    const amenitiesHTML = hotel.amenities.map(amenity => 
        `<span class="amenity"><i class="fas fa-check"></i> ${amenity}</span>`
    ).join('');
    
    // Populate the card with hotel data
    card.innerHTML = `
        <div class="hotel-image">
            <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='images/hotel-placeholder.jpg'">
        </div>
        <div class="hotel-details">
            <h3 class="hotel-name">${hotel.name}</h3>
            <p class="hotel-location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
            <div class="hotel-rating">
                ${starsHTML}
                <span class="rating-number">${hotel.rating}</span>
                <span class="reviews">(${hotel.reviews} reviews)</span>
            </div>
            <p class="hotel-description">${hotel.description}</p>
            <div class="amenities-container">
                ${amenitiesHTML}
            </div>
        </div>
        <div class="hotel-price-container">
            <p class="hotel-price">${hotel.currency}${hotel.price.toLocaleString('en-IN')}<span class="per-night">/night</span></p>
            <button class="book-now-btn">Book Now</button>
            <button class="view-details-btn">View Details</button>
        </div>
    `;
    
    // Add event listeners for buttons
    const bookButton = card.querySelector('.book-now-btn');
    bookButton.addEventListener('click', () => {
        bookHotel(hotel);
    });
    
    const detailsButton = card.querySelector('.view-details-btn');
    detailsButton.addEventListener('click', () => {
        viewHotelDetails(hotel);
    });
    
    return card;
}

// Function to handle booking a hotel
function bookHotel(hotel) {
    alert(`Booking ${hotel.name} in ${hotel.location}.\nThis would redirect to a booking form in a real application.`);
}

// Function to view hotel details
function viewHotelDetails(hotel) {
    alert(`Viewing details for ${hotel.name}.\nThis would show a detailed page or modal in a real application.`);
}

// Function to show/hide loading indicator
function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.style.display = 'block';
        resultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'none';
    } else {
        loadingIndicator.style.display = 'none';
        resultsContainer.style.display = 'flex';
    }
}

// Load all hotels on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display all hotels initially
    displayHotels(hotelData);
    
    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in').min = today;
    
    // Set minimum date for check-out to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('check-out').min = tomorrow.toISOString().split('T')[0];
    
    // Update check-out min date when check-in changes
    document.getElementById('check-in').addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById('check-out').min = nextDay.toISOString().split('T')[0];
        
        // If current check-out date is before new check-in date, update it
        const checkOutInput = document.getElementById('check-out');
        const checkOutDate = new Date(checkOutInput.value);
        if (checkOutDate <= checkInDate) {
            checkOutInput.value = nextDay.toISOString().split('T')[0];
        }
    });
});

