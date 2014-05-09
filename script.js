var app = {
  'init' : function () {
    app.$navBar = $('#navBar');
    app.$viewByType = $('.viewByType');
    // console.log(app.$viewByType);
    app.setViewTheft(app.$viewByType);
    app.renderMap();
  },

  'setViewTheft' : function ($button) {
    $button.click(function () {
      // console.log('clicking button!');
      app.renderType('Theft');
    });
  },

  'renderMap' : function () {
    app.map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 15,
      center: new google.maps.LatLng(39.951788, -75.191719),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    });
    app.renderType();
  },

  'renderType' : function (type) {
    d3.json("output.json", function(data) {

      console.log('type', type);
      if (type !== undefined) {
        // filtering 
        var data = data.filter(function (d) {
          return d.type.trim() === type;
        });
      }

      var overlay = new google.maps.OverlayView();

      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "crimes");

        overlay.draw = function() {
          var projection = this.getProjection(),
              padding = 10;

          var marker = layer.selectAll("svg")
              .data(d3.entries(data))
              .each(transform)
              .enter()
              .append("svg:svg")
              .each(transform)
              .attr("class", "marker")
              .on("click", function (d) {
                  console.log(d.value.type);
                });

          marker.append("svg:circle")
              .attr("r", 3)
              .attr("cx", padding)
              .attr("cy", padding);

          function transform(d) {
            d = new google.maps.LatLng(d.value.lat, d.value.lng);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top",  (d.y - padding) + "px");
          };
        };
      };
      console.log(typeof overlay);
      overlay.setMap(app.map);
    });
  }
}

$(document).ready(app.init);
