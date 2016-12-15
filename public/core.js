var reporteClima = angular.module('reporteClima', ['ngGeolocation']);

function mainController($scope, $http, $geolocation){
  $scope.formData = {};
  $geolocation.getCurrentPosition({
    timeout: 60000
  }).then(function(position){
    $http.get("/weather?weather?lat=" + position.latitude + "&lon=" + position.longitude)
      .success(function(data){
        $scope.resultados = data;
        console.log(data);
      })
      .error(function(data){
        console.log('Error: ' + data);
      });
  });

}
