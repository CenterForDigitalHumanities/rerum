/* 
 * Modular Validation Black Box
 * @author: Bryan Haberberger (bhaberbe)
 */
rerum.controller('validationController', function ($scope, rerumService, validationService) {
    $scope.showImage = false;
    $scope.showJSON = false;
    $scope.showIIIF = false;
    $scope.showRerum = false;
    $scope.showXML = false;
    $scope.showTEI = false;
    $scope.showMEI = false;
    $scope.showChoices = true;
    $scope.imageFileType = "";
    
    $scope.validImage = false;
    $scope.validJSON = false;
    $scope.validIIIF = false;
    $scope.validIIIFImage = false;
    $scope.validXML = false;
    $scope.validTEI = false;
    $scope.validMEI = false;
    $scope.validRerum = false;
    
    $scope.IMAGEURI = "";
    $scope.IIIFURI = "";
    $scope.IIIFIMAGEURI = "";
    $scope.JSONURI = "";
    $scope.RERUMURI = "";
    $scope.JSONOBJECT = {};
    $scope.IIIFOBJECT = {};
    $scope.RERUMOBJECT = {};
    $scope.XMLTEXT = "";
    $scope.MEITEXT = "";
    $scope.TEITEXT = "";
    
    $scope.RERUMMessage = "";
    $scope.JSONMessage = "";
    $scope.IIIFMessage = "";
    $scope.XMLMessage = "";
    $scope.TEIMessage = "";
    $scope.MEIMessage = "";
    $scope.imageFileMessage = "";
    
    /* Validation functions, scope to rerum services*/
    $scope.validateIIIF = function(){
        //hit the IIIF validator endpoint and return that result. Validator only supports URIs
        var input = $scope.IIIFURI;
        var IIIFpromise = validationService.validateIIIF(input);
        IIIFpromise
        .success(function(data, status, headers, config) {
//                data is JSON to parse for feedback
//                {
//                    "url": "<SUBMITTED URL>",
//                    "error": "<ERROR MESSAGE>",
//                    "okay": 1,
//                    "warnings": []
//                }
                    if(data.warnings.length === 0){
                        data.warnings = ["none"];
                    }
                    if(data.okay){
                        $scope.validIIIF = true;
                        $scope.IIIFMessage="This has passed IIIF Presentation API Validation.\n \n\
                        Warnings: \n\
                        "+data.warnings;
                    }
                    else{
                        $scope.validIIIF =  false;
                        $scope.IIIFMessage="This has failed IIIF Presentation API Validation.\n \n\
                        Error: \n\
                        "+data.error+"\nWarnings:\n"+data.warnings;
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.validIIIF =  false;
                    $scope.IIIFMessage="Error validating, could not connect.  \n\
                    Status:"+status;
                });
            return $scope.validIIIF;
    };
    $scope.validateRerumManifest = function(input){
        if(input){
            //This was a file upload
            $scope.validRerum = validationService.validateRerumManifest(input);
            if($scope.validRerum){
                $scope.RERUMMessage="This file upload has passed RERUM Validation.";
            }
            else{
                $scope.RERUMMessage="This file upload has failed RERUM Validation.";
            }
            return $scope.validJSON;
        }
        else{ //It is a URI or string from a textarea
            input = $scope.RERUMURI;
            if($scope.validateURI(input)){ //URI string.  resolve and test
                var resolvedObjPromise = $scope.resolveURI(input);
                resolvedObjPromise
                .success(function(data, status, headers, config) {
                    $scope.validRerum = validationService.validateRerumManifest(data);
                    if($scope.validRerum){
                        $scope.RERUMMessage="This has passed RERUM Validation.";
                    }
                    else{
                        $scope.RERUMMessage="This has failed RERUM Validation.";
                    }
                    return $scope.validRerum;
                })
                .error(function(data, status, headers, config) {
                    $scope.validRerum = false;
                    $scope.RERUMMessage="Could not resolve URL.  Canno perform RERUM validation.";
                    return $scope.validRerum;
                });
            }
            else{ //string object
                $scope.validRerum = validationService.validateRerumManifest(input);
                if($scope.validRerum){
                    $scope.RERUMMessage="This has passed RERUM Validation.";
                }
                else{
                    $scope.RERUMMessage="This has failed RERUM Validation.";
                }
                return $scope.validRerum;
            }
        }
    };
    $scope.validateJSON = function(input){
        if(input){
            //This was a file upload
            $scope.validJSON = validationService.validateJSON(input);
            if($scope.validJSON){
                    $scope.JSONMessage="This file upload passed JSON Validation.";
                }
                else{
                    $scope.JSONMessage="This file upload has failed JSON Validation.";
                }
            return $scope.validJSON;
        }
        else{ //It is a URI or string from a textarea
            input = $scope.JSONURI;
            if($scope.validateURI(input)){ //URI string.  resolve and test
                var resolvedObj = $scope.resolveURI(input);
                resolvedObj
                    .success(function(data, status, headers, config) {
                        $scope.validJSON = validationService.validateJSON(resolvedObj);
                        if($scope.validJSON){
                            $scope.JSONMessage="This has passed JSON Validation.";
                        }
                        else{
                            $scope.JSONMessage="This has failed JSON Validation.";
                        }
                        return $scope.validJSON;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.JSONMessage="Could not resolve the URI, cannot validate as JSON.  \nStatus: \n\
                        "+status;
                        return false;
                    });
            }
            else{ //string object
                $scope.validJSON = validationService.validateJSON(input);
                if($scope.validJSON){
                    $scope.JSONMessage="This has passed JSON Validation.";
                }
                else{
                    $scope.JSONMessage="This has failed JSON Validation.";
                }
                return $scope.validJSON;
            }
        }
    };
    
    $scope.validateImage = function(){
        var input=$scope.IMAGEURI;
        if($scope.validateURI(input)){
            var getPromise = validationService.validateImage(input);
            getPromise
            .success(function(data, status, headers, config) {
                $scope.imageFileMessage = "Image resolution successful.";
                $scope.validImage = true;
                return $scope.validImage;
                //+headers()['Content-Type'];
            })
            .error(function(data, status, headers, config) {
                if(status === -1){
                    status = "Could not resolve the image.  \nCORS blocked the request!";
                }
                $scope.imageFileMessage = "Could not resolve image.  \nStatus: "+status;
                $scope.validImage = false;
                return $scope.validImage;
            });
        }
        else{
            $scope.imageFileMessage = "Could not resolve image.  \nStatus: The URI was invalid.";
            $scope.validImage = false;
            return $scope.validImage;
        }      
    };
    
    $scope.validateURI = function(input){
        $scope.validURI = validationService.validateURI(input);
        return $scope.validURI;
    };
    
    //TODO, these are not built out quite yet.
    $scope.validateXML = function(input){
        if(input){
            //This was a file upload
            $scope.validXML = validationService.validateXML(input);
            if($scope.validXML){
                $scope.XMLMessage="This file upload has passed XML Validation.";
            }
            else{
                $scope.XMLMessage="This file upload has failed XML Validation.";
            }
        }
        else{ //It is a URI or string from a textarea
            input = $scope.XMLTEXT;
            $scope.validXML = validationService.validateXML(input);
            if($scope.validXML){
                $scope.XMLMessage="This has passed XML Validation.";
            }
            else{
                $scope.XMLMessage="This has failed XML Validation.";
            }
        }
        return $scope.validXML;
    };
    $scope.validateTEI = function(input){
       if(input){
            //This was a file upload
            $scope.validTEI = validationService.validateTEI(input);
            if($scope.validTEI){
                $scope.TEIMessage="This file upload has passed TEI Validation.";
            }
            else{
                $scope.TEIMessage="This file upload has failed TEI Validation.";
            }
        }
        else{ //It is a URI or string from a textarea
            input = $scope.TEITEXT;
            $scope.validTEI = validationService.validateTEI(input);
            if(input){
                //This was a file upload
                if($scope.validTEI){
                    $scope.TEIMessage="This has passed TEI Validation.";
                }
                else{
                    $scope.TEIMessage="This has failed TEI Validation.";
                }
            }
        }
        return $scope.validTEI;
    };
    $scope.validateMEI = function(input){
       if(input){
            //This was a file upload
            $scope.validMEI = validationService.validateMEI(input);
            if($scope.validMEI){
                $scope.MEIMessage="This file upload has passed MEI Validation.";
            }
            else{
                $scope.MEIMessage="This file upload has failed MEI Validation.";
            }
        }
        else{ //It is a URI or string from a textarea
            input = $scope.MEITEXT;
            $scope.validMEI = validationService.validateMEI(input);
            if($scope.validMEI){
                $scope.MEIMessage="This has passed MEI Validation.";
            }
            else{
                $scope.MEIMessage="This has failed MEI Validation.";
            }
        }
        return $scope.validMEI;
    };
    
    $scope.resolveURI = function(input){
        return rerumService.resolveURI(input);
    };
    
    
    /* Hide/show sections */
    
    $scope.sectionToggle = function(){
        $scope.showImage = false;
        $scope.showJSON = false;
        $scope.showIIIF = false;
        $scope.showRerum = false;
        $scope.showXML = false;
        $scope.showTEI = false;
        $scope.showMEI = false;
        
//        $scope.RERUMMessage = "";
//        $scope.JSONMessage = "";
//        $scope.IIIFMessage = "";
//        $scope.XMLMessage = "";
//        $scope.TEIMessage = "";
//        $scope.MEIMessage = "";
//        $scope.imageFileMessage = "";
    };
    $scope.showRERUMSection = function(){
        $scope.sectionToggle();
        $scope.showRerum = true;
    };
//    $scope.hideRERUMSection = function(){
//        $scope.sectionToggle();
//        $scope.showRerum = false;
//    };
    $scope.showImageSection = function(){
        $scope.sectionToggle();
        $scope.showImage = true;
     };
//    $scope.hideImageSection = function(){
//        $scope.sectionToggle();
//        $scope.showImage = false;
//    };
    $scope.showJSONSection = function(){
        $scope.sectionToggle();
       $scope.showJSON = true;
     };
//    $scope.hideJSONSection = function(){
//        $scope.sectionToggle();
//        $scope.hideJSONshowJSON = false;
//    };
    $scope.showIIIFSection = function(){
        $scope.sectionToggle();
       $scope.showIIIF = true;
     };
//    $scope.hideIIIFSection = function(){
//        $scope.sectionToggle();
//        $scope.showIIIF = false;
//    };
    $scope.showXMLSection = function(){
        $scope.sectionToggle();
       $scope.showXML = true;
     };
//    $scope.hideXMLSection = function(){
//        $scope.sectionToggle();
//        $scope.showXML = false;
//    };
    $scope.showTEISection = function(){
        $scope.sectionToggle();
        $scope.showTEI = true;
     };
//    $scope.hideTEISection = function(){
//        $scope.sectionToggle();
//        $scope.showTEI = false;
//    };
    $scope.showMEISection = function(){
        $scope.sectionToggle();
       $scope.showMEI = true;
     };
//    $scope.hideMEISection = function(){
//        $scope.sectionToggle();
//        $scope.showMEI = false;
//    };
    
});

rerum.service("validationService", function($http, $q){
     /* Various Validators */
        //Offer IIIF Image API validation here http://iiif.io/api/image/validator/  ?
        
        this.validateJSON = function(input){
            if(typeof input ===  "string"){
                input = input.trim();
                try{
                    input = JSON.parse(input);
                    return true;
                }
                catch(e){
                    return false;
                }
            }
            else if (typeof input === "object"){
                if(input.constructor === {}.contructor){
                    return true;
                }
                else{
                    return false;
                }
            }
        };

        this.validateURI = function(input){
            input = input.trim();
            if(input.substring(0,4) === "http"){
                return true;
            }
            else{
                return false;
            }
        };
        
        //Attempt to resolve the image for validation
         this.validateImage = function(input){
            if (typeof input === "string" && !this.validateURI(input)) {
                return input + " does not appear to be a valid URI";
                //throw Error(input + " does not appear to be a valid URI");
            }
            
            if(typeof input === "string"){
                return $http.get(input);
                
            }
            //What about file upload
            else{
                return "Unknown data type.  Could not resolve image.";
            }
        };
        
        this.validateIIIF = function(input){
            //Hit the IIIF validation API
            var url = "";
            if(typeof input === "string" && this.validateURI(input)){
                url = "http://iiif.io/api/presentation/validator/service/validate?version=2.0&url="+input;
            }
            else{
                if(input["@id"]){
                     url = "http://iiif.io/api/presentation/validator/service/validate?version=2.0&url="+input["@id"];
                }
            }
            if(this.validateURI(url)){
                return $http.get(url);
            }
            else{
                return false;
            }
        };
        
        this.validateRerumManifest = function(input){
            //Will always come through as object, but could be a string version of that object.
            var idToCheck = "";
            if(typeof input ===  "string"){ //String object
                input = input.trim();
                try{
                    input = JSON.parse(input);
                    idToCheck = input["@id"] || "";
                }
                catch(e){
                    idToCheck = "";
                }
            }
            else if (typeof input === "object"){
                idToCheck = input["@id"] || "";
            }
            //The goal is to simply check the object @id and see if it matches the RERUM pattern.  This needs to be improved.
            if(idToCheck.indexOf("/annotationstore/annotation/") >-1 || idToCheck.indexOf("rerum.io") > -1){
                return true;
            }
            else{
                return false;
            }
        };
        
        this.validateXML = function(input){
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(input, "text/xml");
            var message = oDOM.documentElement.nodeName === "parsererror" ? false : true;
            return message;
        };
        this.validateTEI = function(input){
            return this.validateXML(input);
        };
        this.validateMEI = function(input){
            return this.validateXML(input);
        };
});

