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

let errFile;
let lastFolder;

let replaceFrom;
let replaceTo;
let toCaptionFormat;
let isProd;
let regexSign;

function traverse(currentDir) {
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
				// isCaption file
				const filename = path.basename(item, path.extname(item));
				const ext = path.extname(item);

				/*
			        Duyệt pattern & sub hỗ trợ
			        [đụ má nhớ test ở regex101 trước nha ba]
			    */ let regexPattern = regexSign
					? `.+${regexSign}`
					: null;
				const regex = regexPattern ? new RegExp(regexPattern, "g") : new RegExp(".*", "g");

				if ([".srt", ".sbv", ".sub"].includes(ext) && regex.test(filename)) {
					const caption = fs.readFileSync(dir, "utf8");
					errFile = item;
					console.log(item);

					try {
						let convertedBuffer = subsrt.convert(caption, { format: toCaptionFormat });

						// chỉ LOG_PATH nếu thành công
						fs.appendFileSync(LOG_PATH, `${item}\n`, "utf8");

						const newName = filename.replace(replaceFrom, replaceTo);
						/* Sửa lỗi của module */
						convertedBuffer = Buffer.from(
							convertedBuffer.toString("utf8").replace(/\,/g, "."),
							"utf-8"
						);

						/*
							Ở đây mình nên lưu test trước ở temp folder rồi hãy chạy ở folder thật
						*/

						if (isProd) {
							fs.writeFileSync(
								`${currentDir}\\${newName}.${toCaptionFormat}`,
								convertedBuffer,
								"utf8"
							); // Real
						} else {
							if (!fs.existsSync(`./${TEMP_CAPTION_FOLDER}/${lastFolder}`))
								fs.mkdirSync(`./${TEMP_CAPTION_FOLDER}/${lastFolder}`);

							/*
								Với cách lấy lastFolder này thì bắt buộc trong folder có sub không được có thêm bất kì 1 nested folder nào
							*/
							fs.writeFileSync(
								`./${TEMP_CAPTION_FOLDER}/${lastFolder}/${newName}.${toCaptionFormat}`,
								convertedBuffer,
								"utf8"
							); // Test
						}
					} catch (err) {
						fs.appendFileSync(LOG_ERROR_PATH, `Caption Err : ${item}\n`, "utf8");

						if (!fs.existsSync(`./${TEMP_CAPTION_FOLDER}/${lastFolder}`))
							fs.mkdirSync(`./${TEMP_CAPTION_FOLDER}/${lastFolder}`);

						fs.copyFileSync(
							dir,
							`./${TEMP_CAPTION_FOLDER}/${lastFolder}/${filename}${ext}`
						);

						fs.appendFileSync(
							`${TEMP_CAPTION_FOLDER}/${lastFolder}/${lastFolder}.txt`,
							`${filename}\n`,
							"utf8"
						);
					}
				}
			} else if (isDir) {
				lastFolder = item;
				traverse(dir);
			}
		});
	} catch (err) {
		console.error(`Read file Err : ${errFile}\n`, err);
		fs.appendFileSync(LOG_ERROR_PATH, `Read file Err : ${errFile}\n`, "utf8");
	}
}

function init(init) {
	replaceFrom = init.replacePattern || "";
	replaceTo = "";
	toCaptionFormat = init.toCaptionFormat;
	isProd = init.isProd;
	regexSign = init.regexSign;

	// Xóa & Tạo tempFolder | sử dụng thằng này đúng lúc đúng chỗ nhé
	if (init.delTempCaption) {
		if (fs.existsSync(TEMP_CAPTION_FOLDER))
			fs.rmdirSync(TEMP_CAPTION_FOLDER, {
				recursive: true,
			});
		if (!fs.existsSync(TEMP_CAPTION_FOLDER)) fs.mkdirSync(TEMP_CAPTION_FOLDER);
	}

	traverse(init.currentDir);
}

// init({
// 	currentDir:
// 		"D:\\UTorrent\\Finished\\Python Bootcamp 2020 - Build 15 working Applications and Games",
// 	isProd: true,
// 	delTempCaption: true,
// 	// regexSign: "\\.en",
// 	// replacePattern: ".en",
// 	toCaptionFormat: "vtt",
// });

// init({
// 	currentDir:
// 		"D:\\UTorrent\\Finished\\Udemy - The Complete SQL Bootcamp 2020 Go from Zero to Hero",
// 	isProd: false,
// 	delTempCaption: true,
// 	// regexSign: "\\-subtitle-en",
// 	// replacePattern: "-subtitle-en",
// 	toCaptionFormat: "vtt",
// });

init({
	currentDir: "D:\\Thinh\\Code\\caption_converter\\temp-caption",
	isProd: true,
	delTempCaption: false,
	// regexSign: "\\-subtitle-en",
	// replacePattern: "-subtitle-en",
	toCaptionFormat: "vtt",
});
