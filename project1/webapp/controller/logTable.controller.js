sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, History, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("ypf.project1.controller.logTable", {
      onInit() {

        var oDatosProveedores = {
          Data: [{
            "Material": "189692",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "W"
          }, {
            "Material": "189693",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "S"
          }, {
            "Material": "189694",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "E"
          }, {
            "Material": "189695",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "W"
          }, {
            "Material": "189696",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "S"
          }, {
            "Material": "189697",
            "Mensaje": "CURRENCY initial, currency amount 10,0000 in TAXPRICE_2",
            "Status": "E"
          }]
        };
        var oNewModel = new sap.ui.model.json.JSONModel(oDatosProveedores.Data);
        this.getView().setModel(oNewModel, "ModelPruebas");


        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("logTable").attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {

        var oModel = oEvent.getParameter("arguments").parameter.split(';');
        var oModeloParse = JSON.parse(oModel);
        var newModel = new sap.ui.model.json.JSONModel(oModeloParse);
        this.getView().setModel(newModel, "LogModel2");


      },
      onSearch: function (evt) {
        var MaterialValue = this.getView().byId("SF").getValue();
        var aFilter = [];
        var oList = this.getView().byId("id-table");
        var oBinding = oList.getBinding("items");
        if (MaterialValue) {
          aFilter.push(new Filter("Material", FilterOperator.Contains, MaterialValue));
        }
        oBinding.filter(aFilter);


      },
      onFilterSelect: function (evt) {

        var aFilter = [];
        var sQuery = evt.getSource().getSelectedKey();

        if (sQuery) {
          aFilter.push(new Filter("Status", FilterOperator.Contains, sQuery));
        }


        var oList = this.getView().byId("id-table");
        var oBinding = oList.getBinding("items");

        oBinding.filter(aFilter);



      },
      onNavBack: function (oEvent) {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("View1", true);
        }
      }
    });
  }
);