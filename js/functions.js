var bufVal;
var latlng;
var day;
var timeWindowStart;
var timeWindowEnd;
var download;
var dateStart;
var dateEnd;
var index;
var text;
var jsonUrl = "https://envirocar.org/envirocar-rest-analyzer/dev/rest/route/statistics";
var allDays = "Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag,Sonntag";
var WMS = "http://ags.52north.org:6080";
/* must not end with slash */
var WPS = "http://processing.envirocar.org:8080/wps";
/*var WPS = "http://localhost:8080/envirocar-wps";*/

var map = L.map('map', {
    zoomControl: true
}).setView([51.183836, 6.440373], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18
    , attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
        /* +
        	'Imagery <a href="http://mapbox.com">Mapbox</a>',
        	/*id : 'mapbox.streets'*/
}).addTo(map);

var popup = L.popup();
var speedTracks = L.tileLayer.wms(WMS + "/arcgis/services/enviroCar/aggregation/MapServer/WMSServer", {
    layers: 0
    , format: 'image/png'
    , transparent: true
    , attribution: "EnviroCar Tracks"
}).addTo(map);

map.addControl(new L.Control.Layers({}, {
    'EnviroCar Tracks ': speedTracks
}, {
    collapsed: false
}));

function onMapClick(e) {
    popup
    /*.setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);*/
    latlng = e.latlng.lat + " " + e.latlng.lng;
    loadStats();
}
map.on('click', onMapClick);

function loadStats() {

    if (document.getElementById("ZeitfensterBox").checked && document.getElementById("ZeitfensterBox2").checked) {
        alert("Deaktivieren Sie bitte eine der Zeitfensterabfragen.");
        return;
    }
    bufVal = document.getElementById('buffer').value;
    if (document.getElementById("ZeitfensterBox").checked) {
        var dtS = "null";
        var dtE = "null";
        day = document.getElementById('day').value;
        if (day == "null") {
            alert("Bitte wählen Sie ein Tagfenster!");
            return;
        }
        timeWindowStart = document.getElementById('timeWindow1').value;
        timeWindowEnd = document.getElementById('timeWindow2').value;
        if (timeWindowStart.length == 0 || timeWindowEnd.length == 0) {
            timeWindowStart = 0;
            timeWindowEnd = 0;
        }
        if ((bufVal.length) == 0) {
            alert("Bitte bestimmen Sie den Radius!");
            return;
        } else {
            $("#loader").show("slow");
            console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + ";dateStart=" + dtS + ";dateEnd=" + dtE + "&RawDataOutput=result@mimeType=application/csv");

            $.get(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + ";dateStart=" + dtS + ";dateEnd=" + dtE + "&RawDataOutput=result@mimeType=application/csv", function (data) {
                    var download = WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + ";dateStart=" + dtS + ";dateEnd=" + dtE + "&RawDataOutput=result@mimeType=application/csv";
                    document.getElementById("download").setAttribute("href", download);
                    // start the table
                    var html = '<table >';

                    // split into lines
                    var rows = data.split("\n");

                    // parse lines
                    rows.forEach(function getvalues(ourrow) {

                            // start a table row
                            html += "<tr>";

                            // split line into columns
                            var columns = ourrow.split(";");

                            html += "<td>" + columns[0] + " " + "</td>";
                            html += "<td>" + columns[1] + " " + "</td>";
                            html += "<td>" + columns[2] + " " + "</td>";
                            html += "<td>" + columns[3] + " " + "</td>";

                            // close row
                            html += "</tr>";
                        })
                        // close table
                    html += "</table>";

                    // insert into div
                    remCon();
                    $('#values2').append(html);

                })
                .done(function () {
                    display();
                })
                .fail(function () {
                    alert("error");
                    $("#loader").hide("slow");
                })
        }
    } else if (document.getElementById("ZeitfensterBox2").checked) {
        dateStart = document.getElementById("dateStart").value;
        dateEnd = document.getElementById("dateEnd").value;
        if (dateStart.length == 0 || dateEnd.length == 0) {
            alert("Bitte bestimmen Sie den Abfragezeitraum!");
            return;
        }
        var dtS = dateStart.replace(/\//g, "-");
        var dtE = dateEnd.replace(/\//g, "-");
        timeWindowStart = document.getElementById('timeWindow1').value;
        timeWindowEnd = document.getElementById('timeWindow2').value;
        if (timeWindowStart.length == 0 || timeWindowEnd.length == 0) {
            timeWindowStart = 0;
            timeWindowEnd = 0;
        }
        if ((bufVal.length) == 0) {
            alert("Bitte bestimmen Sie den Radius!");
            return;
        } else {
            $("#loader").show("slow");

            console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart=" + dtS + ";dateEnd=" + dtE + " &RawDataOutput=result@mimeType=application/csv");

            $.get(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart=" + dtS + ";dateEnd=" + dtE + " &RawDataOutput=result@mimeType=application/csv", function (data) {
                    var download = WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart=" + dtS + ";dateEnd=" + dtE + " &RawDataOutput=result@mimeType=application/csv";
                    document.getElementById("download").setAttribute("href", download);
                    // start the table
                    var html = '<table >';

                    // split into lines
                    var rows = data.split("\n");

                    // parse lines
                    rows.forEach(function getvalues(ourrow) {

                            // start a table row
                            html += "<tr>";

                            // split line into columns
                            var columns = ourrow.split(";");

                            html += "<td>" + columns[0] + " " + "</td>";
                            html += "<td>" + columns[1] + " " + "</td>";
                            html += "<td>" + columns[2] + " " + "</td>";
                            html += "<td>" + columns[3] + " " + "</td>";

                            // close row
                            html += "</tr>";
                        })
                        // close table
                    html += "</table>";

                    // insert into div
                    remCon();
                    $('#values2').append(html);

                })
                .done(function () {
                    display();
                })
                .fail(function () {
                    alert("error");
                    $("#loader").hide("slow");
                })
        }



    }
};


function setCirc() {
    bufVal = document.getElementById('buffer').value;
    filterCircle.setRadius(bufVal);
}

var filterCircle = L.circle(L.latLng(0, 0), 0, {
    opacity: 1
    , weight: 1
    , fillOpacity: 0.4
}).addTo(map);

map.on('mousemove', function (e) {
    filterCircle.setLatLng(e.latlng);
});

function hide() {
    $("#values").hide('slow');
    $("#values2").hide('slow');
    remCon();
}

function display() {
    $("#values").show('slow');
    $("#values2").show('slow');
    $("#loader").hide("slow");

}

function remCon() {
    $("#values2").empty();
}

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({});
var drawHandler = new L.Draw.Polyline(map, drawControl.options.polyline);

function getColor(x) {
    return x < 20.11542842678142 ? '#00FF00' :
        x < 21.651530165149982 ? '#88FF00' :
        x < 21.699786303213864 ? '#FFFF00' :
        x < 70 ? '#FF7700' :
        x < 90 ? '#FF0000' :
        '#FF0000';
};

var jsonResult;

map.on('draw:created', function (e) {
	drawnItems.clearLayers(layer);
    var type = e.layerType
        , layer = e.layer;


    if (type === 'polyline') {
        var shape = JSON.stringify(layer.toGeoJSON());
        var shape = JSON.parse(shape);
    }
    drawnItems.addLayer(layer);   
    buildJsonText();
    var jsonText = JSON.parse(text);
    $.extend(jsonText.geometry.coordinates, shape.geometry.coordinates);
    alert(JSON.stringify(jsonText));
    $("#loader").show("slow");
	$("#loaderText").show("slow");
    $.ajax({
        url: jsonUrl
        , type: "POST"
        , crossDomain: true
        , data: JSON.stringify(jsonText)
        , dataType: "json"
        , /*contentType: "application/json;charset=utf-8",*/
        success: function (result) {
            jsonResult = result.features;
            alert("it worked!" + JSON.stringify(result));
            colorLine();
        }
        , error: function (xhr, status, error) {
            alert(JSON.stringify(xhr), status, error);
            $("#loader").hide("slow");
			$("#loaderText").hide("slow");
        }
    });
});


function colorLine() {

    /* START SEARCH FOR INDEX OF SPEED*/
    var str = JSON.stringify(jsonResult[0].properties);
    var data = JSON.parse(str);
    index = data.map(function (d) {
        return d['name'];
    }).indexOf('Speed');
	$("#loader").hide("slow");
	$("#loaderText").hide("slow");
	if(index == -1){
	alert("Es wurden keine passenden Fahrten gefunden!");
	        document.getElementById("polyDel").click();
			drawHandler.disable();
	return;
	}else{
    /* END SEARCH FOR INDEX OF SPEED*/
    var mylayer = L.geoJson(jsonResult, {
        style: function (feature) {
            return {
                "color": getColor(feature.properties[index].avg)
                , "weight": 5
                , "opacity": 1
            , }
        }
        , onEachFeature: onEachFeature
    }).addTo(map);
		document.getElementById('polyDel').disabled = false;
		document.getElementById('cancelDraw').disabled = true
	    $('#polyDel').click(function () {
        map.removeLayer(drawnItems);
        map.removeLayer(mylayer);
    });
	
	}
};

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    layer.bindPopup("The average Speed is " + feature.properties[index].avg.toFixed(2) + "km/h." + "<br> The Maximum is " + feature.properties[index].max + "km/h and minimum is " + feature.properties[index].min + "km/h.");
};

function buildJsonText(){
    if(document.getElementById("dateStartLine").value == "" || document.getElementById("dateEndLine").value == "" || document.getElementById('dayStartLine').value =="null" || document.getElementById('dayEndLine').value =="null" || document.getElementById('timeWindow1Line').length == "" || document.getElementById('timeWindow2Line').length == "" ){
        alert("Sie haben wichtige Eingabeparameter vergessen!");
        document.getElementById("polyDel").click();
        drawHandler.disable();
        return false;
    }else{
    text = '{"type": "Feature","geometry": {"type": "LineString","coordinates": []},"timeInterval":{"dateStart": "'+document.getElementById("dateStartLine").value+'T00:00:01Z","dateEnd":"'+document.getElementById("dateEndLine").value+'T00:00:01Z","dayOfWeekStart":'+document.getElementById('dayStartLine').value+',"dayOfWeekEnd": '+document.getElementById('dayEndLine').value +',"daytimeStart":"' + document.getElementById('timeWindow1Line').value + '","daytimeEnd":"' + document.getElementById('timeWindow2Line').value + '"},"tolerance": 70.0}';
    
    return(text);
    }
}