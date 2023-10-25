sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ypf/project1/model/AppJsonModel",
    "ypf/project1/utils/jszip",
    "ypf/project1/utils/xlsx",
    "sap/m/MessageBox",
    "sap/ui/core/message/Message",
    "ypf/project1/services/Services",
    "sap/ui/unified/DateTypeRange",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, AppJsonModel, jszip, xlsx, MessageBox, Message, Services,
        DateTypeRange, MessageToast, Fragment, BusyIndicator) {
        "use strict";
        var dialog;

        return Controller.extend("ypf.project1.controller.View1", {
            onInit: function () {

                /*dialog = new sap.m.BusyDialog({
                    text: "Cargando datos..."
                });*/

                AppJsonModel.initializeModel()
                var oView = this.getView();
                var that = this;
            },           

            onEnviar: function (array) {
                var that = this;
                var oView = this.getView();
                //oView.setBusy(true);
                //dialog.open();
                Services.postData({
                    Key: "",
                    ToMaterial: array

                }).then(oData => {

                    var oModel = oData.ToMaterial.results;
                    var array = [];

                    oModel.forEach((item, i) => {
                        var messageObjet = {};
                        messageObjet.Material = item.NombreMaterial
                        messageObjet.Mensaje = item.Mensaje
                        array.push(messageObjet)

                    })

                    //dialog.close();
                    var jsonModel = new sap.ui.model.json.JSONModel(array);
                    that.getView().setModel(jsonModel, "LogModel");

                    MessageBox.information("Ver Reporte de Log?.", {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            switch (sAction) {
                                case "OK":
                                    /*that.fragmento = sap.ui.xmlfragment("ypf.project1.fragments.log", that);
                                    that.getView().addDependent(that.fragmento);
                                    that.fragmento.open();*/
                                    //dialog.close();
                                    that.oNav(jsonModel);

                                    break;

                                case "DELETE":

                                    break;
                                default:
                                    break;
                            }
                        }
                    });


                }).catch(oErr => {
                    console.log(oErr)
                })

            },

            oNav: function (jsonModel) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.navTo("logTable" , { parameter:  JSON.stringify(jsonModel.oData)});
                oRouter.navTo("logTable" , { parameter:  "0"});

            },


            onGuardar: function (oEvent) {
                var that = this;
                var oView = this.getView();
                const epiList = AppJsonModel.getProperty("/epiList")
                var array = [];


                epiList.forEach(function (lista, i) {

                    var obj = {
                        NombreMaterial: lista.Material,
                        Centro: lista.Centro,
                        PrecioContable2: lista.Precio_Contable_2,
                        PrecioPlan1: lista.Precio_Plan_1,
                        FechaPrecioPlan1: lista.Fecha_PrecioPlan_1,
                        PrecioPlan2: lista.Precio_Plan_2,
                        FechaPrecioPlan2: lista.Fecha_PrecioPlan_2
                    };
                    array.push(obj);
                });

                if (array.length == 0) {
                    MessageBox.information("Ingrese un archivo");
                } else {

                    sap.m.MessageBox.warning("Confirma que desea cargar la información? ", {
                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                        emphasizedAction: sap.m.MessageBox.Action.OK,
                        onClose: function (sAction) {

                            switch (sAction) {
                                case "OK":

                                    that.onEnviar(array);
                                    AppJsonModel.initializeModel();
                                    break;

                                case "DELETE":
                                    that.getView().setBusy(false);
                                    break;
                                default:
                                    break;
                            }



                        }
                    });

                }

            },




            fnReplaceAjusteBS: function (oTable) {

                for (var i in oTable) {

                    var columns = {};
                    // columns['Periodo'] = oTable[i]['Periodo Calendario'].toString();
                    columns['Material'] = oTable[i]['Material'];
                    columns['Centro'] = oTable[i]["Centro"];
                    columns['Precio_Contable_2'] = oTable[i]['Precio Contable 2'];
                    columns['Precio_Fiscal_2'] = oTable[i]['Precio Fiscal 2'];
                    columns['Precio_Plan_1'] = oTable[i]['Precio plan 1'];
                    columns['Fecha_PrecioPlan_1'] = oTable[i]['Fecha precio plan 1 '];
                    columns['Precio_Plan_2'] = oTable[i]['Precio plan 2'];
                    columns['Fecha_PrecioPlan_2'] = oTable[i]['Fecha precio plan 2'];
                    oTable[i] = columns;
                }
                return oTable;
            },
            CerrarDialogo: function (oEvent) {
                sap.ui.getCore().byId("helloDialog").close();
                //AppJsonModel.initializeModel();
            },

            fileReader1: function (oFile) {
                var that = this;
                var excelajusteBS = {};

                var reader = new FileReader();

                reader.onload = function (oEvent) {
                    var data = oEvent.target.result;

                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });

                    workbook.SheetNames.forEach(function (sheetName) {

                        switch (sheetName) {
                            case workbook.SheetNames[0]:
                                excelajusteBS = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                break;
                            default:
                            // code block
                        }
                    });

                    if (excelajusteBS) {

                        var excelajusteBSRe = that.fnReplaceAjusteBS(excelajusteBS);

                        let epiList = AppJsonModel.getProperty("/epiList")
                        epiList = epiList.concat(excelajusteBSRe)
                        AppJsonModel.setProperty("/epiList", epiList)
                        //oLabel.setText(that.geti18nText("registros", [epiList.length]));
                    }

                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                };

                reader.readAsBinaryString(oFile);
            },

            onUploadFile: function (oEvent) {
                this.fileReader1(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);
            },

            geti18nText: function (sText, aVariables = []) {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText, aVariables);
            },

        });

    });