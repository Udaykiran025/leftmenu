sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.Page1", {
        onInit: function () {
            // Initialize the local JSON model to bind form data
            var oFormModel = new sap.ui.model.json.JSONModel({
                //StudentId: "9",
                //FirstName: "UDAY",
                //LastName: "KIRAN",
                //RollNum: "ME2023",
                //Branch: "2",
                //Year1: "2023",
                //EmailId: "UDAY@GMAIL.COM",
               // Approved: "1",
               // Rejected: "1",
                //Category: "2",
                //BooksIssued: "1"
            });
            this.getView().setModel(oFormModel, "formData");
        },

        handleSave: function () {
            debugger;
            var oView = this.getView();
        
            // Get input fields by ID
            var oStudentId = oView.byId("studentid").getValue();
            var oFirstName = oView.byId("firstname").getValue();
            var oLastName = oView.byId("lastname").getValue();
            var oRollNumber = oView.byId("rollnumber").getValue();
            var oBranch = oView.byId("branch").getSelectedKey();
            var oYear = oView.byId("_IDMA2928").getSelectedKey();
            var oEmailId = oView.byId("emailid").getValue();
           // var oApproved = oView.byId("approved").getValue();
           // var oRejected = oView.byId("rejected").getValue();
            var oCategory = oView.byId("category").getSelectedKey();
          //  var oBooksIssued = oView.byId("booksissued").getValue();
        
            // Check if required fields are filled
            if (!oStudentId || !oFirstName || !oLastName || !oRollNumber || !oBranch ||  //    !oApproved || !oRejected ||
                  !oCategory ) {
                MessageBox.error("Please fill all required fields.");
                return;
            }
        
            // Get the OData model
            var oModel = oView.getModel();
        
            // Construct the path to check for the existing StudentId
            var sPath = "/zstudentsSet(" + oStudentId + ")";
        
            // Check if the StudentId already exists
            oModel.read(sPath, {
                success: function (oData) {
                    // StudentId exists
                    MessageBox.error("A record with StudentId " + oStudentId + " already exists.");
                },
                error: function (oError) {
                    // StudentId does not exist, proceed with the create operation
                    if (oError.statusCode === 404) { // 404 means the record was not found
                        var oDataPayload = {
                            StudentId: parseInt(oStudentId, 10),
                            FirstName: oFirstName,
                            LastName: oLastName,
                            RollNum: oRollNumber,
                            Branch: parseInt(oBranch, 10),
                            Year1: parseInt(oYear, 10),
                            EmailId: oEmailId,
                           // Approved: parseInt(oApproved, 10),
                           // Rejected: parseInt(oRejected, 10),
                            Category: parseInt(oCategory, 10),
                           // BooksIssued: parseInt(oBooksIssued, 10)
                        };
        
                        // Send a create request to the OData service
                        oModel.create("/zstudentsSet", oDataPayload, {
                            success: function () {
                                MessageToast.show("Record created successfully.");
                            },
                            error: function (oCreateError) {
                                try {
                                    var oErrorResponse = JSON.parse(oCreateError.responseText);
                                    MessageBox.error("Error creating record: " + oErrorResponse.error.message.value);
                                } catch (e) {
                                    MessageBox.error("Error creating record: " + oCreateError.message);
                                }
                            }
                        });
                    } else {
                        MessageBox.error("Error checking StudentId: " + oError.message);
                    }
                }
            });
        },
        

        onReset: function () {
            debugger;
            var oView = this.getView();
            // Reset all input fields
            oView.byId("studentid").setValue("");
            oView.byId("firstname").setValue("");
            oView.byId("lastname").setValue("");
            oView.byId("rollnumber").setValue("");
            oView.byId("branch").setSelectedKey("");
            oView.byId("_IDMA2928").setSelectedKey(""); // Reset Select control using setSelectedKey
            oView.byId("emailid").setValue("");
          //  oView.byId("approved").setValue("");
          //  oView.byId("rejected").setValue("");
            oView.byId("category").setSelectedKey("");
           // oView.byId("booksissued").setValue("");
        },

        onCancel: function () {
            // Navigate back or perform any cancel actions
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("home"); // Assuming 'home' is the name of your route for the main page
        },

        OnviewReport: function () {
            // Navigate to the report page
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("studentsreport"); // Adjust the route name based on your report view
        }
    });
});
