# Sumo Logic Azure Event Hub Integration
This solution creates a data pipeline for shipping monitoring data out of eventhub to Sumo Logic HTTP source endpoint.

## About the Configuration Process
Sumo provides Azure Resource Management (ARM) template to build the pipelines. Each template creates an event hub to which Azure Monitor streams logs, an Azure function for sending monitoring data on to Sumo, and storage accounts to which the function writes its own log messages about successful and failed transmissions.

You download an ARM template, edit it to add the URL of your HTTP source, copy the template into Azure Portal, and deploy it. Then, you can start exporting monitoring data to EventHub.

This solution enables you to collect:

* [Activity Logs](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/02Collect-Logs-for-Azure-Audit-from-Event-Hub)
* [Diagnostics Logs](https://help.sumologic.com/Send-Data/Collect-from-Other-Data-Sources/Azure_Monitoring/Collect_Logs_from_Azure_Monitor) and [Metrics](https://help.sumologic.com/Send-Data/Collect-from-Other-Data-Sources/Azure_Monitoring/Collect_Metrics_from_Azure_Monitor) which can be exported via Azure Monitor

![EventHub Collection Data Pipeline](https://s3.amazonaws.com/appdev-cloudformation-templates/AzureEventHubCollection.png)

## Building the function
Currently ARM template is integrated with github and for each functions
EventHubs/src/logs_build/EventHubs_Logs - Function for ingesting Activity Logs

## GCM

The project is deployed through Gcm.AzureRM.Powershell.

For now GCM uses only the [Event Hub ARM Template](azuredeploy_logs.json), because only logs are collected. 

The only required parameter is the Sumo Logic HTTP Collector Source Url, specified in the [Config files](Config/deploy.app.json)

