$(document).ready(function(){


 
          // var sessionToken = localStorage.getItem('sessionToken');
      // if (!sessionToken) {         
      //     window.location.href = 'signin.html';
      // }    
      $('#signout').on('click',function(event) {
        event.preventDefault();

        // localStorage.removeItem('sessionToken');
        sessionStorage.clear();
        // alert(sessionStorage.getItem("moitoken"))
       window.location.href = 'signin.html'; // Replace with your login page
    });


    drone_traffic();

    $("#lunchDrone").on('click', function () {

      if ($(this).hasClass('bg-danger-subtle')) {

        $(".drone_status").text("Mission in Processing...");

          $(this).prop('disabled', true);

          $.ajax({
              url: 'http://192.168.100.58:18080/start',
              method: 'GET',
              success: function (response) {

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
                      jsonObject[key] = isNaN(trimmedValue) ? trimmedValue : parseInt(trimmedValue);
              });

              // console.log(typeof(jsonObject));
              // console.log(jsonObject);
              // console.log(jsonObject.status);
              // console.log(jsonObject.is_battery_charged);
              // console.log(jsonObject.is_mission_started);
              // console.log(jsonObject.is_rtk_fixed);


                  if (jsonObject.status=="started") {
                      // Toggle classes
                      $("#lunchDrone").toggleClass('bg-danger-subtle bg-success-subtle');
                      $("#lunchDrone").find('iconify-icon').toggleClass('text-danger text-success');
                      $(".drone_status").text("...Mission Started"); 
                      droneStatus();

                  }else if (jsonObject.status=="failed") {
                    $(".drone_status").text("...Mission Failed");
                  }
              },
              error: function (xhr, status, error) {
                  console.error('Error:', error);
                  // $("#lunchDrone").toggleClass('bg-danger-subtle bg-success-subtle');
                  // $("#lunchDrone").find('iconify-icon').toggleClass('text-danger text-success');
                  $(".drone_status").text("...Click Again To Start Mission");
              }
          });
      } else {
          alert("Mission is already started!");

      }
});
    function droneStatus() {
        $.ajax({
            url: 'http://192.168.100.58:18080/telemetry',
            method: 'GET',
            success: function (response) {
              console.log('Telemetry API response:',response);
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
            $("#drone_bat").text(jsonObject.battery_percentage);
            console.log(typeof(jsonObject));
            console.log(jsonObject);
            console.log(jsonObject.battery_voltage);
            console.log(jsonObject.battery_percentage);
            console.log(jsonObject.altitude_m);
            console.log(jsonObject.arming_stat);

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
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
     
    const selectedDate = $(this).val();
    drone_traffic(selectedDate);
    
    
  });
  function drone_traffic(date = '') {

    let url = '/drone_trafic/';
    if (date) {
      url += `?date=${date}`;
    }
    $("#loaderrow").addClass("d-none");
      $.ajax({
        url: url,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          console.log(typeof(response))
          console.log(response)
      
 
        updateDroneChart(drone_trafic_chart, response.time, response.traffic, drone_chart);
      },
        error: function() {
            console.log("error");
        }
    });
  }

    function updateDroneChart( chartInstance, categories, seriesValues, chartOptions) {
      const $chartDiv = $(`#drone_trafic_analysis`);


    
      console.log("drome",seriesValues.length)
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