const templateHDDVTV = `
<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>HỢP ĐỒNG DỊCH VỤ TƯ VẤN</title>
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
  <article id="93897c75-2c37-4625-8bc2-0dac022a7b31" class="page sans">
   <div class="page-body">
    <h2 style="text-align:center" id="9890b175-dcf6-4005-92a6-06691a2c2be1" class="">
     <strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
    </h2>
    <p style="text-align:center" id="5511c66f-197e-49b1-81c3-3c4ad3e54b21" class="">
     <strong>Độc lập- Tự do – Hạnh phúc</strong>
    </p>
    <h2 style="text-align:center" id="52e5006c-f4e5-425c-905e-9451e189fd1b" class="">
     <strong>HỢP ĐỒNG DỊCH VỤ TƯ VẤN</strong>
    </h2>
    <p id="0cec9364-b469-4e93-8364-812e4aa0cc81" class="">
     <strong>HỢP ĐỒNG DỊCH VỤ TƯ VẤN </strong>này được ký ngày [DATE] tháng [MONTH] năm [YEAR] tại TP. Hồ Chí Minh bởi và giữa Các Bên:
    </p>
    <ul id="e5510d4a-4f76-478d-a799-f8978fe3d48e" class="bulleted-list">
     <li>
      <strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>,
      <p id="fb7ec4f5-2fd8-4151-b58e-968968e5abfb" class="">
       Địa chỉ: 62B Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí
       Minh
      </p>
      <p id="f1096924-463f-4272-a272-9ae871e5864d" class="">
       Người đại diện theo pháp luật: Trần Ngọc Dũng
      </p>
      <p id="59c9cddf-f29e-4344-a099-c6be0e836bd7" class="">
       Chức danh: Chủ tịch Hội đồng Quản trị
      </p>
      <p id="8830da1f-3d1e-42db-9914-3d2afc166af8" class="">
       Mã số thuế: 0316887099
      </p>
      <p id="82ab2961-f3a0-45ff-b9c4-88f6369c4e2d" class="">
       (Sau đây gọi là <strong>ATOM)</strong>
      </p>
     </li>
    </ul>
    <ul id="12519967-7109-4460-ad2d-dafe3107f824" class="bulleted-list">
     <li>
      <strong>Ông/Bà: [DISPLAYNAME]</strong>
      <p id="d0e3b26f-156a-456b-8a28-cc5a4b52bf60" class="">
      CMND/CCCD số: [CMND]        cấp ngày                     bởi 
      </p>
      <p id="3ffaab26-4e89-4023-84ad-0917c9d33b44" class="">Địa chỉ:</p>
      <p id="c9d2dfc8-b6c1-4323-b975-afe5260c071c" class="">Email: [EMAIL]</p>
      <p id="4db4f309-1f90-4767-bf57-fbca6d23c618" class="">
       Số điện thoại liên lạc: [PHONE]
      </p>
     </li>
    </ul>
    <p id="91a09399-64ad-4aef-990e-e3ebed1f6569" class="">
     Trong Hợp Đồng này, ATOM và Khách Hàng được gọi riêng là
     <strong>Bên</strong> và gọi chung là <strong>Các Bên</strong>.
    </p>
    <p id="7ae05b0a-6df9-47c7-ab65-df0e801d3aff" class="">
     <strong>ĐIỀU 1. NỘI DUNG DỊCH VỤ</strong>
    </p>
    <p id="89cd0935-ef0c-4e22-a69f-98c20084e66d" class="">
     1.1 ATOM là một doanh nghiệp được cấp phép cung cấp các dịch vụ thông tin,
     quảng cáo, cơ sở dữ liệu, thương mại điện tử, dịch vụ hỗ trợ thư ký… ATOM
     có khả năng cung cấp các dịch vụ nêu trên liên quan đến việc đưa ra thông
     tin, tư vấn, hỗ trợ khách hàng đối với việc sử dụng thẻ;
    </p>
    <p id="3f612e85-e6d9-4b2e-9d89-af4a5456af4c" class="">
     1.2 ATOM sẽ cung cấp<strong> Dịch Vụ Tư Vấn Thông tin Thẻ </strong>cho
     Khách hàng bao gồm:
    </p>
    <ul id="9d49efda-8e65-4606-aee4-41370fb36049" class="bulleted-list">
     <li>
      Các hoạt động tư vấn thông tin khuyến mãi của ngân hàng, đơn vị phát hành
      thẻ khác, cách thức sử dụng nhằm tối ưu hóa việc sử dụng các loại thẻ của
      Khách Hàng.
     </li>
    </ul>
    <ul id="fae2d752-fb75-4aab-9c3a-d44457fd3d56" class="bulleted-list">
     <li>Các hoạt động thương mại điện tử phù hợp.</li>
    </ul>
    <ul id="8838859d-4e01-4a9c-b812-bd703d61f1b6" class="bulleted-list">
     <li>
      Dịch vụ hỗ trợ thư ký nhằm hỗ trợ khách hàng trong việc quản lý, sử dụng
      các loại thẻ.
     </li>
    </ul>
    <p id="dcf028ba-b235-489b-bf6a-7b745d81af08" class="">
     <strong>ĐIỀU 3. THỜI HẠN HỢP ĐỒNG</strong>
    </p>
    <p id="7ba05274-c60b-4b73-bb0b-4ab046c9fff1" class="">
     Hợp Đồng này có thời hạn từ ngày ký đến khi một trong hai Bên có thông báo
     yêu cầu ngưng dịch vụ trước ít nhất một tháng.
    </p>
    <p id="e4e1ae80-ee53-4eda-98e7-40e100074bb4" class="">
     <strong>ĐIỀU 4. PHÍ DỊCH VỤ</strong>
    </p>
    <p id="c22198f2-43c5-42eb-a223-9ce2aa2d586f" class="">
     Phí Dịch Vụ được tính như sau: ………
    </p>
    <p id="6ab1c686-3b8d-4226-9960-43b316142556" class="">
     <strong>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA ATOM</strong>
    </p>
    <ul id="963cd014-3b34-4b4d-b9b7-8ba26b88098d" class="bulleted-list">
     <li>
      <strong>1 </strong>Được nhận đủ và đúng các loại phí quy định trong Hợp
      Đồng này.
     </li>
    </ul>
    <ul id="4fc3d1f9-d080-49f4-a683-8744a65620ee" class="bulleted-list">
     <li>
      <strong>2 </strong>Bằng năng lực chuyên môn, trách nhiệm và sự nỗ lực của
      mình, tư vấn và cung cấp các thông tin chính xác, giải pháp tối ưu hóa
      việc sử dụng Thẻ cho Khách Hàng.
     </li>
    </ul>
    <ul id="a522802d-88ed-4be9-854d-84c962d498c8" class="bulleted-list">
     <li>
      <strong>3 </strong>Nỗ lực hết mình để khắc phục các sự cố xảy ra trong quá
      trình thực hiện Hợp đồng.
     </li>
    </ul>
    <ul id="e2bbcb0e-e20a-4d58-b191-60aa9a841da5" class="bulleted-list">
     <li>
      <strong>4 </strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng
      này và theo pháp luật.
     </li>
    </ul>
    <p id="5a5353bc-2adc-46d8-8d1c-a2d3514f99e5" class="">
     <strong>ĐIỀU 6. QUYỀN VÀ NGHĨA VỤ CỦA KHÁCH HÀNG</strong>
    </p>
    <ul id="e758e1cc-b4c8-4803-a714-5494e620d009" class="bulleted-list">
     <li>
      <strong>1 </strong>Cam kết Thẻ do Khách Hàng sở hữu và sử dụng hợp pháp
      theo quy định pháp luật;
     </li>
    </ul>
    <ul id="6b6f2310-eb11-455f-8e23-6086bfd9c209" class="bulleted-list">
     <li>
      <strong>2 </strong>Thực hiện thanh toán đầy đủ và đúng hạn Phí Dịch Vụ cho
      ATOM.
     </li>
    </ul>
    <ul id="db799211-7685-43dc-99b6-b3f82edcbfbd" class="bulleted-list">
     <li>
      <strong>3 </strong>Đồng ý ủy quyền cho ATOM tiến hành các công việc cần
      thiết để ATOM thực hiện cung cấp Dịch Vụ Tư Vấn Thông tin Thẻ theo quy
      định tại Hợp Đồng này.
     </li>
    </ul>
    <ul id="14a47a78-0d31-4112-8438-4552d4f3b1bf" class="bulleted-list">
     <li>
      <strong>4 </strong>Hợp tác cùng ATOM thực hiện các yêu cầu của Ngân Hàng
      hoặc bên thứ ba (nếu có) để ATOM thực hiện cung cấp Dịch Vụ Tư Vấn Thông
      tin Thẻ theo quy định tại Hợp Đồng này. Trường hợp Khách Hàng chậm trễ
      hoặc không hợp tác dẫn đễn việc ATOM không thực hiện được hoặc thực hiện
      không đúng việc cung cấp Dịch Vụ Tư Vấn Thông tin Thẻ thì ATOM không bị
      xem là vi phạm Hợp Đồng.
     </li>
    </ul>
    <ul id="070c7e5d-f6e2-4a60-a4fd-e47e40f2cd89" class="bulleted-list">
     <li>
      <strong>5 </strong>Các quyền và nghĩa vụ khác theo quy định tại Hợp Đồng
      này và theo pháp luật.
     </li>
    </ul>
    <p id="4189f0f4-a971-40c4-97bc-1b8e77bbd6e8" class="">
     <strong>ĐIỀU 7. BẢO MẬT</strong>
    </p>
    <ul id="4fdec4e7-797d-40c2-b30d-ed56ddc1f183" class="bulleted-list">
     <li>
      <strong></strong>Mỗi Bên cam kết sẽ không tiết lộ bất kỳ thông tin mật nào
      cho bất kỳ bên thứ ba nào, trừ khi được cho phép như tại Khoản 2 Điều này.
     </li>
    </ul>
    <ul id="c7948484-bbd6-4af8-beb4-f19f45751344" class="bulleted-list">
     <li><strong></strong>Mỗi Bên có thể tiết lộ Thông tin mật của Bên kia:</li>
    </ul>
    <ul id="dc74c6a3-ffd9-4a25-99f5-2896493df0ea" class="bulleted-list">
     <li>
      Cho nhân viên, cán bộ, đại diện hoặc cố vấn của mình, những người cần biết
      thông tin đó với mục đích thực hiện nghĩa vụ của Bên đó theo Hợp Đồng này.
      Mỗi Bên phải đảm bảo rằng những nhân viên, cán bộ, đại diện hoặc cố vấn mà
      mình tiết lộ thông tin bí mật của Bên kia phải tuân theo quy định tại
      khoản này; và
     </li>
    </ul>
    <ul id="9b944af5-50e9-43b7-a41f-04c96032692c" class="bulleted-list">
     <li>
      Cho một tòa án có thẩm quyền hoặc bất kỳ cơ quan nhà nước có thẩm quyền
      nào khi được yêu cầu theo quy định pháp luật.
     </li>
    </ul>
    <ul id="40600aa2-17c3-4128-a3bd-96413a897fae" class="bulleted-list">
     <li>
      <strong></strong>Không Bên nào sử dụng Thông tin mật của Bên kia cho bất
      kỳ mục đích nào khác ngoài việc thực hiện các nghĩa vụ của mình theo Hợp
      Đồng này.
     </li>
    </ul>
    <p id="f2c8e42a-4434-4bb3-a715-c0ed9e63b39c" class="">
     <strong>ĐIỀU 8. ĐIỀU KHOẢN CHUNG</strong>
    </p>
    <p id="8bf17a31-d6ad-4440-addc-abc2efa0881a" class="">
     8.1 Mọi tranh chấp phát sinh từ hoặc liên quan đến Hợp Đồng này, thì sẽ
     được các Bên giải quyết thông qua thương lượng trên tinh thần thiện chí.
     Trường hợp không thể được giải quyết bằng thương lượng thì sẽ được đệ trình
     và giải quyết tại tòa án có thẩm quyền theo quy định pháp luật Việt Nam.
    </p>
    <p id="556e7665-3708-4517-8342-1f2b92529f77" class="">
     8.2 Hợp đồng này có hiệu lực từ ngày ký và được lập thành 02 (hai) bản. Mỗi
     bên giữ 01 (một) bản có giá trị pháp lý như nhau.
    </p>
    <p id="db6dd730-cc57-4e42-83f4-bb3b2b500b03" class="">
     <strong>ĐỂ LÀM BẰNG CHỨNG,</strong> các Bên đã tự nguyện ký kết như dưới
     đây:
    </p>
    <div id="7768ab3b-bc2e-4431-8aa1-710645556d80" class="column-list">
     <div
      id="2fd50d8c-1716-4d9e-901c-386e9b500bf7"
      style="width:33.33333333333333%"
      class="column"
     >
      <p id="660b292f-4a96-4d3b-9618-c786a0ffd559" class="">
       <strong>CÔNG TY CỔ PHẦN GIẢI PHÁP ATOM</strong>
      </p>
      <p id="e639724e-4510-440e-ad4c-d3c66dbc2261" class="">
       Tên: 
      </p>
      <p id="fbebd660-2c59-4acf-bd80-dffde77f1a7a" class="">
       Chức vụ: Chuyên viên Tư quản lý thẻ cá nhân
      </p>
     </div>
     <div
      id="b1ce77a9-52ae-4489-a5b2-ea37fee846ca"
      style="width:33.33333333333333%"
      class="column"
     ></div>
     <div
      id="798fdca2-f565-4f0f-9903-2257bf54903e"
      style="width:33.33333333333333%"
      class="column"
     >
      <p id="e6bdabd3-dc69-4d96-a0a7-731004a1aee1" class="">
       <strong>KHÁCH HÀNG</strong>
      </p>
      <p id="f27b24f9-5d81-474b-b9d1-f1b166cbf700" class="">
       Tên: [DISPLAYNAME]
      </p>
     </div>
    </div>
   </div>
  </article>
 </body>
</html>
`;
export default templateHDDVTV;