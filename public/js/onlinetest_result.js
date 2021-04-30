const subject = window.location.pathname.split('/')[3];
const choice = window.location.pathname.split('/')[1];
const std_name = (searchParam('name'));
const std_no =(searchParam('std_no'));
var score 
var subject_kr
$('.register').unbind()
// $('.register').bind('click', validation)
$('.register').bind('click', save);

function save(){
  $.ajax2({
    url: `http://localhost:3008/api/onlineTest/moduleName/${subject}`,
    processData: false,
    contentType: "application/json",
    type: "GET",
    success: function (result1) {
        subject_kr = result1;
        alert(subject_kr)
        var data={
          subject : subject_kr,
          name : std_name,
          std_no : std_no,
          score : score
        };
        alert(data.subject)
        if(choice == "before"){
          $.ajax2({
            url: `http://localhost:3008/before/onlineTest/${subject}/result`,
            processData: false,
            contentType: "application/json",
            data: JSON.stringify( data ),
            type: "POST",
            success: function (result) {
              if (result) {
                location.href = '/onlineTest'
              }
            },
          })
        }
        if(choice == "after"){
          $.ajax2({
            url: `http://localhost:3008/after/onlineTest/${subject}/result`,
            processData: false,
            contentType: "application/json",
            data: JSON.stringify( data ),
            type: "POST",
            success: function (result) {
              if (result) {
                location.href = '/onlineTest'
              }
            },
          })
        }
      },
    })
}

function getScore () {
  console.log($('input[type="radio"].correct:checked').length)
  return $('input[type="radio"].correct:checked').length
}
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
};


$.ajax2({
  url: `http://localhost:3008/api/onlineTest/multipleChoiceList/${subject}`,
  processData: false,
  contentType: "application/json",
  type: "GET",
  success: function (result) {
    const ans = result
    console.log(ans);
    const answers = ans.map(answer => ({...answer, m_nos: answer.m_nos.split('<<><')}))
    //  console.log(_answer.m_nos.indexOf(`${$(this).data('mnum')}`));
    $(answers).each(function (idx, _answer) {
      $('input.q_'+this.q_no).each(function () {
        console.log(_answer.m_nos.indexOf(`${$(this).data('mnum')}`));
        if(_answer.m_nos.indexOf(`${$(this).data('mnum')}`)  > -1) {
          $(this).addClass('correct');
        } else {
          $(this).addClass('incorrect');
        }
      })
    })
    // new URLSearchParams(location.search).getAll(key);
    // alert(std_no);
    // alert($(".input_box").html());
    score = getScore();
    $(".input_box").html('<input disabled class=input_name type="text" style="width:20%" class="form-control" value="'+std_name+'"placeholder="'+std_no+'"/>'+
    '<input disabled class=input_no type="text" style="width:20%" class="form-control" value="'+std_no+'" placeholder="'+std_no+'"/>');
    $('.score').append('<span> 점수는 '+ score +' 입니다</span>');

  },
})

