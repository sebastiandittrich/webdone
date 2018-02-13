<html>
    <head>
        <link rel="stylesheet" href="{{asset('css/style.css')}}">
        <link rel="stylesheet" href="{{asset('css/micon/dist/micon/css/micon.min.css')}}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta charset="utf-8">
        <script src="{{asset('js/localforage.min.js')}}"></script>
        <script src="{{asset('js/hammer.min.js')}}"></script>
        <script src="{{asset('js/jquery.js')}}"></script>
        <script src="{{asset('js/underscore.min.js')}}"></script>
        <script src="{{asset('js/backbone.min.js')}}"></script>
        <script src="{{asset('js/vue.js')}}"></script>
        <script src="{{asset('js/functions.js')}}"></script>
        <title>WebDone - Todo PWA</title>
        <link rel="manifest" href="/manifest.json">
        @yield('header')
        <script src="{{asset('js/events.js')}}"></script>
    </head>
    <body>
        <div id="app">
            @yield('page')
        </div>
    </body>
</html>