var initialized = false;

function detect_face() {
    /*
        (0) check whether we're already running face detection
    */
    if (initialized)
        return; // if yes, then do not initialize everything again
    /*
        (1) initialize the pico.js face detector
    */
    var update_memory = pico.instantiate_detection_memory(5); // we will use the detecions of the last 5 frames
    var facefinder_classify_region = function (r, c, s, pixels, ldim) { return -1.0; };
    var cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
    fetch(cascadeurl).then(function (response) {
        response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            facefinder_classify_region = pico.unpack_cascade(bytes);
            console.log('* facefinder loaded');
        })
    })
    /*
        (2) initialize the lploc.js library with a pupil localizer
    */
    var do_puploc = function (r, c, s, nperturbs, pixels, nrows, ncols, ldim) { return [-1.0, -1.0]; };
    var puplocurl = 'https://drone.nenadmarkus.com/data/blog-stuff/puploc.bin'
    fetch(puplocurl).then(function (response) {
        response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            do_puploc = lploc.unpack_localizer(bytes);
            console.log('* puploc loaded');
        })
    })
    /*
        (3) get the drawing context on the canvas and define a function to transform an RGBA image to grayscale
    */
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');


    function rgba_to_grayscale(rgba, nrows, ncols) {
        var gray = new Uint8Array(nrows * ncols);
        for (var r = 0; r < nrows; ++r)
            for (var c = 0; c < ncols; ++c)
                // gray = 0.2*red + 0.7*green + 0.1*blue
                gray[r * ncols + c] = (2 * rgba[r * 4 * ncols + 4 * c + 0] + 7 * rgba[r * 4 * ncols + 4 * c + 1] + 1 * rgba[r * 4 * ncols + 4 * c + 2]) / 10;
        return gray;
    }
    /*
        (4) this function is called each time a video frame becomes available
    */
    var processfn = function (video, dt) {
        // render the video frame to the canvas element and extract RGBA pixel data
        ctx.drawImage(video, 0, 0);
        var rgba = ctx.getImageData(0, 0, 640, 480).data;
        // prepare input to `run_cascade`
        var image = {
            "pixels": rgba_to_grayscale(rgba, 480, 640),
            "nrows": 480,
            "ncols": 640,
            "ldim": 640
        }
        var params = {
            "shiftfactor": 0.1, // move the detection window by 10% of its size
            "minsize": 100,     // minimum size of a face
            "maxsize": 1000,    // maximum size of a face
            "scalefactor": 1.1  // for multiscale processing: resize the detection window by 10% when moving to the higher scale
        }
        // run the cascade over the frame and cluster the obtained detections
        // dets is an array that contains (r, c, s, q) quadruplets
        // (representing row, column, scale and detection score)
        var dets = pico.run_cascade(image, facefinder_classify_region, params);
        dets = update_memory(dets);
        dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
        // draw detections
        var faceDetected = false;
        for (var i = 0; i < dets.length; ++i){
            // check the detection score
            // if it's above the threshold, trigger the endpoint
            // (the constant 50.0 is empirical: other cascades might require a different one)
            if (dets[i][3] > 50.0) {
                // console.log("Face detected");
                faceDetected = true;
                
            }
        
        
        }
        if (faceDetected) {
            console.log("Face detected");
            $("iconify-icon").removeClass("text-danger").addClass("text-primary");
            var capturedFrame = canvas.toDataURL("image/jpeg", 1.0);
            // sendFrameToEndpoint(capturedFrame);
        } else {
            console.log("No face detected");
            $("iconify-icon").removeClass("text-primary").addClass("text-danger");
        }
    }
    /*
        (5) instantiate camera handling (see https://github.com/cbrandolino/camvas)
    */
    var mycamvas = new camvas(ctx, processfn);
    /*
        (6) it seems that everything went well
    */
    initialized = true;

}

function sendFrameToEndpoint(frame) {
    //console.log(frame);
    // Use fetch to send the captured frame to your endpoint
    fetch('your_endpoint_url', {
        method: 'POST',
        body: JSON.stringify({ frame: frame }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send frame to endpoint:', response.status);
        }
    })
    .catch(error => {
        console.error('Error sending frame to endpoint:', error);
    });
}


$('#capture').click(function(){
           



});
 function captureImges(){

        // Convert the canvas content to a data URL representing a PNG image
      
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
 }
// Invoke button_callback function when the document is loaded
document.addEventListener('DOMContentLoaded', detect_face);
