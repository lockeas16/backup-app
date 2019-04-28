const baseUrl = "http://localhost:3000";

/**
 * @function getCenterCoord
 * Calculates the center point from an array of coordinates
 * @param  {Array} coords An array of coordinates: longitude,latitude
 * @returns  {Array} A coordinate representing the center
 */
const getCenterCoord = (coords) => {
  if (coords.length === 1) {
    // return the first coordinate
    return coords[0]
  }
  if (coords.length <= 0) return undefined;

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  coords.forEach(coord => {
    let longitude = (coord[0] * Math.PI) / 180;
    let latitude = (coord[1] * Math.PI) / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  });

  let total = coords.length;
  console.log(total);

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return [
    (centralLongitude * 180) / Math.PI,
    (centralLatitude * 180) / Math.PI
  ];
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);
