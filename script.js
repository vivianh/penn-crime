var app = {

  'init' : function () {
    app.$navBar = $('#navBar');

    // initialize app with all types selected
    app.selectedTypes = app.types.slice(0);
    console.log(app.selectedTypes);

    app.types.forEach(function (type) {
      app.generateNavBar(type);
    });

    $(':checkbox').on('toggle', function () {
      var toggledType = $(this).attr('id').split("-")[1];
      console.log('click!', toggledType);
      var tempIndex = app.selectedTypes.indexOf(toggledType);
      if (tempIndex > -1) {
        app.selectedTypes.splice(tempIndex, 1);
        console.log('splice');
      } else {
        app.selectedTypes.push(toggledType);
        console.log('push');
      }
      // console.log('toggle', app.selectedTypes);
      app.renderType();
    });

    $('.checkAll').click(function () {
      app.types.forEach(function (type) {
        if (app.selectedTypes.indexOf(type) === -1) {
          // $(':checkbox#checkbox-' + type).checkbox('toggle');
          $(':checkbox#checkbox-' + type).checkbox('check');
        }
      });
    });

    $('.clearAll').click(function () {
      console.log(app.selectedTypes);
      app.selectedTypes.forEach(function (type) {
        console.log(type);
        $(':checkbox#checkbox-' + type).checkbox('toggle');
        // $(':checkbox#checkbox-' + type).checkbox('uncheck');
      });
    });

    app.renderMap();
  },

  // other: DUI, Liquor Law, Other Offense, Traffic, Sex Offense
  'types' : [
    'Theft', 'Assault', 'Robbery', 'Rape',
    'Fraud', 'Burglary', 'Aggravated Assault',
    'Homicide', 'Drunkenness', 'Disorderly Conduct',
    'Vandalism', 'Harassment',
  ],

  'generateNavBar' : function (type) {
    app.$navItem = $('<div>')
      .attr('class', 'filter');

    app.$itemLabel = $('<label>')
      .attr('class', 'checkbox')
      .text(type);

    app.$inputItem = $('<input>')
      .attr('type', 'checkbox')
      .attr('id', 'checkbox-' + type)
      .attr('checked', 'checked')
      .attr('data-toggle', 'checkbox')
      .appendTo(app.$itemLabel);

    app.$itemLabel.appendTo(app.$navItem);
    app.$navItem.appendTo(app.$navBar);
  },

  'renderMap' : function () {
    app.map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 15,
      // center: new google.maps.LatLng(39.951788, -75.191719),
      center: new google.maps.LatLng(39.954499, -75.204898),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    });

    app.renderType();
  },

  'renderType' : function () {

    d3.json("output.json", function(data) {
      // console.log(data);

      // filtering 
      data = data.filter(function (d) {
        for (var i = 0; i < app.selectedTypes.length; i++) {
          var type = app.selectedTypes[i];
          if (d.type.trim().indexOf(type) > -1) return true;
        };
        return false;
      });

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
