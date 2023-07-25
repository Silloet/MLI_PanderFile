const express = require('express');
const multer = require('multer');
const fs = require('fs');
const XLSX = require ('xlsx');
const _ = required ('lodash');
const app = express();


const upload = multer({ dest: 'uploads/'});


function readExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);

}


function deduplicateFiles(panderFilePath, dataFilePath) {
    const panderData = readExcelFile(panderFilePath);
    const dataData = readExcelFile(dataFilePath);

    const compareFields = ['strret', 'city', 'state', 'zipcode'];

    const panderDataObj = _.keyBy(panderData, (item) => 
    compareFields.map((field) => item[field]).join('_')
    );

    const deduplicatedData = dataData.filter (
        (item) => !panderDataObj[compareFields.map((field) => item[field]).join('_')]
    );

    return deduplicatedData;
}

function createCleanFile(deduplicatedData, cleanFilePath) {
    const worksheet = XLSX.utils.json_to_sheet(deduplicatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clean Data');
    XLSX.writeFile(workbook, cleanFilePath);
}

const panderFilePath = '';
const dataFilePath = '';
const cleanFilePath = '';

const deduplicatedData = deduplicateFiles(panderFilePath, dataFilePath);
createCleanFile(deduplicatedData, cleanFilePath);

