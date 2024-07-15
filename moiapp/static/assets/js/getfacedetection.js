$(document).ready(function() {      
    var dir = sessionStorage.getItem('dir');
    getEmp('');
    fetchStatusCounts('');

    setInterval(() => {
        const selectedDate = $('#face_filter').val();
        const todayDate = getTodayDate();
    
        console.log("Selected Date:", selectedDate);
        console.log("Today's Date:", todayDate);
    
        if (selectedDate) {
            if (selectedDate === todayDate) {
                console.log("Selected date is today. Calling functions.");
                // Call your functions since the date is today
                getEmp('');
                fetchStatusCounts('');
            } else {
                console.log("Selected date is not today.");
            }
        } else {
            // No date selected, call the functions with empty date
            console.log("No date selected. Calling functions.");
            getEmp('');
            fetchStatusCounts('');
        }
    }, 5000);
    function getTodayDate() {
        // Returns today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function getEmp(date = ''){
        let url = '/employees_detection/';
        if (date) {
            url += `?date=${date}`;
        }
        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                       console.log("Emplyees log: ",response)
  
                      appendTable(response,'all_emp_list');  
                      appendTable(response,'white_list');
                      appendTable(response,'black_list');
                  },
                  error: function() {
                     
                     console.log(error)
                  }
              });
  
      }
    let previousSeriesValues = [0, 0, 0];
    function fetchStatusCounts(date = '') {
        let url = '/facestatus_count/';
        if (date) {
            url += `?date=${date}`;
        }
    
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
                const newSeriesValues = [response.white, response.black, response.unknown];
                if (!arraysEqual(newSeriesValues, previousSeriesValues)) {
                    updatedata(response);
                    updateChartValues(facedetection, newSeriesValues);     
                    previousSeriesValues = newSeriesValues;
                }
                // const seriesValues = [response.white, response.black, response.unknown];
                // updatedata(response);
                // updateChartValues(facedetection, seriesValues);
            },
            error: function(error) {
                console.error("Error fetching status counts:", error);
            }
        });
    }
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    
    // Function to call fetchStatusCounts with selected date or an empty string
    function updateStatusCountsBasedOnDate() {
        const selectedDate = $('#face_filter').val();
        fetchStatusCounts(selectedDate ? selectedDate : '');
        getEmp(selectedDate ? selectedDate : '');
        $("#filter_Date").text(selectedDate)
    }
    
    // Event listener for date input change
    $('#face_filter').on('change', updateStatusCountsBasedOnDate);
    // fetchStatusCounts() 
    // function fetchStatusCounts() {
    //     $.ajax({
    //         url: '/facestatus_count/',  // URL for the Django view
    //         type: 'GET',
    //         success: function(response) {
    //             console.log(response)
    //             updatedata(response)
    //             updateChartValues(facedetection, [response.white, response.black, response.unknown]);
                     
                
    //         },
    //         error: function(error) {
    //             console.error("Error fetching status counts:", error);
    //         }
    //     });
    // }

    function updatedata(response){

        const totalCount = response.white + response.black + response.unknown;              
        const whitePercentage = totalCount ? (response.white / totalCount) * 100 : 0;
        const blackPercentage = totalCount ? (response.black / totalCount) * 100 : 0;
        const unknownPercentage = totalCount ? (response.unknown / totalCount) * 100 : 0;
        $('#white-count').text(response.white);
        $('#black-count').text(response.black);
        $('#unknown-count').text(response.unknown);
        $('#face-total').text(totalCount);
        $('#white-progress-bar').css('width', whitePercentage + '%').attr('aria-valuenow', whitePercentage);
        $('#black-progress-bar').css('width', blackPercentage + '%').attr('aria-valuenow', blackPercentage);
        $('#unknown-progress-bar').css('width', unknownPercentage + '%').attr('aria-valuenow', unknownPercentage);
    }


  
    // function appendTable(employees, tbodyName) {
    //     let blackCount = 0;
    //     let whiteCount = 0;
  
    //       $(`#${tbodyName}`).empty();
    //       if (employees.length === 0) {
    //         $(`#${tbodyName}`).append(`
    //             <tr>
    //                 <td colspan="3" class="fw-bolder text-center">No data found</td>
    //             </tr>
    //         `);
    //         return; // Exit the function early if no data is found
    //     }
    //     console.log(employees)
    //     console.log(employees.length)
    //       // Loop through each employee in the response data
    //       employees.forEach(employee => {
  
    //         if (employee.emp__status === 'black') {
    //             blackCount++;
    //         } else if (employee.emp__status === 'white') {
    //             whiteCount++;
    //         }
    //           // If tbodyName is 'white_list', filter only white status employees
    //           if (tbodyName === 'white_list' && employee.emp__status !== 'white') {
  
    //               return; // Skip this employee if tbodyName is 'white_list' but employee status is not 'white'
    //           }
  
    //           // If tbodyName is 'black_list', filter only black status employees
    //           if (tbodyName === 'black_list' && employee.emp__status !== 'black') {
    //               return; // Skip this employee if tbodyName is 'black_list' but employee status is not 'black'
    //           }
              
    //           // Append the employee to the corresponding table based on the tbodyName
    //           $(`#${tbodyName}`).append(`
    //               <tr class=" ">
    //                   <td class="ps-0">
    //                       <div class="d-flex align-items-center gap-6">
    //                       <img src="../static/assets/images/employee/${employee.emp__image}" alt="${employee.emp__name}" width="48" class="rounded" />
    //                           <div>
    //                               <h6 class="mb-0">${employee.emp__name}</h6>
    //                               <span>${employee.emp__position}</span>
    //                           </div>
    //                       </div>
    //                   </td>
    //                   <td class="text-center ">
                       
    //                      <span class="badge ${
    //                         employee.emp__status === 'white' ? 'bg-success-subtle text-success' :
    //                         employee.emp__status === 'black' ? 'bg-danger-subtle text-danger' :
    //                         employee.emp__status === 'unknown' ? 'bg-warning-subtle text-warning' :
    //                         ''
    //                     }">
    //                         ${employee.emp__status}
    //                     </span>
    //                   </td>
    //                   <td dir="ltr">
    //                      <span>${formatDate(employee.time)}</span>
    //                   </td>
    //               </tr>
    //           `);
    //       });
  
    //       $("#total_black").text(blackCount)
    //       $("#total_white").text(whiteCount)
    //   }
    
    function appendTable(employees, tbodyName) {
        let blackCount = 0;
        let whiteCount = 0;
    
        // Clear the existing rows in the tbody
        $(`#${tbodyName}`).empty();
    
        // Display a message if no employees are found
        if (employees.length === 0) {
            
            if(dir === "ltr"){
                $(`#${tbodyName}`).append(`
                    <tr>
                        <td colspan="3" class="fw-bolder text-center">No data found</td>
                    </tr>
                `);
            }else if(dir === "rtl"){
                $(`#${tbodyName}`).append(`
                    <tr>
                        <td colspan="3" class="fw-bolder text-center">لاتوجد بيانات</td>
                    </tr>
                `);
               
            }
            return; // Exit the function early if no data is found
        }
    
        // Sort employees by time in descending order
        employees.sort((a, b) => {
            // Convert time strings to Date objects
            let timeA = new Date(a.time);
            let timeB = new Date(b.time);
            return timeB - timeA; // Sort in descending order (latest first)
        });
        console.log('Latest record:', employees[0]);
        var gettime = formatDate(employees[0].time);
        const todayDate = getTodayDate();
        const filre_date = $("#face_filter").val();
        
        if (employees.length > 0 )  {
           
            if (!filre_date || filre_date === todayDate) {
                

                $('#current_detect').html(`
                    <a href="javascript:void(0)" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user" id="chat_user_1" data-user-id="1">
                        <div class="d-flex align-items-center">
                            <span class="position-relative">
                                <img   src="../static/assets/images/employee/${employees[0].emp__image}" id="current_img" width="48" height="48" class="rounded-circle" />
                            </span>
                            <div class="ms-3 d-inline-block w-75">
                                <h6 class="mb-1 fw-semibold chat-title" data-username="James Anderson" id="current_pname"> ${employees[0].emp__name} </h6>
                                <span class="fs-3 text-truncate text-body-color d-block" data-lang-key="" id="current_pstatus">${employees[0].emp__position}</span>
                            </div>
                        </div>
                        <p class="fs-2 mb-0 text-muted" dir="ltr" data-lang-key="facedetectiontime" id="current_detect_time">${gettime.time}</p>
                    </a>
                `);
             }
        }
        
        // Loop through each employee in the sorted array
        employees.forEach(employee => {
            if (employee.emp__status === 'black') {
                blackCount++;
            } else if (employee.emp__status === 'white') {
                whiteCount++;
            }
    
            // If tbodyName is 'white_list', filter only white status employees
            if (tbodyName === 'white_list' && employee.emp__status !== 'white') {
                return; // Skip this employee if tbodyName is 'white_list' but employee status is not 'white'
            }
    
            // If tbodyName is 'black_list', filter only black status employees
            if (tbodyName === 'black_list' && employee.emp__status !== 'black') {
                return; // Skip this employee if tbodyName is 'black_list' but employee status is not 'black'
            }
            var formatted = formatDate(employee.time);
            // Append the employee to the corresponding table based on the tbodyName
            $(`#${tbodyName}`).append(`
                <tr>
                    <td class="ps-0">
                        <div class="d-flex align-items-center gap-6">
                            <img src="../static/assets/images/employee/${employee.emp__image}" alt="${employee.emp__name}" width="48" class="rounded" />
                            <div>
                                <h6 class="mb-0">${employee.emp__name}</h6>
                                <span>${employee.emp__position}</span>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="badge text-capitalize ${
                            employee.emp__status === 'white' ? 'bg-success-subtle text-success' :
                            employee.emp__status === 'black' ? 'bg-danger-subtle text-danger' :
                            employee.emp__status === 'unknown' ? 'bg-warning-subtle text-warning' :
                            ''
                        }">
                            ${employee.emp__status}
                        </span>
                    </td>
                    <td dir="ltr">
                        <span>${replaceAlphabetWithSpace(employee.time)}</span>
                    </td>
                    <td class="ps-0">
                        <div class="d-flex align-items-center gap-6">
                            <img src="../static/assets/images/car_default.png" alt="${employee.emp__name}" width="48" class="rounded" />
                            <div>
                                <h6 class="mb-0">${employee.plate_text}</h6>
                                <span>${employee.car_model} (${employee.car_color})</span>
                            </div>
                        </div>
                    </td>
                </tr>
            `);
        });
    
        // Update the counts for black and white statuses
        $("#total_black").text(blackCount);
        $("#total_white").text(whiteCount);
    }
    function formatDateTime(date) {
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        var seconds = date.getSeconds().toString().padStart(2, '0');
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        var day = date.getDate().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds} ${year}-${month}-${day}`;
    }

    // function formatDate(inputDateStr) {
    //     const inputDate = new Date(inputDateStr);
        
    //     // Month names
    //     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    //                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
    //     // Day, month, and year
    //     const day = inputDate.getDate();
    //     const monthIndex = inputDate.getMonth();
    //     const year = inputDate.getFullYear();
        
    //     // Time
    //     let hours = inputDate.getHours();
    //     const minutes = inputDate.getMinutes();
    //     console.log("hr",hours)
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours %= 12;
    //     hours = hours || 12; // Handle midnight (0 hours)
        
    //     // Format the time
    //     const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
    //     // Format the date and time
    //     const formattedDate = `${day} ${monthNames[monthIndex]} ${year} ${timeString}`;
        
    //     return { time: timeString, fullDate: formattedDate };
    // }
    function replaceAlphabetWithSpace(inputString) {
        return inputString.replace(/[A-Za-z]/g, ' ');
    }
    function formatDate(inputDateStr) {
        const inputDate = new Date(inputDateStr);
        
        // Month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Day, month, and year
        const day = inputDate.getDate();
        const monthIndex = inputDate.getMonth();
        const year = inputDate.getFullYear();
        
        // Time in 24-hour format
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        
        // Format the time
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Format the date and time
        const formattedDate = `${day} ${monthNames[monthIndex]} ${year} ${timeString}`;
        
        return { time: timeString, fullDate: formattedDate };
    }

    $('#signout').on('click',function(event) {
        event.preventDefault();

        // localStorage.removeItem('sessionToken');
        sessionStorage.clear();
        // alert(sessionStorage.getItem("moitoken"))
    window.location.href = '/'; // Replace with your login page
    });


    // chart data
    var options = {
        color: "#adb5bd",
        series: [0, 0, 0],
        
        chart: {
          type: "donut",
          height: 230,          
          fontFamily: "inherit",
          foreColor: "#c6d1e9",
        },
        plotOptions: {
          radialBar: {
            inverseOrder: false,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 1,
              size: "10%",
            },
            dataLabels: {
              show: false,
            },
          },
        },
        legend: {
          show: false,
        },
        stroke: { width: 2, lineCap: "round" },
        tooltip: {
          enabled: false,
          fillSeriesColor: false,
        },
        colors: ["var(--bs-primary)", "var(--bs-danger)", "var(--bs-secondary)"],
      };
    
      var facedetection = new ApexCharts(
        document.querySelector("#facestatus-overview"), 
        options
      );
      facedetection.render();    



    function updateChartValues(chartInstance, seriesValues) {
        // Check if all series values are zero
        const allZero = seriesValues.every(value => value === 0);
    
        if (chartInstance) {
            // Update series values in options
            options.series = seriesValues;
    
            // Destroy the existing chart
            chartInstance.destroy();
    
            if (allZero) {
                // If all series values are zero, display "No data found" message
                if(dir === "ltr"){
                    $("#nodata").text("No data found");
                }else if(dir === "rtl"){
                    $("#nodata").text("لاتوجد بيانات");
                }
                
                $("#facestatus-overview").hide(); // Hide the chart container
            } else {
                // Otherwise, create a new chart instance with updated options
                var updatedChart = new ApexCharts(
                    document.querySelector("#facestatus-overview"),
                    options
                );
                updatedChart.render();
                $("#nodata").empty(); // Clear the "No data found" message
                $("#facestatus-overview").show(); // Show the chart container
            }
        } else {
            console.error("Chart instance is undefined.");
        }
    }
    
    
});