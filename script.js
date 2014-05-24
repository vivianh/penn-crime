var app = {

  'init' : function () {
    app.$navBar = $('#navBar');

    // app.generateNavBar('yo');

    // initialize with all types
    // app.selectedTypes = app.types;
    app.selectedTypes = ['Theft', 'Assault'];

    $(':checkbox').on('toggle', function () {
      console.log($(this).attr('id'));
      var toggledType = $(this).attr('id').split("-")[1];
      console.log(app.selectedTypes);
      var tempIndex = app.selectedTypes.indexOf(toggledType);
      if (tempIndex > -1) {
        app.selectedTypes.splice(tempIndex, 1);
      } else {
        app.selectedTypes.push(toggledType);
      }
      console.log(app.selectedTypes);
    });

    /*
    app.types.forEach(function (type) {
      var $button = $('.view' + type);
      $button.click(function () {
        // console.log($('.checkbox.checked').length);
        app.renderType(type);
      });
    });
    */

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

  'getSelectedTypes' : function (type) {
    console.log('checked', $('.checked').length);
  },

  'generateNavBar' : function (type) {
    app.$navItem = $('<div>')
      .attr('class', 'filter');

    app.$itemLabel = $('<label>')
      .attr('class', 'checkbox')
      .attr('for', 'checkbox-' + type)
      .text(type);

    /*
    app.$icons = $('<span>')
      .attr('class', 'icons');

    app.$firstIcon = $('<span>')
      .attr('class', 'first-icon')
      .attr('class', 'fui-checkbox-unchecked')
      .appendTo(app.$icons);

    app.$secondIcon = $('<span>')
      .attr('class', 'second-icon')
      .attr('class', 'fui-checkbox-checked')
      .appendTo(app.$icons);

    app.$icons.appendTo(app.$itemLabel);
    */

    app.$inputItem = $('<input>')
      .attr('type', 'checkbox')
      .attr('id', 'checkbox-' + type)
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
