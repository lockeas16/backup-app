// array ids was previously created through Handle Bars
// TODO: change baseUrl for heroku!
const zoneHandler = new ZoneHandler();

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9ja2VhczE2IiwiYSI6ImNqdTBsdzNsaDJuNDU0ZW1wdDhsemh1ZWgifQ.Eb6eV0uCOFbUPAEvSFGAFg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-99.135, 19.4294], // starting position
  zoom: 11
});

map.on("load", function() {
  ids.forEach(id => {
    //retrieve each zone coordinate and add a layer to the map
    zoneHandler
    .getZone(id)
    .then(data => {
        const popUpHTML=`<a href="/zones/${id}/detail">Edit ${data.name}</a><br><a href="/zones/${id}/delete" class="uk-text-danger">Delete Zone</a>`;
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
                coordinates: [data.area.coordinates]
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
          .setLngLat(data.area.coordinates[0])
          .setHTML(popUpHTML)
          .addTo(map);
        //event listener to display popup for editing
        map.on("click", id, function(e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popUpHTML)
            .addTo(map);
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
});
