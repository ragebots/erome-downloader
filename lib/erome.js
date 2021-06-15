const fetch = require('node-fetch');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const {URL} = require("url");

const getLinksForDownload = (contentHTML) => {
  const links = [];
  try {
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    // get video links
    const videoEls = doc.querySelectorAll("#album > .media-group > .video-lg ");
    // console.log(videoEls.length);
    for(const videoEl of videoEls) {
      const sourceEl = videoEl.querySelector("video > source");
      const src = sourceEl.getAttribute("src");
      const fileName = getMediaPath(src);
      const link = {fileLink: src, fileName: fileName, type: "video"};
      links.push(link);
    }
    // get  images links
    const imagesEl = doc.querySelectorAll("#album > .media-group > div.img[data-src]");
    for(const imageEl of imagesEl) {
      const src = imageEl.getAttribute("data-src");
      const fileName = getMediaPath(src);
      const link = {fileLink: src, fileName: fileName, type: "image"};
      links.push(link);
    }

  } catch(err) {
    console.error(err);
  }
  return links;
}

const getLinkTitle = (contentHTML) => {
  let title = "";
  try {
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    //const titleEl = doc.querySelector("title");
    //const titleText = titleEl.textContent;
    title = doc.title.replace("- Porn | EroMe", "").replace(/[/\\?%*:|"<>]/g, '-').trim();
  } catch(err) {
    console.error(err);
  }
  return title;
}

const getMediaPath = (url) => {
  let path = "";
  try {
    const pathname = new URL(url).pathname;
    const pArr = pathname.split("/");
    let endPart = "";
    for(const part of pArr) {
      if(part.trim()) {
        path = part.trim();
      }
    }
  } catch(err) {

  }
  return path;
}


module.exports = {
  getLinksForDownload,
  getLinkTitle,
  getMediaPath
}
