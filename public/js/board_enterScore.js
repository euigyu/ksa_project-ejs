// const {stringify}  = require("query-string");

//추가 버튼 
const subject = window.location.pathname.split('/')[2]

$('.addInput').bind('click', addScoreListener);


function addScoreListener (e) {
  e.preventDefault()
  e.stopPropagation()
  addScore()
}
function addScore(idx) {
 $.ajax({
        url: `http://localhost:3008/api/module/list/${subject}`,
        processData: false,
        contentType: "application/json",
        type: "GET",
        success: function (_result) {
          console.log(_result[0].module_kr)
            $.ajax({
                url: `http://localhost:3008/api/board/scoreInfo/${subject}`,
                processData: false,
                contentType: "application/json",
                type: "GET",
                success: function (result) {
                    // console.log(result)
                    if(result.length!=0){
                        for(var i=0;i<result.length;i++){
                            // console.log(result);
                            var addStaffText =
                            '<tr class="box">'+
                            '<td class="active col-md-1" style="width:20%"><strong>'+_result[0].module_kr+'실기 평가 성적 입력</strong></td>'+
                            '<td class="active col-md-11 content"style="width:80%">'+
                            '<br/><input style="width:20%" class="form-control group" type="text" value="'+result[i].group+'" placeholder="분반"/>'+
                            '<input style="width:20%" class="form-control std_no" type="text" value="'+result[i].std_no+'" placeholder="수강생 번호"/>'+
                            '<input style="width:20%" class="form-control std_name" type="text" value="'+result[i].name+'" placeholder="이름"/>'+
                            '<input style="width:20%" class="form-control std_score" type="text" value="'+result[i].score+'" placeholder="점수"/>'+
                            '<textarea style="width:80%" class="form-control personal_comment" type="textarea" value="'+result[i].personal_cmt+'" placeholder="개인 과제 평가 코멘트">'+result[i].personal_cmt+'</textarea>'+
                            '<textarea style="width:80%" class="form-control team_comment" type="textarea" value="'+result[i].team_cmt+'" placeholder="팀 과제 평가 코멘트">'+result[i].team_cmt+'</textarea><br/>'+
                            '<button class="add" name="delete"/>삭제</button>'+
                            '</td>'+
                            '</tr>';
                            var trHtml = $('#tbody'); //last를 사용하여 마지막 태그 호출
                            trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.
                        }
                    }
                    else{
                        var addStaffText =
                        '<tr class="box">'+
                        '<td class="active col-md-1" style="width:20%"><strong>'+_result[0].module_kr+'실기 평가 성적 입력</strong></td>'+
                        '<td class="active col-md-11 content"style="width:80%">'+
                        '<br/><input style="width:20%" class="form-control group" type="text" placeholder="분반"/>'+
                        '<input style="width:20%" class="form-control std_no" type="text" value="" placeholder="수강생 번호"/>'+
                        '<input style="width:20%" class="form-control std_name" type="text" value="" placeholder="이름"/>'+
                        '<input style="width:20%" class="form-control std_score" type="text" value="" placeholder="점수"/>'+
                        '<textarea style="width:80%" class="form-control personal_comment" type="textarea" placeholder="개인 과제 평가 코멘트"></textarea>'+
                        '<textarea style="width:80%" class="form-control team_comment" type="textarea" placeholder="팀 과제 평가 코멘트"></textarea><br/>'+
                        '<button class="add" name="delete"/>삭제</button>'+
                        '</td>'+
                        '</tr>';
                        var trHtml = $('#tbody'); //last를 사용하여 마지막 태그 호출
                        trHtml.append(addStaffText); //마지막 태그 뒤에 붙인다.  
                    }
                }
            })
        }
  })
}

$('.register').on('click', function (e) {
    var arr = []
    $('.box').each((idx, element) => {
        var test = {
            group : $(element).children('.content').children('.group').val(),
            std_no: $(element).children('.content').children('.std_no').val() ,
            std_name: $(element).children('.content').children('.std_name').val(),
            std_score: $(element).children('.content').children('.std_score').val(),
            personal_comment: $(element).children('.content').children('.personal_comment').val(),
            team_comment: $(element).children('.content').children('.team_comment').val(),
        }; 
        arr.push(test);
    });
        console.log(arr);
    var post = 'POST METHOD CALL';
    // Ajax POST Method TEST
    alert("요이")
    $.ajax({
        url: `http://localhost:3008/api/board/enterscore/${subject}`,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({ arr }),
        type: "POST",
        success: function (result) {
          location.href = `http://localhost:3008/admin/board/${subject}`
        },
      });
    // $.ajax({
    //     url: `http://localhost:3008/api/onlineTest/board/${subject}`,
    //     dataType: 'json',
    //     contentType: "application/json",
    //     type: 'POST',
    //     data: arr,
    //     success: function(result) {
    //        if (result) {
    //         alert("성적 입력이 되었습니다");
    //         window.location.href =`/admin/board/${subject}`
    //        }
    //     }
    // });
  });

//삭제 버튼
$(document).on("click","button[name=delete]",function(){
    
    var trHtml = $(this).parent().parent();
    
    trHtml.remove(); //tr 테그 삭제
    
});
