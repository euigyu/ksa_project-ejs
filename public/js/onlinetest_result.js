const subject = window.location.pathname.split('/')[2]

$.ajax({
  url: `http://localhost:3008/api/multipleChoiceList/${subject}`,
  processData: false,
  contentType: "application/json",
  type: "GET",
  success: function (result) {
    const ans = result
    const answers = ans.map(answer => ({...answer, m_nos: answer.m_nos.split(',')}))
    
    $(answers).each(function (idx, _answer) {
      $('input.q_'+this.q_no).each(function () {
        console.log(_answer.m_nos.indexOf(`${$(this).data('mnum')}`));
        if(_answer.m_nos.indexOf(`${$(this).data('mnum')}`)  > -1) {
          $(this).addClass('correct')
        } else {
          $(this).addClass('incorrect')
        }
      })
    })
  },
})