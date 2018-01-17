/*
	Example pattern for testing HTTP service dependencies within AngularJS.
	Illustrates GET & PUT, but POST & DELETE would be similar.
*/

describe("some-service",
    function() {

        var service, http;

        beforeEach(function () {
            module("SomeApp");
            });
        });

        beforeEach(inject(function ($q, $injector, _$httpBackend_) {
            service = $injector.get("someService");
            http = _$httpBackend_;
        }));

        afterEach(function () {
            http.flush();
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        function testGet(expectedUrl, action) {
            // set-up the HTTP GET assertion
            http.when("GET", expectedUrl, function () {
                return true;
            }).respond(200, true);
            // now invoke the service action
            action().then(function (response) {
                expect(response).toBeTruthy();
            });
        }

        function testPut(expectedUrl, action) {
            // set-up the HTTP GET assertion
            http.when("PUT", expectedUrl, function (jsonData) {
				// verify the received json object matches the original input
                expect(JSON.parse(jsonData).id).toBe(1);
                return true;
            }).respond(200, true);
            // now invoke the service action
            action().then(function (response) {
                expect(response).toBeTruthy();
            });
        }
		
        describe("when getting an object by id", function () {
            it("then it resolves to expected http action", function() {
                testGet("application/entity/1", function () {
                    return service.getObject(1);
                });
            });
        });

        describe("when getting objects by date", function () {
            it("then it resolves to expected http action", function () {
                testGet("application/object/2018-01-15", function() {
                    return service.getObjects("2018-01-15");
                });
            });
        });

        describe("when updating an object", function() {
            it("then it resolves to expected http action", function() {
                testPut("application/object/", function () {
                    return service.updateObject({id: 1});
                });
            });
        });
    });