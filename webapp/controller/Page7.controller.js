sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel"  // Ensure JSONModel is imported here
], function (Controller, MessageToast, MessageBox, ODataModel, JSONModel) {
    "use strict";

    return Controller.extend("leftmenu.controller.Page7", {
        onInit: function () {
            // Initialize the OData model and set it to the view
            var oModel = this.getOwnerComponent().getModel(); // Get the OData model from the component
            this.getView().setModel(oModel); // Set it to the view
            this._oODataModel = oModel;

            // Initialize and set the JSON model for form data
            this._oViewModel = new JSONModel({
                id: "",
                categoryy: ""
            }); 
            this.getView().setModel(this._oViewModel, "formData");
        },
        
        onSave: function () { 
            debugger
        var oView = this.getView();
        var oMobileInput1 = oView.byId("name1");
        var oCategorySelect = oView.byId("categorySelect");
        if (!oMobileInput1.getValue() || !oCategorySelect.getSelectedItem())
             { 
       sap.m.MessageToast.show("Please fill out all required fields.");
      return;
    } 
    
    var oBranchSelect= oCategorySelect.getSelectedItem().getKey();
        var oModel = this.getView().getModel();
            var oNewRecord = {
                Id: this.byId("name1").getValue(), 
                Categoryy:  oBranchSelect
                
            };
            // Submit the new record to the OData service
            oModel.create("/zbook_categorySet", oNewRecord, {
                success: function () {
                    MessageToast.show("Record created successfully!");
                },
                error: function () {
                    MessageToast.show("Error creating record.");
                }
            });
    sap.m.MessageToast.show("Registration successful!");
   },
   onCancel: function () {
    debugger
    var oView = this.getView();
    // Reset all input fields
    oView.byId("name1").setValue(""); 
    oView.byId("categorySelect").setSelectedKey("");
   },
   onNavdetail: function() {
    debugger
    // this.getRouter().navTo("RouteDisplaY", {}, true /*no history*/);
    var oRouter = this.getOwnerComponent().getRouter();
    oRouter.navTo("booksCategoryReport");
 },
    });
});
