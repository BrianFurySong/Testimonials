(function () {
    "use strict";

    angular.module(AppName).component("testimonialManager", {
        bindings: {},
        templateUrl: "/scripts/components/views/testimonialManagerView.html",

        controller: function (requestService, $scope, $window) {
            var vm = this;

            vm.testimonialList = [];//empty array that i shove all the items into so i can show
            vm.testimonialName = {};
            vm.apiUrl = "";
            vm.putModel = {};

            vm.$onInit = _init;
            vm.showTestimonialList = _showTestimonialList;
            vm.testAction = _testAction;

            function _init() { //sets the ng-show hide buttons on init so when it lands on the getAllNotApporved page u get to see the approve button
                vm.deleteBtn = true; //the page always lands on the GetAllNotApproved page
                vm.rejectBtn = false;
                vm.archiveBtn = true;
                vm.approveBtn = true;
                requestService.ApiRequestService("get", "\/api/Testimonials/GetAllNotApproved")
                    .then(function (response) {
                        vm.testimonialList = [];
                        vm.testimonialName = "New Testimonials";
                        vm.testimonialList = response.items;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }

            function _showTestimonialList(testName) { //shows on click, calls a get button depending on what is passed into the ng-click
                switch (testName) {
                    case "new": //if 'new' is passed then it sets all these vm's breaks and then goes into a SWAL then an api call
                        vm.apiUrl = "/api/Testimonials/GetAllNotApproved";
                        vm.testimonialName = "New Testimonials";
                        vm.deleteBtn = true;
                        vm.rejectBtn = false;
                        vm.archiveBtn = true;
                        vm.approveBtn = true;
                        break;
                    case "approved":
                        vm.apiUrl = "/api/Testimonials/GetAllEveryApproved";
                        vm.testimonialName = "Approved Testimonials";
                        vm.deleteBtn = true;
                        vm.rejectBtn = true;
                        vm.archiveBtn = false;
                        vm.approveBtn = false;
                        break;
                    case "archived":
                        vm.apiUrl = "/api/Testimonials/GetAllArchived";
                        vm.testimonialName = "Archived Testimonials";
                        vm.deleteBtn = true;
                        vm.rejectBtn = false;
                        vm.archiveBtn = true;
                        vm.approveBtn = true;
                        break;
                    case "rejected":
                        vm.apiUrl = "/api/Testimonials/GetAllRejected";
                        vm.testimonialName = "Rejected Testimonials";
                        vm.deleteBtn = false;
                        vm.rejectBtn = true;
                        vm.archiveBtn = true;
                        vm.approveBtn = false;
                        break;
                }
                requestService.ApiRequestService("GET", vm.apiUrl) //this just gets
                    .then(function (response) {
                        vm.testimonialList = response.items;

                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }

            function _testAction(testName, item) { //this is the action button that either approves, archives, rejects or deletes
                if (testName === "approve") {
                    vm.putModel.id = item.id;
                    vm.putModel.isApproved = true;
                    vm.putModel.isArchived = false;
                    vm.putModel.isRejected = false;
                }
                if (testName === "archive") {
                    vm.putModel.id = item.id;
                    vm.putModel.isApproved = false;
                    vm.putModel.isArchived = true;
                    vm.putModel.isRejected = false;
                }
                if (testName === "reject") {
                    vm.putModel.id = item.id;
                    vm.putModel.isApproved = false;
                    vm.putModel.isArchived = false;
                    vm.putModel.isRejected = true;
                }
                if (testName === "delete") {
                    swal({
                        title: "Are you sure you want to delete this Testimonial?",
                        type: "error",
                        showCancelButton: true,
                        confirmButtonColor: "#FF0000",
                        confirmButtonText: "Okay",
                        closeOnCancel: true,
                        closeOnConfirm: true
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                vm.putModel.id = item.id
                                requestService.ApiRequestService("DELETE", "\/api/Testimonials/" + vm.putModel.id)
                                    .then(function (response) {
                                        _init();
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        });
                    return;
                }

                swal({
                    title: "Are you sure you want to make changes to this Testimonial?",
                    type: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#1ab394",
                    confirmButtonText: "Okay",
                    closeOnCancel: true,
                    closeOnConfirm: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            requestService.ApiRequestService("PUT", "\/api/Testimonials/" + vm.putModel.id, vm.putModel)
                                .then(function (response) {
                                    _init();
                                })
                                .catch(function (err) {
                                    console.log(err);
                                });
                        }
                    });
            }
        }
    });
})();
