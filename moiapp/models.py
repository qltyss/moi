from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    numplate = models.CharField(max_length=100,null=True, blank=True)
    status = models.CharField(max_length=10, default='white')
    image = models.CharField(max_length=250)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WrongParking(models.Model):
    emp = models.ForeignKey(Employee, on_delete=models.CASCADE, default=14)
    car_model = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    plate_text = models.CharField(max_length=20)
    status = models.IntegerField(default=0)
    image = models.CharField(max_length=500)
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
    emp = models.ForeignKey(Employee, on_delete=models.CASCADE, default=14)
    plate_text = models.CharField(max_length=20)
    time = models.DateTimeField(auto_now_add=True)  
    car_color = models.CharField(max_length=30)
    car_model = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.plate_text} - {self.time}"


class TriggState(models.Model):
    value = models.IntegerField(default=0)

    @classmethod
    def get_value(cls):
        return cls.objects.first().value if cls.objects.exists() else 0

    @classmethod
    def set_value(cls, value):
        obj, created = cls.objects.get_or_create(id=1)
        obj.value = value
        obj.save()