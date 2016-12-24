var app = angular.module('twitch', ['ui.bootstrap']);
app.controller('TabsCtrl', function($scope, $http) {
    $scope.tabs = [{
        title: 'All',
        content: 'All Twitchers'
    }, {
        title: 'Online',
        content: 'Online Twitchers'
    }, {
        title: 'Offline',
        content: 'Offline Twitchers'
    }];

    $scope.all = [];
    $scope.online = [];
    $scope.offline = [];

    var url = 'https://wind-bow.gomix.me/twitch-api/';
    var callb = '?callback=JSON_CALLBACK';
    var streamers = [
        "ESL_SC2", "OgamingSC2", "cretetion",
        "freecodecamp", "storbeck", "habathcx",
        "RobotCaleb", "noobs2ninjas","comster404",
    ];


    var isStreaming;
    //Get info for every streamer in stream array
    streamers.forEach(function(name) {
        var dataObj = {};

        $http.jsonp(url + 'streams/' + name + callb).success(function(response) {
            // stream check
              isStreaming = response.stream !== null ? true : false;
            if (isStreaming && response.stream!==undefined) {
                var streamStatus = response.stream.channel.status;
                dataObj.streamTitle = streamStatus;
            } else if(!isStreaming){
                dataObj.streamTitle = "";
            }
        });
        $http.jsonp(url + 'users/' + name + callb).success(function(response) {
            dataObj.name = response.display_name;
            dataObj.logo = response.logo;
            // console.log(('error' in response));
            if(dataObj.name===undefined){
              dataObj.name = name;
              dataObj.logo = "http://placehold.it/400x400/E3F2FD/?text=ERR"
            }

            $scope.all.push(dataObj);
            if (isStreaming) {
              dataObj.status = 'fa fa-check-square';
              dataObj.style='color: green';
                $scope.online.push(dataObj);
            } else {
                $scope.offline.push(dataObj);
                dataObj.status = 'fa fa-warning';
                dataObj.style='color: red';
            }
            $scope.userinfo = $scope.all;
        }).error(function (data, status, headers, config) {
            console.log("ERROR: " + status);
        });
    });

//Detecting which tab is clicked
    $scope.allTabs = function(name) {
            if (name === "All") {
                $scope.userinfo = $scope.all;
            } else if (name === "Online") {
                $scope.userinfo = $scope.online;
            } else {
                $scope.userinfo = $scope.offline;
            }

        }

});
