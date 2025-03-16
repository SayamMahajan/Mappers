// This file dynamically loads and parses the CSV disaster data

// Function to parse CSV text into an array of objects
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    // Handle commas within quoted values
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue.trim());
    
    // Create object from headers and values
    const obj = {};
    headers.forEach((header, index) => {
      // Remove surrounding quotes if present
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      obj[header] = value;
    });
    
    return obj;
  });
};

// Create a persistent cache using localStorage
const geocodingCache = (() => {
  try {
    // Try to load existing cache from localStorage
    const savedCache = localStorage.getItem('geocodingCache');
    return savedCache ? JSON.parse(savedCache) : {};
  } catch (e) {
    console.warn('Could not load geocoding cache from localStorage', e);
    return {};
  }
})();

// Save cache to localStorage periodically
const saveCache = (() => {
  let timeout = null;
  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        localStorage.setItem('geocodingCache', JSON.stringify(geocodingCache));
      } catch (e) {
        console.warn('Could not save geocoding cache to localStorage', e);
      }
    }, 1000);
  };
})();

// Function to get country from coordinates using Nominatim API with timeout
const getCountryFromCoordinates = async (latitude, longitude) => {
  // Generate cache key using coordinates (rounded to reduce variations)
  const roundedLat = Math.round(latitude * 10) / 10;
  const roundedLng = Math.round(longitude * 10) / 10;
  const cacheKey = `${roundedLat},${roundedLng}`;
  
  // Return cached result if available
  if (geocodingCache[cacheKey]) {
    return geocodingCache[cacheKey];
  }
  
  try {
    // Create a promise with timeout
    const timeoutDuration = 3000; // 3 seconds timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    // Use Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`,
      { 
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    let country = data.address?.country || 'Unknown';
    
    // Cache the result and save to localStorage
    geocodingCache[cacheKey] = country;
    saveCache();
    return country;
    
  } catch (error) {
    console.error('Error getting country name:', error);
    return 'Unknown';
  }
};

// Approximate country determination using coordinates (much faster than API)
const approximateCountryFromBulkData = (latitude, longitude) => {
  // This is a simple approximation - you might want to replace with more accurate data
  // For now, returning "Unknown" as a fallback
  return "Unknown";
};

// Create a promise that loads and parses the CSV data
const disasterDataPromise = fetch('/data/combined_disaster_data.csv')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load disaster data');
    }
    return response.text();
  })
  .then(async (csvText) => {
    const allData = parseCSV(csvText);
    
    // Process the data to ensure numerical values for coordinates
    const processedData = allData.map(record => {
      // Convert latitude and longitude to numbers
      if (record.latitude) record.latitude = parseFloat(record.latitude);
      if (record.longitude) record.longitude = parseFloat(record.longitude);
      
      return record;
    });
    
    // Filter out records with disaster_type = "other" and invalid coordinates
    const filteredData = processedData.filter(record => {
      return record.disaster_type?.toLowerCase() !== "other" && 
             !isNaN(record.latitude) && 
             !isNaN(record.longitude);
    });

    // Immediately return data with approximate country info
    const enhancedData = filteredData.map(record => ({
      ...record,
      country: approximateCountryFromBulkData(record.latitude, record.longitude)
    }));
    
    // Start background geocoding process
    startBackgroundGeocoding(enhancedData);
    
    return enhancedData;
  })
  .catch(error => {
    console.error('Error loading disaster data:', error);
    return []; // Return empty array on error
  });

// Variable to track geocoding status
let isGeocodingInProgress = false;

// Function to start background geocoding
const startBackgroundGeocoding = async (data) => {
  if (isGeocodingInProgress || !data || data.length === 0) return;
  
  isGeocodingInProgress = true;
  
  try {
    // Process in larger batches with greater intervals to reduce API load
    const batchSize = 25;
    const delayBetweenBatches = 2000; // 2 seconds between batches
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      // Process 5 items at a time within each batch
      for (let j = 0; j < batch.length; j += 5) {
        const smallBatch = batch.slice(j, j + 5);
        await Promise.all(smallBatch.map(async (record) => {
          if (!record.country || record.country === 'Unknown') {
            const country = await getCountryFromCoordinates(record.latitude, record.longitude);
            record.country = country;
          }
        }));
        
        // Small delay between small batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Update the cache after each batch
      if (cachedData) {
        cachedData = [...data];
        notifyDataListeners();
      }
      
      // Larger delay between main batches
      if (i + batchSize < data.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
  } finally {
    isGeocodingInProgress = false;
  }
};

// Cache the loaded data
let cachedData = null;

// Add listener system for data updates
const dataListeners = [];

// Function to notify listeners when data is updated
const notifyDataListeners = () => {
  dataListeners.forEach(listener => listener(cachedData));
};

// Function to get the disaster data
const getDisasterData = async () => {
  if (cachedData) return cachedData;
  
  cachedData = await disasterDataPromise;
  return cachedData;
};

// Function to subscribe to data updates
const subscribeToDataUpdates = (callback) => {
  dataListeners.push(callback);
  return () => {
    const index = dataListeners.indexOf(callback);
    if (index > -1) {
      dataListeners.splice(index, 1);
    }
  };
};

// For backward compatibility, also provide the promise directly
export { disasterDataPromise, subscribeToDataUpdates };

export default getDisasterData;
