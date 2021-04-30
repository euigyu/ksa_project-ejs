// const {stringify}  = require("query-string");
//추가 버튼
const subject = window.location.pathname.split("/")[2];
var check_form=0; //수정페이지에서 추가시 기존 폼 불러오는것 방지용
addScore()
$(".addInput").bind("click", addScoreListener);

function addScoreListener(e) {
  e.preventDefault();
  e.stopPropagation();
  addScore();
}
function addScore(idx) {
  $.ajax2({
    url: `http://learnonline.click/api/onlineTest/moduleName/${subject}`,
    processData: false,
    contentType: "application/json",
    type: "GET",
    success: function (result1) {
      $.ajax2({
        url: `http://learnonline.click/api/board/scoreInfo/${result1}`,
        processData: false,
        contentType: "application/json",
        type: "GET",
        success: function (result) {
          //alert(result.length)
          if (result.length!=0 && check_form==0) {
            check_form++;
            for (var i = 0; i < result.length; i++) {
              var addStaffText =
                '<div class="box col-6">' +
                  '<div class="active content">' +
                    '<div class="row">' +
                      '<div class="col-3 label">분반</div>' +
                      '<input class="form-control col-9 group" type="text" value="' + result[i].group + '" placeholder="분반"/>' +
                    '</div>' +
                    '<div class="row">' +
                      '<div class="col-3 label">수강생 번호</div>' +
                      '<input class="form-control col-9 std_no" type="text" value="' + result[i].std_no + '" placeholder="수강생 번호"/>' +
                    '</div>' +
                    '<div class="row">' +
                      '<div class="col-3 label">이름</div>' +
                      '<input class="form-control col-9 std_name" type="text" value="' + result[i].name + '" placeholder="이름"/>' +
                    '</div>' +
                    '<div class="row">' +
                      '<div class="col-3 label">점수</div>' +
                      '<input class="form-control col-9 std_score" type="text" value="' + result[i].score + '" placeholder="점수"/>' +
                    '</div>' +
                    '<div class="row line label">개인과제 평가 코멘트</div>' +
                    '<textarea class="form-control personal_comment" type="textarea" value="' + result[i].personal_cmt + '" placeholder="개인 과제 평가 코멘트">' + result[i].personal_cmt + "</textarea>" +
                    '<div class="row line label">팀과제 평가 코멘트</div>' +
                    '<textarea class="form-control team_comment" type="textarea" value="' + result[i].team_cmt + '" placeholder="팀 과제 평가 코멘트">' + result[i].team_cmt + "</textarea><br/>" +
                    '<button class="add" name="delete">삭제</button>' +
                    '<input style="display:none" class="form-control score_id" type="text" value="'+result[i].score_id+'"/>' +
                  "</div>" +
                "</div>";
                console.log(addStaffText);
              var trHtml = $("#tbody"); //last를 사용하여 마지막 태그 호출
              trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.
            }
          } else {
            var addStaffText =
              '<div class="box col-6">' +
                '<div class="active content">' +
                  '<div class="row">' +
                    '<div class="col-3 label">분반</div>' +
                    '<input class="form-control col-9 group" type="text" placeholder="분반"/>' +
                  '</div>' +
                  '<div class="row">' +
                    '<div class="col-3 label">수강생 번호</div>' +
                    '<input class="form-control col-9 std_no" type="text" value="" placeholder="수강생 번호"/>' +
                  '</div>' +
                  '<div class="row">' +
                    '<div class="col-3 label">이름</div>' +
                    '<input class="form-control col-9 std_name" type="text" value="" placeholder="이름"/>' +
                  '</div>' +
                  '<div class="row">' +
                    '<div class="col-3 label">점수</div>' +
                    '<input class="form-control col-9 std_score" type="text" value="" placeholder="점수"/>' +
                  '</div>' +
                  '<div class="row line label">개인과제 평가 코멘트</div>' +
                  '<textarea class="form-control personal_comment" type="textarea" placeholder="개인 과제 평가 코멘트"></textarea>' +
                  '<div class="row line label">팀과제 평가 코멘트</div>' +
                  '<textarea class="form-control team_comment" type="textarea" placeholder="팀 과제 평가 코멘트"></textarea><br/>' +
                  '<button class="add" name="delete">삭제</button>' +
                "</div>" +
              "</div>";
            var trHtml = $("#tbody"); //last를 사용하여 마지막 태그 호출
            trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.
          }
        },
      });
    }
  });
}

$(".register").on("click", function (e) {
  $.ajax2({
    url: `http://learnonline.click/api/onlineTest/moduleName/${subject}`,
    processData: false,
    contentType: "application/json",
    type: "GET",
    success: function (result1) {
      var arr = [];
      $(".box").each((idx, element) => {
        var test = {
          subject: result1,
          score_id: $(element).find(".content .score_id").val(), 
          group: $(element).find(".content .group").val(),
          std_no: $(element).find(".content .std_no").val(),
          std_name: $(element).find(".content .std_name").val(),
          std_score: $(element).find(".content .std_score").val(),
          personal_comment: $(element).find(".content .personal_comment").val(),
          team_comment: $(element).find(".content .team_comment").val(),
        };
        arr.push(test);
      });
      console.log(arr);
      var post = "POST METHOD CALL";
      $(arr).each(function () {
        $.ajax2({
          url: `http://learnonline.click/api/board/enterscore/${subject}`,
          // dataType: 'json',
          contentType: "application/json",
          type: this.score_id ? 'PUT' : 'POST',
          data: JSON.stringify({
            arr: this
          }),
          success: () => {result=true}
        });
      })
      if (true) {
        alert("성적 입력이 완료 되었습니다.");
        check_form=0; 
        location.href = `http://learnonline.click/admin/board/${subject}`;
      }
      // $.ajax2({
      //   url: `http://learnonline.click/api/board/enterscore/${subject}`,
      //   processData: false,
      //   contentType: "application/json",
      //   data: JSON.stringify({ arr }),
      //   type: "POST",
      //   success: function (result) {
      //     check_form=0;
      //     alert("성적 입력이 완료되었습니다.")
      //     location.href = `http://learnonline.click/admin/board/${subject}`;
      //   },
      // });
    }
  });
});
//삭제 버튼
$(document).on("click", "button[name=delete]", function () {
  var trHtml = $(this).parent();

  trHtml.remove(); //tr 테그 삭제
});
