(function () {
        
    mapboxgl.accessToken = 'pk.eyJ1IjoibTlicmFkeSIsImEiOiJjaXNzNHQ0YmowNmM5MnlwaGh3YjJzd3k3In0.-Fu9YD8Qbrw7xRZ-7Ocn6w';

    var birdseyeChloroplethMap = new mapboxgl.Map({
        container: 'birdseye-chloropleth-map',
        style: 'mapbox://styles/m9brady/cj96d51p11q9w2so6ei1sjvcf',
        zoom: 3,
        center: [-92.4, 55.6],
        minZoom: 2,
        maxZoom: 8
    });

    birdseyeChloroplethMap.on('load', function() {
        // MSC Region polygons "land_PubStdZone_coarse_proj"
        birdseyeChloroplethMap.addSource('data-polygons', {
            type: 'geojson',
            data: './data/intersect_polys.geojson',
            tolerance: 0.375
        });
        // add regions as fill layer
        birdseyeChloroplethMap.addLayer({
            'id': 'region-polygons',
            'type': 'fill',
            'source':'data-polygons',
            'paint': {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['number',['get', 'points_within']],
                    0, '#2DC4B2',
                    5, '#3BB3C3',
                    10, '#669EC4',
                    15, '#8B88B6',
                    20, '#A2719B',
                    25, '#AA5E79'
                ],
                'fill-outline-color': '#e8e5e5',
                'fill-opacity': 0.3
            }
        });
        // Birdseye Points
        birdseyeChloroplethMap.addSource('data-points', {
            type: 'geojson',
            data: './data/scrubbed.geojson'
        });
        // add points as heatmap layer
        birdseyeChloroplethMap.addLayer({
            'id': 'birdseye-heat',
            'type': 'heatmap',
            'source': 'data-points',
            'maxzoom': 9,
            'paint': {
                'heatmap-opacity': 0.6,
                'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 1,
                    9, 3
                ],
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, "#045a8d",
                    0.2, "#2b8cbe",
                    0.4, "#74a9cf",
                    0.6, "#a6bddb",
                    0.8, "#d0d1e6",
                    1, "#f1eef6"
                ],
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 1,
                    9, 8
                ]
            },
            //'filter': ['==', ['get', 'some_time'], '2018-02-05 07:00:00']
        }, 'place-city-sm');
        /*
        // time slider
        document.getElementById('slider').addEventListener('input', function(e){
            var day = e.target.value;
            // update the map
            birdseyeChloroplethMap.setFilter('birdseye-heat', ['==', ['get', 'some_time'], day]);
            document.getElementById('active-day').innerText = day;
        });
        
        birdseyeChloroplethMap.addLayer({
            'id': 'birdseye-points',
            'type': 'circle',
            'source':'data-points',
            'paint': {
                'circle-radius': 3,
                'circle-color': '#356de8',
                'circle-stroke-color': '#e8e5e5',
                'circle-opacity': 0.8
            }
        });*/
        // query polygons for attributes
        birdseyeChloroplethMap.on('mousemove', function (e){
            var provinces = birdseyeChloroplethMap.queryRenderedFeatures(e.point, {
                layers: ['region-polygons']
            });
            if (provinces.length > 0) {
                document.getElementById('pd').innerHTML = "<h3><strong>" + provinces[0].properties.name_en + "</strong></h3>" + 
                "<p>Number of observations: " + provinces[0].properties.points_within + "</p>" + 
                "<p><em>Area: <strong>" + Math.round(provinces[0].properties.area_km2*100)/100 + "</strong> square kilometers</em></p>";
            } else {
                document.getElementById('pd').innerHTML = '<p>Hover over a region!</p>';
            }
        });
    });
})()