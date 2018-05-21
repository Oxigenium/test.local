
var globalCount = 0,
    globalSortDirection = 'lifo',
    globalSortBy = 'timestamp',
    globalPage = 0;

jQuery(document).ready(function($) {
    var parameters = getUrlVars();

    if (parameters.page && !isNaN(+parameters.page))
        globalPage = +parameters.page;
    if (parameters.sortdirection && (parameters.sortdirection == 'lifo' || parameters.sortdirection == 'fifo'))
        globalSortDirection = parameters.sortdirection;
    if (parameters.sortby && (parameters.sortby == 'username' || parameters.sortby == 'email' || parameters.sortby == 'timestamp'))
        globalSortBy = parameters.sortby;






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

    $(window).on("popstate", function(e) {
        var backState = e.originalEvent.state;
        globalPage = backState.page;
        globalSortBy = backState.sortby;
        globalSortDirection = backState.sortdirection;
        retrieveData();
    });
});

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

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

function saveState()
{
    var state = {
        page: globalPage,
        sortdirection: globalSortDirection,
        sortby: globalSortBy
    };
    history.pushState(state,'Гостевая книга','?' + $.param(state));
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
                paginatorHtml += '<li onclick="event.preventDefault(); if (~this.className.search(\'disabled\')) return false; globalPage--; retrieveData(); saveState();" class="page-item ' + (globalPage == 0 ? 'disabled' : '') + ' paginator-previous"><a class="page-link" href="" tabindex="-1">Previous</a></li>';
                for (var i = 0; i < (globalCount / 25); i++) {
                    paginatorHtml += '<li onclick="event.preventDefault(); globalPage = this.dataset.linknumber; retrieveData(); saveState();" data-linknumber="' + i + '"  class="page-item paginator-number '+ (i == globalPage ? 'active' : '')  +'"><a class="page-link" href="">' + (i+1) + '</a></li>';
                }
                paginatorHtml += '<li onclick="event.preventDefault(); if (~this.className.search(\'disabled\')) return false; globalPage++; retrieveData(); saveState();"  class="page-item ' + (globalCount > 25 ? ((globalPage > ((globalCount / 25) - 1) && globalCount % 25 != 0) ? 'disabled' : '') : 'disabled') + ' paginator-next"><a class="page-link" href="">Next</a></li>';
                $('#paginator').html(paginatorHtml);
            }
        });
}