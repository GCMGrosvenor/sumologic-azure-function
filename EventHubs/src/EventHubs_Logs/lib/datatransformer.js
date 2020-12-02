/*jshint esversion: 6 */
/**
 * Created by duc on 7/3/17.
 */

/**
 * Class containing default data transformer
 * @constructor
 */
function Transformer() { }

Transformer.prototype.azureAudit = function (context, data) {
    var finalResult = [];
    if (data instanceof Array) {
        data.forEach(message => {
            if (message.records instanceof Array) {
                message.records.forEach(subMsg => {
                    finalResult.push(this.generateFormattedLog(context, subMsg));
                });
            } else {
                finalResult.push(this.generateFormattedLog(context, message));
            }
        });
    } else {
        if (data.records instanceof Array) {
            data.records.forEach(subMsg => { finalResult.push(this.generateFormattedLog(context, subMsg)); });
        } else { finalResult.push(this.generateFormattedLog(context, data)); }
    }
    return finalResult;
};

Transformer.prototype.getProperties = function (resourceGroupName) {
    var defaultPrefixes = ['gcm', 'pvm', 'pub']
    var nameSegments = resourceGroupName.toLowerCase().split('-');
    var application, environment, lifecycle, lifecycleSuffix;

    do {
        nameSegment = nameSegments.shift();
    }
    while (defaultPrefixes.includes(nameSegment));

    application = nameSegment;
    lifecycle = nameSegments.shift();
    environment = lifecycle;

    if (nameSegments.length > 0) {
        lifecycleSuffix = nameSegments.shift();
        environment += '-' + lifecycleSuffix;
    }

    var properties = {
        resourceGroupName: resourceGroupName.toLowerCase(),
        application: application,
        environment: environment,
        lifecycle: lifecycle,
        lifecycleSuffix: lifecycleSuffix
    }

    return properties
}

/**
 * Function to generate a well formatted log to send to Sumo, following GCM's standards
 * @param msg the original Azure log message
 * @returns {object} of log following GCM's standard format
 */
Transformer.prototype.generateFormattedLog = function (context, msg) {
    // Logs from Azure Function follow different format than logs from Logic App
    if(msg.category == 'FunctionAppLogs') {
        // There is no resource group field in the message, but does RG name is included with resource id
        var properties = this.getProperties(this.getValue(() => msg.resourceId.split('/')[4], ''));

        var log = {
            level: this.getValue(() => msg.level),
            host: this.getValue(() => msg.propertes.hostInstanceId),
            resourceId: this.getValue(() => msg.resourceId),
            category: this.getValue(() => msg.category),
            resourceGroupName: properties.resourceGroupName,
            application: properties.application,
            environment: properties.environment,
            lifecycle: properties.lifecycle,
            lifecycleSuffix: properties.lifecycleSuffix,
            status: this.getValue(() => msg.properties.status),
            process: this.getValue(() => msg.operationName),
            action: this.getValue(() => msg.properties.functionName),
            message: this.getValue(() => msg.properties.message),
            runId: this.getValue(() => msg.properties.functionInvocationId),
            location: this.getValue(() => msg.location),
            levelId: this.getValue(() => msg.levelId),
        };
    }
    else {
        var properties = this.getProperties(this.getValue(() => msg.properties.resource.resourceGroupName, ''));

        var log = {
            level: this.getValue(() => msg.level),
            host: this.getValue(() => msg.workflowId),
            workflowId: this.getValue(() => msg.workflowId),
            resourceId: this.getValue(() => msg.resourceId),
            category: this.getValue(() => msg.category),
            resourceGroupName: properties.resourceGroupName,
            application: properties.application,
            environment: properties.environment,
            lifecycle: properties.lifecycle,
            lifecycleSuffix: properties.lifecycleSuffix,
            status: this.getValue(() => msg.properties.status),
            process: this.getValue(() => msg.operationName),
            trigger: this.getValue(() => msg.properties.resource.triggerName),
            action: this.getValue(() => msg.properties.resource.actionName),
            message: this.getValue(() => msg.properties.resource.actionName.replace(/_/g, ' ')),
            runId: this.getValue(() => msg.properties.resource.runId),
            location: this.getValue(() => msg.properties.resource.location),
            code: this.getValue(() => msg.properties.code),
            correlationActionTrackingId: this.getValue(() => msg.properties.correlation.actionTrackingId),
            correlationClientTrackingId: this.getValue(() => msg.properties.correlation.clientTrackingId)
        };
    }

    if (msg && msg.level && msg.level.toLocaleLowerCase() == "error") {
        log.errorCode = this.getValue(() => msg.properties.error.code);
        log.exception = this.getValue(() => msg.properties.error.message);
    }

    return log;
}

Transformer.prototype.getValue = function (func, fallbackValue) {
    try {
        var value = func();
        return (value === null || value === undefined) ? fallbackValue : value;
    } catch (e) {
        return fallbackValue;
    }
}

module.exports = {
    Transformer: Transformer
};
