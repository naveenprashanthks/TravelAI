// Background Animation with Three.js for Travel Website

// Global variables
let scene, camera, renderer;
let globe;
let animationFrame;
let container;
let starsTexture;
// Initialize the 3D scene
function initBackgroundAnimation(containerID) {
    // Get container
    container = document.getElementById(containerID);
    if (!container) {
        console.error('Container element not found with ID:', containerID);
        return;
    }
    
    // Set container style
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.opacity = '1';
    container.style.pointerEvents = 'none';
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Create globe
    createGlobe();

    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}


// Create the globe
function createGlobe() {
    // Create basic Earth sphere
    const earthGeometry = new THREE.SphereGeometry(50, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a66ff, // Ocean blue
        specular: new THREE.Color(0x333333),
        shininess: 5
    });
    
    globe = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(globe);
    
    // Add simple continents
    addContinents();
    
    // Position the globe
    globe.position.set(0, 0, 0);
    
    // Tilt the globe slightly like Earth's axis
    globe.rotation.x = Math.PI * 0.1;
}

// Add simple continent shapes to the globe
function addContinents() {
    const continentMaterial = new THREE.MeshPhongMaterial({
        color: 0x4CBB17, // Green
        specular: new THREE.Color(0x666666),
        shininess: 3
    });
    
    // North America
    addContinent(continentMaterial, [
        { lat: 55, lng: -100, scale: 15 },
        { lat: 40, lng: -120, scale: 12 },
        { lat: 35, lng: -90, scale: 13 }
    ]);
    
    // South America
    addContinent(continentMaterial, [
        { lat: -10, lng: -60, scale: 13 },
        { lat: -30, lng: -65, scale: 10 }
    ]);
    
    // Europe
    addContinent(continentMaterial, [
        { lat: 50, lng: 10, scale: 8 },
        { lat: 45, lng: 20, scale: 7 }
    ]);
    
    // Africa
    addContinent(continentMaterial, [
        { lat: 0, lng: 20, scale: 14 },
        { lat: -20, lng: 25, scale: 12 }
    ]);
    
    // Asia
    addContinent(continentMaterial, [
        { lat: 40, lng: 90, scale: 17 },
        { lat: 55, lng: 60, scale: 13 },
        { lat: 30, lng: 75, scale: 15 }
    ]);
    
    // Australia
    addContinent(continentMaterial, [
        { lat: -25, lng: 135, scale: 10 }
    ]);
}

// Helper function to add a continent piece at the specified lat/lng
function addContinent(material, positions) {
    positions.forEach(pos => {
        const continentGeometry = new THREE.SphereGeometry(4, 12, 12);
        const continent = new THREE.Mesh(continentGeometry, material);
        
        // Convert lat/lng to 3D position
        const phi = (90 - pos.lat) * (Math.PI / 180);
        const theta = (pos.lng + 180) * (Math.PI / 180);
        
        // Calculate position on sphere
        const radius = 50;
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        continent.position.set(x, y, z);
        
        // Scale the continent piece
        const scale = pos.scale / 10;
        continent.scale.set(scale, 0.8, scale);
        
        // Orient to face outward from the center of the globe
        continent.lookAt(0, 0, 0);
        continent.rotateX(Math.PI / 2);
        
        globe.add(continent);
    });
}

// Create stars background
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}

// Animation loop
function animate() {
    animationFrame = requestAnimationFrame(animate);
    
    // Rotate the globe
    if (globe) {
        globe.rotation.y += 0.005; // Smooth rotation speed
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Clean up resources when animation is stopped
function dispose() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', onWindowResize);
    
    // Clean up Three.js resources
    if (renderer) {
        renderer.dispose();
    }
    
    // Dispose textures
    if (starsTexture) starsTexture.dispose();
    
    // Dispose geometries and materials
    if (globe) {
        if (globe.geometry) globe.geometry.dispose();
        if (globe.material) globe.material.dispose();
        
        // Dispose continent elements
        if (globe.children.length > 0) {
            globe.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }
    
    // Remove container if it exists
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }
    
    // Clear references
    // Clear references
    scene = null;
    camera = null;
    renderer = null;
    globe = null;
    }

    // Make functions globally available
    window.initBackgroundAnimation = initBackgroundAnimation;
    window.disposeBackgroundAnimation = dispose;
