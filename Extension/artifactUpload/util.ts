/// <reference path="../../definitions/node.d.ts"/>
function startsWith(baseStr: string, str: string): boolean {
    return baseStr.slice(-str.length) == str;
}

function endsWith(baseStr: string, str: string): boolean {
    return baseStr.slice(-str.length) == str;
}

export function addUrlSegment(baseUrl: string, segment: string): string {
    var resultUrl = null;
    if (endsWith(baseUrl, '/') && startsWith(segment, '/')) {
        resultUrl = baseUrl + segment.slice(1);
    } else if (endsWith(baseUrl, '/') || startsWith(segment, '/')) {
        resultUrl = baseUrl + segment;
    } else {
        resultUrl = baseUrl + '/' + segment;
    }
    return resultUrl;
}