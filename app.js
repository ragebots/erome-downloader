const CLA = require("./lib/cla");
const EroMe = require("./lib/erome");
const fetch = require('node-fetch');
const fs = require("fs");
const Utility = require("./lib/utility");
const path = require("path");

// default output directory
let outputDir = "outputs";
// input urls
const inputURLs = [];

try {
  const options = CLA.getOptions();
  // console.log(options);
  if(options.help) {
    CLA.printUsage();
    process.exit();
  }

  if(options.output) {
      outputDir = options.output;
  }
  // create output directory if doesn't exists yet
  if(!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  // concat input urls
  if(options.input && options.input.length > 0) {
    options.input.forEach(url => {
      if(!inputURLs.includes(url.toLowerCase())) {
        inputURLs.push(url.toLowerCase());
      }
    });
  }
  if(inputURLs.length == 0) {
    console.log("You don't have any target urls.");
    process.exit();
  }

} catch(err) {
  console.error(err);
  process.exit();
}

// console.log(inputURLs);

(async() => {
  for(const url of inputURLs) {
    const response = await fetch(url);
    const contentHTML = await response.text();
    // fs.writeFileSync("test.html", contentHTML);

    const links = EroMe.getLinksForDownload(contentHTML);
    // console.log(links);
    // path to save the media
    // const mediaPath = EroMe.getMediaPath(url);
    let mediaPath = EroMe.getLinkTitle(contentHTML);
    if(!mediaPath) {
      mediaPath = EroMe.getMediaPath(url);
    }
    // console.log(mediaPath);
    const mediaOutputDir = outputDir +"/"+ mediaPath;
    // create output directory if doesn't exists yet
    if(!fs.existsSync(mediaOutputDir)) {
      fs.mkdirSync(mediaOutputDir, {recursive: true});
    }
    // download media
    for(const link of links) {
      let fileDir = mediaOutputDir + "/video";
      if(link.type == "image") {
        fileDir =  mediaOutputDir + "/images";
      }
      if(!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
      }
      const absolutePath = path.join(fileDir, link.fileName);
      console.log("Downloading "+ link.fileLink +" to "+ absolutePath);
      try {
        await Utility.downloadFile(link.fileLink, absolutePath);
      } catch(err) {
        console.error(err);
      }
    }


  }
})();
