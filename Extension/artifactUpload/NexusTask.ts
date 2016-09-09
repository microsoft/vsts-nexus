// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/// <reference path="../../definitions/node.d.ts"/>
/// <reference path="../../definitions/vsts-task-lib.d.ts" />

import tl = require('vsts-task-lib/task');
import fs = require('fs');

import * as Util from './util';

// node js modules
var request = require('request');

//server & auth
var serverEndpoint = tl.getInput('serverEndpoint', true);
var serverEndpointUrl = tl.getEndpointUrl(serverEndpoint, false);
tl.debug('serverEndpointUrl=' + serverEndpointUrl);
var serverEndpointAuth = tl.getEndpointAuthorization(serverEndpoint, false);
var username = serverEndpointAuth['parameters']['username'];
var password = serverEndpointAuth['parameters']['password'];

var nexusUploadUrl = Util.addUrlSegment(serverEndpointUrl, 'service/local/artifact/maven/content');
tl.debug('nexusUploadUrl=' + nexusUploadUrl);


//other options
var repositoryId = tl.getInput('repositoryId', true);
var groupId = tl.getInput('groupId', true);
var artifactId = tl.getInput('artifactId', true);
var artifactVersion = tl.getInput('artifactVersion', true);
var packaging = tl.getInput('packaging', true);
var fileName = tl.getInput('fileName', true);
var classifier = tl.getInput('classifier', false);
if (!classifier) {
    tl.debug('classifier not specified');
    classifier = '';
}
var extension = tl.getInput('extension', false);
if (!extension) {
    tl.debug('extension not specified, using default packaging extension');
    extension = packaging;
}
var trustSSL = tl.getInput('trustSSL', true);

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

var postData: any = { url: nexusUploadUrl, formData: formData, strictSSL: !trustSSL };

tl.debug('request.post(), postData: ' + JSON.stringify(postData));
request.post(postData)
    .auth(username, password, true)
    .on('error', err => {
        tl.error('Upload failed.');
        tl.error(err);
        tl.setResult(tl.TaskResult.Failed, err);
    })
    .on('response', response => {
        tl.debug('response: ' + JSON.stringify(response));
        if (response.statusCode == 201) {
            var message = 'Successfully uploaded file: ' + fileName;
            console.log(message);
            tl.setResult(tl.TaskResult.Succeeded, message);
        } else {
            var message = 'Upload failed, HttpResponse.statusCode: ' + response.statusCode + ', HttpResponse.statusMessage: ' + response.statusMessage;
            tl.error(message);
            tl.setResult(tl.TaskResult.Failed, message);
        }
    });