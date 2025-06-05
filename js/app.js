// Constants
const API_KEYS = {
    weather: 'YOUR_WEATHER_API_KEY', // To be replaced with actual API key
    maps: 'YOUR_MAPS_API_KEY' // To be replaced with actual API key
};

// State management
const state = {
    currentLocation: null,
    events: [],
    weather: null
};

// DOM Elements
const elements = {
    map: document.getElementById('cleanup-map'),
    weatherContainer: document.querySelector('.weather-container'),
    ctaButton: document.querySelector('.primary-button')
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    try {
        await Promise.all([
            getUserLocation(),
            loadMapScript(),
            loadWeatherData()
        ]);
        
        initializeMap();
        setupEventListeners();
        addAnimationObserver();
    } catch (error) {
        console.error('Error initializing app:', error);
        // Handle error gracefully
    }
}

// Geolocation
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                state.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                resolve(state.currentLocation);
            },
            error => {
                reject(error);
            }
        );
    });
}

// Weather API Integration
async function loadWeatherData() {
    if (!state.currentLocation) return;

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEYS.weather}&q=${state.currentLocation.lat},${state.currentLocation.lng}`
        );
        
        if (!response.ok) throw new Error('Weather data fetch failed');
        
        state.weather = await response.json();
        updateWeatherUI();
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Map Integration
function loadMapScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.maps}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function initializeMap() {
    if (!state.currentLocation || !elements.map) return;

    const map = new google.maps.Map(elements.map, {
        center: state.currentLocation,
        zoom: 12,
        styles: mapStyles // Custom map styles for beach theme
    });

    // Add markers for cleanup events
    addEventMarkers(map);
}

// UI Updates
function updateWeatherUI() {
    if (!state.weather || !elements.weatherContainer) return;

    elements.weatherContainer.innerHTML = `
        <div class="weather-card fade-in">
            <h3>Current Weather</h3>
            <p>${state.weather.current.temp_c}°C</p>
            <p>${state.weather.current.condition.text}</p>
        </div>
    `;
}

// Animation Observer
function addAnimationObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach(
        element => observer.observe(element)
    );
}

// Event Listeners Setup
function setupEventListeners() {
    if (elements.ctaButton) {
        elements.ctaButton.addEventListener('click', () => {
            // Smooth scroll to map section
            document.getElementById('map').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Custom map styles
const mapStyles = [
    // Custom map styles will go here
    // Focusing on highlighting water and beach areas
];
