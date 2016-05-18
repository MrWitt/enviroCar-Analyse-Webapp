var bufVal;
var latlng;
var day;
var timeWindowStart;
var timeWindowEnd;
var download;
var dateStart;
var dateEnd;
var allDays = "Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag,Sonntag"
var WMS = "http://ags.52north.org:6080";
/* must not end with slash */
var WPS = "http://processing.envirocar.org:8080/wps";
/*var WPS = "http://localhost:8080/envirocar-wps";*/

var map = L.map('map', {
		zoomControl : true
}).setView([51.183836, 6.440373], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	maxZoom : 18,
	attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '/* +
	'Imagery <a href="http://mapbox.com">Mapbox</a>',
	/*id : 'mapbox.streets'*/
}).addTo(map);

var popup = L.popup();
var speedTracks = L.tileLayer.wms(WMS + "/arcgis/services/enviroCar/aggregation/MapServer/WMSServer", {
		layers : 0,
		format : 'image/png',
		transparent : true,
		attribution : "EnviroCar Tracks"
	}).addTo(map);

map.addControl(new L.Control.Layers({}, {
		'EnviroCar Tracks ' : speedTracks
	}, {
		collapsed : false
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
	
	if(document.getElementById("Zeitfenster").checked && document.getElementById("Zeitfenster2").checked ){
		alert("Deaktivieren Sie bitte eine der Zeitfensterabfragen.");
		return;	
	}
	bufVal = document.getElementById('buffer').value;        
    if(document.getElementById("Zeitfenster").checked){
    var dtS = "null";
    var dtE = "null";
	day = document.getElementById('day').value;
        if(day == "null"){
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
		console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd +";dateStart="+dtS+";dateEnd="+dtE +"&RawDataOutput=result@mimeType=application/csv");
        
		$.get(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd +";dateStart="+dtS+";dateEnd="+dtE +"&RawDataOutput=result@mimeType=application/csv", function (data) {
			var download = WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd +";dateStart="+dtS+";dateEnd="+dtE +"&RawDataOutput=result@mimeType=application/csv";
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
    }else if(document.getElementById("Zeitfenster2").checked){
        dateStart=document.getElementById("dateStart").value;
        dateEnd=document.getElementById("dateEnd").value; 
            if(dateStart.length == 0 || dateEnd.length == 0){
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
        
		console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart="+dtS+";dateEnd="+dtE +" &RawDataOutput=result@mimeType=application/csv");
        
		$.get(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart="+dtS+";dateEnd="+dtE +" &RawDataOutput=result@mimeType=application/csv", function (data) {
			var download = WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + allDays + ";timeWindowStart=0;timeWindowEnd=0;dateStart="+dtS+";dateEnd="+dtE +" &RawDataOutput=result@mimeType=application/csv";
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
		opacity : 1,
		weight : 1,
		fillOpacity : 0.4
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

		var drawControl = new L.Control.Draw({
			/*draw: {
				position: 'topleft',
				polygon: false,
				polyline: {
					shapeOptions: {
						color: 'red'
					},
				},
				circle: false,
				rectangle: false,
				marker: false
			},
			edit: {
				featureGroup: drawnItems
			}*/
		});
		/*map.addControl(drawControl);*/

		map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;

			if (type === 'polyline') {
			alert(layer.getLatLngs());
			}
			drawnItems.addLayer(layer);
			drawnItems.clearLayers(layer);
		});


