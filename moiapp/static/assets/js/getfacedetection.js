$(document).ready(function() {      

    let isPageUpdate = true;

    getEmp('');
    fetchStatusCounts('');
    var dir = sessionStorage.getItem('dir');
    fetchLatestDetection()

    // console.log("initial page status",isPageUpdate)
    // setInterval(() => {
    //     const selectedDate = $('#face_filter').val();
    //     const todayDate = getTodayDate();
    

       
    //     if (selectedDate) {
    //         if (selectedDate === todayDate) {
    //             if(isPageUpdate){
    //                 console.log("Selected date is today. Calling functions.");
               
    //                 getEmp('');
                   
    //                 fetchLatestDetection()
    //             }
                
    //         } else {
    //             console.log("Selected date is not today.");
                
    //         }
    //     } else {
    //         // No date selected, call the functions with empty date
    //         console.log("now page status",isPageUpdate)
    //         if(isPageUpdate){
    //             console.log("m updating2 ")
    //             // console.log("No date selected. Calling functions.");
    //             getEmp('');
               
    //             fetchLatestDetection()
    //         }
    //     }
    // }, 3000);



    function fetchLatestDetection() {
        fetch('/current_face_detection/')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else if (data.message) {
                    console.log(data.message);
                    if(dir === "rtl"){
                        data.message = "لاتوجد بيانات"
                    }
                    $('#current_detect').html(`
                                
                                    <p class="fs-2 mb-0 text-muted fw-bold d-flex justify-content-center align-items-center my-4"  dir="ltr" data-lang-key="facedetectiontime" id="current_detect_time">${data.message}</p>
                              
                            `);
          
                } else {
                    

                    $('#current_detect').html(`
                        <a href="javascript:void(0)" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user" id="chat_user_1" data-user-id="1">
                            <div class="d-flex align-items-center">
                                <span class="position-relative">
                                    <img   src="../static/assets/images/employee/${data.emp__image}" id="current_img" width="48" height="48" class="rounded-circle" />
                                </span>
                                <div class="ms-3 d-inline-block w-75">
                                    <h6 class="mb-1 fw-semibold chat-title" data-username="James Anderson" id="current_pname"> ${data.emp__name} </h6>
                                    <span class="fs-3 text-truncate text-body-color d-block" data-lang-key="" id="current_pstatus">${data.emp__position}</span>
                                </div>
                            </div>
                            <p class="fs-2 mb-0 text-muted" dir="ltr" data-lang-key="facedetectiontime" id="current_detect_time">${formatTimeOnly(data.time)}</p>
                        </a>
                    `);
                    
                }
            })
            .catch(error => console.error('Error fetching detection log:', error));
    }

    function formatTimeOnly(dateTimeStr) {
        // Create a Date object from the UTC date-time string
        let date = new Date(dateTimeStr);
    
        // Extract hours and minutes in 12-hour format with AM/PM
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
    
        // Pad minutes with leading zeros if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        // Format the time string
        let formattedTime = `${hours}:${minutes} ${ampm}`;
        return formattedTime;
    }

    $(".getselectedtab").on('click', function(){
        isPageUpdate = true;
        getEmp('');
    })

 
    $(".pagination").on("click", "a", function(event) {
        event.preventDefault();
        var page_url = $(this).attr("href");
        var page_number = page_url.split('page=')[1].trim();
        
        console.log("pageno",page_number);

        if(page_number === '1'){
            isPageUpdate = true;
        }else {
            isPageUpdate = false;
        }
        const selectedDate = $('#face_filter').val();
        var todayDate = getTodayDate();
        if((selectedDate === todayDate) && page_number !== '1'){
            
            isPageUpdate = false
        }else if((selectedDate === todayDate) && page_number === '1'){
          
            isPageUpdate = true
        }
        console.log("page status",isPageUpdate)
        getEmp(page_number);
    });

    function getEmp(pageNumber){
        var activeTab = $('.getselectedtab.active');
        var statusKey = activeTab.attr('data-status-key');  
        // if(statusKey === "all"){
        //     isPageUpdate = true;
        // }
        // console.log('Active tab data-status-key:', statusKey);
        const selectedDate = $('#face_filter').val();
        var date = selectedDate ? selectedDate : '';
        
        let url = `/employees_detection/`;
        if(statusKey){
            url += `?status=${statusKey}`;
        }
        if (pageNumber && date) {
            url += `&page=${pageNumber}&date=${date}`;
        } else if (pageNumber) {
            url += `&page=${pageNumber}`;
        } else if (date) {
            url += `&date=${date}`;
        }

        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                    //    console.log("Emplyees log: ",response)
                        if(statusKey === "white"){
                            appendTable(response.results,'white_list')
                        }else if(statusKey === "black"){
                            appendTable(response.results,'black_list');
                        }else if(statusKey === "all"){
                            appendTable(response.results,'all_emp_list');
                            
                        }

                    renderPagination(response.pagination_html); 
                    updateLang()
                  },
                  error: function() {
                     
                     console.log(error)
                  }
              });
             
  
      }
      function renderPagination(pagination_html) {
        var pagination = $(".pagination .step-links");
        pagination.html(pagination_html);
       
    }

function updateLang(){
    let languageFile = {

        first:"First",
        next:"Next",
        previous:"Previous",
        last:"Last",
        page:"Page",
        of:"of"

        
      }
      var dir = sessionStorage.getItem('dir');
      
        if(dir == "ltr"){
         
              $('[data-lang-key]').each(function() {
                var key = $(this).attr('data-lang-key');
                if (languageFile[key]) {
                    $(this).text(languageFile[key]);
                }
            })

        }
    }



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
                console.log("new",newSeriesValues)
                updatedata(response);
                updateChartValues(facedetection, newSeriesValues);
              
     
            },
            error: function(error) {
                console.error("Error fetching status counts:", error);
            }
        });
    }

    
    // Function to call fetchStatusCounts with selected date or an empty string
    function updateStatusCountsBasedOnDate() {
        const selectedDate = $('#face_filter').val();

        fetchStatusCounts(selectedDate ? selectedDate : '');
        getEmp(pageNumber="");
        
        $("#filter_Date").text(selectedDate)
    }
    

    $('#face_filter').on('change', updateStatusCountsBasedOnDate);


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

    function formatDate(inputDateStr) {
        const inputDate = new Date(inputDateStr);
        
        // Month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Day, month, and year
        const day = inputDate.getDate();
        const monthIndex = inputDate.getMonth();
        const year = inputDate.getFullYear();
        
        // Time
        let hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12; // Handle midnight (0 hours)
        
        // Format the time
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
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


    function getTodayDate() {
        // Returns today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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
              size: "20%",
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

    function replaceAlphabetWithSpace(inputString) {
        return inputString.replace(/[A-Za-z]/g, ' ');
    }

  
    function updateChartValues(chartInstance, seriesValues) {
        if (seriesValues.every(value => value === 0)) {
    
            chartInstance.updateSeries(seriesValues);
            if (dir === "ltr") {
                $("#filter_Date").text('No data found');
                
            } else if (dir === "rtl" ){
                $("#filter_Date").text('لاتوجد بيانات');
               
            }
            
            return;
            }
        if (chartInstance) {
                console.log(seriesValues)
                let chosedate = $('#face_filter').val();
                let chosetodayDate = getTodayDate();
                if(chosedate){
                    $("#filter_Date").text(chosedate);
                }else if(chosetodayDate){
                    $("#filter_Date").text(chosetodayDate);
                }
                
                chartInstance.updateSeries(seriesValues);
        } else {
                console.error("Chart instance is undefined.");
        }
    }


    
    
});