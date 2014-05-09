var app = {

  'init' : function () {
    app.$navBar = $('#navBar');

    app.types.forEach(function (type) {
      var $button = $('.view' + type);
      $button.click(function () {
        app.renderType(type);
      });
    });

    $('.viewAll').click(function () {
      app.renderType();
    });

    app.renderMap();
  },

  'types' : [
    'Theft', 'Assault', 'Robbery', 'Rape',
    'Fraud', 'Burglary', 'Aggravated Assault',
    'Homicide', 'Drunkenness', 'Disorderly Conduct',
    'Vandalism', 'Harassment',
  ],

  // DUI, Liquor Law, Other Offense, Traffic, Sex Offense

  'renderMap' : function () {
    app.map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 15,
      // center: new google.maps.LatLng(39.951788, -75.191719),
      center: new google.maps.LatLng(39.954499, -75.204898),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    });

    app.renderType();
  },

  'renderType' : function (type) {

    d3.json("output.json", function(data) {
      // console.log(data);

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
              .attr("r", 3.5)
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
