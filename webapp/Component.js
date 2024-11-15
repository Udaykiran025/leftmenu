sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "leftmenu/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, Device, models, JSONModel, ODataModel) {
    "use strict";

    return UIComponent.extend("leftmenu.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Enable routing
            this.getRouter().initialize();

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Set up a simple model for navigation data
            var oModel = new JSONModel({
                navigation: [
                    { title: "Home", route: "home" },
                    { title: "Student Registration", route: "page1" },
                    { title: "Student Category Registration", route: "page2" }
                ]
            });
            this.setModel(oModel, "nav");

            var oODataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLIBRARY_SRV/");
            this.setModel(oODataModel, "ODataModel");
        }
    });
});
