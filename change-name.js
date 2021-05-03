const fs = require("fs");
const path = require("path");

const ROOT_PATH = `D:\\Thinh\\Code\\caption_converter\\temp-caption`;
// const FOLDER_NAME = `18 Discount Coupon for More of My Java Training`;
(() => {
	try {
		const folders = fs.readdirSync(ROOT_PATH);
		folders.forEach((folderName) => {
			if (!fs.existsSync(`${ROOT_PATH}\\${folderName}\\${folderName}.txt`)) return;

			let names = fs.readFileSync(`${ROOT_PATH}\\${folderName}\\${folderName}.txt`, "utf8");

			const filenames = fs.readdirSync(`${ROOT_PATH}\\${folderName}`);

			console.log(filenames);
			console.log(names);

			/*
			=== Xem xét kĩ thằng regex nhé ===
			1. Lấy ra số trong files + lấy tên
			2. Tìm file với số đó => lấy tên
			3. rename
		*/
			const regex = /^(\d+).*\.vtt/g;
			filenames.forEach((name) => {
				const matches = regex.exec(name);
				if (matches) {
					const prefixNum = matches[1];

					// Lấy name phù hợp từ txt
					const reg = new RegExp(`^${prefixNum}\.*`, "gm");
					let matchesName = reg.exec(names);
					matchesName += ".vtt";

					matchesName = matchesName.replace(".en", ""); // cái này tùy hứng thôi

					console.log(`${ROOT_PATH}\\${folderName}\\${name}`);
					console.log(`${ROOT_PATH}\\${folderName}\\${matchesName}`);

					// Rename
					if (fs.existsSync(`${ROOT_PATH}\\${folderName}\\${name}`))
						fs.renameSync(
							`${ROOT_PATH}\\${folderName}\\${name}`,
							`${ROOT_PATH}\\${folderName}\\${matchesName}`
						);
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
})();

// const FOLDER_PATH = `D:\\Docker & Kubernetes The Practical Guide`;
// (() => {
// 	try {
// 		let names = fs.readFileSync(
// 			`${FOLDER_PATH}\\Docker & Kubernetes The Practical Guide.txt`,
// 			"utf8"
// 		);

// 		names.split(/\r?\n/).forEach((name, index) => {
// 			if (fs.existsSync(`${FOLDER_PATH}\\${index + 1}.${name}.mp4`))
// 				fs.renameSync(
// 					`${FOLDER_PATH}\\${index + 1}.${name}.mp4`,
// 					`${FOLDER_PATH}\\${index + 1}. ${name}.mp4`
// 				);

// 			if (fs.existsSync(`${FOLDER_PATH}\\${index + 1}.${name}.srt`))
// 				fs.renameSync(
// 					`${FOLDER_PATH}\\${index + 1}.${name}.srt`,
// 					`${FOLDER_PATH}\\${index + 1}. ${name}.srt`
// 				);
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// })();
