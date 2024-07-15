$(document).ready(function() {      
    $("#loaderrow").addClass("d-none");
  
    get_empInfo();


    setInterval(() => {
        const selectedDate = $('#vehicle_filter').val();
        const todayDate = getTodayDate();
    
        console.log("Selected Date:", selectedDate);
        console.log("Today's Date:", todayDate);
    
        if (selectedDate) {
            if (selectedDate === todayDate) {
                console.log("Selected date is today. Calling functions.");
                //carplate('');
                get_empInfo();
            } else {
                console.log("Selected date is not today.");
            }
        } else {
            // No date selected, call the functions with empty date
            console.log("No date selected. Calling functions.");
            //carplate('');
            get_empInfo();
        }
    }, 5000);
    var dir = sessionStorage.getItem('dir');
   
    $('#vehicle_filter').on('change', function(){
        $("#loaderrow").removeClass("d-none")
        const selectedDate = $(this).val();
        get_empInfo(selectedDate);
        //carplate(selectedDate);
        $("#loaderrow").addClass("d-none")
        
    });
  

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



      function get_empInfo(date = ''){
     
 
        let url = '/employees/';
        if (date) {
            url += `?date=${date}`;
        }
        // console.log(url)
       
        $.ajax({
                  url:  url, 
                  method: 'GET',                    
                  contentType: 'application/json',
                  success: function(response) {
                    console.log("Emp-info:",response)
                   
                                          
                    appendEditEmp(response)
              
                        
                    
                      
                 
                    
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
    
   





    function appendEditEmp(entries) {
        console.log("now enteres", entries)
        var panel = $("#editEmpanels");
   
        if (entries.length === 0) {
          
            if(dir === "ltr"){
                
                panel.empty().append('<tr style="text-align: center !important; color: #adb5bd;" ><td colspan="5">No detections recorded today</td></tr>');
                return
            }
            else{
                panel.empty().append('<tr style="text-align: center !important; color: #adb5bd;" ><td colspan="5">لم يتم تسجيل أي اكتشافات اليوم</td></tr>');
                return;
            } 
        }
        let counter = 1;
        panel.empty()
        entries.forEach(function(entry) {
            `<button type="button" class="btn mb-1 bg-primary-subtle text-primary px-4 fs-4 " data-bs-toggle="modal" data-bs-target="#signup-modal">
                      <i class="ti ti-lock fs-5 text-center d-block"></i>
                      Sign Up Modal
                    </button>`
     
    
            var html = `
                <tr data-id="${entry.id}">    
                        <td>
                        <p id="counter" data-emp-id="${entry.id}">${counter}</p>
                        <input type="hidden" id="emp_id" value="${entry.id}" />
                        </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <img src="../static/assets/images/employee/${entry.image}" class="rounded-circle" width="40" height="40" />
                            
                              <div class="ms-3">
                                <h6 class="fs-4 fw-semibold mb-0 emp_name" >${entry.name}</h6>
                                <span class="fw-normal emp_position">${entry.position}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                           

                            
                            <p class="fw-bold emp_Status text-capitalize">
                                     ${entry.status}
                                </p>
                          </td>
                           
                         <td>
                                <p class="btn bg-warning-subtle text-warning" id="edit_emp" data-bs-toggle="modal" data-bs-target="#editemp-modal" ><i class="ti ti-pencil fs-5"></i></p>
                         </td>
                         <td>
                                <p class="btn bg-danger-subtle text-danger" id="del_emp"><i class="ti ti-trash fs-5"></i></p>
                         </td>
                         
                        </tr>
            `;


            panel.append(html);
            counter++;
        });
    }

    $(document).on('click', '#edit_emp', function() {

   
        // Find the closest table row
        var row = $(this).closest('tr');
        
        // Extract data from the row
        var empId = row.find('input#emp_id').val();
       
        var empName = row.find('.emp_name').text();
        var empPosition = row.find('.emp_position').text();
        var empStatus = row.find('.emp_Status').text().trim().toLowerCase(); // Make sure it's in lowercase

        // Populate the modal fields with extracted data
        $('#editemp-modal').find('#name').val(empName);
        $('#editemp-modal').find('#position').val(empPosition);
        console.log("staths",empStatus)
        // Set the status dropdown value
        $('#editemp-modal').find('#empstatus').val(empStatus);
        $('#editemp-modal').find('#emp_id').val(empId);
       

    });

    
    $(document).on('click', '#update_emp', function(e) {
        e.preventDefault();
    
        // Get the employee ID and updated details from the modal
        var empId = $('#editemp-modal').find('#emp_id').val();
        var empName = $('#editemp-modal').find('#name').val();
        var empPosition = $('#editemp-modal').find('#position').val();
        var empStatus = $('#editemp-modal').find('#empstatus').val();
    
        // Log the details (can be removed later)
        console.log('Employee ID:', empId);
        console.log('Name:', empName);
        console.log('Position:', empPosition);
        console.log('Status:', empStatus);
        // empId ="1720966263795";
   
        $.ajax({
            url: 'http://192.168.100.161:3005/edit_face/',  // Replace with your actual URL
            // url: 'http://localhost:3000/update-employee',  // Replace with your actual URL
            method: 'POST',
            data: {
                id: empId,
                name: empName,
                position: empPosition,
                status: empStatus
            },
            success: function(response) {
                // Handle success response
                console.log('Update successful:', response.message);

                if(response.message === "invalid input"){
                    Swal.fire({
                        type: "error",
                        title: "Invalid Input",
                        text: "Please Check Your Name, Position or Status",
                       
                      });
                    console.log('invalid:', response.message);

                }else if(response.message === "Employee not found"){

                    Swal.fire({
                        type: "error",
                        title: "Employee Error",
                        text: "Employee not found",
                       
                      });

                    console.log('emp not found:', response.message);
                }else if(response.message === "Employee details updated successfully"){
                    // Update the specific row in the table
                    var row = $('tr[data-id="' + empId + '"]');
                                    
                    if (row.length > 0) {
                        row.find('.emp_name').text(empName);
                        row.find('.emp_position').text(empPosition);
                        row.find('.emp_Status').text(empStatus); // Capitalize the first letter
                    }
                    Swal.fire(
                        "Employee Status!",
                        "Employee details updated successfully",
                        "success"
                      );
                    // Optionally close the modal
                    $('#editemp-modal').modal('hide');
                }
    
                
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error('Update failed:', error);
                alert("Error: Error in Updating Employee data")
            }
        });
    });




    $(document).on('click', '#del_emp', function() {
        var $row = $(this).closest('tr');
        var empId = $row.find('#counter').data('emp-id');
        empId = String(empId);
        // Confirm deletion if necessary
        if (!confirm('Are you sure you want to delete this employee?')) {
            return;
        }
        // Send the employee ID in the body of a POST request with DELETE action
        // empId = "17209656735865";
        $.ajax({
           
            // url: ` http://localhost:3000/delete-employee`,
            url: `http://192.168.100.161:3005/delete_face/`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: empId
            }),
            success: function(response) {
                    console.log(typeof(response)); // Log the response for debugging
                    console.log(response); // Log the response for debugging
                    console.log(response.message); // Log the response for debugging

                    Swal.fire(
                        "Employee!",
                        "Employee delete successfully",
                        "success"
                      );
                      $row.remove();
              
            },
            error: function(xhr, status, error) {
                console.error(error); // Log error for debugging
                Swal.fire(
                    "Employee!",
                    "An error occurred while deleting the employee. Please try again.",
                    "warning"
                );
                console.log('An error occurred while deleting the employee. Please try again.');
            }
        });
    });
    


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

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', '');
    }

});