$(document).ready(function(){
    $('.delete-session').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/client/'+id,
            sucess: function(response){
                alert('Deleting Session');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});