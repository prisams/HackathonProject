/**
 * Created by Priyanka on 7/31/2015.
 */
define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/promise/all",
  "dijit/_WidgetBase",
  "esri/opsdashboard/DataSourceProxy",
  "dijit/_TemplatedMixin",
  "esri/opsdashboard/WidgetProxy",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "dojo/store/Memory",
  "dojo/store/Observable",
  "esri/tasks/query",
  "dgrid/OnDemandGrid",
  "dojo/text!./TableWidgetTemplate.html"
], function (declare, lang, all, _WidgetBase, DataSourceProxy, _TemplatedMixin, WidgetProxy, SimpleLineSymbol, SimpleFillSymbol, Color, Memory, Observable, Query, Grid, templateString) {


  return declare("TableWidget", [_WidgetBase, _TemplatedMixin, WidgetProxy], {
    templateString: templateString,
    debugName: "TableWidget",

    constructor: function () {
      this.url1 = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/0";
      this.url2 = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/1";
    },
    hostReady: function () {

      // Create the store we will use to display the features in the grid
      //this.store = new Observable(new Memory());
      var dataSource = this.dataSourceProxies[0];
      var dataSourceConfig = this.getDataSourceConfig(dataSource);
      console.log(this);

      // Build a collection of fields that we can display
      var fieldsToQuery = [];
      var columns = [];
      dataSource.fields.forEach(function (field) {
        switch (field.type) {
          case "esriFieldTypeString":
          case "esriFieldTypeSmallInteger":
          case "esriFieldTypeInteger":
          case "esriFieldTypeSingle":
          case "esriFieldTypeDouble":
            fieldsToQuery.push(field.name);
            columns.push({field: field.name});
            return;
        }
      });

      // Create the query object
      fieldsToQuery.push(dataSource.objectIdFieldName);
      this.query = new Query();
      this.query.outFields = fieldsToQuery;
      this.query.returnGeometry = true;

      //this.getMapWidgetProxies().then(function (proxy) {
      //
      //  this.mapWidgetProxy = proxy[0];
      //  console.log("Map Widget Proxy");
      //
      //  this.mapWidgetProxy.createGraphicsLayerProxy().then(lang.hitch(this, function (result) {
      //    this.emergencyResponseLayerProxy = result;
      //    console.log("Graphics Layer Proxy");
      //  }));
      //}).bind(this);


      //
      //console.log("Graphics Layer created");
      //all({
      //  emergencyResponseLayer_Proxy: this.mapWidgetProxy.createGraphicsLayerProxy()
      //}).then(lang.hitch(this, function (results) {
      //  this.emergencyResponseLayerProxy = results.emergencyResponseLayer_Proxy;
      //}));

      // Get from the data source and the associated data source config
      // The dataSourceConfig stores the fields selected by the operation view publisher during configuration

    },

    DateEvent1: function () {
      console.log("Hello from button1");
      console.log(this.url1);
      this.updateLayer(this.dataSourceName, this.featureset);
    },
    DateEvent2: function () {
      console.log("Hello from button 2");
      console.log(this.url2);
    },

    dataSourceExpired: function (dataSource, dataSourceConfig) {

      //dataSource.selectFeatures(this.query);
      // Execute the query. A request will be sent to the server to query for the features.
      // The results are in the featureSet
      console.log("Data Source expired");
      dataSource.executeQuery(this.query).then(lang.hitch(this, function (featureSet) {
        this.featureset = featureSet;
        this.dataSourceName = dataSource.name;
        // highlight the layer
        //this.updateLayer(dataSource.name, featureSet);


      }));
    },

    updateLayer: function (dataSourceName, featureSet) {

      // Compose the correct string to display
      var dataSourceInfo = dataSourceName;
      var featureCount = featureSet.features.length;
      this.selectedLayerGraphics = [];

      for (var i = 0; i < featureCount; i++) {
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([209, 14, 14]), 2), new Color([209, 14, 14, 0.5])
        );
        var selectedLayerGraphic = featureSet.features[i];
        selectedLayerGraphic.setSymbol(symbol);
        this.selectedLayerGraphics.push(selectedLayerGraphic);
      }

      this.getMapWidgetProxies().then(function (proxy) {

        this.mapWidgetProxy = proxy[0];
        console.log("Map Widget Proxy");

        this.mapWidgetProxy.createGraphicsLayerProxy().then(function (result) {
          this.emergencyResponseLayerProxy = result;
          console.log("Graphics Layer Proxy");
          this.emergencyResponseLayerProxy.addOrUpdateGraphics(this.selectedLayerGraphics);

        }.bind(this));
      }.bind(this));


    }

  });
});
