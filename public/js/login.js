
function login(obj) {
  var $form = $(obj).parent()
  var $id = $form.children('.id')
  var $pwd = $form.children('.pwd')
  const user = { id: $id.val(), pwd: $pwd.val() }

  $.ajax2({
    url: `http://learnonline.click/api/auth/login`,
    processData: false,
    contentType: "application/json",
    data: JSON.stringify({ user }),
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization",`Basic ${btoa(`${user.id}:${user.pwd}`)}`);
    },
    success: function (result) {
      $.setToken(result.token)
      if (result.token) {
        location.href = '/'
      } else {
        alert('다시 입력해주세요!')
      }
    },
    error: (err) => {
      console.log(err);
      alert('오류가 발생했습니다.')
    }
  })
 }
