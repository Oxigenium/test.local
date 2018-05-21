
var globalCount = 0,
    globalSortDirection = 'lifo',
    globalSortBy = 'timestamp',
    globalPage = 0;

jQuery(document).ready(function($) {
    var forms = document.getElementsByClassName('needs-validation');

    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var validated = form.checkValidity();
            form.classList.add('was-validated');
            if (validated === true)
            {
                var serializedArray = $(form).serializeArray();
                var formData = {
                    userName: serializedArray[0].value,
                    email: serializedArray[1].value,
                    homepage: serializedArray[2].value,
                    text: serializedArray[3].value,
                    captcha: serializedArray[4].value
                }
                addData(formData);
            }

        }, false);
    });
    getCount();
    retrieveData();
});

function addData(formData) {
    $.ajax({
        method: "POST",
        url: "/api/add/usermessage/",
        headers: {
            "X-HTTP-Method-Override" : "PUT"
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            userName: formData.userName,
            email: formData.email,
            homepage: formData.homepage,
            text: formData.text,
            captcha: formData.captcha
        })
    })
        .done(function( data ) {
                if (data.status === 'ok') {
                    console.log('success');
                    retrieveData();
                    $('#addMessage').modal('hide');
                }
            }
        );
}

function retrieveData() {

    $('#paginator .paginator-previous').removeClass('disabled');
    $('#paginator .paginator-next').removeClass('disabled');

    if (globalPage == 0)
        $('#paginator .paginator-previous').addClass('disabled');

    if (globalPage > ((globalCount / 25) - 1) && globalCount % 25 != 0)
        $('#paginator .paginator-next').addClass('disabled');

    $('.paginator-number').removeClass('active');
    $('.paginator-number[data-linknumber='+ globalPage +']').addClass('active');



    $.ajax({
        method: "GET",
        url: "/api/read/messages/",
        data: { sortdirection: globalSortDirection, sortby: globalSortBy, page: globalPage }
    })
        .done(function( data ) {
            if (data.status === 'ok') {
                var cards = '';
                data.messages.forEach(function (elem) {
                    cards += '<div class="card" >';
                    cards += '<div class="card-body">';
                    cards += '<h5 class="card-title">Пользователь: '+ elem.username +'</h5>';
                    cards += '<h6 class="card-subtitle mb-2 text-muted">' + elem.timestamp + '</h6>';
                    cards += '<p class="card-text">'+ elem.text + '</p>';
                    cards += '<a href="mailto:'+ elem.email +'" class="card-link">'+ elem.email +'</a>';
                    if (elem.homepage && elem.homepage != '')
                        cards += '<a href="'+ elem.homepage +'" class="card-link">'+ elem.homepage +'</a>';
                    cards += '</div>';
                    cards += '</div>';
                });

                $('#cards').html(cards);
            }
        });
}
function flipDirection (){
    globalSortDirection = globalSortDirection === 'lifo' ? 'fifo' : 'lifo';
}
function getCount() {

    $.ajax({
        method: "GET",
        url: "/api/read/count/",
        data: {}
    })
        .done(function( data ) {
            if (data.status === 'ok') {
                globalCount = data.count;
                var paginatorHtml = '';
                paginatorHtml += '<li onclick="if (~this.className.search(\'disabled\')) return false; globalPage--; retrieveData();" class="page-item disabled paginator-previous"><a class="page-link" href="#" tabindex="-1">Previous</a></li>';
                for (var i = 0; i < (globalCount / 25); i++) {
                    paginatorHtml += '<li onclick="globalPage = this.dataset.linknumber; retrieveData();" data-linknumber="' + i + '"  class="page-item paginator-number '+ (i == 0 ? 'active' : '')  +'"><a class="page-link" href="#">' + (i+1) + '</a></li>';
                }
                paginatorHtml += '<li onclick="if (~this.className.search(\'disabled\')) return false; globalPage++; retrieveData();"  class="page-item ' + (globalCount > 25 ? '' : 'disabled') + ' paginator-next"><a class="page-link" href="#">Next</a></li>';
                $('#paginator').html(paginatorHtml);
            }
        });
}