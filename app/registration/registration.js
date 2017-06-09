rerum.controller('registrationController', function ($scope, RegistrationService) {
    $scope.registrationReturn = {registrationMessage:"Click Submit to Register", agentMessage:"", code:100, agentRegistrationID:"-1"};
    $scope.submitRegistration = function (form) {
        //var promiseData = RegistrationService.registerAgent(form);
        //var hello = "hello";
        var registrationPromise = RegistrationService.registerAgent(form);
        registrationPromise.then(function (promiseData) {
            $scope.registrationReturn.registrationMessage = promiseData.data.info;
            $scope.registrationReturn.code = promiseData.data.code;
            $scope.registrationReturn.agentRegistrationID = promiseData.agentID;
            $scope.registrationReturn.agentMessage = promiseData.agentMessage;
        }, function (err) {
            $scope.registrationReturn.registrationMessage = err.message;
            $scope.registrationReturn = {text: err.message, type: "msg-fail"};
            $scope.registrationReturn.agentRegistrationID = -1;
            $scope.registrationReturn.agentMessage = "Registration Failure!";
        });

      //Basic registration that does not create a user.
//    RegistrationService.register(form)
//        .then(function (promiseData) {
//            $scope.registrationReturn.registrationMessage = promiseData.data.info;
//            $scope.registrationReturn.code = promiseData.data.code;
//        }, function (err) {
//            $scope.registrationMessage = err.message;
//            $scope.registrationReturn = {text: err.message, type: "msg-fail"};
//        });
        
    };
});
    


//Just hits the annotationstore registration in to the accepted server list
rerum.service('RegistrationService', function ($http, $q, Backend_ip, API_Service) {
    
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
    
//Actually create an Agent and return the registration promise data with the, or an error.
    this.registerAgent = function(form){
        var variables = "";
        var registerNewServer = "";
        var deferred = $q.defer();
        var newAgent = {
            "@type" : "foaf:Agent",
            "name" : form.name,
            "_agentIP" : form.ip, //didn't find a proper foaf way to store this...
            "mbox" : form.contact,
            _rerum_alpha : true
        };
        var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!reg.test(form.ip)) { //Bad IP, don't make anything and fail out
           deferred.reject(new Error("Bad IP, cannot create agent " + newAgent));
        }
        variables = "acceptedServer.ip="+form.ip+"&acceptedServer.name="+form.name+"&acceptedServer.contact="+form.contact;
        registerNewServer = "http://"+Backend_ip+'/annotationstore/acceptedServer/saveNewServer.action?'+variables;
        var registrationPromise = $http.post(registerNewServer);
        registrationPromise
            .success(function(data1, status, headers, config){ //Try to register server first, only make Agent for unique IPs
                if(data1.code === 200){
                    var newAgentPromise = API_Service.save(newAgent); //create a new agent
                    newAgentPromise //Need data from this promise to register the new server
                    .success(function(data2, status, headers, config){ //Created successfully
                        var newAgentID = data2["@id"];
                        if(newAgentID){
                           deferred.resolve({"agentID":newAgentID, "agentMessage":"A new Agent has been created for the IP provided.  The Agent ID is "+newAgentID+" ", "data":data1});
                        }
                        else{ //This is very bad.  Fail out
                            deferred.reject(new Error("Could not retrieve new agent @id: " + data));
                        }

                    })
                    .error(function(data, status, headers, config){
                           deferred.reject(new Error("Could not create new agent " + newAgent));
                    });
                }
                else if(data1.code === 406){//duplicate 
                    deferred.resolve({"agentID":"", "agentMessage":"An Agent already exists for this IP.", "data":data1});
                }
                else{//some outright failure
                     deferred.reject(new Error("Could not register server. "));
                }
            })
            .error(function(data, status, headers, config){
                 deferred.reject(new Error("Could not regsiter server " + status));
            });
            return deferred.promise; //Must return the promise outside of the posts
        };
});