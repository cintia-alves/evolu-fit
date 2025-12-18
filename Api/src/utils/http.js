function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('JSON inválido'));
            }
        });
        
        req.on('error', reject);
    });
}

function json(res, data, statusCode = 200) {
    res.writeHead(statusCode, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    res.end(JSON.stringify(data));
}

function getParams(pattern, url) {
    const patternParts = pattern.split('/');
    const urlParts = url.split('/');
    const params = {};
    
    patternParts.forEach((part, index) => {
        if (part.startsWith(':')) {
            const paramName = part.slice(1);
            params[paramName] = urlParts[index];
        }
    });
    
    return params;
}


function matchRoute(pattern, url) {
   
    const patternParts = pattern.split('/');
    
    const urlParts = url.split('/');
    
    if (patternParts.length !== urlParts.length) return false;
  
    return patternParts.every((part, index) => {

        return part.startsWith(':') || part === urlParts[index];
    });
}
module.exports = { parseBody, json, getParams, matchRoute };