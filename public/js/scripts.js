$(document).ready(function(){
    $('.criar_campo').click(function(){
        var kakoi=$(this).attr('fldnum');
        var insHTML = '<div class="input-group"><input class="form-control" type="text" name="options"><span class="input-group-btn"><button class="btn btn-danger btn-sm remove_button" type="button">-</button></span></div>';
        $("#fld"+kakoi).append(insHTML);
    });

    $('.fld_wrap').on('click', '.remove_button', function(e){
        e.preventDefault();
        $(this).parents(':eq(1)').remove();
    });

    $('.criar_campo_extra').click(function(){
        var kakoi=$(this).attr('ordem_campo');
        var insHTML = '<div class="input-group mb-2"><input type="text" class="form-control" name="options" placeholder="Insira algo neste campo" required="required"><div class="input-group-append"><button class="btn btn-danger btn-sm remove_button" type="button">-</button></div></div>';
        $("#fld"+kakoi).append(insHTML);
    });     
    
    $("#myBtn").click(function(){
        $('.toast').toast('show');
    });
});