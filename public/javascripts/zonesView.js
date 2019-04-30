// array ids was previously created through Handle Bars
// TODO: change baseUrl for heroku!
const zoneHandler = new ZoneHandler(baseUrl);

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9ja2VhczE2IiwiYSI6ImNqdTBsdzNsaDJuNDU0ZW1wdDhsemh1ZWgifQ.Eb6eV0uCOFbUPAEvSFGAFg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  // default center
  center: [-99.130325,19.439076],
  zoom: 11
});

const addLayerToMap = (map, id, data) => {
  return new Promise((resolve, reject) => {
    const popUpHTML = `<a href="/zones/${id}/detail">Edit ${
      data.name
    }</a><br><a href="/zones/${id}/delete" class="uk-text-danger">Delete Zone</a>`;
    // retrieving the first coordinate to set a popup
    let [lng,lat]=data.area.coordinates[0][0];
    map.addLayer({
      id: id,
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {
            name: data.name
          },
          geometry: {
            type: "Polygon",
            coordinates: data.area.coordinates
          }
        }
      },
      layout: {},
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.8
      }
    });

    //Add popup to layer
    new mapboxgl.Popup()
      .setLngLat([lng,lat])
      .setHTML(popUpHTML)
      .addTo(map);
    //event listener to display popup for editing
    map.on("click", id, function(e) {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popUpHTML)
        .addTo(map);
    });
    resolve(data.area.coordinates[0]);
  });
};

const processId = (map, id) => {
  return new Promise((resolve, reject) => {
    //retrieve each zone coordinate and add a layer to the map
    zoneHandler
      .getZone(id)
      .then(data => {
        addLayerToMap(map, id, data).then(coords => {
          resolve(coords);
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

map.on("load", function() {
  let promises = [];
  ids.forEach(id => {
    promises.push(processId(map, id));
  });
  Promise.all(promises)
  .then(values=>{
    let coords = values.reduce((acc,value) =>{
      value.forEach(point=>{
        acc.push(point);
      })
      return acc;
    },[])
    map.setCenter(getCenterCoord(coords));
    map.setZoom(11);
  });
});
