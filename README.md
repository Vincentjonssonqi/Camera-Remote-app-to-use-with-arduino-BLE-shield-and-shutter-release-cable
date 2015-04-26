# CameraRemote-for-multple-Cameras-using-BLEShields
<p>This is an app for phonegap build but it also works with cordova and ionic. To control your camera you will need an arduino and a BLE-shield. It should in theory also work with any bluetooth low energy shield or arduino board. Just make sure to change the board specific charachteristics and serviceUUID</p>
<code>
    // This is the object that needs to be changed if you are using another card.
    var redbear = {
    serviceUUID: "713D0000-503E-4C75-BA94-3148F18D941E",
    txCharacteristic: "713D0003-503E-4C75-BA94-3148F18D941E", // transmit is from the phone's perspective
    rxCharacteristic: "713D0002-503E-4C75-BA94-3148F18D941E" // receive is from the phone's perspective
};</code>

<p><b>Functionality</b></p>
<ul>
  <li>Take a timelapse with a specific interval and exposure duration</li>
  <li>Let your phone act as a remote trigger</li>
  <li>Set a timer for when the photo should be taken (under development)</li>
  <li>Can connect to multple shields and control multple cameras at ones (it is possible but not very intuitive at the moment)</li>
</ul>
<p>Will add more information soon...</p>
