var popup = L.popup();
var bufVal;
var latlng;
var day;
var timeWindowStart;
var timeWindowEnd;
var download;
var WMS = "http://ags.52north.org:6080";
/* must not end with slash*/
var WPS = "http://processing.envirocar.org:8080/wps";

var map = L.map('map', {
		zoomControl : false
}).setView([51.40, 7.40], 9);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom : 18,
	attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery <a href="http://mapbox.com">Mapbox</a>',
	id : 'mapbox.streets'
}).addTo(map);

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
	bufVal = document.getElementById('buffer').value;
	day = document.getElementById('day').value;
	timeWindowStart = document.getElementById('timeWindow1').value;
	timeWindowEnd = document.getElementById('timeWindow2').value;
	if (timeWindowStart.length == 0 || timeWindowEnd.length == 0) {
		timeWindowStart = 0;
		timeWindowEnd = 0;
	}
	if ((bufVal.length) == 0) {
		alert("Bitte bestimmen Sie den Radius!");
	} else {
		$("#loader").show("slow");
		console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + "&RawDataOutput=result@mimeType=application/csv");
		$.get(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + "&RawDataOutput=result@mimeType=application/csv", function (data) {
			console.log(WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + "&RawDataOutput=result@mimeType=application/csv");
			var download = WPS + "/WebProcessingService?Service=WPS&Request=Execute&Version=1.0.0&Identifier=org.envirocar.wps.StatsForPOI&DataInputs=pointOfInterest=POINT(" + latlng + ")@mimeType=application/wkt;bufferSize=" + bufVal + ";day=" + day + ";timeWindowStart=" + timeWindowStart + ";timeWindowEnd=" + timeWindowEnd + "&RawDataOutput=result@mimeType=application/csv";
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

			$('#values2').append(html);

		})
		.done(function () {
			display();
		})
		.fail(function () {
			alert("error");
			$("#loader").hide("slow");
		});
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
	$("#values").hide("slow");
	$("#values2").hide("slow");
	remCon();
}

function display() {
	$("#values").show("slow");
	$("#values2").show("slow");
	$("#loader").hide("slow");

}

function remCon() {
	$("#values2").empty()
}
