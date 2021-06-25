const templateHDCTV = `
<html>
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <title>HỢP ĐỒNG CỘNG TÁC VIÊN</title>
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
	  margin: 0;
	  padding: 0;
  }
  @media only screen {
	  body {
		  margin: 2em auto;
		  max-width: 900px;
		  color: rgb(55, 53, 47);
	  }
  }

  body {
	  line-height: 1.5;
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

  @media only print {
	  img {
		  max-height: 100vh;
		  object-fit: contain;
	  }
  }

  @page {
	  margin: 1in;
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

 </style>
</head>
<body>
 <article id="59f34d42-6860-4fcb-b9a3-813e36140f23" class="page sans">
   
  <div class="page-body">
   <h1 style="text-align:center" id="dcf675a5-22ab-4672-ac7b-5fec7f5c8ad0" class="">
	<strong>HỢP ĐỒNG CỘNG TÁC VIÊN</strong>
   </h1><br/>
   <p id="989fca73-0f18-4668-9011-6a9bc805eb7a" class="">
	<strong>HỢP ĐỒNG </strong><strong>CỘNG TÁC VIÊN</strong> này được ký ngày
	[DATE] tháng [MONTH] năm [YEAR] tại TP. Hồ Chí Minh bởi và giữa Các Bên:
   </p>
   <ul id="0510af57-da27-405d-8785-5dd93be24aeb" class="bulleted-list">
	<li>
	 <strong></strong><strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>
	 <p id="d1c2b703-1455-428a-8270-4255aedcf47c" class="">
	  Địa chỉ: 62B Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí
	  Minh, Việt Nam
	 </p>
	 <p id="03700eb5-0f43-4d05-af0b-4c51006a4a06" class="">
	  Người đại diện theo pháp luật: Trần Ngọc Dũng
	 </p>
	 <p id="2e72cdf7-e5d8-4e8e-847e-a32b0ed19e79" class="">
	  Chức danh: Chủ tịch Hội đồng Quản trị
	 </p>
	 <p id="38c005eb-d67d-4dd8-803c-449a17c4f623" class="">
	  Mã số thuế: 0316887099
	 </p>
	 <p id="f7a0a218-bf44-4922-b45e-802530d03799" class="">
	  (Sau đây gọi là <strong>ATOM)</strong>
	 </p>
	</li>
   </ul>
   <ul id="7b3046ac-4376-43af-b236-a0ef4953cd2a" class="bulleted-list">
	<li>
	 <strong></strong><strong>Ông/Bà: [DISPLAYNAME]</strong>
	 <p id="3e1e1404-49e6-45ca-8ffe-5b32b88683ff" class="">
	  CMND/CCCD số: [CMND]        cấp ngày                     bởi 
	 </p>
	 <p id="0174df7f-d64a-4a09-8821-e5c151d1ea65" class="">Địa chỉ: </p>
	 <p id="0b7ea755-1eeb-4a63-9b87-bf735627541b" class="">Email: [EMAIL]</p>
	 <p id="d28982b6-c6b5-486e-80ec-221fb23d1d3f" class="">
	  Số điện thoại liên lạc: [PHONE]
	 </p>
	</li>
   </ul>
   <p id="3ad53c65-796f-4cda-a7c4-74c252eaea4c" class="">
	<em><strong>Sau đây được gọi là “Cộng Tác Viên”.</strong></em>
   </p>
   <p id="ef3b0f69-73fd-4c66-9fe0-bcf14c128255" class="">
	Trong Hợp Đồng này, ATOM và Cộng Tác Viên được gọi riêng là
	<strong>Bên</strong> và gọi chung là <strong>Các Bên</strong>.
   </p>
   <p id="d9c5bb07-0776-4c2a-a8a3-a78f6d96410e" class="">
	<span style="border-bottom:0.05em solid"><strong>XÉT RẰNG</strong></span
	><span style="border-bottom:0.05em solid"><strong>:</strong></span>
   </p>
   <ul id="e4be8030-8e4a-42c1-b1ef-3afcfa0021f3" class="bulleted-list">
	<li>
	 <strong>ATOM</strong> là một doanh nghiệp cung cấp dịch vụ thông tin,
	 quảng cáo, cơ sở dữ liệu, thương mại điện tử, dịch vụ hỗ trợ thư ký… ATOM
	 có khả năng cung cấp các dịch vụ nêu trên liên quan đến việc đưa ra thông
	 tin, tư vấn, hỗ trợ khách hàng đối với việc sử dụng thẻ;
	</li>
   </ul>
   <ul id="6e5b761c-9f4d-405d-be07-3667de58c495" class="bulleted-list">
	<li>
	 <strong>Cộng Tác Viên </strong>là cá nhân có nhu cầu hợp tác với ATOM
	 trong việc tìm kiếm Khách Hàng cho ATOM;
	</li>
   </ul>
   <ul id="8887822b-85de-4335-b324-aabec7e40916" class="bulleted-list">
	<li>
	 <strong>Các Bên</strong> đồng ý ký kết Hợp Đồng để đạt được những mục tiêu
	 đã thỏa thuận và đảm bảo thực hiện quyền và nghĩa vụ của mỗi Bên phù hợp
	 với quy định pháp luật hiện hành tại Việt Nam.
	</li>
   </ul>
   <p id="25e5e0eb-82df-4f8b-b761-875495206aed" class="">
	<strong>DO ĐÓ</strong>, Các Bên cùng ký <strong>HỢP ĐỒNG </strong
	><strong>CỘNG TÁC VIÊN</strong> (<strong>Hợp Đồng</strong>) với các nội
	dung và điều khoản sau:
   </p>
   <p id="16eedea2-34fc-4e26-bfe7-688bd6973a34" class="">
	<strong>ĐIỀU 1. ĐỊNH NGHĨA VÀ DIỄN GIẢI</strong>
   </p>
   <ul id="3e3613f1-8733-423d-bfd6-089ba454c85b" class="bulleted-list">
	<li>
	 <strong></strong><strong>Khách Hàng</strong> có nghĩa là những cá nhân có
	 nhu cầu được tư vấn về thông tin, cách thức sử dụng nhằm tối ưu hóa việc
	 sử dụng Thẻ Ngân Hàng của Khách Hàng thông qua các chương trình khuyến mãi
	 của Ngân hàng phát hành thẻ.
	</li>
   </ul>
   <ul id="79aaebb1-3369-4813-b29d-3d04d11f8fc3" class="bulleted-list">
	<li>
	 <strong></strong><strong>Dịch Vụ Tư Vấn Thông tin Thẻ </strong>có nghĩa là
	 các hoạt động tư vấn thông tin, cách thức sử dụng nhằm tối ưu hóa việc sử
	 dụng Thẻ Ngân Hàng của Khách Hàng. Dịch vụ hỗ trợ thư ký nhằm hỗ trợ khách
	 hàng trong việc quản lý, sử dụng thẻ.
	</li>
   </ul>
   <ul id="f9193fd6-82e2-4d8d-a125-1168bf035acf" class="bulleted-list">
	<li>
	 <strong></strong><strong>Ngày Hiệu Lực</strong> có nghĩa là ngày mà Hợp
	 Đồng này phát sinh hiệu lực áp dụng và cũng là ngày mà Các Bên ký Hợp Đồng
	 này.
	</li>
   </ul>
   <ul id="1cb5f65d-7bf0-4c2b-9bbc-4f4c796db8bb" class="bulleted-list">
	<li>
	 <strong></strong><strong>Ngày Làm Việc </strong>có nghĩa là ngày dương
	 lịch mà không phải ngày thứ bảy, chủ nhật và ngày lễ theo quy định pháp
	 luật Việt Nam.
	</li>
   </ul>
   <ul id="407e7cb0-f4cf-41f7-9750-056f4afe7ec9" class="bulleted-list">
	<li>
	 <strong></strong><strong>Khóa Đào Tạo</strong> có nghĩa là các buổi đào
	 tạo, kiểm tra, triển khai mẫu Dịch Vụ Tư Vấn do ATOM tổ chức với sự tham
	 gia đầy đủ của đại diện của ĐẠI LÝ cho mục đích giao kết Hợp Đồng này và
	 tìm kiếm Khách Hàng.
	</li>
   </ul>
   <ul id="81a8f5ba-fcca-473d-9164-755075fe2250" class="bulleted-list">
	<li>
	 <strong></strong><strong>Khách Hàng Thành Công </strong>có nghĩa là Khách
	 Hàng do ĐẠI LÝ tìm kiếm được có nhu cầu sử dụng Dịch Vụ Tư Vấn Thông tin
	 Thẻ của ATOM. Khi Khách Hàng đồng ý sử dụng dịch vụ của ATOM thông qua
	 việc ký kết Hợp Đồng Dịch Vụ với ATOM hoặc ký với Đại lý khi ATOM cho phép
	 sẽ chính thức trở thành Khách Hàng Thành Công.
	</li>
   </ul>
   <ul id="2fb29824-71a1-4a70-8b46-808d02b70719" class="bulleted-list">
	<li>
	 <strong></strong><strong>Thẻ Cộng Tác Viên</strong> được ATOM cấp cho Cộng
	 Tác Viên, được xem như là tài liệu chứng minh cho sự hợp tác giữa ATOM và
	 Cộng Tác Viên, xác nhận Cộng Tác Viên đủ điều kiện và khả năng để tìm kiếm
	 Khách Hàng và nhận được Hoa Hồng cho việc tìm kiếm những Khách Hàng Thành
	 Công đó.
	</li>
   </ul>
   <ul id="8b181c5e-2f22-474a-bf2e-b8643bc8a152" class="bulleted-list">
	<li>
	 <strong></strong><strong>Ngày Hiệu Lực</strong> có nghĩa là ngày mà Hợp
	 Đồng này phát sinh hiệu lực áp dụng và cũng là ngày mà Các Bên ký Hợp Đồng
	 này.
	</li>
   </ul>
   <ul id="29ab0e4f-84f3-49dd-8068-0c034bffef2a" class="bulleted-list">
	<li>
	 <strong></strong><strong>Ngày Làm Việc </strong>có nghĩa là ngày dương
	 lịch mà không phải ngày Thứ Bảy, Chủ Nhật và ngày lễ theo quy định pháp
	 luật Việt Nam.
	</li>
   </ul>
   <p id="6ba5c37d-d91b-46a7-a271-33b4c9a1f610" class="">
	<strong>Đ</strong><strong>IỀU 2.</strong><strong> NỘI DUNG </strong
	><strong>CỘNG TÁC</strong>
   </p>
   <ul id="945bdd2b-a8f8-4a27-84bc-d0070604a3e0" class="bulleted-list">
	<li>
	 <strong></strong>Ngay sau Ngày Hiệu Lực, Cộng Tác Viên phải tham gia và
	 hoàn thành các Khóa Đào Tạo của ATOM và tìm kiếm Khách Hàng cung cấp cho
	 ATOM.
	</li>
   </ul>
   <ul id="d27fa00d-d04d-4d46-94bc-3b067ee79dc2" class="bulleted-list">
	<li><strong></strong>Cộng tác viên sẽ:</li>
   </ul>
   <ul id="04c6e3b6-0091-4db4-9e4e-8c1b43d3fb15" class="bulleted-list">
	<li>
	 Quảng bá, giới thiệu, marketing và tư vấn về Dịch Vụ Tư Vấn Thông tin Thẻ
	 trong phạm vi Khóa Đào Tạo hoặc thông tin mà ATOM đã cung cấp.
	</li>
   </ul>
   <ul id="d93433b8-7c82-4c2d-9167-85303fc49a03" class="bulleted-list">
	<li>
	 ĐẠI LÝ tư vấn, hướng dẫn, làm mẫu, hỗ trợ Khách Hàng đến khi Khách Hàng
	 đồng ý sử dụng Dịch Vụ Tư Vấn Thông tin Thẻ của ATOM .
	</li>
   </ul>
   <ul id="84d86bac-f154-4ffe-86de-9647bfbcb1d6" class="bulleted-list">
	<li>
	 <strong></strong>ATOM có nghĩa vụ chi trả Hoa Hồng đối với từng Khách Hàng
	 Thành Công mà Cộng Tác Viên tìm kiếm được cho ATOM đúng hạn và đầy đủ theo
	 quy định trong Hợp Đồng này.
	</li>
   </ul>
   <ul id="2c7389e0-8d40-4bff-ab55-55775adbc874" class="bulleted-list">
	<li>
	 <strong></strong>Các Bên đồng ý và hiểu rằng ATOM là chủ sở hữu đối với dữ
	 liệu Khách Hàng (Dữ Liệu)và Cộng Tác Viên có nghĩa vụ chuyển giao các Dữ
	 Liệu thu thập được cho ATOM. Việc thu thập dữ liệu do Cộng Tác Viên thực
	 hiện bằng các cách thức phù hợp và hợp pháp và đảm bảo nhận được sự đồng ý
	 từ Khách Hàng.
	</li>
   </ul>
   <ul id="b19f0706-04cb-4b5b-b03f-6cf483c149db" class="bulleted-list">
	<li>
	 <strong></strong>Khách Hàng của Cộng Tác Viên sẽ
	 <em><strong>không được xem</strong></em> là Khách Hàng Thành Công khi:
	</li>
   </ul>
   <ol
	id="89961ee5-b590-4b84-b30c-286be68542fa"
	class="numbered-list"
	start="1"
   >
	<li>
	 ATOM có đầy đủ bằng chứng về việc khách hàng đó đã, đang và chuẩn bị giao
	 kết Hợp Đồng Dịch Vụ Khách Hàng với ATOM, do ATOM tự tìm kiếm hoặc do một
	 Cộng Tác Viên, cá nhân, tổ chức khác cung cấp cho ATOM trước khi Cộng Tác
	 Viên gửi Thông Báo Khách Hàng đến ATOM; hoặc
	</li>
   </ol>
   <ol
	id="a6574c71-d2f6-43d2-b669-c6d6724ada50"
	class="numbered-list"
	start="2"
   >
	<li>
	 Ngay cả khi khách hàng đó đã chấm dứt Hợp Đồng Dịch Vụ Khách Hàng với ATOM
	 trong thời gian chưa đến 03 tháng kể từ ngày chấm dứt.
	</li>
   </ol>
   <ol
	id="a3d6859e-596f-498a-b4e0-fb6844b6d489"
	class="numbered-list"
	start="3"
   >
	<li>
	 ATOM phát hiện Cộng Tác Viên đã có hành vi triển khai, cung cấp Dịch Vụ Tư
	 Vấn Thông tin Thẻ đến Khách Hàng vi phạm các quy định trong Hợp Đồng này
	 và quy định pháp luật.
	</li>
   </ol>
   <p id="4644827d-c16f-459a-b302-871a851597bc" class="">
	<strong>ĐIỀU 3. THỜI HẠN HỢP ĐỒNG</strong>
   </p>
   <ul id="7af4b4a9-7bf0-465b-b2ba-06c0df1f73a8" class="bulleted-list">
	<li>
	 <strong></strong>Hợp Đồng này có thời hạn là một năm (<strong
	  >Thời Hạn</strong
	 >) kể từ Ngày Hiệu Lực. Trong vòng 30 ngày trước Ngày Hết Hạn, một Bên có
	 nhu cầu gia hạn phải gửi yêu cầu đến Bên còn lại. Các Bên sẽ cùng thỏa
	 thuận việc gia hạn Hợp Đồng và điều chỉnh các điều khoản phù hợp với tình
	 hình kinh doanh.
	</li>
   </ul>
   <ul id="e34023f4-b906-498f-bbc8-fe2c25fd8f91" class="bulleted-list">
	<li>
	 <strong></strong>Bất chấp những quy định trên, Hợp Đồng này sẽ tự động hết
	 hạn (i) trong trường hợp quá 03 tháng mà Cộng Tác Viên không có được bất
	 kỳ Khách Hàng Thành Công nào; hoặc (ii) tùy theo quyết định của ATOM khi
	 đã thông báo trước đến Cộng Tác Viên.
	</li>
   </ul>
   <p id="fc6930dd-c09d-4921-a507-0f8fcc0c0fa6" class="">
	<strong>ĐIỀU 4. </strong><strong>HOA HỒNG</strong>
   </p>
   <ul id="3598c8f3-2955-4b76-b33d-67ae93b51fb2" class="bulleted-list">
	<li>
	 <strong>1 </strong>Cộng Tác Viên được hưởng Hoa Hồng trên cơ sở Khách Hàng
	 Thành Công sau khi hai bên đã đối soát.
	</li>
   </ul>
   <ul id="885558e7-56d8-421b-a33f-f4e2df8a068b" class="bulleted-list">
	<li><strong>2 </strong>Phương thức tính Hoa Hồng:</li>
   </ul>
   <p id="dfaa350f-29d3-498c-8c37-958bb9050e4d" class="">
	Trong vòng 5 (năm) ngày đầu tiên của tháng kế tiếp, hai bên sẽ tiến hành
	đối soát Khách Hàng Thành Công.
   </p>
   <p id="27e1c19c-ba10-4253-81d3-31b2dc4a1809" class="">
	Tổng Hoa Hồng phát sinh trong 01 tháng sẽ được ATOM thanh toán cho Cộng Tác
	Viên theo phương thức chuyển khoản. Thời hạn thanh toán trong vòng 5 (năm)
	ngày sau khi có Kết quả đối soát đã thống nhất.
   </p>
   <ul id="60323419-6393-4e68-ad4e-9471e6465c4b" class="bulleted-list">
	<li>
	 <strong>3 </strong>Cộng Tác Viên đồng ý ủy quyền cho ATOM quyết toán và
	 nộp thuế thu nhập cá nhân theo quy định pháp luật. Thuế thu nhập cá nhân
	 được khấu trừ từ Hoa Hồng theo tỷ lệ do pháp luật quy định tùy từng thời
	 điểm.
	</li>
   </ul>
   <p id="6800fb3d-816e-4119-b48b-cbe4a9614c48" class="">
	<strong>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA ATOM</strong>
   </p>
   <ul id="0faa0593-9e28-4478-b94c-8e6b4f1b68c4" class="bulleted-list">
	<li>
	 <strong>1 </strong>Ấn định các nội dung và phạm vi của Dịch Vụ Tư Vấn
	 Thông tin Thẻ.
	</li>
   </ul>
   <ul id="8712e225-9413-4696-9046-2b796e40a4de" class="bulleted-list">
	<li><strong>2 </strong>Ấn định mức Hoa Hồng.</li>
   </ul>
   <ul id="136ae4d7-0448-4fb6-87a9-21ac3a40d37d" class="bulleted-list">
	<li>
	 <strong>3 </strong>Là chủ sở hữu đối với Dữ Liệu theo quy định tại khoản 3
	 Điều 2 Hợp Đồng này; và có quyền yêu cầu Cộng Tác Viên chuyển giao các Dữ
	 Liệu thu thập được cho ATOM.
	</li>
   </ul>
   <ul id="ece28192-470c-4646-9742-0e91f5debf17" class="bulleted-list">
	<li>
	 <strong>4 </strong>Có quyền thu hồi, tạm thu hồi Thẻ Cộng Tác Viên bất cứ
	 lúc nào nếu nhận thấy có sự sai sót, vi phạm quy định nào trong Hợp Đồng
	 của Cộng Tác Viên cho đến khi các sai phạm đó được khắc phục.
	</li>
   </ul>
   <ul id="2c78f693-76e9-4138-825c-8ebd9c752442" class="bulleted-list">
	<li>
	 <strong>5 </strong>Có quyền đơn phương chấm dứt Hợp Đồng với Cộng Tác Viên
	 khi Cộng Tác Viên vi phạm nghĩa vụ bảo mật thông tin theo Hợp Đồng này
	 hoặc Cộng Tác Viên không đáp ứng được yêu cầu công việc.
	</li>
   </ul>
   <ul id="8f71035a-3cea-4624-a05c-f82a917dd782" class="bulleted-list">
	<li>
	 <strong>6 </strong>Thanh toán đầy đủ và đúng hạn Hoa Hồng cho Cộng Tác
	 Viên theo quy định trong Hợp Đồng.
	</li>
   </ul>
   <ul id="461f21fc-0bb7-4ca9-a0db-9499a4e1e862" class="bulleted-list">
	<li>
	 <strong>7 </strong>Bằng năng lực chuyên môn, trách nhiệm và sự nỗ lực của
	 mình, cung cấp, bố trí các Khóa Đào Tạo phù hợp, đầy đủ để Cộng Tác Viên
	 có thể nắm bắt được nội dung của Dịch Vụ Tư Vấn Thông tin Thẻ.
	</li>
   </ul>
   <ul id="3f803154-12b6-4c2d-bf13-5d3d5b10f785" class="bulleted-list">
	<li>
	 <strong>8 </strong>Nỗ lực hết mình để khắc phục các sự cố xảy ra, hỗ trợ
	 Cộng Tác Viên nếu có bất kỳ vướng mắc nào (kể cả của Khách Hàng) trong quá
	 trình thực hiện Hợp đồng.
	</li>
   </ul>
   <ul id="1e59d937-ea07-4c44-978b-8070347dffa4" class="bulleted-list">
	<li>
	 <strong>9 </strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng
	 này và theo pháp luật.
	</li>
   </ul>
   <p id="f504bbee-7164-440e-8c5a-4c0fe287a5f7" class="">
	<strong>ĐIỀU 6. QUYỀN VÀ NGHĨA VỤ CỦA </strong
	><strong>CỘNG TÁC VIÊN</strong>
   </p>
   <ul id="6c9112b3-4a29-4674-97c9-9153da9fdd80" class="bulleted-list">
	<li>
	 <strong>1 </strong>Có quyền nhận đầy đủ và đúng hạn số tiền Hoa Hồng mà
	 Cộng Tác Viên nhận được trong tháng.
	</li>
   </ul>
   <ul id="6d667530-ec92-4d70-b0bf-f52bc6330032" class="bulleted-list">
	<li>
	 <strong>2 </strong>Có quyền yêu cầu ATOM hỗ trợ (trong phạm vi Hợp Đồng)
	 trong việc chăm sóc,tư vấn Khách Hàng hay yêu cầu được cập nhật các thông
	 tin, kiến thức mới nhất về Dịch Vụ Tư Vấn Thông tin Thẻ từ ATOM.
	</li>
   </ul>
   <ul id="37078976-3762-4d00-acfc-064b72242fa1" class="bulleted-list">
	<li>
	 <strong>3 </strong>Cam kết chỉ triển khai, tư vấn Dịch Vụ Tư Vấn Thông tin
	 Thẻ đến với Khách Hàng một cách hợp pháp, phù hợp và nằm trong phạm vi đào
	 tạo của ATOM.
	</li>
   </ul>
   <ul id="ec1d7fe2-af6d-4313-8216-3b6242f05548" class="bulleted-list">
	<li>
	 <strong>4 </strong>Không ép buộc, đe dọa hay lừa dối Khách Hàng bằng bất
	 kỳ phương thức nào trong quá trình triển khai Dịch Vụ Tư Vấn Thông tin
	 Thẻ.
	</li>
   </ul>
   <ul id="711e06b2-e151-4f4c-8818-e5868e087be2" class="bulleted-list">
	<li>
	 <strong>5 </strong>Không chuyển nhượng hay giao cho bất kỳ cá nhân, tổ
	 chức nào thực hiện Hợp Đồng hay các điều khoản trong Hợp Đồng này mà không
	 được sự đồng ý của ATOM.
	</li>
   </ul>
   <ul id="cf26b99a-17b8-4d0f-8ee8-8061bcc1cd99" class="bulleted-list">
	<li>
	 <strong>6 </strong>Thông báo kịp thời cho ATOM bất kỳ sự cố nào phát sinh
	 hoặc có khả năng phát sinh trong quá trình thực hiện Hợp Đồng này.
	</li>
   </ul>
   <ul id="7e52ecba-efd7-4cd3-8038-2c13754d8cd7" class="bulleted-list">
	<li>
	 <strong>7 </strong>Cung cấp đầy đủ, chính xác các thông tin mà ATOM yêu
	 cầu bao gồm nhưng không giới hạn thông tin cá nhân, nhân thân, quá trình
	 làm việc, mối quan hệ với Khách Hàng,…
	</li>
   </ul>
   <ul id="dd73b1fd-8868-4553-98d2-09098597aeaf" class="bulleted-list">
	<li>
	 <strong>8 </strong>Ký kết các văn bản ủy quyền cho ATOM thực hiện kê khai
	 và nộp thuế thu nhập cá nhân.
	</li>
   </ul>
   <ul id="3d6673e0-244b-4644-9a43-bdbc796c9d3f" class="bulleted-list">
	<li>
	 <strong>9 </strong>Tự chịu các khoản chi phí đi lại, điện thoại,... và các
	 chi phí khác không có trong thỏa thuận liên quan đến công việc theo Hợp
	 Đồng với ATOM.
	</li>
   </ul>
   <ul id="ee008376-2dac-4b32-8833-78cda72781a5" class="bulleted-list">
	<li>
	 <strong></strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng này
	 và theo pháp luật.
	</li>
   </ul>
   <p id="45e39c92-6615-4903-8ee2-4cc4c54af6d0" class="">
	<strong>ĐIỀU 7. BẢO MẬT</strong>
   </p>
   <ul id="602c453e-31cd-4070-8729-6c4c7b6c6dec" class="bulleted-list">
	<li>
	 <strong></strong>Mỗi Bên cam kết sẽ không tiết lộ bất kỳ Thông Tin Mật nào
	 cho bất kỳ bên thứ ba nào, trừ khi được Bên kia cho phép bằng văn bản.
	</li>
   </ul>
   <ul id="bb6a2ab7-1560-4bfc-b0c6-a42dda37f461" class="bulleted-list">
	<li>
	 <strong></strong>Thông Tin Mật theo quy định tại Điều này bao gồm nhưng
	 không giới hạn ở: Thông tin cá nhân của Các Bên và cá nhân, tổ chức có
	 liên quan mật thiết với Các Bên trong Hợp Đồng này; tông tin, nội dung về
	 Khóa Đào Tạo do ATOM cung cấp; thông tin về các giao dịch, giao kết giữa
	 ATOM và Cộng Tác Viên, giữa ATOM và Khách Hàng Thành Công và các thông tin
	 khác theo quyết định của ATOM tùy từng thời điểm.
	</li>
   </ul>
   <ul id="dced1ee6-2b24-47ce-98f5-5e26fa065cbd" class="bulleted-list">
	<li>
	 <strong></strong>Không Bên nào sử dụng Thông tin mật của Bên kia cho bất
	 kỳ mục đích nào khác ngoài việc thực hiện các nghĩa vụ của mình theo Hợp
	 Đồng này. Trường hợp một Bên vi phạm quy định về bảo mật thông tin, Bên
	 kia có quyền chấm dứt hợp đồng và yêu cầu Bên vị phạm bồi thường thiệt hại
	 theo quy định tại Điều 9 Hợp Đồng này.
	</li>
   </ul>
   <p id="5b9e38b6-48ba-4d1b-b82a-71826a4fdf08" class="">
	<strong>ĐIỀU 8. CHẤM DỨT HỢP ĐỒNG</strong><strong> VÀ CHẾ TÀI</strong>
   </p>
   <ul id="f3dac398-4fcc-48b5-8930-39e533abcfe3" class="bulleted-list">
	<li>Hợp Đồng này chấm dứt trong các trường hợp sau:</li>
   </ul>
   <ul id="e777ea89-2138-4c46-9cd2-d7d0915ce461" class="bulleted-list">
	<li>
	 Hết Thời Hạn và theo quy định tại Điều 3 mà một bên quyết định không gia
	 hạn Hợp Đồng.
	</li>
   </ul>
   <ul id="c608a2b7-d3aa-4d82-85ea-d79b9d7e7c25" class="bulleted-list">
	<li>
	 Các Bên cùng ký kết thỏa thuận chấm dứt Hợp Đồng này.
	 <ul id="a4251dc3-f3cc-47fc-9258-14509db7fc24" class="bulleted-list">
	  <li>Một Bên có quyền đơn phương chấm dứt Hợp Đồng này:</li>
	 </ul>
	</li>
   </ul>
   <ul id="59290f72-8719-4678-9960-658bdfb35db9" class="bulleted-list">
	<li>
	 Khi Bên kia vi phạm Hợp Đồng này mà không thể khắc phục được trong vòng 15
	 (mười lăm) ngày sau khi nhận được thông báo về sự vi phạm đó.
	</li>
   </ul>
   <p id="792b75fd-b578-4a50-a44e-3f66d91f0994" class="">
	Bên vi phạm phải bồi thường thiệt hại cho Bên kia theo đúng thiệt hại thực
	tế và trả cho Bên kia một khoản phạt vi phạm Hợp đồng tương đương 8% giá
	trị phần nghĩa vụ bị vi phạm.
   </p>
   <ul id="4cd0074f-1e7d-4dbc-ab04-1ad3dc80a82c" class="bulleted-list">
	<li>
	 Theo quy định tại khoản 2 Điều 3 Hợp Đồng này.
	 <ul id="a90d2182-1201-4c7a-aa77-3c300c571978" class="bulleted-list">
	  <li>Khi chấm dứt Hợp đồng, mỗi Bên sẽ ngay lập tức:</li>
	 </ul>
	</li>
   </ul>
   <ul id="3462c088-e120-47fb-8952-8ca35cf80d27" class="bulleted-list">
	<li>
	 Trả lại tất cả các tài sản của Bên kia (bao gồm tất cả các tài liệu, dữ
	 liệu và thông tin được cung cấp bởi hoặc liên quan đến Bên kia) cho Bên
	 kia (nếu có); và
	</li>
   </ul>
   <ul id="065c3568-a960-45d0-9648-24e842fa5ed4" class="bulleted-list">
	<li>
	 Xóa vĩnh viễn bất kỳ Thông Tin Mật nào của Bên kia (trên bất kỳ phương
	 tiện nào và ở bất cứ nơi nào).
	 <ul id="1fde7f9d-fb18-4c1a-9c37-f112dc3d04e7" class="bulleted-list">
	  <li>
	   Việc chấm dứt hoặc hết hạn Hợp đồng này sẽ không ảnh hưởng đến bất kỳ
	   quyền, biện pháp bồi thường, nghĩa vụ hay trách nhiệm của các Bên đã có
	   cho đến ngày chấm dứt hoặc hết hạn, trong đó có quyền đòi bồi thường
	   thiệt hại đối với bất kỳ vi phạm nào đã tồn tại trước hoặc vào ngày chấm
	   dứt hoặc hết hạn của Hợp đồng này.
	  </li>
	 </ul>
	</li>
   </ul>
   <p id="5ae72f1f-70d1-489f-a58c-aceeb4dc88a4" class="">
	<strong>ĐIỀU 9. ĐIỀU KHOẢN CHUNG</strong>
   </p>
   <ul id="d2797f7f-a813-438c-949b-10c85894b896" class="bulleted-list">
	<li>
	 Mọi tranh chấp phát sinh từ hoặc liên quan đến Hợp Đồng này, thì sẽ được
	 các Bên giải quyết thông qua thương lượng trên tinh thần thiện chí. Trường
	 hợp không thể được giải quyết bằng thương lượng thì sẽ được đệ trình và
	 giải quyết tại tòa án có thẩm quyền theo quy định pháp luật Việt Nam.
	</li>
   </ul>
   <ul id="219ffcf5-30bb-4013-8d2d-58c3d17cb81c" class="bulleted-list">
	<li>
	 Hợp đồng này có hiệu lực từ ngày ký và được lập thành 02 (hai) bản. Mỗi
	 bên giữ 01 (một) bản có giá trị pháp lý như nhau.
	</li>
   </ul>
   <p id="e925c9ea-8ac4-4339-b71a-9d78de7d068d" class="">
	<strong>ĐỂ LÀM BẰNG CHỨNG,</strong> các Bên đã tự nguyện ký kết như dưới
	đây:
   </p>
   <div id="f77b3f7a-7233-43cd-b8cc-05e10a1e2b98" class="column-list">
	<div
	 id="72209af0-8aa5-4c8c-a97b-f6304a25f1fd"
	 style="width:54.166666666666664%"
	 class="column"
	>
	 <p id="f9143620-237e-4f1b-accc-4e6a959ceb7f" class="">
	  <strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>
	 </p>
	 <p id="8cc2cd0a-a854-4422-8da1-a65ae0383ed3" class="">
	  Tên: ___________________
	 </p>
	 <p id="6527c5c3-cc78-4287-ad21-d7d05a722e4b" class="">
	  Chức vụ: ________________
	 </p>
	</div>
	<div
	 id="3f74eb45-0134-40ab-9231-b29c7e7aed0b"
	 style="width:12.500000000000004%"
	 class="column"
	></div>
	<div
	 id="dc00d2dd-eb56-482e-8708-5b0d6523c88a"
	 style="width:33.33333333333333%"
	 class="column"
	>
	 <p id="614b5211-7dc5-4505-981c-7de20ca3e1e7" class="">
	  <strong>CỘNG TÁC VIÊN</strong>
	 </p>
	 <p id="71195a99-85ea-47aa-9404-313c66e3c425" class="">
	  Tên: _____________________
	 </p>
	 <p id="348bf336-bf0c-4eb6-ad73-3ce64f84b69f" class=""></p>
	</div>
   </div>
  </div>
 </article>
</body>
</html>
`;
export default templateHDCTV;