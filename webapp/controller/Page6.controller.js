sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller,MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.Page6", {
        onInit: function () {
              // Set up the OData model
              var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLIBRARY_SRV");
              this.getView().setModel(oModel);
        },
        formatDateTimeToISO: function (date) {
            if (!date) return '';
            return date.toISOString(); // Convert Date to ISO 8601 string
        },      
        onNavdetail: function() {
            //debugger
            // this.getRouter().navTo("RouteDisplaY", {}, true /*no history*/);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("booksReport");
         },
         save: function () {
            var oView = this.getView();
            var oModel = oView.getModel(); // Ensure this is an ODataModel

            // Collect values from the form fields
            var oNewRecord = {
                BookId: parseInt(oView.byId("name").getValue(), 10),
                Title: oView.byId("_IDGenInput1").getValue(),
                Author: oView.byId("_IDGenInput4").getValue(),
                Description: oView.byId("_IDGenFormElement7").getValue(),
                CategoryId: parseInt(oView.byId("bookIsueSelect").getSelectedKey(), 10),
                AddedBy: parseInt(oView.byId("ookIssueSelect").getSelectedKey(), 10),
                AddedAtTimestamp: this.formatDateTimeToISO(oView.byId("DTP1").getDateValue())
            };

            // Validate required fields
            if (!oNewRecord.BookId ||
                !oNewRecord.Title ||
                !oNewRecord.Author ||
                !oNewRecord.Description ||
                !oNewRecord.CategoryId ||
                !oNewRecord.AddedBy ||
                !oNewRecord.AddedAtTimestamp) {
                MessageToast.show("Please fill out all required fields.");
                return;
            }

            // Ensure the OData model is being used
            if (oModel instanceof sap.ui.model.odata.v2.ODataModel) {
                oModel.create("/zbooksSet", oNewRecord, {
                    success: function () {
                        MessageToast.show("Record created successfully!");
                    },
                    error: function () {
                        MessageToast.show("Error creating record.");
                    }
                });
            } else {
                MessageToast.show("Model is not an OData model.");
            }
        },
    cancel: function () {
        debugger
        var oView = this.getView();
        // Reset all input fields
        oView.byId("name").setValue("");
        oView.byId("_IDGenInput1").setValue("");
        oView.byId("_IDGenInput4").setValue("");
        oView.byId("_IDGenFormElement7").setValue("");
        oView.byId("bookIsueSelect").getSelectedKey()("");
        oView.byId("ookIssueSelect").getSelectedKey()("");
        oView.byId("DTP1").setValue("");
       }
    
    });
});


