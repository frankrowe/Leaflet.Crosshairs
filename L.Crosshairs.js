/*
 * L.Crosshairs displays a crosshair mouse cursor on the map.
 */

L.Crosshairs = L.LayerGroup.extend({
  options: {
    style: {
      opacity: 1,
      fillOpacity: 0,
      weight: 2,
      color: '#333',
      radius: 20
    }
  },

  initialize: function (options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map

    this.crosshair = {
      mousecircle: L.circleMarker([0, 0], this.options.style),
      longitude_line_north: L.polyline([], this.options.style),
      longitude_line_south: L.polyline([], this.options.style),
      latitude_line_east: L.polyline([], this.options.style),
      latitude_line_west: L.polyline([], this.options.style),
    }
    for (var layer in this.crosshair) {
      this.addLayer(this.crosshair[layer])
    }

    this._oldCursor = this._map.getContainer().style.cursor;
    if (this._oldCursor === undefined) {
      this._oldCursor = 'default';
    }

    this._map.getContainer().style.cursor = 'none'

    this._map.on('mousemove', this._moveCrosshairs.bind(this))
    this._map.on('zoomend', this._moveCrosshairs.bind(this))
    this._map.on('mouseout', this._hide.bind(this))
    this._map.on('mouseover', this._show.bind(this))

    this.eachLayer(map.addLayer, map);
  },

  onRemove: function (map) {
    this._map.off('mousemove', this._moveCrosshairs)
    this._map.off('zoomend', this._moveCrosshairs)
    this.eachLayer(this.removeLayer, this);
    this._map.getContainer().style.cursor = this._oldCursor;
  },

  _show: function() {
    this.eachLayer(function(l) {
      this._map.addLayer(l)
    }, this)
  },

  _hide: function() {
    this.eachLayer(function(l) {
      this._map.removeLayer(l)
    }, this)
  },

  _moveCrosshairs: function (e) {
    var latlng = e.latlng ? e.latlng : this.crosshair.mousecircle.getLatLng()
    this.crosshair.mousecircle.setLatLng(latlng)
    var point = this._map.project(latlng)
    this.crosshair.longitude_line_north.setLatLngs([
      this._map.unproject([point.x, point.y - this.options.style.radius/2]),
      this._map.unproject([point.x, this._map.getPixelBounds().min.y])
    ])
    this.crosshair.longitude_line_south.setLatLngs([
      this._map.unproject([point.x, point.y + this.options.style.radius/2]),
      this._map.unproject([point.x, this._map.getPixelBounds().max.y])
    ])
    this.crosshair.latitude_line_east.setLatLngs([
      this._map.unproject([point.x - this.options.style.radius/2, point.y]),
      this._map.unproject([this._map.getPixelBounds().min.x, point.y])
    ])
    this.crosshair.latitude_line_west.setLatLngs([
      this._map.unproject([point.x + this.options.style.radius/2, point.y]),
      this._map.unproject([this._map.getPixelBounds().max.x, point.y])
    ])
  }
})

L.crosshairs = function (options) {
  return new L.Crosshairs(options)
}
