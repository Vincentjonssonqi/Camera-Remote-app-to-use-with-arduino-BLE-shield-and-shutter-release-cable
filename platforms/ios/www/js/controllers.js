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



angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $timeout) {
    //navigator.vibrate(3000);
        $scope.connectionIndexes = [];
        $scope.debugConsole = [];
        var Device = function (inputDevice) {
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
            self.timeLapseCurrentIntervalDuration = 0;
            self.timelapseInterval = 0;
            self.exposureCurrentIntervalDuration = 0;
            self.exposureInterval = 0;
            var waitTimeout = null;
            self.takePicture = function () {
                navigator.vibrate();
                $timeout.cancel(waitTimeout);
                waitTimeout = $timeout(function () {
                    if (!self.busy) {
                        self.busy = true;
                        console.log("Taking a Picture");
                        $scope.debugConsole.push("Taking a picture");
                        self.sendData("b").then(function () {
                            self.busy = false;
                        }, function () {

                        });
                    }
                }, 200);

            };
            self.openCloseShutter = function (open) {

                console.log(!open ? "closing the shutter" : "open the shutter");
                $scope.debugConsole.push(!open ? "closing the shutter" : "open the shutter");
                return self.sendData(open ? "c" : "o").then(function () {

                }, function (error) {
                    $scope.debugConsole.push("something went wrong with the bluetooth communication");
                });
            };

            self.takeLongExposurePicture = function (duration) {
                navigator.vibrate();
                self.busy = true;
                self.openCloseShutter(true).then(function () {

                    var loop = function () {
                        console.log("initiating long exposure");
                        if (self.exposureCurrentIntervalDuration < self.exposureInterval || !duration) {
                            self.exposureTimeout = $timeout(function () {
                                self.exposureCurrentIntervalDuration += 100;
                                $scope.debugConsole.push(self.exposureCurrentIntervalDuration);
                                loop();
                            }, 100);
                        } else {
                            self.endLongExposurePicture();
                        };
                    };
                    loop();
                });

            };
            self.endLongExposurePicture = function () {
                if (self.exposureCurrentIntervalDuration > 0) {
                    $timeout.cancel(self.exposureTimeout);
                    self.openCloseShutter(false).then(function () {
                        self.busy = false;
                        self.exposureCurrentIntervalDuration = 0;
                    });

                }
            };

            self.endTimeLapse = function () {

            };
            self.takeTimeLapse = function (interval, exposureDuration) {
                self.timeLapseTimeout = $timeout(function () {
                    self.takeLongExposurePicture(exposureDuration);
                }, 1000);
            };
            self.sendData = function (input) { // send data to Arduino
                var data = stringToBytes(input);
                return ble.writeWithoutResponse(self.id, redbear.serviceUUID, redbear.txCharacteristic, data);
            };
        };
        $scope.devices = {};
        $scope.focusDevice = null;

    })
    .controller('TriggerCtrl', function ($scope) {

    })
    .controller('TimeLapseCtrl', function ($scope) {

    })
    .controller('TimerCtrl', function ($scope) {

    })
    .controller('ConnectCtrl', function ($scope, $ionicActionSheet) {
        $scope.showDeviceOptions = function (uuid) {
            // Show the action sheet
            var connected = $scope.$parent.devices[uuid].connected;
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {
                        text: connected ? '<b>Choose</b>' : '<b>Pair</b>'
                    }
                ],
                destructiveText: connected ? "Disconnect" : null,
                destructiveButtonClicked: function () {
                    $scope.disconnect(uuid);
                },
                titleText: $scope.$parent.devices[uuid].name,
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (!connected) {
                        $scope.connect(uuid);
                    } else {
                        $scope.$parent.focusDevice = $scope.$parent.devices[uuid];
                    }
                }
            });
        };
        var foundDevicesCallback = function (devices) {
            $scope.$parent.debugConsole.push(JSON.stringify(devices));
            var oldDeviceList = $scope.$parent.devices;
            var newDeviceList = {};
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                var finalDeviceObject = null;
                $scope.$parent.debugConsole.push("device found");
                if (oldDeviceList.hasOwnProperty(device.id)) {
                    $scope.$parent.debugConsole.push("the device already exists in cache");
                    oldDeviceList[device.id].rssi = devices[i].rssi;
                    finalDeviceObject = oldDeviceList[device.id];
                } else {
                    finalDeviceObject = new Device(device);
                }
                newDeviceList[device.id] = finalDeviceObject;
            }
            $scope.$parent.devices = newDeviceList;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
        var errorCallback = function () {
            $scope.$broadcast('scroll.refreshComplete');
            alert("something whent wrong with the bluetooth thingy.");
        };
        var connectSuccessCallback = function (data) {
            //update the device object to include exclusive connection data (services, charachteristics and advertising)
            $scope.$parent.devices[data.id].connected = true;
            $scope.$parent.devices[data.id].advertising = data.advertising;
            $scope.$parent.devices[data.id].services = data.services;
            $scope.$parent.devices[data.id].characteristics = data.characteristics;
            //Start getting data notifications from BLEShield
            ble.startNotification(data.id, redbear.serviceUUID, redbear.rxCharacteristic, $scope.$parent.devices[data.id].onData, $scope.$parent.devices[data.id].onError);
            $scope.$apply();
        };
        connectFailureCallback = function () {
            alert("failed to connect");
        };
        $scope.connect = function (uuid) {
            $scope.$parent.debugConsole(uuid);
            ble.connect(uuid, connectSuccessCallback, connectFailureCallback);
        };
        $scope.refresh = function () {
            $scope.$parent.debugConsole.push("starting the scan");
            ble.scan([], 5, foundDevicesCallback, errorCallback);
        };
        // $scope.refresh();
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