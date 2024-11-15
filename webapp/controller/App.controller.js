sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, MessageToast, ODataModel, Filter, FilterOperator, MessageBox, Fragment) {
    "use strict";

    return BaseController.extend("leftmenu.controller.App", {
        onInit: function () {
            this.getOwnerComponent().getRouter().initialize();
            var oData = {
                navigation: [
                    { title: "Home", route: "home" },
                    { title: "Student Registration", route: "page1" },
                    { title: "Student Category Registration", route: "page2" },
                    { title: "Book Issue Log Form", route: "page3" },
                    { title: "Books Return Form", route: "page4" },
                    { title: "Branches Form", route: "page5" },
                    { title: "Books", route: "page6" },
                    { title: "Books Categories", route: "page7" }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "leftmenuModel");

            var sServiceUrl = "/sap/opu/odata/sap/ZLIBRARY_SRV/";
            this.oModel = new ODataModel(sServiceUrl, {
                useBatch: false
            });

            this.getView().setModel(this.oModel);
            this.getTableData();
        },

        getTableData: function () {
            var that = this;
            var sEntitySet = "/zusersSet";

            this.getView().getModel().read(sEntitySet, {
                success: function (oData) {
                    var oTableModel = new JSONModel();
                    oTableModel.setData(oData);
                    that._userData = oData.results;
                },
                error: function (oError) {
                    MessageToast.show("Error fetching data");
                    console.error(oError);
                }
            });
        },

        onItemSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext("leftmenuModel");

            if (oContext) {
                var sRoute = oContext.getProperty("route");

                if (sRoute) {
                    this.getOwnerComponent().getRouter().navTo(sRoute);
                } else {
                    console.error("Route not found for the selected item.");
                }
            } else {
                console.error("Binding context not found for the selected item.");
            }
        },

        onLoginPress: function () {
            var sUsername = this.byId("usernameInput").getValue();
            var sPassword = this.byId("passwordInput").getValue();
            var oLoggedInUser = this._validateCredentials(sUsername, sPassword);

            if (oLoggedInUser) {
                MessageBox.success("Login successful!");

                var oUserModel = new JSONModel({
                    loggedInUser: oLoggedInUser
                });
                this.getView().setModel(oUserModel, "loggedInUserModel");

                this.byId("splitApp").setVisible(true);
                this.getOwnerComponent().getRouter().navTo("home");
                this.byId("loginPage").destroy();
            } else {
                MessageBox.error("Invalid Username or Password.");
            }
        },

        _validateCredentials: function (sUsername, sPassword) {
            var aUsers = this._userData || [];
            var oValidUser = null;

            aUsers.forEach(function (oUser) {
                if (oUser.Username === sUsername && oUser.Password === sPassword) {
                    oValidUser = oUser;
                }
            });

            return oValidUser;
        },

        onRegisterPress: function () {
            debugger
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "leftmenu.view.RegisterUser",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._refreshModelData();

            this._pDialog.then(function (oDialog) {
                this._resetDialogFields();
                oDialog.open();
            }.bind(this));
        },

        _resetDialogFields: function () {
            var oView = this.getView();
            oView.byId("userIdInput1").setValue("");
            oView.byId("nameInput1").setValue("");
            oView.byId("usernameInput1").setValue("");
            oView.byId("passwordInput1").setValue("");
        },

        _refreshModelData: function () {
            var oModel = this.getView().getModel();
            oModel.refresh(true); // Refresh the model to ensure the latest data is loaded
        },

        onCreatePress: function () {
            var oView = this.getView();
        
            var oUserId = oView.byId("userIdInput1").getValue();
            var oName = oView.byId("nameInput1").getValue();
            var oUsername = oView.byId("usernameInput1").getValue();
            var oPassword = oView.byId("passwordInput1").getValue();
            var oVerificationStatus = 1;
            var oRememberToken = "NULL";
        
            if (!oUserId || !oName || !oUsername || !oPassword) {
                MessageBox.error("Please fill all required fields.");
                return;
            }
        
            var iUserId = parseInt(oUserId, 10);
            if (isNaN(iUserId) || iUserId < 0 || iUserId > 255) {
                MessageBox.error("User ID must be a valid byte integer (0-255).");
                return;
            }
        
            var oModel = oView.getModel();
            var sPath = "/zusersSet(" + iUserId + ")";
        
            oModel.read(sPath, {
                success: function () {
                    MessageBox.error("A record with UserId " + iUserId + " already exists.");
                },
                error: function (oError) {
                    if (oError.statusCode === 404) {
                        var oDataPayload = {
                            Userid: iUserId,
                            Name: oName,
                            Username: oUsername,
                            Password: oPassword,
                            VerificationStatus: oVerificationStatus,
                            RememberToken: oRememberToken
                        };
        
                        oModel.create("/zusersSet", oDataPayload, {
                            success: function () {
                                MessageToast.show("Record created successfully.");
        
                                // Refresh the model to ensure the latest data is loaded
                                this.getTableData();
        
                                // Close the registration dialog after successful creation
                                this._pDialog.then(function (oDialog) {
                                    oDialog.close();
                                    this._resetDialogFields(); // Reset the fields after dialog is closed
                                }.bind(this));
                                
                                // User can now manually enter the credentials and log in
                            }.bind(this),
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
                        MessageBox.error("Error checking Userid: " + oError.message);
                    }
                }.bind(this)
            });
        },
        

        onCancelPress: function () {
            this._pDialog.then(function (oDialog) {
                oDialog.close();
                this._resetDialogFields();  // Reset the fields when dialog is closed
            }.bind(this));
        },
    });
});
