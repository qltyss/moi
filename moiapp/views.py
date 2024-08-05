import json
import os
import random
import string
import base64
from datetime import date

import cv2
import numpy as np
import requests
import torch
from ultralytics import YOLO

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Count, Avg
from django.http import JsonResponse, StreamingHttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators import gzip

from .models import Employee, DetectionLog, WrongParking, Drone
from django.http import HttpResponse
import re
import time

from django.http import JsonResponse
from django.db.models import Count, Sum
from .models import Employee, WrongParking, Drone  # Adjust import according to your project structure
from datetime import datetime, timedelta
from django.db.models import F
from django.shortcuts import get_object_or_404, redirect
from django.db.models import Q
from django.db.models import Max
from django.core.files.base import ContentFile
from django.conf import settings
from django.http import HttpResponse
import re
def index(request):
    return render(request, 'signin.html')

def signup(request):
    return render(request, 'signup.html')

@login_required
def drone(request):
    return render(request, 'drone.html')

@login_required
def amr(request):
    return render(request, 'amr.html')

@login_required
def addface(request):
    return render(request, 'addface.html')

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def facedetection(request):
    return render(request, 'detection.html')

@login_required
def editemp(request):
    return render(request, 'editEmp.html')


def dashboard_data(request):
    # Get start and end dates from request parameters
    start_date_str = request.GET.get('start_date', '')
    end_date_str = request.GET.get('end_date', '')

    # Parse dates and add one day to end_date to include it fully
    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    else:
        start_date = None

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
    else:
        end_date = None

    # Construct the response data
    response_data = {
        'person': 0,
        'wrongparking': 0,
        'drone': 0,        
        'drone_latest_status': None  
    }

    if start_date and end_date:
        # Perform filtering based on start and end dates
        total_employees = DetectionLog.objects.filter(time__gte=start_date, time__lt=end_date).count()
        wrongparking_count = WrongParking.objects.filter(time__gte=start_date, time__lt=end_date).count()
        drone_total = Drone.objects.filter(time__gte=start_date, time__lt=end_date).aggregate(total_sum=Sum('total'))['total_sum']
    else:
        # If no dates are provided, get overall counts
        total_employees = DetectionLog.objects.count()
        wrongparking_count = WrongParking.objects.count()
        drone_total = Drone.objects.aggregate(total_sum=Sum('total'))['total_sum']

    # Update the response dictionary with actual counts from the queries
    response_data['person'] = total_employees
    response_data['wrongparking'] = wrongparking_count
    response_data['drone'] = drone_total or 0

    # Get today's date
    today = datetime.today().date()

    # Get the latest drone status for today
    latest_drone_entry = Drone.objects.order_by('-time').first()
    
    # Update drone_latest_status in the response data
    if latest_drone_entry:
        response_data['drone_latest_status'] = latest_drone_entry.status

    return JsonResponse(response_data)

def dashboard_face_count(request):
    if request.method == 'GET':
        start_date_str = request.GET.get('start_date', '')
        end_date_str = request.GET.get('end_date', '')

        # Parse dates and add one day to end_date to include it fully
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        else:
            start_date = None

        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
        else:
            end_date = None

        # Filter DetectionLog entries for the given date range
        detection_logs = DetectionLog.objects.all()

        if start_date and end_date:
            detection_logs = detection_logs.filter(time__range=(start_date, end_date))

        # Aggregate emp_ids and count occurrences
        emp_id_counts = detection_logs.values('emp_id').annotate(count=Count('emp_id'))

        # Initialize counts
        white_count = 0
        black_count = 0
        unknown_count = 0

        # Iterate over emp_id_counts to count statuses
        for entry in emp_id_counts:
            emp_id = entry['emp_id']
            count = entry['count']

            # Count statuses from Employee model for the emp_id
            white_count += Employee.objects.filter(status='white', id=emp_id).count() * count
            black_count += Employee.objects.filter(status='black', id=emp_id).count() * count
            unknown_count += Employee.objects.filter(status='unknown', id=emp_id).count() * count

        # Prepare response data in the specified format
        response_data = {
            'white': white_count,
            'black': black_count,
            'unknown': unknown_count,
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

api_response = None

def process_stream(rtsp_url, api_endpoint):
    cap = cv2.VideoCapture(rtsp_url)

    if not cap.isOpened():
        print("Error: Unable to open RTSP stream")
        return

    global api_response

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        _, buffer = cv2.imencode('.jpg', frame)
        base64_img = base64.b64encode(buffer).decode('utf-8')

       # Print base64 encoded image data
      
        base64_img_with_prefix = "data:image/jpeg;base64," + base64_img
        # print(base64_img_with_prefix)  # Print base64 encoded image data with prefix

        payload = {'image': base64_img_with_prefix}
       
        try:
            response = requests.post(api_endpoint, json=payload)
            response.raise_for_status()  # Raise an error for bad status codes
            api_response = response.json()
            print(api_response)
        except requests.exceptions.RequestException as e:
            print(f"Error sending request: {e}")
            api_response = None  # Set api_response to None in case of error

# rtsp_url = "rtsp://admin:QSS2030QSS@192.168.100.208/Streaming/Channels/101/"

def run_face_detection(request):
    rtsp_url = "rtsp://admin:QSS2030QSS@192.168.100.208/Streaming/Channels/101/"
    api_endpoint = "http://172.20.10.2:3005/face_recognition"
    process_stream(rtsp_url, api_endpoint)


def scan_face_result(request):
    
    # Assuming api_response is a global variable
    global api_response
    
    print("scan_face_result_data:",api_response)
    return JsonResponse({'api_response': api_response})

def gen(camera):
    while True:
        ret, frame = camera.read()
        if not ret:
            break
        _, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def amr_front(request):
    rtsp_url = "rtsp://admin:QSS2030QSS@192.168.100.208/Streaming/Channels/101/"  # Replace with your RTSP stream URL
    cap = cv2.VideoCapture(rtsp_url)
    return StreamingHttpResponse(gen(cap),
                                 content_type='multipart/x-mixed-replace; boundary=frame')


# Function to stream webcam frames
def stream():
    # Initialize video capture object
    cap = cv2.VideoCapture("wrong_parking.mp4")

    # Check if the webcam is opened successfully
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return

    while True:
        # Read frame from the webcam
        ret, frame = cap.read()

        if not ret:
            break

        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)

        # Yield the frame in bytes
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# Amr front view
def amr_back(request):
    # Return streaming HTTP response
    return StreamingHttpResponse(stream(), content_type='multipart/x-mixed-replace; boundary=frame')


def wrongparking(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        status = request.GET.get('status')  # Fetch the status parameter
        
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()
        
        # Determine the status filter based on the 'status' parameter
        if status == 'unreported':
            status_filter = 0
        elif status == 'reported':
            status_filter = 1
        else:
            status_filter = None  # Handle 'all' or other cases
        
        # Apply filters based on the determined status_filter
        wrongparking = WrongParking.objects.filter(time__date=query_date)
        
        if status_filter is not None:
            wrongparking = wrongparking.filter(status=status_filter)
        
        # Get the total number of records before pagination
        total_records = wrongparking.count()
        # Annotate and select specific fields for JSON response
        wrongparking = wrongparking.order_by('-time').annotate(
            emp_name=F('emp__name'),
            emp_position=F('emp__position'),
            emp_image=F('emp__image')
        ).values(
            'id', 'emp_id', 'emp_name', 'emp_position', 'emp_image','car_model', 'color', 'plate_text', 'status', 'image', 'time'
        )
        
        # Pagination
        paginator = Paginator(wrongparking, 3)  # Show 3 records per page
        page_number = request.GET.get('page', 1)
        
        try:
            paginated_wrongparking = paginator.page(page_number)
        except PageNotAnInteger:
            paginated_wrongparking = paginator.page(1)  # If page is not an integer, deliver first page
        except EmptyPage:
            paginated_wrongparking = paginator.page(paginator.num_pages)  # If page is out of range, deliver last page
        
        # Prepare JSON response
        data = {
            'results': list(paginated_wrongparking),
            'pagination_html': get_pagination_html(paginated_wrongparking), 
            'total_records': total_records
        }
        
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'},status=400)


def update_wrongpakring(request, pk):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if request.method == 'POST':
            # Retrieve the WrongParking object
            wrong_parking = get_object_or_404(WrongParking, pk=pk)

            # Update status from 0 to 1
            wrong_parking.status = 1
            wrong_parking.save()

            # Return JSON response indicating success
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=400)
    else:
        return JsonResponse({'error': 'Forbidden'}, status=403)  


def get_employee_info_old(request):
    employee_list = Employee.objects.all()  # Query all employees

    # Pagination
    page = request.GET.get('page',1)  # Get the page number from the request
    paginator = Paginator(employee_list, 5)  # Show 5 employees per page

    try:
        employees = paginator.page(page)
    except PageNotAnInteger:
        employees = paginator.page(1)  # If page is not an integer, deliver first page
    except EmptyPage:
        employees = paginator.page(paginator.num_pages)
          # If page is out of range, deliver last page

    # Prepare data for JSON response
    data = {
        'results': list(employees.object_list.values()),  # Convert QuerySet to list of dictionaries
        'pagination_html': get_pagination_html(employees),  # Custom function to get pagination HTML
    }
    return JsonResponse(data)


def get_pagination_html(employees):
    # Custom function to generate pagination HTML
    pagination_html = '<nav aria-label="Page navigation"><ul class="pagination">'

    if employees.has_previous():
        pagination_html += f'<li class="page-itemss"><a class="page-link" data-lang-key="first" href="?page=1" >أولاً</a></li>'
        pagination_html += f'<li class="page-itemss"><a class="page-link" data-lang-key="previous"  href="?page={employees.previous_page_number()}">سابق</a></li>'

    pagination_html += f'<li class="page-itemss"><span class="page-link current"><span data-lang-key="page"> صفحة</span> {employees.number} <span data-lang-key="of"> من </span> {employees.paginator.num_pages}</span></li>'

    if employees.has_next():
        pagination_html += f'<li class="page-itemss"><a class="page-link" data-lang-key="next" href="?page={employees.next_page_number()}">التالي</a></li>'
        pagination_html += f'<li class="page-itemss"><a class="page-link" data-lang-key="last" href="?page={employees.paginator.num_pages}">آخر</a></li>'

    pagination_html += '</ul></nav>'

    return pagination_html


def current_face_detection(request):
    if request.method == 'GET':
        # Get today's date
        today = datetime.today().date()

        # Filter DetectionLog entries for today and order by time in descending order
        log = DetectionLog.objects.filter(time__date=today).select_related('emp').order_by('-time').values(
            'emp__id', 'emp__name', 'emp__status', 'emp__image', 'emp__position', 'time'
        ).first()

        # Prepare JSON response
        if log:
            return JsonResponse(log, safe=False)
        else:
            return JsonResponse({'message': 'No data found for today'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_employee_info(request):
    if request.method == 'GET':
        # Extract date and status parameters from GET request
        status = request.GET.get('status')
        date_str = request.GET.get('date')
        
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()

        # Filter DetectionLog entries based on the date and optionally on status
        logs = DetectionLog.objects.filter(time__date=query_date)

        if status and status != 'all':
            logs = logs.filter(emp__status=status)

        # Select related emp fields and specific fields from DetectionLog
        logs = logs.select_related('emp').values(
            'emp_id', 'emp__name', 'emp__status', 'emp__image', 'emp__position',
            'plate_text', 'time', 'car_color', 'car_model'
        ).order_by('-time')

        # Pagination
        paginator = Paginator(logs, 3)  # Show 3 logs per page
        page_number = request.GET.get('page', 1)

        try:
            paginated_logs = paginator.page(page_number)
        except PageNotAnInteger:
            paginated_logs = paginator.page(1)  # If page is not an integer, deliver first page
        except EmptyPage:
            paginated_logs = paginator.page(paginator.num_pages)  # If page is out of range, deliver last page

        # Prepare JSON response
        data = {
            'results': list(paginated_logs.object_list),
            'pagination_html': get_pagination_html(paginated_logs),  # Assuming get_pagination_html function is defined
        }
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

def dashboard_latest_records(request):
    # Get the maximum times for today from DetectionLog
    max_times_today = DetectionLog.objects.filter(
        time__date=date.today()
    ).values('time').annotate(max_time=Max('time')).order_by('-max_time')[:3]

    # Get the latest DetectionLog records for today based on the maximum times
    latest_records = DetectionLog.objects.filter(
        time__in=[max_time['max_time'] for max_time in max_times_today]
    )

    if latest_records.exists():
        # Serialize the records to JSON
        serialized_records = [
            {
                'id': record.id,
                'employee_name': record.emp.name,  # Accessing Employee's name
                'employee_status': record.emp.status,  # Accessing Employee's status
                'employee_image': record.emp.image,  # Accessing Employee's status
                'plate_text': record.plate_text,
                'car_color': record.car_color,
                'car_model': record.car_model,
                'time': record.time.strftime('%H:%M:%S')
            }
            for record in latest_records
        ]
        return JsonResponse(serialized_records, safe=False)
    else:
        return JsonResponse({'message': 'No records found for today'})

def dashboard_latest_records_old(request):
    # Get the maximum times for today
    max_times_today = Employee.objects.filter(
        time__date=date.today()
    ).values('time').annotate(max_time=Max('time')).order_by('-max_time')[:3]

    # Get the latest records for today based on the maximum times
    latest_records = Employee.objects.filter(
        time__in=[max_time['max_time'] for max_time in max_times_today]
    )

    if latest_records:
        # Serialize the records to JSON
        serialized_records = [
            {'id': record.id, 'name': record.name,'status':record.status, 'time': record.time.strftime('%H:%M:%S')}
            for record in latest_records
        ]
        return JsonResponse(serialized_records, safe=False)
    else:
        return JsonResponse({'message': 'No records found for today'})


def dashboard_trafic(request):
    if request.method == 'GET':
        query_date = date.today()

        # Filter drones by the date part of the datetime field
        today_traffic = Drone.objects.filter(time__date=query_date).values('total', 'time')

        if not today_traffic:
            # If no data for today, get the latest available data
            latest_traffic = Drone.objects.all().order_by('-time').values('total', 'time')
            if latest_traffic:
                latest_day = latest_traffic.first()['time'].date()
                latest_traffic = latest_traffic.filter(time__date=latest_day)
            else:
                latest_traffic = []

            traffic = [entry['total'] for entry in latest_traffic]
            time = [entry['time'].strftime("%H:%M") for entry in latest_traffic]
        else:
            traffic = [entry['total'] for entry in today_traffic]
            time = [entry['time'].strftime("%H:%M") for entry in today_traffic]

        response_data = {
            'traffic': traffic,
            'time': time
        }
        
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

# 
def get_drone_status(request):
    if request.method == 'GET':
        today = date.today()
        latest_drone = Drone.objects.filter(time__date=today).order_by('-time').first()
        
        if latest_drone is not None:
            # Format the time as "9 Feb 2024 1:35 PM"
            formatted_time = latest_drone.time.strftime('%d %b %Y %I:%M %p')
            
            response_data = {
                'total_traffic': latest_drone.total,  # Renamed to total_traffic
                'status': latest_drone.status,
                'time': formatted_time
            }
        else:
            # No data found for today
            response_data = {
                'total_traffic': 0,  # Changed to total_traffic
                'status': 'none',
                'time': 'none',
                'no_data_found_today': True
            }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
# @require_http_methods(["POST"])
# def add_drone(request):
#     # Extract data from request
#     total = request.POST.get('total')
#     status = request.POST.get('status')
#     drone = Drone(total=total, status=status)
#     drone.save()
#     # Return a response
#     return JsonResponse({'message': 'Drone added successfully', 'id': drone.id})

# lateste day record

def drone_trafic(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')

        if date_str:
            # Parse the provided date
            query_date = parse_date(date_str)
            # Filter drones by the specific date
            specific_date_traffic = Drone.objects.filter(time__date=query_date).values('total', 'time')

            if specific_date_traffic.exists():
                # Prepare the response data for the specified date
                traffic = [entry['total'] for entry in specific_date_traffic]
                time = [entry['time'].strftime("%H:%M") for entry in specific_date_traffic]
                
                response_data = {
                    'date': query_date.strftime('%Y-%m-%d'),
                    'traffic': traffic,
                    'time': time
                }
            else:
                response_data = {
                    'date': query_date.strftime('%Y-%m-%d'),
                    'traffic': [],
                    'time': []
                }
            
            return JsonResponse(response_data)
        
        else:
            # No specific date provided, check for today's data
            query_date = date.today()
            today_traffic = Drone.objects.filter(time__date=query_date).values('total', 'time')

            if not today_traffic.exists():
                # If no data is found for today, get the latest available data
                latest_record = Drone.objects.latest('time')
                query_date = latest_record.time.date()
                today_traffic = Drone.objects.filter(time__date=query_date).values('total', 'time')

            # Prepare the response data
            traffic = [entry['total'] for entry in today_traffic]
            time = [entry['time'].strftime("%H:%M") for entry in today_traffic]

            response_data = {
                'date': query_date.strftime('%Y-%m-%d'),
                'traffic': traffic,
                'time': time
            }

            return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)




def save_emp_image(request):
    if request.method == 'POST':
        imgname = request.POST.get('name')
        img_data = request.POST.get('img_data')

        try:
            # Decode base64 image data
            format, imgstr = img_data.split(';base64,')
            ext = format.split('/')[-1]
            img_data = base64.b64decode(imgstr)

            # Save the image directly into moiapp/static/assets/images/employee folder
            save_path = os.path.join(settings.BASE_DIR, 'moiapp', 'static', 'assets', 'images', 'employee', imgname + '.' + 'jpg')
            with open(save_path, 'wb') as f:
                f.write(img_data)

            return JsonResponse({'success': True})
        except Exception as e:
            print("Error saving image:", e)
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False})


def update_settings(request, direction):
    # Validate direction
    print(direction)
    if direction not in ['ltr', 'rtl']:
        return JsonResponse({'status': 'error', 'message': "Direction should be 'ltr' or 'rtl'"}, status=400)

    # Define the file path
    js_file_path = os.path.join(settings.BASE_DIR, 'moiapp', 'static', 'assets', 'js', 'theme', 'app.init.js')

    # Check if the file exists
    if not os.path.exists(js_file_path):
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    # Read and update the file content
    try:
        with open(js_file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Determine the current direction and replace it
        if 'Direction: "rtl"' in content:
            updated_content = content.replace('Direction: "rtl"', f'Direction: "{direction}"')
        elif 'Direction: "ltr"' in content:
            updated_content = content.replace('Direction: "ltr"', f'Direction: "{direction}"')
        else:
            return JsonResponse({'status': 'error', 'message': 'Direction setting not found in file'}, status=400)

        # Write the updated content back to the file
        with open(js_file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)

        return JsonResponse({'status': 'success', 'message': 'Successfully updated app.init.js'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error updating file: {e}'}, status=500)


def facestatus_count_old(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()
        
        # Filter by the date part of the datetime field
        white_count = Employee.objects.filter(status='white', time__date=query_date).count()
        black_count = Employee.objects.filter(status='black', time__date=query_date).count()
        unknown_count = Employee.objects.filter(status='unknown', time__date=query_date).count()
        
        response_data = {
            'white': white_count,
            'black': black_count,
            'unknown': unknown_count,
        }
        # print(response_data)
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

def facestatus_count(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()
        
        # Filter DetectionLog entries for the given date
        detection_logs = DetectionLog.objects.filter(time__date=query_date)
        
        # Aggregate emp_ids and count occurrences
        emp_id_counts = detection_logs.values('emp_id').annotate(count=Count('emp_id'))
        
        # Initialize counts
        white_count = 0
        black_count = 0
        unknown_count = 0
        
        # Iterate over emp_id_counts to count statuses
        for entry in emp_id_counts:
            emp_id = entry['emp_id']
            count = entry['count']
            
            # Count statuses from Employee model for the emp_id
            white_count += Employee.objects.filter(status='white', id=emp_id).count() * count
            black_count += Employee.objects.filter(status='black', id=emp_id).count() * count
            unknown_count += Employee.objects.filter(status='unknown', id=emp_id).count() * count
        
        # Prepare response data in the specified format
        response_data = {
            'white': white_count,
            'black': black_count,
            'unknown': unknown_count,
        }
        
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def create_user_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not (name and email and password):
            return JsonResponse({'message': 'All fields are required'}, status=400)

        try:
            user = User.objects.create_user(username=email, email=email, password=password)
            user.first_name = name
            user.save()
            return JsonResponse({'message': 'User created successfully!'})
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def signin_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            user = authenticate(username=email, password=password)
            if user is not None:
                login(request, user)  # Log the user in by creating a session
                token = get_token(request)  # Generate CSRF token for the session
                response_data = {
                    'email': user.email,
                    'first_name': user.first_name,
                    'token': token,
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    
@csrf_exempt
def signout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Sign out successful'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

# Dania's code
model_road = YOLO("models/moi2-m.pt")
model_vehicles = YOLO("models/yolov8l-seg.pt")

# Global variables
Capacity_number = 20
total_current_vehicles_count = 0
final_result = ""
total_vehicles_count = 0
allTrafficData = {
    "Capacity": Capacity_number,
    "Number_of_Current_Vehicles": total_current_vehicles_count,
    "final_result": final_result,
    "Number_of_total_vehicles": total_vehicles_count
}
trigg = 0  # Default state, detection is off
TRAFFIC_DATA_FILE = 'traffic_data.json'


def print_device_info():
    try:
        print(f"CUDA Available: {torch.cuda.is_available()}")
        print(f"CUDA Device Count: {torch.cuda.device_count()}")
    except Exception as e:
        print(f"Failed to get device info: {e}")


@csrf_exempt
@gzip.gzip_page
def turn_on(request):
    global trigg  # Declare trigg as global to modify the global variable
    print("Endpoint '/on' was triggered!")
    trigg = 1
    return JsonResponse({'value': trigg})


@csrf_exempt
@gzip.gzip_page
def turn_off(request):
    global trigg  # Declare trigg as global to modify the global variable
    print("Endpoint '/off' was triggered!")
    trigg = 2
    return JsonResponse({'value': trigg})


def Calculate_crowding_rate(number_of_vehicles):
    global Capacity_number
    traffic = 0.80 * Capacity_number
    moderate_traffic = 0.50 * Capacity_number
    no_traffic = 0.25 * Capacity_number

    final_result = "---"
    if number_of_vehicles >= traffic:
        final_result = "Heavy"
    elif number_of_vehicles <= moderate_traffic and number_of_vehicles >= no_traffic:
        final_result = "Moderate"
    elif number_of_vehicles <= no_traffic:
        final_result = "Light"

    return final_result


class_colors = {
    1: (255, 0, 0),  # Blue
    2: (13, 169, 29),  # Green
    3: (0, 0, 255),  # Red
    # 5: (255, 255, 0),  # Cyan
}

@csrf_exempt
@gzip.gzip_page
def video_feed_html(request):
    frame_skip = 5
    resize_scale = 0.5
    cap = cv2.VideoCapture('10.mp4')

    def generate_frames():
        global trigg  # Declare trigg as global to modify it within this function

        print_device_info()
        frame_count = 0
        unique_track_ids = set()  # Set to store unique track IDs

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame from live feed.")
                break
            frame_count += 1
            if frame_count % frame_skip != 0:
                continue

            if trigg == 1:  # Start processing frames only when trigg is 1
                frame = cv2.resize(frame, None, fx=resize_scale, fy=resize_scale, interpolation=cv2.INTER_LINEAR)
                # Perform road segmentation
                seg_results = model_road.predict(frame, device="cuda:0", classes=[0], save=False, save_conf=False, verbose=False)
                road_mask = np.zeros((frame.shape[0], frame.shape[1]), dtype=np.uint8)
                if seg_results and seg_results[0].masks is not None and seg_results[0].masks.data.numel() > 0:
                    road_mask_tensor = seg_results[0].masks.data[0]
                    road_mask = road_mask_tensor.cpu().numpy().astype(np.uint8)
                    road_mask = cv2.resize(road_mask, (frame.shape[1], frame.shape[0]))

                segmentation_overlay = np.zeros_like(frame)
                segmentation_overlay[:, :, 2] = road_mask * 255
                alpha = 0.3
                frame_with_mask = cv2.addWeighted(frame, 1, segmentation_overlay, alpha, 0)

                # Vehicle detection
                detect_results = model_vehicles.track(frame_with_mask, device="cuda:0", conf=0.2, classes=[1, 2, 3], save=False, save_conf=False, verbose=False, persist=True)
                vehicle_classes = []
                for detect_result in detect_results:
                    boxes = detect_result.boxes
                    ids = boxes.id.cpu().numpy().astype(int) if boxes.id is not None else []

                    for box, id in zip(boxes, ids):
                        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Extract coordinates
                        object_bbox = road_mask[y1:y2, x1:x2]  # Determine the mask intersection

                        if np.any(object_bbox):  # If part of the box is within the mask
                            class_id = int(box.cls[0])
                            color = class_colors.get(class_id, (0, 0, 0))

                            # Add the track ID to the set to ensure uniqueness
                            unique_track_ids.add(id)

                            # Draw and label the detected vehicle within the mask
                            cv2.rectangle(frame_with_mask, (x1, y1), (x2, y2), color, 2)
                            label = f"{detect_result.names[class_id]}"
                            cv2.putText(frame_with_mask, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                            vehicle_classes.append(detect_result.names[class_id])

                total_current_vehicles_count = len(vehicle_classes)
                final_result = Calculate_crowding_rate(total_current_vehicles_count)
                total_vehicles_count = len(unique_track_ids)
                allTrafficData = {
                    "Capacity": Capacity_number,
                    "Number_of_Current_Vehicles": total_current_vehicles_count,
                    "final_result": final_result,
                    "Number_of_total_vehicles": total_vehicles_count,
                }

                # Write the traffic data to a JSON file
                with open(TRAFFIC_DATA_FILE, 'w') as json_file:
                    json.dump(allTrafficData, json_file)

            elif trigg == 2:  # Send data to the database and stop detection
                add_drone(total_vehicles_count, final_result)
                trigg = 0  # Reset trigg to default state to stop detection

            # Always encode and send the frame
            ret, jpeg = cv2.imencode('.jpg', frame_with_mask if trigg == 1 else frame)
            if not ret:
                continue

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')


def add_drone(total_vehicles_count, final_result):
    # Create a new Drone instance and save it to the database
    drone = Drone(total=total_vehicles_count, status=final_result)
    drone.save()

def get_value(request):
    # Check if the JSON file exists
    if not os.path.exists(TRAFFIC_DATA_FILE):
        return JsonResponse({'error': 'Data not available yet'}, status=404)

    # Read the traffic data from the JSON file
    with open(TRAFFIC_DATA_FILE, 'r') as json_file:
        allTrafficData = json.load(json_file)

    return JsonResponse({'value': allTrafficData})
