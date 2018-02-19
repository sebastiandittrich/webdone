@extends('frame')

@section('header')
    <script src="{{asset('js/migrate.js')}}"></script>
@endsection

@section('page')

    <div class="sticky menu">
        <div class="text header">
            Migration
            <div class="description">Umgang mit bestehenden Daten</div>
        </div>
    </div>

    <div class="cards">
        <div class="highlighted card">
            <div class="sub header">
                Sie haben sich soeben mit einem TodoSync-Konto angemeldet.
            </div>
            Wie wollen sie weiter vorgehen?
        </div>

        <div class="card">
            <div class="sub header">
                Alle offline vorhandenen Daten löschen
            </div>
            Dies ist sinnvoll, wenn sie die Offline-Version vorher nicht benutzt haben. Die lokalen Daten werden mit den Daten von TodoSync überschrieben.<br><br>
            <div class="button" @click="deleteAllClick">
                Daten ersetzen
            </div>
        </div>
    </div>
    
@endsection