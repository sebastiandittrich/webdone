var app = null

fadein = function(element) {
    $(element).removeClass('out')
    $(element).addClass('active')
    $('body').addClass('popupped')
}

fadeout = function(element) {
    $('body').removeClass('popupped')
    $(element).addClass('out')
    $(element).removeClass('active')
}

//This is the service worker with the Cache-first network

//Add this below content to your HTML page, or add the js file to your page at the very top to register sercie worker
// if (navigator.serviceWorker.controller) {
//     console.log('[PWA Builder] active service worker found, no need to register')
//   } else {
  
//   //Register the ServiceWorker
//     navigator.serviceWorker.register('serviceworker.js', {
//       scope: './'
//     }).then(function(reg) {
//       console.log('Service worker has been registered for scope:'+ reg.scope);
//     });
//   }

storageManager = {
    cacheIds: [],
    queue: [],
    add: function add(table, item, callback = function() {}) {
        var self = this

        this.getFreeId(table, function(id, doneWithId) {
            item.id = id
            localforage.setItem(self.getKey(table, item.id), item).then(function() {
                self.onchange ? self.onchange() : null
                doneWithId()
                callback()
            })
        })
    },
    remove: function remove(table, id, callback = function() {}) {
        var self = this

        localforage.removeItem(this.getKey(table, id)).then(function() {
            self.onchange ? self.onchange() : null
            callback()
        })
    },
    update: function update(table, updated, callback = function() {}) {
        var self = this

        localforage.setItem(this.getKey(table, updated.id), updated).then(function() {
            self.onchange ? self.onchange() : null
            callback()
        })
    },
    get: function get(table, id, callback = function() {}) {
        var self = this

        if(typeof(id) == 'function') {
            localforage.keys().then(function(keys) {
                var keys = keys.filter(function(element) {return element.split('#')[0] == table})
                self.getAll(keys, function(items) {
                    id(items)
                })
            })
        } else {
            localforage.getItem(this.getKey(table, id)).then(function(value) {
                callback(value)
            })
        }

        // localforage.getItem(table + id).then(function(value) {
        //     if(value == null) {
        //         value = []
        //     }
        //     if(typeof(id) == 'function') {
        //         id(value)
        //     } else {
        //         callback(self.getWithId(value, id))
        //     }
        // })  
    },

    addToQueue: function addToQueue(tablename, item) {
        this.queue.push({tablename: tablename, item: item})
    },
    storeQueue: function storeQueue(callback = function() {}) {
        var self = this
        if(this.queue.length > 0) {
            item = this.queue.shift()
            this.add(item.tablename, item.item, function() {
                self.storeQueue(callback)
            })
        } else {
            callback()
        }
    },
    
    // Helper
    getWithId: function filterById(array, id) {
        return array.filter(function(element) { return element.id === id })[0]
    },
    getFreeId: function getFreeId(tablename, callback) {
        var self = this
        this.get(tablename, function(all) {
            var id = 0
            while(self.getWithId(all, id) && self.cacheIds.indexOf(id) < 0) {
                id++
            }
            self.cacheIds.push(id)
            callback(id, function() {
                self.cacheIds.splice(self.cacheIds.indexOf(id), 1)
            })
        })

        // var id = 0
        // while(this.get(tablename)) {
        //     id++
        // }
        // return id
    },
    getKey: function getKey(tablename, id) {
        return tablename + '#' + id
    },
    getAll(keys, callback, items = []) {
        var self = this
        if(keys.length > 0) {
            key = keys.shift()
            localforage.getItem(key).then(function(value) {
                items.push(value)
                self.getAll(keys, callback, items)
            })
        } else {
            callback(items)
        }
    },

    // Events
    onchange: undefined
}

var prepareFirstStart = function() {
    // Add Workspaces
    storageManager.addToQueue('workspaces', {name: 'Ohne Bereich'})
    storageManager.addToQueue('workspaces', {name: 'Arbeit'})
    storageManager.addToQueue('workspaces', {name: 'Zuhause'})

    // Add Projects
    storageManager.addToQueue('projects', {name: 'Ohne Projekt'})
    storageManager.addToQueue('projects', {name: 'Lerne WebDone'})

    // Add Tasks
    storageManager.addToQueue('tasks', {
        title: 'Details',
        description: 'Tippe auf eine Aufgabe, um die Detailansicht zu öffnen.',
        workspace: 0,
        energy: 0,
        time: 0,
        project: 1,
        state: 0,
    })
    storageManager.addToQueue('tasks', {
        title: 'Löschen',
        description: 'Um eine Aufgabe zu löschen, tippe auf die drei Punkte in der Aufgabenansicht und anschließend auf löschen.',
        workspace: 0,
        energy: 0,
        time: 0,
        project: 1,
        state: 0,
    })
    storageManager.addToQueue('tasks', {
        title: 'Erledigen',
        description: 'Um eine Aufgabe zu erledigen, tippe auf den Kreis in der Aufgabenansicht.',
        workspace: 0,
        energy: 0,
        time: 0,
        project: 1,
        state: 0,
    })
    storageManager.addToQueue('tasks', {
        title: 'Neue Aufgabe',
        description: 'Wenn du eine neue Aufgabe erstellen willst, tippe auf den Button mit der Aufschrift "Neu" in der unteren rechten Ecke.',
        workspace: 0,
        energy: 0,
        time: 0,
        project: 1,
        state: 0,
    })

    storageManager.storeQueue(function() {
        localforage.setItem('__initialized', true)
    })
}

localforage.getItem('__initialized').then(function(value) {
    if(value != true) {
        prepareFirstStart()
    }
})

Task = Backbone.Model.extend()
Tasks = Backbone.Collection.extend({
    model: Task,
    url: '/api/tasks'
})

var tasks = new Tasks();
tasks.fetch()