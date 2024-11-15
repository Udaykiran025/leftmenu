sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox"
], function (Controller, ODataModel, MessageToast, JSONModel, BusyIndicator, MessageBox) {
    "use strict";

    return Controller.extend("leftmenu.controller.Page4", {
        onInit: function () {
            var oModel = new ODataModel("/sap/opu/odata/sap/ZLIBRARY_SRV/");
            this.getView().setModel(oModel);
        },
        
        handleSave: function () {
            debugger
            var oView = this.getView();
            var oModel = oView.getModel();
        
            // Get the ID from the input field
            var sId = oView.byId("_IDGenInput1").getValue().trim();
            var iId = parseInt(sId, 10);
        
            if (!iId) {
                MessageToast.show("Please enter a valid ID.");
                return;
            }
        
            // Fetch the ReturnTime value
            var oReturnTime = oView.byId("DTP5").getDateValue();
            var sReturnTimeISO = this.formatDateTimeToISO(oReturnTime);
        
            if (!sReturnTimeISO) {
                MessageToast.show("Please select a valid return time.");
                return;
            }
        
            // Update the ReturnTime field in the backend
            var oData = {
                ReturnTime: sReturnTimeISO
            };
        
            var sPath = "/zbook_issuelogSet(" + iId + ")";
            BusyIndicator.show(0);
        
            oModel.update(sPath, oData, {
                success: function () {
                    BusyIndicator.hide();
                    MessageToast.show("Return time updated successfully.");
        
                    // Now update the zbooksSet and zstudentsSet
                    var oBookData = {
                        AVAILABLE_STATUS: "A"
                    };
                    var sBookPath = "/zbooksSet(" + iId + ")";
                    oModel.update(sBookPath, oBookData, {
                        success: function () {
                            MessageToast.show("Book availability updated successfully.");
                        },
                        error: function (oError) {
                            console.error("Error updating book availability: ", oError);
                            MessageToast.show("Error updating book availability.");
                        }
                    });
        
                    // Fetch the student data to decrease the book count
                    var oStudentModel = oView.getModel("studentModel"); // Assuming you have a model for students
                    var sStudentPath = "/zstudentsSet(" + iId + ")";
                    oModel.read(sStudentPath, {
                        success: function (oStudentData) {
                            var oStudentUpdateData = {
                                BooksIssued: oStudentData.BooksIssued - 1
                            };
                            oModel.update(sStudentPath, oStudentUpdateData, {
                                success: function () {
                                    MessageToast.show("Student book count updated successfully.");
                                },
                                error: function (oError) {
                                    console.error("Error updating student book count: ", oError);
                                    MessageToast.show("Error updating student book count.");
                                }
                            });
                        },
                        error: function (oError) {
                            console.error("Error fetching student data: ", oError);
                            MessageToast.show("Error fetching student data.");
                        }
                    });
        
                },
                error: function (oError) {
                    BusyIndicator.hide();
                    console.error("Error updating return time: ", oError);
                    MessageToast.show("Error updating return time.");
                }
            });
        },

        handleDelete: function () {
            var oView = this.getView();
            var aFieldIds = [
                "_IDGenInput1",
                "_IDGenInput2",
                "_IDGenInput3",
                "_IDGenInput4",
                "_IDGenInput5",
                "DTP5",
                "_IDGenInput7"
            ];

            aFieldIds.forEach(function (sFieldId) {
                var oField = oView.byId(sFieldId);
                if (oField) {
                    oField.setValue("");
                    oField.setValueState(sap.ui.core.ValueState.None);
                }
            });

            MessageToast.show("Form has been reset");
        },

        onFetchPress: function () {
            var sId = this.byId("bookIssueLogIdInput").getValue().trim();

            if (sId) {
                this.fetchBookIssueLog(sId);
            } else {
                MessageToast.show("Please enter a valid ID.");
            }
        },

        fetchBookIssueLog: function (sId) {
            var oView = this.getView();
            var oModel = oView.getModel();
            var iId = parseInt(sId, 10);
            var sPath = "/zbook_issuelogSet(" + iId + ")";

            oModel.read(sPath, {
                success: function (oData) {
                    var oJsonModel = new JSONModel(oData);
                    oView.setModel(oJsonModel, "bookIssueLog");

                    // Fetch student details
                    this.fetchStudentDetails(oData.StudentId);
                    // Fetch book details
                    this.fetchBookDetails(oData.BookIssueId);
                    // Fetch user details
                    this.fetchIssuedByUser(oData.IssueBy);
                }.bind(this),
                error: function (oError) {
                    var sErrorMessage = "Failed to fetch data. Please check the ID and try again.";
                    if (oError.response && oError.response.body) {
                        sErrorMessage += " Response: " + oError.response.body;
                    }
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        fetchStudentDetails: function (studentId) {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sPath = "/zstudentsSet(" + studentId + ")";

            oModel.read(sPath, {
                success: function (oStudentData) {
                    var studentName = oStudentData.StudentId + "-" + oStudentData.FirstName;
                    oView.byId("_IDGenInput3").setValue(studentName);
                },
                error: function (oError) {
                    var sErrorMessage = "Failed to fetch student details. Please check the student ID and try again.";
                    if (oError.response && oError.response.body) {
                        sErrorMessage += " Response: " + oError.response.body;
                    }
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        
        fetchBookDetails: function (bookId) {
            var oView = this.getView();
            var oModel = oView.getModel();
            var sPath = "/zbooksSet(" + bookId + ")";

            oModel.read(sPath, {
                success: function (oBookData) {
                    var bookDetails = oBookData.BookId + " - " + oBookData.Title;
                    oView.byId("_IDGenInput2").setValue(bookDetails); // Assuming _IDGenInput2 is the input field for book details
                },
                error: function (oError) {
                    var sErrorMessage = "Failed to fetch book details. Please check the book ID and try again.";
                    if (oError.response && oError.response.body) {
                        sErrorMessage += " Response: " + oError.response.body;
                    }
                    MessageToast.show(sErrorMessage);
                }
            });
        },

        fetchIssuedByUser: function (issuedById) {
            var oView = this.getView();
            var oModel = oView.getModel();
            
            // Ensure issuedById is treated as an integer
            var sPath = "/zusersSet(" + parseInt(issuedById, 10) + ")";
            
            oModel.read(sPath, {
                success: function (oUserData) {
                    if (oUserData && oUserData.Username) {
                        var issuedByName = issuedById + " - " + oUserData.Username; // Displaying "IssuedBy - Username"
                        oView.byId("_IDGenInput4").setValue(issuedByName);
                    } else {
                        MessageToast.show("No data found for the provided IssuedBy ID.");
                    }
                },
                error: function (oError) {
                    var sErrorMessage = "Failed to fetch user details. Please check the IssuedBy ID and try again.";
                    if (oError.responseText) {
                        try {
                            var oErrorResponse = JSON.parse(oError.responseText);
                            sErrorMessage += " Response: " + (oErrorResponse.error.message.value || oError.responseText);
                        } catch (e) {
                            sErrorMessage += " Response: " + oError.responseText;
                        }
                    }
                    MessageToast.show(sErrorMessage);
                }
            });
        },
        formatDateTimeToISO: function (oDate) {
            if (oDate) {
                return oDate.toISOString();
            }
            return null;
        },

        
        Viewreport1: function () {
            debugger
            
            // Navigate to the Report view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("BookIssueReport"); // 'reportView' is the route name defined in your manifest.json
        }
    });
});
