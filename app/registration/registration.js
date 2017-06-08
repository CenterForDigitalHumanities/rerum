rerum.controller('registrationController', function ($scope, RegistrationService) {
    $scope.registrationReturn = {registrationMessage:"Click Submit to Register", code:100};
    $scope.submitRegistration = function (form) {
        RegistrationService.register(form)
            .then(function (promiseData) {
                $scope.registrationReturn.registrationMessage = promiseData.data.info;
                $scope.registrationReturn.code = promiseData.data.code;
            }, function (err) {
                $scope.registrationMessage = err.message;
                $scope.registrationReturn = {text: err.message, type: "msg-fail"};
            });
    };
    
});

rerum.service('RegistrationService', function ($http, $q, Backend_ip) {
    this.register = function (form) {
        var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(form.ip)) {
            var variables = "acceptedServer.ip="+form.ip+"&acceptedServer.name="+form.name+"&acceptedServer.contact="+form.contact;
            var postURL = "http://"+Backend_ip+'/annotationstore/acceptedServer/saveNewServer.action?'+variables;
            return $http.post(postURL);
        } else {
            return $q.reject(new Error("Invalid server IP: " + form.ip));
        }
    };
});