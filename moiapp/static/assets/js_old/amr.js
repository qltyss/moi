$(document).ready(function() {      
    $("#loaderrow").addClass("d-none");
    wrongparking('');
    carplate('');


    setInterval(() => {
        const selectedDate = $('#vehicle_filter').val();
        const todayDate = getTodayDate();
    
        console.log("Selected Date:", selectedDate);
        console.log("Today's Date:", todayDate);
    
        if (selectedDate) {
            if (selectedDate === todayDate) {
                console.log("Selected date is today. Calling functions.");
                carplate('');
                wrongparking('');
            } else {
                console.log("Selected date is not today.");
            }
        } else {
            // No date selected, call the functions with empty date
            console.log("No date selected. Calling functions.");
            carplate('');
            wrongparking('');
        }
    }, 5000);
    var dir = sessionStorage.getItem('dir');
   
    $('#vehicle_filter').on('change', function(){
        $("#loaderrow").removeClass("d-none")
        const selectedDate = $(this).val();
        wrongparking(selectedDate);
        carplate(selectedDate);
        $("#loaderrow").addClass("d-none")
        
    });
  

    function carplate(date = ''){
       
        var correct_count=0;

        let url = '/carplate/';
        if (date) {
            url += `?date=${date}`;
        }
        // console.log(url)
        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                   console.log("car_plate total:",response.length)
                   $("#scaned_count").text(response.length);
                //    $("#correctparked_count").text(response.length);
                    appendCarPlateEntries(response);
                  
                  },
                  error: function() {
               
                     console.log("error")
                  }
              });
  
      }

    function wrongparking(date = ''){
     
        var correct_count = 0;
        var total_scan = 0;

        let url = '/wrongparking/';
        if (date) {
            url += `?date=${date}`;
        }
        // console.log(url)
       
        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                    console.log("wrong:",response)
                   
                        $("#wrongpark-count").text(response.length)                    
                     
                        appendWrongParkingEntries(response)
                        
                    
                      
                 
                    
                  },
                  error: function() {
             
                     console.log("error")
                  }
              });
  
      }

    $('#signout').on('click',function(event) {
        event.preventDefault();
        sessionStorage.clear();
       
       window.location.href = '/'; 
    });
    function updateUserDate(inputDate) {
        // Parse the input date
        var dateObj = new Date(inputDate);
    
        // Extract year, month, and day
        var yyyy = dateObj.getFullYear();
        var mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        var dd = String(dateObj.getDate()).padStart(2, '0');
    
        // Format the date
        return `${mm}-${dd}-${yyyy}`;
    }

    function getTodayDate(mydate) {
        
        var today = '';
        
        if(mydate){
           
            updatedatenow = updateUserDate(mydate);
            
            return updatedatenow
        }else{
            today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); 
            const dd = String(today.getDate()).padStart(2, '0');            
            return `${mm}-${dd}-${yyyy}`; 
        }
       
       
    }

    function getTotalVehicles() {
       
        var filter_date = $('#vehicle_filter').val();
       
        update_date = getTodayDate(filter_date).trim();
       
        // console.log("update date", update_date);

        var totalVehicles = 0;
        $.ajax({
            url: "../static/assets/js/scanvehicles.js",
            dataType: "script",
            async: false,
            success: function() {




                totalVehicles = scanVehicle[update_date];
               
                if(totalVehicles){
                    $("#scaned_count").text(totalVehicles);
                }else{
                    $("#scaned_count").text('0');
                }
               
            },
            error: function(xhr, status, error) {
                console.error("Failed to load scanvehicles.js:", error);
            }
        });
        return totalVehicles;
    }




    
    function capitalizeFirstLetter(string) {
        return string.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
    }

    function appendWrongParkingEntries(entries) {
        var panel = $("#wrongpanels");
   
        if (entries.length === 0) {
          
            if(dir === "ltr"){
                
                panel.empty().append('<h6 style="text-align: center; color: #adb5bd;" >No detections recorded today</h6>');
                return
            }
            else{
                panel.empty().append('<h6 style="text-align: center; color: #adb5bd;" data-lang-key="nocarplate_record">لم يتم تسجيل أي اكتشافات اليوم</h6>');
                return;
            } 
        }
        panel.empty()
        entries.forEach(function(entry) {
            
      
    
            var html = `
                <div class="d-flex flex-row comment-row border-bottom p-3 gap-3" >
                    <div>
                        <span>
                            <img src="../static/assets/images/car_default.png" class="rounded" alt="user" width="50" />
                        </span>
                    </div>
                    <div class="comment-text w-100">
                        <h6 class="fw-medium">${entry.car_model}</h6>
                        <p class="mb-1 fs-2 text-muted fw-bold">${entry.plate_text}</p>
                        <div class="comment-footer mt-2">
                            <div class="d-flex align-items-center">
                           <span class="badge bg-info-subtle text-info">
                            ${entry.plate_text}
                            </span>
                            </div>
                             <span class="text-muted ms-auto fw-normal fs-2 d-block mt-2 text-end" dir="ltr">${formatDate(entry.time)}</span>
                        </div>
                    </div>
                </div>
            `;
            panel.append(html);
     
        });
    }

    function appendCarPlateEntries(carentries) {
        var panel = $("#carplatepanel");
       
      
       
           
        if (carentries.length === 0) {
          
            if(dir === "ltr"){
                
                panel.empty().append('<h6 style="text-align: center; color: #adb5bd;" >No detections recorded today</h6>');
                return
            }
            else{
                panel.empty().append('<h6 style="text-align: center; color: #adb5bd;" data-lang-key="nocarplate_record">لم يتم تسجيل أي اكتشافات اليوم</h6>');
                return;
            } 
        }
        panel.empty()
        carentries.forEach(function(carentry) {
            
      
    
            var html = `
                 <div class="d-flex flex-row comment-row border-bottom p-3 gap-3">
                    <div>
                        <span>
                            <img id="employeeImage_${carentry.owner_name}" src="../static/assets/images/employee/${carentry.owner_name}.jpg" class="rounded" alt="${carentry.owner_name}'s photo" width="50" />
                        </span>
                    </div>
                    <div class="comment-text w-100">
                        <h6 class="fw-medium">${carentry.owner_name}</h6>
                        <p class="mb-1 fs-2 text-muted fw-bold">${carentry.plate_text}</p>
                        <p class="mb-1 fs-2 text-info fw-bold">${capitalizeFirstLetter(carentry.car_model)}<span class="text-muted">-(${capitalizeFirstLetter(carentry.car_color)})</span></p>
                        <div class="comment-footer mt-2">
                            <div class="d-flex align-items-center">
                                <span class="badge ${
                                    carentry.status === 'white' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                }">
                                    ${capitalizeFirstLetter(carentry.status)}-List
                                </span>
                            </div>
                            <span class="text-muted ms-auto fw-normal fs-2 d-block mt-2 text-end" dir="ltr">${formatDate(carentry.time)}</span>
                        </div>
                    </div>
                </div>
            `;
            panel.append(html);
     
        });
    }

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', '');
    }

});