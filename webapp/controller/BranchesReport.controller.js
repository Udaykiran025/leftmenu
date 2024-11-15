sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], function (Controller, ODataModel, MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.BranchesReport", {

        onInit: function () {
            // Initialize ODataModel
            var oModel = new ODataModel("/sap/opu/odata/sap/ZLIBRARY_SRV/");
            this.getView().setModel(oModel);
        },
        onDeleteConfirm: function () {
            var oTable = this.byId("branchesTable");
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
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();

            // Get the data for the selected record
            var oData = oContext.getObject();

            // Get the dialog and set data to dialog fields manually
            var oDialog = this.byId("updateDialog");
            this.byId("updateIssueId").setValue(oData.Id);
            this.byId("updateBookId").setValue(oData.Branch);

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
                Id: this.byId("updateIssueId").getValue(),
                Branch: this.byId("updateBookId").getValue()
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
        },
        onback: function () {
            debugger
            // Navigate to the Report view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("page5"); // 'reportView' is the route name defined in your manifest.json
        },

       
    });
});
