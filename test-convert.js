const fs = require("fs");
const subsrt = require("subsrt");
const path = require("path");

/* Helpers */
const LOG_PATH = "./traverse-test-logs.txt";
const LOG_ERROR_PATH = "./traverse-test-errors.txt";
const LOG_ERROR_DETAIL_PATH = "./traverse-test-errors-detail.txt";

/* Khởi tạo LOG */
if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH);
if (fs.existsSync(LOG_ERROR_PATH)) fs.unlinkSync(LOG_ERROR_PATH);
if (fs.existsSync(LOG_ERROR_DETAIL_PATH)) fs.unlinkSync(LOG_ERROR_DETAIL_PATH);

const toCaptionFormat = "vtt";

let errFile;
const traverse = function (currentDir) {
	try {
		console.log(`\n\n==== Folder: ${currentDir} ====\n`);
		fs.appendFileSync(LOG_PATH, `\n\n==== Folder: ${currentDir} ====\n`, "utf8");

		const items = fs.readdirSync(currentDir);

		items.forEach((item) => {
			const dir = `${currentDir}/${item}`;

			const stats = fs.lstatSync(dir);
			const isFile = stats.isFile();
			const isDir = stats.isDirectory();
			if (isFile) {
				// isCaption file
				const filename = path.basename(item, path.extname(item));
				const ext = path.extname(item);

				/* 
                    Duyệt pattern & sub hỗ trợ
                    [đụ má nhớ test ở regex101 trước nha ba]
                */
				// let regexPattern = ".+\\-subtitle-en";
				let regexPattern = null;
				const regex = regexPattern ? new RegExp(regexPattern, "g") : new RegExp(".*", "g");

				if ([".srt", ".sbv", ".sub"].includes(ext) && regex.test(filename)) {
					errFile = item;
					const caption = fs.readFileSync(dir, "utf8");
					console.log(item);

					try {
						subsrt.convert(caption, { format: toCaptionFormat });

						// chỉ LOG_PATH nếu thành công
						fs.appendFileSync(LOG_PATH, `${item}\n`, "utf8");
					} catch (err) {
						fs.appendFileSync(LOG_ERROR_PATH, `Caption Err : ${item}\n`, "utf8");
						fs.appendFileSync(LOG_ERROR_DETAIL_PATH, `${err.message}\n`, "utf8");
					}
				}
			} else if (isDir) traverse(dir);
		});
	} catch (err) {
		console.error(`Read file Err : ${errFile}\n`, err);
		fs.appendFileSync(LOG_ERROR_PATH, `Read file Err : ${errFile}\n`, "utf8");
	}
};

traverse("D:\\UTorrent\\Finished\\Udemy - The Complete SQL Bootcamp 2020 Go from Zero to Hero");
