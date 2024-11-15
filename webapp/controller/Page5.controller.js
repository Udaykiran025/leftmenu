sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller,MessageToast) {
    "use strict";
    return Controller.extend("leftmenu.controller.Page5", {
        onInit: function () {     
        },
        onsave: function () {
            debugger
        var oView = this.getView();
        var oMobileInput1 = oView.byId("name");
        var oNameInput = oView.byId("name1");
        if (!oNameInput.getValue() ||
        !oMobileInput1.getValue()
        ) {
       sap.m.MessageToast.show("Please fill out all required fields.");
      return;
    }
    var oModel = this.getView().getModel();
            var oNewRecord = {
                Id: this.byId("name").getValue(),
                Branch: this.byId("name1").getValue() 
            };
            // Submit the new record to the OData service
            oModel.create("/zbranchesSet", oNewRecord, {
                success: function () 
                {
                    MessageToast.show("Record created successfully!");
                }, 
                error: function () {
                    MessageToast.show("Error creating record.");
                }
            });
    sap.m.MessageToast.show("Registration successful!");
   },
   oncancel: function () {
    debugger
    var oView = this.getView();
    // Reset all input fields
    oView.byId("name").setValue("");
    oView.byId("name1").setValue("");
   },
   onpreview : function () {
    debugger
    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("BranchesReport");
   }

    });
});
