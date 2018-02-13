@extends('frame')

@section('header')
    <script src="{{asset('js/javascript.js')}}"></script>
@endsection

@section('page')

<div class="sticky menu">
    <a href="/" class="active entry">Do</a>
    <a href="/other" class="entry">Other</a>
</div>

<a href="#popup" class="global button add" @click="newTaskClick"><i class="mi mi-add"></i>Neu</a>
<div class="popup" id="newtaskpopup">
    <div class="content">
        <div class="header">Neue Aufgabe <i @click="closeNewTaskClick" class="mi mi-cancel right"></i></div>
        <div class="description">
            <label for="task_title">Titel</label>
            <input v-model="new_task_cache.title" class="raisable" type="text" id="task_title" name="task_title" placeholder="Titel"><br>
            <label for="task_description">Beschreibung</label>
            <textarea v-model="new_task_cache.description" class="raisable" type="text" id="task_description" name="task_description" placeholder="Beschreibung"></textarea>
            <label for="task_project">Projekt auswählen</label><br>
            <select v-model="new_task_cache.project" id="task_project" class="raisable">
                <option v-for="option in projects" v-bind:value="option.id">
                    @{{option.name}}
                </option>
            </select>
            <label for="task_workspace">Bereich auswählen</label><br>
            <select v-model="new_task_cache.workspace" id="task_workspace" class="raisable">
                <option v-for="option in workspaces" v-bind:value="option.id">
                    @{{option.name}}
                </option>
            </select>
            <label for="task_energy">Aufwand</label><br>
            <select v-model="new_task_cache.energy" id="task_energy" class="raisable">
                <option v-for="option in sets.energies" v-bind:value="option.index">
                    @{{option.text}}
                </option>
            </select>
            <label for="task_time">Dauer in Minuten</label><br>
            <input class="raisable" type="number" id="task_time" value="5" v-model.number="new_task_cache.time">
        </div>
        <div class="actions">
            <div v-bind:class="{'disabled': !doneButtonActive}" class="done button" @click="newTaskDoneClick"><i class="mi mi-accept"></i>Fertig</div>
        </div>
    </div>
</div>

<div class="small popup" id="moreoptionspopup">
    <div class="content">
        <div class="header">Mehr Optionen <i @click="closeTaskMoreOptionsClick" class="mi mi-cancel right"></i></div>
        <div class="description">
            <div class="informations">
                <div class="clickable information" @click="deleteTaskFromMoreOptionsClick">
                    <i class="mi mi-delete red"></i><div class="red value">Löschen</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="master-detail">
    <div class="master">
        <div class="items tasks">
            <a href="#popup" v-for="task in tasks" class="item task" :class="{active: isSelectedTask(task.id)}">
                <i @click="taskStateClick(task.id)" :class="{'mi-circlering': task.state == 0, 'mi-completedsolid': task.state == 1}" class="mi"></i>
                <div class="content" @click="taskClick(task.id)">
                    <div class="title">@{{task.title}}</div>
                    <div class="description">@{{task.description}}</div>
                </div>
                <div class="more-options" @click="taskMoreOptionsClick(task.id)">
                    <i class="mi mi-openinnewwindow"></i>
                </div>
            </a>
        </div>
    </div>
    <div class="detail">
        <div :class="{'active': taskdetail.active}" class="taskdetail content" id="taskdetail">
            <div class="header">
                <i @click="taskdetailBackClicked" id="taskdetailbackbutton" class="mi mi-chevronleftsmlegacy"></i><div class="text">@{{activeTask.title}}</div>
            </div>
            <div class="description">
                @{{activeTask.description}}
            </div>
            <div class="informations">
                <div class="information">
                    <i class="mi mi-checkmark"></i>@{{value_sets.states[activeTask.state]}} <div class="description">Status</div>
                </div>
                <div class="information">
                    <i class="mi mi-showallfileslegacy"></i>@{{get('workspaces', activeTask.workspace).name}} <div class="description">Arbeitsbereich</div>
                </div>
                <div class="information">
                    <i class="mi mi-clocklegacy"></i>@{{activeTask.time}} Minuten <div class="description">Zeitaufwand</div>
                </div>
                <div class="information">
                    <i class="mi mi-battery8"></i>@{{value_sets.energies[activeTask.energy]}} <div class="description">Energie</div>
                </div>
                <div class="information">
                    <i class="mi mi-treefolderfolder"></i>@{{get('projects', activeTask.project).name}} <div class="description">Projekt</div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection