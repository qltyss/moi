document.addEventListener("DOMContentLoaded", function () {

  
  // =====================================
  // Breakup
  // =====================================
  var options = {
    color: "#adb5bd",
    series: [60, 10,30],
    labels: ["2022", "2021"],
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

  var chart = new ApexCharts(document.querySelector("#breakup"), options);
  chart.render();
  });
