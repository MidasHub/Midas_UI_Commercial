const templateHDCTV = `
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>1. [ATOM] Hop dong hop tac kinh doanh - Final</title>
		<style>
/* cspell:disable-file */
/* webkit printing magic: print all background colors */
html {
	-webkit-print-color-adjust: exact;
}
* {
	box-sizing: border-box;
	-webkit-print-color-adjust: exact;
}

html,
 
 
body {
	line-height: 1.5;
	margin: 2em auto;
		max-width: 900px;
		color: rgb(55, 53, 47);
}

a,
a.visited {
	color: inherit;
	text-decoration: underline;
}

.pdf-relative-link-path {
	font-size: 80%;
	color: #444;
}

h1,
h2,
h3 {
	letter-spacing: -0.01em;
	line-height: 1.2;
	font-weight: 600;
	margin-bottom: 0;
}

.page-title {
	font-size: 2.5rem;
	font-weight: 700;
	margin-top: 0;
	margin-bottom: 0.75em;
}

h1 {
	font-size: 1.875rem;
	margin-top: 1.875rem;
}

h2 {
	font-size: 1.5rem;
	margin-top: 1.5rem;
}

h3 {
	font-size: 1.25rem;
	margin-top: 1.25rem;
}

.source {
	border: 1px solid #ddd;
	border-radius: 3px;
	padding: 1.5em;
	word-break: break-all;
}

.callout {
	border-radius: 3px;
	padding: 1rem;
}

figure {
	margin: 1.25em 0;
	page-break-inside: avoid;
}

figcaption {
	opacity: 0.5;
	font-size: 85%;
	margin-top: 0.5em;
}

mark {
	background-color: transparent;
}

.indented {
	padding-left: 1.5em;
}

hr {
	background: transparent;
	display: block;
	width: 100%;
	height: 1px;
	visibility: visible;
	border: none;
	border-bottom: 1px solid rgba(55, 53, 47, 0.09);
}

img {
	max-width: 100%;
}


.collection-content {
	font-size: 0.875rem;
}

.column-list {
	display: flex;
	justify-content: space-between;
}

.column {
	padding: 0 1em;
}

.column:first-child {
	padding-left: 0;
}

.column:last-child {
	padding-right: 0;
}

.table_of_contents-item {
	display: block;
	font-size: 0.875rem;
	line-height: 1.3;
	padding: 0.125rem;
}

.table_of_contents-indent-1 {
	margin-left: 1.5rem;
}

.table_of_contents-indent-2 {
	margin-left: 3rem;
}

.table_of_contents-indent-3 {
	margin-left: 4.5rem;
}

.table_of_contents-link {
	text-decoration: none;
	opacity: 0.7;
	border-bottom: 1px solid rgba(55, 53, 47, 0.18);
}

table,
th,
td {
	border: 1px solid rgba(55, 53, 47, 0.09);
	border-collapse: collapse;
}

table {
	border-left: none;
	border-right: none;
}

th,
td {
	font-weight: normal;
	padding: 0.25em 0.5em;
	line-height: 1.5;
	min-height: 1.5em;
	text-align: left;
}

th {
	color: rgba(55, 53, 47, 0.6);
}

ol,
ul {
	margin: 0;
	margin-block-start: 0.6em;
	margin-block-end: 0.6em;
}

li > ol:first-child,
li > ul:first-child {
	margin-block-start: 0.6em;
}

ul > li {
	list-style: disc;
}

ul.to-do-list {
	text-indent: -1.7em;
}

ul.to-do-list > li {
	list-style: none;
}

.to-do-children-checked {
	text-decoration: line-through;
	opacity: 0.375;
}

ul.toggle > li {
	list-style: none;
}

ul {
	padding-inline-start: 1.7em;
}

ul > li {
	padding-left: 0.1em;
}

ol {
	padding-inline-start: 1.6em;
}

ol > li {
	padding-left: 0.2em;
}

.mono ol {
	padding-inline-start: 2em;
}

.mono ol > li {
	text-indent: -0.4em;
}

.toggle {
	padding-inline-start: 0em;
	list-style-type: none;
}

/* Indent toggle children */
.toggle > li > details {
	padding-left: 1.7em;
}

.toggle > li > details > summary {
	margin-left: -1.1em;
}

.selected-value {
	display: inline-block;
	padding: 0 0.5em;
	background: rgba(206, 205, 202, 0.5);
	border-radius: 3px;
	margin-right: 0.5em;
	margin-top: 0.3em;
	margin-bottom: 0.3em;
	white-space: nowrap;
}

.collection-title {
	display: inline-block;
	margin-right: 1em;
}

time {
	opacity: 0.5;
}

.icon {
	display: inline-block;
	max-width: 1.2em;
	max-height: 1.2em;
	text-decoration: none;
	vertical-align: text-bottom;
	margin-right: 0.5em;
}

img.icon {
	border-radius: 3px;
}

.user-icon {
	width: 1.5em;
	height: 1.5em;
	border-radius: 100%;
	margin-right: 0.5rem;
}

.user-icon-inner {
	font-size: 0.8em;
}

.text-icon {
	border: 1px solid #000;
	text-align: center;
}

.page-cover-image {
	display: block;
	object-fit: cover;
	width: 100%;
	height: 30vh;
}

.page-header-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
}

.page-header-icon-with-cover {
	margin-top: -0.72em;
	margin-left: 0.07em;
}

.page-header-icon img {
	border-radius: 3px;
}

.link-to-page {
	margin: 1em 0;
	padding: 0;
	border: none;
	font-weight: 500;
}

p > .user {
	opacity: 0.5;
}

td > .user,
td > time {
	white-space: nowrap;
}

input[type="checkbox"] {
	transform: scale(1.5);
	margin-right: 0.6em;
	vertical-align: middle;
}

p {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}

.image {
	border: none;
	margin: 1.5em 0;
	padding: 0;
	border-radius: 0;
	text-align: center;
}

.code,
code {
	background: rgba(135, 131, 120, 0.15);
	border-radius: 3px;
	padding: 0.2em 0.4em;
	border-radius: 3px;
	font-size: 85%;
	tab-size: 2;
}

code {
	color: #eb5757;
}

.code {
	padding: 1.5em 1em;
}

.code-wrap {
	white-space: pre-wrap;
	word-break: break-all;
}

.code > code {
	background: none;
	padding: 0;
	font-size: 100%;
	color: inherit;
}

blockquote {
	font-size: 1.25em;
	margin: 1em 0;
	padding-left: 1em;
	border-left: 3px solid rgb(55, 53, 47);
}

.bookmark {
	text-decoration: none;
	max-height: 8em;
	padding: 0;
	display: flex;
	width: 100%;
	align-items: stretch;
}

.bookmark-title {
	font-size: 0.85em;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 1.75em;
}

.bookmark-text {
	display: flex;
	flex-direction: column;
}

.bookmark-info {
	flex: 4 1 180px;
	padding: 12px 14px 14px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.bookmark-image {
	width: 33%;
	flex: 1 1 180px;
	display: block;
	position: relative;
	object-fit: cover;
	border-radius: 1px;
}

.bookmark-description {
	color: rgba(55, 53, 47, 0.6);
	font-size: 0.75em;
	overflow: hidden;
	max-height: 4.5em;
	word-break: break-word;
}

.bookmark-href {
	font-size: 0.75em;
	margin-top: 0.25em;
}

.sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"; }
.code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; }
.serif { font-family: Lyon-Text, Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", "SimSun", "Nanum Myeongjo", NanumMyeongjo, Batang, serif; }
.mono { font-family: iawriter-mono, Nitti, Menlo, Courier, monospace; }
.pdf .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol", 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK SC', 'Noto Sans CJK KR'; }

.pdf .code { font-family: Source Code Pro, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC', 'Noto Sans Mono CJK KR'; }

.pdf .serif { font-family: PT Serif, Lyon-Text, Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", "SimSun", "Nanum Myeongjo", NanumMyeongjo, Batang, serif, 'Twemoji', 'Noto Color Emoji', 'Noto Sans CJK SC', 'Noto Sans CJK KR'; }

.pdf .mono { font-family: PT Mono, iawriter-mono, Nitti, Menlo, Courier, monospace, 'Twemoji', 'Noto Color Emoji', 'Noto Sans Mono CJK SC', 'Noto Sans Mono CJK KR'; }

.highlight-default {
}
.highlight-gray {
	color: rgb(155,154,151);
}
.highlight-brown {
	color: rgb(100,71,58);
}
.highlight-orange {
	color: rgb(217,115,13);
}
.highlight-yellow {
	color: rgb(223,171,1);
}
.highlight-teal {
	color: rgb(15,123,108);
}
.highlight-blue {
	color: rgb(11,110,153);
}
.highlight-purple {
	color: rgb(105,64,165);
}
.highlight-pink {
	color: rgb(173,26,114);
}
.highlight-red {
	color: rgb(224,62,62);
}
.highlight-gray_background {
	background: rgb(235,236,237);
}
.highlight-brown_background {
	background: rgb(233,229,227);
}
.highlight-orange_background {
	background: rgb(250,235,221);
}
.highlight-yellow_background {
	background: rgb(251,243,219);
}
.highlight-teal_background {
	background: rgb(221,237,234);
}
.highlight-blue_background {
	background: rgb(221,235,241);
}
.highlight-purple_background {
	background: rgb(234,228,242);
}
.highlight-pink_background {
	background: rgb(244,223,235);
}
.highlight-red_background {
	background: rgb(251,228,228);
}
.block-color-default {
	color: inherit;
	fill: inherit;
}
.block-color-gray {
	color: rgba(55, 53, 47, 0.6);
	fill: rgba(55, 53, 47, 0.6);
}
.block-color-brown {
	color: rgb(100,71,58);
	fill: rgb(100,71,58);
}
.block-color-orange {
	color: rgb(217,115,13);
	fill: rgb(217,115,13);
}
.block-color-yellow {
	color: rgb(223,171,1);
	fill: rgb(223,171,1);
}
.block-color-teal {
	color: rgb(15,123,108);
	fill: rgb(15,123,108);
}
.block-color-blue {
	color: rgb(11,110,153);
	fill: rgb(11,110,153);
}
.block-color-purple {
	color: rgb(105,64,165);
	fill: rgb(105,64,165);
}
.block-color-pink {
	color: rgb(173,26,114);
	fill: rgb(173,26,114);
}
.block-color-red {
	color: rgb(224,62,62);
	fill: rgb(224,62,62);
}
.block-color-gray_background {
	background: rgb(235,236,237);
}
.block-color-brown_background {
	background: rgb(233,229,227);
}
.block-color-orange_background {
	background: rgb(250,235,221);
}
.block-color-yellow_background {
	background: rgb(251,243,219);
}
.block-color-teal_background {
	background: rgb(221,237,234);
}
.block-color-blue_background {
	background: rgb(221,235,241);
}
.block-color-purple_background {
	background: rgb(234,228,242);
}
.block-color-pink_background {
	background: rgb(244,223,235);
}
.block-color-red_background {
	background: rgb(251,228,228);
}
.select-value-color-default { background-color: rgba(206,205,202,0.5); }
.select-value-color-gray { background-color: rgba(155,154,151, 0.4); }
.select-value-color-brown { background-color: rgba(140,46,0,0.2); }
.select-value-color-orange { background-color: rgba(245,93,0,0.2); }
.select-value-color-yellow { background-color: rgba(233,168,0,0.2); }
.select-value-color-green { background-color: rgba(0,135,107,0.2); }
.select-value-color-blue { background-color: rgba(0,120,223,0.2); }
.select-value-color-purple { background-color: rgba(103,36,222,0.2); }
.select-value-color-pink { background-color: rgba(221,0,129,0.2); }
.select-value-color-red { background-color: rgba(255,0,26,0.2); }

.checkbox {
	display: inline-flex;
	vertical-align: text-bottom;
	width: 16;
	height: 16;
	background-size: 16px;
	margin-left: 2px;
	margin-right: 5px;
}

.checkbox-on {
	background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2358A9D7%22%2F%3E%0A%3Cpath%20d%3D%22M6.71429%2012.2852L14%204.9995L12.7143%203.71436L6.71429%209.71378L3.28571%206.2831L2%207.57092L6.71429%2012.2852Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E");
}

.checkbox-off {
	background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20x%3D%220.75%22%20y%3D%220.75%22%20width%3D%2214.5%22%20height%3D%2214.5%22%20fill%3D%22white%22%20stroke%3D%22%2336352F%22%20stroke-width%3D%221.5%22%2F%3E%0A%3C%2Fsvg%3E");
}
	
</style>
	</head>
	<body>
		<article id="db96346b-2feb-4c06-b968-ded31d0211ea" class="page sans">
			<header>
				<h1 class="page-title">1. [ATOM] Hop dong hop tac kinh doanh - Final</h1>
			</header>
			<div class="page-body">
				<h1 id="bbec7995-17cf-4d49-844d-8e73fed546d6" class="">
					<strong>HỢP ĐỒNG HỢP TÁC KINH DOANH</strong>
				</h1>
				<p id="682213ac-c6ea-4b2c-baf7-2804b273fe16" class="">
					<strong>HỢP ĐỒNG HỢP TÁC KINH DOANH </strong>(“
					<strong>Hợp Đồng</strong>”) này được ký ngày …… tháng …… năm ………. tại TP. Hồ Chí Minh bởi và giữa Các Bên:
				</p>
				<ul id="e5c3227a-92e1-4f21-bbcc-abbe28a45839" >
					<li>
						<strong></strong>
						<strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>,
						<p id="1daa8eb0-528e-48dd-9fb8-ee7a3bb4bb67" class="">Địa chỉ: 62B Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh, Việt Nam</p>
						<p id="bd81f950-ea8c-4b49-897b-82e523157de6" class="">Người đại diện theo pháp luật: Trần Ngọc Dũng</p>
						<p id="9fc9ad28-2883-4c74-8834-0fc33ea8b1cc" class="">Chức danh: Chủ tịch Hội đồng Quản trị</p>
						<p id="fc48e5b8-ca5c-4ed5-afec-c38ee1fe47ff" class="">Mã số thuế: 0316887099</p>
						<p id="68b534c3-a918-4ee9-82f1-1b302c58adb7" class="">(Sau đây gọi là 
							<strong>ATOM)</strong>
						</p>
					</li>
				</ul>
				<ul id="6b016f5e-8b3f-4a79-b645-30f7daf6e8ae" >
					<li>
						<strong></strong>
						<strong>BÊN ĐẠI LÝ:</strong>
						<p id="32306b73-298f-4948-a786-22002310dceb" class="">Người đại diện:</p>
						<p id="e0aea751-8c08-4b9f-a5a3-da8952b2c079" class="">Địa chỉ:</p>
						<p id="a4b06410-6317-4656-aa7e-0887122f22ea" class="">Mã số thuế:</p>
						<p id="52466a10-21f6-414a-8e45-b8559aef8d82" class="">(Sau đây gọi là 
							<strong>ĐẠI LÝ)</strong>
						</p>
						<p id="01a6e4f4-e47c-49aa-93ae-5fd687849ec1" class="">Trong Hợp Đồng này, ATOM và ĐẠI LÝ được gọi riêng là 
							<strong>Bên</strong> và gọi chung là 
							<strong>Các Bên</strong>.
						</p>
					</li>
				</ul>
				<p id="c742d31a-5bec-4f05-ac6f-9c627867cee7" class="">
					<span style="border-bottom:0.05em solid">
						<strong>XÉT RẰNG</strong>
					</span>
					<strong>:</strong>
				</p>
				<ul id="9bde554e-618f-4d2e-8596-5f1208645f52" >
					<li>
						<strong>ATOM </strong>là một doanh nghiệp cung cấp dịch vụ thông tin, quảng cáo, cơ sở dữ liệu, thương mại điện tử, dịch vụ hỗ trợ thư ký… ATOM có khả năng cung cấp các dịch vụ nêu trên liên quan đến việc đưa ra thông tin, tư vấn, hỗ trợ khách hàng đối với việc sử dụng thẻ;
					</li>
				</ul>
				<ul id="02c70145-cd34-49ec-943a-0b8167cf9016" >
					<li>
						<strong>ĐẠI LÝ </strong>là một doanh nghiệp/hộ kinh doanh/chi nhánh được thành lập và hoạt động hợp pháp tại Việt Nam, có khả năng tìm kiếm Khách Hàng cho ATOM;
					</li>
				</ul>
				<ul id="9fbeaf2d-d9a7-426e-8be6-4400473ed2f8" >
					<li>
						<strong>Các Bên</strong> đã thông báo cho nhau và nắm bắt đầy đủ các thông tin về khả năng, tình trạng pháp lý, mức độ chuyên nghiệp của Các Bên và bản chất Hợp Đồng này;
					</li>
				</ul>
				<ul id="49a3c69b-d933-4aa3-b8b5-8da04180cf88" >
					<li>
						<strong>Các Bên</strong> đồng ý ký kết Hợp Đồng để đạt được những mục tiêu đã thỏa thuận và đảm bảo thực hiện quyền và nghĩa vụ của mỗi Bên phù hợp với quy định pháp luật hiện hành tại Việt Nam.
					</li>
				</ul>
				<p id="bc65c86d-634d-4d84-ac7c-179f93f4e1a8" class="">
					<strong>DO ĐÓ</strong>, Các Bên cùng ký 
					<strong>HỢP ĐỒNG HỢP TÁC KINH DOANH</strong> với các nội dung và điều khoản sau đây:
				</p>
				<p id="20823654-4080-41a1-9422-7df4193b058f" class="">
					<strong>ĐIỀU 1. ĐỊNH NGHĨA VÀ DIỄN GIẢI</strong>
				</p>
				<ul id="40ade293-31e5-48f4-ae77-f2faa9d05b9a" >
					<li>
						<strong></strong>
						<strong>Khách Hàng</strong> có nghĩa là những cá nhân có nhu cầu được tư vấn về thông tin, cách thức sử dụng nhằm tối ưu hóa việc sử dụng Thẻ Ngân Hàng của Khách Hàng thông qua các chương trình khuyến mãi của Ngân hàng phát hành thẻ.
					</li>
				</ul>
				<ul id="bdd7d984-c93b-4df6-8bf2-120c5e194a00" >
					<li>
						<strong></strong>
						<strong>Dịch Vụ Tư Vấn Thông tin Thẻ </strong>có nghĩa là các hoạt động tư vấn thông tin, cách thức sử dụng nhằm tối ưu hóa việc sử dụng Thẻ Ngân Hàng của Khách Hàng. Dịch vụ hỗ trợ thư ký nhằm hỗ trợ khách hàng trong việc quản lý, sử dụng thẻ.
					</li>
				</ul>
				<ul id="95e0e7b9-c208-486f-a59d-42e22ff171cd" >
					<li>
						<strong></strong>
						<strong>Ngày Hiệu Lực</strong> có nghĩa là ngày mà Hợp Đồng này phát sinh hiệu lực áp dụng và cũng là ngày mà Các Bên ký Hợp Đồng này.
					</li>
				</ul>
				<ul id="52b264aa-65f3-401a-be83-314ad5f9b609" >
					<li>
						<strong></strong>
						<strong>Ngày Làm Việc </strong>có nghĩa là ngày dương lịch mà không phải ngày thứ bảy, chủ nhật và ngày lễ theo quy định pháp luật Việt Nam.
					</li>
				</ul>
				<ul id="f82a4241-99c9-468d-bed4-f0247ec86411" >
					<li>
						<strong></strong>
						<strong>Khóa Đào Tạo</strong> có nghĩa là các buổi đào tạo, kiểm tra, triển khai mẫu Dịch Vụ Tư Vấn do ATOM tổ chức với sự tham gia đầy đủ của đại diện của ĐẠI LÝ cho mục đích giao kết Hợp Đồng này và tìm kiếm Khách Hàng.
					</li>
				</ul>
				<ul id="248b2334-42c7-40e5-afda-2a1567051b47" >
					<li>
						<strong></strong>
						<strong>Khách Hàng Thành Công </strong>có nghĩa là Khách Hàng do ĐẠI LÝ tìm kiếm được có nhu cầu sử dụng Dịch Vụ Tư Vấn Thông tin Thẻ của ATOM. Khi Khách Hàng đồng ý sử dụng dịch vụ của ATOM thông qua việc ký kết Hợp Đồng Dịch Vụ với ATOM hoặc ký với Đại lý khi ATOM cho phép sẽ chính thức trở thành Khách Hàng Thành Công.
					</li>
				</ul>
				<ul id="c7219462-ea19-4b1b-b72d-6f33121b13bb" >
					<li>
						<strong></strong>
						<strong>Thù Lao Đại Lý</strong> là khoản tiền mà ĐẠI LÝ được hưởng dựa trên mỗi Khách Hàng Thành Công mà ĐẠI LÝ tìm kiếm được thông qua Dịch Vụ Tư Vấn, nội dung cụ thể quy định tại Điều 4 Hợp Đồng này.
					</li>
				</ul>
				<p id="76efff7e-8f32-4030-b64f-916a15107b63" class="">
					<strong>ĐIỀU 2. PHẠM VI GIAO ĐẠI LÝ</strong>
				</p>
				<ul id="3fd95ec9-935a-467f-930f-f8e9892c181f" >
					<li>
						<strong></strong>ATOM giao cho ĐẠI LÝ thực hiện việc:
						<ol id="297541d9-cb29-4e78-adc9-e0e554a5f4ed" class="numbered-list" start="1">
							<li>Quảng bá, giới thiệu, marketing và tư vấn về Dịch Vụ Tư Vấn Thông tin Thẻ trong phạm vi Khóa Đào Tạo hoặc thông tin mà ATOM đã cung cấp.</li>
						</ol>
					</li>
				</ul>
				<p id="21807e5f-6a9e-41fe-80c1-6ca2e655b6c4" class="">
					<strong>ĐIỀU 3. THỜI HẠN HỢP TÁC</strong>
				</p>
				<ul id="59f5f0d5-918e-4d4a-8b2f-e5d21ccf8548" >
					<li>
						<strong></strong>Hợp Đồng này có thời hạn là một năm (
						<strong>Thời Hạn</strong>) kể từ Ngày Hiệu Lực. Trong vòng 30 ngày trước Ngày Hết Hạn, một Bên có nhu cầu gia hạn phải gửi yêu cầu đến Bên còn lại. Các Bên sẽ cùng thỏa thuận việc gia hạn Hợp Đồng và điều chỉnh các điều khoản phù hợp với tình hình kinh doanh.
					</li>
				</ul>
				<ul id="fc014582-dddb-4a28-8a22-83eab8ef629e" >
					<li>
						<strong></strong>Bất chấp những quy định trên, Hợp Đồng này sẽ tự động hết hạn (i) trong trường hợp quá 03 tháng mà ĐẠI LÝ không có được bất kỳ Khách Hàng Thành Công nào; hoặc (ii) tùy theo quyết định của ATOM khi đã thông báo trước đến ĐẠI LÝ ít nhất trước 15 (mười lăm) ngày.
					</li>
				</ul>
				<p id="3b08d424-3a4e-4354-ac10-62b80b5535c1" class="">
					<strong>ĐIỀU 4. THÙ LAO ĐẠI LÝ</strong>
				</p>
				<ul id="d9681bd8-0c3a-48e2-bc43-a7ab989fec40" >
					<li>
						<strong>1 </strong>Thù Lao Đại Lý
					</li>
				</ul>
				<p id="f7967f8f-e836-4a96-81bf-15a9ad3d0dee" class="">Thù Lao Đại Lý được tính trên cơ sở Khách Hàng Thành Công.</p>
				<p id="cbc0bcb0-959d-458b-bd36-4da45b32b0a3" class="">Hai bên sẽ tiến hành đối soát sau mỗi ba tháng để tính Thù Lao Đại Lý.</p>
				<p id="f06ae213-249f-4217-af76-5fccdfdbe72a" class="">Đại lý có nghĩa vụ cung cấp định kỳ ba tháng hoặc khi ATOM yêu cầu:
					<div class="indented">
						<ol id="91a86efa-962c-49b5-b5d4-e1b2e4278b4f" class="numbered-list" start="1">
							<li>Danh sách các Khách Hàng Thành Công;</li>
						</ol>
						<ol id="057e69ff-dce9-4306-adb9-d5e98e90df5f" class="numbered-list" start="2">
							<li>Danh sách Khách Hàng mà Đại Lý đã tiếp cận, tư vấn, giới thiệu Dịch Vụ Tư Vấn Thông tin Thẻ;</li>
						</ol>
						<ol id="60456529-68e3-4ef2-b5d1-bc4022395c02" class="numbered-list" start="3">
							<li>Các tài liệu liên quan đến Dữ Liệu của Khách Hàng .</li>
						</ol>
					</div>
				</p>
				<ul id="d77f2163-07f0-460f-bbd9-ba5d3c8cb405" >
					<li>
						<strong>2 </strong>Phương thức thanh toán:
					</li>
				</ul>
				<p id="e8ca7ff4-f613-49a6-ba5a-023d93edcf11" class="">ATOM sẽ thanh toán tổng Thù Lao Đại Lý cho ĐẠI LÝ sau khi đối soát bằng hình thức chuyển khoản vào tài khoản của ĐẠI LÝ.</p>
				<ul id="75823fd9-b552-4e84-bac7-ee0a7d32b44e" >
					<li>
						<strong>3 </strong>Mỗi Bên tự chịu mọi khoản chi phí và nghĩa vụ kê khai, nộp thuế của riêng mình trong quá trình thực hiện Hợp Đồng này.
					</li>
				</ul>
				<p id="351e89c3-6fc8-4233-952f-50fc77087035" class="">
					<strong>ĐIỀU </strong>
					<strong>5</strong>
					<strong>. CÁC HÌNH THỨC THỰC HIỆN</strong>
				</p>
				<ul id="5979d987-5d9f-4e74-b3f1-882c2b2658a1" >
					<li>
						<strong></strong>Đặt logo, tài liệu quảng cáo, banner và các băng rôn quảng cáo về nội dung Dịch Vụ Tư Vấn Thông tin Thẻ của ATOM tại địa điểm kinh doanh của ĐẠI LÝ.
					</li>
				</ul>
				<ul id="d06bd12f-1ba7-44cf-8bde-85d1f9c362dd" >
					<li>
						<strong></strong>ĐẠI LÝ có toàn quyền lựa chọn các cách thức giới thiệu Dịch Vụ Tư Vấn Thông tin Thẻ đến Khách hàng như tư vấn trực tiếp, gián tiếp, làm mẫu cách thức sử dụng thẻ… và tự chịu trách nhiệm trong hoạt động của mình.
					</li>
				</ul>
				<ul id="fc75ad85-423f-4862-ada6-839114494b42" >
					<li>
						<strong></strong>ATOM sẽ cử đại diện để kiểm tra, giám sát việc thực hiện Hợp Đồng của ĐẠI LÝ theo định kỳ 1-2 lần/tháng.
					</li>
				</ul>
				<ul id="44772546-89f6-4aaf-a82c-9dad456accb5" >
					<li>
						<strong></strong>ATOM và ĐẠI LÝ có thể hợp tác thực hiện các hoạt động Marketing nhằm mục đích đạt được những lợi ích chung với điều kiện nội dung hợp tác và các chi phí liên quan sẽ được các Bên thỏa thuận bằng văn bản để phù hợp nhu cầu tại từng thời điểm.
					</li>
				</ul>
				<p id="d471c49b-e188-4297-a92d-20602734c950" class="">
					<strong>ĐIỀU </strong>
					<strong>6</strong>
					<strong>. QUYỀN VÀ NGHĨA VỤ CỦA ATOM</strong>
				</p>
				<ul id="fcfd3119-012b-44a4-b0a9-b2320bcb9c09" >
					<li>
						<strong></strong>Ấn định các nội dung và phạm vi của Dịch Vụ Tư Vấn Thông tin Thẻ.
					</li>
				</ul>
				<ul id="0644064c-a067-4362-9899-0632d0a70a03" >
					<li>
						<strong></strong>Ấn định mức Thù Lao Đại Lý.
					</li>
				</ul>
				<ul id="2a8e67a5-86de-4ff7-b10e-f82b1e432d97" >
					<li>
						<strong></strong>Là chủ sở hữu đối với Dữ Liệu theo quy định tại khoản 2 Điều 2 Hợp Đồng này; và có quyền yêu cầu ĐẠI LÝ chuyển giao các Dữ Liệu thu thập được cho ATOM.
					</li>
				</ul>
				<ul id="abb1c860-0a5a-4980-8f37-8575b5109930" >
					<li>
						<strong></strong>Có quyền tạm hoãn Hợp Đồng này bất cứ lúc nào nếu nhận thấy có sự sai sót, vi phạm quy định Hợp Đồng hoặc quy định pháp luật của ĐẠI LÝ cho đến khi các sai phạm đó được khắc phục.
					</li>
				</ul>
				<ul id="2c696a1c-f51e-41ea-befc-ce2c6d815516" >
					<li>
						<strong></strong>Có quyền đơn phương chấm dứt Hợp Đồng với ĐẠI LÝ khi ĐẠI LÝ vi phạm nghĩa vụ bảo mật thông tin theo Hợp Đồng này hoặc ĐẠI LÝ không đáp ứng được yêu cầu công việc.
					</li>
				</ul>
				<ul id="1236a857-372f-40b8-b5a5-7d67874848ea" >
					<li>
						<strong></strong>Thanh toán đầy đủ và đúng hạn Thù Lao Đại Lý cho ĐẠI LÝ theo quy định trong Hợp Đồng.
					</li>
				</ul>
				<ul id="79661d1e-3643-4933-9cbc-c44e4068d490" >
					<li>
						<strong></strong>Bằng năng lực chuyên môn, trách nhiệm và sự nỗ lực của mình, cung cấp, bố trí các Khóa Đào Tạo phù hợp, đầy đủ để ĐẠI LÝ có thể nắm bắt được nội dung của Dịch Vụ Tư Vấn Thông tin Thẻ.
					</li>
				</ul>
				<ul id="eaf78c42-e66d-44b3-a837-c76c71a4d0e4" >
					<li>
						<strong></strong>Nỗ lực hết mình để khắc phục các sự cố xảy ra, hỗ trợ ĐẠI LÝ nếu có bất kỳ vướng mắc nào (kể cả của Khách Hàng) trong quá trình thực hiện Hợp đồng.
					</li>
				</ul>
				<ul id="54065bcf-4b98-4863-b118-057ef3b96578" >
					<li>
						<strong></strong>Thông báo kịp thời cho ĐẠI LÝ bất kỳ sự chậm trễ hoặc sự cố nào phát sinh hoặc có khả năng phát sinh trong quá trình thực hiện Hợp Đồng này.
					</li>
				</ul>
				<ul id="bb0e7920-8349-4ecc-a44b-f7afb14a1e96" >
					<li>
						<strong></strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng này và theo pháp luật.
					</li>
				</ul>
				<p id="64728a08-41fd-44ed-9f2c-9b4fcc597c05" class="">
					<strong>ĐIỀU </strong>
					<strong>7</strong>
					<strong>. QUYỀN VÀ NGHĨA VỤ CỦA ĐẠI LÝ</strong>
				</p>
				<ul id="7f818f42-c7c7-4f28-978e-2f8004ff9abf" >
					<li>
						<strong></strong>Có quyền nhận đầy đủ và đúng hạn khoản Thù Lao Đại Lý mà Cộng Tác Viên nhận được trong tháng.
					</li>
				</ul>
				<ul id="b496c417-08c8-41df-9ac2-2b180eeff167" >
					<li>
						<strong></strong>Có quyền yêu cầu ATOM hỗ trợ (trong phạm vi Hợp Đồng) trong việc chăm sóc,tư vấn Khách Hàng hay yêu cầu được cập nhật các thông tin, kiến thức mới nhất về Dịch Vụ Tư Vấn Thông tin Thẻ từ ATOM.
					</li>
				</ul>
				<ul id="7c460466-5d88-47cf-8058-d8b62f315f25" >
					<li>
						<strong></strong>Cam kết chỉ triển khai, tư vấn Dịch Vụ Tư Vấn Thông tin Thẻ đến với Khách Hàng một cách hợp pháp, phù hợp.
					</li>
				</ul>
				<ul id="68ddb75e-33d2-47e4-8fb7-e916346f3e68" >
					<li>
						<strong></strong>Không ép buộc, đe dọa hay lừa dối Khách Hàng bằng bất kỳ phương thức nào trong quá trình triển khai Dịch Vụ Tư Vấn Thông tin Thẻ.
					</li>
				</ul>
				<ul id="ae84f994-14d5-4ea4-a514-db98060bfd2b" >
					<li>
						<strong></strong>Không chuyển nhượng hay giao cho bất kỳ cá nhân, tổ chức nào thực hiện Hợp Đồng hay các điều khoản trong Hợp Đồng này mà không được sự đồng ý của ATOM.
					</li>
				</ul>
				<ul id="fe4cc398-07ef-47e7-b149-643e3a139e13" >
					<li>
						<strong></strong>Cung cấp đầy đủ, chính xác các thông tin mà ATOM yêu cầu bao gồm nhưng không giới hạn thông tin cá nhân, nhân thân, quá trình làm việc, mối quan hệ với Khách Hàng,…
					</li>
				</ul>
				<ul id="af59c383-0ffe-4bc9-ae51-6c63690958a1" >
					<li>
						<strong></strong>Tự chịu các khoản chi phí đi lại, điện thoại,... và các chi phí khác không có trong thỏa thuận liên quan đến công việc theo Hợp Đồng với
					</li>
				</ul>
				<ul id="390d16e0-6023-42d1-b8d2-b0c07987eb83" >
					<li>
						<strong></strong>Chịu mọi trách nhiệm liên quan đến hoặc phát sinh từ Nhân Viên.
					</li>
				</ul>
				<ul id="6890b031-71c4-45b3-864b-70877c7b1f9b" >
					<li>
						<strong></strong>Thông báo kịp thời cho ATOM bất kỳ sự chậm trễ hoặc sự cố nào phát sinh hoặc có khả năng phát sinh trong quá trình thực hiện Hợp Đồng này.
					</li>
				</ul>
				<ul id="eac19804-8ba5-4ebd-a9a4-f4369a216907" >
					<li>
						<strong></strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng này và theo pháp luật.
					</li>
				</ul>
				<p id="6face112-0861-4d3f-89d1-3faa0b1f3c96" class="">
					<strong>ĐIỀU </strong>
					<strong>8</strong>
					<strong>. BẢO MẬT</strong>
				</p>
				<ul id="a348730f-e701-4c50-9d0d-8b14fed93773" >
					<li>
						<strong></strong>Mỗi Bên cam kết sẽ không tiết lộ bất kỳ Thông Tin Mật nào cho bất kỳ bên thứ ba nào, trừ khi được Bên kia cho phép bằng văn bản.
					</li>
				</ul>
				<ul id="7e30433d-8f44-4f2d-b3b1-981eda74485c" >
					<li>
						<strong></strong>Thông Tin Mật theo quy định tại Điều này bao gồm nhưng không giới hạn ở: Thông tin cá nhân của Các Bên và cá nhân, tổ chức có liên quan mật thiết với Các Bên trong Hợp Đồng này; tông tin, nội dung về Khóa Đào Tạo do ATOM cung cấp; thông tin về các giao dịch, giao kết giữa ATOM và ĐẠI LÝ, giữa ATOM và Khách Hàng Thành Công và các thông tin khác theo quyết định của ATOM tùy từng thời điểm.
					</li>
				</ul>
				<ul id="3d5afead-084c-412d-ab9c-02cf80af236c" >
					<li>
						<strong></strong>Không Bên nào sử dụng Thông tin mật của Bên kia cho bất kỳ mục đích nào khác ngoài việc thực hiện các nghĩa vụ của mình theo Hợp Đồng này. Trường hợp một Bên vi phạm quy định về bảo mật thông tin, Bên kia có quyền chấm dứt hợp đồng và yêu cầu Bên vị phạm bồi thường thiệt hại theo quy định tại Điều 9 Hợp Đồng này.
					</li>
				</ul>
				<p id="b948492a-2564-4326-ae48-8efecaababf8" class="">
					<strong>ĐIỀU</strong>
					<strong> 9</strong>
					<strong>. CHẤM DỨT HỢP ĐỒNG</strong>
				</p>
				<ul id="edb974a8-f937-440b-86f6-afeaeb84b3b5" >
					<li>
						<strong></strong>Hợp Đồng này chấm dứt trong các trường hợp sau:
					</li>
				</ul>
				<ul id="13e7b29b-c075-476d-8e45-761d3e7f5cf1" >
					<li>Hết Thời Hạn và theo quy định tại Điều 3 mà ATOM quyết định không gia hạn Hợp Đồng.</li>
				</ul>
				<ul id="e7b3c257-ed03-464a-80e9-21fd4f57cf41" >
					<li>Các Bên cùng ký kết thỏa thuận chấm dứt Hợp Đồng này.</li>
				</ul>
				<ul id="8ac8cceb-c7a3-4b19-b992-9727e410df72" >
					<li>
						<strong></strong>Một Bên có quyền đơn phương chấm dứt Hợp Đồng này:
					</li>
				</ul>
				<ul id="70eb5bc2-0a12-4e64-8622-0a7e4ce4fddf" >
					<li>Khi Bên kia vi phạm Hợp Đồng này mà không thể khắc phục được trong vòng 15 (mười lăm) ngày sau khi nhận được thông báo về sự vi phạm đó.</li>
				</ul>
				<p id="f65ada9b-f9bf-413c-8bd8-8d979a0e4195" class="">Bên vi phạm phải bồi thường thiệt hại cho Bên kia theo đúng thiệt hại thực tế và trả cho Bên kia một khoản phạt vi phạm Hợp đồng tương đương 8% giá trị phần nghĩa vụ bị vi phạm.</p>
				<ul id="887202f8-f6c0-4dad-9946-467a1fb1ed8f" >
					<li>Theo quy định tại khoản 2 Điều 3 Hợp Đồng này.</li>
				</ul>
				<ul id="eddaab8a-d70a-4830-82d4-47d08fa46e40" >
					<li>
						<strong></strong>Khi chấm dứt Hợp Đồng, mỗi Bên sẽ ngay lập tức:
						<ol id="4efaf0b3-5a6b-4488-ba61-6b9739ac4820" class="numbered-list" start="1">
							<li>Trả lại tất cả các tài sản của Bên kia (bao gồm tất cả các tài liệu, dữ liệu và thông tin được cung cấp bởi hoặc liên quan đến Bên kia) cho Bên kia (nếu có); và</li>
						</ol>
						<ol id="69b52c5e-6c1b-4b00-930a-f1e3eb8ecf01" class="numbered-list" start="2">
							<li>Xóa vĩnh viễn bất kỳ Thông Tin Mật nào của Bên kia (trên bất kỳ phương tiện nào và ở bất cứ nơi nào).</li>
						</ol>
					</li>
				</ul>
				<p id="591615bd-8864-4953-a579-a2775f5d4899" class="">
					<strong>ĐIỀU 10. ĐIỀU KHOẢN CHUNG</strong>
				</p>
				<ul id="ff15e90b-0a45-4019-9120-85f1df7b9772" >
					<li>Mọi tranh chấp phát sinh từ hoặc liên quan đến Hợp Đồng này, thì sẽ được các Bên giải quyết thông qua thương lượng trên tinh thần thiện chí. Trường hợp không thể được giải quyết bằng thương lượng thì sẽ được đệ trình và giải quyết tại tòa án có thẩm quyền theo quy định pháp luật Việt Nam.</li>
				</ul>
				<ul id="b08f5554-1101-495f-9d59-e06f0cb6331c" >
					<li>Hợp đồng này có hiệu lực từ ngày ký và được lập thành 02 (hai) bản. Mỗi bên giữ 01 (một) bản có giá trị pháp lý như nhau.</li>
				</ul>
				<p id="1d66a670-7933-43de-9544-581c0072555d" class="">
					<strong>ĐỂ LÀM BẰNG CHỨNG,</strong> các Bên đã tự nguyện ký kết như dưới đây:
				</p>
				<div id="be22e405-966b-4d83-861f-4209feb296f2" class="column-list">
					<div id="4a812bd6-00f3-4e87-9595-35a518f19d89" style="width:33.33333333333333%" class="column">
						<p id="7852fd03-7e4e-40b2-9716-b0b731902bf1" class="">
							<strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>
						</p>
						<p id="dede8f15-84d0-4a5d-8739-5a49c769fd2f" class="">Tên: ___________________</p>
						<p id="e9bd227d-ec23-478d-83ad-861e401fb171" class="">Chức vụ: ________________</p>
					</div>
					<div id="98e2f42f-b480-4d0b-805c-8ee68c1e2a0e" style="width:33.33333333333333%" class="column"></div>
					<div id="1a67b338-4b63-4d42-aaac-435b6ed71812" style="width:33.33333333333333%" class="column">
						<p id="4adc5e83-3aa2-4e30-8d8c-39a1591c8b90" class="">
							<strong>ĐẠI LÝ</strong>
						</p>
						<p id="96b797e4-fc77-49ac-9b8e-56631180c487" class="">Tên: _____________________</p>
						<p id="732528bf-3a9e-498c-a4b8-bd816e5d7e2e" class="">Chức vụ: ________________</p>
					</div>
				</div>
			</div>
		</article>
	</body>
</html>
`;
export default templateHDCTV;