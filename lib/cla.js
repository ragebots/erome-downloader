const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const getOptions = () => {
  const optionDefinitions = [
    { name: 'output', alias: 'o', type: String },
    { name: 'input', alias: 'i', type: String, multiple: true, defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean }
  ];
  const options = commandLineArgs(optionDefinitions)
  return options;
}
const printUsage = () => {
  const sections = [
    {
      header: 'EroMe video and photo gallery saver',
      content: 'Save video/images from a list of EroMe urls.'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'output',
          alias: 'o',
          typeLabel: '{underline output directory}',
          description: 'Custom output directory. Default is "outputs"'
        },
        {
          name: 'input',
          alias: 'i',
          typeLabel: '{underline link}',
          description: 'The input url from EroMe to save video/gallery images from.'
        },
        {
          name: 'help',
          alias: 'h',
          description: 'Print this usage guide.'
        }
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
}

module.exports = {printUsage, getOptions}
