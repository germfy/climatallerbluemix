var reporteSentimiento = angular.module('reporteSentimiento', []);

function mainController($scope,$http){
  $scope.formData = {};
  $http.get("/generareporte?reporte=SentimentAnalisys&estado=CDMX")
    .success(function(data){
      $scope.resultados = data;
      console.log(data);
    })
    .error(function(data){
      console.log('Error: ' + data);
    });
}
