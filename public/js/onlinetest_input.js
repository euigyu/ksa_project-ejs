//추가 버튼 
const subject = window.location.pathname.split('/')[3]
var count=0;
var check_qno=0; //수정페이지에서 문제 추가시 불러오는것 방지용
var result=false;

$('.addQuestion').bind('click', addQuestionListener);
addQuestion()


function addQuestionListener (e) {
  e.preventDefault()
  e.stopPropagation()
  addQuestion()
}
function addQuestion(idx) {
  $.ajax2({
    url: `http://learnonline.click/api/onlineTest/list/${subject}`,
    processData: false,
    contentType: "application/json",
    type: "GET",
    success: function (_result) {
      $.ajax2({
        url: `http://learnonline.click/api/onlineTest/multipleChoiceList/${subject}`,
        processData: false,
        contentType: "application/json",
        type: "GET",
        success: function (multiple) {
          const ques = _result.map(_result => ({..._result, m_nos: _result.m_nos.split('<<><'), choices: _result.choices.split('<<><')}))
          console.log(ques)
          //정답 찾기
          const ans = multiple
          const answers = ans.map(answer => ({...answer, m_nos: answer.m_nos.split('<<><')}))
          //
          if(_result.length && check_qno==0){
            check_qno++;
            for(var i=0; i<_result.length; i++){
              // alert("start")
              var checked=[];
              for(var j=0; j<5;j++){
                if(parseInt(ques[i].m_nos[j])==parseInt(answers[i].m_nos[0])){
                  checked.push("checked")
                  // alert(answers[i].m_nos[0])
                }
                else{
                  checked.push("")
                }
              }
              var addStaffText =
                '<div class="box col-md-6 col-sm-12">' +
                '<div class="content">' +
                '<input class="form-control question" type="text" value="'+_result[i].question+'" placeholder="문제입력"/>' +
                  '<div class="selections">' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex1" type="text" value="'+ques[i].choices[0]+'" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" '+checked[0]+' type="radio" value="1"/>'+
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex2" type="text" value="'+ques[i].choices[1]+'" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" '+checked[1]+' type="radio" value="2"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex3" type="text" value="'+ques[i].choices[2]+'" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" '+checked[2]+' type="radio" value="3"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex4" type="text" value="'+ques[i].choices[3]+'" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" '+checked[3]+' type="radio" value="4"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex5" type="text" value="'+ques[i].choices[4]+'" placeholder="모르겠음" readonly/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" '+checked[4]+' type="radio" value="5"/>' +
                    '</div>' +
                  '</div>' +
                // '    <input class="form-control question_result" type="text" placeholder="정답"/>'+
                '<input class="form-control question_comment" type="text" name="question_comment" value="'+_result[i].comment+'" placeholder="해설"/><br/>' +
                '<button class="btnt" name="delete">삭제</button>' +
                '<input style="display:none" class="form-control q_no" type="text" value="'+_result[i].q_no+'" placeholder="문제번호"/>' +
                '<input style="display:none" class="form-control m_nos1" type="text" value="'+ques[i].m_nos[0]+'" placeholder=""/>' +
                '<input style="display:none" class="form-control m_nos2" type="text" value="'+ques[i].m_nos[1]+'" placeholder=""/>' +
                '<input style="display:none" class="form-control m_nos3" type="text" value="'+ques[i].m_nos[2]+'" placeholder=""/>' +
                '<input style="display:none" class="form-control m_nos4" type="text" value="'+ques[i].m_nos[3]+'" placeholder=""/>' +
                '<input style="display:none" class="form-control m_nos5" type="text" value="'+ques[i].m_nos[4]+'" placeholder=""/>' +
                '</div>' +
                '</div>'
              var trHtml = $('#tbody'); //last를 사용하여 마지막 태그 호출
              trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.
              count++;
            }
          $('.question_answer').unbind();
          $("button[name=delete]").unbind() 
          $("button[name=delete]").bind('click', deleteQuestion)
          }
          else{
            var addStaffText =
              '<div class="box col-md-6 col-sm-12">' +
              '<div class="content">' +
                '<input class="form-control question" type="text" value="" placeholder="문제입력"/><br>' +
                  '<div class="selections">' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex1" type="text" value="" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" type="radio" value="1"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex2" type="text" value="" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" type="radio" value="2"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex3" type="text" value="" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" type="radio" value="3"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex4" type="text" value="" placeholder="보기 입력"/>' +
                      '<input name="check_'+count+'" class="form-control question_answer" type="radio" value="4"/>' +
                    '</div>' +
                    '<div class="multi-selection">' +
                      '<input class="form-control question_ex5" type="text" value="모르겠음" placeholder="모르겠음" readonly />' +
                      '<input name="check_'+count+'" class="form-control question_answer" type="radio" value="5"/>' +
                    '</div>' +
                  '</div>' +
                '<input class="form-control question_comment" type="text" name="question_comment" value="" placeholder="해설"/>' +
                '<button class="btnt" name="delete">삭제</button>' +
              '</div>' +
              '</div>'
            var trHtml = $('#tbody'); //last를 사용하여 마지막 태그 호출
            trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.
            count++;
          }
          $('.question_answer').unbind();
          $("button[name=delete]").unbind() 
          $("button[name=delete]").bind('click', deleteQuestion)
        }
      })
    }
  })
}
$('.question_answer').on('click' ,function(e){
  alert(this.value);
  // document.getElementById("a").value = dd;  
});


$('.register').on('click', function (e) {
  // alert($('input:radio[name=이름]').is(':checked'));
  // $('input[name="check"]').each(function() {
  //   // var id = $('input[name="check"]:checked').attr('id')
  //   alert($('input[name="check"]:checked').val())
  //   alert(typeof($('input[name="check"]:checked').val()))
  // })
  var ex=[]
  var arr = []
  $('.box').each((idx, element) => {
    var answer = parseInt($(element).find('input:checked').val());
    for(var i =1; i<=5; i++){
      if(i==answer){
        ex.push('T')
      }
      else{
        ex.push('F')
      }
    }
    var test = {
      q_no: $(element).find('.content .q_no').val(),
      question: $(element).find('.content .question').val(),
      m_nos1: $(element).find('.content .m_nos1').val(),
      question_ex1: $(element).find('.content .question_ex1').val(),
      question_ex1_answer: ex[0],
      m_nos2: $(element).find('.content .m_nos2').val(),
      question_ex2: $(element).find('.content .question_ex2').val(),
      question_ex2_answer: ex[1],
      m_nos3: $(element).find('.content .m_nos3').val(),
      question_ex3: $(element).find('.content .question_ex3').val(),
      question_ex3_answer: ex[2],
      m_nos4: $(element).find('.content .m_nos4').val(),
      question_ex4: $(element).find('.content .question_ex4').val(),
      question_ex4_answer: ex[3],
      m_nos5: $(element).find('.content .m_nos5').val(),
      question_ex5: $(element).find('.content .question_ex5').val(),
      question_ex5_answer: ex[4],
      question_comment: $(element).find('.content .question_comment').val(),
    };
    arr.push(test);
    ex=[];
  });
  count=0;
  console.log(arr);
  
  var post = 'POST METHOD CALL'
  // ajax post 통신
  $(arr).each(function () {
    $.ajax2({
      url: `http://learnonline.click/api/onlineTest/${subject}/testinput`,
      // dataType: 'json',
      contentType: "application/json",
      type: this.q_no ? 'PUT' : 'POST',
      data: JSON.stringify({
        arr: this
      }),
      success: () => {result=true}
    });
  })
  if (true) {
    alert("문제 입력이 완료 되었습니다.");
    check_qno=0; 
    window.location.href = '/admin/onlineTest/'
  }
});
//삭제 버튼
function deleteQuestion() {
  var trHtml = $(this).parent().parent();
  console.log(trHtml)
  trHtml.remove(); //tr 테그 삭제

};
