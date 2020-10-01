const adal = require('adal-node');
var tokenCache = new adal.MemoryCache();

var rgMap = {}; // map of resource group name -> module name

module.exports = function (subscriptionId = process.env.AZURE_SUBSCRIPTION_ID) {

    var msRestNodeAuth = require('@azure/ms-rest-nodeauth');
    const { ResourceManagementClient } = require('@azure/arm-resources');

    async function getClient() {        
        const creds = await msRestNodeAuth.loginWithAppServiceMSI({tokenCache: tokenCache});
        return new ResourceManagementClient(creds, subscriptionId);
    }

    async function getResourceGroupModule(rgName) {
        const client = await getClient();
        try {
            const rg = await client.resourceGroups.get(rgName);
            return rg && rg.tags && rg.tags.module ? rg.tags.module : undefined;
        } catch (error) {
            console.error(`${error}`);
            return undefined;
        }
    }

    async function getModuleNameFor(rgName) {
        if (rgMap && rgMap[rgName] != undefined) {
            return rgMap[rgName];
        }

        const moduleName = await getResourceGroupModule(rgName);
        console.log(`Looked up module name for ResourceGroup ${rgName}=${moduleName}`);
        if (moduleName != undefined) {
            rgMap[rgName] = moduleName;
        }
        return moduleName;
    }

    return {
        transform: async function (msg) {
            if (msg === undefined || msg === null) return msg;
            const rgName = msg.resourceGroupName;
            if (!rgName) return msg;

            const moduleName = await getModuleNameFor(rgName);
            if (moduleName) {
                msg.assetmodule = moduleName;
            }
            return msg;
        }
    }

}