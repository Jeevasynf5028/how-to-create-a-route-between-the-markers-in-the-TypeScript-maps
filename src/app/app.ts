import { Maps, NavigationLine, Marker } from '@syncfusion/ej2-maps';
Maps.Inject(NavigationLine, Marker);

let map: Maps = new Maps({
    zoomSettings: {
        enable: true,
      },
      layers: [
        {
          urlTemplate: 'https://tile.openstreetmap.org/level/tileX/tileY.png',
          markerSettings: [
            {
              visible: true,
              shape: 'Image',
              imageUrl:
                'https://ej2.syncfusion.com/javascript/demos/src/maps/images/ballon.png',
              width: 20,
              height: 20,
            },
          ],
          navigationLineSettings: [
            {
              visible: true,
              color: 'black',
              angle: 0,
              width: 20,
            },
          ],
        },
      ],
});

map.appendTo('#container');

let Source: string;
let Destination: string;
function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const onButtonClick = function () {
    Source = (
      document.getElementById('input') as HTMLInputElement
    ).value.toLowerCase();
    Destination = (
      document.getElementById('output') as HTMLInputElement
    ).value.toLowerCase();
    if (
      Source !== null &&
      Source !== '' &&
      Destination !== null &&
      Destination !== ''
    ) {
      calculateAndDisplayRoute(directionsService);
    }
  };
  const routeButton = document.getElementById('route');
  if (routeButton) {
    routeButton.addEventListener('click', onButtonClick);
  }
}

function calculateAndDisplayRoute(directionsService: any) {
  directionsService
    .route({
      origin: {
        query: Source,
      },
      destination: {
        query: Destination,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response: any) => {
      map.zoomSettings.shouldZoomInitially = true;
      let markers = map.layersCollection[0].markerSettings;
      markers[0].dataSource = [];
      markers[0].dataSource.push({
        latitude: response.routes[0].legs[0].start_location.lat(),
        longitude: response.routes[0].legs[0].start_location.lng(),
      });
      markers[0].dataSource.push({
        latitude: response.routes[0].legs[0].end_location.lat(),
        longitude: response.routes[0].legs[0].end_location.lng(),
      });
      let navigationlines = map.layersCollection[0].navigationLineSettings;
      let latLngs = response.routes[0].overview_path;
      let latitudes = [];
      let longitudes = [];
      for (let i = 0; i < latLngs.length; i++) {
        latitudes.push(latLngs[i].lat());
        longitudes.push(latLngs[i].lng());
      }
      navigationlines[0].latitude = latitudes;
      navigationlines[0].longitude = longitudes;
    })
    .catch((e : any) => window.alert('Directions request failed due to ' + status));
}

initMap();