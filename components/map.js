mapboxgl.accessToken = 'pk.eyJ1IjoiY3N0cmFuZCIsImEiOiJja3Z3ZzJ2OHkxZ3ZkMm5xZjEyMjIydHVjIn0.CDl8b6BQN01hGzhLDTeIPw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cstrand/ckwkxf9mv0o7016p7yesri4jo',
    center: [-71.0766963, 42.3365543],
    minZoom: 2,
    zoom: 14.2
});

// Disable default box zooming.
map.boxZoom.disable();
map.scrollZoom.disable();
map.dragPan.disable();
map.doubleClickZoom.disable();


// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('load', () => {
    const canvas = map.getCanvasContainer();
// Variable to hold the starting xy coordinates
// when `mousedown` occured.
    let start;

// Variable to hold the current xy coordinates
// when `mousemove` or `mouseup` occurs.
    let current;

// Variable for the draw box element.
    let box;

    map.addSource('mass-stops', {
        type: 'geojson',
        data: './data/mass_ave_stops.geojson',
        generateId: true // This ensures that all features have unique IDs
    });

    map.loadImage(
        './data/images/bus.png',
        (error, image) => {
            if (error) throw error;

// Add the image to the map style.
            map.addImage('bus', image);

// Add a data source containing one point feature.

        })

    map.loadImage(
        './data/images/ol.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('ol', image);
        })

    map.loadImage(
        './data/images/gl.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('gl', image);
        })

    massStops = map.addLayer(
        {
            'id': 'mass-stops',
            'type': 'symbol',
            'source': 'mass-stops',
            'classname': 'marker',
            'layout': {
                'icon-image': [
                    'match',
                    ['get', 'type'],
                    'orange',
                    'ol',
                    'green',
                    'gl',
                    'bus'],
                'icon-size': [
                    'match',
                    ['get', 'type'],
                    'green',
                    0.06,
                    'orange',
                    0.0119,
                    0.0119],
                'icon-rotate': [
                    'match',
                    ['get', 'type'],
                    'green',
                    0,
                    180],
                'icon-ignore-placement': true
            }
        },
    );

    map.on('mouseenter', 'mass-stops', (e) => {
// Change the cursor style as a UI indicator.
        //map.getCanvas().style.cursor = 'pointer';

        map.getCanvas().style.cursor = 'pointer';
// Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.display_name;
        const route_list = e.features[0].properties.routes.split(' ').join(', ');

// Populate the popup and set its coordinates
// based on the feature found.
        popup.setLngLat(coordinates).setHTML('<strong>' + name + '</strong><p>Routes: '+ route_list +'</p>').addTo(map);
    });


// Set `true` to dispatch the event before other functions
// call it. This is necessary for disabling the default map
// dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);
    canvas.addEventListener('mouseenter', e => canvas.style.cursor = "crosshair")

// Return the xy coordinates of the mouse position
    function mousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return new mapboxgl.Point(
            e.clientX - rect.left - canvas.clientLeft + 10,
            e.clientY - rect.top - canvas.clientTop
        );
    }

    function mouseDown(e) {
// Continue the rest of the function if the shiftkey is pressed.
        //if (!(e.shiftKey && e.button === 0)) return;

// Disable default drag zooming when the shift key is held down.
        map.dragPan.disable();

// Call functions for the following events
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('dblclick', onKeyDown);

// Capture the first xy coordinates
        start = mousePos(e);
    }


    function onMouseMove(e) {
// Capture the ongoing xy coordinates
        current = mousePos(e);

// Append the box element if it dosnt exist
        if (!box) {
            box = document.createElement('div');
            box.classList.add('boxdraw');
            canvas.appendChild(box);
        }

        const minX = Math.min(start.x, current.x),
            maxX = Math.max(start.x, current.x),
            minY = Math.min(start.y, current.y),
            maxY = Math.max(start.y, current.y);


// Adjust width and xy position of the box element ongoing
        const pos = `translate(${minX}px, ${minY}px)`;
        box.style.transform = pos;
        box.style.width = maxX - minX + 'px';
        box.style.height = maxY - minY + 'px';
    }

    function onMouseUp(e) {
// Capture xy coordinates
        finish([start, mousePos(e)]);
    }

    function onKeyDown(e) {
// If the ESC key is pressed
        unfilter_bus_chart()
        unfilter_rail_chart()
        unfilterRidershipChart()
        d3.selectAll('.bubble').attr('fill', 'white')

        if (box) {
            box.parentNode.removeChild(box);
            box = null;
        }
        finish();

    }

    function finish(bbox) {
// Remove these events now that finish has been called.
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mouseup', onMouseUp);

// If bbox exists. use this value as the argument for `queryRenderedFeatures`
        if (bbox) {
            const features = map.queryRenderedFeatures(bbox, {
                layers: ['mass-stops']
            });

            if (features.length >= 1000) {
                return window.alert('Select a smaller number of features');
            }

            const fips = features.map((feature) => feature.properties.routes.split(' ')
                .map(r => display_name_map.get(r)));
            const routes = [...new Set(fips.flat(1))]
            if (routes.length !== 0) {
                filter_bus_chart(routes)
                filter_rail_chart(routes)
                filterRidershipChart(routes)
            }
        }
    }

    map.on('mouseleave', 'mass-stops', () => {
        map.getCanvas().style.cursor = 'crosshair';
        popup.remove();
    });


});

