const subsrt = require("subsrt");
const fs = require("fs");
const path = require("path");

/* 
    Lọc format srt

        Found match, group 0: 24

        00:01:48,680 --> 00:01:53,480

        We just for our capital park here, you can see it, show us that place.

    Found match, group 1: 24
    Found match, group 2: \r\n
    Found match, group 3: 00:01:48,680 --> 00:01:53,480
    Found match, group 4: \r\n
    Found match, group 5: We just for our capital park here, you can see it, show us that place.
*/

function reformatSRT(filePath) {
	const itemName = path.basename(filePath);
	// isCaption file
	const filename = path.basename(itemName, path.extname(itemName));
	const ext = path.extname(itemName);

	if (![".srt"].includes(ext)) return;

	const input = fs.readFileSync(filePath, "utf8");

	// Nhớ chỉnh lại space của -> tùy trường hợp nhé
	const regex = /(\d+)[\r\n]+(\d+:\d+:\d+,\d+  -->  \d+:\d+:\d+,\d+)[\r\n]+([^\n]+)[\r\n][\r\n]([^\n]+)/gm;

	let output = "";
	let m;
	while ((m = regex.exec(input)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		output += `${m[1]}\n`;
		output += `${m[2]}\n`;
		output += `${m[3].replace(/[\r\n]/g, "")} ${m[4].replace(/\d+/, "")}\n\n`;

		/* For Testing */
		// console.log(`${m[1]}`);
		// console.log(`${m[2]}`);
		// console.log(`${m[3].replace(/[\r\n]/g, "")} ${m[4].replace(/\d+/, "")}\n\n`);
		// m.forEach((value, index) => {
		// 	console.log(`${index}. ${value}`);
		// });
		// console.log("\n\n==========\n");
	}

	fs.writeFileSync(filePath, output);
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

				reformatSRT(dir);
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
// reformatSRT(
// 	`D:\\Thinh\\Code\\caption_converter\\temp-caption\\2. A Full Python Refresher\\1. Introduction to this section.srt`
// );
