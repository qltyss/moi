
  
    $(document).ready(function(){

        let languageFile = {
            // General Dashboard related terms
            Dashboard: "Dashboard",
            AMR: "AMR",
            FaceDetection: "Face Detection",
            FaceRegistration: "Face Registration",
            Drone: "Drone",
            Congested: "Congested",
            EditEmployee:"Edit Employee",
            CurrentTrafficStatus: "Current Traffic Status",
            Home: "Home",
            TotalTraffic: "Total Traffic",
            TotalFaceDetections: "Total Face Detections",
            TotalWrongParkings: "Total Wrong Parkings",
            Reset: "Reset",
            FilterByDate: "Filter By Date",
            LiveRoboticStatus: "Live Robotic Status",
            OFF: "OFF",
            ON: "ON",
            TodaysTrafficAnalysis: "Today's Traffic Analysis",
            TotalFaceAnalysis: "Total Face Analysis",
            WhiteList: "White List",
            BlackList: "Black List",
            whiteList: "White List",
            blackList: "Black List",
            Unknown: "Unknown",
            LiveDetectionPanel: "Live Detection Panel",
            CurrentTraficStatus:"Traffic Status",
          
            // Face Capture Panel related terms
            faceCapturePanel: "Face Capture Panel",
            employeeInfo: "Employee Info",
            photos: "Photos",
            MultipleFaceAnglesNeededForScanning: "Multiple face angles needed for scanning",
            submit: "Submit",
            capture: "Capture",
            cameraStreaming: "Camera Streaming",
          
            // AMR Panel related terms
            amrPanel: "AMR Panel",
            scanVehicles: "Total Scan Vehicles",
            wronglyParked: "Wrongly Parked",
            correctlyParked: "Correctly Parked",
            amrStatus: "AMR Status",
            vehicleDetection: "Vehicle Detection",
            carPlatePanel: "Car Plate Panel",
            wrongParkingPanel: "Wrong Parking Panel",
            nocarplate_record:"No detections recorded today",
            nowrong_parking:"No detections recorded today",
            amr_status:"OFF",
            carOwner:"Car Owner",
            plateText:"Plate Text",
            image:"Image",
          
            // Face Detection Panel related terms
            faceDetectionPanel: "Face Detection Panel",
            detectionPanel: "Detection Panel",
            fdp: "Face Detection Panel",
            detectionPanel: "Detection Panel",
            faceDetectionHistory: "Face Detection History",
            detectionHistory: "Detection History",
            all: "All",
            status: "Status",
            time: "Time",
            name: "Name",
            latestDetection: "Latest Detection",
            chiefExecutiveOfficer: "Chief Executive Officer",
            faceAnalysis: "Face Analysis",
            facedetectiontime:"min ago",
            totalDetection:"Total Detection",
            Unknown:"Unknown",
            current_pname:"Not Detected",
            carDetails:"Car Details",
            

          
            // Drone Panel related terms
            DronePanel: "Drone Panel",
            Drn: "Drn", // Assuming 'Drn' is an alias for 'Drone'
            Battery: "Battery",
            Altitude: "Altitude",
            TotalTrafic:"Total Trafic",
            TraficAnalysis: "Traffic Analysis", // Correcting 'TraficAnalysis' to 'Traffic Analysis'
            ClickPowerIcon: "Click Power Icon To Start Mission",
            DroneStatus: "Drone Status",
            status:"Status",
            trafic_status:"Congested",
            WhiteLists: "White List",
            BlackLists: "Black List",

            // edit emp
            delete :"delete",
            edit:"edit",
            srno:"SrNo",
          };
    
        var dir = sessionStorage.getItem('dir');
        console.log(dir)
        if(dir == "ltr"){
              $('[data-lang-key]').each(function() {
                var key = $(this).attr('data-lang-key');
                if (languageFile[key]) {
                    $(this).text(languageFile[key]);
                }
            })

        }
        if(dir){
            console.log("now direc",dir)
            $('.next-lang').attr('src', dir === 'ltr' ? "../static/assets/images/flag/icon-flag-sa.svg" : "../static/assets/images/flag/icon-flag-en.svg");
            $('html').attr('lang', dir === 'ltr' ? 'en' : 'ar').attr('dir', dir);
            $('#main_logo').attr('src', dir === 'ltr' ? "../static/assets/images/moi/moiseng.png" : "../static/assets/images/moi/mois.png");
           
        }

      var userString = sessionStorage.getItem("user");
      var userObject = JSON.parse(userString); 
    //   console.log(userObject)           
      $(".uname").text(userObject.first_name);
      $(".uemail").text(userObject.email);

    //   var direction = localStorage.getItem('direction');
    //   if (direction) {
    //       // If direction preference is found, set it
    //       userSettings.Direction = direction;
    //       applyDirection(direction);
    //   }
  
    //   $('.lang_change').on('click', function() {
    //       var lang = $(this).data('lang');
    //       if (lang === 'en') {
    //           userSettings.Direction = 'ltr';
    //           applyDirection('ltr');
    //           localStorage.setItem('direction', 'ltr'); // Store direction preference in local storage
    //           console.log(userSettings);
    //       } else if (lang === 'ar') {
    //           userSettings.Direction = 'rtl';
    //           applyDirection('rtl');
    //           localStorage.setItem('direction', 'rtl'); // Store direction preference in local storage
    //           console.log(userSettings);
    //       }
    //   });
  
    //   // Function to apply direction
    //   function applyDirection(direction) {
    //       $('.next-lang').attr('src', direction === 'ltr' ? "../static/assets/images/flag/icon-flag-sa.svg" : "../static/assets/images/flag/icon-flag-en.svg");
    //       $('html').attr('lang', direction === 'ltr' ? 'en' : 'ar').attr('dir', direction);
    //       $('#main_logo').attr('src', direction === 'ltr' ? "../static/assets/images/moi/moiseng.png" : "../static/assets/images/moi/mois.png");
    //   }

  
    $('.lang_change').click(function() {
        var lang = $(this).data('lang');
        var direction=''; 
        if (lang === 'en') {
            direction = 'ltr';           
        } else if (lang === 'ar') {
            direction = 'rtl';
        }
        console.log("lang",direction)
        // var direction = "ltr"
        $.ajax({
            url: '/update_settings/' + direction + '/',
            method: 'GET',
            success: function(data) {
                console.log(data)
                sessionStorage.setItem('dir', direction);
            
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                // Handle errors if needed
            }
        });
    });





    // $('.change_theme').on('click',function() {
    //     var newtheme = $(this).data('changetheme');
       
    //     $.ajax({
    //         url: '/update_theme/' + newtheme + '/',
    //         method: 'GET',
    //         success: function(data) {
              
    //             // sessionStorage.setItem('dir', direction);

    //           location.reload();
    //         },
    //         error: function(xhr, status, error) {
    //             console.error(xhr.responseText);
    //             // Handle errors if needed
    //         }
    //     });
    // });



      $('.singoutnow').on('click', function(event) {
        
          event.preventDefault();
          $.ajax({
              url: '/signout/', 
              method: 'POST',
              headers: {'X-CSRFToken': '{{ csrf_token }}'},
              success: function(response) {
               
                localStorage.removeItem('direction');
                  window.location.href = '/'; 
              },
              error: function(error) {
                  console.error('Error signing out:', error);
              }
          });
      });
      // prev lang change before implement change permanent

    //   $('.lang_change').on('click',function() {
    //     var lang = $(this).data('lang');
    //     if (lang === 'en') {
    //         userSettings.Direction = 'ltr';
    //         $('.next-lang').attr('src', "../static/../static/assets/images/flag/icon-flag-sa.svg");
          
    //         $('html').attr('lang', 'en').attr('dir', 'ltr');
    //         $('#main_logo').attr('src', "../static/assets/images/moi/moiseng.png");
    //         console.log(userSettings);
    //     } else if (lang === 'ar') {
    //         userSettings.Direction = 'rtl';
        //     $('.next-lang').attr('src', "../static/assets/images/flag/icon-flag-en.svg");
          
          
        //   $('html').attr('lang', 'ar').attr('dir', 'rtl');
        //   $('#main_logo').attr('src', "../static/assets/images/moi/mois.png");
    //         console.log(userSettings);
    //     }
    //   });
  });

