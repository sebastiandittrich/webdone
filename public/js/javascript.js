$(document).ready(function() {

    app = new Vue({
        el: '#app',
        data: {
            database: {
                initialized: false,
            },
            taskdetail: {
                taskId: null,
                active: false
            },
            taskmoreoptions: {
                taskId: 0,
            },
            value_sets: {
                energies: [
                    'Wenig',
                    'Mittel',
                    'Viel'
                ],
                states: [
                    'Offen',
                    'Erledigt'
                ]
            },
            task_template: {
                title: '',
                description: '',
                workspace: 0,
                energy: 0,
                time: 0,
                project: 0,
                state: 0,
            },
            new_task_cache: {
                title: '',
                description: '',
                workspace: 0,
                energy: 0,
                time: 0,
                project: 0,
                state: 0
            },
            tasks: [],
            projects: [],
            workspaces: [],
        },
        methods: {
            // UI Events
            newTaskClick() {
                fadein('#newtaskpopup')
                $('.global.button.add').addClass('hidden')
            },
            closeNewTaskClick() {
                this.closeNewTask()
            },
            newTaskDoneClick() {
                if(!this.doneButtonActive) {
                    return
                }
                this.addTask(this.new_task_cache)
                this.closeNewTask()
            },
            taskClick(id) {
                this.taskdetail.taskId = id
                this.taskdetail.active = true;
            },
            taskdetailBackClicked() {
                this.closeTaskDetail()
            },
            taskdetailBrowserBackClicked() {
                this.closeTaskDetail()
            },
            taskStateClick(taskId) {
                task = this.task(taskId)
                task.state == 0 ? task.state = 1 : task.state == 1 ? task.state = 0 : null
                this.updateTask(task)
            },
            taskMoreOptionsClick(id) {
                this.showTaskMoreOptions(id)
            },
            closeTaskMoreOptionsClick() {
                this.closeTaskMoreOptions()
            },
            deleteTaskFromMoreOptionsClick() {
                this.deleteTask(this.taskmoreoptions.taskId)
                this.closeTaskMoreOptions()
            },
            backFromPopupClick() {
                this.taskdetailBrowserBackClicked()
                this.closeNewTask()
                this.closeTaskMoreOptionsClick()
            },
            
            // UI Model
            closeNewTask() {
                this.resetTaskCache()
                fadeout('#newtaskpopup')
                $('.global.button.add').removeClass('hidden')
            },
            resetTaskCache() {
                this.new_task_cache = JSON.parse(JSON.stringify(this.task_template))
            },
            closeTaskDetail() {
                this.taskdetail.taskId = null
                this.taskdetail.active = false
            },
            showTaskMoreOptions(id) {
                this.taskmoreoptions.taskId = id
                fadein('#moreoptionspopup')
            },
            closeTaskMoreOptions() {
                fadeout('#moreoptionspopup')
            },

            // Helper functions
            isSelectedTask(id) {
                return this.activeTask != undefined && this.activeTask.id == id
            },
            task(id) {
                return this.tasks.filter(function(element) {return element.id == id})[0]
            },
            getFreeTaskId() {
                id = 0
                while(this.task(id)) {
                    id++
                }
                return id
            },

            // Database Events
            DBChange() {
                var self = this
                storageManager.get('tasks', function(value) {
                    self.tasks = value
                    self.database.initialized = true
                })
                storageManager.get('projects', function(value) {
                    self.projects = value
                })
                storageManager.get('workspaces', function(value) {
                    self.workspaces = value
                })
            },
            
            // Database actions (model)
            addTask(task) {
                if(task.description == '' || task.description == null) {
                    task.description = 'Keine Beschreibung'
                }
                storageManager.add('tasks', task)
            },
            deleteTask(id) {
                storageManager.remove('tasks', id)
            },
            updateTask(task) {
                storageManager.update('tasks', task)
            },
            get(tablename, id) {
               return this[tablename].filter(function(element) {return element.id == id})[0] || {}
            }
        },
        computed: {
            doneButtonActive() {
                if(this.new_task_cache.title != null && this.new_task_cache.title.length > 0) {
                    return true
                } else {
                    return false
                }
            },
            sets() {
                var ret = {}
                for(list in this.value_sets) {
                    if(this.value_sets.hasOwnProperty(list)) {
                        thisret = []
                        var index = 0
                        for(el in this.value_sets[list]) {
                            thisret.push({
                                text: this.value_sets[list][el],
                                index: index
                            })
                            index++
                        }
                        ret[list] = thisret
                    }
                }
                return ret
            },
            activeTask() {
                self = this
                return this.tasks.filter(function(element) { return element.id == self.taskdetail.taskId})[0] || this.task_template
            },
        }
    })

    app.DBChange()
    storageManager.onchange = function() {
        app.DBChange()
    }

    var hammertime = new Hammer(document.getElementsByClassName('detail')[0].getElementsByClassName('content')[0])
    hammertime.on('swiperight', function(ev) {
        app.closeTaskDetail();
    })
})