module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>WEB1 - ${title}</title>
  </head>
  <body class="body-green">
    <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
   </body>
</html>
    `;
  },list:function(data){
    var list = '<ul>';
    var i = 0;
    while(i < data.length){
      list = list + `<li><a href="/?id=${data[i].sub}">${data[i].sub_detail}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
