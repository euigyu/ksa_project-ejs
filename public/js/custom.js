/*------------------------------------------------------------------
Project:    Mosaic
Author:     Simpleqode
URL:        http://simpleqode.com/
            https://twitter.com/YevSim
            https://www.facebook.com/simpleqode
Version:    1.3.1
Created:        20/01/2014
Last change:    06/07/2015
-------------------------------------------------------------------*/
/* slide 글씨 효과*/
var typingBool = false; 
var typingIdx=0; 
var liIndex = 0;
var liLength = $(".typing-txt>ul>li").length;

// 타이핑될 텍스트를 가져온다 
var typingTxt = $(".typing-txt>ul>li").eq(liIndex).text(); 
typingTxt=typingTxt.split(""); // 한글자씩 자른다. 
if(typingBool==false){ // 타이핑이 진행되지 않았다면 
    typingBool=true; 
    var tyInt = setInterval(typing,100); // 반복동작 
} 
     
function typing(){ 
  if(typingIdx<typingTxt.length){ // 타이핑될 텍스트 길이만큼 반복 
     $(".typing").append(typingTxt[typingIdx]); // 한글자씩 이어준다. 
     typingIdx++; 
   } else{ //한문장이끝나면
     //다음문장으로.. 마지막문장이면 다시 첫번째 문장으로
if(liIndex>=liLength-1){
       liIndex=0;
     }else{
       liIndex++; 
     }
     
     //다음문장을 타이핑하기위한 셋팅
        typingIdx=0;
        typingBool = false; 
        typingTxt = $(".typing-txt>ul>li").eq(liIndex).text(); 
       
     //다음문장 타이핑전 1초 쉰다
         clearInterval(tyInt);
         setTimeout(function(){
            $(".typing").html('');
           tyInt = setInterval(typing,100);
         },2000);
    } 
}  	 
/* ===== Sticky Navbar ===== */

$(window).load(function(){
  $(".navbar").sticky({ topSpacing: 0 });
});

/* ====== Search box toggle ===== */

$('#nav-search').on('click', function() {
  $(this).toggleClass('show hidden').removeClass('animated flipInX');;
  $("#nav-search-close").toggleClass('show hidden');
  $("#nav-search-form").toggleClass('show hidden animated flipInX');
  return false;
});

$('#nav-search-close').on('click', function() {
  $(this).toggleClass('show hidden');
  $("#nav-search").toggleClass('show hidden animated flipInX');
  $("#nav-search-form").toggleClass('show hidden animated flipInX');
  return false;
});

/* Navbar dropdown link bug fix */

$('.navbar-nav > li > a').hover (function() {
  $(this).toggleClass("nav-hover-fix");
  return false;
});

// Style Toggle
// ============

$('.style-toggle-btn').on('click', function() {
  $(".style-toggle").toggleClass("style-toggle-show");
  $(this).toggleClass("fa-gears fa-angle-double-right");
  return false;
});

// Navbar Style Change
// =================

$('#opt-navbar-dark').on('change', function() {
  $(".mini-navbar").addClass("mini-navbar-dark").removeClass("mini-navbar-white");
  $(".navbar").addClass("navbar-dark").removeClass("navbar-white");
  return false;
});

$('#opt-navbar-white').on('change', function() {
  $(".mini-navbar").addClass("mini-navbar-white").removeClass("mini-navbar-dark");
  $(".navbar").addClass("navbar-white").removeClass("navbar-dark");
  return false;
});

$('#opt-navbar-mixed').on('change', function() {
  $(".mini-navbar").addClass("mini-navbar-dark").removeClass("mini-navbar-white");
  $(".navbar").addClass("navbar-white").removeClass("navbar-dark");
  return false;
});

// Footer Style Change
// =================

$('#opt-footer-dark').on('change', function() {
  $("footer").addClass("footer-dark").removeClass("footer-white");
  return false;
});

$('#opt-footer-white').on('change', function() {
  $("footer").addClass("footer-white").removeClass("footer-dark");
  return false;
});

// Body Style Change
// =================

$('.style-toggle-body .colors > .green').on('click', function() {
  $("body").addClass("body-green").removeClass("body-blue body-orange body-red");
  return false;
});

$('.style-toggle-body .colors > .blue').on('click', function() {
  $("body").addClass("body-blue").removeClass("body-green body-orange body-red");
  return false;
});

$('.style-toggle-body .colors > .orange').on('click', function() {
  $("body").addClass("body-orange").removeClass("body-green body-blue body-red");
  return false;
});

$('.style-toggle-body .colors > .red').on('click', function() {
  $("body").addClass("body-red").removeClass("body-green body-blue body-orange");
  return false;
});

/* ===== Our Services ===== */

$('.services-item').hover (function() {
  $(this).children("i").toggleClass("fa-rotate-90");
  return false;
});

/* ===== Sign Up popovers ===== */

$(function(){
  $('#name').popover();
});

$(function(){
  $('#username').popover();
});

$(function(){
  $('#email').popover();
});

$(function(){
  $('#password').popover();
});

$(function(){
  $('#repeat-password').popover();
});

// Smooth scrolling for UI elements page
// =====================================
$(document).ready(function(){
  $('a[href*=#buttons],a[href*=#panels], a[href*=#info-boards], a[href*=#navs], a[href*=#headlines]').bind("click", function(e){
    var anchor = $(this);
    $('html, body').stop().animate({
    scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
    e.preventDefault();
  });
   return false;
});