const subject = window.location.pathname.split('/')[2]
var str = location.href;

function getScore () {
  console.log($('input[type="radio"].correct:checked').length)
  return $('input[type="radio"].correct:checked').length
}

$.ajax({
  url: `http://3.35.50.200:3008/api/multipleChoiceList/${subject}`,
  processData: false,
  contentType: "application/json",
  type: "GET",
  success: function (result) {
    const ans = result
    const answers = ans.map(answer => ({...answer, m_nos: answer.m_nos.split(',')}))
       // console.log(_answer.m_nos.indexOf(`${$(this).data('mnum')}`));
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
    
    var score = getScore()
    $('.score').append('<span> 점수는 '+ score +' 입니다</span>');

  },
})