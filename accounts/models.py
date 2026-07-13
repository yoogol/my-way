from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    birth_datetime = models.DateTimeField(null=True, blank=True)
