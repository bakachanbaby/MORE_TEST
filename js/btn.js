// JS
// let form = document.querySelectorAll('.m-content-chose-form')
// let list = document.querySelectorAll('.m-chose-list')

// for (let i = 0; i < form.length; i++) {

//     form[i].addEventListener('click', () => {
//         list[i].style.display = 'block';
//     })
//     list[i].addEventListener('click', () => {
//         list[i].style.display = 'none';
//     })
// }
// // JQ
$('.m-content-chose-form:first').click(() => {
    $('.m-chose-list:first').show();
})
$('.m-content-chose-form:last').click(() => {
    $('.m-chose-list:last').show();
})