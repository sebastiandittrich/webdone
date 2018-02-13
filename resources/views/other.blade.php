@extends('frame')

@section('header')
    <script src="{{asset('js/other.js')}}"></script>
@endsection

@section('page')

    <div class="sticky menu">
        <a href="/" class="entry">Do</a>
        <a href="/other" class="active entry">Other</a>
    </div>

    <div class="small popup" :class="{active: !database.initialized}">
        <div class="content">
            <div class="header">Daten werden geladen...</div>
            <div class="description">
                <i style="font-size: 2em;" class="blue mi mi-refresh mi-spin"></i>
            </div>
        </div>
    </div>

    <div class="master-detail">
        <div class="master">
            <div class="items">
                <div class="header">Synchronisierung</div>
                @component('components.master', ['id' => 'account'])
                    <i class="mi mi-contact"></i>
                    <div class="content">
                        <div class="title">Mein Konto</div>
                        <div class="description">Melde dich an oder Verwalte dein Konto</div>
                    </div>
                @endcomponent
                <div class="header">Daten</div>
                @component('components.master', ['id' => 'projects'])
                    <i class="mi mi-treefolderfolder"></i>
                    <div class="content">
                        <div class="title">Projekte</div>
                        <div class="description">Verwalte deine Projekte</div>
                    </div>
                @endcomponent
                @component('components.master', ['id' => 'workspaces'])
                    <i class="mi mi-showallfileslegacy"></i>
                    <div class="content">
                        <div class="title">Bereiche</div>
                        <div class="description">Verwalte deine Bereiche</div>
                    </div>
                @endcomponent
            </div>
        </div>
        <div class="detail">
            <div class="content" :class="{active: masterdetail.id != null}">
                @component('components.detail', ['id' => 'null'])
                    @slot('title')
                        Einstellungen
                    @endslot

                    Tippe auf einen Bereich, um deine Einstellungen zu ändern.

                @endcomponent
                @component('components.detail', ['id' => 'account'])
                    @slot('title')
                        @if (Auth::check())
                            Mein Konto
                        @else
                            Anmelden
                        @endif
                    @endslot

                    @if (Auth::check())
                        Du bist angemeldet!
                    @else
                        Du kannst dich anmelden, um deine Daten zu synchronisieren.<br><br>
                        <a href="/login" class="button">Jetzt anmelden!</a><br><br><br>

                        Du kannst ein neues Konto anlegen und deine Daten auf dem Server sichern<br><br>
                        <a href="/register" class="button">Registrieren</a>
                    @endif

                @endcomponent
                @component('components.detail', ['id' => 'projects'])
                    @slot('title')
                        Projekte
                    @endslot
                    
                    <div class="informations">
                        <div class="information" v-for="project in projects">
                            <div class="mi">@{{projects.indexOf(project) + 1}}</div>
                            @{{project.name}}
                            <div class="description">
                                <i class="mi mi-delete clickable raisable" @click="deleteProjectClick(project.id)"></i>
                            </div>
                        </div>
                    </div>

                    <div class="icon input">
                        <input type="text" placeholder="Neues Projekt eingeben..." v-model="new_project.cache.name" v-on:keyup.enter="addProjectClick">
                        <i class="mi mi-add blue raisable clickable" @click="addProjectClick" :class="{disabled: !elementValid(new_project.cache)}"></i>
                    </div>

                @endcomponent
                @component('components.detail', ['id' => 'workspaces'])
                    @slot('title')
                        Bereiche
                    @endslot
                    
                    <div class="informations">
                        <div class="information" v-for="workspace in workspaces">
                            <div class="mi">@{{workspaces.indexOf(workspace) + 1}}</div>
                            @{{workspace.name}}
                            <div class="description">
                                <i class="mi mi-delete clickable raisable" @click="deleteWorkspaceClick(workspace.id)"></i>
                            </div>
                        </div>
                    </div>

                    <div class="icon input">
                        <input type="text" placeholder="Neuen Bereich eingeben..." v-model="new_workspace.cache.name" v-on:keyup.enter="addWorkspaceClick">
                        <i class="mi mi-add blue raisable clickable" @click="addWorkspaceClick" :class="{disabled: !elementValid(new_workspace.cache)}"></i>
                    </div>

                @endcomponent
            </div>
        </div>
    </div>
@endsection