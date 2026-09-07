export function isUaeCountry(country?: string) {
  const value = (country || "").trim().toLowerCase();
  return (
    value === "united arab emirates" ||
    value === "uae" ||
    value === "ae" ||
    value.includes("dubai")
  );
}

function isDubaiCity(city?: string) {
  const value = (city || "").trim().toLowerCase();
  return /\bdubai\b/.test(value) || value.includes("دبي");
}

export function isDubaiDelivery(country?: string, city?: string) {
  return isUaeCountry(country) && isDubaiCity(city);
}

export function checkoutDeliveryCopy(country?: string) {
  const destination = country?.trim();
  if (isUaeCountry(destination)) {
    return {
      title: "UAE delivery",
      body: "Fast complimentary delivery across Dubai and the UAE.",
      eta: "Fast UAE delivery",
    };
  }

  if (destination) {
    return {
      title: `Delivery to ${destination}`,
      body: `Complimentary international shipping to ${destination}. Delivery time depends on the destination.`,
      eta: `Ships to ${destination}`,
    };
  }

  return {
    title: "International delivery",
    body: "Select your shipping country and we will deliver there. Delivery time depends on the destination.",
    eta: "International shipping",
  };
}
