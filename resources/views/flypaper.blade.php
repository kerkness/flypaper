@extends('layouts.app')

@section('content')


<?php dump($user) ?>
<?php dump($token) ?>
<?php dump($serverless) ?>

{{-- <div class="container">
    <div id="flypaper-app" 
        data-base-url="{{URL::to('/')}}" 
        data-user="{{ json_encode($user) }}" 
        data-img-server="{{ $serverless }}"
        data-token="{{ $token }}"
    ></div>
</div> --}}
@endsection