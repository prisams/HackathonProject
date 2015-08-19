/**
 * Created by Priyanka on 7/31/2015.
 */
define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dijit/_WidgetBase",
  "esri/opsdashboard/DataSourceProxy",
  "dijit/_TemplatedMixin",
  "esri/opsdashboard/WidgetProxy",
  "dojo/store/Memory",
  "dojo/store/Observable",
  "esri/tasks/query",
  "dgrid/OnDemandGrid",
  "dojo/text!./TableWidgetTemplate.html"
], function (declare, lang, _WidgetBase, DataSourceProxy, _TemplatedMixin, WidgetProxy, Memory, Observable, Query, Grid, templateString) {


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

      // Get from the data source and the associated data source config
      // The dataSourceConfig stores the fields selected by the operation view publisher during configuration
      var dataSource = this.dataSourceProxies[0];
      var dataSourceConfig = this.getDataSourceConfig(dataSource);
      console.log(this);
      var element = document.createElement("input");
      element.onclick = function () {
        alert('Clicked!');
      };
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

      //// Create the grid
      //this.grid = new Grid({
      //  store: this.store,
      //  cleanEmptyObservers: false,
      //  columns: columns
      //}, this.gridDiv);
      //
      //this.grid.startup();
      //
      // Create the query object
      fieldsToQuery.push(dataSource.objectIdFieldName);
      this.query = new Query();
      this.query.outFields = fieldsToQuery;
      this.query.returnGeometry = false;
    },

    DateEvent1: function () {
      console.log("Hello from button1");
      console.log(this.url1);
      this.selectFeatures(this.query);
    },
    DateEvent2: function () {
      console.log("Hello from button 2");
      console.log(this.url2);
    },
    DateEvent3: function () {
      console.log("Hello from button 3")
    },
    dataSourceExpired: function (dataSource, dataSourceConfig) {


      dataSource.selectFeatures(this.query);
      // Execute the query. A request will be sent to the server to query for the features.
      // The results are in the featureSet
      //dataSource.executeQuery(this.query).then(lang.hitch(this, function (featureSet) {
      //
      //
      //
      //  // Show the name of the data source and the number of features returned from the query
      //  this.updateDataSourceInfoLabel(dataSource.name, featureSet);
      //
      //  // Show the features in the table
      //  this.updateAttributeTable(featureSet, dataSource);
      //}));
    },

    updateDataSourceInfoLabel: function (dataSourceName, featureSet) {

      // Compose the correct string to display
      var dataSourceInfo = dataSourceName;
      var featureCount = featureSet.features.length;
      if (featureCount === 0)
        dataSourceInfo += " has no feature";
      else
        dataSourceInfo += " has " + featureCount + " features";

      this.infoLabel.innerHTML = dataSourceInfo;
    },

    updateAttributeTable: function (featureSet, dataSource) {
      // For each feature put them in the store and overwrite any existing
      // Potential improvement: Remove from the store the features that were not part of this update.
      featureSet.features.forEach(lang.hitch(this, function (feature) {
        this.store.put(feature.attributes, {overwrite: fasle, id: feature.attributes[dataSource.objectIdFieldName]});
      }));
    }
  });
});
