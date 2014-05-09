var app = {

  'init' : function () {
    app.$navBar = $('#navBar');

    app.$viewTheft       = $('.viewTheft');
    app.$viewAssault     = $('.viewAssault');

    app.setViewTheft(app.$viewTheft);
    app.setViewAssault(app.$viewAssault);

    app.renderMap();
  },

  'setViewTheft' : function ($button) {
    $button.click(function () {
      console.log('render theft');
      app.renderType('Theft');
    });
  },

  'setViewAssault' : function ($button) {
    $button.click(function () {
      console.log('render assault');
      app.renderType('Assault');
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

      // filtering 
      if (type !== undefined) {
        data = data.filter(function (d) {
          return d.type.trim().indexOf(type) > -1;
        });
      }

      var overlay = new google.maps.OverlayView();
      overlay.onAdd = function() {
        // var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "crimes");

        overlay.draw = function() {
          var projection = this.getProjection(),
              padding = 10;

          d3.selectAll("svg").remove();

          var marker = layer.selectAll("svg")
              // .data(d3.entries(data))
              .data(data, function (d) {
                // console.log(d.date + ',' + d.time);
                return d.date + ',' + d.time
              });
              // .each(transform);

          marker.enter()
              .append("svg:svg")
              .each(transform)
              .attr("class", "marker");
              /*
              .on("click", function (d) {
                  console.log(d.value.type);
                });
              */
          
          marker.exit()
              .remove();

          marker.append("svg:circle")
              .attr("r", 3)
              .attr("cx", padding)
              .attr("cy", padding);

          function transform(d) {
            d = new google.maps.LatLng(d.lat, d.lng);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top",  (d.y - padding) + "px");
          };
        };
      };

      overlay.setMap(app.map);
    });
  }
}

$(document).ready(app.init);
