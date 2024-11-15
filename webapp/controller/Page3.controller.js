sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
], function (Controller, ODataModel, BusyIndicator, MessageToast) {
    "use strict";

    return Controller.extend("leftmenu.controller.Page3", {

        onInit: function () {
            // Initialize OData Model
            var sServiceUrl = "/sap/opu/odata/sap/ZLIBRARY_SRV/";
            this.oODataModel = new ODataModel(sServiceUrl, true);
            this.getView().setModel(this.oODataModel);
        },

        
        onBookIssueSelectChange1: function (oEvent) {
            debugger
            var selectedItem = oEvent.getSource().getSelectedItem();
            var selectedKey = selectedItem.getKey();
            // Handle the selected BookIssueId
            console.log("Selected Book Issue ID: ", selectedKey);
        },
        onBookIssueSelectChange: function (oEvent) {
            debugger
            var selectedItem = oEvent.getSource().getSelectedItem();
            var selectedKey = selectedItem.getKey();
            // Handle the selected BookIssueId
            console.log("Selected Book Issue ID: ", selectedKey);
        },

        formatDateTimeToISO: function (date) {
            if (!date) return '';
            return date.toISOString(); // Convert Date to ISO 8601 string
        },

        formatTimeToSAP: function (timeString) {
            if (!timeString) return '';

            // Extract the time part and AM/PM indicator
            var timeParts = timeString.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
            if (!timeParts) return ''; // Invalid format

            var hours = parseInt(timeParts[1], 10);
            var minutes = parseInt(timeParts[2], 10);
            var seconds = parseInt(timeParts[3], 10);
            var period = timeParts[4].toUpperCase();

            // Convert hours from 12-hour format to 24-hour format
            if (period === 'PM' && hours < 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }

            // Validate time parts
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
                return '';
            }

            // Calculate duration from midnight
            var totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // Format duration as ISO 8601 duration
            var isoDuration = 'PT';
            var isoHours = Math.floor(totalSeconds / 3600);
            var isoMinutes = Math.floor((totalSeconds % 3600) / 60);
            var isoSeconds = totalSeconds % 60;

            if (isoHours > 0) {
                isoDuration += isoHours + 'H';
            }
            if (isoMinutes > 0) {
                isoDuration += isoMinutes + 'M';
            }
            if (isoSeconds > 0) {
                isoDuration += isoSeconds + 'S';
            }

            return isoDuration || 'PT0S'; // Ensure at least 'PT0S' is returned
        },
        handleSave: function () {
            debugger
            var oView = this.getView();
            var oModel = oView.getModel();

           

            
            // Prepare the data for the new record
            var oData = {
                Id: parseInt(oView.byId("isseId").getValue(), 10),
                BookIssueId: parseInt(oView.byId("ookIssuSelect").getSelectedKey(), 10),
                StudentId: parseInt(oView.byId("bookIssuSelect").getSelectedKey(), 10),
                IssueBy: parseInt(oView.byId("ookIsuSelect").getSelectedKey(), 10),
                IssuedAt: this.formatDateTimeToISO(oView.byId("ssuedAt").getDateValue()),
                ReturnTime: this.formatDateTimeToISO(new Date("0001-01-01T00:00:00Z")), // Default value
                TimeStamp: this.formatTimeToSAP(oView.byId("imeStamp").getValue())
            };
            
            // Validate that all required fields are filled
            if (!oData.Id || !oData.BookIssueId || !oData.StudentId || !oData.IssueBy || !oData.IssuedAt || !oData.TimeStamp) {
                MessageToast.show("Please fill in all required fields");
                return;
            }
        
            // Check if the ID already exists
            var that = this;
            oModel.read("/zbook_issuelogSet(Id=" + oData.Id + ")", {
                success: function () {
                    // ID already exists
                    MessageToast.show("ID already exists. Please enter a new ID.");
                },
                error: function () {
                    // ID does not exist, proceed with the record creation
                    that.createRecord(oData);
                }
            });
        },
        
        createRecord: function (oData) {
            var oView = this.getView();
            var oModel = oView.getModel();
            var that = this;
        
            // Fetch the book record
            var bookId = oData.BookIssueId;
        
            oModel.read("/zbooksSet(BookId=" + bookId + ")", {
                success: function (bookData) {
                    var availableStatus = bookData.AVAILABLE_STATUS;
        
                    if (availableStatus === "A") {
                        // Proceed with the record creation
                        var studentId = oData.StudentId;
        
                        // Fetch the student record
                        oModel.read("/zstudentsSet(StudentId=" + studentId + ")", {
                            success: function (studentData) {
                                var categoryId = studentData.Category;
                                var booksIssued = studentData.BooksIssued;
        
                                // Fetch the category data
                                oModel.read("/zstudent_categorySet(CatId=" + categoryId + ")", {
                                    success: function (categoryData) {
                                        var maxAllowed = categoryData.MaxAllowed;
        
                                        if (booksIssued >= maxAllowed) {
                                            BusyIndicator.hide();
                                            sap.m.MessageBox.error("Maximum book limit exceeded", {
                                                title: "Error",
                                                details: "The student has already issued the maximum number of books allowed. Please return some books before issuing more."
                                            });
                                            return;
                                        }
        
                                        // Proceed with creating the record
                                        var updatedBooksIssued = booksIssued + 1;
        
                                        // Update the student record with new BooksIssued count
                                        var updateData = {
                                            BooksIssued: updatedBooksIssued
                                        };
        
                                        oModel.update("/zstudentsSet(StudentId=" + studentId + ")", updateData, {
                                            success: function () {
                                                // Update book status to 'N'
                                                var bookUpdateData = {
                                                    AVAILABLE_STATUS: 'N'
                                                };
        
                                                oModel.update("/zbooksSet(BookId=" + bookId + ")", bookUpdateData, {
                                                    success: function () {
                                                        BusyIndicator.show(0);
                                                        oModel.create("/zbook_issuelogSet", oData, {
                                                            success: function () {
                                                                BusyIndicator.hide();
                                                                MessageToast.show("Record created successfully");
                                                            },
                                                            error: function (oError) {
                                                                BusyIndicator.hide();
                                                                console.error("Error details: ", oError);
                                                                MessageToast.show("Error creating record");
                                                            }
                                                        });
                                                    },
                                                    error: function (oError) {
                                                        BusyIndicator.hide();
                                                        console.error("Error updating book status: ", oError);
                                                        MessageToast.show("Error updating book status");
                                                    }
                                                });
                                            },
                                            error: function (oError) {
                                                BusyIndicator.hide();
                                                console.error("Error updating student data: ", oError);
                                                MessageToast.show("Error updating student data");
                                            }
                                        });
                                    },
                                    error: function (oError) {
                                        BusyIndicator.hide();
                                        console.error("Error fetching category data: ", oError);
                                        MessageToast.show("Error fetching category data");
                                    }
                                });
                            },
                            error: function (oError) {
                                BusyIndicator.hide();
                                console.error("Error fetching student data: ", oError);
                                MessageToast.show("Error fetching student data");
                            }
                        });
                    } else if (availableStatus === "N") {
                        // Book is not available
                        BusyIndicator.hide();
                        sap.m.MessageBox.error("Book is not Available", {
                            title: "Error",
                        });
                    } else {
                        // Handle unexpected status values if necessary
                        BusyIndicator.hide();
                        MessageToast.show("Unexpected book status");
                    }
                },
                error: function (oError) {
                    BusyIndicator.hide();
                    console.error("Error fetching book data: ", oError);
                    MessageToast.show("Error fetching book data");
                }
            });
        },        

        handleDelete: function () {
            var oView = this.getView();
            
            // Define IDs of the form fields to reset
            var aFieldIds = [
                "issueId",
                "bookId",
                "availableStatus",
                "addedBy",
                "issuedAt",
                "returnTime",
                "timeStamp"
            ];
        
            // Iterate over the field IDs and reset each field
            aFieldIds.forEach(function (sFieldId) {
                var oField = oView.byId(sFieldId);
                if (oField) {
                    oField.setValue(""); // Clear the value of the field
        
                    // Clear the validation state if applicable
                    oField.setValueState(sap.ui.core.ValueState.None);
                }
            });
        
            // Optional: You might want to log or show a message indicating the reset
            MessageToast.show("Form has been reset");
        },              

        Viewreport: function () {
            debugger
            // Navigate to the Report view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("IssuelogReport"); // 'reportView' is the route name defined in your manifest.json
        }

    });
});
