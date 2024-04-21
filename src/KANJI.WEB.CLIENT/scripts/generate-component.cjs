const fs = require('fs');
const path = require('path');

const [, , dirType, componentName] = process.argv;

let dir;
if (dirType === 'c' || dirType === 'component') dir = 'components';
if (dirType === 'p' || dirType === 'page') dir = 'pages';

const pathToComponent = path.join(__dirname, '..', 'src', dir, componentName);

/**
 * Component Creation Driver
 */

const generateComponent = () => {
  fs.mkdirSync(pathToComponent);

  createComponent();
  createStyle();
  createIndex();
  //   createTest();
};

/**
 * File Creation Templates
 */

const createComponent = () => {
  const blankComponent = `import { FC } from 'react';

const ${componentName}: FC<unknown> = () => {
  return <div></div>;
};

export default ${componentName};
`;

  fs.writeFileSync(
    path.join(pathToComponent, `${componentName}.tsx`),
    blankComponent
  );
};

const createStyle = () => {
  const blankCSS = ``;

  fs.writeFileSync(
    path.join(pathToComponent, `${componentName}.scss`),
    blankCSS
  );
};

const createIndex = () => {
  const blankIndex = `export { default as ${componentName} } from './${componentName}.tsx'`;

  fs.writeFileSync(path.join(pathToComponent, 'index.ts'), blankIndex);
};

// const createTest = () => {
//   const testDir = path.join(pathToComponent, '__tests__');
//   fs.mkdirSync(testDir);

//   const blankTest = `
// import React from 'react';
// import { shallow } from 'enzyme';
// import ${componentName} from '..';

// it('renders without crashing', () => {
//   const wrapper = shallow(<${componentName} />);
//   expect(wrapper).toMatchSnapshot();
// });
//   `;

//   fs.writeFileSync(path.join(testDir, 'index.test.js'), blankTest);
// };

generateComponent();
