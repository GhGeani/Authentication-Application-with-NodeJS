$(document).ready(function(){
    $('#removeContact').on('show.bs.modal', function (e) {
        var id = $(e.relatedTarget).data('id');
        //alert(id);
        $("#remove-button").attr("href", `delete-contact/${id}`);
     });
});