$(document).ready(function() {      
 
    wrongparking('');
    carplate('');

    var dir = sessionStorage.getItem('dir');



    // setInterval(() => {
    //     const selectedDate = $('#vehicle_filter').val();
    //     const todayDate = gettodays();
    
    //     // console.log("Selected Date:", selectedDate);
    //     // console.log("Today's Date:", todayDate);
    
    //     if (selectedDate) {
    //         if (selectedDate === todayDate) {
    //             console.log("Selected date is today. Calling functions.");
    //             // Call your functions since the date is today
    //             carplate('');
    //             wrongparking('');

    //         } else {
    //             console.log("Selected date is not today.");
    //         }
    //     } else {
    //         // No date selected, call the functions with empty date
    //         console.log("No date selected. Calling functions.");
    //         carplate('');
    //         wrongparking('');
           
    //     }
    // }, 5000);

    function gettodays() {
        // Returns today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

   
 // Global variable to store previous records
let previous_wrong_Records = new Set();

// Function to handle wrong parking data
function wrongparking(date = '') {
    let correct_count = 0;
    let total_scan = 0;

    let url = '/wrongparking/';
    if (date) {
        url += `?date=${date}`;
    }

    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log("wrong:", response);

            // Count and display the wrong parked count
            $("#wrongpark-count").text(response.length);

            // Calculate and display the correct parked count
            total_scan = getTotalVehicles();
            if (total_scan !== undefined) {
                correct_count = total_scan - response.length;
            } else {
                correct_count = 0;
            }
            $("#correctparked_count").text(correct_count);

            // Append new records
            appendNewWrongParkingEntries(response);
        },
        error: function() {
            console.log("Error fetching wrong parking data.");
        }
    });
}

// Function to append new wrong parking entries
function appendNewWrongParkingEntries(entries) {
    console.log("Entries length:", entries.length);
    var panel = $("#wrongpanels");

    // Clear panel and show message if there are no entries
    if (entries.length === 0) {
        const noRecordsMessage = dir === "ltr"
            ? '<h6 style="text-align: center; color: #adb5bd;">No detections recorded today</h6>'
            : '<h6 style="text-align: center; color: #adb5bd;" data-lang-key="nocarplate_record">لم يتم تسجيل أي اكتشافات اليوم</h6>';
        panel.empty().append(noRecordsMessage);
        return;
    }

    // Create a fragment to collect new entries
    var newEntriesHtml = '';

    entries.forEach(function(entry) {
        // Create a unique identifier based on plate_text and time
        const identifier = `${entry.plate_text}|${entry.time}`;

        // Check if this record is new
        if (!previous_wrong_Records.has(identifier)) {
            previous_wrong_Records.add(identifier);

            // Prepare the HTML for the new record
            newEntriesHtml += `
                <div class="d-flex flex-row comment-row border-bottom p-3 gap-3">
                    <div>
                        <span>
                            <img id="wrongParkingImage_${identifier}" src="../static/assets/images/car_default.png" class="rounded" alt="car" width="50" />
                        </span>
                    </div>
                    <div class="comment-text w-100">
                        <h6 class="fw-medium text-capitalize">${entry.car_model}</h6>
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
        }
    });

    // Prepend new entries to the panel
    panel.prepend(newEntriesHtml);

    // JavaScript to handle image loading fallback
    entries.forEach(function(entry) {
        var img = document.getElementById(`wrongParkingImage_${entry.plate_text}|${entry.time}`);
        if (img) {
            img.onerror = function() {
                img.src = '../static/assets/images/car_default.png'; // Replace with default image path
                img.alt = 'Default Car'; // Optional: Change alt text dynamically
            };
        }
    });
}

// Event handler for the date filter change
$('#vehicle_filter').on('change', function() {
    const selectedDate = $(this).val();
    console.log("Selected Date:", selectedDate); // Debug log
    wrongparking(selectedDate);
});


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
                // console.log("typeif",typeof(totalVehicles))
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



    let previousCarPlateRecords = new Set();

// Function to fetch car plate data
function carplate(date = '') {
  
    var correct_count = 0;

    let url = '/carplate/';
    if (date) {
        url += `?date=${date}`;
    }

    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log("car_plate:", response);

            // Append new car plate entries
            appendNewCarPlateEntries(response);

           
        },
        error: function() {
       
            console.log("error");
        }
    });
}

// Function to append new car plate entries
function appendNewCarPlateEntries(entries) {
    var panel = $("#carplatepanel");

    // Clear panel and show message if there are no entries
    if (entries.length === 0) {
        const noRecordsMessage = dir === "ltr"
            ? '<h6 style="text-align: center; color: #adb5bd;" data-lang-key="nocarplate_record">No detections recorded today</h6>'
            : '<h6 style="text-align: center; color: #adb5bd;" data-lang-key="nocarplate_record">لم يتم تسجيل أي اكتشافات اليوم</h6>';
        panel.empty().append(noRecordsMessage);
        return;
    }

    // Create a fragment to collect new entries
    var newEntriesHtml = '';

    entries.forEach(function(entry) {
        // Create a unique identifier based on plate_text and time
        const identifier = `${entry.plate_text}|${entry.time}`;

        // Check if this record is new
        if (!previousCarPlateRecords.has(identifier)) {
            previousCarPlateRecords.add(identifier);

            // Prepare the HTML for the new record
            newEntriesHtml += `
                <div class="d-flex flex-row comment-row border-bottom p-3 gap-3">
                    <div>
                        <span>
                            <img id="employeeImage_${entry.owner_name}" src="../static/assets/images/employee/${entry.owner_name}.jpg" class="rounded" alt="${entry.owner_name}'s photo" width="50" />
                        </span>
                    </div>
                    <div class="comment-text w-100">
                        <h6 class="fw-medium">${entry.owner_name}</h6>
                        <p class="mb-1 fs-2 text-muted fw-bold">${entry.plate_text}</p>
                        <p class="mb-1 fs-2 text-info fw-bold">${capitalizeFirstLetter(entry.car_model)}<span class="text-muted">-(${capitalizeFirstLetter(entry.car_color)})</span></p>
                        <div class="comment-footer mt-2">
                            <div class="d-flex align-items-center">
                                <span class="badge ${
                                    entry.status === 'white' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                }">
                                    ${capitalizeFirstLetter(entry.status)}-List
                                </span>
                            </div>
                            <span class="text-muted ms-auto fw-normal fs-2 d-block mt-2 text-end" dir="ltr">${formatDate(entry.time)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    // Prepend new entries to the panel
    panel.prepend(newEntriesHtml);

    // JavaScript to handle image loading fallback
    entries.forEach(function(entry) {
        var img = document.getElementById(`employeeImage_${entry.owner_name}`);
        if (img) {
            img.onerror = function() {
                img.src = '../static/assets/images/default.png'; // Replace with default image path
                img.alt = 'Default User'; // Optional: Change alt text dynamically
            };
        }
    });
}

    
    function capitalizeFirstLetter(string) {
        return string.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
    }

  

   
    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', '');
    }

});