$(document).ready(function() {
    app = new Vue({
        el: '#app',
        data: {

        },
        methods: {
            // UI Events
            deleteAllClick() {
                this.deleteAll()
                this.redirectHome()
            },

            // UI Model
            redirectHome() {
                window.location.href = '/'
            },
            deleteAll() {
                console.log('deleteall called')
                localforage.keys().then(function(keys) {
                    console.log(keys)
                    for(key in keys) {
                        var key = keys[key]
                        if(key.indexOf('__') != 0) {
                            console.log('removing ' + key)
                            localforage.removeItem(key)
                        }
                    }
                })
            }
        },
        computed: {

        }
    })
})