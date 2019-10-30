const path = require('path');
const ReactDocgen = require('react-docgen-typescript');
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
    if (filename && (filename.indexOf('zh-CN.md') > -1 || filename.indexOf('en-US.md') > -1)
     && filename.indexOf('components') > -1) {
        const exList = [];
        Object.keys(config).forEach(key => {
            if (key.startsWith('exclude')) {
                exList.push(config[key])
            }
        });
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
        try {
            const data = ReactDocgen.parse(realDir);
            if (data && data.length) {
                markdownData.apiData = data[0];
            }
        } catch (e) {
            throw new Error(`${e.message} dir: ${realDir}`);
        }
    }
    return markdownData;
};
