const fs = require("fs");
const subsrt = require("subsrt");
const path = require("path");

/* Helpers */
const LOG_PATH = "./traverse-logs.txt";
const LOG_ERROR_PATH = "./traverse-errors.txt";
const TEMP_CAPTION_FOLDER = "./temp-caption";

/* Khởi tạo */
if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH);
if (fs.existsSync(LOG_ERROR_PATH)) fs.unlinkSync(LOG_ERROR_PATH);

// Xóa & Tạo tempFolder
if (fs.existsSync(TEMP_CAPTION_FOLDER))
	fs.rmdirSync(TEMP_CAPTION_FOLDER, {
		recursive: true,
	});
if (!fs.existsSync(TEMP_CAPTION_FOLDER)) fs.mkdirSync(TEMP_CAPTION_FOLDER);

// const replaceFrom = "-en";
const replaceFrom = "";
const replaceTo = "";
const toCaptionFormat = "vtt";

let errFile;
let lastFolder;
function traverse(currentDir, isProd) {
	try {
		console.log(`\n\n==== Folder: ${currentDir} ====\n`);
		fs.appendFileSync(LOG_PATH, `\n\n==== Folder: ${currentDir} ====\n`, "utf8");

		const items = fs.readdirSync(currentDir);

		items.forEach((item) => {
			const dir = `${currentDir}\\${item}`;

			const stats = fs.lstatSync(dir);
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();

			if (isFile) {
				let filename = path.basename(item, path.extname(item));
				const ext = path.extname(item);

				filename = filename.replace("--- [ FreeCourseWeb.com ] ---", "");

				console.log(`${currentDir}\\${item}\n`);
				console.log(`${currentDir}\\${filename}${ext}\n\n`);

				fs.renameSync(`${currentDir}\\${item}`, `${currentDir}\\${filename}${ext}`);
			} else if (isDir) {
				traverse(dir, isProd);
			}
		});
	} catch (err) {
		console.error(`Read file Err : ${errFile}\n`, err);
		fs.appendFileSync(LOG_ERROR_PATH, `Read file Err : ${errFile}\n`, "utf8");
	}
}

traverse(
	"D:\\UTorrent\\Finished\\Udemy - C# Basics for Beginners - Learn C# Fundamentals by Coding (Update)",
	true
);
