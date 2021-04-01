const subject = window.location.pathname.split('/')[2]

$('.register').unbind()
// $('.register').bind('click', validation)
$('.register').bind('click', submit)

function validation () {
  if ($('.input_name').val() == "") {
    return alert("이름을 입력하세요");
  } else if (($('.input_no').val() == "")) {
    return alert("수강생 번호를 입력하세요");
  } else {
    return alert("시작");
  }
}

function submit(e) {
  var checked = [];
  var url = `/onlineTest/${subject}/result`
  var name= $('.input_name').val();
  var std_no =$('.input_no').val();
  $('input[type="radio"]:checked').each(function () {
    ($(this).data('mnum'));
    checked.push($(this).data('mnum'));
  })

  if(checked.length) {
    url += '/?name='+name+'&std_no='+std_no+'&';
    $(checked).each(function () {
      url += 'checked='+ this + '&'
    })
  }
  location.href = url
  alert(url);
}