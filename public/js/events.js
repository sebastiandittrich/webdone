$(document).ready(function() {

    $(window).on('hashchange', function(event){
        var from = event.originalEvent.oldURL
        var to = event.originalEvent.newURL
        if(from.indexOf('#popup') > -1) {
            app.backFromPopupClick ? app.backFromPopupClick() : null
        }
    })
})