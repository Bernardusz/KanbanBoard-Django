"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_nested import routers
from board.views import BoardViewSet
from column.views import ColumnViewSet
from task.views import TaskViewset

router = routers.DefaultRouter()
router.register(r'board', BoardViewSet)

boards_router = routers.NestedDefaultRouter(router, r'board', lookup='board')
boards_router.register(r'column', ColumnViewSet, basename='board-columns')

columns_router = routers.NestedDefaultRouter(boards_router, r'column', lookup='column')
columns_router.register(r'tasks', TaskViewset, basename='column-task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),
    path('api/', include(router.urls)),
    path('api/', include(boards_router.urls)),
    path('api/', include(columns_router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh')
]
