var bufVal;
var latlng;
var day;
var timeWindowStart;
var timeWindowEnd;
var download;
var dateStart;
var dateEnd;
var index;
var jsonUrl = "https://envirocar.org/envirocar-rest-analyzer/dev/rest/route/statistics";
var allDays = "Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag,Sonntag";
var text = '{"type": "Feature","geometry": {"type": "LineString","coordinates": []},"timeInterval": {"dateStart": "2015-               06-08T11:29:10Z","dateEnd": "2016-09-08T11:29:10Z","dayOfWeekStart": 1,"dayOfWeekEnd": 5,"daytimeStart":                "1:30","daytimeEnd": "15:30"},"tolerance": 70.0}';
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

var drawControl = new L.Control.Draw({});


function getColor(x) {
  return x < 22.11542842678142    ?   '#00FF00':
         x < 22.131530165149982     ?   '#88FF00':
         x < 22.139786303213864     ?   '#FFFF00':
         x < 70     ?   '#FF7700':
         x < 90     ?   '#FF0000' :
						'#FF0000' ;
};

var jsonResult;

map.on('draw:created', function (e) {
	drawnItems.clearLayers(layer);
	var type = e.layerType,
	layer = e.layer;
    

		if (type === 'polyline') {
			var shape = JSON.stringify(layer.toGeoJSON());
			var shape = JSON.parse(shape);
		}
		drawnItems.addLayer(layer);
    
    $('#polyDel').click(function() {
    map.removeLayer(drawnItems);
	});


	var jsonText = JSON.parse(text);
	$.extend(jsonText.geometry.coordinates, shape.geometry.coordinates);
	alert(JSON.stringify(jsonText));
	
    $.ajax({
        url: jsonUrl,
        type: "POST",
        crossDomain: true,
        data: JSON.stringify(jsonText),
        dataType: "json",
		/*contentType: "application/json;charset=utf-8",*/
        success:function(result){
		jsonResult = result.features;
		alert("it worked!"+JSON.stringify(result));
		geoLayer();
        },
        error:function(xhr,status,error){
            alert(JSON.stringify(xhr), status,error);
        }
    });
});


function geoLayer(){

        /* START SEARCH FOR INDEX OF SPEED*/
        var str = JSON.stringify(jsonResult[0].properties);
        var data = JSON.parse(str);
        index = data.map(function(d) { return d['name']; }).indexOf('Speed');
        alert(index);
        /* END SEARCH FOR INDEX OF SPEED*/
    
       /* $.getScript('http://www.defiantjs.com/defiant.js/dist/defiant-latest.min.js', function() {
            res1 = JSON.search(jsonResult, '//*[name="Speed"]' );
                for (var i=0; i<res1.length; i++) {
                    console.log( res1[i].avg );
                    }
            });*/
			
			var mylayer = L.geoJson(jsonResult, {
			style: function (feature) {
			alert(JSON.stringify(feature.properties[index].avg));
			return {
			"color": getColor(feature.properties[index].avg),
			"weight": 5,
			"opacity": 1,
			}},
			onEachFeature: onEachFeature
		}).addTo(map);
};

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
       layer.bindPopup("The average Speed is "+feature.properties[index].avg+"km/h."+ "<br> The Maximum is "+feature.properties[index].max +"km/h and minimum is "+feature.properties[index].min+ "km/h.");
};


