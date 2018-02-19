@extends('frame')

@section('header')
    <script>
        var code = '{{$code}}'

        $.post('{{url('/')}}/oauth/token', {
            
                grant_type: 'authorization_code',
                client_id: 3,
                client_secret: 'NH3RctKsXxTBGlCcmVYZylw0V3mwpJw3Ze9rbGnC',
                redirect_uri: '{{url('/')}}/callback',
                code: code,
            
        }).done(function(data) {
            localforage.setItem('__access_token', data.access_token).then(function() {
                window.location.href = '{{url('/')}}/migrate'
            })
        })
    </script>
@endsection