$(document).ready(function(){
 

  var dir = sessionStorage.getItem('dir');
  $("#loaderrow").removeClass('d-none');
  today()
  dashboardData('');
  dashboard_traffic();
  latest_record();
  
  function today(){
    var today = new Date();
    var options = { day: '2-digit', month: 'short', year: 'numeric' };
    var formattedDate = today.toLocaleDateString('en-US', options);
    $("#today_Date").text(formattedDate)
    
  }

  $("#reset").on('click', function() {
    location.reload();
});
  
//   change date start here
  $('.getdate').on('change', function (e) {
        
    e.preventDefault();

    var s = $('#startDate').val();
    var e = $('#endDate').val();
  
    if (e == "") {
        $('#endDate').focus();
        



    }
    if (s == "") {
        $('#startDate').focus();

    } else if (e != "" && s != "") {
      
      dashboardData(s, e) 
   
    }

});
//change date end here


  // -----------------------------------------------------------------------
  // Traffic Analysis Chart
  // -----------------------------------------------------------------------
  var traffic_options = {
    series: [
      {
        name: "Total Vehicles",
        data: [
          
        ],
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "line",
      height: 300,
      toolbar: { show: !1 },
    },
    legend: { show: !1 },
    dataLabels: { enabled: !1 },
    stroke: {
      curve: "smooth",
      show: !0,
      width: 2,
      colors: ["var(--bs-primary)"],
    },
    xaxis: {
      categories: [

      
      ],
      axisBorder: { show: !1 },
      axisTicks: { show: !1 },
      tickAmount: 6,
      labels: {
        rotate: 0,
        rotateAlways: !0,
        style: { fontSize: "10px", colors: "#adb0bb", fontWeight: "600" },
      },
    },
    yaxis: {
      show: false,
      tickAmount: 3,
    },
    tooltip: {
      theme: "dark",
    },
    colors: ["var(--bs-primary)"],
    grid: {
      borderColor: "var(--bs-primary-bg-subtle)",
      strokeDashArray: 4,
      yaxis: { show: false },
    },
    markers: {
      strokeColor: ["var(--bs-primary)"],
      strokeWidth: 3,
    },
  };
//  console.log("chart catergories tyepe",typeof traffic_options.xaxis.categories);
  var traffic_chart = new ApexCharts(
    document.querySelector("#traffic_analysis"),
    traffic_options
  );
  traffic_chart.render();

  
  // -----------------------------------------------------------------------
  //  Chart Ends
  // -----------------------------------------------------------------------

   // =====================================
  // Face Analysis Chart
  // =====================================
  var face_options = {
    color: "#adb5bd",
    series: [40, 40, 10],
    labels: ["white-list", "black-list", "unknown"],
    chart: {
        width: 180,
        type: "donut",
        fontFamily: "inherit",
        foreColor: "#adb0bb",
    },
    plotOptions: {
        pie: {
            startAngle: 0,
            endAngle: 360,
            donut: {
                size: "75%",
            },
        },
    },
    stroke: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    colors: ["var(--bs-primary)", "var(--bs-danger)", "var(--bs-warning)"],
    responsive: [
        {
            breakpoint: 991,
            options: {
                chart: {
                    width: 120,
                },
            },
        },
    ],
    tooltip: {
        theme: "dark",
        fillSeriesColor: false,
    },
};

var face_analysis_chart = new ApexCharts(document.querySelector("#face_analysis"), face_options);
face_analysis_chart.render();

// Generic Function To Update Charts
function updatefaceChartValues(chartInstance, seriesValues) {

    if (seriesValues.every(value => value === 0)) {
  
      chartInstance.destroy();
      if (dir === "ltr") {
        $("#no_faceData").text('No data found');
        $("#face_analysis").css("min-height","128.7px");
      } else if (dir === "rtl" ){
        $("#no_faceData").text('لاتوجد بيانات');
        $("#face_analysis").css("min-height","128.7px");
      }
    
      return;
    }
    if (chartInstance) {
        // Update series values using updateSeries method
        chartInstance.updateSeries(seriesValues);
    } else {
        console.error("Chart instance is undefined.");
    }
}



    function dashboardData(startDate = '', endDate = '') {
      let url = '/dashboard_data/';

      // Check if both start and end dates are provided
      if (startDate && endDate) {
          url += `?start_date=${startDate}&end_date=${endDate}`;
      } else if (startDate) { // If only start date is provided, use it as the end date
          endDate = new Date().toISOString().split('T')[0]; // Get current date as end date
          url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      $("#loaderrow").removeClass("d-none");
      $.ajax({
          url: url,
          method: 'GET',
          contentType: 'application/json',
          success: function(response) {
              console.log(response);
              $("#loaderrow").addClass("d-none");
              $("#wrongparking_card_text").text(response.wrongparking);
              $("#person_card_text").text(response.person);
              $("#traffic_card_text").text(response.drone.toFixed(0));
              
              if(response.drone_latest_status  === "Heavy"){
                if (dir === "ltr") {
                  $("#dashboard_traffic_status").text(response.drone_latest_status);
                }if(dir === "rtl"){
                  $("#dashboard_traffic_status").text("مزدحم");
                }
               

              }else if(response.drone_latest_status  === "Moderate"){

                if (dir === "ltr") {
                  $("#dashboard_traffic_status").text(response.drone_latest_status);
                }if(dir === "rtl"){
                  $("#dashboard_traffic_status").text("معتدل");
                }

              }else if(response.drone_latest_status  === "Light"){

                if (dir === "ltr") {
                  $("#dashboard_traffic_status").text(response.drone_latest_status);
                }if(dir === "rtl"){
                  $("#dashboard_traffic_status").text("طبيعي");
                }

              }
              
              var series = [response.white, response.black, response.unknown];
              updatefaceChartValues(face_analysis_chart, series);
          },
          error: function() {
              console.log("error");
          }
      });
    }

    function updateChartValues(chartid, chartInstance, categories, seriesValues, chartOptions) {
      const $chartDiv = $(`#${chartid}`);
    
      // console.log(seriesValues)
      if (seriesValues.length === 0) {
        // Clear the chart div
        $chartDiv.empty();

       
        if (dir === "ltr") {
          $("#today_Date").text('No data found').addClass("text-danger");
        } else if (dir === "rtl" ){
 
          $("#today_Date").text('لاتوجد بيانات').addClass("text-danger");
        }
        return;
      }
    
      // If chart instance is defined
      if (chartInstance) {
        // Update series data and x-axis categories in options
        chartOptions.series[0].data = seriesValues;
        chartOptions.xaxis.categories = categories;
    
        // Destroy the existing chart
        chartInstance.destroy();
        today();
        // Create a new chart instance with updated options
        var updatedChart = new ApexCharts(document.querySelector(`#${chartid}`), chartOptions);
        updatedChart.render();
      } else {
        console.error("Chart instance is undefined.");
      }
    }

  // function updateChartValues(chartid, chartInstance, categories, seriesValues, chartOptions) {
  //   // Check if chart instance is defined
  
  //   if (chartInstance) {
  //       // console.log(chartOptions)
  //       // Update series data and x-axis categories in options
  //       chartOptions.series[0].data = seriesValues;
  //       chartOptions.xaxis.categories = categories;
  
  //       // Destroy the existing chart
  //       chartInstance.destroy();
  
  //       // Create a new chart instance with updated options
  //       var updatedChart = new ApexCharts(
  //         document.querySelector(`#${chartid}`), 
  //         chartOptions
  //       );
  //       updatedChart.render();
      
  //   } else {
  //       console.error("Chart instance is undefined.");
  //   }
  // }


    function dashboard_traffic() {
      let url = '/dashboard_trafic/';

      $("#loaderrow").addClass("d-none");
        $.ajax({
          url: url,
          method: 'GET',
          contentType: 'application/json',
          success: function(response) {
            // console.log(typeof(response))
            // console.log(response)
        
   
          updateChartValues("traffic_analysis", traffic_chart, response.time, response.traffic, traffic_options);
        },
          error: function() {
              console.log("error");
          }
      });
    }


  //   function latest_record() {
  //     let url = '/dashboard_latest_records/';
  
  //     $.ajax({
  //         url: url,
  //         method: 'GET',
  //         contentType: 'application/json',
  //         success: function(response) {
  //             if (response.length > 0) {
  //                 console.log(response);
  //                 updateLiveDetection(response)
  //             } else {
                
  //               if(dir === "ltr"){
                
  //                 $("#live_detection").empty().append('<h6 style="text-align: center; color: #adb5bd;">No detections recorded today</h6>').css({
  //                   "display": "flex",
  //                   "align-items": "center",
  //                   "justify-content": "center",
  //                   "min-height": "140px"
  //               });
  //             }
  //             else{
  //               $("#live_detection").empty().append('<h6 style="text-align: center; color: #adb5bd;">لم يتم تسجيل أي اكتشافات اليوم</h6>').css({
  //                 "display": "flex",
  //                 "align-items": "center",
  //                 "justify-content": "center",
  //                 "min-height": "140px"
  //             });
  //             } 
  //                 console.log('No records found');
  //                 // Display a message indicating no records found
  //             }
  //         },
  //         error: function(xhr) {
  //             console.log(xhr.responseJSON.message);
  //         }
  //     });
  // }
  // update this funtion to call every 5 second
  function latest_record() {
    let url = '/dashboard_latest_records/';

    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          console.log("Live Detection: ",response)
            if (response.length > 0) {
                console.log(response.length);
                updateLiveDetection(response);
            } else {
                let message;
                if (dir === "ltr") {
                    message = '<h6 style="text-align: center; color: #adb5bd;">No detections recorded today</h6>';
                } else if (dir === "rtl"){
                    message = '<h6 style="text-align: center; color: #adb5bd;">لم يتم تسجيل أي اكتشافات اليوم</h6>';
                }
                $("#live_detection").empty().append(message).css({
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "min-height": "140px"
                });
                console.log('No records found');
            }
            // Schedule the next call after 5 seconds
            setTimeout(latest_record, 5000);
        },
        error: function(xhr) {
            console.log(xhr.responseJSON.message);
            // Schedule the next call after 5 seconds even if there's an error
            setTimeout(latest_record, 5000);
        }
    });
}

//   function updateLiveDetection(response) {
//     // Sort the response array based on the time property
    
//     response.sort(function(a, b) {
//         // Split the time strings into hours, minutes, and seconds
//         var timeA = a.time.split(':');
//         var timeB = b.time.split(':');
        
//         // Convert the time strings to integers for comparison
//         var hourA = parseInt(timeA[0]);
//         var minuteA = parseInt(timeA[1]);
//         var secondA = parseInt(timeA[2]);
//         var hourB = parseInt(timeB[0]);
//         var minuteB = parseInt(timeB[1]);
//         var secondB = parseInt(timeB[2]);
        
//         // Compare the time components
//         if (hourA !== hourB) {
//             return hourA - hourB;
//         } else if (minuteA !== minuteB) {
//             return minuteA - minuteB;
//         } else {
//             return secondA - secondB;
//         }
//     });

//     // Iterate over the sorted response array
//     response.forEach(function(record) {
//         // Determine the image file name
//         var img = record.status == "unknown" ? 'unknown.jpg' : record.name.replace(/ /g, '_') + '.jpg';

//         // Create the HTML for the record
//         var html = `<div class="col-4 text-center">
//                         <img src="../static/assets/images/employee/${img}" alt="${record.name}" class="img-fluid rounded" />
//                         <h6 class="fs-2 mt-1">${record.name}</h6>
//                         <p class="fs-2 mt-1">${record.time}</p>
//                     </div>`;

//         // Append the HTML to the live_detection div
//         $('#live_detection').append(html);
//     });
// }

function updateLiveDetection(response) {
  // Sort the response array based on the time property
  response.sort(function(a, b) {
      var timeA = a.time.split(':');
      var timeB = b.time.split(':');
      var hourA = parseInt(timeA[0]);
      var minuteA = parseInt(timeA[1]);
      var secondA = parseInt(timeA[2]);
      var hourB = parseInt(timeB[0]);
      var minuteB = parseInt(timeB[1]);
      var secondB = parseInt(timeB[2]);
      
      if (hourA !== hourB) {
          return hourA - hourB;
      } else if (minuteA !== minuteB) {
          return minuteA - minuteB;
      } else {
          return secondA - secondB;
      }
  });

  // Clear the live_detection div before updating
  $('#live_detection').empty();

  // Iterate over the sorted response array
  response.forEach(function(record) {
      // Create a unique identifier for each record based on name and time
      let recordId = `${record.name}-${record.time}`;
      
      // Determine the image file name
      var img = record.employee_status == "unknown" ? 'unknown.jpg' : record.employee_name.replace(/ /g, '_') + '.jpg';

      // Determine the badge class based on employee status
    var badgeClass;
    if (record.employee_status === 'white') {
        badgeClass = 'bg-success-subtle text-success';
    } else if (record.employee_status === 'black') {
        badgeClass = 'bg-danger-subtle text-danger';
    } else if (record.employee_status === 'unknown') {
        badgeClass = 'bg-warning-subtle text-warning';
    } else {
        badgeClass = 'bg-secondary-subtle text-secondary'; // Default class
    }
    var model = record.car_model
    model = model.split(' ')[0]
    console.log(model)
      // Create the HTML for the record
      var html = `<div class="col-4 text-center">
                      <img src="../static/assets/images/employee/${img}" alt="${record.employee_name}" class="img-fluid rounded" />
                      <h6 class="fs-2 mt-1">${record.employee_name}</h6>
                      <h6 class="badge ${badgeClass} ">${record.employee_status}</h6>
                      
                      <div class="comment-text w-100 border-top">
                       
                        <h7 class="fw-medium mt-1">${record.plate_text}</h7>
                        <p class=" fs-2 text-secondary fw-bold mt-1" style="margin-bottom: 0px;">${model}</p>
                         <p class=" fs-2 text-info fw-bold mt-1" style="margin-bottom: 1px;">${record.car_color}</p>
                         <p class="fs-2 ">${record.time}</p>
                  </div>`;

      // Append the HTML to the live_detection div
      $('#live_detection').append(html);
  });
}



});







