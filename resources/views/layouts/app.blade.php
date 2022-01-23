<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- PWA -->
    <!-- Primary Meta Tags -->
    <meta name="title" content="FlyPaper - MSFS Wallpapers and Screenshots">
    <meta name="description" content="The best wallpapers and screenshots from MSFS 2020 and other aviation simulators">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://flypaper.theflyingfabio.com/">
    <meta property="og:title" content="FlyPaper - MSFS Wallpapers and Screenshots">
    <meta property="og:description" content="The best wallpapers and screenshots from MSFS 2020 and other aviation simulators">
    <meta property="og:image" content="https://flypaper.theflyingfabio.com/icons/ioc/512.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://flypaper.theflyingfabio.com/">
    <meta property="twitter:title" content="Meta Tags — Preview, Edit and Generate">
    <meta property="twitter:description" content="The best wallpapers and screenshots from MSFS 2020 and other aviation simulators">
    <meta property="twitter:image" content="https://flypaper.theflyingfabio.com/icons/ioc/512.png">

    <title>FlyPaper</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <!-- Styles -->
    <link href="{{ asset('css/app.css') .'?v='. config('app.version') }}" rel="stylesheet">
    <link rel="manifest" href="{{ url('manifest.json') }}">
</head>

<body>
    <div id="app">
        <main class="py-4">
            @yield('content')
        </main>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') .'?v='. config('app.version') }}" defer></script>
</body>

</html>