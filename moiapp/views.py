
import json
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
import cv2
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

import random
import string
from .models import Employee
from .models import WrongParking
from .models import CarPlate
from .models import Drone

from django.http import StreamingHttpResponse
from django.views.decorators import gzip
import requests
import base64
from django.utils.dateparse import parse_date
from datetime import date
from django.db.models import Count, Avg
import os

from django.contrib.auth.decorators import login_required

# Dania' Lib
from ultralytics.utils.plotting import Annotator
from ultralytics import YOLO
import numpy as np
import torch

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


import time





# from django.http import JsonResponse
# from django.db.models import Count, Avg
# from .models import Employee, WrongParking, Drone



# def dashboard_data(request):
#     # Get start and end dates from request parameters
#     start_date = request.GET.get('start_date', '')
#     end_date = request.GET.get('end_date', '')

#     # Construct the response data
#     response_data = {
#         'person': 0,
#         'wrongparking': 0,
#         'drone': 0,
#         'white': 0,
#         'black': 0,
#         'unknown': 0
#     }

#     # Check if both start and end dates are provided
#     if start_date and end_date:
#         # Perform filtering based on start and end dates
#         total_employees = Employee.objects.filter(time__range=[start_date, end_date]).count()
#         wrongparking_count = WrongParking.objects.filter(time__range=[start_date, end_date]).count()
#         drone_count = Drone.objects.filter(time__range=[start_date, end_date]).count()
#         drone_avg = Drone.objects.filter(time__range=[start_date, end_date]).aggregate(Avg('total'))['total__avg']
#         status_counts = Employee.objects.filter(time__range=[start_date, end_date]).values('status').annotate(count=Count('status'))
#     elif start_date:
#         # If only start date is provided, use it as end date and perform filtering
#         total_employees = Employee.objects.filter(time=start_date).count()
#         wrongparking_count = WrongParking.objects.filter(time=start_date).count()
#         drone_count = Drone.objects.filter(time=start_date).count()
#         drone_avg = Drone.objects.filter(time=start_date).aggregate(Avg('total'))['total__avg']
#         status_counts = Employee.objects.filter(time=start_date).values('status').annotate(count=Count('status'))
#     else:
#         # If no dates are provided, get overall counts
#         total_employees = Employee.objects.count()
#         wrongparking_count = WrongParking.objects.count()
#         drone_count = Drone.objects.count()
#         drone_avg = Drone.objects.aggregate(Avg('total'))['total__avg']
#         status_counts = Employee.objects.values('status').annotate(count=Count('status'))

#     # Update the response dictionary with actual counts from the queries
#     response_data['person'] = total_employees
#     response_data['wrongparking'] = wrongparking_count
#     response_data['drone'] = drone_avg or 0

#     for entry in status_counts:
#         response_data[entry['status']] = entry['count']

#     return JsonResponse(response_data)



from django.http import JsonResponse
from django.db.models import Count, Sum
from .models import Employee, WrongParking, Drone  # Adjust import according to your project structure

# def dashboard_data(request):
#     # Get start and end dates from request parameters
#     start_date = request.GET.get('start_date', '')
#     end_date = request.GET.get('end_date', '')

#     # Construct the response data
#     response_data = {
#         'person': 0,
#         'wrongparking': 0,
#         'drone': 0,
#         'white': 0,
#         'black': 0,
#         'unknown': 0
#     }

#     # Check if both start and end dates are provided
#     if start_date and end_date:
#         # Perform filtering based on start and end dates
#         total_employees = Employee.objects.filter(time__range=[start_date, end_date]).count()
#         wrongparking_count = WrongParking.objects.filter(time__range=[start_date, end_date]).count()
#         drone_total = Drone.objects.filter(time__range=[start_date, end_date]).aggregate(total_sum=Sum('total'))['total_sum']
#         status_counts = Employee.objects.filter(time__range=[start_date, end_date]).values('status').annotate(count=Count('status'))
#     elif start_date:
#         # If only start date is provided, use it as end date and perform filtering
#         total_employees = Employee.objects.filter(time=start_date).count()
#         wrongparking_count = WrongParking.objects.filter(time=start_date).count()
#         drone_total = Drone.objects.filter(time=start_date).aggregate(total_sum=Sum('total'))['total_sum']
#         status_counts = Employee.objects.filter(time=start_date).values('status').annotate(count=Count('status'))
#     else:
#         # If no dates are provided, get overall counts
#         total_employees = Employee.objects.count()
#         wrongparking_count = WrongParking.objects.count()
#         drone_total = Drone.objects.aggregate(total_sum=Sum('total'))['total_sum']
#         status_counts = Employee.objects.values('status').annotate(count=Count('status'))

#     # Update the response dictionary with actual counts from the queries
#     response_data['person'] = total_employees
#     response_data['wrongparking'] = wrongparking_count
#     response_data['drone'] = drone_total or 0

#     for entry in status_counts:
#         response_data[entry['status']] = entry['count']

#     return JsonResponse(response_data)

from datetime import datetime, timedelta

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
        'white': 0,
        'black': 0,
        'unknown': 0
    }

    if start_date and end_date:
        # Perform filtering based on start and end dates
        total_employees = Employee.objects.filter(time__gte=start_date, time__lt=end_date).count()
        wrongparking_count = WrongParking.objects.filter(time__gte=start_date, time__lt=end_date).count()
        drone_total = Drone.objects.filter(time__gte=start_date, time__lt=end_date).aggregate(total_sum=Sum('total'))['total_sum']
        status_counts = Employee.objects.filter(time__gte=start_date, time__lt=end_date).values('status').annotate(count=Count('status'))
    elif start_date:
        # If only start date is provided, use it as end date and perform filtering
        total_employees = Employee.objects.filter(time=start_date).count()
        wrongparking_count = WrongParking.objects.filter(time=start_date).count()
        drone_total = Drone.objects.filter(time=start_date).aggregate(total_sum=Sum('total'))['total_sum']
        status_counts = Employee.objects.filter(time=start_date).values('status').annotate(count=Count('status'))
    else:
        # If no dates are provided, get overall counts
        total_employees = Employee.objects.count()
        wrongparking_count = WrongParking.objects.count()
        drone_total = Drone.objects.aggregate(total_sum=Sum('total'))['total_sum']
        status_counts = Employee.objects.values('status').annotate(count=Count('status'))

    # Update the response dictionary with actual counts from the queries
    response_data['person'] = total_employees
    response_data['wrongparking'] = wrongparking_count
    response_data['drone'] = drone_total or 0

    for entry in status_counts:
        response_data[entry['status']] = entry['count']

    return JsonResponse(response_data)




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
    api_endpoint = "http://192.168.100.110:3005/face_recognition"
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
    cap = cv2.VideoCapture(0)

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
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()

        # Filter and order by the time field in descending order
        wrongparking = WrongParking.objects.filter(time__date=query_date).order_by('-time').values()
        return JsonResponse(list(wrongparking), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



def carplate(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()

        carplate = CarPlate.objects.filter(time__date=query_date).order_by('-time').values()
        return JsonResponse(list(carplate), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

def get_employee_info(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()

        # Filter employees by the date part of the datetime field
        employees = Employee.objects.filter(time__date=query_date).values()
        # print(employees)
        return JsonResponse(list(employees), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


from django.db.models import Max
def dashboard_latest_records(request):
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

        # Prepare the response data
        traffic = [entry['total'] for entry in today_traffic]
        time = [entry['time'].strftime("%H:%M") for entry in today_traffic]

        response_data = {
            'traffic': traffic,
            'time': time
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

def drone_trafic(request):
    if request.method == 'GET':
        date_str = request.GET.get('date')
        if date_str:
            query_date = parse_date(date_str)
        else:
            query_date = date.today()

        # Filter drones by the date part of the datetime field
        today_traffic = Drone.objects.filter(time__date=query_date).values('total', 'time')

        # Prepare the response data
        traffic = [entry['total'] for entry in today_traffic]
        time = [entry['time'].strftime("%H:%M") for entry in today_traffic]

        response_data = {
            'traffic': traffic,
            'time': time
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

from django.core.files.base import ContentFile
from django.conf import settings
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

from django.http import HttpResponse
import re


# def update_settings(request):

#     js_file_path = os.path.join(settings.BASE_DIR, 'moiapp', 'static', 'assets', 'js', 'theme', 'app.init.js')
    
#     # Check if the file exists
#     if not os.path.exists(js_file_path):
#         return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

#     try:
#         # Read the file content
#         with open(js_file_path, 'r') as file:
#             content = file.read()

#         # Replace Direction: "rtl" with Direction: "ltr"
#         updated_content = content.replace('Direction: "rtl"', 'Direction: "ltr"')

#         # Write the updated content back to the file
#         with open(js_file_path, 'w') as file:
#             file.write(updated_content)

#         return JsonResponse({'status': 'success', 'message': 'Successfully updated app.init.js'})
#     except Exception as e:
#         return JsonResponse({'status': 'error', 'message': f'Error updating file: {e}'}, status=500)


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

# def update_theme(request, newtheme):
#     # Validate direction
#     print(newtheme)
#     if newtheme not in ['dark', 'light']:
#         return JsonResponse({'status': 'error', 'message': "Direction should be 'ltr' or 'rtl'"}, status=400)

#     # Define the file path
#     js_file_path = os.path.join(settings.BASE_DIR, 'moiapp', 'static', 'assets', 'js', 'theme', 'app.init.js')

#     # Check if the file exists
#     if not os.path.exists(js_file_path):
#         return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

#     # Read and update the file content
#     try:
#         with open(js_file_path, 'r', encoding='utf-8') as file:
#             content = file.read()

#         # Determine the current direction and replace it
#         if 'Theme: "dark"' in content:
#             updated_content = content.replace('Theme: "dark"', f'Theme: "{newtheme}"')
#         elif 'Theme: "light"' in content:
#             updated_content = content.replace('Theme: "light"', f'Theme: "{newtheme}"')
#         else:
#             return JsonResponse({'status': 'error', 'message': 'Theme setting not found in file'}, status=400)

#         # Write the updated content back to the file
#         with open(js_file_path, 'w', encoding='utf-8') as file:
#             file.write(updated_content)

#         return JsonResponse({'status': 'success', 'message': 'Successfully updated app.init.js'})
#     except Exception as e:
#         return JsonResponse({'status': 'error', 'message': f'Error updating file: {e}'}, status=500)

    




def facestatus_count(request):
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




# def signin_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')

#         if not (email and password):
#             return JsonResponse({'message': 'All fields are required'}, status=400)

#         user = authenticate(request, username=email, password=password)

#         if user is not None:
#             login(request, user)

#             # Generate a remember token
#             remember_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))

#             user_details = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'name': user.first_name,
#                 'remember_token': remember_token,  # Corrected syntax here
#                 # Add more fields as needed
#             }

#             # Update user's remember token
#             user.remember_token = remember_token
#             user.save()

#             return JsonResponse({'message': 'User signed in successfully!', 'remember_token': remember_token, 'user': user_details})
#         else:
#             return JsonResponse({'message': 'Invalid credentials'})

#     return JsonResponse({'message': 'Method not allowed'})


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
cap = cv2.VideoCapture('12.mp4')
model_road = YOLO("models/moi2-m.pt")
model_vehicles = YOLO("models/yolov8l-seg.pt")
Capacity_number = 20
all_data = {"Capacity": Capacity_number, "Number_of_Current_Vehicles": 0, "final_result": None}
trigg = 0


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
    trigg = 0
    return JsonResponse({'value': trigg})

def Calculate_crowding_rate(number_of_vehicles):
    traffic = 0.80 * Capacity_number
    moderate_traffic = 0.50 * Capacity_number
    no_traffic = 0.25 * Capacity_number 

    final_result = "---"
    if number_of_vehicles >= traffic:
        final_result = "Heavy Traffic"
    elif number_of_vehicles <= moderate_traffic and number_of_vehicles >= no_traffic:
        final_result = "Moderate Traffic"
    elif number_of_vehicles <= no_traffic:
        final_result = "Light Traffic"

    return final_result

class_colors = {
    1: (255, 0, 0),  # Blue
    2: (13, 169, 29),  # Green
    3: (0, 0, 255),  # Red
    5: (255, 255, 0),  # Cyan
}

@csrf_exempt
@gzip.gzip_page
def video_feed_html(request):
    frame_skip = 5
    resize_scale = 0.5
    
    def generate_frames():
        global all_data, trigg
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

            if trigg == 1:
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
                detect_results = model_vehicles.track(frame_with_mask, conf=0.2, classes=[1, 2, 3, 5], save=False, save_conf=False, verbose=False, persist=True)
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
                print(unique_track_ids)
                total_vehicles_count = len(unique_track_ids)
                all_data = {
                    "Capacity": Capacity_number, 
                    "Number_of_Current_Vehicles": total_current_vehicles_count, 
                    "final_result": final_result,
                    "Number_of_total_vehicles": total_vehicles_count,  # Add the unique track IDs to all_data
                }

            # Always encode and send the frame
            ret, jpeg = cv2.imencode('.jpg', frame_with_mask if trigg == 1 else frame)
            if not ret:
                continue

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def get_value(request):
    global all_data, trigg
    print(trigg)
    if not all_data:
        return JsonResponse({'error': 'Data not available yet'}, status=404)
    return JsonResponse({'value': all_data})