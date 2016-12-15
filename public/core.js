var reporteClima = angular.module('reporteClima', ['ngGeolocation']);

function mainController($scope, $http, $geolocation){
  $scope.formData = {};
  $geolocation.getCurrentPosition({
    timeout: 60000,
    maximumAge: 250,
    enableHighAccuracy: true
  });
  console.log($geolocation.position.coords);
  $http.get("/weather?weather?lat=" + $geolocation.position.coords.latitude + "&lon=" + $geolocation.position.coords.longitude)
      .success(function(data){
        $scope.resultados = data;
        console.log(data);
      })
      .error(function(data){
        console.log('Error: ' + data);
      });

}
