sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, ODataModel, JSONModel) {
  "use strict";

  return Controller.extend("leftmenu.controller.Page2", {
    onInit: function () {
    // Initialize the OData model and set it to the view
    var oModel = this.getOwnerComponent().getModel(); // Get the OData model from the component
    this.getView().setModel(oModel); // Set it to the view
    this._oODataModel = oModel;

    // Initialize and set the JSON model for form data
    this._oViewModel = new JSONModel({
        categoryId: "",
        category: "",
        maxAllowed: ""
    });
    this.getView().setModel(this._oViewModel, "formData");
},
onSave: function () {
  var oView = this.getView();
  var oFormModel = oView.getModel("formData"); // Use the 'formData' model

  if (!oFormModel) {
      console.error("Form data model is not initialized or undefined.");
      return;
  }

  // Retrieve values from the model (bound to the form inputs)
  var sCatId = oFormModel.getProperty("/categoryId");
  var sCategory = oFormModel.getProperty("/category");
  var iMaxAllowed = oFormModel.getProperty("/maxAllowed");

  // Ensure all necessary fields are filled
  if (sCatId === undefined || sCategory === undefined || iMaxAllowed === undefined) {
      MessageToast.show("Please fill in all required fields.");
      return;
  }

  // Prepare the data to be sent to the backend
  var oNewEntry = {
      CatId: parseInt(sCatId, 10), // Convert to integer (Edm.Int16)
      Category: sCategory,        // String (Edm.String)
      MaxAllowed: parseInt(iMaxAllowed, 10) // Convert to byte (Edm.Byte)
  };

  // Send the data to the backend using the OData model
  this._oODataModel.create("/zstudent_categorySet", oNewEntry, {
      success: function () {
          MessageToast.show("Entry created successfully!");
      },
      error: function (oError) {
          var errorDetails = oError.responseText ? JSON.parse(oError.responseText) : {};
          var errorMessage = errorDetails.error.message.value || "Error creating entry.";
          MessageToast.show(errorMessage);
          console.error("Error details:", errorDetails);
      }
  });
},

onReset: function () {
  // Reset the form
  this._oViewModel.setData({
      categoryId: "",
      category: "",
      maxAllowed: ""
  });
},

onCancel: function () {
  // Navigate back or close the dialog
  var oHistory = sap.ui.core.routing.History.getInstance();
  var sPreviousHash = oHistory.getPreviousHash();

  if (sPreviousHash !== undefined) {
      window.history.go(-1);
  } else {
      this.getOwnerComponent().getRouter().navTo("defaultRoute", {}, true);
  }
},
onShowTableContent: function(){
    var oRouter = this.getOwnerComponent().getRouter();
    oRouter.navTo("page8");
}
});
});
