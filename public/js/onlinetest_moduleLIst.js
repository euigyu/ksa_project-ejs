$('#before_download').unbind()
$('#before_download').bind('click', beforeResultDownload)
$('#after_download').unbind()
$('#after_download').bind('click', afterResultDownload)
function _excelDown(fileName, sheetName, sheetHtml) { 
  var html = ''; 
  html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">'; 
  html += ' <head>'; 
    html += ' <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'; 
    html += ' <xml>'; 
    html += ' <x:ExcelWorkbook>'; 
    html += ' <x:ExcelWorksheets>'; 
    html += ' <x:ExcelWorksheet>' 
    html += ' <x:Name>' + 
    sheetName + '</x:Name>'; // 시트이름 
    html += ' <x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>'; 
    html += ' </x:ExcelWorksheet>'; 
    html += ' </x:ExcelWorksheets>'; 
    html += ' </x:ExcelWorkbook>'; 
    html += ' </xml>'; 
    html += ' </head>'; 
    html += ' <body>'; 
      // ----------------- 시트 내용 부분 ----------------- 
    html += sheetHtml; 
      // ----------------- //시트 내용 부분 ----------------- 
    html += ' </body>'; 
    html += ' </html>'; 
      // 데이터 타입 
      var data_type = 'data:application/vnd.ms-excel'; 
      var ua = window.navigator.userAgent; 
      var blob = new Blob([html], {
        type: "application/csv;charset=utf-8;"
      }); 
      if ((ua.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && window.navigator.msSaveBlob) {
         // ie이고 msSaveBlob 기능을 지원하는 경우 
         navigator.msSaveBlob(blob, fileName); 
        } 
         else { 
           // ie가 아닌 경우 (바로 다운이 되지 않기 때문에 클릭 버튼을 만들어 클릭을 임의로 수행하도록 처리) 
          var anchor = window.document.createElement('a'); 
          anchor.href = window.URL.createObjectURL(blob); 
          anchor.download = fileName; 
          document.body.appendChild(anchor); 
          anchor.click(); // 클릭(다운) 후 요소 제거 
          document.body.removeChild(anchor); 
        }} 
        function excel_download(t){ 
          // 대상 테이블을 가져옴 
          var table = document.getElementById("excel"); 
          if(table){ 
            // CASE 대상 테이블이 존재하는 경우 
            // 엑셀다운 (엑셀파일명, 시트명, 내부데이터HTML)
            if(t == 'before'){ 
              _excelDown("사전_평가성적결과.xls", "시트명", table.outerHTML) 
            }
            if(t == 'after'){
              _excelDown("사후_평가성적결과.xls", "시트명", table.outerHTML) 
            }
          }
        }

function beforeResultDownload(){
  alert("사전 평가 다운로드");
  var check = 'before'
  $.ajax2({
    url: `http://localhost:3008/before/onlineTest/result/down`,
    processData: false,
    contentType: "application/json",
    data: "",
    type: "POST",
    success: function (result) {
        // alert(result[0].name)
        var str ='<table id="excel" border="1" style="visibility:hidden"'+
         ' <thead>'+ 
          '  <tr>'+
           '   <th>과목</th>'+ 
            '  <th>이름</th>'+ 
            '  <th>수강생 번호</th>'+ 
            '  <th>점수</th>'+ 
            ' </tr> '+
            ' </thead>'+ 
            ' <tbody> ';

            for(var i = 0; i < result.length; i++){
              str +='  <tr>'+
                      '   <td>'+result[i].subject+'</td> '+
                      '   <td>'+result[i].name+'</td> '+
                      '   <td>'+result[i].std_no+'</td> '+
                      '   <td>'+result[i].score+'</td> '+
                      '  </tr> ';
              }
              $('.excel_feild').append(str);
              excel_download(check);
              location.reload(true);
 },
    error: function (result){
      alert("fail")
    },
  });
};
function afterResultDownload(){
  alert("사후 평가 다운로드");
  var check = 'after'
  $.ajax2({
    url: `http://localhost:3008/after/onlineTest/result/down`,
    processData: false,
    contentType: "application/json",
    data: "",
    type: "POST",
    success: function (result) {
        // alert(result[0].name)
        var str ='<table id="excel" border="1" style="visibility:hidden"'+
         ' <thead>'+ 
          '  <tr>'+
           '   <th>과목</th>'+ 
            '  <th>이름</th>'+ 
            '  <th>수강생 번호</th>'+ 
            '  <th>점수</th>'+ 
            ' </tr> '+
            ' </thead>'+ 
            ' <tbody> ';

            for(var i = 0; i < result.length; i++){
              str +='  <tr>'+
                      '   <td>'+result[i].subject+'</td> '+
                      '   <td>'+result[i].name+'</td> '+
                      '   <td>'+result[i].std_no+'</td> '+
                      '   <td>'+result[i].score+'</td> '+
                      '  </tr> ';
              }
              $('.excel_feild').append(str);
              excel_download(check);
              location.reload(true);
 },
    error: function (result){
      alert("fail")
    },
  });
};
