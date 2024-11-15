sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, MessageBox, JSONModel, Dialog, Button, Text, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.studentsreport", {
        onInit: function () {
            // Create a JSON model for the dialog to hold the data
            var oDialogModel = new JSONModel();
            this.getView().setModel(oDialogModel, "dialogModel");
        },

        // Handle Update button press
        onupdate: function (oEvent) {
            debugger
            var oSelectedItem = oEvent.getSource().getParent().getParent(); // Get the selected row
            var oContext = oSelectedItem.getBindingContext(); // Get the context of the selected row

            // Get the data of the selected record
            var oData = oContext.getObject();

            // Set the data to the dialog model
            this.getView().getModel("dialogModel").setData(oData);

            // Load the fragment as a dialog
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "leftmenu.view.StudentDialog", this);
                this.getView().addDependent(this.oDialog);
            }

            // Open the dialog
            this.oDialog.open();
        },

        // Handle Save button press in the dialog
        onSave: function () {
            debugger
            var oModel = this.getView().getModel(); // Get the OData model
            var oDialogModel = this.getView().getModel("dialogModel"); // Get the dialog model data
            var oData = oDialogModel.getData(); // Get the updated data from the dialog

            // Ensure proper data type conversions
            var iStudentId = parseInt(oData.StudentId, 10);
            var oDataPayload = {
                StudentId: iStudentId,
                FirstName: oData.FirstName,
                LastName: oData.LastName,
                Approved: parseInt(oData.Approved, 10),
                Rejected: parseInt(oData.Rejected, 10),
                Category: parseInt(oData.Category, 10),
                RollNum: oData.RollNum,
                Branch: parseInt(oData.Branch, 10),
                Year1: parseInt(oData.Year1, 10),
                BooksIssued: parseInt(oData.BooksIssued, 10),
                EmailId: oData.EmailId
            };

            // Construct the path for the OData update with the correct integer type for StudentId
            var sPath = "/zstudentsSet(" + iStudentId + ")";

            // Update the OData service with the modified data
            oModel.update(sPath, oDataPayload, {
                success: function () {
                    MessageBox.success("Record updated successfully");
                    oModel.refresh();
                },
                error: function () {
                    MessageBox.error("Failed to update the record");
                }
            });

            // Close the dialog
            this.oDialog.close();
        },

        // Handle Delete button press
        ondelete: function (oEvent) {
            var oSelectedItem = oEvent.getSource().getParent().getParent(); // Get the selected row
            var oContext = oSelectedItem.getBindingContext(); // Get the context of the selected row
            var sStudentId = oContext.getProperty("StudentId"); // Get the StudentId

            // Show confirmation dialog
            MessageBox.confirm("Are you sure you want to delete this record?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === "OK") {
                        var iStudentId = parseInt(sStudentId, 10); // Ensure StudentId is treated as an integer
                        var sPath = "/zstudentsSet(" + iStudentId + ")"; // Construct the path for OData delete

                        // Get the OData model
                        var oModel = oSelectedItem.getModel();

                        // Delete the record from the OData service
                        oModel.remove(sPath, {
                            success: function () {
                                MessageBox.success("Record deleted successfully");
                                oModel.refresh();
                            },
                            error: function () {
                                MessageBox.error("Failed to delete the record");
                            }
                        });
                    }
                }
            });
        },

        // Close the dialog
        onCancel: function () {
            this.oDialog.close();
        },

        // Handle Back button press
        OnPressBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("page1");
        }
    });
});
