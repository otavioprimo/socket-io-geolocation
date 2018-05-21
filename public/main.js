var socket = io();

var myid = Math.floor(Math.random() * 10000) + 1;
var currentUser = 0;
let intervalCoords = null;

let map = null;
let marker = null;

$("title").text(`User ${myid}`);

//Assim que o usuario connecta, envia o token do request dele, para identificar dentro da api ** Apenas uma simulação
socket.emit("online", { token: "aidsisajIDASIADJSIasdisad15151", id: myid })

//Pega os usuarios online
socket.on("liveusers", (data) => {
    $('#list-users').empty();

    data.forEach((element) => {
        if (element != myid) {
            let item = `<li class="list-group-item" id="item-${element}" onclick="sendRandomLocation(${element})">${element}</li>`
            $('#list-users').append(item);
        }

        $(`#item-${currentUser}`).css('background-color', '#668eff');
    });
});


//Envia a sua coordenada (como walker) para um usuario
socket.on('user-coords', (data) => {
    let item = `<li class="list-group-item">User: ${data.who} * Lat: ${data.latitude} - Lng: ${data.longitude}</li>`
    $('#list-coords').append(item);

    //Map
    var _position = { lat: data.latitude, lng: data.longitude };
    if (marker)
        marker.setMap(null);

    var icon = {
        url: "http://www.chattanoogasciencefair.org/wp-content/uploads/american-kennel-club-canine-health-foundation-clipart-best-dog-paw-print-clip-art.png", // url
        scaledSize: new google.maps.Size(10, 15), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    marker = new google.maps.Marker({
        position: _position,
        map: map,
        icon: icon,
        title: 'User ' + data.who
    });

    map.panTo(_position);
});

//Cria Latitude e longitude aleatorios e envia pro usuario escolhido
function sendRandomLocation(id) {

    $(`#item-${id}`).css('background-color', '#668eff');

    this.stopSendingLocation();
    intervalCoords = setInterval(() => {
        let random_latitude = this.getRandomInRange(-23.2, -23.4, 5);
        let random_longitude = this.getRandomInRange(-47.2, -47.4, 5);
        socket.emit('coords', { latitude: random_latitude, longitude: random_longitude, id: id, myid: this.myid });
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(position => {
        //         socket.emit('coords', { latitude: position.coords.latitude, longitude: position.coords.longitude, id: id, myid: this.myid });
        //     });
        // }
    }, 2000);
}

//Para de enviar as coordenadas
function stopSendingLocation() {
    clearInterval(intervalCoords);
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function initMap() {
    var uluru = { lat: -23.268345, lng: -47.2875018 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: uluru
    });
}