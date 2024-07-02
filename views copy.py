
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import User
import secrets 
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password


def index(request):
    return render(request, 'index.html')

def signup(request):
    return render(request, 'signup.html')

def drone(request):
    return render(request, 'drone.html')

def amr(request):
    return render(request, 'amr.html')

def addface(request):
    return render(request, 'addface.html')






# def signin_view(request):
#     if request.method == 'POST':
#         # Parse JSON data from the request
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')

#         # Find the user by email
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             user = None

#         # Check if user exists and verify password
#         if user and check_password(password, user.password):
#             # Return a JSON response indicating successful sign-in
#             return JsonResponse({'user': {'remember_token': user.remember_token}})
#         else:
#             # Return a JSON response with an error message
#             return JsonResponse({'error': 'Invalid email or password.'}, status=400)

#     # Return a JSON response with an error message if the request method is not POST
#     return JsonResponse({'error': 'Invalid request method.'}, status=405)

    
# def create_user_view(request):
#     if request.method == 'POST':
#         # Parse JSON data from the request
#         data = json.loads(request.body)
#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         # Check if the email is already taken
#         if User.objects.filter(email=email).exists():
#             return JsonResponse({'error': 'Email address is already in use.'}, status=400)

#         # Hash the password securely
#         hashed_password = make_password(password)

#         # Create the user
#         user = User.objects.create(name=name, email=email, password=hashed_password)

#         # Optionally, you can set other fields like email_verified_at, remember_token, etc. here

#         # Return a JSON response indicating successful user creation
#         return JsonResponse({'message': 'User created successfully!'})

#     # Return a JSON response with an error message if the request method is not POST
#     return JsonResponse({'error': 'Invalid request method.'}, status=405)