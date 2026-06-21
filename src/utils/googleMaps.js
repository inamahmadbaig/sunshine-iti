// Google Maps Utilities with Offline Fallback

export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key || key === "YOUR_API_KEY_HERE") {
      resolve(null); // Resolve to null so form runs without Google Maps API
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => resolve(null); // Resolve to null to fail-safe
    document.head.appendChild(script);
  });
}

// Fallback Pincode Geocoder if API is offline
const pinCodeMockDB = {
  "452015": { district: "Indore", state: "Madhya Pradesh" },
  "480661": { district: "Seoni", state: "Madhya Pradesh" },
  "452001": { district: "Indore", state: "Madhya Pradesh" },
  "480882": { district: "Seoni", state: "Madhya Pradesh" }
};

export function geocodePincode(pincode) {
  return new Promise((resolve, reject) => {
    // If we have Google Maps loaded, we can use the Geocoder service
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: pincode + ", India" }, (results, status) => {
        if (status === "OK" && results[0]) {
          let district = "";
          let state = "";
          const components = results[0].address_components;
          components.forEach(c => {
            if (c.types.includes("administrative_area_level_2")) {
              district = c.long_name;
            }
            if (c.types.includes("administrative_area_level_1")) {
              state = c.long_name;
            }
          });
          resolve({ district, state });
        } else {
          // Fallback to local mockup
          resolve(pinCodeMockDB[pincode] || { district: "Indore", state: "Madhya Pradesh" });
        }
      });
    } else {
      // Direct Local mock resolution
      resolve(pinCodeMockDB[pincode] || { district: "Indore", state: "Madhya Pradesh" });
    }
  });
}
