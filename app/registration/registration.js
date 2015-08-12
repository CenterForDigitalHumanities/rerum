rerum.controller('registrationController', function ($scope, RegistrationService) {
    $scope.submitRegistration = function (form) {
        RegistrationService.register(form)
            .then(function (data) {
                $scope.msg = {text: data};
            }, function (err) {
                $scope.msg = {text: err.message, type: "msg-fail"};
            });
    };
});

rerum.service('RegistrationService', function ($http, $q) {
    this.register = function (form) {
        var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(form.ip)) {
            return $http.post('acceptedServer/saveNewServer.action',
                {
                    "acceptedServer.name": form.name,
                    "acceptedServer.ip": form.ip,
                    "acceptedServer.contact": form.contact
                }).success(function (data) {
                return JSON.parse(data);
            }).error(function (err) {
                return err;
            });
        } else {
            return $q.reject(new Error("Invalid server IP: " + form.ip));
        }
    };
});