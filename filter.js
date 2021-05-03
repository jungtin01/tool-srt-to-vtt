const fs = require("fs");
const path = require("path");

/* NEW */
function reformatRemoveNumberLine(filePath) {
	const caption = fs.readFileSync(filePath, "utf8");

	const itemName = path.basename(filePath);
	// isCaption file
	const filename = path.basename(itemName, path.extname(itemName));
	const ext = path.extname(itemName);

	if (![".vtt"].includes(ext)) return;

	let rs = "";
	caption.split(/\r?\n/).forEach((line, index) => {
		line = line.replace(/^\d+$/gm, "");
		rs += `${line}\n`;
	});

	fs.writeFileSync(filePath, rs, "utf8");
}

let errFile;
function traverse(currentDir) {
	try {
		console.log(`\n\n==== Folder: ${currentDir} ====\n`);

		const items = fs.readdirSync(currentDir);

		items.forEach((item) => {
			errFile = item;

			const dir = `${currentDir}\\${item}`;

			const stats = fs.lstatSync(dir);
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();

			if (isFile) {
				// isCaption file
				// const filename = path.basename(item, path.extname(item));
				// const ext = path.extname(item);

				reformatRemoveNumberLine(dir);
			} else if (isDir) {
				lastFolder = item;
				traverse(dir);
			}
		});
	} catch (err) {
		console.error(`Read file Err : ${errFile}\n`, err);
	}
}

traverse(`D:\\Thinh\\Code\\caption_converter\\temp-caption`);

/* Old - Only One */
/* 
	const FOLDER = "3. Creating and Using Containers Like a Boss";
	const PATH = `D:\\Thinh\\Code\\caption_converter\\filters\\${FOLDER}`;
	const reg = new RegExp("/^\\d+$/", "gm");
	(() => {
		try {
			const files = fs.readdirSync(PATH);
			files.forEach((filename) => {
				const caption = fs.readFileSync(path, "utf8");

				let rs = "";
				caption.split(/\r?\n/).forEach((line, index) => {
					line = line.replace(/^\d+$/gm, "");
					rs += `${line}\n`;
				});

				fs.writeFileSync(path, rs, "utf8");
			});
		} catch (err) {
			console.error(err);
		}
	})();
*/
