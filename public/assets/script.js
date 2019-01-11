$(document).ready(function(){
    $('#removeContact').on('show.bs.modal', function (e) {
        var id = $(e.relatedTarget).data('id');
        //alert(id);
        $("#remove-button").attr("href", `/my-profile/delete-contact/${id}`);
     });

     $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
});