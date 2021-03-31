convertDate();
convertDateTime();

function get2digits (num){
  return ('0' + num).slice(-2);
}

function getDate(dateObj){
  if(dateObj instanceof Date)
    return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
}

function getTime(dateObj){
  if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
}

function convertDate(){
  $('[data-date]').each(function(index,element){
    var dateString = $(element).data('date');
    if(dateString){
      var date = new Date(dateString);
      $(element).html(getDate(date));
    }
  });
}

function convertDateTime(){
  $('[data-date-time]').each(function(index,element){
    var dateString = $(element).data('date-time');
    if(dateString){
      var date = new Date(dateString);
      $(element).html(getDate(date)+' '+getTime(date));
    }
  });
}

function download(filename, endpoint, originalname) {
  var url = `${endpoint}/${filename}`
  console.log(filename);
  var a = document.createElement('a');
  a.href = url // xhr.response is a blob
  a.download = originalname; // Set the file name.
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url)
}