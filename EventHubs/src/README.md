# Gcm.Samples.LogicApp

> Sample project to deploy an empty logic app using Gcm.AzureRM.PowerShell nuget package.

## Setup for Gcm.Samples.LogicApp

- Replace the content of the file AzureLogicApp.json with your Logic App code (extracted from Visual Studio or Azure Portal).
- Add the default parameters: 
  - applicationName: provided by default, using the value of the **Application** setting from [deploy.app.json](Config/deploy.app.json).
  - lifecycle: provided by default, using the value of the **Lifecycle** setting from [deploy.app.json](Config/deploy.app.json).
  - lifecycleSuffix: provided by default, using the value of the **LifecycleSuffix** setting, from [deploy.app.json](Config/deploy.app.json).
- Clean up your ARM Template to avoid hardcoded values e.g. subscription key.
- Fill in 'Config/deploy.app.json' and 'Config/deploy.variables.json' with your Logic App's configuration. Every parameter from the ARM Template that requires a value (besides the default parameters listed above) have to be added as **TemplateParameters** with an object notation, not as an array.


## Deploy Parameters
> Bold parameters are required.
- **TemplateName** (string): The name of the template without file extension to be used during deployment. Templates should be a json file in the root directory. By default it's named AzureLogicApp, so if you change the ARM Template file name, also change the **TemplateName** variable.

- **ApplicationPrefix** (string): Used as second part of the full application name. Possible values: pub, pvm, ent. If ent(enterprise), this will be null.

- **Application** (string): The name of the Logic App. This will provide a value to the **applicationName** default parameter from the ARM Template. Should not include dashes (-).

- **Lifecycle** (string): Environment to deploy. Possible values: dev, qat, uat, nonprd, prd.

- LifecycleSuffix (string): Used to create multiple environments for a given Lifecycle.

- Version (string): The version of the project to deploy. If not entered will use build version.

- **AuthOptions** (object): Defines the options used to authenticate with Azure.
	- SubscriptionName (string): prd, non-prd, sandbox. If not entered, defaults to non-prd.

- **DeployOptions** (object): Options to be used during deployment.
	- **DeploymentName**: The unique name to be used for this instance of the deployment. For example, if deploying databases to an elastic pool each database should have a unique deployment name, but should share the same ResourceGroup name.
	- ResourceGroupName (string): The name of the resource group to deploy. If not provided will use Application + Lifecyle + LifecycleSuffix.
  - Location (string): If null, defaults to East US.
  - ResourceGroupLockLevel (string): Create a resource lock, options either 'CanNotDelete' or 'ReadOnly'

- **TemplateParameters** (object): Parameters as required by the template being used. See [AzureRM.Templates](https://github.com/GCMGrosvenor/Gcm.AzureRM.Templates) for details.