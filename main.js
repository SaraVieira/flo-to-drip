import "./style.css";
import Alpine from "alpinejs";

import { saveAs } from "file-saver";
import { formatFloJson } from "./src/formatjson";

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result); // desired file content
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });

Alpine.data("fileUpload", () => ({
  file: null,
  fileToDownload: false,

  async onUpload({ target }) {
    this.file = target.files[0];
    const json = await readFile(target.files[0]);
    const readyData = await formatFloJson(JSON.parse(json));
    this.fileToDownload = readyData;
  },
  downloadCSV() {
    const blob = new Blob([this.fileToDownload], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, "drip.csv");
  },
}));

Alpine.start();
