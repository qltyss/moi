$(document).ready(function() {      




  dashboardData('');


  function dashboardData(date = ''){
      let url = '/dashboard_data/';
      if (date) {
          url += `?date=${date}`;
      }
      $.ajax({
                url:  url, 
                method: 'GET',                    
                contentType: 'application/json',
                success: function(response) {
                     console.log(response)
                    $("#dwrong_parking").text(response.wrongparking)
                    $("#dtotal_person").text(response.person)
                    $("#dtotal_trafic").text(response.drone)
                },
                error: function() {
                   
                   console.log("error")
                }
            });
  }
    
  //=====================================
  // Theme Onload Toast
  //=====================================
  window.addEventListener("load", () => {
    let myAlert = document.querySelectorAll('.toast')[0];
    if (myAlert) {
      let bsAlert = new bootstrap.Toast(myAlert);
      bsAlert.show();
    }
  })
  
  // -----------------------------------------------------------------------
  // Total settlements
  // -----------------------------------------------------------------------
  var settlements = {
    series: [
      {
        name: "settlements",
        data: [
          40, 40, 80, 80, 30, 30, 10, 10, 30, 30, 100, 100, 20, 
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

  var chart_area_spline = new ApexCharts(
    document.querySelector("#settlements"),
    settlements
  );
  chart_area_spline.render();
});
