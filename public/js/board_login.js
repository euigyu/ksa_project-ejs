function login (obj) {
  var subject = $(obj).data('subject')
  var id = $(obj).data('id')
  var $form = $(obj).parent()
  var $std = $form.children('.std')

  location.href = `http://3.36.159.49:3008/board/${subject}/${id}?std=${$std.val()}`

}
