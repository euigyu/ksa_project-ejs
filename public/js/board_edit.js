
$(".submit").unbind();
$(".submit").bind("click", uploadFile);

$("#fileupload").unbind();
$("#fileupload").bind("change", addFiles);

var files = Array.from($('.initial-files').map(function () {
  return {
    filename: $(this).data('filename'),
    originalname: $(this).data('originalname'),
    endpoint: $(this).data('endpoint'),
  }
}))

function addFiles(e) {
  var _files = e.target.files;
  var filesArr = Array.prototype.slice.call(_files);
  var filesArrLen = filesArr.length;
  var filesTempArrLen = files.length;
  var formData = new FormData();
  for (var i = 0; i < filesArrLen; i++) {
    $("#file-list").append(
      "<div class='item download'>" +
        filesArr[i].name +
        '<img src="/images/deleteImage.png" onclick="deleteFile(event, ' +
        (filesTempArrLen + i) +
        ');"></div>'
    );
    formData.append("files", filesArr[i]);
  }
  // $(this).val("");

  $.ajax2({
    url: "http://3.35.50.200:3008/api/file",
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: formData,
    type: "POST",
    success: function (result) {
      files = files.concat(result.files)
    },
  });
}
// 파일 삭제
function deleteFile(eventParam, orderParam) {
  files.splice(orderParam, 1);
  console.log(files);
  var innerHtmlTemp = "";
  var filesTempArrLen = files.length;
  for (var i = 0; i < filesTempArrLen; i++) {
    innerHtmlTemp +=
      "<div class='item download'>" +
      files[i].originalname +
      '<img src="/images/deleteImage.png" onclick="deleteFile(event, ' +
      i +
      ');"></div>';
  }
  $("#file-list").html(innerHtmlTemp);
}

function uploadFile() {
  const subject = window.location.href.split("/")[4];
  const id = $(this).data('id')
  var student = {};
  // 학생정보
  student.name = $("#name").val();
  student.std_no = $("#std_no").val();
  student.title = $("#title").val();
  student.content = $("#content").val();
  student.files = files;

  // validation
  if (!student.name) {
    alert('이름을 입력해 주세요')
    return 
  }
  if (!!$("#std_no")[0] && !student.std_no) {
    alert('학생번호를 입력해 주세요')
    return
  }
  if (!student.title) {
    alert('제목을 입력해 주세요')
    return
  }

  $.ajax2({
    url: `http://3.35.50.200:3008/api/board`,
    // url: `http://3.35.50.200:3008/api/board/${subject}`,
    processData: false,
    contentType: "application/json",
    data: JSON.stringify({ student, id }),
    type: "PUT",
    success: function (result) {
      // location.href = `http://3.35.50.200:3008/board/${subject}`
      location.href = `http://3.35.50.200:3008/board/${subject}`
    },
  });
}
