function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is RedBear Lab's UART service
var redbear = {
    serviceUUID: "713D0000-503E-4C75-BA94-3148F18D941E",
    txCharacteristic: "713D0003-503E-4C75-BA94-3148F18D941E", // transmit is from the phone's perspective
    rxCharacteristic: "713D0002-503E-4C75-BA94-3148F18D941E" // receive is from the phone's perspective
};
jQuery.extend(Sly.defaults, {
    itemNav: 'forceCentered',
    smart: true,
    //activateOn: 'click',
    mouseDragging: 1,
    touchDragging: 1,
    releaseSwing: 1,
    //activatePageOn: 'click',
    elasticBounds: 1,
    //easing: 'easeOutExpo',
    dragHandle: 1,
    dynamicHandle: 1,
    clickBar: 1,
    startPaused: true,
    activateMiddle: false
});


angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $rootScope, $timeout, $q) {
        $rootScope.connectionIndexes = [];
        $rootScope.debugConsole = [];
        $rootScope.fps = 29;
        $rootScope.editExposure = false;
        $rootScope.showExposure = false;
        $rootScope.exposureClockMiliseconds = [0, 0, 0, 0];
    $rootScope.intervalClockMiliseconds = [0,0,0,0];
        $rootScope.exposureClock = {
            stages: [
                {
                    id: "hours",
                    sly:null,
                    elements: new Array(24),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 3600000,
                        speed: 100
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.exposureClockMiliseconds[0] = value*3600000;
                             $rootScope.$broadcast();
                        }
                    }
            },
                {
                    id: "minutes",
                    sly:null,
                    elements: new Array(60),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 60000,
                        speed: 1000
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.exposureClockMiliseconds[1] = value*60000;
                             $rootScope.$broadcast();
                        }
                    }
            },
                {
                    id: "seconds",
                    sly:null,
                    elements: new Array(60),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 1000,
                        speed: 1000
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value*1000);
                            $rootScope.exposureClockMiliseconds[2] = value*1000;
                             $rootScope.$broadcast();
                        }
                    }

            },
                {
                    id: "miliseconds",
                    sly:null,
                    elements: new Array(10),
                    multiplier: 100,
                    divider: '',
                    length: 3,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 100,
                        speed: 100
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.exposureClockMiliseconds[3] = value*100;
                            $rootScope.$broadcast();
                        }
                    }
            }
        ],
            activate: function () {
                for (var i = 0; i < this.stages.length; i++) this.stages[i].sly.toggle();
                $rootScope.$broadcast();
            },
            reset: function () {
                for (var i = 0; i < this.stages.length; i++) {
                    this.stages[i].sly.toggle();
                    this.stages[i].sly.activate(0);
                }
            }
        };
    $rootScope.intervalClock = {
            stages: [
                {
                    id: "hours",
                    sly:null,
                    elements: new Array(24),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 3600000,
                        speed: 100
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.intervalClockMiliseconds[0] = value*3600000;
                             $rootScope.$broadcast();
                        }
                    }
            },
                {
                    id: "minutes",
                    sly:null,
                    elements: new Array(60),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 60000,
                        speed: 1000
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.intervalClockMiliseconds[1] = value*60000;
                             $rootScope.$broadcast();
                        }
                    }
            },
                {
                    id: "seconds",
                    sly:null,
                    elements: new Array(60),
                    multiplier: 1,
                    divider: ':',
                    length: 2,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 1000,
                        speed: 1000
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value*1000);
                            $rootScope.intervalClockMiliseconds[2] = value*1000;
                             $rootScope.$broadcast();
                        }
                    }

            },
                {
                    id: "miliseconds",
                    sly:null,
                    elements: new Array(10),
                    multiplier: 100,
                    divider: '',
                    length: 3,
                    options: {
                        cycleBy: 'items', // Enable automatic cycling by 'items' or 'pages'.
                        cycleInterval: 100,
                        speed: 100
                    },
                    callbacks: {
                        active: function (state, value) {
                            console.log(value);
                            $rootScope.intervalClockMiliseconds[3] = value*100;
                            $rootScope.$broadcast();
                        }
                    }
            }
        ],
            activate: function () {
                for (var i = 0; i < this.stages.length; i++) this.stages[i].sly.toggle();
            },
            reset: function () {
                for (var i = 0; i < this.stages.length; i++) {
                    this.stages[i].sly.toggle();
                    this.stages[i].sly.activate(0);
                    //this.stages[i].options.startAt = 0;
                }
            }
        };
        // $rootScope.exposureClock.activate();
        $rootScope.Device = function (inputDevice) {
            var self = this;
            self.connected = false;
            self.busy = false;
            self.message = "";
            self.name = inputDevice.name;
            self.id = inputDevice.id;
            self.rssi = inputDevice.rssi;
            self.characteristics = null;
            self.services = null;
            self.advertising = null;
            self.timeLapseTimeout = null;
            self.exposureTimeout = null;
            self.timeLapseNrOfExposures = 0;
            self.timeLapseCurrentIntervalDuration = 0;
            self.timelapseInterval = 0;
            self.exposureCurrentIntervalDuration = 0;
            self.exposureInterval = 0;
            var waitTimeout = null;
            self.setExposureDuration = function () {
                var hej = $rootScope.exposureClockMiliseconds.reduce(function (a, b) {
                    return a + b;
                }, 0);
                console.log(hej);
                self.exposureInterval = hej;
                $rootScope.editExposure = false;
            };
            self.setIntervalDuration = function () {
                var hej = $rootScope.intervalClockMiliseconds.reduce(function (a, b) {
                    return a + b;
                }, 0);
                console.log(hej);
                self.timelapseInterval = hej;
            };
            self.editExposureDuration = function () {
                console.log("edit of exposure duration");
                $rootScope.editExposure = true;
            };
            self.takePicture = function () {
                $timeout.cancel(waitTimeout);
                var defer = $q.defer();
                if (!self.busy) {
                    waitTimeout = $timeout(function () {
                        self.busy = true;
                        console.log("Taking a Picture");
                        $rootScope.debugConsole.push("Taking a picture");
                        self.sendData("b").then(function () {
                            self.busy = false;
                            defer.resolve();
                        }, function () {
                            self.busy = false;
                            defer.resolve();
                        });

                    }, 200);
                } else {
                    defer.resolve();
                }
                return defer.promise;
            };
            self.takeLongExposurePicture = function () {
                var defer = $q.defer();
                if (!self.busy) {
                    $rootScope.showExposure = true;
                    self.busy = true;
                    $rootScope.exposureClock.activate();
                    self.sendData("o").then(function () {
                        var loop = function () {
                            console.log("initiating long exposure");
                            if (self.exposureCurrentIntervalDuration < self.exposureInterval || !self.exposureInterval) {
                                self.exposureTimeout = $timeout(function () {
                                    self.exposureCurrentIntervalDuration += 100;
                                    $rootScope.debugConsole.push(self.exposureCurrentIntervalDuration);
                                    loop();
                                }, 100);
                            } else {
                                self.endLongExposurePicture().then(function () {
                                    defer.resolve();
                                });

                            };
                        };
                        loop();
                    }, function (error) {
                        self.endLongExposurePicture();
                    });
                } else {
                    defer.resolve();
                }
                return defer.promise;
            };
            self.endLongExposurePicture = function () {
                if (self.exposureCurrentIntervalDuration > 0) {
                    $rootScope.showExposure = false;
                    $timeout.cancel(self.exposureTimeout);
                    return self.sendData("c").then(function () {
                        self.busy = false;
                        $rootScope.exposureClock.reset();
                        self.exposureCurrentIntervalDuration = 0;
                    }, function (error) {
                        self.busy = false;
                        $rootScope.exposureClock.reset();
                        self.exposureCurrentIntervalDuration = 0;
                    });

                }
            };
            self.endTimeLapse = function () {
                $timeout.cancel(self.timeLapseTimeout);
            };
            self.takeTimeLapse = function () {
                if (!self.busy) {
                    self.setIntervalDuration();
                    self.busy = true;
                    $rootScope.intervalClock.reset();
                    $rootScope.exposureClock.reset();
                    var loop = function () {
                        console.log("initiating long exposure");
                        if (self.timeLapseCurrentIntervalDuration > 0) {
                            self.timeLapseTimeout = $timeout(function () {
                                self.timeLapseCurrentIntervalDuration -= 100;
                                $rootScope.debugConsole.push(self.timeLapseCurrentIntervalDuration);
                                loop();
                            }, 100);
                        } else {
                            $rootScope.intervalClock.reset();
                            self.busy = false;
                            if (self.exposureInterval > 0) {
                                self.takeLongExposurePicture().then(function () {
                                    self.busy = true;
                                    self.timeLapseCurrentIntervalDuration = self.timelapseInterval;
                                    self.timeLapseNrOfExposures++;
                                    $rootScope.intervalClock.activate();
                                    loop();
                                });
                            } else {
                                self.takePicture().then(function () {
                                    self.timeLapseCurrentIntervalDuration = self.timelapseInterval;
                                    self.busy = true;
                                    self.timeLapseNrOfExposures++;
                                    $rootScope.intervalClock.activate();
                                    loop();
                                });
                            }
                        }
                    };
                    loop();
                }
            };
            self.sendData = function (input) { // send data to Arduino
                var data = stringToBytes(input);
                var defer = $q.defer();
                $rootScope.debugConsole.push(redbear.serviceUUID);
                $rootScope.debugConsole.push(redbear.txCharacteristic);
                $rootScope.debugConsole.push(bytesToString(data));
                ble.writeWithoutResponse(self.id, redbear.serviceUUID, redbear.txCharacteristic, data, function () {
                    defer.resolve();
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
            self.onData = function (recievedData) {
                var data = bytesToString(recievedData);
                $rootScope.debugConsole.push(data);
            };
            self.onError = function (error) {
                $rootScope.debugConsole.push("DEVICE ERROR (" + error.message + "):");
            };
        };
        $rootScope.devices = {};
        $rootScope.focusDevice = null;
    })
    .controller('TriggerCtrl', function ($scope, $rootScope) {

    })
    .controller('TimeLapseCtrl', function ($scope, $rootScope,$timeout) {
     
    })
    .controller('TimerCtrl', function ($scope, $rootScope) {

    })
    .controller('ConnectCtrl', function ($scope, $rootScope, $ionicActionSheet) {
        $scope.showDeviceOptions = function (uuid) {
            // Show the action sheet
            $scope.connect(uuid);
        };
        $scope.tryingToConnectToUUID = "";
        var foundDevicesCallback = function (device) {
            $rootScope.debugConsole.push(JSON.stringify(device));
            $rootScope.debugConsole.push("device found");
            if ($rootScope.devices.hasOwnProperty(device.id)) {
                $rootScope.debugConsole.push("the device already exists in cache");
                $rootScope.devices.rssi = device.rssi;
            } else {
                $rootScope.devices[device.id] = new $rootScope.Device(device);
                $rootScope.debugConsole.push(JSON.stringify($rootScope.devices[device.id]));
            }
            $scope.$broadcast('scroll.refreshComplete');
        };
        var errorCallback = function (error) {
            $scope.$broadcast('scroll.refreshComplete');
            $rootScope.debugConsole("something whent wrong with the bluetooth thingy.");
            $rootScope.debugConsole(error);
        };
        var connectSuccessCallback = function (data) {
            //update the device object to include exclusive connection data (services, charachteristics and advertising)
            var device = $rootScope.devices[data.id];
            if (!device.connected) {
                $rootScope.debugConsole.push("connected");
                $rootScope.debugConsole.push(data.id);
                device.connected = true;
                device.advertising = data.advertising;
                device.services = data.services;
                device.characteristics = data.characteristics;
                $rootScope.connectionIndexes.push(data.id);

                //Start getting data notifications from BLEShield
                $rootScope.focusDevice = $rootScope.devices[data.id];
                $rootScope.debugConsole.push($rootScope.focusDevice);
                ble.startNotification(data.id, redbear.serviceUUID, redbear.rxCharacteristic, device.onData, device.onError);
            }
        };
        var connectFailureCallback = function (error) {
            $scope.tryingToConnectToUUID = "";
            $rootScope.debugConsole.push("failed to connect");
            $scope.$apply();
        };
        $scope.connect = function (uuid) {
            $scope.tryingToConnectToUUID = uuid;
            $rootScope.debugConsole.push(uuid);
            connectSuccessCallback($rootScope.devices[$scope.tryingToConnectToUUID]);
            try{ble.connect(uuid, connectSuccessCallback, connectFailureCallback);}catch(error){alert(error);}
        };
        $scope.refresh = function () {
            $rootScope.debugConsole.push("starting the scan");
            foundDevicesCallback({
                id: "BD922605-1B07-4D55-8D09-B66653E51BBA",
                name: "BLEShiledFake",
                rssi: -57
            });
            try{ble.scan([], 5, foundDevicesCallback, errorCallback);}catch(error){alert(error);}
        };
        $scope.refresh();
    })
    .controller('DebugCtrl', function ($scope) {
        /*refreshDeviceList = function () {
            deviceList.innerHTML = ''; // empties the list
            if (cordova.platformId === 'android') { // Android filtering is broken
                ble.scan([], 5, app.onDiscoverDevice, app.onError);
            } else {
                ble.scan([redbear.serviceUUID], 5, app.onDiscoverDevice, app.onError);
            }
        };
        onDiscoverDevice = function (device) {
            var listItem = document.createElement('li'),
                html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

            listItem.dataset.deviceId = device.id;
            listItem.innerHTML = html;
            deviceList.appendChild(listItem);
        };
        connect = function (e) {
            var deviceId = e.target.dataset.deviceId,
                onConnect = function () {
                    // subscribe for incoming data
                    ble.notify(deviceId, redbear.serviceUUID, redbear.rxCharacteristic, app.onData, app.onError);
                    sendButton.dataset.deviceId = deviceId;
                    disconnectButton.dataset.deviceId = deviceId;
                    app.showDetailPage();
                };
            ble.connect(deviceId, onConnect, app.onError);
        };
        onData = function (data) { // data received from Arduino
            console.log(data);
            resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };
        sendData = function (event) { // send data to Arduino
            var success = function () {
                console.log("success");
                resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
                resultDiv.scrollTop = resultDiv.scrollHeight;
            };
            var failure = function () {
                alert("Failed writing data to the redbear hardware");
            };

            var data = stringToBytes(messageInput.value);
            var deviceId = event.target.dataset.deviceId;
            ble.writeWithoutResponse(deviceId, redbear.serviceUUID, redbear.txCharacteristic, data, success, failure);

        };
        disconnect = function (event) {
            var deviceId = event.target.dataset.deviceId;
            ble.disconnect(deviceId, app.showMainPage, app.onError);
        },
        showMainPage = function () {
            mainPage.hidden = false;
            detailPage.hidden = true;
        };
        showDetailPage = function () {
            mainPage.hidden = true;
            detailPage.hidden = false;
        };
        onError = function (reason) {
            alert("ERROR: " + reason); // real apps should use notification.alert
        };*/
    });