const fs = require('fs');
const inquirer = require('inquirer');
const SVGBuilder = require('svg-builder');

// Function to start the logo generation process
async function generateLogo() {
  // Prompt for user input
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
      message: 'Enter text color (keyword or hexadecimal):',
      validate: input => /^#[0-9A-F]{6}$/i.test(input) || /^[a-z]+$/i.test(input),
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
      message: 'Enter shape color (keyword or hexadecimal):',
      validate: input => /^#[0-9A-F]{6}$/i.test(input) || /^[a-z]+$/i.test(input),
    }
  ]);

  
  const svgContent = generateSVG(userInput);

  const fileName = 'logo.svg';
  fs.writeFileSync(fileName, svgContent);

  console.log(`Generated ${fileName}`);
}

// Function to generate the SVG content based on user input
function generateSVG({ text, textColor, shape, shapeColor }) {
  const svg = new SVGBuilder();
  
  // Set SVG size
  svg.setViewBox(0, 0, 300, 200);

  // Draw shape based on user input
  switch (shape) {
    case 'circle':
      svg.circle(150, 100, 50).fill(shapeColor);
      break;
    case 'triangle':
      svg.polygon([[150, 50], [250, 150], [50, 150]]).fill(shapeColor);
      break;
    case 'square':
      svg.rect(100, 50, 200, 100).fill(shapeColor);
      break;
    default:
      break;
  }

  svg.text(150, 100, text).fill(textColor).font('Arial', 30, 'middle');

  return svg.toString();
}

generateLogo();