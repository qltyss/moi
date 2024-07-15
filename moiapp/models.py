from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    status = models.CharField(max_length=10, default='white')
    image = models.CharField(max_length=250)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WrongParking(models.Model):
    car_model = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    plate_text = models.CharField(max_length=20)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.car_model

class Drone(models.Model):
    total = models.CharField(max_length=100)
    status = models.CharField(max_length=20)   
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.status  # Changed from owner_name to status

class DetectionLog(models.Model):
    emp = models.ForeignKey(Employee, on_delete=models.CASCADE)
    plate_text = models.CharField(max_length=20)
    time = models.DateTimeField(auto_now_add=True)  # Adjusted to match your requirement
    car_color = models.CharField(max_length=30)
    car_model = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.plate_text} - {self.time}"

