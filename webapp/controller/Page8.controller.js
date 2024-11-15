sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",          // Ensure this is included
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input"
], function (Controller, MessageBox, MessageToast, Dialog, Button, Text, Label, Input) {
    "use strict";
    
    return Controller.extend("leftmenu.controller.Page8", {
        onInit: function () {
            // Any initial logic for the TableView
        },
        onModifyItem: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oModel = this.getView().getModel();
            var sPath = oItem.getBindingContext().getPath();
            var oData = oModel.getProperty(sPath);
        
            // Create a dialog instance
            var oDialog = new sap.m.Dialog({
                title: "Modify Category",
                contentWidth: "400px",
                content: [
                    new sap.m.Label({ text: "Category ID" }),
                    new sap.m.Input({ value: oData.CatId, editable: false }),  // Non-editable
                    new sap.m.Label({ text: "Category" }),
                    new sap.m.Input({ value: oData.Category, id: "inputCategory" }),
                    new sap.m.Label({ text: "Max Allowed" }),
                    new sap.m.Input({ value: oData.MaxAllowed, id: "inputMaxAllowed" })
                ],
                beginButton: new sap.m.Button({
                    text: "Save",
                    icon: "sap-icon://add",
                    press: function () {
                        var sNewCategory = sap.ui.getCore().byId("inputCategory").getValue();
                        var sNewMaxAllowed = sap.ui.getCore().byId("inputMaxAllowed").getValue();
        
                        // Ensure MaxAllowed is a valid number
                        oData.Category = sNewCategory;
                        oData.MaxAllowed = parseInt(sNewMaxAllowed, 10);  // Convert to number
        
                        // Simple update request
                        oModel.update(sPath, oData, {
                            success: function () {
                                sap.m.MessageToast.show("Record updated successfully.");
                            },
                            error: function (oError) {
                                sap.m.MessageBox.error("Error updating record: " + oError.message);
                            }
                        });
        
                        // Close and destroy the dialog
                        oDialog.close();
                        oDialog.destroy();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                        oDialog.destroy();  // Ensure dialog is destroyed
                    }
                })
            });
        
            oDialog.open();
        },
        onDeleteItem: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oBindingContext = oItem.getBindingContext();
            var oModel = this.getView().getModel();

            // Confirm Deletion
            MessageBox.confirm("Are you sure you want to delete this item?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        // Remove the item from the model
                        oModel.remove(oBindingContext.getPath(), {
                            success: function () {
                                MessageToast.show("Item deleted successfully.");
                            },
                            error: function () {
                                MessageBox.error("Error occurred while deleting the item.");
                            }
                        });
                    }
                }
            });
        }
    });
});
