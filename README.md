Sumo Logic Azure Functions [![Build Status](https://dev.azure.com/GCMGrosvenor/Default/_apis/build/status/sumologic-azure-function?branchName=master)](https://dev.azure.com/gcmgrosvenor/Default/_build?definitionId=227)
==============================

# Introduction
This repository contains a collection of Azure functions to collect data and send to Sumo Logic cloud service, and a library called sumo-function-utils for these functions.

Following integrations are present. For more info look at their respective ReadMe files.

| FunctionName | Description | Collection Use Cases | Setup Documentation
| -------------| ----------- | -------------- | ------------------- |
|[Sumo Logic Azure Event Hub Integration](EventHubs)| This [solution](https://help.sumologic.com/Send-Data/Collect-from-Other-Data-Sources/Azure_Monitoring) creates a data pipeline for collecting logs from Eventhub.It includes separate ARM Templates for Metrics and Logs.| [Azure Audit App](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/Azure-Audit-App-Dashboards) [Azure Active Directory App](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure_Active_Directory/Install_the_Azure_Active_Directory_App_and_View_the_Dashboards) [Azure SQL App](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure_SQL/Install_the_Azure_SQL_App_and_View_the_Dashboards)| [Docs for Logs](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/02Collect-Logs-for-Azure-Audit-from-Event-Hub) <br/> [Docs for Metrics](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/02Collect-Logs-for-Azure-Audit-from-Event-Hub)|
|[Sumo Logic Azure Blob Storage Integration](BlockBlobReader) | This [solution](https://help.sumologic.com/Send-Data/Collect-from-Other-Data-Sources/Azure_Blob_Storage) event-based pipeline for shipping monitoring data from Azure Blob Storage to an HTTP source on Sumo Logic.| [Azure Web Apps](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Web-Apps/Azure-Web-Apps-Dashboards) | [Docs for Logs](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Web-Apps/01Collect-Logs-for-Azure-Web-Apps) |


## For Developers
Each integration is structured in three folders
* src/     - contains actual source files
* tests/   - contains integration tests

## Build Pipeline
- [Azure DevOps](https://dev.azure.com/gcmgrosvenor/Default/_build?definitionId=227)
 
## Deploy Pipeline
- [Azure DevOps](https://dev.azure.com/gcmgrosvenor/Default/_release?definitionId=223)