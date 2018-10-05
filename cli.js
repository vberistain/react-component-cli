#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const componentName = process.argv[2];
const componentFolder = process.argv[3];
const option = process.argv[4];
const mkdirp = require('mkdirp');

const willOverride = option === '-o';

const writeTemplate = (templateName, componentName, componentFolder, outputFileName) => {
    let template = fs.readFileSync(
        path.join(__dirname, './templates') + `/${templateName}`,
        'utf8'
    );
    template = template.replace(/COMPONENT_NAME/g, componentName);
    const newPath = `${path.join(__dirname, `./${componentFolder}`)}`;
    mkdirp.sync(newPath);
    if (fs.existsSync(`${newPath}/${outputFileName}`) && !willOverride) {
        console.log('\x1b[31m%s\x1b[0m', `File ${outputFileName} already exists.`);
        return;
    }
    try {
        fs.writeFileSync(`${newPath}/${outputFileName}`, template);
        console.log('\x1b[32m%s\x1b[0m', `File ${outputFileName} created successfully`);
    }
    catch(error) {
        console.log(error);
    }
};

const writeTestTemplate = (componentName, componentFolder, outputFileName) => {
    let template = fs.readFileSync(
        path.join(__dirname, './templates') + `/test.template.tsx`,
        'utf8'
    );
    const testPathArray = componentFolder.split('/');
    const i = testPathArray.indexOf('components');
    const testPath = 'test/functional/' + testPathArray.slice(i, testPathArray.length).join('/');

    template = template.replace(/COMPONENT_NAME/g, componentName);
    template = template.replace(
        /COMPONENT_RELATIVE_PATH/g,
        `Components/${testPathArray.slice(i + 1, testPathArray.length).join('/')}/${componentName}`
    );
    const newPath = `${path.join(__dirname, `./${testPath}`)}`;
    mkdirp.sync(newPath);

    if (fs.existsSync(`${newPath}/${outputFileName}`) && !willOverride) {
        console.log('\x1b[31m%s\x1b[0m', `File ${outputFileName} already exists.`);
        return;
    }
    fs.writeFileSync(`${newPath}/${outputFileName}`, template);
    console.log('\x1b[32m%s\x1b[0m', `File ${outputFileName} created successfully`);
};

writeTemplate(
    'component.template.tsx',
    componentName,
    `${componentFolder}/${componentName}`,
    `${componentName}.jsx`
);
writeTemplate(
    'css.template.css',
    componentName,
    `${componentFolder}/${componentName}`,
    `${componentName}.css`
);
writeTemplate(
    'index.template.ts',
    componentName,
    `${componentFolder}/${componentName}`,
    'index.ts'
);

writeTestTemplate(componentName, componentFolder, `${componentName}.test.tsx`);
