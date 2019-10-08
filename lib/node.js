const path = require('path');
const ReactDocgen = require('react-docgen');
const fs = require('fs');

const include = (list, name) => {
    for (const item of list) {
        if (name.indexOf(item) > -1) {
            return true;
        }
    }
    return false;
};

module.exports = (markdownData, config = {}) => {
    const {meta = {}} = markdownData;
    const {filename} = meta;
    if (filename && filename.indexOf('zh-CN.md') > -1 && filename.indexOf('components') > -1) {
        const {exclude = ''} = config;
        const exList = exclude.split(',');
        if (include(exList, filename)) {
            return markdownData
        }
        const componentDir = filename.slice(0, filename.length - 9);
        let realDir = path.resolve(componentDir);
        if (fs.existsSync(`${realDir}.tsx`)) {
            realDir = `${realDir}.tsx`
        } else if (fs.existsSync(`${realDir}.ts`)) {
            realDir = `${realDir}.ts`
        } else if (fs.existsSync(`${realDir}.jsx`)) {
            realDir = `${realDir}.jsx`
        } else if (fs.existsSync(`${realDir}.js`)) {
            realDir = `${realDir}.js`
        }
        const file = fs.readFileSync(realDir, 'utf-8');
        const content = file.toString();
        markdownData.apiData = ReactDocgen.parse(content);
    }
    return markdownData;
};
