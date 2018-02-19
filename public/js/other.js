$(document).ready(function() {
    app = new Vue({
        el: '#app',
        data: {
            account: accountManager,
            database: {
                initialized: false,
            },
            masterdetail: {
                active: false,
                id: null,
            },
            data_model: {
                name: null
            },
            projects: [],
            workspaces: [],
            new_project: {
                plain: {
                    name: null
                },
                cache: {
                    name: null
                }
            },
            new_workspace: {
                plain: {
                    name: null
                },
                cache: {
                    name: null
                }
            }
        },
        methods: {
            // UI Events
            masterClick(id) {
                this.masterdetail.id = id
            },
            backFromPopupClick() {
                this.closeTaskDetail()
            },
            detailBackClick() {
                this.closeTaskDetail()
            },
            addProjectClick() {
                this.addElement('projects', this.new_project.cache)
                this.new_project.cache = JSON.parse(JSON.stringify(this.new_project.plain))
            },
            deleteProjectClick(id) {
                this.deleteElement('projects', id)
            },
            addWorkspaceClick() {
                this.addElement('workspaces', this.new_workspace.cache)
                this.new_workspace.cache = JSON.parse(JSON.stringify(this.new_workspace.plain))
            },
            deleteWorkspaceClick(id) {
                this.deleteElement('workspaces', id)
            },
            deleteAllClick() {
                this.deleteAll();
            },
            logoutClick() {
                this.logoutUser()
            },

            // UI Model
            closeTaskDetail() {
                this.masterdetail.id = null
            },
            elementValid(element) {
                return element.name != null && element.name.length > 0 
            },
            deleteAll() {
                localforage.clear()
            },

            // Database Model
            addElement(tablename, element) {
                if(!this.elementValid(element)) {
                    return false
                }
                storageManager.add(tablename, element)
            },
            deleteElement(tablename, id) {
                storageManager.remove(tablename, id)
            },
            logoutUser() {
                this.deleteAll()
            },

            // Database Events
            DBChange() {
                var self = this
                storageManager.get('projects', function(value) {
                    self.projects = value
                    self.database.initialized = true
                })
                storageManager.get('workspaces', function(value) {
                    self.workspaces = value
                    self.database.initialized = true
                })
            }
        },
        computed: {

        }
    })

    app.DBChange()
    storageManager.on('change', function() {
        app.DBChange()
    })

    var hammertime = new Hammer(document.getElementsByClassName('detail')[0].getElementsByClassName('content')[0])
    hammertime.on('swiperight', function(ev) {
        app.closeTaskDetail();
    })
})