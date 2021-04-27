const subject = window.location.pathname.split('/')[3]
const choice = window.location.pathname.split('/')[1]
$('.register').unbind()
// $('.register').bind('click', validation)
$('.register').bind('click', submit)

function validation () {
  if ($('.input_name').val() == "") {
    alert("이름을 입력하세요");
    return true;
  } 
  else if (($('.input_no').val() == "")) {
    alert("수강생 번호를 입력하세요");
    return true;
  }
}

function submit(e) {
  if(validation()){
    return false
  };
  var checked = [];
  var url = `/${choice}/onlineTest/${subject}/result`
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