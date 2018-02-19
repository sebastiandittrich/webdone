@extends('frame')

@section('header')
    <script src="{{asset('js/other.js')}}"></script>
@endsection

@section('page')

    <div class="sticky menu">
        <div class="text header">
            <a href="/"><i class="mi mi-arrowhtmllegacy"></i></a>
            Einstellungen
        </div>
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
                @component('components.master', ['id' => 'other'])
                    <i class="mi mi-asterisk"></i>
                    <div class="content">
                        <div class="title">Sonstiges</div>
                        <div class="description">Alle Daten löschen und mehr</div>
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
                        <div v-if="account.isLoggedIn">
                            Mein Konto
                        </div>
                        <div v-if="!account.isLoggedIn">
                            Anmelden
                        </div>
                    @endslot

                    <div v-if="account.isLoggedIn">
                        Du bist bei TodoSync als <div class="sub header inline">@{{account.user.name}}</div> angemeldet.<br><br>
                        <div class="red button" @click="logoutClick">Abmelden</div>
                    </div>
                    <div v-if="!account.isLoggedIn">
                        Du kannst dich anmelden, um deine Daten zu synchronisieren.<br><br>
                        <a href="/oauth/authorize?client_id=3&redirect_uri=https://asoziales-netzwerk.net/callback&response_type=code&scope=" class="button">Jetzt anmelden!</a>
                    </div>

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
                @component('components.detail', ['id' => 'other'])
                    @slot('title')
                        Sonstiges
                    @endslot
                    
                    <div class="sub header">Alle Daten löschen</div>
                    Du kannst alle lokal gespeicherten Daten löschen. Das wird dich auch bei TodoSync abmelden.<br><br>
                    <div @click="deleteAllClick" class="button">Alle Daten löschen</div>

                @endcomponent
            </div>
        </div>
    </div>
@endsection