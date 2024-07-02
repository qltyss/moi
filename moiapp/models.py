from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    status = models.CharField(max_length=10, default='white')
    image = models.CharField(max_length=250)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CarPlate(models.Model):
    owner_name = models.CharField(max_length=100)
    plate_text = models.CharField(max_length=20)
    car_model = models.CharField(max_length=300, default='unknown')  # New field
    car_color = models.CharField(max_length=30, default='unknown')   # New field
    status = models.CharField(max_length=10, default='white')
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.owner_name

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
        return self.owner_name