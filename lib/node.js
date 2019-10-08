const path = require('path');
const ReactDocgen = require('react-docgen');
const fs = require('fs');

module.exports = (markdownData) => {
    const {meta = {}} = markdownData;
    const {filename} = meta;
    if (filename && filename.indexOf('zh-CN.md') > -1 && filename.indexOf('components') > -1) {
        const componentDir = filename.slice(0, filename.length - 9);
        let realDir = path.resolve(`../${componentDir}`);
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
        console.log(content);
        console.log(ReactDocgen.parse(content));
    }
    return markdownData;
};
