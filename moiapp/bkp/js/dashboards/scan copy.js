$(document).ready(function(){


    var video = document.getElementById('videoElement');
    
       // Get the canvas element for capturing the image
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
    
       // Initialize a counter to keep track of the image to be replaced
       var imageCounter = 1;
    
       // Handle the click event on the capture button
       $('#capture').click(function(){
           
           // Draw the current frame of the video onto the canvas
           canvas.width = video.videoWidth;
           canvas.height = video.videoHeight;
           context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
           // Convert the canvas content to a data URL representing a PNG image
           var imageDataURL = canvas.toDataURL('image/png');
            console.log(imageDataURL)
           // Replace the src attribute of the current image with the captured image
           $('#img' + imageCounter).attr('src', imageDataURL);
           $('#img' + imageCounter).css("height", "80px");
    
           // Increment the counter for the next image
           imageCounter++;
    
           // Reset the counter if it exceeds the maximum image count
           if (imageCounter > 6) {
               imageCounter = 1;
           }
       });
    
    
   
    
       $('#saveFace').click(function(){
        var name = $("#name").val().trim();
        var position = $("#position").val().trim();
        var status = $("#status").val();

        // Validate input values
        if (!name || !position) {
           $("#error_div").text("Please fill in both Name and Position fields.");
            return;
        }
        $("#error_div").text("");






       });
    
    
           // Check if getUserMedia is supported by the browser
           if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
               navigator.mediaDevices.getUserMedia({ video: true })
               .then(function(stream) {
                   var video = document.getElementById('videoElement');
                   video.srcObject = stream;
                   video.play();
               })
               .catch(function(error) {
                   console.error('Error accessing the webcam:', error);
               });
           } else {
               console.error('getUserMedia is not supported by this browser.');
           }
      
    });