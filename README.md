Leaflet.Crosshairs
------------

Displays a crosshair mouse cursor on the map.

Usage
-----

Include the `L.Crosshair.js` file and create a `map`, then call:

```JavaScript
L.crosshairs().addTo(map)

//Style Options
L.crosshairs({
  style: {
    opacity: 1,
    fillOpacity: 0,
    weight: 2,
    color: '#333',
    radius: 20
  }
})
```
