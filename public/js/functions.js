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

//Add this below content to your HTML page, or add the js file to your page at the very top to register service worker
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

navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
     registration.unregister()
   } })

accountManager = {
    isLoggedIn: false,
    onchange: undefined,
    onLogin: undefined,
    user: {
        name: null,
        email: null,
    },
    changed: function changed() {
        this.onchange ? this.onchange() : null
    },
    loggedIn() {
        this.onLogin ? this.onLogin() : null
    },
    initialize: function initialize() {
        var self = this
        localforage.getItem('__access_token').then(function(value) {
            if(value != null) {
                $.ajaxSetup({
                    headers: {
                        'Authorization': 'Bearer ' + value,
                        'Accept': 'application/json'
                    }
                })
                $.get('/api/user').done(function(data) {
                    self.isLoggedIn = true
                    self.user.name = data.name
                    self.user.email = data.email
                    self.loggedIn()
                    self.changed()
                })

            } else {
                self.isLoggedIn = false
                self.changed()
            }
        })
    }
}

storageManager = {
    all_tables: [
        'tasks',
        'projects',
        'workspaces'
    ],

    add: function add(table, item, callback = function() {}) {
        var self = this
        if(accountManager.isLoggedIn) {
            $.post('/api/' + table, {item: item}).done(function(data) {
                self.addLocal(table, data, function() {
                    self.pullFromServer(table)
                    callback()
                })
            }).fail(function() {
                self.networkError()
            })
        } else {
            self.addLocal(table, item, callback)
        }
    },
    addLocal: function addLocal(table, item, callback = function() {}) {
        var self = this
        localforage.getItem(table).then(function(value) {
            if(value == null) {
                value = []
            }
            if(!item.id) {
                item.id = self.getFreeId(value)
            }
            value.push(item)
            localforage.setItem(table, value).then(function() {
                self.change()
                callback()
            })
        })
    },
    remove: function remove(table, id, callback = function() {}) {
        var self = this
        if(accountManager.isLoggedIn) {
            $.ajax({
                method: 'DELETE',
                url: '/api/' + table + '/' + id
            }).done(function() {
                self.removeLocal(table, id, function() {
                    self.pullFromServer(table)
                    callback()
                })
            }).fail(function() {
                self.networkError()
            })
        } else {
            self.removeLocal()
        }
    },
    removeLocal: function removeLocal(table, id, callback = function() {}) {
        var self = this
        localforage.getItem(table).then(function(value) {
            if(value == null) {
                value = []
            }
            var element = self.getWithId(value, id)
            element ? value.splice(value.indexOf(element),1) : console.log('Item not found')
            localforage.setItem(table, value).then(function() {
                self.onchange ? self.onchange() : null
                callback()
            })
        })
    },
    update: function update(table, updated, callback = function() {}) {
        var self = this
        if(accountManager.isLoggedIn) {
            $.ajax({
                method: 'PUT',
                url: '/api/' + table + '/' + updated.id,
                data: {
                    item: updated,
                }
            }).done(function() {
                self.updateLocal(table, updated, function() {
                    self.pullFromServer(table)
                    callback()
                })
            }).fail(function() {
                self.networkError()
            })
        } else {
            self.updateLocal()
        }
    },
    updateLocal: function update(table, updated, callback = function() {}) {
        var self = this
        localforage.getItem(table).then(function(value) {
            if(value == null) {
                value = []
            }
            value[value.indexOf(self.getWithId(value, updated.id))] = updated
            localforage.setItem(table, value).then(function() {
                self.onchange ? self.onchange() : null
                callback()
            })
        })
    },
    get: function get(table, id, callback = function() {}) {
        var self = this
        localforage.getItem(table).then(function(value) {
            if(value == null) {
                value = []
            }
            if(typeof(id) == 'function') {
                id(value)
            } else {
                callback(self.getWithId(value, id))
            }
        })  
    },
    pullFromServer: function pullFromServer(table) {
        var self = this
        if(accountManager.isLoggedIn) {
            $.get('/api/' + table).done(function(list) {
                console.log('Pulled ' + table + ' from Server')
                localforage.setItem(table, list).then(function() {
                    self.change()
                })
            }).fail(function() {
                self.networkError()
            })
        } else {
            console.log('Not logged in -> Not pulling anything from server')
        }
    },
    pullAllFromServer: function pullAllFromServer() {
        for(tablename in this.all_tables) {
            this.pullFromServer(this.all_tables[tablename])
        }
    },
    
    // Helper
    getWithId: function filterById(array, id) {
        return array.filter(function(element) { return element.id === id })[0]
    },
    getFreeId: function getFreeId(array) {
        var id = 0
        while(this.getWithId(array, id)) {
            id++
        }
        return id
    },

    // Events
    onchange: undefined,
    onNetworkError: undefined,

    // Event Fire Functions
    networkError: function networkError() {
        this.onNetworkError ? this.onNetworkError() : null
    },
    change: function change() {
        this.onchange ? this.onchange() : null
    },

    cacheIds: [],
    queue: [],

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

accountManager.onLogin = function() {
    storageManager.pullAllFromServer()
}
accountManager.initialize();

localforage.getItem('__initialized').then(function(value) {
    if(value != true) {
        prepareFirstStart()
    }
})

// Task = Backbone.Model.extend()
// Tasks = Backbone.Collection.extend({
//     model: Task,
//     url: '/api/tasks'
// })

// var tasks = new Tasks();
// tasks.fetch()