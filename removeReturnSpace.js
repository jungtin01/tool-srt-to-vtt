const subsrt = require("subsrt");
const fs = require("fs");
const path = require("path");

function removeReturnSpace(filePath) {
	const itemName = path.basename(filePath);
	// isCaption file
	const filename = path.basename(itemName, path.extname(itemName));
	const ext = path.extname(itemName);

	if (![".srt"].includes(ext)) return;

	let input = fs.readFileSync(filePath, "utf-8");
	console.log(input);
	const output = input.replace(/(?:\r\n|\r|\n)/g, "\n");
	console.log(output);
	if (fs.existsSync("./output.srt")) fs.unlinkSync("./output.srt");

	fs.writeFileSync("./output.srt", output);
}

removeReturnSpace(
	`D:\\Thinh\\Code\\caption_converter\\temp-caption\\01 Course Introduction\\001 Introduction To The Course.en.srt`
);

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

				removeReturnSpace(dir);
			} else if (isDir) {
				lastFolder = item;
				traverse(dir);
			}
		});
	} catch (err) {
		console.error(`Read file Err : ${errFile}\n`, err);
	}
}

// traverse(`D:\\Thinh\\Code\\caption_converter\\temp-caption`);
