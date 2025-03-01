/**
* Travel Website Animations - Clouds and Cars
* 
* This file implements animated clouds and cars for travel websites
* using GSAP (GreenSock Animation Platform) for smooth animations.
* 
* INTEGRATION INSTRUCTIONS:
* 
* 1. Include the GSAP library in your HTML:
*    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
* 
* 2. Include this script after GSAP:
*    <script src="travel-animations.js"></script>
* 
* 3. Add HTML elements with the following classes:
*    - For clouds: <div class="animated-cloud"></div>
*    - For cars: <div class="animated-car"></div>
* 
* 4. Call the initialization functions in your main script:
*    document.addEventListener('DOMContentLoaded', function() {
*        initClouds();
*        initCars();
*    });
* 
* 5. Customize the animations by modifying the configuration
*    objects at the top of each function.
*/

/**
* Cloud Animation
* Creates floating clouds that move across the screen with varying speeds and opacities.
*/
function initClouds() {
    // Configuration for cloud animations
    const cloudConfig = {
        count: 5,                   // Number of clouds to create
        minDuration: 30,            // Minimum animation duration in seconds
        maxDuration: 60,            // Maximum animation duration in seconds
        minScale: 0.5,              // Minimum cloud size
        maxScale: 1.5,              // Maximum cloud size
        minOpacity: 0.4,            // Minimum opacity
        maxOpacity: 0.8,            // Maximum opacity
        parent: 'body',             // Where to append the clouds (selector)
        zIndex: 0,                  // z-index base value
        images: [                   // Cloud image URLs
            'https://assets.codepen.io/3364143/cloud1.png',
            'https://assets.codepen.io/3364143/cloud2.png',
            'https://assets.codepen.io/3364143/cloud3.png'
        ]
    };
    
    // Create cloud container if it doesn't exist
    let cloudContainer = document.querySelector('.cloud-container');
    if (!cloudContainer) {
        cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-container';
        cloudContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: ${cloudConfig.zIndex};
        `;
        document.querySelector(cloudConfig.parent).appendChild(cloudContainer);
    }
    
    // Create and animate each cloud
    for (let i = 0; i < cloudConfig.count; i++) {
        createCloud(cloudContainer, cloudConfig);
    }
}

/**
* Helper function to create a single cloud element and animate it
*/
function createCloud(container, config) {
    // Create cloud element
    const cloud = document.createElement('div');
    cloud.className = 'animated-cloud';
    
    // Random cloud properties
    const imageIndex = Math.floor(Math.random() * config.images.length);
    const scale = config.minScale + Math.random() * (config.maxScale - config.minScale);
    const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
    const startY = Math.random() * 60; // Random start position (0-60% from top)
    
    // Set cloud styles
    cloud.style.cssText = `
        position: absolute;
        background-image: url(${config.images[imageIndex]});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: ${opacity};
        width: 300px;
        height: 200px;
        z-index: ${config.zIndex + Math.round(startY/10)};
        top: ${startY}%;
        transform: scale(${scale});
        left: -300px;
    `;
    
    container.appendChild(cloud);
    
    // Animate the cloud using GSAP
    gsap.to(cloud, {
        x: window.innerWidth + 300, // Move beyond the right edge
        duration: duration,
        ease: "none",
        onComplete: function() {
            cloud.remove();
            // Create a new cloud when this one completes
            createCloud(container, config);
        }
    });
}

/**
* Car Animation
* Creates cars that drive along a path across the screen.
*/
function initCars() {
    // Configuration for car animations
    const carConfig = {
        count: 2,                    // Number of cars to create
        minDuration: 15,             // Minimum animation duration in seconds
        maxDuration: 30,             // Maximum animation duration in seconds
        minScale: 0.6,               // Minimum car size
        maxScale: 1.2,               // Maximum car size
        parent: 'body',              // Where to append the cars (selector)
        zIndex: 5,                   // z-index base value
        roadOffset: '85%',           // Position from the top where the "road" is
        images: [                    // Car image URLs
            'https://assets.codepen.io/3364143/red-car.png',
            'https://assets.codepen.io/3364143/blue-car.png'
        ],
        // If you don't have actual images, replace the URLs above and implement
        // the createCarElement function below to use SVG or CSS-based cars
    };
    
    // Create car container if it doesn't exist
    let carContainer = document.querySelector('.car-container');
    if (!carContainer) {
        carContainer = document.createElement('div');
        carContainer.className = 'car-container';
        carContainer.style.cssText = `
            position: fixed;
            left: 0;
            width: 100%;
            height: 100px;
            pointer-events: none;
            overflow: hidden;
            z-index: ${carConfig.zIndex};
            top: ${carConfig.roadOffset};
            transform: translateY(-50%);
        `;
        document.querySelector(carConfig.parent).appendChild(carContainer);
    }
    
    // Create and animate each car
    for (let i = 0; i < carConfig.count; i++) {
        // Stagger the starting positions of cars
        setTimeout(() => {
            createCar(carContainer, carConfig);
        }, i * 5000); // Start cars with 5 second gaps
    }
}

/**
* Helper function to create a single car element and animate it
*/
function createCar(container, config) {
    // Create car element
    const car = document.createElement('div');
    car.className = 'animated-car';
    
    // Random car properties
    const imageIndex = Math.floor(Math.random() * config.images.length);
    const scale = config.minScale + Math.random() * (config.maxScale - config.minScale);
    const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
    const direction = Math.random() > 0.5 ? 1 : -1; // Random direction (left to right or right to left)
    
    // Set car styles
    car.style.cssText = `
        position: absolute;
        background-image: url(${config.images[imageIndex]});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 200px;
        height: 80px;
        bottom: 0;
        transform: scale(${scale}) ${direction === -1 ? 'scaleX(-1)' : ''};
        ${direction === 1 ? 'left: -200px;' : 'right: -200px;'}
    `;
    
    container.appendChild(car);
    
    // Create a more realistic movement with slight up and down bounce
    const timeline = gsap.timeline({
        onComplete: function() {
            car.remove();
            // Create a new car when this one completes
            createCar(container, config);
        }
    });
    
    // Animate the car horizontally
    timeline.to(car, {
        x: direction === 1 ? window.innerWidth + 200 : -window.innerWidth - 200,
        duration: duration,
        ease: "power1.inOut"
    });
    
    // Add a subtle bounce effect
    gsap.to(car, {
        y: -5,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

/**
* Alternative car element creation using SVG (uncomment and modify if you don't have car images)
*/
/*
function createCarElement() {
    const car = document.createElement('div');
    car.className = 'animated-car';
    
    // Simple car SVG
    car.innerHTML = `
        <svg width="200" height="80" viewBox="0 0 200 80">
            <rect x="30" y="40" width="140" height="25" rx="5" fill="#e74c3c" />
            <rect x="40" y="25" width="110" height="20" rx="5" fill="#e74c3c" />
            <circle cx="55" cy="65" r="12" fill="#333" />
            <circle cx="145" cy="65" r="12" fill="#333" />
        </svg>
    `;
    
    return car;
}
*/

/**
* Utility function to help with responsive animations
* Call this function when the window is resized
*/
function resizeAnimations() {
    // Refresh animations on window resize
    const clouds = document.querySelectorAll('.animated-cloud');
    const cars = document.querySelectorAll('.animated-car');
    
    // Kill and restart animations if needed
    clouds.forEach(cloud => {
        gsap.killTweensOf(cloud);
        cloud.remove();
    });
    
    cars.forEach(car => {
        gsap.killTweensOf(car);
        car.remove();
    });
    
    // Reinitialize animations
    initClouds();
    initCars();
}

/**
* Initialize animations when the document is loaded
*/
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP library is required for animations. Please include it in your HTML.');
        return;
    }
    
    // Initialize animations
    initClouds();
    initCars();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeAnimations, 250);
    });
});

