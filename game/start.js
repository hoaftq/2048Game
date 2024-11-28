$(function () {
    var controller;
    $('select').change(function (e) {
        if (controller) {
            controller.destroy();
        }

        var size = parseInt($(this).val());
        controller = new GameController('#container', size, size);
        controller.start();
    }).trigger('change');

    $('#about').nextAll().remove();
})