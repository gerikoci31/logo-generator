const fs = require('fs');
const { JSDOM } = require('jsdom');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { createSVG, registerWindow } = require('@svgdotjs/svg.js');
const { Triangle, Circle, Square } = require('./lib/shapes');

async function generateLogo() {
  console.log(chalk.blue.bold('Welcome to SVG Logo Maker'));

  const userInput = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: 'Enter up to three characters for the logo:',
      validate: input => input.length > 0 && input.length <= 3,
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'Enter text color (keyword or hex):',
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Choose a shape:',
      choices: ['circle', 'triangle', 'square'],
    },
    {
      type: 'input',
      name: 'shapeColor',
      message: 'Enter shape color (keyword or hex):',
    },
  ]);

  const { text, textColor, shape, shapeColor } = userInput;

  // Create a virtual DOM using jsdom
  const dom = new JSDOM();
  const { document } = dom.window;

  // Register the jsdom window with svg.js
  registerWindow(document.defaultView, document);

  // Initialize SVG.js
  const svgCanvas = createSVG(document.documentElement);

  // Create an SVG canvas
  svgCanvas.size(300, 200);

  // Draw text
  svgCanvas.text(text)
    .font({
      family: 'Arial',
      size: 48,
      anchor: 'middle',
      fill: textColor,
    })
    .move(150, 100);

  // Draw shape based on user input
  let shapeObj;
  switch (shape) {
    case 'circle':
      shapeObj = new Circle(shapeColor);
      break;
    case 'triangle':
      shapeObj = new Triangle(shapeColor);
      break;
    case 'square':
      shapeObj = new Square(shapeColor);
      break;
    default:
      console.log(chalk.red('Invalid shape selection.'));
      return;
  }

  // Render the shape on SVG canvas
  svgCanvas.add(shapeObj.render());

  // Export SVG as markup
  const svgMarkup = svgCanvas.svg();
  fs.writeFileSync('logo.svg', svgMarkup);

  console.log(chalk.green.bold('Generated logo.svg'));
}

generateLogo().catch(error => {
  console.error(chalk.red.bold('Error generating logo:'), error);
  process.exit(1);
});