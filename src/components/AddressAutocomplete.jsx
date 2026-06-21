import React, { useEffect, useRef } from 'react';

export default function AddressAutocomplete({ value, onChange, onPlaceSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "in" },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"]
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let district = "";
      let state = "";
      let pincode = "";

      place.address_components.forEach(c => {
        if (c.types.includes("administrative_area_level_2")) {
          district = c.long_name;
        }
        if (c.types.includes("administrative_area_level_1")) {
          state = c.long_name;
        }
        if (c.types.includes("postal_code")) {
          pincode = c.long_name;
        }
      });

      onPlaceSelect(place.formatted_address, { district, state, pincode });
    });
  }, [onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="form-control"
      placeholder="Enter your permanent address"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
    />
  );
}
