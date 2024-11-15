sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.booksReport", {

        onInit: function () {
            // Initialize ODataModel
            var oModel = new ODataModel("/sap/opu/odata/sap/ZLIBRARY_SRV/");
            this.getView().setModel(oModel);
        },
        onback: function() {
            //debugger
            // this.getRouter().navTo("RouteDisplaY", {}, true /*no history*/);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("page6");
         },
        onDeleteConfirm: function () {
            var oTable = this.byId("bookissueTable");
            var oSelectedItem = oTable.getSelectedItem();
            if (!oSelectedItem) {
                MessageToast.show("No item selected for deletion");
                return;
            }

            var oModel = this.getView().getModel();
            var oContext = oSelectedItem.getBindingContext();
            var sPath = oContext.getPath();

            // Delete the selected record
            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Record deleted successfully");
                },
                error: function () {
                    MessageToast.show("Failed to delete record");
                }
            });

            // Close the delete dialog
            this.byId("deleteDialog").close();
        },

        onDeleteCancel: function () {
            this.byId("deleteDialog").close();
        },

        onListItemPress: function (oEvent) {
            // Handle selection of items in the table if needed
        },

        onListItem1: function () {
            var oDeleteDialog = this.byId("deleteDialog");
            oDeleteDialog.open();
        },

        onEdit: function (oEvent) {
            debugger
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();

            // Get the data for the selected record
            var oData = oContext.getObject();

            // Get the dialog and set data to dialog fields manually
            var oDialog = this.byId("updateDialog");
            this.byId("updateIssueId").setValue(oData.BookId);
            this.byId("updateBookId").setValue(oData.Title);
            this.byId("updateAvailableStatus").setValue(oData.Author);
            this.byId("updateAddedByI").setValue(oData.Description);
            this.byId("updateAddedByJ").setValue(oData.CategoryId);
            this.byId("updateAddedByK").setValue(oData.AddedBy);
            this.byId("updateAddedByL").setValue(oData.AddedAtTimestamp);

            // Set the input fields to be read-only for the Id
            this.byId("updateIssueId").setEditable(false);

            // Set dialog's binding context
            oDialog.setBindingContext(oContext);

            // Open the dialog
            oDialog.open();
        },

        onUpdateConfirm: function () {
            var oDialog = this.byId("updateDialog");
            var oModel = this.getView().getModel();

            // Get the updated data from the dialog fields
            var sPath = oDialog.getBindingContext().getPath();
            var oData = {
                BookId: parseInt(this.byId("updateIssueId").getValue(), 10),
                Title: this.byId("updateBookId").getValue(),
                Author: this.byId("updateAvailableStatus").getValue(),
                Description: this.byId("updateAddedByI").getValue(),
                CategoryId: parseInt(this.byId("updateAddedByJ").getValue(), 10),
                AddedBy: parseInt(this.byId("updateAddedByK").getValue(), 10),
                //AddedAtTimestamp: parseInt(this.byId("updateBookIdL").getValue(), 10),
            };


            // Update the record
            oModel.update(sPath, oData, {
                success: function () {
                    MessageToast.show("Record updated successfully");
                    oModel.refresh();
                    oDialog.close();
                },
                error: function () {
                    MessageToast.show("Failed to update record");
                }
            });
        },

        onUpdateCancel: function () {
            this.byId("updateDialog").close();
        }

       
    });
});
      
 
