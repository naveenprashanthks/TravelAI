document.addEventListener('DOMContentLoaded', function() {
    const travelForm = document.getElementById('travel-form');
    const loadingIndicator = document.getElementById('loading');
    const travelPlanContainer = document.getElementById('travel-plan');
    const destinationInput = document.getElementById('destination');
    
    // Function to update hotel booking link with destination and accommodations
    function updateHotelLink(destination, accommodations = []) {
        const hotelLinks = document.querySelectorAll('a[href*="book-hotels.html"]');
        const accommodationsParam = accommodations.length > 0 ? 
            `&accommodations=${encodeURIComponent(JSON.stringify(accommodations))}` : '';
        
        hotelLinks.forEach(link => {
            link.href = `book-hotels.html?destination=${encodeURIComponent(destination)}${accommodationsParam}`;
        });
    }
    
    // Add event listener to destination input to update hotel link
    // We'll update the hotel link when the plan is displayed instead
    // (removing this event listener as we now want to include accommodation data)

    // Function to create tiny car loader animation
    function createTinyCarLoader() {
        // Clear any existing content
        loadingIndicator.innerHTML = '';
        
        // Create road
        const road = document.createElement('div');
        road.className = 'loader-road';
        road.style.cssText = `
            position: relative;
            width: 100%;
            height: 3px;
            background-color: #ddd;
            margin: 20px auto;
        `;
        
        // Create car
        const car = document.createElement('div');
        car.className = 'loader-car';
        car.style.cssText = `
            position: absolute;
            width: 30px;
            height: 15px;
            left: 0;
            bottom: 8px;
            background-color: #FF6B35;
            border-radius: 3px;
        `;
        
        // Create car windows
        const carWindows = document.createElement('div');
        carWindows.style.cssText = `
            position: absolute;
            width: 12px;
            height: 8px;
            background-color: #2c3e50;
            left: 5px;
            top: 2px;
            border-radius: 2px;
        `;
        
        // Create wheels
        const wheelFront = document.createElement('div');
        wheelFront.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #333;
            border-radius: 50%;
            bottom: -3px;
            left: 5px;
        `;
        
        const wheelBack = document.createElement('div');
        wheelBack.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #333;
            border-radius: 50%;
            bottom: -3px;
            left: 20px;
        `;
        
        // Assemble car
        car.appendChild(carWindows);
        car.appendChild(wheelFront);
        car.appendChild(wheelBack);
        
        // Assemble loader
        road.appendChild(car);
        loadingIndicator.appendChild(road);
        
        // Start animation
        return animateTinyCar(car);
    }

    // Function to animate the car from right to left
    function animateTinyCar(car) {
        let animationId;
        const startTime = performance.now();
        const duration = 3000; // 3 seconds for one full journey
        
        function step(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;
            
            // Move car from left to right
            car.style.left = `${progress * 110 - 10}%`;
            
            animationId = requestAnimationFrame(step);
        }
        
        animationId = requestAnimationFrame(step);
        
        // Return function to stop animation
        return function stopAnimation() {
            cancelAnimationFrame(animationId);
        };
    }

    travelForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const destination = document.getElementById('destination').value;
        const duration = document.getElementById('duration').value;
        const travelers = document.getElementById('travelers').value;
        
        // Validate inputs
        if (!destination || !duration || !travelers) {
            alert('Please fill in all fields');
            return;
        }
        
        // Show loading indicator with tiny car animation
        loadingIndicator.style.display = 'block';
        if (travelPlanContainer) travelPlanContainer.style.display = 'none';
        const stopAnimation = createTinyCarLoader();
        
        try {
            const travelPlan = await fetchTravelPlan(destination, duration, travelers);
            displayTravelPlan(travelPlan, destination, duration, travelers);
        } catch (error) {
            console.error('Failed to fetch travel plan:', error);
            // Check if error is related to API key
            if (error.message.includes("API key")) {
                alert('API key error: ' + error.message);
            } else {
                alert('Failed to fetch travel plan. Please try again later.');
            }
        } finally {
            // Stop animation and hide loading indicator
            stopAnimation && stopAnimation();
            loadingIndicator.style.display = 'none';
            if (travelPlanContainer) travelPlanContainer.style.display = 'block';
        }
    });
    
    async function fetchTravelPlan(destination, duration, travelers) {
        // IMPORTANT: You need a valid Google Gemini API key for this application to work
        // 1. Go to https://makersuite.google.com/app/apikey to create an API key
        // 2. Sign in with your Google account if prompted
        // 3. Create a new API key if you don't have one already
        // 4. Copy your API key and paste it below between the quotes
        const API_KEY = "AIzaSyCxQAHeZS8MByh9ixIsJn9V9pyooO4c4Q8"; // Replace this with your actual API key
        
        // For security in production, consider:
        // - Using environment variables
        // - Storing the key in Firebase and retrieving it securely
        // - Using a backend proxy to make API calls instead of exposing your key in client-side code
        
        // Validate API key
        if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
            console.error("Invalid API key. Please replace with your own Gemini API key.");
            throw new Error("Invalid API key. Please update the API_KEY in the plan-travel.js file.");
        }
        // Ensure we're using the correct endpoint for gemini-1.5-pro
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

        console.log("Sending request to Gemini API...");

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Create a detailed low cost affordable travel plan for ${travelers} traveler(s) going to ${destination} for ${duration} days. 
                            Include the following sections:
                            - A brief summary of the trip
                            - 2-3 recommended accommodations with price ranges in Indian Rupees (₹)
                            - A day-by-day itinerary with 3-5 activities per day
                            - An estimated budget breakdown in Indian Rupees (₹)
                            - 3-5 travel tips specific to the destination
                            
                            Format your response as valid JSON with the following structure:
                            {
                                "summary": "Brief overview of the trip",
                                "accommodations": [{"name": "Hotel Name", "price": "Price range"}],
                                "itinerary": [{"day": 1, "activities": ["Activity 1", "Activity 2"]}],
                                "budget": "Budget breakdown text",
                                "tips": ["Tip 1", "Tip 2"]
                            }`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192
                    }
                })
            });

            console.log("API response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API response error:", errorText);
                
                // Check for common API key errors
                if (response.status === 400 || response.status === 401 || response.status === 403) {
                    throw new Error(`API key error: Please check that you're using a valid Gemini API key (status ${response.status})`);
                }
                
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("API response data:", data);

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error("Unexpected API response structure:", data);
                throw new Error('Invalid response structure from API');
            }

            // Extract the text content from the response
            let responseText = '';
            
            // Handle potential differences in response structure
            if (data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                responseText = data.candidates[0].content.parts[0].text || '';
            } else if (data.candidates[0].content.text) {
                responseText = data.candidates[0].content.text;
            }
            
            console.log("API response text:", responseText);
            
            if (!responseText.trim()) {
                throw new Error('Empty response from API');
            }

            try {
                // Try to parse as JSON
                return JSON.parse(responseText);
            } catch (error) {
                console.log("Response is not valid JSON, attempting to extract JSON from text");
                
                // Try to find JSON within the text (sometimes the model wraps JSON in markdown code blocks)
                const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                                    responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                                    responseText.match(/{[\s\S]*}/);
                
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
                    } catch (e) {
                        console.error("Failed to parse extracted JSON:", e);
                    }
                }
                
                // If we can't parse JSON, create a structured object from the text
                console.log("Falling back to text-based response");
                return {
                    summary: responseText,
                    accommodations: [{ name: "See full text for details", price: "" }],
                    itinerary: [{ day: 1, activities: ["See full text for details"] }],
                    budget: "See full text for details",
                    tips: ["See full text for details"]
                };
            }
        } catch (error) {
            console.error("Error in fetchTravelPlan:", error);
            throw error;
        }
    }

    function displayTravelPlan(travelPlan, destination, duration, travelers) {
        console.log("Displaying travel plan:", travelPlan);
        
        // Update hotel booking link with the selected destination and accommodations
        updateHotelLink(destination, travelPlan.accommodations || []);
        
        try {
            // Handle accommodations with defensive coding
            let accommodationsHTML = '<p>No accommodation information available</p>';
            if (travelPlan.accommodations && Array.isArray(travelPlan.accommodations)) {
                accommodationsHTML = `<ul>${travelPlan.accommodations.map(acc => 
                    `<li>${acc.name || 'Unnamed accommodation'}${acc.price ? ' - ' + acc.price : ''}</li>`
                ).join('')}</ul>`;
            }
            
            // Handle itinerary with defensive coding
            let itineraryHTML = '<p>No itinerary information available</p>';
            if (travelPlan.itinerary && Array.isArray(travelPlan.itinerary)) {
                itineraryHTML = travelPlan.itinerary.map((day, index) => {
                    const dayNumber = day.day || (index + 1);
                    const activities = day.activities && Array.isArray(day.activities) 
                        ? day.activities.map(activity => `<li>${activity}</li>`).join('') 
                        : '<li>No activities specified</li>';
                    
                    return `
                        <div class="day-plan">
                            <h4>Day ${dayNumber}</h4>
                            <ul>${activities}</ul>
                        </div>
                    `;
                }).join('');
            }
            
            // Handle tips with defensive coding
            let tipsHTML = '<p>No travel tips available</p>';
            if (travelPlan.tips && Array.isArray(travelPlan.tips)) {
                tipsHTML = `<ul>${travelPlan.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
            }
            
            travelPlanContainer.innerHTML = `
                <h2>Your ${duration}-Day Trip to ${destination} for ${travelers} ${travelers > 1 ? 'People' : 'Person'}</h2>
                <div class="summary"><p>${travelPlan.summary || 'No summary available'}</p></div>
                <h3>Recommended Accommodations</h3>
                ${accommodationsHTML}
                <h3>Day-by-Day Itinerary</h3>
                ${itineraryHTML}
                <h3>Estimated Budget</h3>
                <p>${travelPlan.budget || 'No budget information available'}</p>
                <h3>Travel Tips</h3>
                ${tipsHTML}
                
                <div class="book-hotels-container" style="margin-top: 20px; text-align: center;">
                    <a href="book-hotels.html" class="btn btn-primary">Book Hotels</a>
                </div>
            `;
        } catch (error) {
            console.error("Error displaying travel plan:", error);
            travelPlanContainer.innerHTML = `
                <h2>Your ${duration}-Day Trip to ${destination}</h2>
                <div class="error-message">
                    <p>There was an error displaying your travel plan. Please try again.</p>
                    <details>
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
        }
    }
    }
);