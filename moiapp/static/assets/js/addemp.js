$(document).ready(function(){
    

    var video = document.getElementById('videoElement');
    
       // Get the canvas element for capturing the image
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
    
       // Initialize a counter to keep track of the image to be replaced
       var capturedImages = [false, false, false, false, false, false];

       $('#capture').click(function() {
           // Draw the current frame of the video onto the canvas
           canvas.width = video.videoWidth;
           canvas.height = video.videoHeight;
           context.drawImage(video, 0, 0, canvas.width, canvas.height);
   
           // Convert the canvas content to a data URL representing a PNG image
           var imageDataURL = canvas.toDataURL('image/png');
   
           // Find the first uncaptured image
           var index = capturedImages.indexOf(false);
   
           if (index !== -1) {
               // Replace the src attribute of the current image with the captured image
               $('#img' + (index + 1)).attr('src', imageDataURL);
            //    $('#img' + (index + 1)).css("height", "90%");
   
               // Mark the image as captured
               capturedImages[index] = true;
           } else {
               // All images have been captured
            //    alert("All images have been captured.");
           }
       });
    
   
    

       $("#saveFace").click(function() {
      

    
      
                var name = $("#name").val().trim();
                var position = $("#position").val().trim();
                var status = $("#status").val();

                // Validate input values
                if (!name) {
                    $("#error_div").text("Please fill  Name field");
                    return;
                }
                if (!position) {
                    $("#error_div").text("Please fill in  Position field");
                    return;
                }

                if (capturedImages.includes(false)) {
                    $("#error_div").text("Please capture all images before saving");
                    return;
                }

                $("#error_div").text("")
                // Get image sources
                var img1Src = $("#img1").attr("src");
                var img2Src = $("#img2").attr("src");
                var img3Src = $("#img3").attr("src");
                var img4Src = $("#img4").attr("src");
                var img5Src = $("#img5").attr("src");
                var img6Src = $("#img6").attr("src");

                // Convert image sources to base64
                var img1Base64 = getBase64Image(img1Src);
                var img2Base64 = getBase64Image(img2Src);
                var img3Base64 = getBase64Image(img3Src);
                var img4Base64 = getBase64Image(img4Src);
                var img5Base64 = getBase64Image(img5Src);
                var img6Base64 = getBase64Image(img6Src);
                $("#loaderrow").removeClass("d-none")
                const jsonData = JSON.stringify({
                    name: name,
                    images: [img1Base64, img2Base64, img3Base64,img4Base64, img5Base64, img6Base64],
                    position: position,
                    status: status
                });
                $(this).find('i').hide();
                $("#submitText").text('');
               
                $('#spinner').removeClass('d-none');
                // Proceed with sending data if all fields are filled
                fetch('http://192.168.100.110:3005/new_face', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonData,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                   
                    console.log('Response:', data);
                    $(this).find('i').show();
                    $("#submitText").text('Submit');                   
                    $('#spinner').addClass('d-none');
                    resetImagesAndFields();
                    saveEmp();
                    $('#spinner').addClass('d-none');
                    $('#spinner').addClass('d-none');
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle error
                });



    });

    function saveEmp(){
        var name = $("#name").val().trim().replace(/\s+/g, "_");
       
        var img1Src = $("#img2").attr("src");
        var img1Base64 = getBase64Image(img1Src);
        var csrftoken = getCookie('csrftoken');
        
        $.ajax({
            type: "POST",
            url: "/save_emp_image/", 
            headers: {"X-CSRFToken": csrftoken},
            data: {
                'name':name,
                'img_data': img1Base64
            },
            success: function(response) {
                console.log("Image saved successfully",response);
            },
            error: function(xhr, status, error) {
                console.error("Error saving image:", error);
            }
        });
    }
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    $("#resetImgs").click(function() {

        resetImagesAndFields();

    });
    
    function resetImagesAndFields() {
        capturedImages = [false, false, false, false, false, false];
        // Reset image sources
        for (var i = 1; i <= 6; i++) {
            console.log("user-" + i + ".png")
            $("#img" + i).attr("src", "../static/assets/images/moi/user-" + i + ".png");
            $("#img" + i).css("height", ""); // Reset image height
        }
    
        // Reset input fields
        $("#name").val("");
        $("#position").val("");
        $("#status").val("white"); // Assuming default value is "white"
    }

    // Function to convert image source to base64
    function getBase64Image(imgSrc) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = imgSrc;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpeg");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    
    
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