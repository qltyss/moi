$(document).ready(function() {   
    
    
    let isPageUpdate = true;
    var dir = sessionStorage.getItem('dir');


    $("#loaderrow").addClass("d-none");
    wrongparking('');

   
    console.log("initial page status",isPageUpdate)
    setInterval(() => {
        const selectedDate = $('#vehicle_filter').val();
        const todayDate = getTodayDate();
    

       
        if (selectedDate) {
            if (selectedDate === todayDate) {
                if(isPageUpdate){
                    console.log("Selected date is today. Calling functions.");
                    wrongparking('');
                }
                
            } else {
                console.log("Selected date is not today.");                
            }
        } else {
        
            console.log("now page status",isPageUpdate)
            if(isPageUpdate){
                wrongparking('');                
            }
        }
    }, 3000);



   
   
    $('#vehicle_filter').on('change', function(){
        $("#loaderrow").removeClass("d-none")
        const selectedDate = $(this).val();
        wrongparking(selectedDate);
   
        $("#loaderrow").addClass("d-none")
        
    });
  



    $(".getselectedtab").on('click', function(){
        isPageUpdate = true;
        wrongparking('');
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
        const selectedDate = $('#vehicle_filter').val();
        var todayDate = getTodayDate();
        if((selectedDate === todayDate) && page_number !== '1'){
            
            isPageUpdate = false
        }else if((selectedDate === todayDate) && page_number === '1'){
          
            isPageUpdate = true
        }
        console.log("page status",isPageUpdate)
        wrongparking(page_number);  // Fetch data for the clicked page
    });

    function wrongparking(pageNumber){
     
        var activeTab = $('.getselectedtab.active');
        var statusKey = activeTab.attr('data-status-key');  
        console.log('Active tab data-status-key:', statusKey);

        const selectedDate = $('#vehicle_filter').val();
        var date = selectedDate ? selectedDate : '';
        
        let url = '/wrongparking/';
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
        //alert(url)
       
        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                    console.log("wrong:",response)
                   
                        $("#wrongpark-counts").text(response.total_records)
                        if(statusKey === "unreported"){
                            appendTable(response.results,'unreported_panel')
                        }else if(statusKey === "reported"){
                            appendTable(response.results,'reported_panel');
                        }                    
                        renderPagination(response.pagination_html);
                        updateLang()
                  },
                  error: function() {
             
                     console.log("error")
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
        numplate:"Numplate",
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

      function initializeMagnificPopup() {
        $(".image-popup-vertical-fit").magnificPopup({
            type: "image",
            closeOnContentClick: true,
            mainClass: "mfp-img-mobile",
            image: {
                verticalFit: true,
            },
        });
    }
      function appendTable(employees, tbodyName) {
        // Clear the existing rows in the tbody
        $(`#${tbodyName}`).empty();
    
        // Display a message if no employees are found
        if (employees.length === 0) {
            if (dir === "ltr") {
                $(`#${tbodyName}`).append(`
                    <tr>
                        <td colspan="4" class="fw-bolder text-center">No data found</td>
                    </tr>
                `);
            } else if (dir === "rtl") {
                $(`#${tbodyName}`).append(`
                    <tr>
                        <td colspan="4" class="fw-bolder text-center">لاتوجد بيانات</td>
                    </tr>
                `);
            }
            return; // Exit the function early if no data is found
        }
    
        // Sort employees by time in descending order
        employees.sort((a, b) => {
            let timeA = new Date(a.time);
            let timeB = new Date(b.time);
            return timeB - timeA; // Sort in descending order (latest first)
        });
        console.log('Latest record:', employees);
    

        if (employees.length > 0) {

            // if (!filter_date || filter_date === todayDate) {
                employees.forEach(employee => {
                    // let panelId;
                    if(employee.status === 0){
                        tbodyName = "unreported_panel";
                    } else {
                        tbodyName = "reported_panel";
                    }
                
                    $(`#${tbodyName}`).append(`
                        <tr data-id=${employee.id}>
                            <td class="ps-0">
                                <div class="d-flex align-items-center gap-6">
                                 <a class="image-popup-vertical-fit" href="../static/assets/images/employee/${employee.emp_image}">
                                    <img src="../static/assets/images/employee/${employee.emp_image}" alt="${employee.emp_name}" width="48" class="rounded" />
                                    </a>
                                    <div>
                                        <h6 class="mb-0">${employee.emp_name}</h6>
                                        <span>${employee.emp_position}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="ps-0">
                                <div class="d-flex align-items-center gap-6">
                                 <a class="image-popup-vertical-fit" href="../static/assets/images/car_default.png">
                                    <img src="../static/assets/images/car_default.png" alt="${employee.name}" width="48" class="rounded" />
                                    </a>
                                    <div>
                                        <h6 class="mb-0">${employee.plate_text}</h6>
                                        <span>${employee.car_model} (${employee.color})</span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span class="badge text-capitalize  reporttoadmin ${
                                    tbodyName === 'reported_panel' ? 'bg-success-subtle text-success' :'bg-danger-subtle text-danger'
                                    
                                }">
                                ${tbodyName === 'reported_panel' ? 'Reported' : 'Report'}
                                </span>
                            </td>
                            <td dir="ltr">
                                <span>${replaceAlphabetWithSpace(employee.time)}</span>
                            </td>
                        </tr>
                    `);
                });
            // }
            initializeMagnificPopup();
        }
    }



    $(document).on('click', '.reporttoadmin', function() {

        var filterddate = $("#vehicle_filter").val();
        var textfile = $(this).text().trim();
        var todaydate = getnowdate();
       
        if((filterddate === "" || filterddate === todaydate) && textfile === "Report"){
            // alert("You can report it.");
       
             // Find the closest row to the clicked element
            let row = $(this).closest('tr');
        
            // Extract necessary data from the row
            let id = row.data('id'); // Assuming you have a data attribute for id on the row
            let empName = row.find('.emp-name').text(); // Example: adjust class and get actual class here
            let plateText = row.find('.plate-text').text(); // Example: adjust class and get actual class here
            let time = row.find('.time').text(); // Example: adjust class and get actual class here
        
            // AJAX request to update status
            $.ajax({
                url: `/update_wrongpakring/${id}/`, // Adjust URL based on your Django URL pattern
                type: 'POST',
                dataType: 'json',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // Fetch CSRF token from cookie
                },
                data: {
                
                    id: id // Send id to the backend
                },
                success: function(response) {
                    if (response.success) {
                        console.log(`Successfully updated status for ${empName}, ${plateText} at ${time} from 0 to 1`);
                        Swal.fire(
                            "Report  Status!",
                            "Report has been sent successfully",
                            "success"
                        );
                        row.find('.badge').text('Reported').removeClass('bg-danger-subtle text-danger').addClass('bg-success-subtle text-success');
                        row.remove();
        
                        // Append row to reported table
                        $('#reported_panel').append(row);
                    } else {
                        console.error('Failed to update status.');
                        Swal.fire(
                            "Report  Status!",
                            "Failed to update status",
                            "error"
                        );
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    Swal.fire(
                        "Report  Status!",
                        "Network Error",
                        "error"
                    );
                }
            });
        }else if (filterddate !== todaydate && textfile === "Reported") {
            alert("Report has been done already..");
        }else if (filterddate !== todaydate) {
            alert("You can't report it now.");
        }
    });

    function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if cookie name matches the CSRF token name
            if (cookie.substring(0, name.length + 1) === `${name}=`) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
    // function getTodayDate(mydate) {
        
    //     var today = '';
        
    //     if(mydate){
           
    //         updatedatenow = updateUserDate(mydate);
            
    //         return updatedatenow
    //     }else{
    //         today = new Date();
    //         const yyyy = today.getFullYear();
    //         const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    //         const dd = String(today.getDate()).padStart(2, '0');            
    //         return `${mm}-${dd}-${yyyy}`; 
    //     }
       
       
    // }
    
    function getTodayDate() {
        // Returns today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getnowdate(){
        today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); 
        const dd = String(today.getDate()).padStart(2, '0');            
        return `${yyyy}-${dd}-${mm}`; 
    }
    function replaceAlphabetWithSpace(inputString) {
        return inputString.replace(/[A-Za-z]/g, ' ');
    }
    $('#signout').on('click',function(event) {
        event.preventDefault();
        sessionStorage.clear();
       
       window.location.href = '/'; 
    });
    

   




  

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', '');
    }

});