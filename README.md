# Integrate with Sonatype Nexus
This extension provides build tasks that enable you to integrate with [Sonatype Nexus](http://www.sonatype.org/nexus/).

## Create a Sonatype Nexus Connection
Create a Generic Service Endpoint and specify your Sonatype Nexus endpoint URL, user name, and password.

![Sonatype Nexus Endpoint](Extension/images/endpoint.png)

## Define your build process
Create a build definition to automate your build process. For detailed instructions on setting up a build definition, check out [this](https://msdn.microsoft.com/library/vs/alm/build/define/create).

Add the Sonatype Nexus Artifact Upload Build task to your build steps.

![Sonatype Nexus Artifact Upload Build Task](Extension/images/buildTask.png)

Specify the input arguments.

![Sonatype Nexus Artifact Upload Build Task](Extension/images/artifactUploadTask.png)

## License
The [code](https://github.com/Microsoft/vsts-urbancode-deploy) is open sourced under the MIT license. We love and encourage community contributions.

## Build pre-requisites
1. This package requires `node` and `npm`

## To compile, please run:
1. npm update
1. gulp

The vsix package will be produced in `_package`, and it can be uploaded to Visual Studio Team Services Marketplace for sharing.