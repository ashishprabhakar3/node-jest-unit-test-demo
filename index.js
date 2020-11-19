var Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const main =  (filedata) => {

    
    return new Promise((resolve , reject) => {
        fs.access(filedata, error => {
            if(error) {
                error.message = 'Invalid Path';
                return reject(error);
            };
            let result = [];
            let fileStats = fs.lstatSync(filedata);
            let rootPath = __dirname;

            if(fileStats.isFile()){
                let parentDir = path.dirname(filedata).split(path.sep).pop();
                let fileObj = {"fileName": path.basename(filedata), "filePath": "/" + parentDir + "/" + path.basename(filedata)  ,"size":fileStats.size};
                // console.log("fileObj", fileObj);
                result.push(fileObj);
                // console.log("result Arr 1", result);                    
            }else if(fileStats.isDirectory()){
                let parentDir = path.dirname(filedata).split(path.sep).pop();                
                let basename = path.basename(filedata);
                let filesList = fs.readdirSync(filedata);

                let fileObj;
                filesList.forEach(fl => {

                    let flStats = fs.lstatSync(filedata + "/" + fl);
                    let dateVal = new Date(flStats.birthtimeMs);
                    let createdAt = dateVal.getDate() + "-" + ( dateVal.getMonth() + 1 ) + "-" + dateVal.getFullYear(); 
                    let fpath =   filedata.substr(rootPath.length) + "/" + fl;                    
                    fileObj = {"fileName": fl, "filePath": fpath  ,"size":flStats.size, "isDirectory": flStats.isDirectory(), "createdAt": createdAt};
                    result.push(fileObj);
                });
            }
            resolve(result);
        });
    });    
};

module.exports = main;
