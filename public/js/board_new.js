$(function () {
  $(".submit").unbind();
  $(".submit").bind("click", uploadFile);

  $("#fileupload").unbind();
  $("#fileupload").bind("change", addFiles);

  var filesTempArr = []
  var files = []
  
  function addFiles(e) {
    var _files = e.target.files;
    var filesArr = Array.prototype.slice.call(_files);
    var filesArrLen = filesArr.length;
    var filesTempArrLen = filesTempArr.length;
    for (var i = 0; i < filesArrLen; i++) {
      filesTempArr.push(filesArr[i]);
      $("#fileList").append(
        "<div>" +
          filesArr[i].name +
          '<img src="/images/deleteImage.png" onclick="deleteFile(event, ' +
          (filesTempArrLen + i) +
          ');"></div>'
      );
    }
    // $(this).val("");
  
    // form Data
    var formData = new FormData();
    for (let i = 0, filesTempArrLen = filesTempArr.length; i < filesTempArrLen; i++) {
      formData.append("files", filesTempArr[i]);
    }
  
    $.ajax({
      url: "http://localhost:3008/api/file/insert",
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      data: formData,
      type: "POST",
      success: function (result) {
        files = result.files
        console.log('result files', files);
      },
    });
  }
  // 파일 삭제
  function deleteFile(eventParam, orderParam) {
    filesTempArr.splice(orderParam, 1);
    var innerHtmlTemp = "";
    var filesTempArrLen = filesTempArr.length;
    for (var i = 0; i < filesTempArrLen; i++) {
      innerHtmlTemp +=
        "<div>" +
        filesTempArr[i].name +
        '<img src="/images/deleteImage.png" onclick="deleteFile(event, ' +
        i +
        ');"></div>';
    }
    $("#fileList").html(innerHtmlTemp);
  }
  
  function uploadFile() {
    const subject = window.location.href.split("/")[4];
    var student = {};
  
    // 학생정보
    student.name = $("#name").val();
    student.std_no = $("#std_no").val();
    student.title = $("#title").val();
    student.content = $("#content").val();
    student.files = files;
  
    $.ajax({
      url: `http://localhost:3008/api/insert/${subject}`,
      processData: false,
      contentType: "application/json",
      data: JSON.stringify({ student }),
      type: "POST",
      success: function (result) {
        alert("업로드 성공!!");
      },
    });
  }
});
