function login (obj) {
  var subject = $(obj).data('subject')
  var id = $(obj).data('id')
  var $form = $(obj).parent()
  var $std = $form.children('.std')

  location.href = `http://3.35.50.200:3008/board/${subject}/${id}?std=${$std.val()}`

}