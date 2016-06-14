(function () {
    var app = angular.module('MemberPortalServices');
    app.factory('plupLoadService', ['$rootScope', 'authStatusService',
        function ($rootScope, authStatusService) {


            var serviceBase = $('meta[name="dataServiceBase"]').attr('content');
            var maxFiles = 8;

            var fileId = "";
            var hasFiles = false;
            function getGuid() {  //generates GUID for fileID
                return Math.floor((1 + Math.random(new Date().getTime())) * 0x10000)
                               .toString(16)
                               .substring(1);
            }


            function getfileId() {  //creates a file id with 2 guids

                return getGuid() + getGuid();
            }


            return {
                initializePlupload: function (func) {

                    var fileUploadUrl = serviceBase + "Provider/Portal/ProviderForms/UploadDocuments";
                    $("#plupLoadUploader").pluploadQueue({
                        runtimes: 'html5,html4',
                        url: fileUploadUrl,
                        headers: {
                            Authorization: 'Bearer ' + authStatusService.getStatus().access_token,
                        },
                        chunk_size: '0',
                        max_file_size: '10mb',
                        max_retries: 0,
                        multiple_queues: true,
                        dragdrop: false,
                        prevent_duplicates: true,
                        views: {
                            list: true,
                            thumbs: true,
                            active: 'thumbs'
                        },

                        filters: {
                            mime_types: [
                                { title: "Image files", extensions: "pdf" },
                                { title: "Word files", extensions: "doc,docx" },
                                { title: "Tiff files", extensions: "tiff" },
                                { title: "Jpeg files", extensions: "jpeg" }
                            ]
                        },
                        multipart_params: {
                            name: "",
                            subscriberNumber: "",
                            formName: "",
                            fileId: "",
                            department: ""
                        },
                        init: {
                            FilesAdded: function (up, files) {

                                plupload.each(files, function (file) {
                                    if (up.files.length > maxFiles) {
                                        //alert('You are allowed to add only ' + maxFiles + ' files.');
                                        up.removeFile(file);
                                    }
                                });
                                if (up.files.length >= maxFiles) {
                                    $('#plupLoadUploader_browse').hide('slow');
                                }
                            },
                            FilesRemoved: function (up, files) {
                                if (up.files.length < maxFiles) {
                                    $('#plupLoadUploader_browse').fadeIn('slow');
                                }
                            }
                        }

                    });


                    var uploader = $("#plupLoadUploader").pluploadQueue();
                    uploader.bind('FilesAdded', function () {
                        fileId = getfileId();
                        //$rootScope.$broadcast('plupLoadFilesAdded', uploader.files);
                    });

                    uploader.bind('FilesRemoved', function () {
                        fileId = getfileId();
                        //$rootScope.$broadcast('plupLoadFilesRemoved', uploader.files);
                    });

                    func();
                },
                getHasFiles: function () {
                    var uploader = $("#plupLoadUploader").pluploadQueue();
                    return uploader.files.length;
                },
                submitDocuments: function () {

                    var uploader = $("#plupLoadUploader").pluploadQueue();

                    if (uploader.files.length > 0) {
                        for (var i = 0; i < uploader.files.length; i++) {

                            if (uploader.files[i].status === 1) {
                                hasFiles = true;
                            } else {
                                hasFiles = false;
                                fileId = "";
                            }
                        }
                    }


                    var submitResult = { "HasFiles": hasFiles, "FileId": fileId }
                    uploader.start();
                    return submitResult;
                },
                getPluploadInstance: function () { //return plupload instance in order to bind events to it

                    var uploader = $("#plupLoadUploader").pluploadQueue();
                    return uploader;
                },
                bindOnUploadComplete: function () {
                    var uploader = $("#plupLoadUploader").pluploadQueue();
                    uploader.bind('UploadComplete', function (uploader) {

                        //do something when upload is complete

                    });
                },
                bindFilterObject: function (filterObj) {

                    var uploader = $("#plupLoadUploader").pluploadQueue();

                    uploader.bind('BeforeUpload', function (uploader, file, info) {

                        uploader.settings.multipart_params.name = file.name;
                        uploader.settings.multipart_params.subscriberNumber = filterObj.SubscriberNumber;
                        uploader.settings.multipart_params.formName = filterObj.FormName;
                        uploader.settings.multipart_params.fileId = fileId;
                        uploader.settings.multipart_params.department = filterObj.Department;


                    });



                }

            }


        }]);

})();
