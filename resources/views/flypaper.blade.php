@extends('layouts.app')

@section('content')
<div class="container">
    <div id="flypaper-app" 
        data-base-url="{{URL::to('/')}}" 
        data-user="{{ json_encode($user) }}" 
        data-img-server="{{ $serverless }}"
    ></div>
</div>
@endsection