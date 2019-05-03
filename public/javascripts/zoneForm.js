// zoneId and coordinates were previously created through Handle Bars
// TODO: change baseUrl for heroku!
const zoneHandler = new ZoneHandler();
let btn = document.getElementById("zoneBtn");
btn.disabled = true;

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9ja2VhczE2IiwiYSI6ImNqdTBsdzNsaDJuNDU0ZW1wdDhsemh1ZWgifQ.Eb6eV0uCOFbUPAEvSFGAFg";
/* eslint-disable */
let map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mapbox/light-v10", //hosted style id
  center: [-99.135, 19.4294], // starting position
  zoom: 12 // starting zoom
});

let draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true
  }
});

map.addControl(draw);
if (zoneId) {
  // to add a polygon, it must be after adding the control to the map
  draw.add(createPolygon(coordinates));
  map.setCenter(getCenterCoord(coordinates[0]))
  btn.disabled = false;
}
map.on("draw.create", updateArea);
map.on("draw.delete", updateArea);
map.on("draw.update", updateArea);
document.addEventListener("submit", handleSubmit);

// Add geolocate control to the map.
const geoLocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});
map.addControl(geoLocate);
geoLocate.on("geolocate", function(e) {
  let lng=e.coords.longitude;
  let lat=e.coords.latitude;
  map.setCenter([lng,lat]);
  map.setZoom(14);
});

function createPolygon(coords) {
  return {
    type: "Polygon",
    coordinates: coords
  };
}

function createBody(data) {
  let obj = {};
  const inpName = document.getElementById("zoneName");
  obj["name"] = inpName.value;
  obj["coords"] = data.features[0].geometry.coordinates;
  return obj;
}

function updateArea() {
  let data = draw.getAll();
  if (data.features.length > 0) {
    btn.disabled = false;
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const body = createBody(draw.getAll());
  if (zoneId) {
    zoneHandler.updateZone(zoneId, body).then(res => {
      window.location.replace("/dashboard");
    });
  } else {
    zoneHandler.createZone(body).then(res => {
      window.location.replace("/dashboard");
    });
  }
}
