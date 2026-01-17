from rest_framework import viewsets
from .models import Blog, Category
from .serializers import BlogSerializer, CategorySerializer
from django.http import JsonResponse

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

def health(request):
    return JsonResponse({"status":"ok"})