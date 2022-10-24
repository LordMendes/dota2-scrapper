import { XMLHttpRequest } from "xmlhttprequest-ts";

export const requestHtml = (url: string):Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const html = xhr.responseText;
        if (xhr.status === 200) {
          resolve(html);
        } else {
          reject(new Error("Request Promise Error"));
        }
      }
    };
  });
