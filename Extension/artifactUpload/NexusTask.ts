// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/// <reference path="../../definitions/node.d.ts"/>
/// <reference path="../../definitions/vsts-task-lib.d.ts" />

import tl = require('vsts-task-lib/task');
import fs = require('fs');

// node js modules
var request = require('request');

var serverEndpoint = tl.getInput('serverEndpoint', true);
var repositoryId = tl.getInput('repositoryId');
var groupId = tl.getInput('groupId');
var artifactId = tl.getInput('artifactId');
var artifactVersion = tl.getInput('artifactVersion');
var packaging = tl.getInput('packaging');
var fileName = tl.getInput('fileName');
var classifier = tl.getInput('classifier');
var extension = tl.getInput('extension');

if (!extension) {
    tl.debug('extension not specified, using default packaging extension');
    extension = packaging;
}

var formData = {
    // Pass a simple key-value pair
    r: repositoryId,
    g: groupId,
    a: artifactId,
    v: artifactVersion,
    c: classifier,
    p: packaging,
    e: extension,
    // Pass data via Streams
    my_file: fs.createReadStream(fileName)
};

var serverEndpointUrl = tl.getEndpointUrl(serverEndpoint, false);
tl.debug('serverEndpointUrl=' + serverEndpointUrl);

var serverEndpointAuth = tl.getEndpointAuthorization(serverEndpoint, false);
var username = serverEndpointAuth['parameters']['username'];
var password = serverEndpointAuth['parameters']['password'];

var nexusUploadUrl = serverEndpointUrl + '/service/local/artifact/maven/content';
tl.debug('nexusUploadUrl=' + nexusUploadUrl);

request.post({ url: nexusUploadUrl, formData: formData }, function optionalCallback(err, httpResponse, body) {
    if (err) {
        tl.setResult(tl.TaskResult.Failed, err);
    } else if (httpResponse.statusCode != 201){
        var message ='Upload failed.\nHttpResponse.statusCode='+httpResponse.statusCode+
            '\nHttpResponse.statusMessage='+httpResponse.statusMessage+
            '\nhttpResponse.body='+httpResponse.body 
        tl.debug(message);
        tl.setResult(tl.TaskResult.Failed, message); 
    } else {
      tl.debug('Upload successful, server responded with: ' + body);
      tl.setResult(tl.TaskResult.Succeeded, 'Successfully uploaded ' + fileName);  
    } 
}).auth(username, password, true);