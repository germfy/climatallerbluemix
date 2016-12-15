var reporteClima = angular.module('reporteClima', ['ngGeolocation']);

function mainController($scope, $http, $geolocation){
  $scope.formData = {};
  $geolocation.watchPosition({
    timeout: 60000,
    maximumAge: 250,
    enableHighAccuracy: true
  });
  console.log($geolocation.position);
  $http.get("/weather?weather?lat=" + $geolocation.position.latitude + "&lon=" + $geolocation.position.longitude)
      .success(function(data){
        $scope.resultados = data;
        console.log(data);
      })
      .error(function(data){
        console.log('Error: ' + data);
      });

}
