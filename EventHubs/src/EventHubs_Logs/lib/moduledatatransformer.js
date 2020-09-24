module.exports = function (rgMap = {}, subscriptionId = process.env.AZURE_SUBSCRIPTION_ID) {

    var msRestNodeAuth = require('@azure/ms-rest-nodeauth');
    const { ResourceManagementClient, ResourceManagementModels, ResourceManagementMappers } = require('@azure/arm-resources');

    async function getClient() {
        var creds = await msRestNodeAuth.loginWithAppServiceMSI();
        return new ResourceManagementClient(creds, subscriptionId);
    }

    async function getResourceGroupModule(rgName) {
        var client = await getClient();
        try {
            var rg = await client.resourceGroups.get(rgName);
            return rg && rg.tags && rg.tags.module ? rg.tags.module : null;
        } catch (error) {
            return null;
        }
    }

    async function getModuleNameFor(rgName) {
        if (rgMap && rgMap[rgName]) {
            return rgMap[rgName];
        }

        var moduleName = await getResourceGroupModule(rgName);
        console.log(`Looked up module name for ResourceGroup ${rgName}=${moduleName}`);        
        if (moduleName) {
            rgMap[rgName] = moduleName;
        }
        return moduleName;
    }

    return {
        transform: async function(msg) {
            var rgName = msg.resourceGroupName;
            if (!rgName) return msg;

            var moduleName = await getModuleNameFor(rgName);
            if (moduleName) {
                msg.assetmodule = moduleName;
            }
            return msg;
        }
    }

}