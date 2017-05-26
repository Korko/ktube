@extends('layouts.app')

@section('header')
@javascript(['googleClientID' => env('YOUTUBE_KEY'), 'googleApiKey' => env('YOUTUBE_API_KEY')])
@endsection

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    You are logged in!<a v-on:click="handleAuthClick">Test</a>
                </div>
                <span v-if="userStatus">Connected</span><span v-else>Disconnected</span>
            </div>
        </div>
    </div>
</div>
<div>
    <ul>
        <li v-for="video in pageVideos">
            <img :src="video.thumbnail" :title="video.title" /> @{{ video.title }}
        </li>
    </ul>
</div>
@endsection

@section('scripts')
<script src="https://apis.google.com/js/api.js"></script>
@endsection
