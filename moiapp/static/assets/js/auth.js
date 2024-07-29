
  
    $(document).ready(function(){
      
        $("#reset").on('click', function() {
            location.reload();
          });

        let languageFile = {
            // General Dashboard related terms
            Dashboard: "Dashboard",
            Detection:"Detection History",
            AMR: "AMR",
            FaceDetection: "Face Detection",
            FaceRegistration: "Add Employee",
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
            TodaysTrafficAnalysis: "Traffic Analysis",
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
            unreported:"Un-Reported",
            reported:"Reported",
            action:"Action",
            Beta:"Beta",
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


            // employee
            editemployee:"Edit Employee",
            addemployee:"Add Employee",
            Employee:"Employee",

            WrongParking:"Wrong Parking",
            SmartParking:"Smart Parking"
           
          };
    
        var dir = sessionStorage.getItem('dir');
       
        if(dir == "ltr"){
            updateTooltips({
                'mini-1': 'Dashboard',
                'mini-2': 'Drone',
                'mini-3': 'Parking',
                'mini-4': 'Employee',
                'mini-5': 'Detection'
              });
                // console.log("direction is checked now", dir)
              $('[data-lang-key]').each(function() {
                var key = $(this).attr('data-lang-key');
                if (languageFile[key]) {
                    $(this).text(languageFile[key]);
                }
            })

        } else if (dir === 'rtl') {
           
            updateTooltips({
                'mini-1': 'الرئيسية',
                'mini-2': 'الدرون',
                'mini-3': 'موقف سيارات',
                'mini-4': 'موظف',
                'mini-5': 'كشف'
              });
        } 
        $('[data-bs-toggle="tooltip"]').tooltip();
        if(dir){
            // console.log("now direc",dir)
            $('.next-lang').attr('src', dir === 'ltr' ? "../static/assets/images/flag/icon-flag-sa.svg" : "../static/assets/images/flag/icon-flag-en.svg");
            $('html').attr('lang', dir === 'ltr' ? 'en' : 'ar').attr('dir', dir);
            $('#main_logo').attr('src', dir === 'ltr' ? "../static/assets/images/moi/moiseng.png" : "../static/assets/images/moi/mois.png");
           
        }
        function updateTooltips(titles) {
            // Iterate over the titles object and update the tooltips
            $.each(titles, function(id, title) {
              var $element = $('#' + id + ' a');
              $element.attr('data-bs-title', title);
        
              // Dispose of any existing tooltip instance
              var tooltipInstance = bootstrap.Tooltip.getInstance($element[0]);
              if (tooltipInstance) {
                tooltipInstance.dispose();
              }
        
              // Initialize the tooltip again
              new bootstrap.Tooltip($element[0]);
            });
          }
      var userString = sessionStorage.getItem("user");
      var userObject = JSON.parse(userString); 
    //   console.log(userObject)           
      $(".uname").text(userObject.first_name);
      $(".uemail").text(userObject.email);


  
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
                // console.log(data)
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

  });

