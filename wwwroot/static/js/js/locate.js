var pos = null;
      function locate() {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

        }, function() {
          
        });
      } else {
        // Browser doesn't support Geolocation
        alert('browser doesn\'t support geolocation\nyou need to input your starting location manually');
      }
    }