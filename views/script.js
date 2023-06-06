const StaticLongLat = [
    // Eiffel Tower, Paris, France
    { lat: 48.858276, lng: 2.293991 },
    // Taj Mahal, Agra, India
    { lat: 27.173937, lng: 78.042021 },
    // Great Wall of China, Beijing, China
    { lat: 40.434408, lng: 116.570645 },
    // Christ the Redeemer, Rio de Janeiro, Brazil
    { lat: -22.951527, lng: -43.210786 },
    // Pyramids of Giza, Cairo, Egypt
    { lat: 29.977712, lng: 31.132258 },
    // Sydney Opera House, Sydney, Australia
    { lat: -33.857786, lng: 151.215496 },
    // Statue of Liberty, New York City, USA
    { lat: 40.688886, lng: -74.045463 },
    // Colosseum, Rome, Italy
    { lat: 41.890406, lng: 12.493126 },
    // Machu Picchu, Cusco Region, Peru
    { lat: -13.163882, lng: -72.545749 },
    // Sagrada Familia, Barcelona, Spain
    { lat: 41.404570, lng: 2.174087 }
];



var interval;
function initialize() {
    let pinLocation = {}
    let resultBox = document.querySelector(".result")
    let playBtn = document.getElementById("play-btn")
    // const myLatLng = locations[0];
    // console.log(myLatLng)
    const myLatLng = StaticLongLat[Math.floor(Math.random() * StaticLongLat.length)];
    const map2 = new google.maps.Map(document.getElementById("map2"), {
        center: myLatLng,
        zoom: 4,
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true,
        streetViewControl: false,

    });
    const map = new google.maps.Map(document.getElementById("map"), {
        center: myLatLng,
        zoom: 2,
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true,
        streetViewControl: false,

    });
    let marker = new google.maps.Marker({
        position: myLatLng,
    });

    map.addListener("click", (mapsMouseEvent) => {
        marker.setMap(map);
        marker.setPosition(mapsMouseEvent.latLng);
        pinLocation = mapsMouseEvent.latLng.toJSON()
        console.log(mapsMouseEvent.latLng.toJSON());
    });

    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            position: myLatLng,
            pov: { heading: 0, pitch: 0 }, // Set the initial view

            panControl: false,
            disableDefaultUI: true, // a  
            addressControl: false, // Disable the address control
            enableCloseButton: false, // Disable the close button
            linksControl: true, // Disable the links control
            showRoadLabels: false, // Disable road labels
            panControl: false, // Disable the default pan control
            zoomControl: true, // Disable the default zoom control
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            scaleControl: true,

            panControl: true,

            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },

            streetViewControlOptions: {
                enableCompass: true // Enable the navigation compass
            }
        }
    );
    var directionElement = document.getElementById('direction');

    panorama.addListener('pov_changed', function () {
        var heading = panorama.getPov().heading;
        var direction = getCardinalDirection(heading);
        directionElement.textContent = 'Heading: ' + direction;
        console.log(direction)
    });
    let mk1 = ""
    let mk2 = ""
    let line = ""
    let submitBtn = document.getElementById("submit-btn")
    submitBtn.onclick = () => {
        clearInterval(interval);
        resultBox.style.display = "block";
        let initialLoc = myLatLng
        if (JSON.stringify(pinLocation) === "{}") return console.log("pin location on map")
        console.log("cal", initialLoc, pinLocation);

        // Locations of landmarks
        const init = myLatLng;
        const pin = pinLocation;
        // The markers for The Dakota and The Frick Collection
        mk1 = new google.maps.Marker({ position: init, map: map2 });
        mk2 = new google.maps.Marker({ position: pin, map: map2 });
        // Draw a line showing the straight distance between the markers
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            strokeWeight: 2,
            scale: 3
        };
        line = new google.maps.Polyline({
            path: [init, pin],
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '50%',
                repeat: '15px'
            }],
            map: map2
        });

        function haversine_distance(mk1, mk2) {
            var R = 6371; // Radius of the Earth in miles
            var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
            var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
            var difflat = rlat2 - rlat1; // Radian difference (latitudes)
            var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

            var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
            return d;
        }
        // Calculate and display the distance between markers
        var distance = haversine_distance(mk1, mk2);
        document.getElementById('resDistance').innerHTML = "Distance between markers: " + distance.toFixed(2) + "KM.";
        console.log("Distance between markers: " + distance.toFixed(2) + " km.")

    }
    playBtn.onclick = () => {
        // resultBox.style.display = "none";
        // pinLocation = {}
        // marker.setMap(null);
        // mk1.setMap(null);
        // mk2.setMap(null);
        // line.setMap(null);
        // document.querySelector(".js-timeout").innerHTML = ('02:00');
        // countdown();
        window.location.reload()
    }
    countdown();
}

function getCardinalDirection(heading) {
    var cardinalDirections = ['North', 'Northwest', 'West', 'Southwest', 'South', 'Southeast', 'East', 'Northeast', 'North'];
    var index = Math.round(heading / 45) % 8;
    return cardinalDirections[index];

}

function countdown() {
    clearInterval(interval);
    interval = setInterval(function () {
        var timer = document.querySelector(".js-timeout").innerHTML;
        timer = timer.split(':');
        var minutes = timer[0];
        var seconds = timer[1];
        seconds -= 1;
        if (minutes < 0) return;
        else if (seconds < 0 && minutes != 0) {
            minutes -= 1;
            seconds = 59;
        }
        else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;

        document.querySelector(".js-timeout").innerHTML = (minutes + ':' + seconds);

        if (minutes == 0 && seconds == 0) {
            document.getElementById('dialog').showModal();
            clearInterval(interval);
        }
    }, 1000);
}




window.initialize = initialize;