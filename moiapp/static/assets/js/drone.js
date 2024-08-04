$(document).ready(function(){


  var dir = sessionStorage.getItem('dir');
  drone_traffic();
      $('#signout').on('click',function(event) {
        event.preventDefault();

        // localStorage.removeItem('sessionToken');
        sessionStorage.clear();
        // alert(sessionStorage.getItem("moitoken"))
       window.location.href = 'signin.html'; // Replace with your login page
    });
    // saveDroneData()

  //   function saveDroneData() {
  //     var csrftoken = getCookie('csrftoken'); 
  //     var total = $('#drone_traffic_value').text();
  //     var status = $('#drone_traffic_status_values').text();
  
  //     if (status === "Heavy" || status === "ثقيل") {
  //         status = "Heavy";
  //     } else if (status === "Moderate" || status === "معتدل") {
  //         status = "Moderate";
  //     } else if (status === "Light" || status === "طبيعي") {
  //         status = "Light";
  //     }
  
  //     $.ajax({
  //         url: '/add_drone/',  // Adjust this if your URL is different
  //         method: 'POST',
  //         data: {
  //             'total': total,
  //             'status': status,
  //             'csrfmiddlewaretoken': csrftoken
  //         },
  //         success: function (response) {
  //             //console.log('Success:', response.message);
  //             // Optionally alert the user
  //         },
  //         error: function (xhr, status, error) {
  //             console.error('Error:', error);
  //             // Optionally alert the user
  //         },
  //         complete: function () {
  //             // Clear the interval after saving data
  //             if (droneStatusInterval) {
  //                 clearInterval(droneStatusInterval);
  //                 droneStatusInterval = null; // Clear the reference
  //             }
  //         }
  //     });
  // }
//     function saveDroneData() {
      
//       var csrftoken = getCookie('csrftoken'); 
//       var total = $('#drone_traffic_value').text();
//       var status = $('#drone_traffic_status_values').text();
      
//       if(status  === "Heavy" || status === "ثقيل"){
//        status  === "Heavy"
       

//       }else if(status  === "Moderate" || status === "معتدل"){

//        status  === "Moderate"

//       }else if(status  === "Light" || status === "طبيعي"){

//        status = "Light"

//       }

//       $.ajax({
//           url: '/add_drone/',  // Adjust this if your URL is different
//           method: 'POST',
//           data: {
//               'total': total,
//               'status': status,
//               'csrfmiddlewaretoken': csrftoken
//           },
//           success: function(response) {
//               console.log('Success:', response.message);
//               // alert('Data saved successfully!'); // Optional: alert the user on success
//           },
//           error: function(xhr, status, error) {
//               console.error('Error:', error);
//               // alert('Failed to save data!'); // Optional: alert the user on failure
//           }
//       });
//   };

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

    
let droneStatusInterval = null;


$("#lunchDrone").on('click', function () {
    if ($(this).hasClass('btn-danger')) {
        $(".drone_status").text("Mission in Processing...");
        $(this).prop('disabled', true);
        $.ajax({
            url: 'http://127.0.1.1:18080/start',
            method: 'GET',
            success: function (response) {
                var statusArray = response.split(',');
                var jsonObject = {};

                function removeNonPrintable(str) {
                    return str.replace(/[^\x20-\x7E]+/g, '');
                }

                $.each(statusArray, function(index, value) {
                    var pair = value.split(':');
                    var key = removeNonPrintable(pair[0].trim());
                    var trimmedValue = removeNonPrintable(pair[1].trim());
                    jsonObject[key] = isNaN(trimmedValue) ? trimmedValue : parseInt(trimmedValue);
                });

                if (jsonObject.status == "started") {
                    // Toggle classes
                    $("#current_drone_status").text("ON");
                    $("#lunchDrone").toggleClass('bg-danger-subtle bg-success-subtle');
                    $("#lunchDrone").find('iconify-icon').toggleClass('text-danger text-success');
                    $(".drone_status").text("...Mission Started");

                    // Start the repeated calling of droneStatus()
                    droneStatusInterval = setInterval(function() {
                        droneStatus();
                    }, 2000);

                } else if (jsonObject.status == "failed") {
                    $(".drone_status").text("...Mission Failed");
                    // Stop the interval if the mission failed
                    if (droneStatusInterval) {
                        clearInterval(droneStatusInterval);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                $(".drone_status").text("...Click Again To Start Mission");

                // Stop the interval if an error occurred
                if (droneStatusInterval) {
                    clearInterval(droneStatusInterval);
                }
            }
        });
    } else {
        alert("Mission is already started!");
    }
});

//     $("#lunchDrone").on('click', function () {

//       if ($(this).hasClass('bg-danger-subtle')) {

//         $(".drone_status").text("Mission in Processing...");

//           $(this).prop('disabled', true);

//           $.ajax({
//               url: 'http://192.168.100.58:18080/start',
//               method: 'GET',
//               success: function (response) {

//               var statusArray = response.split(',');
//               var jsonObject = {};
//               function removeNonPrintable(str) {
//                 return str.replace(/[^\x20-\x7E]+/g, '');
//               }
//               $.each(statusArray, function(index, value) {
//                       // Split each key-value pair into key and value
//                       var pair = value.split(':');
//                       // Trim the key to remove any leading or trailing whitespace and remove non-printable characters
//                       var key = removeNonPrintable(pair[0].trim());
//                       // Trim the value to remove any leading or trailing whitespace and remove non-printable characters
//                       var trimmedValue = removeNonPrintable(pair[1].trim());
//                       // Assign the key-value pair to the jsonObject
//                       jsonObject[key] = isNaN(trimmedValue) ? trimmedValue : parseInt(trimmedValue);
//               });




//                   if (jsonObject.status=="started") {
//                       // Toggle classes
//                       $("#lunchDrone").toggleClass('bg-danger-subtle bg-success-subtle');
//                       $("#lunchDrone").find('iconify-icon').toggleClass('text-danger text-success');
//                       $(".drone_status").text("...Mission Started"); 
//                       droneStatus();

//                   }else if (jsonObject.status=="failed") {
//                     $(".drone_status").text("...Mission Failed");
//                   }
//               },
//               error: function (xhr, status, error) {
//                   console.error('Error:', error);
//                   // $("#lunchDrone").toggleClass('bg-danger-subtle bg-success-subtle');
//                   // $("#lunchDrone").find('iconify-icon').toggleClass('text-danger text-success');
//                   $(".drone_status").text("...Click Again To Start Mission");
//               }
//           });
//       } else {
//           alert("Mission is already started!");

//       }
// });
    function droneStatus() {
        $.ajax({
            url: 'http://192.168.100.58:18080/telemetry',
            method: 'GET',
            success: function (response) {
              //console.log('Telemetry API response:',response);
            var statusArray = response.split(',');
            var jsonObject = {};
            function removeNonPrintable(str) {
              return str.replace(/[^\x20-\x7E]+/g, '');
            }
            $.each(statusArray, function(index, value) {
                    // Split each key-value pair into key and value
                    var pair = value.split(':');
                    // Trim the key to remove any leading or trailing whitespace and remove non-printable characters
                    var key = removeNonPrintable(pair[0].trim());
                    // Trim the value to remove any leading or trailing whitespace and remove non-printable characters
                    var trimmedValue = removeNonPrintable(pair[1].trim());
                    // Assign the key-value pair to the jsonObject
                    jsonObject[key] = isNaN(trimmedValue) ? trimmedValue : parseFloat(trimmedValue);
            });

            $("#drone_alt").text(jsonObject.altitude_m);
            $("#drone_battery").text(jsonObject.battery_percentage);
            if(jsonObject.mission_status === "stop"){
              $("#current_drone_status").text("OFF");
              // saveDroneData();
            }
            // console.log(typeof(jsonObject));
            // console.log(jsonObject);
            // console.log(jsonObject.battery_voltage);
            // console.log(jsonObject.battery_percentage);
            // console.log(jsonObject.altitude_m);
            // console.log(jsonObject.arming_stat);

            },
            error: function (xhr, status, error) {
                console.error('Error Drone status:', error);
            }
        });

    };


      // -----------------------------------------------------------------------
  // Revenue Forecast
  // -----------------------------------------------------------------------

  var drone_chart = {
    series: [
      {
        name: "2023",
        data: [50, 60, 30, 55, 75, 60, 100, 120],
      }
    ],
    chart: {
      toolbar: {
        show: false,
      },
      type: "area",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 285,
      width: "100%",
      stacked: false,
      offsetX: -10,
    },
    colors: ["var(--bs-danger)"],
    plotOptions: {},
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 2,
      curve: "monotoneCubic",
    },
    grid: {
      show: true,
      padding: {
        top: 0,
        bottom: 0,
      },
      borderColor: "rgba(0,0,0,0.05)",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacityTo: 0.01,
        stops: [100],
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: [
        "9AM",
        "10AM",
        "11AM",
        "12AM",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM",
        "6PM",
        "7PM",
        "8PM",
        "9PM",
      
      ],
    },
    markers: {
      strokeColor: [
        "var(--bs-danger)",
        "var(--bs-secondary)",
        
      ],
      strokeWidth: 2,
    },
    tooltip: {
      theme: "dark",
    },
  };

  var drone_trafic_chart = new ApexCharts(
    document.querySelector("#drone_trafic_analysis"),
    drone_chart
  );
  drone_trafic_chart.render();



  $('#drone_filter').on('change', function(){
    $("#loaderrow").removeClass("d-none");
    const selectedDate = $(this).val();
    drone_traffic(selectedDate);
    $("#loaderrow").addClass("d-none");
    
  });
  function drone_traffic(date = '') {

    let url = '/drone_trafic/';
    if (date) {
      url += `?date=${date}`;
    }
    
      $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          //console.log(typeof(response))
          //console.log(response)
      
 
        updateDroneChart(drone_trafic_chart, response.time, response.traffic, drone_chart);
      },
        error: function() {
            console.log("error drone traffic");
        }
    });
  }
  get_drone_status();
  function get_drone_status() {
    let url = '/get_drone_status/';
   
    $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            //console.log(typeof(response));
            //console.log(response);
           // console.log("dir",dir);

            // Update these to match the field names from your Django view
            $("#drone_traffic_value").text(response.total_traffic);
            $("#drone_traffic_status_values").text(response.status);
            $("#drone_latest_Time").text(response.time);

            if(response.status  === "Heavy"){
              if (dir === "ltr") {
                $("#drone_traffic_status_values").text(response.status);
              }if(dir === "rtl"){
                $("#drone_traffic_status_values").text("ثقيل");
              }
             

            }else if(response.status  === "Moderate"){

              if (dir === "ltr") {
                $("#drone_traffic_status_values").text(response.status);
              }if(dir === "rtl"){
                $("#drone_traffic_status_values").text("معتدل");
              }

            }else if(response.status  === "Light"){

              if (dir === "ltr") {
                $("#drone_traffic_status_values").text(response.status);
              }if(dir === "rtl"){
                $("#drone_traffic_status_values").text("طبيعي");
              }

            }
            // Handle no data case if needed
            if (response.no_data_found_today) {
                console.log("No data found for today.");
            }
        },
        error: function() {
            console.log("error get drone status");
        }
    });
}

    function updateDroneChart( chartInstance, categories, seriesValues, chartOptions) {
      const $chartDiv = $(`#drone_trafic_analysis`);


    
      //console.log("drome",seriesValues.length)
      if (seriesValues.length === 0) {
        // Clear the chart div
        $chartDiv.empty();
        // Display "No data found" message
        $("#drone_error").text('No data found').addClass("text-danger");
        return;
      }
    
      // If chart instance is defined
      if (chartInstance) {
        // Update series data and x-axis categories in options
        chartOptions.series[0].data = seriesValues;
        chartOptions.xaxis.categories = categories;
    
        // Destroy the existing chart
        chartInstance.destroy();
        today()
        // Create a new chart instance with updated options
        var updatedChart = new ApexCharts(document.querySelector(`#drone_trafic_analysis`), chartOptions);
        updatedChart.render();
      } else {
        console.error("Chart instance is undefined.");
      }
    }

    function today(){
      var today = new Date();
      var options = { day: '2-digit', month: 'short', year: 'numeric' };
      var formattedDate = today.toLocaleDateString('en-US', options);
      $("#drone_error").text(formattedDate)
      
    }
 
  });