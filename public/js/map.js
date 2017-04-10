(function() {
  var modules = ["esri/map", "esri/dijit/Search", "esri/tasks/locator", "esri/symbols/PictureMarkerSymbol", "esri/InfoTemplate", "dojo/domReady"];

  require(modules, function(Map, Search, Locator, PictureMarkerSymbol, InfoTemplate) {
    var map = new Map("map", {
      center: [36.759327299999995, -1.2881337],
      zoom: 6,
      basemap: "satellite"
    });

    var locatorURL = "https://utility.arcgis.com/usrsvcs/servers/e2ed6e8120be464a88f2fc4bc8268741/rest/services/what3words_EN_English/GeocodeServer";
    var s = new Search({
      sources: [
        {
          locator: new Locator(locatorURL),
          singleLineFieldName: "what3words",
          outFields: ["what3words"],
          name: "W3W",
          placeholder: "e.g. table.spoon.chair",
          highlightSymbol: new PictureMarkerSymbol("images/w3w-pointer.png", 36, 36).setOffset(9, 18),
          infoTemplate: new InfoTemplate("W3W address", "${what3words}")
        }
      ],
      map: map
    }, "search");
    s.startup();
  });
})();
