///////////////////////////////////////////////////////////////////////////////////
//           Function to read from an Azure EventHubs to SumoLogic               //
///////////////////////////////////////////////////////////////////////////////////

var sumoHttp = require('./lib/sumoclient');
var dataTransformer = require('./lib/datatransformer');
var sumoClient;
var subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
var moduleDataTransformer = require('./lib/moduledatatransformer.js')(subscriptionId);

module.exports = async function (context, eventHubMessages) {
    await new Promise(async function (fulfill, reject){

        var options = { 'urlString': process.env.APPSETTING_SumoLogsEndpoint, 'metadata': {}, 'MaxAttempts': 3, 'RetryInterval': 3000, 'compress_data': true };

        sumoClient = new sumoHttp.SumoClient(options, context, failureHandler, successHandler);
        var transformer = new dataTransformer.Transformer();
        var messageArray = transformer.azureAudit(context, eventHubMessages);
        
        // Process messages sequentially, so as to reduce chance for throttling and take advantage of caching
        for (const msg of messageArray) {
            if (msg) {
                var transformed = await moduleDataTransformer.transform(msg);
                sumoClient.addData(transformed);
            }
        }

        function failureHandler(msgArray, ctx) {
            ctx.log("Failed to send to Sumo, backup to storageaccount now");
            if (sumoClient.messagesAttempted === sumoClient.messagesReceived) {
                context.bindings.outputBlob = messageArray.map(function (x) { return JSON.stringify(x); }).join("\n");
                context.done();
                fulfill();
            }
        }
        function successHandler(ctx) {
            ctx.log('Successfully sent to Sumo');
            if (sumoClient.messagesAttempted === sumoClient.messagesReceived) {
                ctx.log('Sent all data to Sumo. Exit now.');
                context.done();
                fulfill();
            }
        }
        context.log("Flushing the rest of the buffers:");
        sumoClient.flushAll();

    });
};