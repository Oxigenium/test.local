<?
    require 'api' . DIRECTORY_SEPARATOR . 'objects' . DIRECTORY_SEPARATOR .'CaptchasDotNet.php';
    $captchas = new CaptchasDotNet ('demo', 'secret',
    '/tmp/captchasnet-random-strings','3600',
    'abcdefghkmnopqrstuvwxyz','6',
    '180','70','000088');

    ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Гостевая книга</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:600,800&amp;subset=cyrillic" rel="stylesheet">

    <link rel="stylesheet" href="/assets/styles/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/styles/styles.css">

</head>
<body>
    <div class="container-fluid">
        <div class="row justify-content-center ">
            <div class="col-lg-8 col-md-10 col-xs-12">
                <h1 class="display-3 text-center mb-2">Гостевая книга</h1>

                <button type="button" class="btn btn-primary btn-lg mb-4 btn-block mx-auto" style="width: 200px;" data-toggle="modal" data-target="#addMessage">Добавить отзыв</button>

                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect02">Сортировка по:</label>
                    </div>
                    <select class="custom-select" id="inputGroupSelect02" onchange="globalSortBy=this.options[this.selectedIndex].value; globalPage = 0; retrieveData(); saveState();">
                        <option value="timestamp" selected>Дате добавления</option>
                        <option value="username">Имени пользователя</option>
                        <option value="email">Электронному адресу</option>
                    </select>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" onclick="flipDirection(); globalPage = 0; retrieveData(); saveState();">Изменить очерёдность</button>
                    </div>
                </div>

                <div class="cards" id="cards">
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center  mt-5" id="paginator">
                    </ul>
                </nav>

            </div>
        </div>
    </div>

    <div class="modal fade" id="addMessage" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalLabel">Добавить отзыв</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form class="needs-validation" novalidate>
                <div class="modal-body">
                        <div class="form-group">
                            <label for="username" class="col-form-label">Имя пользователя:</label>
                            <input type="text" class="form-control" name="userName" id="username" required pattern="[a-zA-Z0-9]+">
                        </div>
                        <div class="form-group">
                            <label for="email" class="col-form-label">Электронный адрес:</label>
                            <input type="email" class="form-control" name="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="homepage" class="col-form-label">Домашная страница (необязательно):</label>
                            <input type="url" class="form-control" name="homepage" id="homepage">
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Текст:</label>
                            <textarea class="form-control" name="text" id="message-text" required></textarea>
                        </div>

                    <div class="row justify-content-between" style="margin-bottom:30px;">
                        <div class="col-sm-5">
                            <?= $captchas->image () ?>
                            <br/> <a href="javascript:captchas_image_reload('captchas.net')">Обновить</a>
                        </div>
                        <div class="col-sm-5">
                            <label for="email">Вы не робот?:</label>
                            <input type="text" class="form-control"  name="captcha" required id="captcha" size="6" name="captcha" pattern="[a-zA-Z0-9]+">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Send message</button>
                </div>
                </form>
            </div>
        </div>
    </div>

    <script src="/assets/js/scripts.js"></script>
</body>
</html>
