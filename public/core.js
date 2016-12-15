var reporteClima = angular.module('reporteClima', []);

reporteClima.controller('mainController',function($scope, $http){
  //$scope.datosCargados = false;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        $scope.datosCargados = true;
        console.log(position);
        $scope.position = position;
        $http.get("/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
          .success(function(data){
              $scope.resultados = data;
              //console.log(data);
              console.log($scope)
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
      });
    });
  }
  //console.log($scope.position);


})
