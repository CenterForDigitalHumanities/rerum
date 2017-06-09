/* 
 * The RERUM api handler.  RERUM methods for interacting with an API blackbox are defined here.
 * If you plan to change the APIs, these methods' pointers must be updated.  This is the only place
 * you need to do this, all CRUD operations run via these methods throughout the site. 
 * 
 * Each of these should return HTTP posts and/or HTTP codes since they all route through HTTP calls. 
 * 
 * @author bhaberbe
 */


rerum.service("API_Service", function($http, $q, rerumService, validationService, API_Path, API_Key){
        //This works as save/create and update
        this.save = function(obj) {
            // for alpha, automatically add a flag for anything coming in from rerum
            obj._rerum_alpha = true;
            var isRerum = validationService.validateRerumManifest(obj); //Does the @id tell us it is in rerum?
            var updating = false;
            var url = "";
            if(obj['@id']){ //Is it an object for updating
                updating = true;
            }
            if(isRerum && updating){ //It is a RERUM object for updating
                url = API_Path+"updateAnnotation.action?content=";
            }
            else if(!updating){ //It is an object meant to be saved
                url = API_Path+"saveNewAnnotation.action?content=";
            }
            var obj_str = JSON.stringify(obj); //Serialize JSON data into a string.
            url += obj_str;
            if(!isRerum && updating){ //It is an update on an foreign manifest.  It can't get over Trump's wall.
                var conf=confirm("The manifest you are trying to update does not appear to be in RERUM.  The update cannot be performed. \n Would you like to save this manifest into RERUM?");
                if(conf){
                    delete obj['@id']; //get rid of key:val, we do not want to preserve it.
                    obj_str = JSON.stringify(obj);
                    url = API_Path+"saveNewAnnotation.action?content=" + obj_str; //It is now a domestic manifest
                }
                else{
                    $q.reject(new Error("User cancelled action"));
                }
            }
            return $http.post(url);
        };
        
        this.getObjectByID = function(obj_id){
            var paramObj = {"@id":obj_id};
            if(!validationService.validateJSON(paramObj)){
               $q.reject(new Error("failed json validation"));
            }
            var parameters = JSON.stringify(paramObj);
            var url = API_Path+"getAnnotationByProperties.action?content="+parameters;
            if(obj_id){
                return $http.post(url);
            }
            else{
               $q.reject(new Error("Bad Object ID"));
            }
        };
        
        this.deleteObjectByID = function(obj_id){
            var paramObj = {"@id":obj_id};
            if(!validationService.validateJSON(paramObj)){
                return 500;
            }
            var parameters = JSON.stringify(paramObj);
            var url = API_Path+"deleteAnnotationByAtID.action?content="+parameters;
            if(obj_id){
                return $http.post(url);
            }
            else{
                $q.reject(new Error("Bad Object ID"));
            }
        };
        
        //This works as batch create, update, set, unset
        this.batchSave = function(obj_array){
            var paramObj = {"@id":obj_array};
            if(!validationService.validateJSON(paramObj)){
                return 500;
            }
            var parameters = JSON.stringify(obj_array);
            var url = API_Path+"deleteAnnotationByAtID.action?content="+parameters;
            if(obj_array){
                return $http.post(url);
            }
            else{
                return 404;
            }
        };
        
        //This has not been written in any of our APIs yet
        this.batchDelete = function(id_array){
            //TODO!
            return 404;
        };
        
        this.unsetObjectProperty = function(obj, prop_array){
            //The way the newberry annotation store is built, this can be done with the update  
            //When we build the back end into RERUM, we will account for set-unset-update as different things
            return 404;
        };
        
        this.setObjectProperty = function(obj, prop_array){
            //The way the newberry annotation store is built, this can be done with the update  
            //When we build the back end into RERUM, we will account for set-unset-update as different things
            return 404;
        };
        
        //Check a POST or PUT for the valid API key.  Could be in URL or body
        //This could be in validationService
        this.validateAPIKey = function(requestURL, requestBody){
          var keyToCheckFor = API_Key;
          //Check code TODO here
          return 404;
        };
        
        
        
});