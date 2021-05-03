/* 
	==== Hướng dẫn sử dụng ====
	Trước khi convert thì nên test-convert trước vì sẽ có những file nhỏ bị lỗi
	1. Lưu ý chỗ regex (nếu không match thì không duyệt được ai cả)
	2. Lưu ý fromName -> toName

	==== Test ====
	1. Khi chạy test thì những file chạy thành công được LOG vào [./traverse-test-logs.txt]
	2. Còn không thành công thì LOG vào [./traverse-test-errors.txt]
*/

/* 
	Flow phổ biến nhất khi chạy
	1. chạy test
	2. chạy convert
		- nếu còn bị lỗi -> convert tay + chạy change-name.js
		- full lỗi (lỗi tách hàng) -> chạy reformatSRT tại temp-caption -> chạy convert tại chỗ không del(temp-caption)
	
	nếu muốn đổi tên bình thường thì dùng traverse-change-name
	
*/
